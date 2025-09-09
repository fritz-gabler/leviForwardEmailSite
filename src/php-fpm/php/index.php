<?php
// index.php

// Get path after domain and before query params
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Define routing logic
switch ($path) {
    case '/get_mail_accounts':
        require 'get_mail_accounts.php';
        break;
    default:
        http_response_code(404);
        echo "Not Found";
        break;
}
?>

