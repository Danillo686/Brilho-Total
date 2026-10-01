import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY! // --> Puxando do .env, o "!", significa "Eu tenho certeza que existe"
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // --> Role key é uma chave admin, Anon Key é pública 

if (!supabaseUrl || !supabaseAnonKey || !supabaseRoleKey) {
    throw new Error("As variáveis não carregaram, por favor, tente novamente...")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) // --> Chave pública
export const supabaseAdmin = createClient(supabaseUrl, supabaseRoleKey)// --> Chave adm