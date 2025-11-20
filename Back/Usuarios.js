const mongoose = require("mongoose")


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
arrayTipoDoc = ["Resumen", "Documento"]


const usuarioSchema = new mongoose.Schema({
    correo: {type:String, required: true, unique: true},
    pass: {type:String, required: true},
    datos: {
        nombre: {type:String, required: true},
        carrera: {type:String, required: true},
        perfil: {type:String, required: true},
    },
    /*documentos:{
        id: mongoose.Schema.Types.ObjectId, 
        type:String, 
        ref: "Autor", 
        required: true
    },*/
})




module.exports = mongoose.model("Usuarios", usuarioSchema)