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
            $form_data = $request->get_params();
            
            // Check if fields is a JSON string and decode it
            if (isset($form_data['fields']) && is_string($form_data['fields'])) {
                $decoded_fields = json_decode($form_data['fields'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $form_data['fields'] = $decoded_fields;
                } else {
                    throw new Exception('Invalid fields data format');
                }
            }
    
            // Validate required fields
            $required_fields = ['emailTo', 'fields'];
            foreach ($required_fields as $field) {
                if (!isset($form_data[$field])) {
                    throw new Exception("Missing required field: {$field}");
                }
            }
    
            // Validate email
            if (!is_email($form_data['emailTo'])) {
                throw new Exception('Invalid recipient email address');
            }
    
            // Convert boolean strings to actual booleans
            if (isset($form_data['includeMetadata'])) {
                $form_data['includeMetadata'] = filter_var(
                    $form_data['includeMetadata'], 
                    FILTER_VALIDATE_BOOLEAN
                );
            }
    
            // Convert fields array values
            if (is_array($form_data['fields'])) {
                foreach ($form_data['fields'] as &$field) {
                    if (isset($field['required']) && $field['required']) {
                        // Check standard text inputs, textareas, etc.
                        if (empty($field['value']) && !in_array($field['type'], ['checkbox', 'checkbox_group', 'radio_group'])) {
                            throw new Exception(sprintf(
                                /* translators: %s: the label of the required field */
                                __('Required field "%s" is empty', 'blockons'),
                                $field['label']
                            ));
                        }
            
                        // Check checkbox groups
                        if ($field['type'] === 'checkbox_group') {
                            if (empty($field['value']) || !is_array($field['value'])) {
                                throw new Exception(sprintf(
                                    /* translators: %s: the label of the required field */
                                    __('Required field "%s" has no selections', 'blockons'),
                                    $field['label']
                                ));
                            }
                        }
            
                        // Check radio groups
                        if ($field['type'] === 'radio_group') {
                            if (empty($field['value']) || !isset($field['value']['value'])) {
                                throw new Exception(sprintf(
                                    /* translators: %s: the label of the required field */
                                    __('Required field "%s" has no selection', 'blockons'),
                                    $field['label']
                                ));
                            }
                        }

                        // Check acceptance field
                        if ($field['type'] === 'checkbox') {
                            if (empty($field['value']) || $field['value'] != 1) {
                                throw new Exception(sprintf(
                                    /* translators: %s: the label of the required field */
                                    __('You must accept the %s', 'blockons'),
                                    $field['label']
                                ));
                            }
                        }
                    }

                    // Validate email fields
                    if ($field['type'] === 'email' && !empty($field['value'])) {
                        if (!filter_var($field['value'], FILTER_VALIDATE_EMAIL)) {
                            throw new Exception(sprintf(
                                /* translators: %s: the label of the email field */
                                __('Invalid email format for field "%s"', 'blockons'),
                                $field['label']
                            ));
                        }
                    }
                }
            }
    
            return $form_data;
    
        } catch (Exception $e) {
            error_log('Form validation error: ' . $e->getMessage());
            return new WP_Error(
                'validation_error',
                $e->getMessage(),
                array('status' => 400)
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
                            /* translators: 1: the field label, 2: the maximum allowed number of email addresses */
                            __('Too many email addresses for %1$s. Maximum allowed: %2$d', 'blockons'),
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
                            /* translators: %s: the invalid email address */
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
                $sanitized[$key] = $this->sanitize_email_list($value, $key);
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
                if ($field['type'] === 'radio_group' && is_array($field['value'])) {
                    $sanitized_field['value'] = [
                        'value' => sanitize_text_field($field['value']['value'] ?? ''),
                        'label' => sanitize_text_field($field['value']['label'] ?? '')
                    ];
                } else {
                    $sanitized_field['value'] = $this->sanitize_field_value(
                        $field['value'],
                        $field['type'] ?? 'text'
                    );
                }
            }

            // Handle checkbox/radio specific data
            if (isset($field['checked'])) {
                $sanitized_field['checked'] = (bool)$field['checked'];
            }
            if (isset($field['selected'])) {
                $sanitized_field['selected'] = (bool)$field['selected'];
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
    private function sanitize_email_list($emails, $field_key) {
        if (empty($emails)) return '';
        
        $email_list = array_map('trim', explode(',', $emails));
        $email_list = array_filter($email_list);
        $limit = isset($this->limits[$field_key]) ? $this->limits[$field_key] : count($email_list);
        $email_list = array_slice($email_list, 0, $limit);
        
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
