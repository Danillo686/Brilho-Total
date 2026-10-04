import express from "express"
import cors from "cors"
import rota from "./routes/Route.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'API Brilho Total funcionando com sucesso!' })
})

app.use(rota)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})