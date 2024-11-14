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

            // Prepare the product data for the REST response.
            $response = [
                'id'           => $product->get_id(),
                'title'        => $product->get_name(),
                'short_desc'   => $product->get_short_description(),
                'description'  => $product->get_description(),
                'price'        => $product->get_price_html(),
                'sku'          => $product->get_sku(),
                'image'        => wp_get_attachment_image_url( $product->get_image_id(), 'full' ),
                'permalink'    => $product->get_permalink(),
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
	 * Handle Form Submission for Contact Form Block
	 */
	public function blockons_handle_contact_form_submission($request) {
		try {
			// Initialize security manager
			$security = Blockons_Security_Manager::get_instance();
			
			// Get client IP address
			$ip_address = $this->get_client_ip();
			
			// Debug logging
			if (defined('WP_DEBUG') && WP_DEBUG) {
				error_log('Form submission request data: ' . print_r($request->get_params(), true));
				error_log('Files received: ' . print_r($_FILES, true));
				error_log('Client IP: ' . $ip_address);
			}

			// Validate request data
			$form_data = $security->validate_request($request);
			if (is_wp_error($form_data)) {
				return $form_data;
			}

			// Handle file uploads if present
			try {
				if (!empty($_FILES)) {
					$uploads = $this->handle_file_uploads($form_data);
					
					// Update form data with file URLs
					if (!empty($uploads)) {
						foreach ($form_data['fields'] as &$field) {
							if ($field['type'] === 'file') {
								foreach ($uploads as $upload) {
									if (isset($upload['originalName']) && $upload['originalName'] === $field['originalName']) {
										$field['value'] = $upload['url'];
										$field['size'] = $upload['size'];
										$field['mimeType'] = $upload['type'];
										break;
									}
								}
							}
						}
					}
				}
			} catch (Exception $e) {
				error_log('File upload error: ' . $e->getMessage());
				return new WP_Error(
					'upload_error',
					$e->getMessage(),
					array('status' => 400)
				);
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

			// Get form options
			$options = get_option('blockons_options');
			if (is_string($options)) {
				$options = json_decode($options, true);
			}

			// Process reCAPTCHA if enabled
			if ($this->should_verify_recaptcha($options)) {
				$recaptcha_token = isset($form_data['recaptchaToken']) ? $form_data['recaptchaToken'] : '';
				$recaptcha_result = $this->verify_recaptcha($recaptcha_token, $options);
				if (is_wp_error($recaptcha_result)) {
					return $recaptcha_result;
				}
			}

			// Check if we're in development environment
			if ($this->is_development_environment()) {
				error_log('Development environment detected - skipping actual email sending');
				error_log('Email would have been sent with:');
				error_log('To: ' . implode(', ', $valid_emails));
				error_log('Form data: ' . print_r($form_data, true));

				// Save submission if enabled
				if ($this->should_save_submission($options)) {
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
			if ($this->should_save_submission($options)) {
				$this->save_form_submission($form_data, $email_result);
			}

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
			// Debug incoming data
			error_log('Processing form submission with data: ' . print_r($form_data, true));
			error_log('Recipient emails: ' . print_r($valid_emails, true));
	
			// Prepare email components
			$email_content = $this->prepare_email_content($form_data);
			$headers = $this->prepare_email_headers($form_data);
			$subject = $this->get_email_subject($form_data);
	
			// Check if we're in a development environment
			if ($this->is_development_environment()) {
				error_log('Development environment detected - skipping actual email sending');
				error_log('Email would have been sent with:');
				error_log('To: ' . implode(', ', $valid_emails));
				error_log('Subject: ' . $subject);
				error_log('Content: ' . $email_content);
				error_log('Headers: ' . print_r($headers, true));
	
				// Return success for development environment
				return [
					'content' => $email_content,
					'headers' => $headers,
					'subject' => $subject,
					'to' => $valid_emails,
					'dev_mode' => true
				];
			}
	
			// Production email sending code...
			$mail_sent = wp_mail($valid_emails[0], $subject, $email_content, $headers);
	
			if (!$mail_sent) {
				$error = error_get_last();
				error_log('Mail send failed. PHP error: ' . print_r($error, true));
				throw new Exception('Failed to send email: ' . ($error['message'] ?? 'Unknown error'));
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
	private function handle_file_uploads($form_data) {
		try {
			$uploads = [];
			$upload_dir = wp_upload_dir();
			$form_upload_dir = $upload_dir['basedir'] . '/blockons/form-uploads/' . date('Y/m');
			
			error_log('Starting file upload process...');
	
			// Create necessary directories
			$dirs = [
				$upload_dir['basedir'] . '/blockons',
				$upload_dir['basedir'] . '/blockons/form-uploads',
				$form_upload_dir
			];
	
			foreach ($dirs as $dir) {
				if (!wp_mkdir_p($dir)) {
					error_log('Failed to create directory: ' . $dir);
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
	
				error_log('Processing file: ' . $key);
				
				try {
					// Basic validation
					$max_size = isset($form_data['maxFileSize']) 
						? intval($form_data['maxFileSize']) * 1024 * 1024 
						: 5 * 1024 * 1024;
	
					if ($file['size'] > $max_size) {
						throw new Exception(sprintf(
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
	
					error_log('File MIME type: ' . $mime_type);
	
					if (!isset($allowed_types[$mime_type])) {
						throw new Exception(__('Invalid file type', 'blockons') . ': ' . $mime_type);
					}
	
					// Prepare filename
					$file_extension = $allowed_types[$mime_type];
					$filename = sanitize_file_name(pathinfo($file['name'], PATHINFO_FILENAME) . '.' . $file_extension);
					$unique_filename = wp_unique_filename($form_upload_dir, $filename);
					$upload_path = $form_upload_dir . '/' . $unique_filename;
	
					error_log('Attempting to move file to: ' . $upload_path);
	
					if (@move_uploaded_file($file['tmp_name'], $upload_path)) {
						@chmod($upload_path, 0644);
	
						$file_url = $upload_dir['baseurl'] . '/blockons/form-uploads/' . date('Y/m') . '/' . $unique_filename;
						
						$uploads[$key] = array(
							'url' => $file_url,
							'file' => $upload_path,
							'type' => $mime_type,
							'name' => $filename,
							'size' => $file['size'],
							'originalName' => $file['name']
						);
	
						$processed_files[] = $key;
						error_log('File uploaded successfully: ' . $file_url);
					} else {
						$upload_error = error_get_last();
						error_log('Move failed. PHP error: ' . ($upload_error ? json_encode($upload_error) : 'No error details'));
						throw new Exception(__('Failed to move uploaded file', 'blockons'));
					}
	
				} catch (Exception $e) {
					error_log('File upload error for ' . $key . ': ' . $e->getMessage());
					throw $e;
				}
			}
	
			return $uploads;
	
		} catch (Exception $e) {
			error_log('File upload handler error: ' . $e->getMessage());
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
						if (is_array($field['value'])) {
							$values = array_map(function($item) {
								return isset($item['label']) ? esc_html($item['label']) : esc_html($item['value']);
							}, $field['value']);
							$compiled_message .= sprintf(
								"%s: %s\n",
								esc_html($label),
								implode(', ', $values)
							);
						}
						break;
	
					case 'file':
						if (!empty($field['value'])) {
							$compiled_message .= sprintf(
								"%s: %s\n",
								esc_html($label),
								esc_url($field['value'])
							);
							
							if (!empty($field['size'])) {
								$compiled_message .= sprintf(
									"File Size: %s\n",
									size_format($field['size'])
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
	
					case 'textarea':
						$compiled_message .= sprintf(
							"%s:\n%s\n",
							esc_html($label),
							nl2br(esc_html($field['value']))
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
			
			// Add content type
			$headers[] = 'Content-Type: text/plain; charset=UTF-8';
			
			// Setup From header
			$site_domain = parse_url(get_site_url(), PHP_URL_HOST);
			$from_name = !empty($form_data['fromName']) 
				? $this->process_shortcodes($form_data['fromName'], $form_data)
				: get_bloginfo('name');
			
			$from_email = !empty($form_data['fromEmail'])
				? $this->process_shortcodes($form_data['fromEmail'], $form_data)
				: 'wordpress@' . $site_domain;
	
			// Clean and validate from name
			$from_name = wp_strip_all_tags(trim($from_name));
			if (empty($from_name)) {
				$from_name = get_bloginfo('name');
			}
	
			// Validate from email
			$from_email = is_email($from_email) ? $from_email : 'wordpress@' . $site_domain;
	
			// Build From header
			$headers[] = 'From: ' . $from_name . ' <' . $from_email . '>';
	
			// Set Reply-To
			$reply_to = $this->get_reply_to_email($form_data);
			if ($reply_to && is_email($reply_to)) {
				$headers[] = sprintf('Reply-To: %s', $reply_to);
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
	
			error_log('Prepared headers: ' . print_r($headers, true));
			return $headers;
	
		} catch (Exception $e) {
			error_log('Error preparing email headers: ' . $e->getMessage());
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
	
			error_log('Original subject: ' . $subject);
			error_log('Processed subject: ' . $processed_subject);
	
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
		$metadata .= sprintf(__('Date: %s', 'blockons'), current_time('mysql')) . "\n";
		$metadata .= sprintf(
			__('Page URL: %s', 'blockons'),
			isset($_SERVER['HTTP_REFERER']) ? esc_url($_SERVER['HTTP_REFERER']) : __('N/A', 'blockons')
		) . "\n";
		$metadata .= sprintf(
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
			// Initialize base shortcodes
			$shortcodes = [
				'form_name' => $form_data['formName'] ?? '',
				'submission_date' => current_time('mysql'),
				'submission_time' => current_time('mysql', true),
				'page_url' => $_SERVER['HTTP_REFERER'] ?? ''
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
	
			error_log('Available shortcodes: ' . print_r($shortcodes, true));
			error_log('Content before processing: ' . $content);
	
			// Replace all shortcodes
			$processed_content = $content;
			foreach ($shortcodes as $code => $value) {
				$processed_content = str_replace(
					['[' . $code . ']', '[' . strtoupper($code) . ']'],
					$value,
					$processed_content
				);
			}
	
			error_log('Content after processing: ' . $processed_content);
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
	 * Check if running in development environment
	 */
	private function is_development_environment() {
		return (
			strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
			in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ||
			(defined('WP_DEBUG') && WP_DEBUG === true)
		);
	}
}
new Blockons_WC_Rest_Routes();
