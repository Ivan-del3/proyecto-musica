// panel.js
const tabla = document.querySelector("#tablaCanciones tbody");
const btnCrear = document.getElementById('mostrarCrear');
const form = document.getElementById('formulario');
const tituloForm = document.getElementById('tituloForm');
const inputEditar = form.querySelector('input[name="editar_id"]');
const inputTitulo = form.querySelector('input[name="titulo"]');
const inputPortada = form.querySelector('input[name="portada"]');
const inputAudio = form.querySelector('input[name="audio"]');
const submitBtn = form.querySelector('input[type="submit"]');

// oculto al cargar la página
form.style.display = 'none';

function cargarTabla() {
  fetch("backend/endpoint.php")
    .then(res => res.json())
    .then(piezas => {
      tabla.innerHTML = ''; 
      piezas.forEach(fila => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${fila.portada}" width="100"></td>
          <td><audio controls src="${fila.audio}"></audio></td>
          <td>${fila.titulo}</td>
          <td>
            <span class="editar" data-id="${fila.id}">✏️</span>
            <a class="eliminar" href="backend/panelCRUD.php?accion=eliminar&id=${fila.id}">❌</a>
          </td>
        `;
        tabla.appendChild(tr);
      });

      document.querySelectorAll('.editar').forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          const fila = piezas.find(p => p.id == id);
          if(fila){
            form.style.display = 'block';
            tituloForm.textContent = 'Editar canción';
            inputEditar.value = fila.id;
            inputTitulo.value = fila.titulo;
            inputPortada.required = false;
            inputAudio.required = false;
            submitBtn.value = 'editar';
          }
        }
      });

      document.querySelectorAll('.eliminar').forEach(a => {
        a.onclick = (e) => {
          if(!confirm('¿Seguro que quieres eliminar esta canción?')){
            e.preventDefault();
          }
        }
      });
    });
}

btnCrear.onclick = () => {
  form.style.display = 'block';
  tituloForm.textContent = 'Agregar nueva canción';
  inputEditar.value = '';
  inputTitulo.value = '';
  inputPortada.value = '';
  inputAudio.value = '';
  inputPortada.required = true;
  inputAudio.required = true;
  submitBtn.value = 'crear';
};

document.getElementById('cerrarForm').onclick = () => {
  form.style.display = 'none';
};

// Cargar tabla al iniciar
cargarTabla();