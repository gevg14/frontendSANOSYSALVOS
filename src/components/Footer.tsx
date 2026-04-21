import { Link } from "react-router-dom";
import { Heart, Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-24">
    <div className="container mx-auto py-16 grid gap-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="" className="h-12 w-12 bg-background rounded-xl p-1" />
          <div>
            <p className="font-display font-bold text-xl">Sanos y Salvos</p>
            <p className="text-xs text-primary-foreground/70 uppercase tracking-widest">Cuidado y Bienestar Animal</p>
          </div>
        </div>
        <p className="text-primary-foreground/80 max-w-md leading-relaxed">
          Reunimos mascotas perdidas con sus familias, gestionamos adopciones responsables y velamos por la salud animal en cada barrio.
        </p>
        <div className="flex gap-3 mt-6">
          <a href="#" className="h-10 w-10 grid place-items-center rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-smooth"><Instagram className="h-4 w-4" /></a>
          <a href="#" className="h-10 w-10 grid place-items-center rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-smooth"><Facebook className="h-4 w-4" /></a>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-base">Servicios</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li><Link to="/adopciones" className="hover:text-accent transition-smooth">Adopciones</Link></li>
          <li><Link to="/reportar" className="hover:text-accent transition-smooth">Reportar mascota</Link></li>
          <li><Link to="/donaciones" className="hover:text-accent transition-smooth">Donar</Link></li>
          <li><Link to="/panel" className="hover:text-accent transition-smooth">Panel trabajadores</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-base">Contacto</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/80">
          <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" /> Puerto Montt, Chile</li>
          <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent" /> hola@sanosysalvos.cl</li>
          <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent" /> +56 9 1234 5678</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container mx-auto py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
        <p>© {new Date().getFullYear()} Sanos y Salvos. Todos los derechos reservados.</p>
        <p className="flex items-center gap-1">Hecho con <Heart className="h-3 w-3 fill-accent text-accent" /> para los animales</p>
      </div>
    </div>
  </footer>
);

export default Footer;
