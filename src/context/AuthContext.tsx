import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const initAuth = async () => {

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                const res = await fetch("/api/auth/login", { method: "POST" });
                const { session: newSession } = await res.json();

                if (newSession) {
                    await supabase.auth.setSession({
                        access_token: newSession.access_token,
                        refresh_token: newSession.refresh_token
                    });
                }
            }

            const { data: { user }, error } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();

    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);
