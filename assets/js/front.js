      let contenedor = document.querySelector("#contenedorimagenes");
      let canciones = [];
      let indexActivo = 0;

      let audio = new Audio();
      let rango = document.getElementById("rango");
      let temporizador;

      function actualizarModal(){
        let pieza = canciones[indexActivo];
        document.querySelector("#modal img").src = pieza.portada;
        document.querySelector("#modal h3").textContent = pieza.titulo;
        audio.src = pieza.audio;
        audio.currentTime = 0;
        rango.value = 0;
      }

      function bucle(){
        rango.value = (audio.currentTime*100)/audio.duration;
        clearTimeout(temporizador);
        temporizador = setTimeout(bucle, 500);
        if(rango.value >= 100){
          clearTimeout(temporizador);
        }
      }

      fetch("backend/endpoint.php")
        .then(res => res.json())
        .then(datos => {
          canciones = datos;
          datos.forEach((pieza, i) => {
            contenedor.innerHTML += `
              <div class="pieza" data-index="${i}">
                <div class="pieza-titulo">
                  <span>${pieza.titulo}</span>
                </div>
                <img src="${pieza.portada}" alt="${pieza.titulo}">
              </div>
            `;
          });

        document.querySelectorAll(".pieza").forEach(div => {
          div.onclick = function(){
            indexActivo = parseInt(this.dataset.index);
            actualizarModal();
            document.querySelector("#contenedormodal").style.display = "flex";
          }
        });
      });

      document.querySelector("#contenedormodal").onclick = function(e){
        if(e.target.id === "contenedormodal"){
          this.style.display = "none";
          audio.pause();
          clearTimeout(temporizador);
        }
      }

      document.getElementById("play").onclick = function(){
        audio.play();
        temporizador = setTimeout(bucle, 500);
      }

      document.getElementById("pausa").onclick = function(){
        audio.pause();
        clearTimeout(temporizador);
      }

      rango.addEventListener("change", ()=>{
        audio.currentTime = rango.value * audio.duration / 100;
      });

      document.getElementById("siguiente").onclick = function(event){
        if(indexActivo < canciones.length -1) indexActivo++;
        actualizarModal();
        event.stopPropagation();
      }

      document.getElementById("anterior").onclick = function(event){
        if(indexActivo > 0) indexActivo--;
        actualizarModal();
        event.stopPropagation();
      }
      document.getElementById("cerrarModal").onclick = function() {
        document.querySelector("#contenedormodal").style.display = "none";
        audio.pause();
        clearTimeout(temporizador);
      };