let contenedor = document.querySelector("#contenedorimagenes");
let canciones = [];
let indexActivo = 0;

let audio = new Audio();
let rango = document.getElementById("rango");
let tiempoActual = document.getElementById("tiempoActual");
let duracionTotal = document.getElementById("duracionTotal");


let arrastrando = false; 


function formatoTiempo(segundos){
  if (isNaN(segundos)) return "0:00";
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min}:${seg < 10 ? '0'+seg : seg}`;
}

function actualizarModal(){
  const pieza = canciones[indexActivo];
  document.querySelector("#modal img").src = pieza.portada;
  document.querySelector("#modal h3").textContent = pieza.titulo;
  
  audio.src = pieza.audio;
  rango.value = 0;
  tiempoActual.textContent = "0:00";
  duracionTotal.textContent = "0:00";
}

audio.addEventListener("loadedmetadata", () => {
  duracionTotal.textContent = formatoTiempo(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!arrastrando) {
    tiempoActual.textContent = formatoTiempo(audio.currentTime);
    rango.value = (audio.currentTime / audio.duration) * 100 || 0;
  }
});

rango.addEventListener("input", () => {
  arrastrando = true; 
  if (audio.duration) {
    const nuevoTiempo = (rango.value / 100) * audio.duration;
    tiempoActual.textContent = formatoTiempo(nuevoTiempo);
  }
});

rango.addEventListener("change", () => {
  if (audio.duration) {
    audio.currentTime = (rango.value / 100) * audio.duration;
  }
  arrastrando = false; 
});


fetch("backend/endpoint.php")
  .then(res => res.json())
  .then(datos => {
    canciones = datos;
    contenedor.innerHTML = datos.map((pieza, i) => `
      <div class="pieza" data-index="${i}">
        <div class="pieza-titulo"><span>${pieza.titulo}</span></div>
        <img src="${pieza.portada}" alt="${pieza.titulo}">
      </div>
    `).join('');

    document.querySelectorAll(".pieza").forEach(div => {
      div.onclick = () => {
        indexActivo = parseInt(div.dataset.index);
        actualizarModal();
        document.querySelector("#contenedormodal").style.display = "flex";
      }
    });
  });


document.getElementById("play").onclick = () => audio.play();
document.getElementById("pausa").onclick = () => audio.pause();

document.getElementById("siguiente").onclick = (e) => {
  if(indexActivo < canciones.length - 1) indexActivo++;
  actualizarModal();
  e.stopPropagation();
}

document.getElementById("anterior").onclick = (e) => {
  if(indexActivo > 0) indexActivo--;
  actualizarModal();
  e.stopPropagation();
}

document.getElementById("cerrarModal").onclick = () => {
  document.querySelector("#contenedormodal").style.display = "none";
  audio.pause();
}

document.querySelector("#contenedormodal").onclick = (e) => {
  if(e.target.id === "contenedormodal"){
    document.querySelector("#contenedormodal").style.display = "none";
    audio.pause();
  }
}