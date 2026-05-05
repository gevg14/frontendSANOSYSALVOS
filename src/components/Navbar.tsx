import { Link, useLocation } from "react-router-dom";
import { PawPrint, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/adopciones", label: "Adopciones" },
    { to: "/reportar", label: "Reportar" },
    { to: "/mapa", label: "Mapa" },
    { to: "/donaciones", label: "Donar" },
    { to: "/nosotros", label: "Nosotros" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <nav className="container mx-auto flex items-center justify-between py-3" aria-label="Principal">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Logo Sanos y Salvos" className="h-11 w-11 object-contain transition-smooth group-hover:scale-110" />
          <div className="leading-tight">
            <p className="font-display font-bold text-lg text-primary">Sanos y Salvos</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-semibold">Cuidado y Bienestar Animal</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                pathname === l.to
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/70 hover:text-primary hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth?role=cliente">Iniciar sesión cliente</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/auth?role=admin">Acceso administrador</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/reportar"><PawPrint className="mr-1.5 h-4 w-4" />Reportar mascota</Link>
          </Button>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-muted" aria-label="Menú">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background animate-fade-up">
          <div className="container mx-auto py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium">
                {l.label}
              </Link>
            ))}
            <Link to="/auth?role=cliente" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium">
              Iniciar sesión cliente
            </Link>
            <Link to="/auth?role=admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium">
              Acceso administrador
            </Link>
            <Button asChild variant="hero" className="mt-2"><Link to="/reportar">Reportar mascota</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
