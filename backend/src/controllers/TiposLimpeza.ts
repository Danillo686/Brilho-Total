import {Response, Request} from "express"
import {supabase, supabaseAdmin} from "../supabase.js"

export const tiposLimpeza = async (
    req: Request,
    res: Response
): Promise<any> => {
    const {data: tipos, error} = await supabaseAdmin
    .from('tipos_limpeza')
    .select('*')
    .order('nome', {ascending: true})

    if (error) {
        return res.status(500).json({message: 'Erro ao listar os tipos de limpeza', error: error.message })
    }

    return res.status(200).json(tipos)
}