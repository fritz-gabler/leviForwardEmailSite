<?php
session_start();
header('Content-Type: application/json');

require_once('session_longin.php');

$kas_login  = $_SESSION['kas_login'] ?? '';
$kas_token  = $_SESSION['kas_token'] ?? '';
$local_part = $_POST['local_part'] ?? '';
$domain_part = $_POST['domain_part'] ?? '';
$target_1   = $_POST['target_1'] ?? '';

if (!$kas_login || !$kas_token || !$local_part || !$domain_part || !$target_1) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters or not authenticated']);
    exit;
}

try {
    $soap = new SoapClient('https://kasapi.kasserver.com/soap/wsdl/KasApi.wsdl');
    $apiParams = [
        'kas_login'     => $kas_login,
        'kas_auth_type' => 'session',
        'kas_auth_data' => $kas_token,
        'kas_action'    => 'add_mailforward',
        'KasRequestParams' => [
            'local_part'  => $local_part,
            'domain_part' => $domain_part,
            'target_1'    => $target_1
        ]
    ];
    $result = $soap->KasApi(json_encode($apiParams));
    echo $result;
} catch (SoapFault $fault) {
    http_response_code(500);
    echo json_encode(['error' => $fault->faultstring]);
}
?>
