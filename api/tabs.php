<?php
// ============================================================
// api/tabs.php — CRUD API for Tabs
// GET    /api/tabs.php          → list all active tabs
// GET    /api/tabs.php?id=1     → single tab
// POST   /api/tabs.php          → create tab
// PUT    /api/tabs.php?id=1     → update tab
// DELETE /api/tabs.php?id=1     → soft-delete tab
// ============================================================
require_once __DIR__ . '/../config.php';

$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {

    // ── READ ──────────────────────────────────────────────
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare(
                "SELECT id, title, icon_key, sort_order FROM tabs
                  WHERE id = ? AND is_active = 1"
            );
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $row
                ? jsonResponse($row)
                : jsonResponse(['error' => 'Tab not found'], 404);
        }

        // Return all tabs, each with its slides nested
        $tabs = $pdo->query(
            "SELECT id, title, icon_key, sort_order FROM tabs
              WHERE is_active = 1 ORDER BY sort_order ASC"
        )->fetchAll();

        $slides = $pdo->query(
            "SELECT id, tab_id, badge_text, title, learn_more_url, bg_image_url, sort_order
               FROM slides WHERE is_active = 1 ORDER BY tab_id, sort_order ASC"
        )->fetchAll();

        // Group slides by tab_id
        $grouped = [];
        foreach ($slides as $s) {
            $grouped[$s['tab_id']][] = $s;
        }
        foreach ($tabs as &$t) {
            $t['slides'] = $grouped[$t['id']] ?? [];
        }

        jsonResponse($tabs);
        break;

    // ── CREATE ────────────────────────────────────────────
    case 'POST':
        $body = getBody();
        if (empty($body['title'])) {
            jsonResponse(['error' => 'title is required'], 422);
        }
        $stmt = $pdo->prepare(
            "INSERT INTO tabs (title, icon_key, sort_order)
             VALUES (:title, :icon_key, :sort_order)"
        );
        $stmt->execute([
            ':title'      => sanitize($body['title']),
            ':icon_key'   => sanitize($body['icon_key']  ?? 'Learning'),
            ':sort_order' => (int)($body['sort_order']   ?? 0),
        ]);
        jsonResponse([
            'success' => true,
            'id'      => (int)$pdo->lastInsertId(),
            'message' => 'Tab created',
        ], 201);
        break;

    // ── UPDATE ────────────────────────────────────────────
    case 'PUT':
        if (!$id) jsonResponse(['error' => 'id is required'], 400);
        $body   = getBody();
        $fields = [];
        $params = [];

        if (isset($body['title'])) {
            $fields[] = 'title = :title';
            $params[':title'] = sanitize($body['title']);
        }
        if (isset($body['icon_key'])) {
            $fields[] = 'icon_key = :icon_key';
            $params[':icon_key'] = sanitize($body['icon_key']);
        }
        if (isset($body['sort_order'])) {
            $fields[] = 'sort_order = :sort_order';
            $params[':sort_order'] = (int)$body['sort_order'];
        }
        if (isset($body['is_active'])) {
            $fields[] = 'is_active = :is_active';
            $params[':is_active'] = (int)$body['is_active'];
        }

        if (!$fields) jsonResponse(['error' => 'Nothing to update'], 400);

        $params[':id'] = $id;
        $pdo->prepare("UPDATE tabs SET " . implode(', ', $fields) . " WHERE id = :id")
            ->execute($params);

        jsonResponse(['success' => true, 'message' => 'Tab updated']);
        break;

    // ── DELETE (soft) ─────────────────────────────────────
    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'id is required'], 400);
        $pdo->prepare("UPDATE tabs SET is_active = 0 WHERE id = ?")
            ->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Tab deleted']);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
