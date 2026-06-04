<?php
// ============================================================
// api/slides.php — CRUD API for Slides
// GET    /api/slides.php              → all slides (nested by tab)
// GET    /api/slides.php?tab_id=1     → slides for a specific tab
// GET    /api/slides.php?id=1         → single slide
// POST   /api/slides.php              → create slide
// PUT    /api/slides.php?id=1         → update slide
// DELETE /api/slides.php?id=1         → soft-delete slide
// ============================================================
require_once __DIR__ . '/../config.php';

$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id'])     ? (int)$_GET['id']     : null;
$tabId  = isset($_GET['tab_id']) ? (int)$_GET['tab_id'] : null;

switch ($method) {

    // ── READ ──────────────────────────────────────────────
    case 'GET':
        // Single slide
        if ($id) {
            $stmt = $pdo->prepare(
                "SELECT id, tab_id, badge_text, title, learn_more_url,
                        bg_image_url, sort_order
                   FROM slides WHERE id = ? AND is_active = 1"
            );
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $row
                ? jsonResponse($row)
                : jsonResponse(['error' => 'Slide not found'], 404);
        }

        // Slides for a specific tab
        if ($tabId) {
            $stmt = $pdo->prepare(
                "SELECT id, tab_id, badge_text, title, learn_more_url,
                        bg_image_url, sort_order
                   FROM slides
                  WHERE tab_id = ? AND is_active = 1
                  ORDER BY sort_order ASC"
            );
            $stmt->execute([$tabId]);
            jsonResponse($stmt->fetchAll());
        }

        // All slides
        $stmt = $pdo->query(
            "SELECT id, tab_id, badge_text, title, learn_more_url,
                    bg_image_url, sort_order
               FROM slides WHERE is_active = 1
               ORDER BY tab_id, sort_order ASC"
        );
        jsonResponse($stmt->fetchAll());
        break;

    // ── CREATE ────────────────────────────────────────────
    case 'POST':
        $body = getBody();
        if (empty($body['tab_id']) || empty($body['title'])) {
            jsonResponse(['error' => 'tab_id and title are required'], 422);
        }
        $stmt = $pdo->prepare(
            "INSERT INTO slides (tab_id, badge_text, title, learn_more_url, bg_image_url, sort_order)
             VALUES (:tab_id, :badge_text, :title, :learn_more_url, :bg_image_url, :sort_order)"
        );
        $stmt->execute([
            ':tab_id'        => (int)$body['tab_id'],
            ':badge_text'    => sanitize($body['badge_text']    ?? ''),
            ':title'         => sanitize($body['title']),
            ':learn_more_url'=> sanitize($body['learn_more_url'] ?? '#'),
            ':bg_image_url'  => sanitize($body['bg_image_url']  ?? ''),
            ':sort_order'    => (int)($body['sort_order']        ?? 0),
        ]);
        jsonResponse([
            'success' => true,
            'id'      => (int)$pdo->lastInsertId(),
            'message' => 'Slide created',
        ], 201);
        break;

    // ── UPDATE ────────────────────────────────────────────
    case 'PUT':
        if (!$id) jsonResponse(['error' => 'id is required'], 400);
        $body   = getBody();
        $fields = [];
        $params = [];

        $map = [
            'tab_id'         => ['int',    'tab_id = :tab_id'],
            'badge_text'     => ['string', 'badge_text = :badge_text'],
            'title'          => ['string', 'title = :title'],
            'learn_more_url' => ['string', 'learn_more_url = :learn_more_url'],
            'bg_image_url'   => ['string', 'bg_image_url = :bg_image_url'],
            'sort_order'     => ['int',    'sort_order = :sort_order'],
            'is_active'      => ['int',    'is_active = :is_active'],
        ];

        foreach ($map as $key => [$type, $sql]) {
            if (isset($body[$key])) {
                $fields[] = $sql;
                $params[":$key"] = $type === 'int'
                    ? (int)$body[$key]
                    : sanitize((string)$body[$key]);
            }
        }

        if (!$fields) jsonResponse(['error' => 'Nothing to update'], 400);

        $params[':id'] = $id;
        $pdo->prepare("UPDATE slides SET " . implode(', ', $fields) . " WHERE id = :id")
            ->execute($params);

        jsonResponse(['success' => true, 'message' => 'Slide updated']);
        break;

    // ── DELETE (soft) ─────────────────────────────────────
    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'id is required'], 400);
        $pdo->prepare("UPDATE slides SET is_active = 0 WHERE id = ?")
            ->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Slide deleted']);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
