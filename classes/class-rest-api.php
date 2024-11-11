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
	 * Handle Form Submission for Contact Form Blocks
	 */
	public function blockons_handle_contact_form_submission($request) {
		try {
			// Debug logging
			error_log('Form submission request: ' . print_r($request->get_params(), true));
			error_log('Options value: ' . print_r(get_option('blockons_options'), true));
	
			// Initialize security manager
			$security = Blockons_Security_Manager::get_instance();
			
			// Check submission rate
			$ip_address = $this->get_client_ip();
			if (!$security->check_submission_rate($ip_address)) {
				return new WP_Error(
					'rate_limit_exceeded',
					__('Too many submissions. Please try again later.', 'blockons'),
					array('status' => 429)
				);
			}
	
			// Get and validate form data
			$form_data = $request->get_params();
			$validation_result = $security->validate_request($request);
			if (is_wp_error($validation_result)) {
				return $validation_result;
			}
	
			// Sanitize form data
			$form_data = $security->sanitize_form_data($form_data);
	
			// Check if fields exist and their structure
			if (isset($form_data['fields'])) {
				error_log('Fields array structure: ' . print_r($form_data['fields'], true));
			} else {
				error_log('Fields array is missing from form data');
			}
	
			// Get options for reCAPTCHA check
			$options = get_option('blockons_options');
			if (is_string($options)) {
				$options = json_decode($options, true);
			}
	
			// Verify reCAPTCHA if enabled
			$recaptcha_enabled = !empty($options['contactforms']['recaptcha']) && 
				!empty($options['contactforms']['recaptcha_key']) && 
				!empty($options['contactforms']['recaptcha_secret']);
	
			if ($recaptcha_enabled) {
				$recaptcha_token = isset($form_data['recaptchaToken']) ? $form_data['recaptchaToken'] : '';
				
				error_log('reCAPTCHA check started');
				error_log('Token received: ' . ($recaptcha_token ? 'Yes' : 'No'));
				
				// Skip reCAPTCHA check for localhost/development
				if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
					in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])) {
					error_log('Development environment - skipping reCAPTCHA verification');
				} else {
					if (empty($recaptcha_token)) {
						error_log('No reCAPTCHA token provided');
						return new WP_Error(
							'recaptcha_missing',
							__('reCAPTCHA verification failed', 'blockons'),
							array('status' => 400)
						);
					}
	
					$verify_url = 'https://www.google.com/recaptcha/api/siteverify';
					$response = wp_remote_post($verify_url, array(
						'body' => array(
							'secret' => $options['contactforms']['recaptcha_secret'],
							'response' => $recaptcha_token
						)
					));
	
					error_log('reCAPTCHA verification response: ' . print_r($response, true));
	
					if (is_wp_error($response)) {
						error_log('reCAPTCHA verification error: ' . $response->get_error_message());
						return new WP_Error(
							'recaptcha_error',
							__('Failed to verify reCAPTCHA', 'blockons'),
							array('status' => 500)
						);
					}
	
					$body = json_decode(wp_remote_retrieve_body($response), true);
					error_log('reCAPTCHA verification result: ' . print_r($body, true));
					
					$threshold = !empty($options['contactforms']['recaptcha_threshold']) 
						? floatval($options['contactforms']['recaptcha_threshold']) 
						: 0.5;
	
					if (!$body['success'] || $body['score'] < $threshold) {
						error_log('reCAPTCHA verification failed. Score: ' . ($body['score'] ?? 'N/A'));
						return new WP_Error(
							'recaptcha_failed',
							__('reCAPTCHA verification failed', 'blockons'),
							array('status' => 400)
						);
					}
	
					error_log('reCAPTCHA verification successful. Score: ' . $body['score']);
				}
			}
	
			// Basic validation
			if (!isset($form_data['emailTo']) || empty($form_data['emailTo'])) {
				return new WP_Error(
					'missing_recipient', 
					__('Recipient email is required', 'blockons'), 
					array('status' => 400)
				);
			}
	
			// Validate recipient email(s)
			$to_emails = array_map('trim', explode(',', $form_data['emailTo']));
			$valid_emails = array_filter($to_emails, function($email) {
				return filter_var($email, FILTER_VALIDATE_EMAIL);
			});
	
			if (empty($valid_emails)) {
				return new WP_Error(
					'invalid_email',
					__('No valid recipient email addresses provided', 'blockons'),
					array('status' => 400)
				);
			}
	
			// Validate form fields
			$form_fields = isset($form_data['fields']) ? $form_data['fields'] : array();
			$compiled_message = '';
			$errors = array();
	
			foreach ($form_fields as $field) {
				// Skip honeypot field if it exists
				if (!empty($field['name']) && $field['name'] === 'asite' && !empty($field['value'])) {
					// Silently return success if honeypot is filled
					return array(
						'success' => true,
						'message' => __('Form submitted successfully', 'blockons')
					);
				}
	
				$value = isset($field['value']) ? $this->decode_form_content(sanitize_text_field($field['value'])) : '';
				$label = isset($field['label']) ? $this->decode_form_content(sanitize_text_field($field['label'])) : '';
				$required = isset($field['required']) ? (bool)$field['required'] : false;
				$type = isset($field['type']) ? sanitize_text_field($field['type']) : 'text';

				// Check required fields
				if ($required && empty($value)) {
					$errors[] = sprintf(
						/* translators: %s: field label */
						__('%s is required', 'blockons'),
						esc_html($label)
					);
					continue;
				}
	
				// Type-specific validation
				if (!empty($value)) {
					switch ($type) {
						case 'email':
							if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
								$errors[] = sprintf(
									/* translators: %s: field label */
									__('%s must be a valid email address', 'blockons'),
									esc_html($label)
								);
							}
							break;
						case 'url':
							if (!filter_var($value, FILTER_VALIDATE_URL)) {
								$errors[] = sprintf(
									/* translators: %s: field label */
									__('%s must be a valid URL', 'blockons'),
									esc_html($label)
								);
							}
							break;
						case 'number':
							if (!is_numeric($value)) {
								$errors[] = sprintf(
									/* translators: %s: field label */
									__('%s must be a number', 'blockons'),
									esc_html($label)
								);
							}
							break;
					}
				}
	
				// Add to compiled message only if it's not the honeypot
				if (!empty($field['name']) && $field['name'] !== 'asite') {
					$compiled_message .= sprintf("%s: %s\n", esc_html($label), esc_html($value));
				}
			}
	
			if (!empty($errors)) {
				return new WP_Error('validation_failed', __('Form validation failed', 'blockons'), array(
					'status' => 400,
					'errors' => $errors
				));
			}
	
			// Process email subject with shortcodes
			$subject = isset($form_data['emailSubject']) 
				? $this->process_shortcodes($form_data['emailSubject'], $form_data, $form_data['fields'])
				: __('New Contact Form Submission', 'blockons');
	
			// Process form fields
			$submitter_email = '';
			foreach ($form_fields as $field) {
				if (isset($field['type']) && $field['type'] === 'email' && !empty($field['value'])) {
					$submitter_email = sanitize_email($field['value']);
					break;
				}
			}
	
			// Setup email headers
			$headers = array('Content-Type: text/plain; charset=UTF-8');
			
			// Set From header
			$site_domain = parse_url(get_site_url(), PHP_URL_HOST);
			$from_name = !empty($form_data['fromName']) 
				? $this->process_shortcodes($form_data['fromName'], $form_data, $form_data['fields'])
				: 'Contact Form';
			$from_email = !empty($form_data['fromEmail'])
				? $this->process_shortcodes($form_data['fromEmail'], $form_data, $form_data['fields'])
				: 'noreply@' . $site_domain;
	
			// Add From header
			$headers[] = 'From: ' . esc_html($from_name) . ' <' . sanitize_email($from_email) . '>';
	
			// Set Reply-To to submitter's email if available, otherwise use from_email
			$reply_to_email = !empty($submitter_email) ? $submitter_email : $from_email;
			$headers[] = sprintf('Reply-To: %s', $reply_to_email);
	
			// Add CC headers
			if (isset($form_data['ccEmails']) && !empty($form_data['ccEmails'])) {
				$cc_headers = $this->validate_and_format_email_addresses($form_data['ccEmails'], 'Cc');
				$headers = array_merge($headers, $cc_headers);
			}
	
			// Add BCC headers
			if (isset($form_data['bccEmails']) && !empty($form_data['bccEmails'])) {
				$bcc_headers = $this->validate_and_format_email_addresses($form_data['bccEmails'], 'Bcc');
				$headers = array_merge($headers, $bcc_headers);
			}
	
			// Process shortcodes in message
			$compiled_message = $this->process_shortcodes($compiled_message, $form_data, $form_data['fields']);
	
			// Add metadata if requested
			if (isset($form_data['includeMetadata']) && $form_data['includeMetadata']) {
				$compiled_message .= "\n\n" . __('Submission Details:', 'blockons') . "\n";
				$compiled_message .= sprintf(__('Date: %s', 'blockons'), current_time('mysql')) . "\n";
				$compiled_message .= sprintf(
					__('Page URL: %s', 'blockons'), 
					isset($_SERVER['HTTP_REFERER']) ? esc_url($_SERVER['HTTP_REFERER']) : __('N/A', 'blockons')
				) . "\n";
				$compiled_message .= sprintf(__('IP Address: %s', 'blockons'), esc_html($this->get_client_ip())) . "\n";
			}
	
			// Check if form submissions should be saved
			$save_submissions = false;
			if (is_array($options) && 
				isset($options['contactforms']) && 
				is_array($options['contactforms']) && 
				isset($options['contactforms']['save_to_dashboard'])) {
				$save_submissions = (bool)$options['contactforms']['save_to_dashboard'];
			}
	
			if ($save_submissions) {
				try {
					// Generate post title
					$post_title = !empty($submitter_email) 
						? $submitter_email 
						: (isset($form_data['formId']) 
							? sanitize_text_field($form_data['formId']) 
							: __('Contact Form', 'blockons'));
	
					// Prepare post data
					$post_data = array(
						'post_title'    => wp_strip_all_tags($post_title),
						'post_content'  => $compiled_message,
						'post_status'   => 'publish',
						'post_type'     => 'blockons_submission'
					);
	
					// Insert post
					$post_id = wp_insert_post($post_data);
	
					if (is_wp_error($post_id)) {
						throw new Exception('Failed to save submission: ' . $post_id->get_error_message());
					}
	
					if ($post_id) {
						// Save form fields directly
						update_post_meta($post_id, '_form_data', $form_data['fields']);
						update_post_meta($post_id, '_form_subject', $subject);
						update_post_meta($post_id, '_form_id', 
							isset($form_data['formId']) ? sanitize_text_field($form_data['formId']) : 'contact_form'
						);
						update_post_meta($post_id, '_email_to', implode(', ', $valid_emails));
						update_post_meta($post_id, '_cc_to', $form_data['ccEmails']);
						update_post_meta($post_id, '_bcc_to', $form_data['bccEmails']);
						update_post_meta($post_id, '_submission_date', current_time('mysql'));
						update_post_meta($post_id, '_ip_address', $this->get_client_ip());
						update_post_meta($post_id, '_page_url', 
							isset($_SERVER['HTTP_REFERER']) ? esc_url_raw($_SERVER['HTTP_REFERER']) : ''
						);
						update_post_meta($post_id, '_submission_status', 'unread');
					}
	
				} catch (Exception $e) {
					error_log('Error saving form submission: ' . $e->getMessage());
					throw $e;
				}
			}
	
			// For localhost/development environment
			if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
				in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])) {
				
				// Log the attempted email for debugging
				error_log('Development Mode - Email would have been sent:');
				error_log('To: ' . sanitize_email($form_data['emailTo']));
				error_log('Subject: ' . esc_html($subject));
				error_log('Headers: ' . print_r(array_map('esc_html', $headers), true));
				error_log('Message: ' . esc_html($compiled_message));
				
				return array(
					'success' => true,
					'message' => $save_submissions 
						? __('Form submission logged but email not sent (development mode)', 'blockons')
						: __('Form submission received but email not sent (development mode)', 'blockons')
				);
			}

			// Send email
			try {
				// Convert array of emails to comma-separated string for wp_mail()
				$to_emails_string = implode(',', $valid_emails);
    
				$mail_sent = wp_mail(
					$to_emails_string,
					$subject,
					$compiled_message,
					$headers
				);
			
				if (!$mail_sent) {
					throw new Exception('Failed to send email');
				}
				
				// Log successful sending
				error_log('Email sent successfully to recipients: ' . $to_emails_string);
			} catch (Exception $e) {
				Blockons_Error_Handler::log_error('Form submission processing failed', [
					'error' => $e->getMessage(),
					'form_data' => $form_data,
					'recipients' => $valid_emails
				]);
				throw $e;
			}

			return array(
				'success' => true,
				'message' => __('Form submitted successfully', 'blockons')
			);

		} catch (Exception $e) {
			error_log('Contact form error: ' . $e->getMessage());
			return new WP_Error(
				'submission_error', 
				__('An error occurred while processing your submission. Please try again later.', 'blockons'),
				array('status' => 500)
			);
		}
	}

	// Process Shortcodes
	private function process_shortcodes($content, $form_data, $form_fields) {
		// System shortcodes
		$replacements = [
			'[form_name]' => isset($form_data['formId']) 
				? $this->decode_form_content(sanitize_text_field($form_data['formId'])) 
				: '',
			'[submission_date]' => current_time('Y-m-d'),
			'[submission_time]' => current_time('H:i:s'),
			'[page_url]' => isset($_SERVER['HTTP_REFERER']) 
				? esc_url_raw($_SERVER['HTTP_REFERER']) 
				: '',
		];
	
		// Process field-based shortcodes
		if (is_array($form_fields)) {
			foreach ($form_fields as $field) {
				if (!isset($field['label']) || !isset($field['value'])) {
					continue;
				}
	
				// Create shortcode from label
				$code = sanitize_title($field['label']); // Matches frontend shortcode generation
				$replacements["[$code]"] = $this->decode_form_content(sanitize_text_field($field['value']));
	
				// Special handling for name and email fields
				if (isset($field['type'])) {
					switch ($field['type']) {
						case 'email':
							$replacements['[email]'] = sanitize_email($field['value']);
							break;
						case 'text':
							if (strtolower($field['label']) === 'name') {
								$replacements['[name]'] = $this->decode_form_content(sanitize_text_field($field['value']));
							}
							break;
					}
				}
			}
		}
	
		// Replace all shortcodes
		$processed_content = str_replace(
			array_keys($replacements),
			array_values($replacements),
			$content
		);
	
		// Decode any remaining HTML entities in the final content
		return $this->decode_form_content($processed_content);
	}

	private function decode_form_content($content) {
		return html_entity_decode($content, ENT_QUOTES | ENT_HTML5, 'UTF-8');
	}

	// Function to validate and format email headers
	function validate_and_format_email_addresses($emails, $header_type) {
		if (empty($emails)) {
			return [];
		}

		$email_array = array_map('trim', explode(',', $emails));
		$valid_headers = [];
		$invalid_emails = [];

		foreach ($email_array as $email) {
			if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
				// Format according to RFC 2822
				$valid_headers[] = sprintf('%s: %s', $header_type, sanitize_email($email));
			} else if (!empty($email)) {
				$invalid_emails[] = $email;
			}
		}

		if (!empty($invalid_emails)) {
			error_log(sprintf(
				'Invalid %s email(s) were skipped: %s',
				$header_type,
				implode(', ', $invalid_emails)
			));
		}

		return $valid_headers;
	}
	
	// Helper function to get client IP
	private function get_client_ip() {
		$ipaddress = '';
		if (isset($_SERVER['HTTP_CLIENT_IP']))
			$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
		else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
			$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_X_FORWARDED']))
			$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
		else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
			$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_FORWARDED']))
			$ipaddress = $_SERVER['HTTP_FORWARDED'];
		else if(isset($_SERVER['REMOTE_ADDR']))
			$ipaddress = $_SERVER['REMOTE_ADDR'];
		else
			$ipaddress = 'UNKNOWN';
		return $ipaddress;
	}
}
new Blockons_WC_Rest_Routes();
