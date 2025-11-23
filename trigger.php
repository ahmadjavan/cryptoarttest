<?php
// trigger.php - 100% امن و بدون نشت توکن
header('Access-Control-Allow-Origin: https://ahmadjavan.github.io');
header('Content-Type: application/json');

// توکن رو از سکرت محیطی می‌گیره (GitHub Actions یا Pages خودش می‌ذاره)
$token = getenv('GH_TRIGGER_TOKEN');
if (!$token) {
    http_response_code(500);
    echo json_encode(["error" => "توکن پیدا نشد"]);
    exit;
}

$payload = [
    "event_type" => "upload_gallery",
    "client_payload" => [
        "password" => $_POST['password'] ?? '',
        "files" => []
    ]
];

// دریافت فایل‌ها به صورت base64 از POST
foreach ($_POST['files'] ?? [] as $fileJson) {
    $file = json_decode($fileJson, true);
    if ($file) {
        $payload['client_payload']['files'][] = $file;
    }
}

$ch = curl_init('https://api.github.com/repos/ahmadjavan/cryptoarttest/dispatches');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Accept: application/vnd.github.v3+json',
        'Authorization: token ' . $token,
        'User-Agent: cryptoart-trigger'
    ],
    CURLOPT_RETURNTRANSFER => true
]);

$result = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($code);
echo $result;
?>
