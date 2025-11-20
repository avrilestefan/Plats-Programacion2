const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")

const Usuarios = require("./Usuarios")
const Documentos = require("./Documentos")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hola Mundo")
})


//----------------------------------- ENPOINTS --------------------------------------

//EDITAR USUARIO
app.put("/usuario/editar/:correo", async (req, res) => {
    try {
        const params = req.params.correo
        console.log(params)
        const body = req.body

        //puede editar nombre, carrera o pass. Tambien puede editar docs
        if (!body.datos.nombre || !body.datos.carrera || !body.pass) {
            res.status(400).send("Error al editar usuario")
        }
        const actualizado = await editarUsuario(params.correo, body)
        console.log(actualizado);

        res.json(actualizado)
    } catch (e) {
        console.log(e)
        res.status(400).send("Usuario no encotrado")
    }
})


// CREAR USUARIO
app.post("/registrarse", async (req, res) => {
    try {
        const body = req.body
        console.log(body)
        const correoUsuario = body.correo?.toLowerCase().trim()
        const passUsuario = body.pass
        const nombreUsuario = body.datos.nombre
        const carreraUsuario = body.datos.carrera
        const fotoPerfil = body.datos.perfil
        //const documentos = body.documentos //esto no está visible en el html, es para que no me de error

        if (!correoUsuario) {
            res.status(400).send("Falta el correo electrónico")
            return
        }
        if (!passUsuario) {
            res.status(400).send("Falta la contraseña")
            return
        }
        if (!nombreUsuario) {
            res.status(400).send("Falta el nombre")
            return
        }
        if (!carreraUsuario) {
            res.status(400).send("Falta la carrera que cursa el usuario")
            return
        }
        if (!fotoPerfil) {
            res.status(400).send("Falta elegir una foto de perfil")
            return
        }


        console.log("usuario recibido", correoUsuario)
        const usuarioExistente = await buscarUsuarioPorCorreo(correoUsuario)
        console.log("Buscando usuario existente")

        if (!usuarioExistente) {

            crearUsuario({
                correo: correoUsuario,
                pass: passUsuario,
                datos: {
                    nombre: nombreUsuario,
                    carrera: carreraUsuario,
                    perfil: fotoPerfil,
                },
                //documentos: {documentos}
            })
            res.status(200).send("Usuario creado con éxito")
            console.log("El usuario existente", usuarioExistente)
            return

        } else {

            res.status(400).send("Este correo ya está registrado prueba con otro")
            return
        }

    } catch (e) {
        console.log(e);
    }
})


//BUSCAR USUARIO . LOGIN
app.get("/usuario/:correo", async (req, res) => {
    try {
        const params = req.params
        const correoBusqueda = params.correo
        const usuarioBusqueda = await Usuarios.find({ correo: correoBusqueda })
        res.json(usuarioBusqueda)
        console.log("Se encontró el usuario exitosamente")
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: error.message })
        console.log("No se ha encontrado el usuario")
    }
})



//SUBIR DOCUMENTOS
app.post("/biblioteca/nuevo-documento", async (req, res) => {
    try {
        const body = req.body
        console.log(body)
        const nombreDoc = body.nombreDoc
        const carreraDoc = body.carreraDoc
        const tipoDoc = body.tipoDoc
        const creadorDoc = body.creador
        const descDoc = body.descripcion
        const archivoDoc = body.archivo

        if (!nombreDoc) {
            res.status(400).send("Falta el nombre del documento")
            return
        }
        if (!carreraDoc) {
            res.status(400).send("Falta seleccionar la carrera")
            return
        }
        if (!tipoDoc) {
            res.status(400).send("Falta seleccionar tipo de archivo: Resumen o documento")
            return
        }
        if (!creadorDoc) {
            res.status(400).send("Error al obtener el usuario que crea el doc")
            return
        }
        if (!archivoDoc) {
            res.status(400).send("Falta agregar un archivo")
            return
        }

        crearDocumento({
            nombreDoc: nombreDoc,
            carreraDoc: carreraDoc,
            tipoDoc: tipoDoc,
            creador: creadorDoc,
            descripcion: descDoc,
            archivo: archivoDoc,
        })
        res.status(200).send("Documento creado con éxito")
        return
    } catch (e) {
        console.log(e);
    }
})


//MOSTRAR TODOS LOS DOCUMENTOS
app.get("/biblioteca", async (req, res) => {
    try {
        const Docs = await Documentos.find().limit(50).sort({ nombre: 1 })
        const respuesta = {
            nombreDoc: Docs,
            count: Docs.length,
            message: "Documentos obtenidos con exito"
        }
        res.json(respuesta)
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: error.message })
    }

})

//ELIMINAR DOCUMENTOS
app.delete("/biblioteca/eliminar/:id", async (req, res) => {
    try {
        const params = req.params
        console.log(params)
        await Documentos.findByIdAndDelete(params.id)
        res.send("Documento eliminado con éxito")
    } catch (e) {
        console.log(e)
        res.status(400).send("Documento no encotrado")
    }
})






//----------------------------------- FUNCIONES --------------------------------------
async function iniciar() {
    try {
        await mongoose.connect("mongodb+srv://avril:AdatabaseORT2026@cluster0.rznkvjp.mongodb.net/")
        console.log("Conectados con la DB :)")

        app.listen(PORT, () => {
            console.log("Escuchando el puerto " + PORT)
        })


    } catch (e) {
        console.log("Error conectando a la db ", e.message);
    }
}


async function crearUsuario(datosUsuario) {
    try {
        const usuario = await Usuarios.create(datosUsuario)
        console.log(usuario);
    } catch (error) {
        console.log(error.message)
    }
}

async function buscarUsuarioPorCorreo(correoElectronico) {

    console.log("buscando en DB", correoElectronico)
    console.log(Usuarios)
    const usuario = await Usuarios.findOne({ correo: correoElectronico }) //aca está el error
    console.log(usuario)
    console.log("Resultado DB:", usuario)
    return usuario
}

async function crearDocumento(datosDoc) {
    try {
        const documento = await Documentos.create(datosDoc)
        console.log(documento);
    } catch (error) {
        console.log(error.message)
    }
}



async function editarUsuario(correo, nuevoUsuario) {
    try {
        const actualizado = await Usuarios.findOneAndUpdate(correo, nuevoUsuario)
        console.log(actualizado)
        return actualizado
    } catch (e) {
        console.log(e.message)
    }
}

iniciar()

