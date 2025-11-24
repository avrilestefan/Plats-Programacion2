//SELECCION DE AVATARES
const contenedorAvatares = document.querySelector(".avatares");

//Variable global donde se guardará cuál avatar eligió el usuario
let avatarSeleccionado = null;

const avatares = [
    "../img/avatarH1.svg",
    "../img/avatarH2.svg",
    "../img/avatarM1.svg",
    "../img/avatarM2.svg"
];

//Genero los avatares + evento click de selección
avatares.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.classList.add("avatarIcon");

    img.addEventListener("click", () => {
        avatarSeleccionado = url;

        // Quitar selección a todos
        document.querySelectorAll(".avatarIcon").forEach(a => 
            a.classList.remove("selected")
        );

        // Marcar seleccionado
        img.classList.add("selected");
    });

    contenedorAvatares.appendChild(img);
});

/*SELECT de CARRERAS*/
const arrayCarreras = [
    "Licenciatura en Comunicación",
    "Licenciatura en Diseño Multimedia",
    "Licenciatura en Ingeniería en Sistemas",
    "Licenciatura en Gerencia y Administración",
    "Licenciatura en Animación y Videojuegos",
    "Licenciatura en Estudios Internacionales",
    "Licenciatura en Biotecnología"
];

const selectCarrera = document.querySelector("#selectCarrera");

arrayCarreras.forEach(carrera => {
    const option = document.createElement("option");
    option.value = carrera
    option.textContent = carrera
    selectCarrera.appendChild(option)
});

//los otros CAMPOS de registro
const btn = document.querySelector("#btnRegistrarme");

btn.addEventListener("click", async () => {
    const nombre = document.querySelector("#nameField").value;
    const email = document.querySelector("#mailField").value;
    const carrera = document.querySelector("#selectCarrera").value;
    const password = document.querySelector("#passwordField").value;

    if (!nombre || !email || !password) {
        alert("Completa todos los campos");
        return;
    }

    if (!avatarSeleccionado) {
        alert("Elegí un avatar antes de registrarte");
        return;
    }

    const nuevoUsuario = {
    correo: email,
    pass: password,
    datos:{
        nombre: nombre,
        carrera: carrera,
        perfil: avatarSeleccionado
        }
    };

    try {
        const res = await fetch("http://localhost:3000/registrarse", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nuevoUsuario)
        });

        const data = await res.text();
        alert(data);

        if (data.includes("éxito")) {
            window.location.href = "login.html";
        }

    } catch (error) {
        console.error("Error al registrarse:", error);
        alert("Hubo un error al registrarse");
    }    
});



