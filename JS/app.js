const formulario = document.querySelector("#formulario-gith");
const publicaciones = document.querySelector("#publicaciones");

const campoTitulo = document.querySelector("#titulo-gith");
const campoCategoria = document.querySelector("#categoria-gith");
const campoContenido = document.querySelector("#contenido-gith");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const titulo = campoTitulo.value.trim();
    const contenido = campoContenido.value.trim();
    const categoria = campoCategoria.selectedOptions[0].textContent;

    if (titulo === "" || contenido.length < 5) {
        alert("Escribe un título y al menos 5 caracteres de contenido.");
        return;
    } 

    const gith = document.createElement("article"); 

    const encabezado = document.createElement("h3");
    encabezado.textContent = titulo; 

    const datos = document.createElement("p");
    datos.textContent = "Por Marco · " + categoria; 

    const texto = document.createElement("p");
    texto.textContent = contenido;

    const contador = document.createElement("p");
    contador.textContent = "Me gusta: 0";

    gith.append(encabezado, datos, texto, contador);
    publicaciones.append(gith);

    formulario.reset();
    publicaciones.scrollIntoView();
});

formulario.querySelector('button[type="submit"]').disabled = false;
