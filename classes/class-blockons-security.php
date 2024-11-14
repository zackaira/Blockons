<?php
/**
 * Security Manager for Form Submissions
 */
class Blockons_Security_Manager {
    // Increase the threshold and track per form instead of globally
    private $rate_limit_threshold = 30; // Maximum submissions per hour
    private $rate_limit_window = 3600; // 1 hour in seconds
    private static $instance = null;

    // Email limits
    private $limits = [
        'emailTo' => 3,  // Maximum 3 primary recipients
        'ccEmails' => 2, // Maximum 2 CC recipients
        'bccEmails' => 2 // Maximum 2 BCC recipients
    ];

    /**
     * Get instance of the security manager
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Get client IP address
     */
    public function get_client_ip() {
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
     * Check submission rate for IP/form combination
     */
    public function check_submission_rate($ip_address, $form_id = 'default') {
        // Skip rate limiting for localhost/development
        if ($this->is_development_environment()) {
            return true;
        }

        // Get the submission count for this IP and form
        $rate_key = sprintf('blockons_submissions_%s_%s', $ip_address, $form_id);
        $submissions = get_transient($rate_key);
        
        if (false === $submissions) {
            // First submission for this IP/form combination
            set_transient($rate_key, 1, $this->rate_limit_window);
            return true;
        }

        if ($submissions >= $this->rate_limit_threshold) {
            error_log(sprintf(
                'Rate limit exceeded for IP %s on form %s: %d submissions in the last hour',
                $ip_address,
                $form_id,
                $submissions
            ));
            return false;
        }

        // Increment the submission count
        set_transient($rate_key, $submissions + 1, $this->rate_limit_window);
        return true;
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
     * Validate form request
     */
    public function validate_request($request) {
        try {
            // Get request parameters - first try JSON, then form data
            $params = $request->get_json_params();
            if (empty($params)) {
                $params = $request->get_params();
                
                // If we have fields as a string (from FormData), decode it
                if (isset($params['fields']) && is_string($params['fields'])) {
                    $params['fields'] = json_decode($params['fields'], true);
                }
            }
    
            if (empty($params)) {
                return new WP_Error(
                    'invalid_request',
                    __('Invalid request data', 'blockons'),
                    array('status' => 400)
                );
            }
    
            // Check for required fields
            $required_fields = ['emailTo', 'fields'];
            foreach ($required_fields as $field) {
                if (empty($params[$field])) {
                    return new WP_Error(
                        'missing_required_field',
                        sprintf(__('Missing required field: %s', 'blockons'), $field),
                        array('status' => 400)
                    );
                }
            }
    
            // Validate email addresses
            $email_validation = $this->validate_email_addresses($params);
            if (is_wp_error($email_validation)) {
                return $email_validation;
            }
    
            return $params;
    
        } catch (Exception $e) {
            error_log('Form validation error: ' . $e->getMessage());
            return new WP_Error(
                'validation_error',
                __('An error occurred during form validation.', 'blockons'),
                array('status' => 500)
            );
        }
    }

    /**
     * Validate email addresses and their limits
     */
    public function validate_email_addresses($data) {
        foreach (['emailTo', 'ccEmails', 'bccEmails'] as $field) {
            if (!empty($data[$field])) {
                $emails = array_map('trim', explode(',', $data[$field]));
                $emails = array_filter($emails); // Remove empty values
                
                // Check number of email addresses
                if (count($emails) > $this->limits[$field]) {
                    return new WP_Error(
                        'too_many_emails',
                        sprintf(
                            __('Too many email addresses for %s. Maximum allowed: %d', 'blockons'),
                            $field,
                            $this->limits[$field]
                        ),
                        array('status' => 400)
                    );
                }

                // Validate each email address
                foreach ($emails as $email) {
                    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        return new WP_Error(
                            'invalid_email',
                            sprintf(__('Invalid email address: %s', 'blockons'), $email),
                            array('status' => 400)
                        );
                    }
                }
            }
        }

        return true;
    }

    /**
     * Sanitize form data
     */
    public function sanitize_form_data($form_data) {
        $sanitized = [];
        foreach ($form_data as $key => $value) {
            if ($key === 'fields' && is_array($value)) {
                // Special handling for fields array
                $sanitized['fields'] = $this->sanitize_form_fields($value);
            } else if (in_array($key, ['emailTo', 'ccEmails', 'bccEmails'])) {
                // Special handling for email fields
                $sanitized[$key] = $this->sanitize_email_list($value);
            } else if (is_array($value)) {
                $sanitized[$key] = array_map('sanitize_text_field', $value);
            } else {
                $sanitized[$key] = sanitize_text_field($value);
            }
        }
        return $sanitized;
    }

    /**
     * Sanitize form fields
     */
    private function sanitize_form_fields($fields) {
        $sanitized_fields = [];
        foreach ($fields as $field) {
            if (!is_array($field)) continue;

            $sanitized_field = [
                'name' => isset($field['name']) ? sanitize_text_field($field['name']) : '',
                'label' => isset($field['label']) ? sanitize_text_field($field['label']) : '',
                'type' => isset($field['type']) ? sanitize_text_field($field['type']) : 'text',
                'required' => isset($field['required']) ? (bool)$field['required'] : false
            ];

            // Handle field value based on type
            if (isset($field['value'])) {
                $sanitized_field['value'] = $this->sanitize_field_value(
                    $field['value'],
                    $field['type'] ?? 'text'
                );
            }

            // Handle checkbox specific data
            if (isset($field['checked'])) {
                $sanitized_field['checked'] = (bool)$field['checked'];
            }

            $sanitized_fields[] = $sanitized_field;
        }
        return $sanitized_fields;
    }

    /**
     * Sanitize field value based on type
     */
    private function sanitize_field_value($value, $type) {
        switch ($type) {
            case 'textarea':
                return sanitize_textarea_field($value);
            case 'email':
                return sanitize_email($value);
            case 'url':
                return esc_url_raw($value);
            case 'checkbox_group':
                if (is_array($value)) {
                    return array_map([$this, 'sanitize_checkbox_value'], $value);
                }
                return [];
            default:
                return sanitize_text_field($value);
        }
    }

    /**
     * Sanitize checkbox value
     */
    private function sanitize_checkbox_value($checkbox) {
        if (is_array($checkbox)) {
            return [
                'value' => sanitize_text_field($checkbox['value'] ?? ''),
                'label' => sanitize_text_field($checkbox['label'] ?? ''),
            ];
        }
        return sanitize_text_field($checkbox);
    }

    /**
     * Sanitize email list
     */
    private function sanitize_email_list($emails) {
        if (empty($emails)) return '';
        
        $email_list = array_map('trim', explode(',', $emails));
        $email_list = array_filter($email_list);
        $email_list = array_slice($email_list, 0, $this->limits[$key] ?? 1);
        
        return implode(',', array_map('sanitize_email', $email_list));
    }

    /**
     * Get email limits
     */
    public function get_email_limits() {
        return $this->limits;
    }

    /**
     * Get rate limit settings
     */
    public function get_rate_limit_settings() {
        return [
            'threshold' => $this->rate_limit_threshold,
            'window' => $this->rate_limit_window
        ];
    }
}
