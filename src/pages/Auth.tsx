import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { PawPrint, ShieldCheck, User } from "lucide-react";
import logo from "@/assets/logo.png";

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const signupSchema = loginSchema.extend({
  nombre: z.string().trim().min(2, "Nombre requerido").max(100),
  telefono: z.string().trim().min(6, "Teléfono inválido").max(20),
});

type Role = "cliente" | "admin";

const getUserIsAdmin = async (userId: string) => {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  return !!data?.some((r) => r.role === "admin");
};

const Auth = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const initialRole: Role = params.get("role") === "admin" ? "admin" : "cliente";
  const [role, setRole] = useState<Role>(initialRole);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", nombre: "", telefono: "" });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = await getUserIsAdmin(session.user.id);
        navigate(isAdmin ? "/panel" : "/", { replace: true });
      }
    });
  }, [navigate]);

  const switchRole = (r: Role) => {
    setRole(r);
    setParams({ role: r });
    if (r === "admin") setMode("login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
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

        const isAdmin = await getUserIsAdmin(data.user.id);

        // Validate selected role matches actual role
        if (role === "admin" && !isAdmin) {
          await supabase.auth.signOut();
          toast({
            title: "Acceso denegado",
            description: "Esta cuenta no tiene permisos de administrador.",
            variant: "destructive",
          });
          return;
        }
        if (role === "cliente" && isAdmin) {
          toast({
            title: "Cuenta administrador",
            description: "Te redirigimos al panel administrativo.",
          });
          navigate("/panel", { replace: true });
          return;
        }

        toast({ title: "¡Bienvenido!" });
        navigate(isAdmin ? "/panel" : "/", { replace: true });
      } else {
        // Signup solo para clientes
        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) {
          toast({ title: "Error", description: parsed.error.errors[0].message, variant: "destructive" });
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { nombre: parsed.data.nombre, telefono: parsed.data.telefono },
          },
        });
        if (error) throw error;
        toast({ title: "¡Cuenta creada!", description: "Sesión iniciada como cliente." });
        if (data.user) navigate("/", { replace: true });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message?.includes("Invalid login")
          ? "Email o contraseña incorrectos"
          : err.message?.includes("already registered")
          ? "Este email ya está registrado"
          : err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAdminPortal = role === "admin";

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
            Cuidamos a quienes <br /> no tienen voz.
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-sm">
            Únete a nuestra comunidad y ayuda a transformar la vida de cientos de animales.
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

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => switchRole("cliente")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-smooth ${
                role === "cliente"
                  ? "bg-background shadow-soft text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" /> Soy cliente
            </button>
            <button
              type="button"
              onClick={() => switchRole("admin")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-smooth ${
                role === "admin"
                  ? "bg-background shadow-soft text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Soy administrador
            </button>
          </div>

          <div>
            {isAdminPortal && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                Portal administrador
              </span>
            )}
            <h1 className="font-display text-3xl font-bold">
              {mode === "login"
                ? isAdminPortal ? "Acceso staff" : "Inicia sesión"
                : "Crea tu cuenta"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {mode === "login"
                ? isAdminPortal
                  ? "Solo cuentas con rol administrador podrán acceder al panel."
                  : "Accede a tu cuenta de cliente."
                : "Regístrate como cliente para adoptar y reportar."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
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
              {loading ? "Procesando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </Button>
          </form>

          {!isAdminPortal && (
            <p className="text-sm text-center text-muted-foreground">
              {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-primary hover:underline"
              >
                {mode === "login" ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          )}
          {isAdminPortal && (
            <p className="text-xs text-center text-muted-foreground">
              El registro de administradores se realiza internamente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
