import { Heart, Stethoscope, Map, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const valores = [
  { icon: Heart, t: "Empatía radical", d: "Cada caso es único y merece atención personalizada." },
  { icon: Stethoscope, t: "Cuidado profesional", d: "Red de veterinarios voluntarios certificados." },
  { icon: Map, t: "Cobertura local", d: "Microservicios geolocalizados barrio por barrio." },
  { icon: Users, t: "Comunidad activa", d: "Más de 12.000 vecinos colaborando." },
];

const Nosotros = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="bg-gradient-warm py-20">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">Nuestra historia</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">Nacimos para que <span className="italic text-gradient-brand">ningún animal esté solo.</span></h1>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Sanos y Salvos comenzó en Puerto Montt como una red de vecinos que rescataban mascotas perdidas. Hoy somos una plataforma tecnológica que une refugios, veterinarios y familias en toda la región.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-secondary/20 rounded-[3rem] blur-3xl" />
          <div className="relative bg-card rounded-[2.5rem] p-12 shadow-card border border-border grid place-items-center">
            <img src={logo} alt="Logo Sanos y Salvos" className="w-64 h-64 object-contain animate-float-slow" />
          </div>
        </div>
      </div>
    </section>

    <section className="container mx-auto py-20">
      <h2 className="text-4xl md:text-5xl font-display font-bold text-center max-w-2xl mx-auto">Lo que nos <span className="italic text-secondary">mueve</span></h2>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {valores.map((v) => (
          <div key={v.t} className="bg-card border border-border rounded-3xl p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-smooth">
            <div className="h-12 w-12 rounded-2xl bg-secondary-soft text-secondary grid place-items-center mb-4">
              <v.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">{v.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container mx-auto pb-20">
      <div className="bg-gradient-hero rounded-[2.5rem] text-primary-foreground p-10 md:p-16 grid md:grid-cols-3 gap-8 text-center shadow-glow">
        {[
          { n: "1.240", l: "Mascotas reunidas con su familia" },
          { n: "486", l: "Adopciones responsables" },
          { n: "12K+", l: "Voluntarios y donantes" },
        ].map((s) => (
          <div key={s.l}>
            <p className="font-display text-5xl md:text-6xl font-bold text-accent">{s.n}</p>
            <p className="mt-2 text-primary-foreground/80">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Nosotros;
