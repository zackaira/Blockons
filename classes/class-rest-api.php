<?php
/*
 * Create Custom Rest API Endpoints
 */
class Blockons_WC_Rest_Routes {
	public function __construct() {
		add_action('rest_api_init', [$this, 'blockons_create_rest_routes']);
		
		// AJAX handlers for quickview functionality
		add_action('wp_ajax_blockons_clear_cart_notices', [$this, 'blockons_clear_cart_notices']);
		add_action('wp_ajax_nopriv_blockons_clear_cart_notices', [$this, 'blockons_clear_cart_notices']);
	}

	/*
	 * Create REST API routes for get & save
	 */
	public function blockons_create_rest_routes() {
		register_rest_route('blcns/v1', '/settings', [
			'methods' => 'GET',
			'callback' => [$this, 'blockons_get_settings'],
			'permission_callback' => [$this, 'blockons_get_settings_permission'],
		]);
		register_rest_route('blcns/v1', '/settings', [
			'methods' => 'POST',
			'callback' => [$this, 'blockons_save_settings'],
			'permission_callback' => [$this, 'blockons_save_settings_permission'],
		]);
		register_rest_route('blcns/v1', '/delete', [
			'methods' => 'DELETE',
			'callback' => [$this, 'blockons_delete_settings'],
			'permission_callback' => [$this, 'blockons_save_settings_permission'],
		]);
		
		if ( Blockons_Admin::blockons_is_plugin_active( 'woocommerce.php' ) ) {
			register_rest_route( 'blcns/v1', '/products', [
				'methods' => 'GET',
				'callback' => [$this, 'blockons_get_wc_products'],
				'permission_callback' => [$this, 'blockons_get_settings_permission'],
			]);
			register_rest_route( 'blcns/v1', '/product/(?P<id>\d+)', [
				'methods' => 'GET',
				'callback' => [$this, 'blockons_get_wc_product_by_id'],
				'permission_callback' => [$this, 'blockons_get_settings_permission'],
			]);

			// Quickview Product
			register_rest_route('blcns/v1', '/product-data/(?P<id>\d+)', [
				'methods' => 'GET',
				'callback' => [$this, 'blockons_get_product_data_by_id'],
				'permission_callback' => [$this, 'blockons_get_settings_permission'],
			]);
		}

		register_rest_route( 'blcns/v1', '/post/(?P<id>\d+)', [
			'methods' => 'GET',
			'callback' => [$this, 'blockons_get_post_by_id'],
			'permission_callback' => [$this, 'blockons_get_settings_permission'],
		]);
		register_rest_route('blcns/v1', '/post-types', array(
			'methods' => 'GET',
			'callback' => [$this, 'blockons_get_all_post_types'],
			'permission_callback' => [$this, 'blockons_get_settings_permission'],
		));
		register_rest_route('blcns/v1', '/block-patterns', array(
			'methods' => 'GET',
			'callback' => [$this, 'blockons_get_modal_block_patterns'],
			'permission_callback' => [$this, 'blockons_get_settings_permission'],
		));

		// Get API Key(s)
		register_rest_route('blcns/v1', '/get-api-key', array(
			'methods' => 'GET',
			'callback' => [$this, 'blockons_get_api_key'],
			'permission_callback' => '__return_true',
			'args' => array(
				'key_type' => array(
					'required' => true,
					'type' => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		));

		// Contact Form Block - Form Submission Endpoint
		register_rest_route('blcns/v1', '/submit-form', array(
            'methods' => 'POST',
            'callback' => [$this, 'blockons_handle_contact_form_submission'],
            'permission_callback' => '__return_true', // Allow public access
        ));

		// Add Excerpt to Search Results
		register_rest_field( 'search-result', 'extras', array(
			'get_callback' => function ( $post_arr ) {
				$post_id =  $post_arr['id'];

				if ($post_arr['subtype'] == 'product') {
					$product = wc_get_product($post_id);

					$extras = array(
						"image" => get_the_post_thumbnail_url($post_id, 'thumbnail'),
						"excerpt" => $product->get_short_description(),
						"price" => $product->get_price_html(),
						"sku" => $product->get_sku(),
					);
					return (object)$extras;
				} else {
					$extras = array(
						"image" => get_the_post_thumbnail_url($post_id, 'thumbnail'),
						"excerpt" => get_the_excerpt($post_id),
					);
					return (object)$extras;
				}
			},
		) );
	}

	public function blockons_get_product_data_by_id( $request ) {
        try {
            $product_id = intval( $request->get_param( 'id' ) );
            $product = wc_get_product($product_id);

            if ( ! $product ) {
                return new WP_REST_Response( [ 'message' => 'Product not found.' ], 404 );
            }

            // Get gallery images
            $gallery_images = [];
            $image_ids = array_merge( [$product->get_image_id()], $product->get_gallery_image_ids() );
            
            foreach ( $image_ids as $image_id ) {
                if ( $image_id ) {
                    $gallery_images[] = [
                        'full' => wp_get_attachment_image_url( $image_id, 'full' ),
                        'thumbnail' => wp_get_attachment_image_url( $image_id, 'thumbnail' ),
                        'alt' => get_post_meta( $image_id, '_wp_attachment_image_alt', true ) ?: $product->get_name()
                    ];
                }
            }

            // Get product categories
            $categories = [];
            $category_terms = get_the_terms( $product_id, 'product_cat' );
            if ( $category_terms && ! is_wp_error( $category_terms ) ) {
                foreach ( $category_terms as $term ) {
                    $categories[] = [
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug
                    ];
                }
            }

            // Get product tags
            $tags = [];
            $tag_terms = get_the_terms( $product_id, 'product_tag' );
            if ( $tag_terms && ! is_wp_error( $tag_terms ) ) {
                foreach ( $tag_terms as $term ) {
                    $tags[] = [
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug
                    ];
                }
            }

            // Prepare the product data for the REST response.
            $response = [
                'id'           => $product->get_id(),
                'type'         => $product->get_type(),
                'title'        => $product->get_name(),
                'short_desc'   => $product->get_short_description(),
                'description'  => $product->get_description(),
                'price'        => $product->get_price_html(),
                'sku'          => $product->get_sku(),
                'image'        => wp_get_attachment_image_url( $product->get_image_id(), 'full' ),
                'gallery_images' => $gallery_images,
                'permalink'    => $product->get_permalink(),
                'categories'   => $categories,
                'tags'         => $tags,
                'add_to_cart_form' => $this->get_add_to_cart_form($product),
            ];

            return new WP_REST_Response( $response, 200 );

        } catch ( Exception $e ) {
            return new WP_REST_Response( [ 'message' => 'An error occurred while fetching product data: ' . $e->getMessage() ], 500 );
        }
    }

    private function get_add_to_cart_form($product) {
        ob_start();
        try {
            global $post;
            $post = get_post($product->get_id());
            setup_postdata($post);
            woocommerce_template_single_add_to_cart();
            wp_reset_postdata();
        } catch ( Exception $e ) {
            error_log( 'Error in get_add_to_cart_form: ' . $e->getMessage() );
        }
        $form_html = ob_get_clean();
        
        return $form_html;
    }

	/**
	 * Get saved options from database
	 */
	public function blockons_get_settings() {
		$blockonsPluginOptions = get_option('blockons_options');

		if (!$blockonsPluginOptions)
			return;

		return rest_ensure_response($blockonsPluginOptions);
	}

	/**
	 * Allow permissions for get options
	 */
	public function blockons_get_settings_permission() {
		return true;
	}

	/**
	 * Save settings as JSON string
	 */
	public function blockons_save_settings() {
		$req = file_get_contents('php://input');
		$reqData = json_decode($req, true);

		update_option('blockons_options', $reqData['blockonsOptions']);

		return rest_ensure_response('Success!');
	}

	/**
	 * Set save permissions for admin users
	 */
	public function blockons_save_settings_permission() {
		return current_user_can('publish_posts') ? true : false;
	}

	/**
	 * Set save permissions for admin users
	 */
	public function blockons_admin_permission() {
		return current_user_can('manage_options') ? true : false;
	}

	/**
	 * Delete the plugin settings
	 */
	public function blockons_delete_settings() {
		delete_option('blockons_options');

		return rest_ensure_response('Success!');
	}
	
	/**
	 * Get & Sort posts for 'Post Select' Component
	 */
	public function blockons_get_wc_products($request) {
		$all_products = array();

		$products = get_posts( array(
			'post_type' => 'product',
			'numberposts' => -1,
			'post_status' => 'publish',
	   	) );

		foreach ( $products as $product ) {
			$all_products[] = array(
				'value' => $product->ID,
				'label' => $product->post_title,
			);
		}

		return $all_products;
	}

	/**
	 * Get WC Product by ID
	 */
	function blockons_get_wc_product_by_id($request) {
		$product_id = esc_attr($request->get_param( 'id' ));
		$product = wc_get_product( $product_id );

		$product_image = wp_get_attachment_url( $product->get_image_id() );

		$product_data = array(
			'id' => $product->get_id(),
			'type' => $product->get_type(),
			'title' => $product->get_name(),
			'featured_media' => $product_image,
			'short_desc' => $product->get_short_description(),
			'content' => $product->get_description(),
			'price' => $product->get_price_html(),
			'permalink' => get_permalink( $product->get_id() ),
			'date_created' => $product->get_date_created(),
		);

		return $product_data;
	}

	/**
	 * Get Post by ID
	 */
	function blockons_get_post_by_id($request) {
		$post_id = esc_attr($request->get_param('id'));
		$post = get_post($post_id);
	
		if (!$post) {
			return new WP_Error('invalid_post_id', __('Invalid post ID.', 'blockons'), array('status' => 404));
		}
	
		// Check if post is private or draft - don't return details for these
		if (in_array($post->post_status, array('private', 'draft'))) {
			return new WP_Error('post_not_available', __('Post is not publicly available.', 'blockons'), array('status' => 403));
		}
	
		$post_thumbnail_id = get_post_thumbnail_id($post_id);
		$post_image = wp_get_attachment_url($post_thumbnail_id);
	
		$post_data = array(
			'id' => $post->ID,
			'title' => $post->post_title,
			'content' => $post->post_content,
			'excerpt' => $post->post_excerpt,
			'featured_media' => $post_image,
			'permalink' => get_permalink($post->ID),
			'date_created' => $post->post_date,
		);
	
		return $post_data;
	}

	/**
	 * Get All Post Types
	 */
	function blockons_get_all_post_types() {
		$post_types = get_post_types(['show_in_rest' => true], 'objects'); // Fetch post types exposed in REST
		$post_types_data = [];
	
		foreach ($post_types as $post_type) {
			if (!in_array($post_type->name, ['attachment', 'wp_template', 'wp_template_part', 'nav_menu_item', 'wp_block', 'wp_navigation'])) {
				$post_types_data[] = [
					'slug' => $post_type->name,
					'name' => $post_type->labels->singular_name
				];
			}
		}
	
		return $post_types_data;
	}

	/**
	 * Get Client API Keys
	 */
	function blockons_get_api_key(WP_REST_Request $request) {
		try {
			$key_type = $request->get_param('key_type');
			if (!$key_type) {
				return new WP_REST_Response(['error' => 'Key type is required'], 400);
			}

			$options = get_option('blockons_options');
			if (is_string($options)) {
				$options = json_decode($options, true);
			}
			
			// Check if reCAPTCHA is properly configured
			if ($key_type === 'recaptcha') {
				$recaptcha_enabled = isset($options['contactforms']['recaptcha']) && $options['contactforms']['recaptcha'];
				$has_key = isset($options['contactforms']['recaptcha_key']) && !empty($options['contactforms']['recaptcha_key']);
				
				if (!$recaptcha_enabled || !$has_key) {
					return new WP_REST_Response([
						'error' => 'reCAPTCHA is not properly configured',
						'details' => [
							'enabled' => $recaptcha_enabled,
							'has_key' => $has_key,
							'config_status' => [
								'has_contactforms' => isset($options['contactforms']),
								'has_recaptcha_setting' => isset($options['contactforms']['recaptcha']),
								'recaptcha_value' => $options['contactforms']['recaptcha'] ?? null,
							]
						]
					], 400);
				}

				return new WP_REST_Response([
					'api_key' => $options['contactforms']['recaptcha_key'],
					'success' => true
				], 200);
			}

			// Check if maps API key is properly configured
			if ($key_type === 'maps') {
				$has_key = isset($options['mapbox']['key']) && !empty($options['mapbox']['key']);
				
				if (!$has_key) {
					return new WP_REST_Response([
						'error' => 'Maps API key is not properly configured',
						'details' => [
							'has_key' => $has_key,
						]
					], 400);
				}

				return new WP_REST_Response([
					'api_key' => $options['mapbox']['key'],
					'success' => true
				], 200);
			}

			return new WP_REST_Response(['error' => 'Invalid key type'], 400);

		} catch (Exception $e) {
			return new WP_REST_Response([
				'error' => 'Internal server error',
				'message' => $e->getMessage()
			], 500);
		}
	}	

	/**
	 * Handle Form Submission for Contact Form Block
	 */
	public function blockons_handle_contact_form_submission($request) {
		$isPremium = (bool) blockons_fs()->can_use_premium_code__premium_only();
	
		try {
			// Initialize security manager
			$security = Blockons_Security_Manager::get_instance();
			// Get client IP address
			$ip_address = $this->get_client_ip();
	
			// Validate request data
			$form_data = $security->validate_request($request);
			if (is_wp_error($form_data)) {
				return $form_data;
			}

			// Inject the page title from JS
			$form_data['pageTitle'] = sanitize_text_field( $request->get_param('pageTitle', '') );
	
			$options = get_option('blockons_options');
			if (is_string($options)) {
				$options = json_decode($options, true);
			}
	
			// Verify reCAPTCHA if required
			if ($isPremium && $this->should_verify_recaptcha($options)) {
				if (empty($form_data['recaptchaToken'])) {
					return new WP_Error(
						'recaptcha_missing',
						__('reCAPTCHA token is missing', 'blockons'),
						array('status' => 400)
					);
				}
	
				$recaptcha_result = $this->verify_recaptcha($form_data['recaptchaToken'], $options);
				if (is_wp_error($recaptcha_result)) {
					return $recaptcha_result;
				}
			}
	
			// Apply filters only when handling form submission
			add_filter('wp_mail_from', [$this, 'blockons_custom_wp_mail_from']);
			add_filter('wp_mail_from_name', [$this, 'blockons_custom_wp_mail_from_name']);    
	
			// Handle file uploads if present
			if (!empty($_FILES)) {
				try {
					// Note: handle_file_uploads will update $form_data['fields'] with file info
					$uploads = $this->handle_file_uploads($form_data);
				} catch (Exception $e) {
					error_log('File upload error: ' . $e->getMessage());
					return new WP_Error(
						'upload_error',
						$e->getMessage(),
						array('status' => 400)
					);
				}
			}
	
			// Check submission rate
			if (!$security->check_submission_rate($ip_address, $form_data['formId'] ?? 'default')) {
				return new WP_Error(
					'rate_limit_exceeded',
					__('Too many submissions. Please try again later.', 'blockons'),
					array('status' => 429)
				);
			}
	
			// Check honeypot
			foreach ($form_data['fields'] as $field) {
				if (isset($field['name']) && $field['name'] === 'asite' && !empty($field['value'])) {
					return new WP_REST_Response([
						'success' => true,
						'message' => __('Form submitted successfully', 'blockons')
					], 200);
				}
			}
	
			// Validate recipient emails
			$to_emails = array_map('trim', explode(',', $form_data['emailTo']));
			$valid_emails = array_filter($to_emails, 'is_email');
	
			if (empty($valid_emails)) {
				return new WP_Error(
					'invalid_email',
					__('No valid recipient email addresses provided', 'blockons'),
					array('status' => 400)
				);
			}
	
			// Check if we're in development environment
			if ($this->is_development_environment()) {
				// Save submission if enabled
				if ($isPremium && $this->should_save_submission($options)) {
					$email_result = [
						'content' => $this->prepare_email_content($form_data),
						'headers' => $this->prepare_email_headers($form_data),
						'subject' => $this->get_email_subject($form_data),
						'dev_mode' => true
					];
					$this->save_form_submission($form_data, $email_result);
				}
	
				return new WP_REST_Response([
					'success' => true,
					'message' => __('Form submitted successfully (Development Mode)', 'blockons'),
					'dev_mode' => true
				], 200);
			}
	
			// Process submission for production
			$email_result = $this->process_form_submission($form_data, $valid_emails);
			if (is_wp_error($email_result)) {
				error_log('Email error: ' . $email_result->get_error_message());
				throw new Exception($email_result->get_error_message());
			}
	
			// Save submission if enabled
			if ($isPremium && $this->should_save_submission($options)) {
				$this->save_form_submission($form_data, $email_result);
			}
	
			// Remove filters immediately after sending the email
			remove_filter('wp_mail_from', [$this, 'blockons_custom_wp_mail_from']);
			remove_filter('wp_mail_from_name', [$this, 'blockons_custom_wp_mail_from_name']);    
	
			return new WP_REST_Response([
				'success' => true,
				'message' => __('Form submitted successfully', 'blockons')
			], 200);
	
		} catch (Exception $e) {
			error_log('Form submission error: ' . $e->getMessage());
			error_log('Error trace: ' . $e->getTraceAsString());
			return new WP_Error(
				'submission_error',
				$e->getMessage(),
				array('status' => 500)
			);
		}
	}

	/**
	 * Custom WP Mail "From" Email
	 */
	public function blockons_custom_wp_mail_from($email) {
		$admin_email = get_bloginfo('admin_email');
		$site_domain = parse_url(get_site_url(), PHP_URL_HOST);
		
		return is_email($admin_email) ? $admin_email : 'noreply@' . $site_domain;
	}

	/**
	 * Custom WP Mail "From" Name
	 */
	public function blockons_custom_wp_mail_from_name($name) {
		return get_bloginfo('name');
	}

	/**
	 * Check if reCAPTCHA verification should be performed
	 */
	private function should_verify_recaptcha($options) {
		return !empty($options['contactforms']['recaptcha']) && 
			!empty($options['contactforms']['recaptcha_key']) && 
			!empty($options['contactforms']['recaptcha_secret']) &&
			!$this->is_development_environment();
	}

	/**
	 * Verify reCAPTCHA token
	 */
	private function verify_recaptcha($token, $options) {
		if (empty($token)) {
			return new WP_Error(
				'recaptcha_missing',
				__('reCAPTCHA verification failed', 'blockons'),
				array('status' => 400)
			);
		}
	
		$response = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', [
			'body' => [
				'secret' => $options['contactforms']['recaptcha_secret'],
				'response' => $token
			]
		]);
	
		if (is_wp_error($response)) {
			error_log('reCAPTCHA verification error: ' . $response->get_error_message());
			return new WP_Error(
				'recaptcha_error',
				__('Failed to verify reCAPTCHA', 'blockons'),
				array('status' => 500)
			);
		}
	
		$body = json_decode(wp_remote_retrieve_body($response), true);
	
		if (!$body['success'] || ($body['score'] ?? 0) < 0.5) {
			return new WP_Error(
				'recaptcha_failed',
				__('reCAPTCHA verification failed', 'blockons'),
				array('status' => 400)
			);
		}
	
		return true;
	}	

