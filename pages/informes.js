var localJson;


document.addEventListener('DOMContentLoaded', function () {



    var storageActual = localStorage.getItem('INFORMES');
    let mensajito;
    console.log(storageActual);

    if (!storageActual) {

        mensajito = 'amarillo';
        crearMensaje(mensajito, 'No hay informes guardados para mostrar');

    }
    else {

        localJson = JSON.parse(storageActual);
        console.log(localJson);
        cargarHtml();

    }


});


function cargarHtml() {

    localJson.forEach(element => {
    getElementById('elec-anio').innerHTML = `Elecciones ${element.año}| ${element.tipo}`;
    getElementById('Anioelec').innerHTML = `${element.año} > `
    getElementById('cargoelec').innerHTML = `${element.cargo} >`
    getElementById('mesasescrit').innerHTML = `<p>Mesas Escrutadas ${element.informe.estadoRecuento.mesasTotalizadas}</p>`
    getElementById('electoress').innerHTML = `<p>Electores ${element.informe.estadoRecuento.cantidadElectores}</p>`
    getElementById('escriturad').innerHTML = `<p>Participacion sobre escrutado ${element.informe.estadoRecuento.participacionPorcentaje}%</p>`
    element.informe.valoresTotalizadosPositivos.forEach(agrupacion => {
        getElementById('datosdatos').innerHTML =`<p>${agrupacion.nombreAgrupacion}</p>`
        getElementById('porcentajeagrup').innerHTML =`<p>${agrupacion.votosPorcentaje}%<br> ${agrupacion.votos} votos</p>`

        })
    });
}



function crearMensaje(mensajito, texto) {

    const colorMensaje = document.getElementById('color-mensaje');
    const valorMensaje = document.getElementById('valor-mensaje');

    if (mensajito == 'verde') {
        colorMensaje.setAttribute('class', 'exito');
        valorMensaje.setAttribute('class', 'fas fa-thumbs-up');
        valorMensaje.innerText = texto; //'Datos cargados correctamente'
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }

    if (mensajito == 'amarillo') {
        colorMensaje.setAttribute('class', 'exclamacion');
        valorMensaje.setAttribute('class', 'fas fa-exclamation');
        valorMensaje.innerText = texto; //'No hay informes guardados para mostrar'
        setTimeout(function () {
            colorMensaje.setAttribute('class', 'hidden');
        }, 4000)
    }
}
