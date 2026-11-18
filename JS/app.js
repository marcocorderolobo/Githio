// Dastos de las publicaciones creadas
const giths = [];

// Cuentas creadas de la página
const usuarios = [];

// Usuario que tiene la sesión iniciada
let usuarioActual = null;

// Formulario de registro y sus campos
const formularioRegistro = document.querySelector("#formulario-registro");
const registroNombre = document.querySelector("#registro-nombre");
const registroUsuario = document.querySelector("#registro-usuario");
const registroContrasena = document.querySelector("#registro-contrasena");
const registroConfirmacion = document.querySelector("#registro-confirmacion");

const formulario = document.querySelector("#formulario-gith");
const publicaciones = document.querySelector("#publicaciones");
const listaGiths = document.querySelector("#lista-giths");

const campoUsuario = document.querySelector("#usuario-gith");
const campoTitulo = document.querySelector("#titulo-gith");
const campoCategoria = document.querySelector("#categoria-gith");
const campoContenido = document.querySelector("#contenido-gith");
const campoArchivos = document.querySelector("#archivos-gith");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Solo permite publicar con una sesión iniciada
    if (usuarioActual === null) {
        alert("Inicia sesión para publicar un Gith.");
        window.location.hash = "#acceso";
        return;
    }

    const usuario = usuarioActual.usuario;
    const titulo = campoTitulo.value.trim();
    const contenido = campoContenido.value.trim();
    const categoria = campoCategoria.selectedOptions[0].textContent;
    const categoriaValor = campoCategoria.value;

    if (usuario === "" || titulo === "" || contenido.length < 5) {
        alert("Escribe un usuario, un título y al menos 5 caracteres de contenido.");
        return;
    }

    // Comprueba el tamaño total de los archivos seleccionados
    const archivosSeleccionados = Array.from(campoArchivos.files);

    const totalArchivos = archivosSeleccionados.reduce(function (total, archivo) {
        return total + archivo.size;
    }, 0);

    if (totalArchivos > 300 * 1024 * 1024) {
        alert("Los archivos superan el máximo total de 300 MB.");
        return;
    }

    // Prepara una dirección temporal para mostrar cada archivo
    const archivos = archivosSeleccionados.map(function (archivo) {
        return {
            nombre: archivo.name,
            tipo: archivo.type,
            url: URL.createObjectURL(archivo)
        };
    });

    // Esto agrupa los datos del nuevo Gith
    const nuevoGith = {
        usuario: usuario,
        titulo: titulo,
        contenido: contenido,
        categoria: categoria,
        categoriaValor: categoriaValor,
        meGusta: 0,
        archivos: archivos,
    };

    // Eso agrega la publicación al arreglo
    giths.push(nuevoGith);

    // Crear el articulo y su contenido
    mostrarGiths();

    formulario.reset();
    campoUsuario.value = usuarioActual.usuario;
    window.location.hash = "#publicaciones";
});

formulario.querySelector('button[type="submit"]').disabled = false;

// Secciones que funcionan como apartados
const vistas = document.querySelectorAll(".vista");