	/**
	 * Process form submission and send email
	 */
	private function process_form_submission($form_data, $valid_emails) {
		try {
			// Prepare email components
			$email_content = $this->prepare_email_content($form_data);
			$headers = $this->prepare_email_headers($form_data);
			$subject = $this->get_email_subject($form_data);
			$emailRecipients = implode(', ', $valid_emails);
	
			// Check if we're in a development environment
			if ($this->is_development_environment()) {
				// Return success for development environment
				return [
					'content' => $email_content,
					'headers' => $headers,
					'subject' => $subject,
					'to' => $valid_emails,
					'dev_mode' => true
				];
			}

			// Send email
			$mail_sent = wp_mail($emailRecipients, $subject, $email_content, $headers);

			if (!$mail_sent) {
				$error = error_get_last();
				$error_message = ($error && isset($error['message'])) ? $error['message'] : 'Unknown error';
				error_log('Mail send failed. PHP error: ' . print_r($error, true));
				throw new Exception('Failed to send email: ' . $error_message);
			}
	
			return [
				'content' => $email_content,
				'headers' => $headers,
				'subject' => $subject,
				'to' => $valid_emails
			];
	
		} catch (Exception $e) {
			error_log('Process form submission error: ' . $e->getMessage());
			error_log('Stack trace: ' . $e->getTraceAsString());
			throw $e;
		}
	}

