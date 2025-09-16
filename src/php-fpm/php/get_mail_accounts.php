<?php
header('Content-Type: application/json');

$postData = json_decode(file_get_contents('php://input'), true);

$kas_login = $postData['kas_login'] ?? '';
$kas_auth_data = $postData['kas_auth_data'] ?? '';

if (!$kas_login || !$kas_auth_data) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

try {
    $soap = new SoapClient('https://kasapi.kasserver.com/soap/wsdl/KasApi.wsdl');
    $apiParams = [
        'kas_login'        => $kas_login,
        'kas_auth_type'    => 'plain',
        'kas_auth_data'    => $kas_auth_data,
        'kas_action'       => 'get_mailaccounts',
        'KasRequestParams' => []
    ];
    $result = $soap->KasApi(json_encode($apiParams));

    var_dump($result);
} catch (SoapFault $fault) {
    http_response_code(500);
    echo json_encode(['error' => $fault->faultstring]);
}
?>

