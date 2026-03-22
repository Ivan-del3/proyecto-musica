# Proyecto reproductor de Música

Este proyecto es un **reproductor de música** que permite reproducir y administrar canciones. 
- Los **usuarios** pueden escuchar las canciones en un reproductor con portada y control de reproducción.
- Los **administradores** pueden agregar, editar o eliminar canciones desde un panel de control.

## Características

- Reproductor de música en el front-end con control de reproducción y progreso.
- Modal para mostrar la canción seleccionada con portada y título.
- Panel de administración para:
  - Añadir nuevas canciones (portada, archivo de audio y título).
  - Editar canciones existentes.
  - Eliminar canciones.
- Persistencia de datos usando **SQLite**.

## Tecnologías utilizadas

- **HTML5 / CSS3 / JavaScript** – para el front-end y la interactividad.
- **PHP** – para el back-end y manejo de archivos.
- **SQLite** – para la base de datos ligera y local.
- **Sistema de archivos** – para almacenar imágenes y archivos de audio en carpetas `/uploads/images/` y `/uploads/music/`.

## Estructura del proyecto

```
/proyecto-musica
│
├── assets
│   ├── css
│   ├── js
│   └── img
│
├── uploads
│   ├── images
│   └── music
│
├── backend
│   ├── panelCRUD.php
│   ├── endpoint.php
│   └── db
│       └── musica.db
│
├── panel.html
└── front.html
```