"use strict"

// Modo Oscuro y Verde
let modoActual = "apagado";     // Establece el valor inicial del modo: Apagado modo oscuro

function cambiarModo() {
    console.log("Cambiando modo, estado actual:", modoActual);
    const body = document.body;                                        //Cambia de color el texto y el background del body
    const logoImg = document.getElementById("logoImg");                //Cambia la imagen del logo principal
    const modoBtn = document.getElementById("modoBtn");                //Cambia la imagen del botón "modo"
    const hamburguesaImg = document.getElementById("hamburguesaImg");  //Cambia la imagen del menú hamburguesa
    
    const recuadro_enlistate = document.querySelector("fieldset");                          //Cambia de color el recuadro de la sección "enlístate"
    const lista_mechas = document.querySelectorAll("figure.main-lista-mechas ul li a");     //cambia de color la lista de los mechas y naves
    const tabla = document.querySelector("table");                                          //cambia de color los bordes internos y externo de la tabla
    const encabezadoTabla = document.querySelector(".encabezado-tabla");                    //cambia los colores del encabezado de la tabla
    const menu = document.querySelector(".menu");                                           //cambia el color de la barra navegadora
    const mechas = document.querySelectorAll("figure.main-mechas");                         //cambia de color el recuadro que separa cada mecha entre si
    const footer = document.querySelector("footer");                                        //cambia de color el borde del footer

    footer.style.color = "black";                                       //fuerza a que el color de las letras del footer siempre sean negras

    if (modoActual === "apagado") {             //Cambia todos los estilos a "modo oscuro"
        body.style.backgroundColor = "black";
        body.style.color = "white";
        logoImg.src = "imagenes/logo-oscuro.jpg";
        modoBtn.src = "imagenes/modo-verde.png";
        hamburguesaImg.src = "imagenes/hamburguesa-oscuro.png"; 
        menu.style.backgroundColor = "darkolivegreen";
        footer.style.borderColor = "white";
        
        //Los "if" corroboran que el elemento exista en el html en donde se esté ejecutando la función para que no de error        
        if (recuadro_enlistate) {
            recuadro_enlistate.style.borderColor = "white";
        }      
        if (lista_mechas) {
            lista_mechas.forEach(item => {
                item.style.color = "white";
            })
        }
        if (tabla) {
            tabla.style.borderColor = "white";
            tabla.querySelectorAll("tr").forEach(tr => {
                tr.style.borderColor = "white";
                tr.querySelectorAll("td").forEach(td => {
                    td.style.borderColor = "white";
                });
            });
        }
        if (encabezadoTabla) {
            encabezadoTabla.style.backgroundColor = "white";
            encabezadoTabla.style.color = "black";
        }
        if (mechas) {
            mechas.forEach(item => {
                item.style.borderColor = "white";
            });   
        }
       
        modoActual = "prendido";                //cambia el estado del modo
        console.log("Modo cambiado a prendido");
                
    } else {                                  //Cambia todos los estilos a "modo verde" o normal
        body.style.backgroundColor = "darkolivegreen";
        body.style.color = "black";
        logoImg.src = "imagenes/logo.jpg";
        modoBtn.src = "imagenes/modo-oscuro.png";
        hamburguesaImg.src = "imagenes/hamburguesa.png";
        menu.style.backgroundColor = "black";
        footer.style.borderColor = "black";
        
       //Los "if" corroboran que el elemento exista en el html en donde se esté ejecutando la función para que no de error        
        if (recuadro_enlistate) {
            recuadro_enlistate.style.borderColor = "black";
        }     
        if (lista_mechas) {
            lista_mechas.forEach(item => {
                item.style.color = "black";
            })
        }
        if (tabla) {
            tabla.style.borderColor = "black";
            tabla.querySelectorAll("tr").forEach(tr => {
                tr.style.borderColor = "black";
                tr.querySelectorAll("td").forEach(td => {
                    td.style.borderColor = "black";
                });
            });
        }
        if (encabezadoTabla) {
            encabezadoTabla.style.backgroundColor = "black";
            encabezadoTabla.style.color = "white";
        }
        if (mechas) {
            mechas.forEach(item => {
                item.style.borderColor = "black";
            });   
        }

        modoActual = "apagado";             //cambia el estado del modo
        console.log("Modo cambiado a apagado");
    }
}

document.getElementById("modoBtn").addEventListener("click", cambiarModo);    //ejecuta la función cuando se clickea en el botón


//----------------------------------------------------------------


//Menú de navegación
document.querySelector(".boton-menu").addEventListener("click", cambiarMenu);

function cambiarMenu() {            //Función que muestra y oculta el menú desplegable de la "hamburguesa"
    document.querySelector(".navegacion").classList.toggle("show");
}


//----------------------------------------------------------------


//Formulario

let numeroFormado = 0;      // Variable global para almacenar el número generado por la función generarCaptcha

if (document.title === "REF - Enlístate en la REF") {       //comprueba que la función se ejecute en la página de registro
    generarCaptcha();                                   //genera los números al azar
    let form = document.querySelector("#form");         //Toma el formulario
    form.addEventListener("submit", agregarAspirante); 
}

function agregarAspirante(e) {
    e.preventDefault();
  
    let formData = new FormData(form);      // se obtienen todos los datos del form
  
    //Obtengo los datos ingresados en el form segun name de cada input 
    let nombre = formData.get('nombre');
    let apellido = formData.get('apellido');
    let edad = formData.get('edad');
    let email = formData.get('email');
    let comentario = formData.get('comentario');
    let captcha = formData.get('captcha');

    if (numeroFormado.toString() === captcha) {                          //compara el número generado por la función con el ingresado por el usuario
        document.getElementById("resultado").innerHTML = "REGISTRO EXITOSO. Bienvenido " + nombre;
        document.getElementById("form").reset();                            //Limpia el formulario luego de un registro exitoso
    } else {
        document.getElementById("resultado").innerHTML = "Código incorrecto, vuelva a intentar.";
    }
    generarCaptcha();       //renueva el captcha luego de un ingreso exitoso o fallido
}


function generarCaptcha () {
    // Genera cuatro números aleatorios entre 0 y 9
    let n1 = Math.floor(Math.random() * 9) + 1; //evita que el primer número sea cero para que no de incorrecta la verificación si llegase a salir un cero como primer número
    let n2 = Math.floor(Math.random() * 10);
    let n3 = Math.floor(Math.random() * 10);
    let n4 = Math.floor(Math.random() * 10);

    // Asigna números aleatorios a las imágenes
    document.getElementById("numero1").src = "imagenes/" + n1 + ".png";
    document.getElementById("numero2").src = "imagenes/" + n2 + ".png";
    document.getElementById("numero3").src = "imagenes/" + n3 + ".png";
    document.getElementById("numero4").src = "imagenes/" + n4 + ".png";

    // Obtiene el número formado por los cuatro dígitos
    numeroFormado = n1*1000 + n2*100 + n3*10 + n4;
    console.log("Número formado:", numeroFormado);

    return numeroFormado;       //la función retorna un número de 4 dígitos
}







