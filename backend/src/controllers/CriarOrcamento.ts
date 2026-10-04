import {Request, Response} from "express"
import {supabase, supabaseAdmin} from "../supabase.js"

export const criarOrcamento = async (
    req: Request,
    res: Response
): Promise<any> =>{
    const {
        nome_cliente,
        telefone,
        email,
        metragem,
        tipo_limpeza_id
    } = req.body 

    if (!nome_cliente || !telefone || !email || !metragem || !tipo_limpeza_id) {
        return res.status(400).json({message: 'Todos os campos são obrigatorios!'})
    }

    //tiposLimpeza = data, erroTipo = error
    const {data: tiposLimpeza, error: erroTipo} = await supabaseAdmin
    .from('tipos_limpeza') //Qual a tabela? 
    .select('preco_por_m2') //Qual a coluna?
    .eq('id_limpeza', tipo_limpeza_id) //Qual o parametro
    .single() //Receber apenas um único objeto como resposta

    if (erroTipo || !tiposLimpeza) {
        return res.status(400).json({message: 'Tipo de limpeza inválido ou não encontrado', error: erroTipo.message})
    }

    // string = "12345" numero = 12345
    const valorTotal = Number(metragem) * tiposLimpeza.preco_por_m2

    const {data: pedido, error: pedidoError} = await supabaseAdmin
    .from('pedidos_orcamento')
    .insert({
        nome_cliente,
        telefone,
        email,
        metragem: Number(metragem),
        tipo_de_limpeza: tipo_limpeza_id,
        valor_total: valorTotal,
        status: "Pendente"
    })
    .select()// Basicamente é: "Eu quero que você me traga de volta as informações da tabela após executar essa ação"
    .single()// Receber apenas um único objeto como resposta


    if (pedidoError) {
        return res.status(500).json({message: 'Erro ao salvar o pedido de orçamento', error: pedidoError.message})
    }

    return res.status(201).json({message: "Orçamento gerado e salvo com sucesso", pedido: pedido})
}   