// Dastos de las publicaciones creadas
const giths = [];

const formulario = document.querySelector("#formulario-gith");
const publicaciones = document.querySelector("#publicaciones");

const campoUsuario = document.querySelector("#usuario-gith");
const campoTitulo = document.querySelector("#titulo-gith");
const campoCategoria = document.querySelector("#categoria-gith");
const campoContenido = document.querySelector("#contenido-gith");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuario = campoUsuario.value.trim();
    const titulo = campoTitulo.value.trim();
    const contenido = campoContenido.value.trim();
    const categoria = campoCategoria.selectedOptions[0].textContent;
    const categoriaValor = campoCategoria.value;

    if (usuario === "" || titulo === "" || contenido.length < 5) {
        alert("Escribe un usuario, un título y al menos 5 caracteres de contenido.");
        return;
    } 

    // Esto agrupa los datos del nuevo Gith
    const nuevoGith = {
        usuario: usuario,
        titulo: titulo,
        contenido: contenido,
        categoria: categoria,
        meGusta: 0
    };

    // Eso agrega la publicación al arreglo
    giths.push(nuevoGith);

    // Crear el articulo y su contenido
    const gith = document.createElement("article"); 
    gith.dataset.categoria = categoriaValor;

    const encabezado = document.createElement("h3");
    encabezado.textContent = nuevoGith.titulo; 

    const datos = document.createElement("p");
    datos.textContent = "Por " + nuevoGith.usuario + " · " + nuevoGith.categoria; 

    const texto = document.createElement("p");
    texto.textContent = nuevoGith.contenido; 

    // Contenedor de los botones
    const acciones = document.createElement("div");
    acciones.className = "acciones-gith";

    // Botón de me gusta

    const botonMeGusta = document.createElement("button");
    botonMeGusta.type = "button";
    botonMeGusta.className = "boton-me-gusta";
    botonMeGusta.disabled = true;
    botonMeGusta.textContent = "Me gusta : "; 

    // Contador dentro del botón 
    const contador = document.createElement("span");
    contador.className = "contador-me-gusta";
    contador.textContent = nuevoGith.meGusta; 

    // Boton para guardar 
    const botonGuardar = document.createElement("button");
    botonGuardar.type = "button"; 
    botonGuardar.className = "boton-guardar";
    botonGuardar.disabled = true;
    botonGuardar.textContent = "Guardar";

    // Botón para eliminar 
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "boton-eliminar";
    botonEliminar.disabled = true;
    botonEliminar.textContent = "Eliminar";

    // Une los elementos y muestra el Gith
    botonMeGusta.append(contador);
    acciones.append(botonMeGusta, botonGuardar, botonEliminar);

    gith.append(encabezado, datos, texto, acciones);
    publicaciones.append(gith);

    formulario.reset();
    publicaciones.scrollIntoView();
});

formulario.querySelector('button[type="submit"]').disabled = false;