// Muestra el apartadp indicado por el enlace
function mostrarVista() {
    let destino = window.location.hash || "#inicio";

    if (destino === "#perfil" && usuarioActual === null) {
        destino = "#acceso";
        window.location.hash = destino;
    }
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

    // Foto y nombre del autor
    const datos = document.createElement("div");
    datos.className = "autor-gith";

    const cuentaAutor = usuarios.find(function (cuenta) {
        return cuenta.usuario === nuevoGith.usuario;
    });

    const fotoAutor = document.createElement("img");
    fotoAutor.className = "foto-autor";
    fotoAutor.src =
        cuentaAutor && cuentaAutor.foto
            ? cuentaAutor.foto
            : fotoPredeterminada;
    fotoAutor.alt = "Avatar de " + nuevoGith.usuario;

    const nombreAutor = document.createElement("p");
    nombreAutor.textContent =
        "Por " + nuevoGith.usuario + " · " + nuevoGith.categoria;

    datos.append(fotoAutor, nombreAutor);

    const texto = document.createElement("p");
    texto.textContent = nuevoGith.contenido;

    // Contenedor de los botones
    const acciones = document.createElement("div");
    acciones.className = "acciones-gith";

    // Usuarios que dieron me gusta
    if (!nuevoGith.gustos) {
        nuevoGith.gustos = [];
    }

    // Botón de me gusta
    const botonMeGusta = document.createElement("button");
    botonMeGusta.type = "button";
    botonMeGusta.className = "boton-me-gusta";
    botonMeGusta.disabled = usuarioActual === null;
    botonMeGusta.textContent = "Me gusta: ";

    const tieneMeGusta =
        usuarioActual !== null &&
        nuevoGith.gustos.includes(usuarioActual.usuario);

    botonMeGusta.setAttribute("aria-pressed", String(tieneMeGusta));

    // Contador dentro del botón
    const contador = document.createElement("span");
    contador.className = "contador-me-gusta";
    contador.textContent = nuevoGith.gustos.length;

    // Agrega o retira el me gusta de la cuenta actual
    botonMeGusta.addEventListener("click", function () {
        if (usuarioActual === null) {
            return;
        }

        const posicion =
            nuevoGith.gustos.indexOf(usuarioActual.usuario);

        if (posicion === -1) {
            nuevoGith.gustos.push(usuarioActual.usuario);
        } else {
            nuevoGith.gustos.splice(posicion, 1);
        }

        nuevoGith.meGusta = nuevoGith.gustos.length;
        mostrarGiths();
    });

    // Usuarios que guardaron esta publicación
    if (!nuevoGith.guardados) {
        nuevoGith.guardados = [];
    }

    // Botón para guardar
    const botonGuardar = document.createElement("button");
    botonGuardar.type = "button";
    botonGuardar.className = "boton-guardar";
    botonGuardar.disabled = usuarioActual === null;

    const estaGuardado =
        usuarioActual !== null &&
        nuevoGith.guardados.includes(usuarioActual.usuario);

    botonGuardar.textContent = estaGuardado ? "Guardado ✓" : "Guardar";

    botonGuardar.addEventListener("click", function () {
        if (usuarioActual === null) {
            return;
        }

        const posicion =
            nuevoGith.guardados.indexOf(usuarioActual.usuario);

        if (posicion === -1) {
            nuevoGith.guardados.push(usuarioActual.usuario);
        } else {
            nuevoGith.guardados.splice(posicion, 1);
        }

        mostrarGiths();
    });

    // Botón para eliminar 
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "boton-eliminar";
    botonEliminar.textContent = "Eliminar";
    // Solo habilita eliminar si la publicación pertenece al usuario actual
    const puedeEliminar =
        usuarioActual !== null &&
        nuevoGith.usuario === usuarioActual.usuario;

    botonEliminar.disabled = !puedeEliminar;
    botonEliminar.hidden = !puedeEliminar;

    // Elimina la publicación del arreglo y actualiza la pantalla
    botonEliminar.addEventListener("click", function () {
        if (
            usuarioActual === null ||
            nuevoGith.usuario !== usuarioActual.usuario
        ) {
            return;
        }

        const posicion = giths.indexOf(nuevoGith);

        if (posicion !== -1) {
            // Libera las direcciones de los archivos eliminados
            (nuevoGith.archivos || []).forEach(function (archivo) {
                URL.revokeObjectURL(archivo.url);
            });

            giths.splice(posicion, 1);
            mostrarGiths();
        }
    });

    // Une el texto y los botones
    botonMeGusta.append(contador);
    acciones.append(botonMeGusta, botonGuardar, botonEliminar);

    gith.append(encabezado, datos, texto);

    // Muestra cada archivo una sola vez
    (nuevoGith.archivos || []).forEach(function (archivo) {
        if (archivo.tipo.startsWith("image/")) {
            const imagen = document.createElement("img");
            imagen.src = archivo.url;
            imagen.alt = archivo.nombre;
            imagen.className = "imagen-gith";
            gith.append(imagen);
        } else if (archivo.tipo.startsWith("video/")) {
            const video = document.createElement("video");
            video.src = archivo.url;
            video.controls = true;
            video.preload = "metadata";
            video.className = "imagen-gith";
            gith.append(video);
        }

        const parrafoArchivo = document.createElement("p");
        const enlaceArchivo = document.createElement("a");

        enlaceArchivo.href = archivo.url;
        enlaceArchivo.download = archivo.nombre;
        enlaceArchivo.textContent = "Descargar: " + archivo.nombre;

        parrafoArchivo.append(enlaceArchivo);
        gith.append(parrafoArchivo);
    });

    gith.append(acciones);

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

// Procesa el formulario de registro
formularioRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = registroNombre.value.trim();
    const usuario = registroUsuario.value.trim();
    const contrasena = registroContrasena.value;
    const confirmacion = registroConfirmacion.value;

    if (nombre === "" || usuario === "") {
        alert("Escribe tu nombre y tu nombre de usuario.");
        return;
    }

    if (contrasena !== confirmacion) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Comprueba si el nombre de usuario ya está registrado
    const usuarioExiste = usuarios.some(function (cuenta) {
        return cuenta.usuario === usuario;
    });

    if (usuarioExiste) {
        alert("Ese nombre de usuario ya está registrado.");
        return;
    }

    // Crea los datos de la cuenta 
    const nuevaCuenta = {
        nombre: nombre,
        usuario: usuario,
        contrasena: contrasena,
    };

    usuarios.push(nuevaCuenta);

    formularioRegistro.reset();
    alert("Cuenta creada. Ya puedes iniciar Sesión.");
    window.location.hash = "#acceso";
});

