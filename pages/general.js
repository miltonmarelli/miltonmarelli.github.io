const url = 'https://resultados.mininterior.gob.ar/desarrollo';
const urlServicio = 'https://resultados.mininterior.gob.ar/api/resultados/getResultados';
const tipoEleccion = 2;
const tipoRecuento = 1;
let elecciones = [];
const periodosSelect = document.getElementById('anio');
const cargoSelect = document.getElementById('cargo');
const distritoSelect = document.getElementById('distrito');
const SeccionProvincial = document.getElementById('hdSeccionProvincial');
const seccionSelect = document.getElementById('seccion');
let selectedCargo;
const valorPredeterminado = "";
////////////////////////////////IMAGEN PRINCIPAL//////////////////////
function cargarImagen() {
  const rutaImagen = '/img/f-procesamiento-de-datos-power-bi.jpg';
  const contenedorImagen = document.createElement('div');
  contenedorImagen.id = 'contenedorImagen';
  contenedorImagen.style.position = 'relative'; 

  const imgElement = document.createElement('img');
  imgElement.src = rutaImagen;
  imgElement.alt = 'Seleccione los valores y haga click en Filtrar';
  imgElement.id = 'imagenInicio';
  imgElement.style.width = '100%';
  imgElement.style.height = '80hv'; 

  const mensaje = document.createElement('div');
  mensaje.textContent = 'Debe seleccionar todos los valores a filtrar y hacer clic en el botón FILTRAR';
  mensaje.style.position = 'absolute';
  mensaje.style.top = '10px'; 
  mensaje.style.left = '50%';
  mensaje.style.transform = 'translateX(-50%)'; 
  mensaje.style.backgroundColor = 'rgba(255, 255, 0, 0.7)'; 
  mensaje.style.padding = '10px';
  mensaje.style.borderRadius = '5px';

  contenedorImagen.appendChild(imgElement);
  contenedorImagen.appendChild(mensaje);

  
  const mainElement = document.querySelector('main');
  mainElement.style.display = 'none';
  const contenedorElement = document.getElementById('imgPrincipal');
  contenedorElement.appendChild(contenedorImagen);
}

///////////////////////ocultar botones////////////////////
function ocultarbotones() {
  document.getElementById('boton_2').style.display = 'none';
  document.getElementById('boton_1').style.display = 'none';
  document.getElementById('boton_3').style.display = 'none';
  document.getElementById('mensajeAdvertencia').innerHTML =' Debe seleccionar todos los valores a filtrar y hacer clic en el botón FILTRAR';
  document.getElementById('mensajeAdvertencia').style.display= 'inline' ;
}

///////////////////////////combos////////////////////////////////////////////

async function obtenerPeriodos() {
  try {
    const response = await fetch('https://resultados.mininterior.gob.ar/api/menu/periodos');
    if (response.ok) {
      const periodos = await response.json();
      //periodosSelect.innerHTML = ''; 

      console.log('Periodos:', periodos);

      periodos.forEach((periodo) => {
        const opcion = document.createElement('option');
        opcion.value = periodo;
        opcion.text = periodo;
        periodosSelect.appendChild(opcion);
      });
    } else {
      throw new Error('Error en la consulta');
    }
  } catch (error) {
    console.log('Error: ' + error.message); 
  }
}

async function cargarCargos() {
  try {
    const selectedAnio = periodosSelect.value;
    selectedCargoId = cargoSelect.value;
    const cargosResponse = await fetch('https://resultados.mininterior.gob.ar/api/menu?año=' + selectedAnio);
    if (!cargosResponse.ok) {
      throw new Error('Error en la consulta de cargos');
    }
    const cargosData = await cargosResponse.json();
    cargoSelect.innerHTML = ''; 
    distritoSelect.innerHTML = ''; 
    seccionSelect.innerHTML = ''; 

    elecciones = cargosData.filter((eleccion) => eleccion.IdEleccion === tipoEleccion);
    console.log('Cargos filtrados:', elecciones); 
    elecciones[0].Cargos.forEach((cargo) => {
      const opcion = document.createElement('option');
      opcion.value = cargo.IdCargo;
      opcion.text = cargo.Cargo;
      cargoSelect.appendChild(opcion);

    });
  } catch (error) {
    console.log('Error: ' + error.message); 
  }
}

