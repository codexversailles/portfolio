<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

$musicDir = __DIR__ . '/assets/music';
$tracks = [];

if (is_dir($musicDir)) {
    $files = scandir($musicDir);
    $supportedExts = ['mp3', 'm4a', 'wav', 'ogg', 'aac', 'flac'];
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $musicDir . '/' . $file;
        if (is_file($path)) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, $supportedExts, true)) {
                $rawTitle = pathinfo($file, PATHINFO_FILENAME);
                // Clean up title for elegant UI display
                $cleanTitle = preg_replace('/\s*[\(\[](?:Official\s+(?:Audio|Video|Music\s+Video|Lyric\s+Video)|Audio|Lyrics|Visualizer|HD|HQ)[\)\]]\s*/i', '', $rawTitle);
                $cleanTitle = trim($cleanTitle);

                $tracks[] = [
                    'filename' => $file,
                    'title'    => $cleanTitle ?: $rawTitle,
                    'src'      => 'assets/music/' . rawurlencode($file)
                ];
            }
        }
    }
}

echo json_encode($tracks, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
