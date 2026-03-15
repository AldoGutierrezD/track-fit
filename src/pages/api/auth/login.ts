import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: process.env.SUPABASE_USER_EMAIL!,
        password: process.env.SUPABASE_USER_PASSWORD!
    });

    if (error) return res.status(401).json({ error: error.message });

    res.status(200).json({ session: data.session });

}
