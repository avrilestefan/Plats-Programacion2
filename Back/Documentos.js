const mongoose = require("mongoose")


const documentoSchema = new mongoose.Schema({
    nombreDoc: {type:String, required: true},
    carreraDoc: {type:String, required: true},
    tipoDoc: {type:String, required: true},
    creador: { id: mongoose.Schema.Types.ObjectId, type:String, ref: "Autor", required: true},
    descripcion: String,
    archivo: {type:String, required: true},
})

module.exports = mongoose.model("Documentos", documentoSchema)