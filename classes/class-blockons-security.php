<?php
/**
 * Security Manager for Form Submissions
 */
class Blockons_Security_Manager {
    private $rate_limit_threshold = 10; // Maximum submissions per hour
    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function check_submission_rate($ip_address) {
        $submissions = get_transient('blockons_submissions_' . $ip_address);
        if (false === $submissions) {
            set_transient('blockons_submissions_' . $ip_address, 1, HOUR_IN_SECONDS);
            return true;
        }

        if ($submissions >= $this->rate_limit_threshold) {
            return false;
        }

        set_transient('blockons_submissions_' . $ip_address, $submissions + 1, HOUR_IN_SECONDS);
        return true;
    }

    public function validate_request($request) {
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
            } else if (is_array($value)) {
                $sanitized[$key] = array_map('sanitize_text_field', $value);
            } else {
                $sanitized[$key] = sanitize_text_field($value);
            }
        }
        return $sanitized;
    }
}
