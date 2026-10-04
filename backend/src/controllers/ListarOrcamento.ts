import {Request, Response} from "express"
import {supabase, supabaseAdmin} from "../supabase.js" 

export const listarOrcamentos = async (
    req: Request,
    res: Response
): Promise<any> => {
    const {data: pedido, error} = await supabaseAdmin
    .from('pedidos_orcamento')
    .select('*, tipos_limpeza(nome, preco_por_m2)')
    .order('criado_em', {ascending: false})

    if (error) {
        return res.status(500).json({message: 'Erro ao listar os pedidos de orçamento', error: error.message})
    }

    return res.status(200).json(pedido)
}   