// Habilita el botón para el registro
formularioRegistro.querySelector('button[type="submit"]').disabled = false;

// Formulario de inicio de sesion y sus campos
const formularioAcceso = document.querySelector("#formulario-acceso");
const accesoUsuario = document.querySelector("#acceso-usuario");
const accesoContrasena = document.querySelector("#acceso-contrasena");

// Comprueba los datos al iniciar sesión
formularioAcceso.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const usuario = accesoUsuario.value.trim();
    const contrasena = accesoContrasena.value;

    const cuentaEncontrada = usuarios.find(function (cuenta) {
        return cuenta.usuario === usuario && cuenta.contrasena === contrasena;
    });

    if (cuentaEncontrada === undefined) {
        alert("El usuario o la contraseña son incorrectos.");
        return;
    }
    usuarioActual = cuentaEncontrada;

    campoUsuario.value = usuarioActual.usuario;
    campoUsuario.readOnly = true;

    actualizarInterfazSesion();

    formularioAcceso.reset();
    alert("Bienvenido, " + usuarioActual.nombre);
    window.location.hash = "#publicaciones";
});

// Conecta los botones de las publicaciones de ejemplo
publicaciones.querySelectorAll(":scope > article")
    .forEach(function (articulo) {
        const botonMeGusta = articulo.querySelector(".boton-me-gusta");
        const contador = articulo.querySelector(".contador-me-gusta");
        const botonGuardar = articulo.querySelector(".boton-guardar");
        const botonEliminar = articulo.querySelector(".boton-eliminar");

        const gustos = [];
        const guardados = [];

        // Los ejemplos no pertenecen a una cuenta registrada
        botonEliminar.hidden = true;
        botonEliminar.disabled = true;

        function actualizarBotones() {
            const sinSesion = usuarioActual === null;

            botonMeGusta.disabled = sinSesion;
            botonGuardar.disabled = sinSesion;
            contador.textContent = gustos.length;

            const estaGuardado =
                !sinSesion &&
                guardados.includes(usuarioActual.usuario);

            botonGuardar.textContent =
                estaGuardado ? "Guardado ✓" : "Guardar";

            const tieneMeGusta =
                !sinSesion &&
                gustos.includes(usuarioActual.usuario);

            botonMeGusta.setAttribute(
                "aria-pressed",
                String(tieneMeGusta)
            );
        }

        botonMeGusta.addEventListener("click", function () {
            if (usuarioActual === null) return;

            const posicion = gustos.indexOf(usuarioActual.usuario);

            if (posicion === -1) {
                gustos.push(usuarioActual.usuario);
            } else {
                gustos.splice(posicion, 1);
            }

            actualizarBotones();
        });

        botonGuardar.addEventListener("click", function () {
            if (usuarioActual === null) return;

            const posicion = guardados.indexOf(usuarioActual.usuario);

            if (posicion === -1) {
                guardados.push(usuarioActual.usuario);
            } else {
                guardados.splice(posicion, 1);
            }

            actualizarBotones();
        });

        // Permite actualizar estos botones al iniciar sesión
        articulo.addEventListener(
            "actualizar-sesion",
            actualizarBotones
        );

        actualizarBotones();
    });

