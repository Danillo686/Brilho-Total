import express from "express"
import rota from "./routes/Route.js"

const app = express()
app.use(express.json())

app.get('/', (req, res) => {res.json({message: 'Api funcionando... MACACO'})})

app.use(rota)

app.listen(3001, () => {
    console.log("Servidor rodando em http://26.95.54.249:3001") // O IP DE QUEM ESTÁ HOSTEANDO DEVE SER AQUI
})