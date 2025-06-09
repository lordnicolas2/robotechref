"use strict"

const BASE_URL = "https://666b87c37013419182d396e2.mockapi.io/api/ranking";

// Asigno event listener al formulario de altas
let form = document.querySelector("#form"); 
form.addEventListener("submit", agregar); 

// Ni bien carga el sitio, se obtiene todo
let paginaActual = 1; //Variables para la paginación
const limite = 12;
obtener(paginaActual, limite);

async function agregar(e) {
    e.preventDefault();

    // Obtengo los datos del form
    let data = new FormData(form);

    // Creo el objeto JSON
    let piloto = {
        nombre: data.get("nombre"),
        batallas: Number(data.get("batallas")),
        victorias: Number(data.get("victorias")),
    }
    
    if (localStorage.getItem('ID')) {  //Editar un piloto si previamente se llamó la función "editar()" en donse se carga la variable del navegador
        try {  
            // Envío los datos del piloto al servicio REST
            let response = await fetch (BASE_URL + "/" + localStorage.getItem('ID'), {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(piloto),
            });
    
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
    
        } catch (error) {
            console.error ("Hubo un error: ", error);
        }
    } else{   //Agregar un piloto nuevo
        try {
            // Envío los datos del piloto al servicio REST
            let response = await fetch (BASE_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(piloto),
            });

        } catch {
            console.log(error);
        }
    }
    // Vuelvo a cargar la lista ya actualizada
    obtener(paginaActual, limite);
    //Limpio el formulario
    document.getElementById("form").reset();
    // Elimina el ID guardado en la variable del navegador
    localStorage.removeItem('ID');
    // Restaura los placeholders a su estado original previo a la modificación
    restaurarPlaceholders()
} 
    
//-------------------------------------------------------------------------------

//Paginación

//Listener de página anterior
document.getElementById('ant').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        obtener(paginaActual, limite);
    }
});

//Listener de página siguiente
document.getElementById('sig').addEventListener('click', () => {
    paginaActual++;
    obtener(paginaActual, limite);
});

function actualizarNroPagina() {
    document.getElementById('nroPagina').innerText = "Página " + paginaActual;
}


//------------------------------------------------------------------------------------------

//Obtiene los datos del API y con la función "mostrar()" los muestra
async function obtener(pagina, limite) {
    try {
        const url = new URL(BASE_URL + "?sortBy=victorias&order=desc");
        url.searchParams.append('page', pagina);
        url.searchParams.append('limit', limite);

        let response = await fetch(url);
            
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        let datos = await response.json();
        mostrar(datos);
        actualizarNroPagina();
    } catch (error) {
        console.log("Hubo un problema con la operación fetch: ", error); // Maneja errores en la operación
    }
}

//-----------------------------------------------------------------------------------------

function mostrar(ranking) {
    let lista = document.querySelector("#tabla-ranking");
    lista.innerHTML = '';
    for (let item of ranking) {
        let datoSeleccionado = item.id; //Obtiene el ID de cada fila
        let fila = "<tr>";
        fila += "<td>" + item.nombre + "</td>";
        fila += "<td>" + item.batallas + "</td>";
        fila += "<td>" + item.victorias + "</td>";
        fila += `<td id="editar">                               
                    <img src="imagenes/boton-modificar.png" alt="Modificar" onclick="editar(${datoSeleccionado})"> 
                    <img src="imagenes/boton-eliminar.png" alt="Eliminar" onclick="eliminar(${datoSeleccionado})">
                </td>`;                                 //Agrega las imágenes de Modificar y Eliminar y se les asigna un link a funcion "editar" y "eliminar"
        fila += "</tr>";        
        lista.innerHTML += fila;
    }
}

obtener(paginaActual, limite);

//----------------------------------------------------------------------------------------------

async function eliminar(dato) {
    try {
        console.log("Se eliminará la ID", dato);

        let response = await fetch (BASE_URL + "/" + dato, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }

        // Vuelvo a cargar la lista ya actualizada
        await obtener(paginaActual, limite);
    } catch (error) {
        console.error('Hubo un problema al eliminar el elemento:', error);
    }
}

//-----------------------------------------------------------------------------------------------------------

function editar (id) {
    localStorage.setItem('ID', id); //Almacena el ID en una variable del navegador
    cargarPlaceholders();
    console.log ("Se editarán los datos del ID: " + localStorage.getItem('ID'));
}

//--------------------------------------------------------------------------------

//Función para cargar en el formulario a modo de placeholders los datos antes de ser modificados
async function cargarPlaceholders() {
    if (!(localStorage.getItem('ID'))) 
        return;

    try {
        const response = await fetch (BASE_URL + "/" + localStorage.getItem('ID'), {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": 'application/json'
            }
        });

        if (response.ok) {
            const pilotoDatos = await response.json();
            document.getElementById("nombre").placeholder = pilotoDatos.nombre;
            document.getElementById("batallas").placeholder = pilotoDatos.batallas;
            document.getElementById("victorias").placeholder = pilotoDatos.victorias;
        } else {
            console.error ("Fallo en el fetch");
        }
    } catch (error) {
        console.error("Error eal traer los datos del piloto", error);
    }
}

//Restaura los placeholders a su estado original
function restaurarPlaceholders() {
    document.getElementById("nombre").placeholder = "Nombre";
    document.getElementById("batallas").placeholder = "Batallas";
    document.getElementById("victorias").placeholder = "Victorias";
}

//-------------------------------------------------------------------

//Filtrado por el campo "Batallas"

// Asigno event listener al formulario de búsqueda
document.getElementById("formBusqueda").addEventListener("submit", function(e) {
    e.preventDefault();
    realizarBusqueda();
});

async function realizarBusqueda() {
    const buscarBatallas = document.getElementById("buscarBatallas").value;
    await obtenerResultados(buscarBatallas);
    
    //Una vez mostrados los resultados de la búsqueda, limpia el formulario y vuelve a cargar el placeholder
    document.getElementById("formBusqueda").reset();
    document.getElementById("buscarBatallas").placeholder = "Batallas";
}

async function obtenerResultados(buscarBatallas) {
    try {
        const url = new URL (BASE_URL);
        url.searchParams.append('batallas', buscarBatallas);
        
        let response = await fetch (url);
        
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        let datos = await response.json();
        console.log(datos);
        
        //Filtra los datos ya que este método busca cualquier cadena que contenga lo buscado, no el valor exacto
        let resultadosFiltrados = datos.filter(item => item.batallas == buscarBatallas);
        console.log (resultadosFiltrados);
         
        mostrar(resultadosFiltrados);        
        
    } catch (error) {
        console.log("Hubo un problema con la operación fetch: ", error);
    }
}

//----------------------------------------------------------------------