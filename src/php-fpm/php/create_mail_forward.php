<?php
header('Content-Type: application/json');

$postData = json_decode(file_get_contents('php://input'), true);

$kas_login = $postData['kas_login'] ?? '';
$kas_auth_data = $postData['kas_auth_data'] ?? '';
$selected_email = $postData['selected_email'] ?? '';
$local_part = $postData['local_string'] ?? '';


echo "Kas login: $kas_login\n";
echo "Kas auth data: $kas_auth_data\n";
echo "selected_email : $selected_email\n";
echo "local_part : $local_part\n";

if (!$kas_login || !$kas_auth_data ) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters or not authenticated']);
    exit;
}

if (!$selected_email || !$local_part) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required forward mail or local part']);
    exit;
}

try {
    $soap = new SoapClient('https://kasapi.kasserver.com/soap/wsdl/KasApi.wsdl');
    $apiParams = [
        'kas_login'        => $kas_login,
        'kas_auth_type'    => 'plain',
        'kas_auth_data'    => $kas_auth_data,
        'kas_action'       => 'add_mailforward',
        'KasRequestParams' => [
            'local_part'  => $local_part,
            'domain_part' => "family-gaebler.com",
            'target_1'    => $selected_email
        ]
    ];
    $result = $soap->KasApi(json_encode($apiParams));
    var_dump($result);
    echo "\nHallo from creation of forward mail";
} catch (SoapFault $fault) {
   http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    error_log('ERROR from api call: ', $e);
    exit;
}
?>