	/**
	 * Check if submissions should be saved
	 */
	private function should_save_submission($options) {
		return !empty($options['contactforms']['save_to_dashboard']);
	}

	/**
	 * Save form submission to database
	 */
	private function save_form_submission($form_data, $email_data) {
		if (!class_exists('Blockons_Form_Submissions')) {
			return new WP_Error('submissions_not_enabled', 'Form submissions storage is not enabled');
		}

		try {
			// Prepare submission title
			$title = $this->get_submission_title($form_data);

			// Create post
			$post_id = wp_insert_post([
				'post_title' => wp_strip_all_tags($title),
				'post_content' => $email_data['content'],
				'post_status' => 'publish',
				'post_type' => 'blockons_submission'
			]);

			if (is_wp_error($post_id)) {
				throw new Exception($post_id->get_error_message());
			}

			// Save submission metadata
			$this->save_submission_metadata($post_id, $form_data, $email_data);

			return $post_id;

		} catch (Exception $e) {
			return new WP_Error('save_failed', $e->getMessage());
		}
	}

	/**
	 * Handle file uploads
	 */
	private function handle_file_uploads(&$form_data) {
		try {
			$uploads = [];
			$upload_dir = wp_upload_dir();
			$form_upload_dir = $upload_dir['basedir'] . '/blockons/form-uploads/' . date('Y/m');
	
			// Create necessary directories
			$dirs = [
				$upload_dir['basedir'] . '/blockons',
				$upload_dir['basedir'] . '/blockons/form-uploads',
				$form_upload_dir
			];
	
			foreach ($dirs as $dir) {
				if (!wp_mkdir_p($dir)) {
					throw new Exception(__('Failed to create upload directory', 'blockons'));
				}
			}
	
			// Track processed files
			$processed_files = [];
	
			foreach ($_FILES as $key => $file) {
				// Skip if already processed or has error
				if (in_array($key, $processed_files) || $file['error'] !== UPLOAD_ERR_OK) {
					continue;
				}
				
				try {
					// Basic validation
					$max_size = isset($form_data['maxFileSize']) 
						? intval($form_data['maxFileSize']) * 1024 * 1024 
						: 5 * 1024 * 1024;
	
					if ($file['size'] > $max_size) {
						throw new Exception(sprintf(
							/* translators: %s: the maximum file size allowed (e.g., "2 MB") */
							__('File size exceeds limit of %s', 'blockons'),
							size_format($max_size)
						));
					}
	
					// Check MIME type
					$allowed_types = [
						'application/pdf' => 'pdf',
						'application/msword' => 'doc',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
						'text/plain' => 'txt',
						'image/jpeg' => 'jpg',
						'image/png' => 'png',
						'image/gif' => 'gif',
						'image/webp' => 'webp',
						'video/mp4' => 'mp4',
						'audio/mpeg' => 'mp3',
						'audio/wav' => 'wav'
					];
	
					// Get MIME type
					if (!file_exists($file['tmp_name'])) {
						error_log('Temp file does not exist: ' . $file['tmp_name']);
						continue;
					}
	
					$finfo = finfo_open(FILEINFO_MIME_TYPE);
					$mime_type = finfo_file($finfo, $file['tmp_name']);
					finfo_close($finfo);
	
					if (!isset($allowed_types[$mime_type])) {
						throw new Exception(__('Invalid file type', 'blockons') . ': ' . $mime_type);
					}
	
					// Prepare filename
					$file_extension = $allowed_types[$mime_type];
					$filename = sanitize_file_name(pathinfo($file['name'], PATHINFO_FILENAME) . '.' . $file_extension);
					$unique_filename = wp_unique_filename($form_upload_dir, $filename);
					$upload_path = $form_upload_dir . '/' . $unique_filename;
	
					if (@move_uploaded_file($file['tmp_name'], $upload_path)) {
						@chmod($upload_path, 0644);
	
						$file_url = $upload_dir['baseurl'] . '/blockons/form-uploads/' . date('Y/m') . '/' . $unique_filename;
						
						// Store upload info
						$file_data = array(
							'url' => esc_url($file_url),
							'file' => $upload_path,
							'type' => $mime_type,
							'name' => $filename,
							'size' => $file['size'],
							'originalName' => $file['name']
						);
						
						$uploads[$key] = $file_data;
	
						// Update the corresponding field in form_data
						if (!empty($form_data['fields'])) {
							foreach ($form_data['fields'] as &$field) {
								if ($field['type'] === 'file' && $field['name'] === $key) {
									// Update the field value with file information
									$field['value'] = array(
										'name' => $filename,
										'size' => $file['size'],
										'type' => $mime_type,
										'url' => esc_url($file_url)
									);
									break;
								}
							}
						}
	
						$processed_files[] = $key;
					} else {
						$upload_error = error_get_last();
						throw new Exception(__('Failed to move uploaded file', 'blockons'));
					}
	
				} catch (Exception $e) {
					throw $e;
				}
			}
	
			return $uploads;
	
		} catch (Exception $e) {
			throw $e;
		}
	}
	
