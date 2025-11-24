//IMPORTAR JS DEL HEADER Y FOOTER

//ELEMENTOS DEL HTML
const contenedorDocs = document.querySelector("#ultimosDocs")
const divDocsBiblioteca = document.querySelector("#contenedorDocsBiblioteca")
const carreraSelect = document.querySelector("#carreraSelect")
const buscadorDoc = document.querySelector("#inputSearch")
const divAgregarDoc = document.querySelector("#agregarDoc")
const nombreNuevoDoc = document.querySelector("#nombreDoc")
const carreraNuevoDoc = document.querySelector("#carreraDoc")
const tipoResumen = document.querySelector("#opcionResumen")
const tipoDocumento = document.querySelector("#opcionDocumento")
const descNuevoDoc = document.querySelector("#descripcionDoc")
//falta el drop del pdg
const btnSubirDoc = document.querySelector("#subirDocBtn")


//ARRAYS
const arrayPerfiles = ["naranja", "verde", "amarillo", "azul"]

const arrayCarreras = [
    "Licenciatura en Comunicación",
    "Licenciatura en Diseño Multimedia",
    "Licenciatura en Ingeniería en Sistemas",
    "Licenciatura en Gerencia y Administración",
    "Licenciatura en Animación y Videojuegos",
    "Licenciatura en Estudios Internacionales",
    "Licenciatura en Biotecnología"
]
const arrayTipoDoc = ["Resumen", "Documento"]



//ELEMENTOS DE LA API
const BASE_URL = "http://localhost:3000"

//MOSTRAR LOS DOCOCUMENTOS EN INCIO Y BIBLIOTECA
async function obtenerDocumentos() {
    try {
        const respuesta = await fetch(`${BASE_URL}/biblioteca`)
        const data = await respuesta.json()

        mostrarDocumentos(data.documentos)
    } catch {
        console.log("No se pudo obtener los documentos")
    }
}
async function mostrarDocumentos(arrayDocumentos) {
    console.log("Entra a funcion mostrarDocumentos")


    //para ver en qué html estoy: no se puede usar una misma función en html que no estoy viendo activamente
    if (contenedorDocs) contenedorDocs.innerHTML = ""
    if (divDocsBiblioteca) divDocsBiblioteca.innerHTML = ""

    for (const documento of arrayDocumentos) {

        const descripcion = documento.descripcion.length > 80
            ? documento.descripcion.substring(0, 80) + "..."
            : documento.descripcion

        console.log("Buscando usuario por ID:", documento.creador)
        const respuestaUsuario = await fetch(`${BASE_URL}/usuario/id/${documento.creador}`)
        const usuario = await respuestaUsuario.json()

        const nombreCreador = usuario.datos.nombre

        // Si estoy en inicio.html
        if (contenedorDocs) {
            const cantidadArticles = contenedorDocs.querySelectorAll("article").length;

            if (cantidadArticles >= 4) { //para que solo muestre 4 articles en el inicio
                return
            }
            contenedorDocs.innerHTML += `
            <article>
                <h3>${documento.nombreDoc}</h3>
                <p>${descripcion}</p>
                <h5>${documento.carreraDoc}</h5>
                <p>${nombreCreador}</p>
            </article>`

        }

        // Si estoy en biblioteca.html
        if (divDocsBiblioteca) {
            divDocsBiblioteca.innerHTML += `
            <article>
                <h3>${documento.nombreDoc}</h3>
                <p>${descripcion}</p>
                <h5>${documento.carreraDoc}</h5>
                <h5>${documento.tipoDoc}</h5>
                <p>${nombreCreador}</p>
            </article>`
        }
    }
}

//FILTRAR DOCS POR CARRERA
async function filtarPorCarrera () {
    const carrera = carreraSelect.value

    try {
        const respuesta = await fetch(`${BASE_URL}/biblioteca/carrera/${encodeURIComponent(carrera)}`)//usa encodeURIComponent para que no haya espacios ni tildes en la URL
        const data = await respuesta.json()

        if(data.documentos.length>0){ //si el back devuelve algún json:
            mostrarDocumentos(data.documentos)
        }
    } catch {
        if (divDocsBiblioteca) {
            divDocsBiblioteca.innerHTML = `<h3>Nos hay documentos relacionados a tu búsqueda</h3>`}
    }

}


//FILTRAR POR NOMBRE DEL DOC
async function filtrarPorNombre() {
    const nombre = buscadorDoc.value.trim();

    if (nombre === "") {
        obtenerDocumentos(); // por si el usuario borra en la búsqueda, que devuelva todos los docs
        return;
    }

    const res = await fetch(`${BASE_URL}/biblioteca/nombre/${encodeURIComponent(nombre)}`);
    const data = await res.json();

    if (data.documentos.length > 0) {
        mostrarDocumentos(data.documentos);
    } else {
        divDocsBiblioteca.innerHTML = "<h3>No hay documentos con ese nombre</h3>";
    }
}


// AGREGAR DOCUMENTO EN NUEVO-DOCUMENTO.HTML
async function crearDocumento() {
    const tipo =
        tipoResumen.checked ? "Resumen" :
        tipoDocumento.checked ? "Documento" :
        "";

    const nuevoDoc = {
        nombreDoc: nombreNuevoDoc.value,
        carreraDoc: carreraNuevoDoc.value,
        tipoDoc: tipo,
        creador: "691f16b3fa07849bc66be8aa",
        descripcion: descNuevoDoc.value,
        archivo: "file:///Users/avrilestefan/Downloads/raw.pdf"
    };

    const response = await fetch(`${BASE_URL}/biblioteca/nuevo-documento`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(nuevoDoc)
    });

    // Respuesta como texto por si hay errores del backend
    const data = await response.text();
    console.log(data);

    if (response.ok) {
        // Pantalla de éxito
        divAgregarDoc.innerHTML = `
            <h2>Biblioteca compartida > Agregar documento</h2>
            <h1>Agregar Documento</h1>

            <h3 style="color: green;">Documento creado con éxito ✔</h3>

            <a href="biblioteca.html">Volver a Biblioteca</a>
        `;
    } else {
        // Redirección inmediata a error.html
        window.location.href = "error.html";
    }
}




if(contenedorDocs || divDocsBiblioteca){ //si estoy en incio.html o biblioteca.html
    obtenerDocumentos()
}


if(carreraSelect && buscadorDoc){ //para ver si estoy en biblioteca.html
    carreraSelect.addEventListener("change", filtarPorCarrera)
    buscadorDoc.addEventListener("keyup", filtrarPorNombre)
}

if(btnSubirDoc){ //para saber si estamos parados en nuevo-documento.html
    btnSubirDoc.addEventListener("click", crearDocumento)
}
