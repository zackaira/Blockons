<?php
/**
 * Error Handler for Form Submissions
 */
class Blockons_Error_Handler {
    private static $error_log_file = WP_CONTENT_DIR . '/form-errors.log';
    
    public static function log_error($error, $context = []) {
        $timestamp = current_time('mysql');
        $error_message = sprintf(
            "[%s] %s\nContext: %s\n",
            $timestamp,
            $error,
            json_encode($context)
        );
        
        error_log($error_message, 3, self::$error_log_file);
    }

    public static function handle_submission_error($error) {
        self::log_error($error['message'], [
            'code' => $error['code'],
            'data' => $error['data'] ?? null
        ]);

        return new WP_Error(
            $error['code'],
            __('An error occurred while processing your submission. Please try again later.', 'blockons'),
            array('status' => 500)
        );
    }
}
 