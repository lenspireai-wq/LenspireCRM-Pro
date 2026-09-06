<?php
declare(strict_types=1);

// Hostinger-facing gateway for crm.lenspireai.com. The upstream is fixed so
// request data can never be used to turn this endpoint into an open proxy.
const LENSPIRE_WEB_UPSTREAM = 'http://187.52.122.113:8080';
const LENSPIRE_API_UPSTREAM = 'http://187.52.122.113:8000';

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$upstream = str_starts_with($requestUri, '/api/') ? LENSPIRE_API_UPSTREAM : LENSPIRE_WEB_UPSTREAM;
$upstreamUrl = $upstream . (str_starts_with($requestUri, '/') ? $requestUri : '/' . $requestUri);

$incomingHeaders = function_exists('getallheaders') ? getallheaders() : [];
$forwardHeaders = [];
$blockedRequestHeaders = [
    'connection' => true,
    'content-length' => true,
    'host' => true,
    'proxy-authorization' => true,
    'te' => true,
    'trailer' => true,
    'transfer-encoding' => true,
    'upgrade' => true,
];

foreach ($incomingHeaders as $name => $value) {
    $lowerName = strtolower((string) $name);
    if (!isset($blockedRequestHeaders[$lowerName])) {
        $forwardHeaders[] = $name . ': ' . $value;
    }
}

$publicHost = $_SERVER['HTTP_HOST'] ?? 'crm.lenspireai.com';
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
$forwardHeaders[] = 'X-Forwarded-Host: ' . $publicHost;
$forwardHeaders[] = 'X-Forwarded-Proto: https';
if ($clientIp !== '') {
    $forwardHeaders[] = 'X-Forwarded-For: ' . $clientIp;
}

$curl = curl_init($upstreamUrl);
if ($curl === false) {
    http_response_code(502);
    exit('Unable to initialize the CRM gateway.');
}

curl_setopt_array($curl, [
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_HTTPHEADER => $forwardHeaders,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_HEADERFUNCTION => static function ($handle, string $line) use ($publicHost, $upstream): int {
        $length = strlen($line);
        $trimmed = trim($line);
        if ($trimmed === '' || str_starts_with($trimmed, 'HTTP/')) {
            return $length;
        }

        $separator = strpos($trimmed, ':');
        if ($separator === false) {
            return $length;
        }

        $name = substr($trimmed, 0, $separator);
        $value = ltrim(substr($trimmed, $separator + 1));
        $lowerName = strtolower($name);
        $blockedResponseHeaders = [
            'connection' => true,
            'content-length' => true,
            'keep-alive' => true,
            'transfer-encoding' => true,
            'upgrade' => true,
        ];
        if (isset($blockedResponseHeaders[$lowerName])) {
            return $length;
        }

        if ($lowerName === 'location') {
            $value = str_replace($upstream, 'https://' . $publicHost, $value);
        } elseif ($lowerName === 'set-cookie') {
            $value = preg_replace('/;\s*Domain=[^;]+/i', '', $value) ?? $value;
        }

        header($name . ': ' . $value, false);
        return $length;
    },
]);

if (!in_array($method, ['GET', 'HEAD'], true)) {
    $body = file_get_contents('php://input');
    curl_setopt($curl, CURLOPT_POSTFIELDS, $body === false ? '' : $body);
}

$responseBody = curl_exec($curl);
$statusCode = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$error = curl_error($curl);
curl_close($curl);

if ($responseBody === false || $statusCode === 0) {
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    exit('CRM gateway upstream error' . ($error !== '' ? ': ' . $error : '.'));
}

http_response_code($statusCode);
// The gateway fronts a frequently updated authenticated application. Prevent
// Hostinger CDN and browser caches from pinning an old Next.js document whose
// chunk references no longer match the current deployment.
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0', true);
header('Pragma: no-cache', true);
header('Expires: 0', true);
if ($method !== 'HEAD') {
    echo $responseBody;
}