	/**
	 * Cleanup old uploaded files
	 */
	private function cleanup_old_uploads($days = 30) {
		$upload_dir = wp_upload_dir();
		$base_dir = $upload_dir['basedir'] . '/blockons/form-uploads';
		
		if (!is_dir($base_dir)) {
			return;
		}
	
		$now = time();
		$max_age = $days * 86400; // Convert days to seconds
	
		$it = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator($base_dir, RecursiveDirectoryIterator::SKIP_DOTS),
			RecursiveIteratorIterator::CHILD_FIRST
		);
	
		foreach ($it as $file) {
			if ($file->isFile()) {
				if ($now - $file->getMTime() >= $max_age) {
					@unlink($file->getRealPath());
				}
			}
		}
	
		// Clean up empty directories
		$it->rewind();
		foreach ($it as $file) {
			if ($file->isDir() && !glob($file->getRealPath() . '/*')) {
				@rmdir($file->getRealPath());
			}
		}
	}

	/**
	 * Prepare email content
	 */
	private function prepare_email_content($form_data) {
		$compiled_message = '';
	
		// Process form fields
		if (!empty($form_data['fields']) && is_array($form_data['fields'])) {
			foreach ($form_data['fields'] as $field) {
				if (empty($field['name']) || $field['name'] === 'asite') {
					continue;
				}
	
				$label = !empty($field['label']) ? $field['label'] : $field['name'];
				$type = !empty($field['type']) ? $field['type'] : 'text';
	
				// Skip empty fields
				if (empty($field['value']) && $field['value'] !== '0' && $field['value'] !== false) {
					continue;
				}
	
				switch ($type) {
					case 'checkbox_group':
						if (is_array($field['value']) && !empty($field['value'])) {
							$values = array_map(function($item) {
								return isset($item['label']) ? esc_html($item['label']) : esc_html($item['value']);
							}, $field['value']);
							$compiled_message .= sprintf(
								"%s: %s\n",
								esc_html($label),
								implode(', ', $values)
							);
						} elseif ($field['required']) {
							$compiled_message .= sprintf(
								"%s: %s\n",
								esc_html($label),
								__('No options selected', 'blockons')
							);
						}
						break;
	
					case 'file':
						if (!empty($field['value'])) {
							// Handle file value as array
							if (is_array($field['value'])) {
								$compiled_message .= sprintf(
									"%s: %s\n",
									esc_html($label),
									esc_url($field['value']['name'])
								);
								
								if (!empty($field['value']['size'])) {
									$compiled_message .= sprintf(
										"File Size: %s\n",
										size_format($field['value']['size'])
									);
								}
								
								if (!empty($field['value']['type'])) {
									$compiled_message .= sprintf(
										"File Type: %s\n",
										esc_html($field['value']['type'])
									);
								}
							} else {
								// Handle file value as string (URL)
								$compiled_message .= sprintf(
									"%s: %s\n",
									esc_html($label),
									esc_url($field['value'])
								);
							}
						}
						break;
	
					case 'checkbox':
						$compiled_message .= sprintf(
							"%s: %s\n",
							esc_html($label),
							$field['value'] ? __('Yes', 'blockons') : __('No', 'blockons')
						);
						break;
	
					case 'radio_group':
						if (!empty($field['value'])) {
							$value = is_array($field['value']) ? 
								(isset($field['value']['label']) ? 
									esc_html($field['value']['label']) : 
									esc_html($field['value']['value'])) : 
								esc_html($field['value']);
							
							$compiled_message .= sprintf(
								"%s: %s\n",
								esc_html($label),
								$value
							);
						}
						break;
						
						case 'textarea':
							$compiled_message .= sprintf(
								"%s:\n%s\n\n",
								esc_html($label),
								html_entity_decode(str_replace('<br />', "\n", $field['value']), ENT_QUOTES, 'UTF-8')
							);
							break;
	
					default:
						$compiled_message .= sprintf(
							"%s: %s\n",
							esc_html($label),
							esc_html($field['value'])
						);
				}
			}
		}
	
		// Add metadata if requested
		if (!empty($form_data['includeMetadata'])) {
			$compiled_message .= "\n" . $this->get_metadata_content();
		}
	
		return $compiled_message;
	}

	/**
	 * Prepare email headers
	 */
	private function prepare_email_headers($form_data) {
		try {
			$headers = array();
			
			// Set content type
			$headers[] = 'Content-Type: text/plain; charset=UTF-8';
        
			// Get site domain and admin email
			$site_domain = parse_url(get_site_url(), PHP_URL_HOST);
			$admin_email = get_bloginfo('admin_email');
	
			// Ensure a valid email is used for "From"
			if (!is_email($admin_email)) {
				$admin_email = 'noreply@' . $site_domain; // Fallback email
			}
	
			// Set "From" name and email
			$from_name = get_bloginfo('name');
			$from_email = $admin_email; // Force it to use the site admin email
	
			$headers[] = "From: $from_name <$from_email>";
			// Add Return-Path to prevent "via" issues
			$headers[] = "Return-Path: <$from_email>";

			// Set Reply-To
			$reply_to = $this->get_reply_to_email($form_data);
			if ($reply_to && is_email($reply_to)) {
				$headers[] = "Reply-To: $reply_to";
			}
	
			// Add CC if present and valid
			if (!empty($form_data['ccEmails'])) {
				$cc_emails = array_filter(
					array_map('trim', explode(',', $form_data['ccEmails'])),
					'is_email'
				);
				if (!empty($cc_emails)) {
					$headers[] = 'Cc: ' . implode(', ', $cc_emails);
				}
			}
	
			// Add BCC if present and valid
			if (!empty($form_data['bccEmails'])) {
				$bcc_emails = array_filter(
					array_map('trim', explode(',', $form_data['bccEmails'])),
					'is_email'
				);
				if (!empty($bcc_emails)) {
					$headers[] = 'Bcc: ' . implode(', ', $bcc_emails);
				}
			}
	
			return $headers;
	
		} catch (Exception $e) {
			throw $e;
		}
	}

	/**
	 * Get Reply-To email from form data
	 */
	private function get_reply_to_email($form_data) {
		// Check form fields for email field
		if (!empty($form_data['fields'])) {
			foreach ($form_data['fields'] as $field) {
				if ($field['type'] === 'email' && !empty($field['value']) && is_email($field['value'])) {
					return $field['value'];
				}
			}
		}

		// Fallback to from_email if set
		return !empty($form_data['fromEmail']) ? $form_data['fromEmail'] : null;
	}

	/**
	 * Get email subject
	 */
	private function get_email_subject($form_data) {
		try {
			// Get default subject if none provided
			$subject = !empty($form_data['emailSubject'])
				? $form_data['emailSubject']
				: __('New Form Submission', 'blockons');
	
			// Process any shortcodes in the subject
			$processed_subject = $this->process_shortcodes($subject, $form_data);
	
			// Clean the subject line
			$processed_subject = wp_strip_all_tags(trim($processed_subject));
	
			return $processed_subject;
	
		} catch (Exception $e) {
			error_log('Error processing email subject: ' . $e->getMessage());
			return $subject; // Return original subject if processing fails
		}
	}

	/**
	 * Get submission title for database storage
	 */
	private function get_submission_title($form_data) {
		// Try to get submitter's email first
		if (!empty($form_data['fields'])) {
			foreach ($form_data['fields'] as $field) {
				if ($field['type'] === 'email' && !empty($field['value'])) {
					return $field['value'];
				}
			}
		}

		// Fallback to form name or default
		return !empty($form_data['formName']) 
			? $form_data['formName']
			: __('Form Submission', 'blockons');
	}

	/**
	 * Save submission metadata
	 */
	private function save_submission_metadata($post_id, $form_data, $email_data) {
		$metadata = [
			'_form_data' => $form_data['fields'],
			'_form_subject' => $this->get_email_subject($form_data),
			'_form_id' => $form_data['formName'] ?? 'contact_form',
			'_email_to' => $form_data['emailTo'],
			'_cc_to' => $form_data['ccEmails'] ?? '',
			'_bcc_to' => $form_data['bccEmails'] ?? '',
			'_submission_date' => current_time('mysql'),
			'_ip_address' => $this->get_client_ip(),
			'_page_url' => esc_url_raw($_SERVER['HTTP_REFERER'] ?? ''),
			'_submission_status' => 'unread',
			'_email_content' => $email_data['content'],
			'_email_headers' => $email_data['headers'],
		];

		foreach ($metadata as $key => $value) {
			update_post_meta($post_id, $key, $value);
		}
	}

	/**
	 * Get metadata content for email
	 */
	private function get_metadata_content() {
		$metadata = "\n\n" . __('Submission Details:', 'blockons') . "\n";
		/* translators: %s: a date string */
		$metadata .= sprintf(__('Date: %s', 'blockons'), current_time('mysql')) . "\n";
		$metadata .= sprintf(
			/* translators: %s: the URL of the page */
			__('Page URL: %s', 'blockons'),
			isset($_SERVER['HTTP_REFERER']) ? esc_url($_SERVER['HTTP_REFERER']) : __('N/A', 'blockons')
		) . "\n";
		$metadata .= sprintf(
			/* translators: %s: the IP address of the user */
			__('IP Address: %s', 'blockons'),
			$this->get_client_ip()
		) . "\n";

		return $metadata;
	}

	/**
	 * Process shortcodes in content
	 */
	private function process_shortcodes($content, $form_data) {
		try {
			$timezone = wp_timezone();
			$current_datetime = new DateTime('now', $timezone);

			// Initialize base shortcodes
			$shortcodes = [
				'form_name' => $form_data['formName'] ?? '',
				'submission_date' => $current_datetime->format('F j, Y'),
				'submission_time' => $current_datetime->format('g:i a'),
				'page_url' => $_SERVER['HTTP_REFERER'] ?? '',
				'page_title' => $form_data['pageTitle'] ?? '',
			];
	
			// Process form fields for shortcode values
			if (!empty($form_data['fields']) && is_array($form_data['fields'])) {
				foreach ($form_data['fields'] as $field) {
					if (empty($field['name']) || empty($field['label'])) continue;
	
					// Generate code from label
					$code = sanitize_title($field['label']);
					
					// Handle different field types
					if (is_array($field['value'])) {
						// Handle array values (like checkbox groups)
						if ($field['type'] === 'checkbox_group') {
							$values = array_map(function($item) {
								return isset($item['label']) ? $item['label'] : $item['value'];
							}, $field['value']);
							$shortcodes[$code] = implode(', ', $values);
						} else {
							$shortcodes[$code] = implode(', ', $field['value']);
						}
					} else {
						$shortcodes[$code] = $field['value'] ?? '';
					}
	
					// Also store with underscores instead of dashes for compatibility
					$underscore_code = str_replace('-', '_', $code);
					if ($code !== $underscore_code) {
						$shortcodes[$underscore_code] = $shortcodes[$code];
					}
				}
			}
	
			// Replace all shortcodes
			$processed_content = $content;
			foreach ($shortcodes as $code => $value) {
				$processed_content = str_replace(
					['[' . $code . ']', '[' . strtoupper($code) . ']'],
					$value,
					$processed_content
				);
			}
	
			return $processed_content;
	
		} catch (Exception $e) {
			error_log('Error processing shortcodes: ' . $e->getMessage());
			error_log('Error trace: ' . $e->getTraceAsString());
			return $content; // Return original content if processing fails
		}
	}

	/**
	 * Get client IP address
	 */
	private function get_client_ip() {
		$ip_headers = [
			'HTTP_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'REMOTE_ADDR'
		];
	
		foreach ($ip_headers as $header) {
			if (!empty($_SERVER[$header])) {
				$ip = trim(explode(',', $_SERVER[$header])[0]);
				if (filter_var($ip, FILTER_VALIDATE_IP)) {
					return $ip;
				}
			}
		}
		
		return 'unknown';
	}

	/**
	 * Get Block Patterns for debugging
	 */
	function blockons_get_modal_block_patterns() {
		$modal_patterns = [];
		
		// Get patterns from database (created in Site Editor)
		$db_patterns = get_posts([
			'post_type' => 'wp_block',
			'post_status' => 'publish',
			'numberposts' => -1
		]);
		
		foreach ($db_patterns as $pattern_post) {
			// Get pattern categories from taxonomy (wp_pattern_category)
			$pattern_categories = wp_get_object_terms($pattern_post->ID, 'wp_pattern_category', ['fields' => 'slugs']);
			if (is_wp_error($pattern_categories)) {
				$pattern_categories = [];
			}
			
			// If no taxonomy terms, check meta (fallback)
			if (empty($pattern_categories)) {
				$meta_categories = get_post_meta($pattern_post->ID, 'wp_pattern_category', true);
				$pattern_categories = is_array($meta_categories) ? $meta_categories : ($meta_categories ? [$meta_categories] : []);
			}
			
			// Add to modal patterns if it has the right category
			if (in_array('blockons-popup-modals', $pattern_categories)) {
				$modal_patterns[] = [
					'name' => 'wp-block-' . $pattern_post->ID,
					'title' => $pattern_post->post_title,
					'categories' => $pattern_categories,
					'content' => $pattern_post->post_content,
					'id' => $pattern_post->ID
				];
			}
		}
		
		return rest_ensure_response($modal_patterns);
	}

	/**
	 * Check if running in development environment
	 */
	private function is_development_environment() {
		return (
			strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
			in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ||
			(defined('WP_DEBUG') && WP_DEBUG === true)
		);
	}

	/**
	 * AJAX handler to clear WooCommerce cart notices
	 * Prevents duplicate "added to cart" messages after quickview additions
	 */
	public function blockons_clear_cart_notices() {
		// Verify nonce if provided (optional for this functionality)
		if (isset($_POST['nonce']) && !empty($_POST['nonce'])) {
			if (!wp_verify_nonce($_POST['nonce'], 'blockons_quickview_nonce')) {
				wp_die('Security check failed');
			}
		}

		// Clear WooCommerce notices
		if (function_exists('wc_clear_notices')) {
			wc_clear_notices();
		}

		// Also clear any notices stored in session
		if (WC()->session) {
			WC()->session->set('wc_notices', null);
		}

		wp_send_json_success('Cart notices cleared');
	}
}
new Blockons_WC_Rest_Routes();
