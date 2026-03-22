<?php
$basededatos = new SQLite3(__DIR__ . '/db/musica.db');

$basededatos->exec("
CREATE TABLE IF NOT EXISTS piezas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portada TEXT NOT NULL,
    audio TEXT NOT NULL,
    titulo TEXT NOT NULL
)");

// Crear carpetas si no existen (ruta relativa para php)
if(!is_dir('../uploads/images/')) mkdir('../uploads/images/', 0777, true);
if(!is_dir('../uploads/music/')) mkdir('../uploads/music/', 0777, true);

// Función para limpiar nombres de archivos
function limpiarNombre($nombre) {
    $nombre = str_replace(' ', '_', $nombre);
    $nombre = preg_replace('/[^A-Za-z0-9\._\-]/', '', $nombre);
    return $nombre;
}

// AÑADIR NUEVA CANCIÓN

if(isset($_POST['accion']) && $_POST['accion'] === 'crear' && isset($_FILES['portada']) && isset($_FILES['audio'])){
    $titulo = $_POST['titulo'];
    $nombre_limpio = limpiarNombre(basename($_FILES['portada']['name']));
    $portada_nombre = time() . '_' . $nombre_limpio;
    $portada_db = 'uploads/images/' . $portada_nombre; // Ruta para db
    $portada_fisica = '../' . $portada_db;             // Ruta para php
    move_uploaded_file($_FILES['portada']['tmp_name'], $portada_fisica);

    $audio_limpio = limpiarNombre(basename($_FILES['audio']['name']));
    $audio_nombre = time() . '_' . $audio_limpio;
    $audio_db = 'uploads/music/' . $audio_nombre;
    $audio_fisica = '../' . $audio_db;
    move_uploaded_file($_FILES['audio']['tmp_name'], $audio_fisica);

    $stmt = $basededatos->prepare("INSERT INTO piezas (portada, audio, titulo) VALUES (:portada, :audio, :titulo)");
    $stmt->bindValue(':portada', $portada_db, SQLITE3_TEXT);
    $stmt->bindValue(':audio', $audio_db, SQLITE3_TEXT);
    $stmt->bindValue(':titulo', $titulo, SQLITE3_TEXT);
    $stmt->execute();

    header("Location: ../panel.html"); 
    exit;
}

// ELIMINAR CANCIÓN

if(isset($_GET['accion']) && $_GET['accion']=='eliminar' && isset($_GET['id'])){
    $id = (int)$_GET['id'];
    $fila = $basededatos->query("SELECT * FROM piezas WHERE id=$id")->fetchArray(SQLITE3_ASSOC);
    if($fila){
        // Ruta relativa para que php pueda encontrar el archivo
        if(file_exists('../' . $fila['portada'])) unlink('../' . $fila['portada']);
        if(file_exists('../' . $fila['audio'])) unlink('../' . $fila['audio']);
        
        $basededatos->exec("DELETE FROM piezas WHERE id=$id");
        header("Location: ../panel.html");
        exit;
    }
}

// EDITAR CANCIÓN
if(isset($_POST['accion']) && $_POST['accion'] === 'editar' && isset($_POST['editar_id'])){
    $id = (int)$_POST['editar_id'];
    $fila = $basededatos->query("SELECT * FROM piezas WHERE id=$id")->fetchArray(SQLITE3_ASSOC);

    $titulo = $_POST['titulo'] ?? $fila['titulo'];
    $portada_db = $fila['portada'];
    $audio_db = $fila['audio'];

    // Actualizar portada si se ha añadido en el form
    if(isset($_FILES['portada']) && $_FILES['portada']['name'] != ""){
        if(file_exists('../' . $fila['portada'])) unlink('../' . $fila['portada']);

        $nombre_limpio = limpiarNombre(basename($_FILES['portada']['name']));
        $portada_nombre = time() . '_' . $nombre_limpio;
        $portada_db = 'uploads/images/' . $portada_nombre;
        $portada_fisica = '../' . $portada_db;
        move_uploaded_file($_FILES['portada']['tmp_name'], $portada_fisica);
    }

    // Actualizar el audio si se ha añadido en el form
    if(isset($_FILES['audio']) && $_FILES['audio']['name'] != ""){
        if(file_exists('../' . $fila['audio'])) unlink('../' . $fila['audio']);
        
        $audio_limpio = limpiarNombre(basename($_FILES['audio']['name']));
        $audio_nombre = time() . '_' . $audio_limpio;
        $audio_db = 'uploads/music/' . $audio_nombre;
        $audio_fisica = '../' . $audio_db;
        move_uploaded_file($_FILES['audio']['tmp_name'], $audio_fisica);
    }

    $stmt = $basededatos->prepare("UPDATE piezas SET portada=:portada, audio=:audio, titulo=:titulo WHERE id=:id");
    $stmt->bindValue(':portada', $portada_db, SQLITE3_TEXT);
    $stmt->bindValue(':audio', $audio_db, SQLITE3_TEXT);
    $stmt->bindValue(':titulo', $titulo, SQLITE3_TEXT);
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $stmt->execute();

    header("Location: ../panel.html");
    exit;
}