<?php
// ============================================================
// api/upload.php — Image Upload Handler
// POST multipart/form-data  { file: <image> }
// Returns: { success: true, url: "uploads/filename.ext" }
// ============================================================
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// ── Config ──────────────────────────────────────────────────
$uploadDir   = __DIR__ . '/../uploads/';
$maxBytes    = 5 * 1024 * 1024;          // 5 MB
$allowedMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$allowedExt  = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

// ── Validate upload ─────────────────────────────────────────
if (empty($_FILES['file'])) {
    jsonResponse(['error' => 'No file uploaded'], 422);
}

$file  = $_FILES['file'];
$error = $file['error'];

if ($error !== UPLOAD_ERR_OK) {
    $msgs = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload limit',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form size limit',
        UPLOAD_ERR_PARTIAL    => 'File only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temp folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by extension',
    ];
    jsonResponse(['error' => $msgs[$error] ?? 'Upload error'], 422);
}

// Size check
if ($file['size'] > $maxBytes) {
    jsonResponse(['error' => 'File must be under 5 MB'], 422);
}

// MIME check (use finfo — not just the browser-reported type)
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
if (!in_array($mimeType, $allowedMime, true)) {
    jsonResponse(['error' => 'Only JPG, PNG, GIF, WEBP allowed'], 422);
}

// Extension check
$origExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($origExt, $allowedExt, true)) {
    jsonResponse(['error' => 'Invalid file extension'], 422);
}

// ── Save file ───────────────────────────────────────────────
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$newName  = bin2hex(random_bytes(16)) . '.' . $origExt;
$destPath = $uploadDir . $newName;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    jsonResponse(['error' => 'Could not save file'], 500);
}

// Return relative URL (from project root)
jsonResponse([
    'success' => true,
    'url'     => 'uploads/' . $newName,
    'name'    => $file['name'],
]);
