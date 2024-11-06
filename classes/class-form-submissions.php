<?php
/**
 * Form Submissions Setup.
 */
if (!defined('ABSPATH')) { exit; }

/**
 * Form Class.
 */
class Blockons_Form_Submissions {
    /**
     * Enabled state.
     */
    private $enabled = false;
    /**
     * Form Submission statuses.
     */
    private $statuses = array();

    /**
     * Constructor function.
     */
    public function __construct() {
		// Get options
		$options = get_option('blockons_options');
    
		// Check if we need to decode JSON
		if (is_string($options)) {
			$options = json_decode($options, true);
		}
	
		// Set enabled state
		$this->enabled = isset($options['contactforms']['save_to_dashboard']) 
			? (bool)$options['contactforms']['save_to_dashboard'] 
			: false;
	
        $this->statuses = array(
            'unread' => __('Unread', 'blockons'),
            'read' => __('Read', 'blockons'),
            'replied' => __('Replied', 'blockons'),
            'spam' => __('Spam', 'blockons')
        );

		// Only add hooks if enabled
		if ($this->enabled) {
			add_action('init', array($this, 'blockons_register_form_submissions_post_type'));
			add_action('add_meta_boxes', array($this, 'blockons_add_form_submission_meta_boxes'));
			add_action('manage_blockons_submission_posts_custom_column', array($this, 'blockons_manage_form_submission_columns'), 10, 2);
			add_filter('manage_blockons_submission_posts_columns', array($this, 'blockons_set_form_submission_columns'));
			add_filter('manage_edit-blockons_submission_sortable_columns', array($this, 'blockons_set_sortable_columns'));
			add_action('pre_get_posts', array($this, 'blockons_sort_columns'));
			add_action('save_post_blockons_submission', array($this, 'blockons_save_status_meta'), 10, 2);
		}
    }

	/**
     * Check if the feature is enabled.
     */
    public function is_enabled() {
        return $this->enabled;
    }

    /**
     * Register the form submissions post type.
     */
    public function blockons_register_form_submissions_post_type() {
        $labels = array(
            'name'                  => _x('Form Submissions', 'Post type general name', 'blockons'),
            'singular_name'         => _x('Form Submission', 'Post type singular name', 'blockons'),
            'menu_name'            => _x('Submissions', 'Admin Menu text', 'blockons'),
            'name_admin_bar'       => _x('Form Submission', 'Add New on Toolbar', 'blockons'),
            'view_items'           => __('View Submissions', 'blockons'),
            'all_items'            => __('All Submissions', 'blockons'),
            'search_items'         => __('Search Submissions', 'blockons'),
            'not_found'            => __('No submissions found.', 'blockons'),
            'not_found_in_trash'   => __('No submissions found in Trash.', 'blockons'),
        );

        $args = array(
            'labels'             => $labels,
            'public'             => false,
            'publicly_queryable' => false,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => false,
            'capability_type'    => 'post',
            'has_archive'        => false,
            'hierarchical'       => false,
            'menu_icon'          => 'dashicons-email-alt',
            'supports'           => array('title'),
            'menu_position'      => 105,
            'capabilities' => array(
                'create_posts' => 'do_not_allow', // Disable creation through admin
            ),
            'map_meta_cap' => true,
        );

        register_post_type('blockons_submission', $args);
    }

    /**
     * Add meta boxes to the form submission post type.
     */
    public function blockons_add_form_submission_meta_boxes() {
        add_meta_box(
            'blockons_submission_details',
            __('Form Submission Details', 'blockons'),
            array($this, 'blockons_render_details_meta_box'),
            'blockons_submission',
            'normal',
            'high'
        );

        add_meta_box(
            'blockons_submission_status',
            __('Submission Status', 'blockons'),
            array($this, 'blockons_render_status_meta_box'),
            'blockons_submission',
            'side',
            'default'
        );
    }

    /**
     * Render the status meta box.
     */
    public function blockons_render_status_meta_box($post) {
        wp_nonce_field('save_submission_status', 'submission_status_nonce');
        $current_status = get_post_meta($post->ID, '_submission_status', true);
        if (empty($current_status)) {
            $current_status = 'unread';
        }
        ?>
        <select name="submission_status" id="submission_status" style="width: 100%;">
            <?php foreach ($this->statuses as $value => $label) : ?>
                <option value="<?php echo esc_attr($value); ?>" <?php selected($current_status, $value); ?>>
                    <?php echo esc_html($label); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <?php
    }

