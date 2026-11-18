// Dastos de las publicaciones creadas
const giths = [];

const formulario = document.querySelector("#formulario-gith");
const publicaciones = document.querySelector("#publicaciones");
const listaGiths = document.querySelector("#lista-giths");

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
        categoriaValor: categoriaValor,
        meGusta: 0
    };

    // Eso agrega la publicación al arreglo
    giths.push(nuevoGith);

    // Crear el articulo y su contenido
    mostrarGiths();

    formulario.reset();
    window.location.hash = "#publicaciones";
});

formulario.querySelector('button[type="submit"]').disabled = false; 

// Secciones que funcionan como apartados
const vistas = document.querySelectorAll(".vista");

// Muestra el apartadp indicado por el enlace
function mostrarVista() {
    const destino = window.location.hash || "#inicio";
    // Comprueba que el destino corresponda a una vista
    const existe = Array.from(vistas).some(function (vista) {
        return "#" + vista.id === destino;
    });

    const vistaActiva = existe ? destino : "#inicio";

    vistas.forEach(function (vista) {
        vista.hidden = "#" + vista.id !== vistaActiva;
    }); 
} 

// Actualiza el apartado cuando cambia el enlace 
window.addEventListener("hashchange", mostrarVista);

// Selecciona el apartado inicial al cargar 
mostrarVista(); 

// Selector del filtro de categorías 
const filtroCategoria = document.querySelector("#filtro-categoria"); 

// Muestra únicamente las publicaciones de la categoría elegida
function filtrarPublicaciones() {
    const categoriaElegida = filtroCategoria.value;
    const articulos = publicaciones.querySelectorAll("article");

    articulos.forEach(function (articulo) {
        articulo.hidden = categoriaElegida !== "todas" && articulo.dataset.categoria !== categoriaElegida;
    }); 
} 

// Aplica el filtro cuando cambia la selección
filtroCategoria.addEventListener("change", filtrarPublicaciones);

// Aplica la selección inicial 
filtrarPublicaciones();

// Construye un artículo a partir de los datos de un Gith 
function crearArticuloGith(nuevoGith) {
    const gith = document.createElement("article"); 
    gith.dataset.categoria = nuevoGith.categoriaValor;

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

    return gith; 
} 

// Actualiza la lista con las publicaciones del arreglo

function mostrarGiths() {
    listaGiths.replaceChildren();

    giths.forEach(function (datosGith) {
        const articulo = crearArticuloGith(datosGith);
        listaGiths.append(articulo);
    });

    filtrarPublicaciones();
}