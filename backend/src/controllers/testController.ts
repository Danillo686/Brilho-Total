import { response } from "express";
import { supabaseAdmin } from "../supabase.js";


//Req ele faz a requisição, então ele PUXA informação
//Res, ele é a resposta, então ele DEVOLVE uma resposta

//data é DADOS -> ou seja. dados do banco
export const get = async (req: Request, res: Response) => {
    const {data, error} = await supabaseAdmin.from('tipos_limpeza').select('*') // essa linha siginifaca: SELECT * FROM 'tipos_limpeza'

    if (error) {
        return response.status(500).json({message: "Erro ao iniciar..."})
    }
}