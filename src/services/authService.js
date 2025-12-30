import { supabase } from "../lib/supabase";

export const login = async () => {
    const { data: session } = await supabase.auth.getSession();

    if (session?.session) return session.session

    const { data, error } = await supabase.auth.signInWithPassword({
        email: "aldo@gmail.com",
        password: "qwerty65"
    });

    if (error) {
        console.log(`Error al entrar: ${error}`);
        throw error;
    }

    return data.session;
}