function cargarDistritos() {
  distritoSelect.innerHTML = '';
  const selectedCargoId = cargoSelect.value;
  selectedCargo = elecciones[0].Cargos.find((cargo) => cargo.IdCargo === selectedCargoId);

   if (selectedCargo && selectedCargo.Distritos) {
     selectedCargo.Distritos.forEach((distrito) => {
       const opcion = document.createElement('option');
       opcion.value = distrito.IdDistrito;
       opcion.text = distrito.Distrito;
       distritoSelect.appendChild(opcion);  
     });
   } else {
     console.log('No se encontraron distritos para este cargo.');
   }
  
 }

 function cargarSecciones() {
  seccionSelect.innerHTML = '';

  const selectedCargoId = cargoSelect.value;
  const selectedDistritoId = distritoSelect.value;
  
  const SeccionProvincial = document.getElementById('hdSeccionProvincial');
  const seleccionProvincial= selectedCargo.Distritos.find((D) => D.IdDistrito == selectedDistritoId ).SeccionesProvinciales[0].IDSeccionProvincial;
  SeccionProvincial.value = seleccionProvincial;
  console.log("SeccionProvincial : ", SeccionProvincial.value);

  const secciones = selectedCargo.Distritos.find((D) => D.IdDistrito == selectedDistritoId ).SeccionesProvinciales[0].Secciones;
  console.log('SECCIONES :',secciones)
   secciones.forEach((seccion) => {
    const opcion = document.createElement('option');
    opcion.value = seccion.IdSeccion;
    opcion.text = seccion.Seccion;
    seccionSelect.appendChild(opcion);
   });
 }
 
 ///////////////////////boton filtro ///////////////////////////////
 async function filtrarResultados() {
    const anioEleccion = document.getElementById('anio').value;
    const tipoRecuento = 1; 
    const tipoEleccion = 2; 
    const categoriaId = cargoSelect.value;
    const Categoriatxt = cargoSelect.options[cargoSelect.selectedIndex].innerText;
    const distritoId = distritoSelect.value;
    const distritotxt = distritoSelect.options[distritoSelect.selectedIndex].innerText;
    const seccionProvincialId = SeccionProvincial.value;
    const seccionId = seccionSelect.value;
    const seccionSelecttxt = seccionSelect.options[seccionSelect.selectedIndex].innerText;
    console.log('Categoria :', Categoriatxt )
    console.log('Distrito :', distritotxt )
    console.log('Seccion :', seccionSelecttxt )

    if (anioEleccion === "anio" || categoriaId === "cargo" ||distritoId === "distrito" || seccionId === "seccion")
    {
      document.getElementById('mensajeAdvertencia').innerHTML = ' Solicitud Incompleta';
      document.getElementById('mensajeAdvertencia').style.display = 'block';
      document.getElementById('mensajeAdvertencia').style.backgroundColor= 'yellow';
      return;
    }
    let resultados;
    try {
      console.log('URL FETCH',`${urlServicio}?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${valorPredeterminado}&mesaId=${valorPredeterminado}`)
      const response = await fetch(`${urlServicio}?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${valorPredeterminado}&mesaId=${valorPredeterminado}`);
      if (response.ok) {
        /////////pantalla inicio//////////////////////
        const mainElement = document.querySelector('main');
        mainElement.style.display = 'block';
  
        const contenedorImagenElement = document.getElementById('contenedorImagen');
        contenedorImagenElement.style.display = 'none';
        ///////////////////////////////////////////////////
        resultados= await response.json();
        console.log('Resultados filtrados:', resultados);
        const titulo = document.getElementById('titulo');
        titulo.style.display= 'block';
        const periodo = document.getElementById('anio').value;
        titulo.textContent = `Elecciones ${periodo} | Generales`;

        document.getElementById('mensajeAdvertencia').style.display = 'none';
        const subtitulo = document.getElementById('subtitulo');
        subtitulo.style.display = 'block';
        const tipoEleccion = 'Generales';
        const cargo = Categoriatxt ;
        const distrito = distritotxt;
        const seccion = seccionSelecttxt;
        subtitulo.textContent = `${periodo} > ${tipoEleccion} > ${cargo} > ${distrito} > ${seccion}`;

        const mesasComputadas = document.getElementById('mesas_computadas_valor');
        mesasComputadas.innerHTML = `${resultados.estadoRecuento.mesasTotalizadas}`;
        const electores = document.getElementById('electores_valor');
        electores.innerHTML = `${resultados.estadoRecuento.cantidadElectores}`;
        const participacion = document.getElementById('participacion_escriturado_valor');
        participacion.innerHTML = `${resultados.estadoRecuento.participacionPorcentaje}`;

        var contenedorMapa = document.getElementById(`maps`);
        var svgMapa = provincias[distritoId];
        contenedorMapa.innerHTML = svgMapa;

      } else {
        document.getElementById('mensajeAdvertencia').style.display = 'none';
        document.getElementById('mensajeError').innerHTML = 'No se encontró información para la consulta realizada.';
        document.getElementById('mensajeError').style.display = 'block';
        document.getElementById('mensajeError').style.backgroundColor= 'yellow';
        throw new Error('Error al obtener los resultados');
      }
    } catch (error) {
      document.getElementById('mensajeAdvertencia').style.display = 'none';
      document.getElementById('mensajeError').innerHTML = `Error: ${error.message}`;
      document.getElementById('mensajeError').style.display = 'block';
      document.getElementById('mensajeError').style.backgroundColor= 'red';
      console.error('Error: ' + error.message);
    }
    grafico(resultados)
  }