    /**
     * Save the status meta data.
     */
    public function blockons_save_status_meta($post_id, $post) {
        // Security checks
        if (!isset($_POST['submission_status_nonce']) || 
            !wp_verify_nonce($_POST['submission_status_nonce'], 'save_submission_status')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Save status
        if (isset($_POST['submission_status'])) {
            $status = sanitize_text_field($_POST['submission_status']);
            if (array_key_exists($status, $this->statuses)) {
                update_post_meta($post_id, '_submission_status', $status);
            }
        }
    }

    /**
     * Render the details meta box.
     */
    public function blockons_render_details_meta_box($post) {
        // Get all the stored meta data
        $form_data = get_post_meta($post->ID, '_form_data', true);
        $form_id = get_post_meta($post->ID, '_form_id', true);
        $email_to = get_post_meta($post->ID, '_email_to', true);
        $submission_date = get_post_meta($post->ID, '_submission_date', true);
        $ip_address = get_post_meta($post->ID, '_ip_address', true);
        $page_url = get_post_meta($post->ID, '_page_url', true);

        // Mark as read if it's unread
        if (get_post_meta($post->ID, '_submission_status', true) === 'unread') {
            update_post_meta($post->ID, '_submission_status', 'read');
        }

        ?>
        <div class="form-submission-details">
            <table class="form-table form-details">
                <?php
                if (is_array($form_data) && !empty($form_data)) {
					foreach ($form_data as $field) {
						if (isset($field['label']) || isset($field['name'])) {
							$label = isset($field['label']) ? $field['label'] : $field['name'];
							?>
							<tr>
								<th><label><?php echo esc_html($label); ?>:</label></th>
								<td>
									<?php 
									if (isset($field['type']) && $field['type'] === 'textarea') {
										echo nl2br(esc_html($field['value']));
									} else {
										echo esc_html($field['value']); 
									}
									?>
								</td>
							</tr>
							<?php
						}
					}
				}
                ?>
            </table>

			<div class="blockons-form-details">
				<h3><?php esc_html_e('Form Details', 'blockons'); ?></h3>
				<table class="form-table">
					<tr>
						<th><label><?php esc_html_e('Form Name:', 'blockons'); ?></label></th>
						<td><?php echo esc_html($form_id); ?></td>
					</tr>
					<tr>
						<th><label><?php esc_html_e('Sent To:', 'blockons'); ?></label></th>
						<td><?php echo esc_html($email_to); ?></td>
					</tr>
					<tr>
						<th><label><?php esc_html_e('Page URL:', 'blockons'); ?></label></th>
						<td><?php echo esc_url($page_url); ?></td>
					</tr>
                    <tr>
						<th><label><?php esc_html_e('IP Address:', 'blockons'); ?></label></th>
						<td><?php echo esc_html($ip_address); ?></td>
					</tr>
                    <tr>
						<th><label><?php esc_html_e('Submission Date:', 'blockons'); ?></label></th>
						<td><?php echo esc_html($submission_date); ?></td>
					</tr>
				</table>
			</div>
        </div>
        <?php
    }

    /**
     * Set the columns for the form submissions post type.
     */
    public function blockons_set_form_submission_columns($columns) {
        $columns = array(
            'cb' => '<input type="checkbox" />',
            'title' => __('Title', 'blockons'),
            'form_name' => __('Form', 'blockons'),
            'email_to' => __('Sent To', 'blockons'),
            'submission_date' => __('Date', 'blockons'),
            'status' => __('Status', 'blockons')
        );
        return $columns;
    }

    /**
     * Manage the columns for the form submissions post type.
     */
    public function blockons_manage_form_submission_columns($column, $post_id) {
        switch ($column) {
            case 'form_name':
                echo esc_html(get_post_meta($post_id, '_form_id', true));
                break;
            case 'email_to':
                echo esc_html(get_post_meta($post_id, '_email_to', true));
                break;
            case 'submission_date':
                $date = get_post_meta($post_id, '_submission_date', true);
                echo esc_html($date);
                break;
            case 'status':
                $status = get_post_meta($post_id, '_submission_status', true);
                $status_label = isset($this->statuses[$status]) ? $this->statuses[$status] : $this->statuses['unread'];
                echo esc_html($status_label);
                break;
        }
    }

    /**
     * Set the sortable columns for the form submissions post type.
     */
    public function blockons_set_sortable_columns($columns) {
        $columns['form_name'] = 'form_name';
        $columns['submission_date'] = 'submission_date';
        $columns['status'] = 'status';
        return $columns;
    }

    /**
     * Sort the columns for the form submissions post type.
     */
    public function blockons_sort_columns($query) {
        if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== 'blockons_submission') {
            return;
        }

        $orderby = $query->get('orderby');

        switch ($orderby) {
            case 'form_name':
                $query->set('meta_key', '_form_id');
                $query->set('orderby', 'meta_value');
                break;
            case 'submission_date':
                $query->set('meta_key', '_submission_date');
                $query->set('orderby', 'meta_value');
                break;
            case 'status':
                $query->set('meta_key', '_submission_status');
                $query->set('orderby', 'meta_value');
                break;
        }
    }
}

// Initialize the class
new Blockons_Form_Submissions();
