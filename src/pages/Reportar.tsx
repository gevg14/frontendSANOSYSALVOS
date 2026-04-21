import { useState } from "react";
import { MapPin, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Reportar = () => {
  const [tipo, setTipo] = useState<"perdida" | "encontrada">("perdida");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Reporte enviado. ¡Activamos las coincidencias!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-warm py-16">
        <div className="container mx-auto max-w-4xl">
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">Reportar mascota</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Cada minuto cuenta. <span className="italic text-gradient-brand">Comencemos.</span></h1>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl">Tu reporte se publica al instante y nuestro motor de coincidencias compara automáticamente con todas las mascotas registradas.</p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl py-12">
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setTipo("perdida")}
            className={`p-6 rounded-3xl border-2 text-left transition-smooth ${tipo === "perdida" ? "border-destructive bg-destructive/5 shadow-card" : "border-border hover:border-destructive/50"}`}
          >
            <AlertTriangle className={`h-8 w-8 mb-3 ${tipo === "perdida" ? "text-destructive" : "text-muted-foreground"}`} />
            <h3 className="font-display text-xl font-bold">Perdí a mi mascota</h3>
            <p className="text-sm text-muted-foreground mt-1">Quiero registrar una desaparición</p>
          </button>
          <button
            onClick={() => setTipo("encontrada")}
            className={`p-6 rounded-3xl border-2 text-left transition-smooth ${tipo === "encontrada" ? "border-secondary bg-secondary-soft shadow-card" : "border-border hover:border-secondary/50"}`}
          >
            <CheckCircle2 className={`h-8 w-8 mb-3 ${tipo === "encontrada" ? "text-secondary" : "text-muted-foreground"}`} />
            <h3 className="font-display text-xl font-bold">Encontré una mascota</h3>
            <p className="text-sm text-muted-foreground mt-1">Quiero ayudar a reunirla con su familia</p>
          </button>
        </div>

        <form onSubmit={onSubmit} className="bg-card rounded-3xl shadow-card p-8 border border-border">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label className="mb-2 block font-semibold">Foto de la mascota</Label>
              <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-muted/40 transition-smooth cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-semibold">Arrastra una foto o haz clic</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
              </div>
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Nombre (si lo sabes)</Label>
              <Input placeholder="Ej: Toby" />
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Especie</Label>
              <Input placeholder="Perro / Gato / Otro" />
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Color</Label>
              <Input placeholder="Ej: Café con manchas blancas" />
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Tamaño</Label>
              <Input placeholder="Pequeño / Mediano / Grande" />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-2 block font-semibold flex items-center gap-1"><MapPin className="h-4 w-4" /> Última ubicación conocida</Label>
              <Input placeholder="Ej: Cerca de Angelmó, Puerto Montt" />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-2 block font-semibold">Detalles adicionales</Label>
              <Textarea rows={4} placeholder="Señas particulares, collar, comportamiento..." />
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Tu nombre</Label>
              <Input placeholder="Nombre completo" />
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Teléfono de contacto</Label>
              <Input placeholder="+56 9..." />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 items-center justify-between">
            <p className="text-xs text-muted-foreground max-w-md">Al enviar aceptas que tu reporte sea visible públicamente para ayudar a encontrar coincidencias.</p>
            <Button type="submit" variant={tipo === "perdida" ? "hero" : "green"} size="lg">
              {tipo === "perdida" ? "Publicar reporte" : "Registrar hallazgo"}
            </Button>
          </div>

          {submitted && (
            <div className="mt-6 p-4 bg-secondary-soft rounded-2xl flex items-start gap-3 animate-fade-up">
              <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">¡Reporte recibido!</p>
                <p className="text-xs text-muted-foreground">Estamos buscando coincidencias y te notificaremos al instante.</p>
              </div>
            </div>
          )}
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Reportar;