//////////////////AGREGAR INFORME ///////////////////////////////////////
async function agregarInforme() {
  const informesArray = JSON.parse(localStorage.getItem('INFORMES')) || [] ;
  const nuevoInforme = {
    anioEleccion : document.getElementById('anio').value,
    tipoRecuento : 1, 
    tipoEleccion : 2, 
    categoriaId : cargoSelect.value,
    Categoriatxt : cargoSelect.options[cargoSelect.selectedIndex].innerText,
    distritoId : distritoSelect.value,
    distritotxt : distritoSelect.options[distritoSelect.selectedIndex].innerText,
    seccionProvincialId : SeccionProvincial.value,
    seccionId : seccionSelect.value,
    seccionSelecttxt : seccionSelect.options[seccionSelect.selectedIndex].innerText
  };
   console.log('INFORME : ',nuevoInforme)

  if (informesArray.includes(JSON.stringify(nuevoInforme))) {
    document.getElementById('boton_2').style.display = 'none';
    document.getElementById('boton_1').style.display = 'none';
    document.getElementById('boton_3').style.display = 'block';
    console.log('Este informe ya existe');
  } else {
      informesArray.push(JSON.stringify(nuevoInforme));
      localStorage.setItem('INFORMES', JSON.stringify(informesArray));

      document.getElementById('boton_1').style.display = 'block';
      document.getElementById('boton_2').style.display = 'none';
      document.getElementById('boton_3').style.display = 'none';
      console.log('Informe agregado ');
  }
}
// ////////////////////GRAFICAS////////////////////////////////
   function grafico(resultados) {
    const valoresTotalizadosPositivos = resultados.valoresTotalizadosPositivos;
    console.log('JSON para Grafica:', valoresTotalizadosPositivos);
  
    const contenedorScroll = document.querySelector('.scroll');
    contenedorScroll.innerHTML = ''; 
    for (let i = 0; i < valoresTotalizadosPositivos.length; i++) {
      const nombreAgrupacion = valoresTotalizadosPositivos[i].nombreAgrupacion;
      console.log('nombredeagrup', nombreAgrupacion)
      const porcentajeAgrupacion = valoresTotalizadosPositivos[i].votosPorcentaje;
      console.log('% ', porcentajeAgrupacion)
      const votosAgrupacion = valoresTotalizadosPositivos[i].votos;
      console.log('votosagrup',votosAgrupacion)  
      const colorPleno = coloresAgrupaciones[i].colorPleno;
      const colorSuave = coloresAgrupaciones[i].colorSuave; 

      const titulo_Barra = document.createElement('div');
      titulo_Barra.className = `titulo_barra${i + 1}`;
      titulo_Barra.style.display = 'flex'; 
      titulo_Barra.style.justifyContent = 'space-between'; 
      titulo_Barra.style.margin = '10px';
      titulo_Barra.innerHTML = `
        <p id="nombreAgrupacion${i + 1}">${nombreAgrupacion}</p>
        <div class="porcent${i + 1}">
          <p id="porcentAgrupacion${i + 1}">${porcentajeAgrupacion}%</p>
          <p id="votosAgrupacion${i + 1}">${votosAgrupacion} votos</p>
        </div>`;
  
      const progressBar = document.createElement('div');
      progressBar.className = `progress-bar${i + 1}`;
      progressBar.setAttribute('role', 'progressbar');
      progressBar.style.backgroundColor = colorPleno;
      progressBar.style.color = colorSuave;
      progressBar.style.width = `${porcentajeAgrupacion}%`;
  
      const progressDiv = document.createElement('div');
      progressDiv.className = 'progress';
      progressDiv.appendChild(progressBar);
      titulo_Barra.appendChild(progressDiv);
      contenedorScroll.appendChild(titulo_Barra);
    }
    for (let i = 0; i < Math.min(valoresTotalizadosPositivos.length, 7); i++) {
      const nombreAgrupacion = resultados.valoresTotalizadosPositivos[i].nombreAgrupacion;
      const porcentajeAgrupacion = resultados.valoresTotalizadosPositivos[i].votosPorcentaje;
      const colorPleno = coloresAgrupaciones[i].colorPleno;
      document.getElementById(`bar${i+1}`).setAttribute('data-name', nombreAgrupacion);
      document.getElementById(`bar${i+1}`).style.setProperty('--bar-value', `${porcentajeAgrupacion}%`);
      document.getElementById(`bar${i+1}`).style.setProperty('--bar-color', `${colorPleno}` );
    }
  }
