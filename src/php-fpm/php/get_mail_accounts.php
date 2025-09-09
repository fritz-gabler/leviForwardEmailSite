<?php
// get_mailaccounts.php

header('Content-Type: application/json');

// Replace with actual KAS endpoint (check their docs for the right URL)
$kas_url = "https://kasapi.yourprovider.com/soap/";

$kas_login     = $_POST['kas_login'] ?? '';
$kas_auth_data = $_POST['kas_auth_data'] ?? '';
$kas_auth_type = $_POST['kas_auth_type'] ?? 'plain'; // "plain" is usually the default

if (!$kas_login || !$kas_auth_data) {
    http_response_code(401);
    echo json_encode(["error" => "Missing credentials"]);
    exit;
}

$params = [
    'kas_login'     => $kas_login,
    'kas_auth_data' => $kas_auth_data,
    'kas_auth_type' => $kas_auth_type,
    'kas_action'    => 'get_mailaccounts',
    'anz_var'       => 0
];

$ch = curl_init($kas_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    http_response_code(500);
    exit;
}
curl_close($ch);

echo $response;
?>

