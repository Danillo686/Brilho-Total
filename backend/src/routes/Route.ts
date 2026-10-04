import { Router } from "express";
import { criarOrcamento } from "../controllers/CriarOrcamento.js";
import { tiposLimpeza } from "../controllers/TiposLimpeza.js";
import { listarOrcamentos } from "../controllers/ListarOrcamento.js";

const rota = Router()

rota.post('/orcamento', criarOrcamento)
rota.get('/orcamento', listarOrcamentos)
rota.get('/tipos', tiposLimpeza)

export default rota