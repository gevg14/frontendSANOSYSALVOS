import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ShieldCheck, PawPrint } from "lucide-react";
import logo from "@/assets/logo.png";

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const isAdmin = async (userId: string) => {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  return !!data?.some((r) => r.role === "admin");
};

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && (await isAdmin(session.user.id))) {
        navigate("/panel", { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsed = loginSchema.safeParse(form);
      if (!parsed.success) {
        toast({ title: "Error", description: parsed.error.errors[0].message, variant: "destructive" });
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) throw error;
      if (!data.user) throw new Error("No se pudo iniciar sesión");

      if (!(await isAdmin(data.user.id))) {
        await supabase.auth.signOut();
        toast({
          title: "Acceso denegado",
          description: "Esta cuenta no tiene permisos de administrador.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "¡Bienvenido!" });
      navigate("/panel", { replace: true });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message?.includes("Invalid login")
          ? "Email o contraseña incorrectos"
          : err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <img src={logo} alt="" className="h-12 w-12 bg-background rounded-xl p-1.5" />
          <span className="font-display text-xl font-bold">Sanos y Salvos</span>
        </Link>
        <div className="relative z-10">
          <PawPrint className="h-10 w-10 text-accent mb-4" />
          <h2 className="font-display text-4xl font-bold leading-tight">
            Panel administrador
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-sm">
            Gestiona adopciones, reportes y la comunidad desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="" className="h-10 w-10" />
              <span className="font-display text-lg font-bold">Sanos y Salvos</span>
            </Link>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              <ShieldCheck className="h-3.5 w-3.5" /> Acceso staff
            </span>
            <h1 className="font-display text-3xl font-bold">Inicia sesión</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Solo cuentas con rol administrador podrán acceder al panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@email.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Procesando..." : "Iniciar sesión"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            El registro de administradores se realiza internamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