// Actualiza el aviso y los botones según la sesión
function actualizarInterfazSesion() {
    const haySesion = usuarioActual !== null;

    document.querySelector(".aviso-cuenta").hidden = haySesion;

    // Oculta la opción completa del menú, incluyendo su espacio
    document.querySelector('nav a[href="#perfil"]')
        .closest("li").hidden = !haySesion;

    document.querySelector("#cerrar-sesion").hidden = !haySesion;

    publicaciones.querySelectorAll(":scope > article")
        .forEach(function (articulo) {
            articulo.dispatchEvent(new Event("actualizar-sesion"));
        });

    actualizarPerfil();
    mostrarGiths();
}



// Foto del perfil y selector de imagen
const imagenPerfil = document.querySelector(".avatar-perfil");
const selectorFotoPerfil = document.querySelector("#foto-perfil");
const fotoPredeterminada = imagenPerfil.getAttribute("src");

// Muestra los datos de la cuenta en el perfil
function actualizarPerfil() {
    selectorFotoPerfil.disabled = usuarioActual === null;

    if (usuarioActual === null) {
        return;
    }

    document.querySelector(".encabezado-perfil h3").textContent =
        usuarioActual.nombre;

    document.querySelector(".encabezado-perfil p").textContent =
        "@" + usuarioActual.usuario;

    imagenPerfil.src = usuarioActual.foto || fotoPredeterminada;
    imagenPerfil.alt = "Avatar de " + usuarioActual.nombre;
}

// Cambia la foto de la cuenta actual
selectorFotoPerfil.addEventListener("change", function () {
    if (usuarioActual === null) {
        return;
    }

    const archivo = selectorFotoPerfil.files[0];

    if (!archivo) {
        return;
    }

    if (!archivo.type.startsWith("image/")) {
        alert("Selecciona una imagen.");
        selectorFotoPerfil.value = "";
        return;
    }

    // Guarda la cuenta que inició la selección
    const cuenta = usuarioActual;
    const lector = new FileReader();

    lector.addEventListener("load", function () {
        cuenta.foto = lector.result;

        actualizarPerfil();
        mostrarGiths();
    });

    lector.addEventListener("error", function () {
        alert("No se pudo leer la imagen.");
    });

    lector.readAsDataURL(archivo);
    selectorFotoPerfil.value = "";
});

actualizarInterfazSesion();

// Cierra la sesión actual
document.querySelector("#cerrar-sesion")
    .addEventListener("click", function () {
        usuarioActual = null;

        formulario.reset();
        campoUsuario.value = "";
        selectorFotoPerfil.value = "";

        window.location.hash = "#inicio";
        actualizarInterfazSesion();
    });