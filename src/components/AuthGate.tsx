import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async (session: any) => {
      if (!session?.user) {
        navigate("/auth", { replace: true });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const isAdmin = data?.some((r) => r.role === "admin");
      if (isAdmin) {
        navigate("/panel", { replace: true });
        return;
      }
      if (mounted) setReady(true);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => check(session));

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthGate;
