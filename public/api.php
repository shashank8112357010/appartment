<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$action = $_GET['action'] ?? '';
$data_dir = __DIR__ . '/data';

if (!file_exists($data_dir)) {
    mkdir($data_dir, 0777, true);
}

$transactions_file = $data_dir . '/transactions.json';
$apartments_file = $data_dir . '/apartments.json';

if ($action === 'getData') {
    $transactions = file_exists($transactions_file) ? json_decode(file_get_contents($transactions_file), true) : [];
    $apartments = file_exists($apartments_file) ? json_decode(file_get_contents($apartments_file), true) : [];
    echo json_encode(['transactions' => $transactions, 'apartments' => $apartments]);
} 
elseif ($action === 'saveTransactions') {
    $data = file_get_contents('php://input');
    if ($data) {
        file_put_contents($transactions_file, $data);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No data provided']);
    }
}
elseif ($action === 'saveApartments') {
    $data = file_get_contents('php://input');
    if ($data) {
        file_put_contents($apartments_file, $data);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No data provided']);
    }
}
else {
    echo json_encode(['message' => 'Bajrangi API Active']);
}
?>
