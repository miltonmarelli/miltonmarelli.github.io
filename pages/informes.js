async function obtenerResultados() {
    const informeAlmacenado = JSON.parse(localStorage.getItem('INFORMES'));
    console.log('INFORME ALMACENADO : ', informeAlmacenado)

    if (!informeAlmacenado) {
        document.querySelector('.contbotton').style.display = 'block';
        document.getElementById('boton_3').style.display = 'block';
        console.log('No hay informes guardados para mostrar');
    } else {
        let index = 1;
        const valorPredeterminado = null;
        for (let i = 0; i < informeAlmacenado.length; i++) {
            const informe = JSON.parse(informeAlmacenado[i]);;
            const urlServicio = 'https://resultados.mininterior.gob.ar/api/resultados/getResultados';
            const { anioEleccion, tipoRecuento, tipoEleccion, categoriaId, distritoId, seccionProvincialId, seccionId , Categoriatxt , distritotxt , seccionSelecttxt} = informe;
            console.log('Valores del informe:',{ anioEleccion, tipoRecuento, tipoEleccion, categoriaId, distritoId, seccionProvincialId, seccionId ,  seccionId , Categoriatxt , distritotxt , seccionSelecttxt});

            const response = await fetch(`${urlServicio}?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}`);
            const resultados = await response.json();
            console.log('RESULTADOS : ', resultados);

            const nuevoInforme = document.createElement('section');
            nuevoInforme.id = `informe${index}`;
            nuevoInforme.classList.add('contenido');
            document.getElementById(`main`).appendChild(nuevoInforme);
            ////////////////////////////////////////////////////////////////////////////////

            var contenedorMapa =  document.createElement('div');
            contenedorMapa.id = `mapas${index}`;
            contenedorMapa.classList.add('svg');
            contenedorMapa.innerHTML = provincias[distritoId];
            document.getElementById(`informe${index}`).appendChild(contenedorMapa);
            ///////////////////////////////////////////////////////////////////////////////
            

            const detalleDiv = document.createElement('div');
            detalleDiv.id = `detalle${index}`;
            document.getElementById(`informe${index}`).appendChild(detalleDiv);
            detalleDiv.classList.add('elecc');

            detalleDiv.innerHTML = `
                <p class="pala-grande" id="elec-anio"><b>Elecciones ${anioEleccion} | ${tipoEleccion === 1 ? 'PASO' : 'Generales'}</b></p>
                <p class="pala" id="Anioelec"><a>${anioEleccion} ></a></p>
                <p class="pala"><a>${Categoriatxt} ></a></p>
                <p class="pala" id="cargoelec"><a>${distritotxt} ></a></p>
                <p class="pala"><a>${seccionSelecttxt} ></a></p> `;

            /////////////////////////////////////////////////////////////////////////////////////

            const divBotones = document.createElement('div');
            divBotones.id = `botones${index}`;
            document.getElementById(`informe${index}`).appendChild(divBotones);
            divBotones.classList.add('botones');
            
            const mesasComputadas = document.createElement('div');
            mesasComputadas.id = `mesasescrit${index}`;
            document.getElementById(`botones${index}`).appendChild(mesasComputadas);
            mesasComputadas.classList.add('mesas_computadas');
            mesasComputadas.innerHTML = `<img src="img/icons/img.svg" alt="iconosvg" class="icon_botones"> Mesas Computadas ${resultados.estadoRecuento.mesasTotalizadas}`;
            
            const electores = document.createElement('div');
            electores.id = `electoress${index}`;
            document.getElementById(`botones${index}`).appendChild(electores);
            electores.classList.add('electores');
            electores.innerHTML = `<img id="electores" src="img/icons/manitos.svg" alt="iconosvg" class="icon_botones"> Electores ${resultados.estadoRecuento.cantidadElectores}`;
            
            const participacion = document.createElement('div');
            participacion.id = `escriturad${index}`;
            document.getElementById(`botones${index}`).appendChild(participacion);
            participacion.classList.add('p_escriturado');
            participacion.innerHTML = `<img src="img/icons/personitas.svg" alt="iconosvg" class="icon_botones"> Participacion Sobre el escriturado ${resultados.estadoRecuento.participacionPorcentaje}%`;

            ////////////////////////////////////////////////////////////////////////////

            const candidatos = document.createElement('div');
            candidatos.id = `datosdatos${index}`;
            document.getElementById(`informe${index}`).appendChild(candidatos);
            candidatos.classList.add('candidatos');

            const porcentajes = document.createElement('div');
            porcentajes.id = `porcentajeagrup${index}`;
            document.getElementById(`informe${index}`).appendChild(porcentajes);
            porcentajes.classList.add('porcentajes');

            resultados.valoresTotalizadosPositivos.forEach((agrupacion, i) => {
                const nombreAgrupacion = agrupacion.nombreAgrupacion;

                const nombreAgrupacionElement = document.createElement('p');
                nombreAgrupacionElement.innerHTML = `<b>${nombreAgrupacion}</b>`;
                candidatos.appendChild(nombreAgrupacionElement);

                if (tipoEleccion === 1) {
                agrupacion.listas.forEach((partido, j) => {
                    const nombrePartido = partido.nombre;
                    const votosPartido = partido.votos;
                    const porcentajeVotos = (votosPartido * 100) / agrupacion.votos;

                    const nombrePartidoElement = document.createElement('p');
                    nombrePartidoElement.innerHTML = nombrePartido;
                    candidatos.appendChild(nombrePartidoElement);

                    const porcentajeVotosElement = document.createElement('p');
                    porcentajeVotosElement.innerHTML = `${porcentajeVotos.toFixed(2)}%`;
                    porcentajes.appendChild(porcentajeVotosElement);

                    const votosPartidoElement = document.createElement('p');
                    votosPartidoElement.innerHTML = `${votosPartido} votos`;
                    porcentajes.appendChild(votosPartidoElement);
                });
            }
            else {
                const porcentajeAgrupacion = agrupacion.votosPorcentaje;      
                const votosAgrupacion = agrupacion.votos;
                const porcentajeVotosElement = document.createElement('p');
                porcentajeVotosElement.innerHTML = `${porcentajeAgrupacion.toFixed(2)}%`;
                porcentajes.appendChild(porcentajeVotosElement);

                const votosPartidoElement = document.createElement('p');
                votosPartidoElement.innerHTML = `${votosAgrupacion} votos`;
                porcentajes.appendChild(votosPartidoElement);
            }
            });
            index++;
        }
    }
}

