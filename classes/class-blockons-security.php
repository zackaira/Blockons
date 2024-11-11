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

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function check_submission_rate($ip_address) {
        // Skip rate limiting for localhost/development
        if ($this->is_development_environment()) {
            return true;
        }

        // Get the submission count for this IP
        $submissions = get_transient('blockons_submissions_' . $ip_address);
        
        if (false === $submissions) {
            // First submission for this IP
            set_transient('blockons_submissions_' . $ip_address, 1, $this->rate_limit_window);
            return true;
        }

        if ($submissions >= $this->rate_limit_threshold) {
            error_log(sprintf(
                'Rate limit exceeded for IP %s: %d submissions in the last hour',
                $ip_address,
                $submissions
            ));
            return false;
        }

        // Increment the submission count
        set_transient('blockons_submissions_' . $ip_address, $submissions + 1, $this->rate_limit_window);
        return true;
    }

    private function is_development_environment() {
        return (
            strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
            in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ||
            defined('WP_DEBUG') && WP_DEBUG === true
        );
    }

    public function validate_request($request) {
        try {
            // Check for required fields
            $required_fields = ['emailTo', 'fields'];
            foreach ($required_fields as $field) {
                if (empty($request[$field])) {
                    return new WP_Error(
                        'missing_required_field',
                        sprintf(__('Missing required field: %s', 'blockons'), $field),
                        array('status' => 400)
                    );
                }
            }

            // Validate email addresses and their limits
            $email_validation = $this->validate_email_addresses($request);
            if (is_wp_error($email_validation)) {
                return $email_validation;
            }

            return true;
        } catch (Exception $e) {
            error_log('Form validation error: ' . $e->getMessage());
            return new WP_Error(
                'validation_error',
                __('An error occurred during form validation.', 'blockons'),
                array('status' => 500)
            );
        }
    }

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

    public function sanitize_form_data($form_data) {
        $sanitized = [];
        foreach ($form_data as $key => $value) {
            if ($key === 'fields' && is_array($value)) {
                // Special handling for fields array
                $sanitized['fields'] = [];
                foreach ($value as $field) {
                    if (is_array($field)) {
                        $sanitized['fields'][] = array(
                            'name' => isset($field['name']) ? sanitize_text_field($field['name']) : '',
                            'label' => isset($field['label']) ? sanitize_text_field($field['label']) : '',
                            'value' => isset($field['value']) ? 
                                ($field['type'] === 'textarea' ? sanitize_textarea_field($field['value']) : sanitize_text_field($field['value'])) 
                                : '',
                            'type' => isset($field['type']) ? sanitize_text_field($field['type']) : 'text',
                            'required' => isset($field['required']) ? (bool)$field['required'] : false
                        );
                    }
                }
            } else if (in_array($key, ['emailTo', 'ccEmails', 'bccEmails'])) {
                // Special handling for email fields
                if (!empty($value)) {
                    $emails = array_map('trim', explode(',', $value));
                    $emails = array_slice($emails, 0, $this->limits[$key]); // Enforce limits
                    $sanitized[$key] = implode(',', array_map('sanitize_email', $emails));
                }
            } else if (is_array($value)) {
                $sanitized[$key] = array_map('sanitize_text_field', $value);
            } else {
                $sanitized[$key] = sanitize_text_field($value);
            }
        }
        return $sanitized;
    }

    /**
     * Get email limits
     * @return array Array of email limits
     */
    public function get_email_limits() {
        return $this->limits;
    }

    /**
     * Get rate limit settings
     * @return array Rate limit settings
     */
    public function get_rate_limit_settings() {
        return [
            'threshold' => $this->rate_limit_threshold,
            'window' => $this->rate_limit_window
        ];
    }
}
