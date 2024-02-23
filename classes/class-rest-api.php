<?php
/*
 * Create Custom Rest API Endpoints
 */
class Blockons_WC_Rest_Routes {
	public function __construct() {
		add_action('rest_api_init', [$this, 'blockons_create_rest_routes']);
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

	/*
	 * Get saved options from database
	 */
	public function blockons_get_settings() {
		$blockonsPluginOptions = get_option('blockons_options');

		if (!$blockonsPluginOptions)
			return;

		return rest_ensure_response($blockonsPluginOptions);
	}

	/*
	 * Allow permissions for get options
	 */
	public function blockons_get_settings_permission() {
		return true;
	}

	/*
	 * Save settings as JSON string
	 */
	public function blockons_save_settings() {
		$req = file_get_contents('php://input');
		$reqData = json_decode($req, true);

		update_option('blockons_options', $reqData['blockonsOptions']);

		return rest_ensure_response('Success!');
	}

	/*
	 * Set save permissions for admin users
	 */
	public function blockons_save_settings_permission() {
		return current_user_can('publish_posts') ? true : false;
	}

	/*
	 * Delete the plugin settings
	 */
	public function blockons_delete_settings() {
		delete_option('blockons_options');

		return rest_ensure_response('Success!');
	}
	
	/*
	 * Get & Sort posts for 'Post Select' Component
	 */
	function blockons_get_wc_products($request) {
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

	/*
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

	/*
	 * Get Post by ID
	 */
	function blockons_get_post_by_id($request) {
		$post_id = esc_attr($request->get_param('id'));
		$post = get_post($post_id);
	
		if (!$post) {
			return new WP_Error('invalid_post_id', __('Invalid post ID.', 'text-domain'), array('status' => 404));
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

	/*
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
}
new Blockons_WC_Rest_Routes();
