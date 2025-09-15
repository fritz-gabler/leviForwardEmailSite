<?php
session_start();

header('Content-Type: application/json');

$kas_login = $_POST['kas_login'] ?? '';
$kas_auth_data = $_POST['kas_auth_data'] ?? '';
$kas_2fa = $_POST['kas_2fa'] ?? null; // Optional: Nur falls 2FA aktiv

if (!$kas_login || !$kas_auth_data) {
    http_response_code(400);
    echo json_encode(['error' => 'Login and Auth Data required']);
    exit;
}

try {
    $params = [
        'kas_login' => $kas_login,
        'kas_auth_type' => 'plain',
        'kas_auth_data' => $kas_auth_data,
        'session_lifetime' => 600, // 10 Minuten
        'session_update_lifetime' => 'Y'
    ];
    if ($kas_2fa) {
        $params['session_2fa'] = $kas_2fa;
    }
    $soap = new SoapClient('https://kasapi.kasserver.com/soap/wsdl/KasAuth.wsdl');
    $token = $soap->KasAuth(json_encode($params));
    $_SESSION['kas_login'] = $kas_login;
    $_SESSION['kas_token'] = $token;
    echo json_encode(['token' => $token, 'status' => 'ok']);
} catch (SoapFault $fault) {
    http_response_code(401);
    echo json_encode(['error' => $fault->faultstring]);
}
?>

