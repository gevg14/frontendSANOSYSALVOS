import { useState } from "react";
import { HandHeart, ShieldCheck, TrendingUp, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const HISTORIAL = [
  { donante: "Anónimo", monto: 50000, destino: "Refugio Norte", fecha: "Hoy" },
  { donante: "María C.", monto: 25000, destino: "Atención urgencia", fecha: "Hoy" },
  { donante: "Pedro V.", monto: 15000, destino: "Esterilización", fecha: "Ayer" },
  { donante: "Anónimo", monto: 100000, destino: "Refugio Sur", fecha: "Ayer" },
  { donante: "Familia Soto", monto: 30000, destino: "Vacunación", fecha: "Hace 2 días" },
];

const Donaciones = () => {
  const [monto, setMonto] = useState(15000);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`¡Gracias por tu aporte de $${monto.toLocaleString("es-CL")}!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-hero text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-accent/30 blur-3xl" />
        <div className="container mx-auto relative">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Donaciones</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold max-w-3xl">Tu generosidad <span className="italic text-accent">salva vidas</span> cada día.</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl">100% transparente. Cada peso queda registrado y puedes ver exactamente cómo se usa.</p>
        </div>
      </section>

      <section className="container mx-auto py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: HandHeart, n: "$32.450.000", l: "Recaudado este año" },
              { icon: Users, n: "1.823", l: "Donantes activos" },
              { icon: TrendingUp, n: "+24%", l: "Vs año anterior" },
            ].map((s) => (
              <div key={s.l} className="bg-card border border-border rounded-2xl p-5 shadow-soft">
                <s.icon className="h-6 w-6 text-secondary mb-3" />
                <p className="font-display text-2xl font-bold">{s.n}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
            <h2 className="font-display text-2xl font-bold mb-4">Historial público de aportes</h2>
            <div className="divide-y divide-border">
              {HISTORIAL.map((h, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-secondary-soft text-secondary grid place-items-center font-bold text-xs">
                      {h.donante[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{h.donante}</p>
                      <p className="text-xs text-muted-foreground">{h.destino} · {h.fecha}</p>
                    </div>
                  </div>
                  <p className="font-display font-bold text-primary">${h.monto.toLocaleString("es-CL")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={enviar} className="bg-gradient-warm rounded-3xl p-7 shadow-card border border-border h-fit sticky top-24">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Donación segura</p>
          </div>
          <h3 className="font-display text-2xl font-bold mb-5">Hacer una donación</h3>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[5000, 15000, 25000, 50000, 100000, 200000].map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setMonto(v)}
                className={`px-3 h-11 rounded-full text-sm font-semibold transition-smooth border-2 ${
                  monto === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"
                }`}
              >
                ${(v / 1000).toLocaleString()}k
              </button>
            ))}
          </div>

          <Label className="font-semibold">Monto personalizado</Label>
          <Input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            className="mt-2 bg-card text-lg font-bold h-12"
          />

          <Label className="font-semibold mt-4 block">Tu nombre (opcional)</Label>
          <Input placeholder="Anónimo" className="mt-2 bg-card" />

          <Label className="font-semibold mt-4 block">Email</Label>
          <Input type="email" placeholder="tu@email.com" className="mt-2 bg-card" />

          <Button type="submit" variant="warm" size="lg" className="w-full mt-6">
            <HandHeart /> Donar ${monto.toLocaleString("es-CL")}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">Recibirás comprobante por correo</p>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Donaciones;
