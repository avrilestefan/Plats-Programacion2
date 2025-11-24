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


//BUSCAR USUARIO POR CORREO
app.get("/usuario/:correo", async (req, res) => {
    try {
        const params = req.params
        const correoBusqueda = params.correo
        const usuarioBusqueda = await Usuarios.find({ correo: correoBusqueda })
        res.json(usuarioBusqueda)
        console.log("Se encontró el usuario exitosamente")
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message })
        console.log("No se ha encontrado el usuario")
    }
})

//BUSCAR USUARIO POR ID
app.get("/usuario/id/:id", async (req, res) => {
    try {
        const params = req.params
        const idBusqueda = params.id
        const usuarioBusqueda = await Usuarios.findById(idBusqueda)
        res.json(usuarioBusqueda)
        console.log(usuarioBusqueda)
        console.log("Se encontró el usuario exitosamente por id")
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message })
        console.log("No se ha encontrado el usuario")
    }
})

//BUSCAR DOCUMENTO POR CARRERA
app.get("/biblioteca/carrera/:carreraDoc", async (req, res) => {
    try {
        const params = req.params
        const carreraBusqueda = params.carreraDoc
        const docBusqueda = await Documentos.find({ carreraDoc: carreraBusqueda })
        res.json(docBusqueda)
        console.log("Se encontró los docuementos por carrera")
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message })
        console.log("No se ha encontrado los documentos con la carrera seleccionada")
    }
})

//BUSCAR DOCUMENTO POR NOMBRE
app.get("/biblioteca/nombre/:nombreDoc", async (req, res) => {
    try {
        const nombre = req.params.nombreDoc

        const documentos = await Documentos.find({
            nombreDoc: { $regex: nombre, $options: "i" } //el $regex es para búsquedas parciales. ej. que busque solo "resumen" y aparezcan todos los docs que contanegan "resumen", no solo que busque literalmente.
            //el $options: "i" hace referencia a ignorar las mayúsculas y minúsculas
        });

        res.json({ documentos });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});



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
            documentos: Docs,
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
    const usuario = await Usuarios.findOne({ correo: correoElectronico }) 
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

