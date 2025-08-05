<?php
header('Content-Type: application/json');

if (!isset($_GET['url'])) {
    echo json_encode(['error' => 'URL parameter is required']);
    exit;
}

$url = $_GET['url'];
$apiUrl = "https://api.bhawanigarg.com/social/instagram/?url=" . urlencode($url);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
} else {
    echo $response;
}

curl_close($ch);
?>
