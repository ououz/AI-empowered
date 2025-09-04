<!-- 文件2: posting/_data/save-post.php -->
<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$filename = 'post-' . $data['meta']['id'] . '.json';

try {
    if (!file_exists(__DIR__ . '/_data')) {
        mkdir(__DIR__ . '/_data', 0777, true);
    }
    
    $filePath = __DIR__ . '/_data/' . $filename;
    $data['meta']['id'] = (string)$data['meta']['id']; // 确保ID为字符串
    
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    
    echo json_encode([
        'success' => true,
        'filename' => $filename,
        'message' => '帖子保存成功'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '文件保存失败: ' . $e->getMessage()
    ]);
}