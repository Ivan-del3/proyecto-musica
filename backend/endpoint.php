<?php
header('Content-Type: application/json; charset=utf-8');
$basededatos = new SQLite3(__DIR__ . '/db/musica.db');;

$resultado = $basededatos->query('SELECT * FROM piezas');
$piezas = [];

while ($fila = $resultado->fetchArray(SQLITE3_ASSOC)) {
    $piezas[] = $fila;
}

echo json_encode($piezas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);