import { useState } from "react";
import { Search, Heart, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";

const PETS = [
  { id: 1, img: pet1, name: "Toby", age: "3 años", tipo: "Perro", sexo: "Macho", zona: "Puerto Montt", tag: "Cariñoso", desc: "Mestizo amistoso, ideal para familia con jardín." },
  { id: 2, img: pet2, name: "Luna", age: "4 meses", tipo: "Gato", sexo: "Hembra", zona: "Angelmó", tag: "Juguetona", desc: "Gatita curiosa que adora trepar y dormir contigo." },
  { id: 3, img: pet3, name: "Copito", age: "2 meses", tipo: "Perro", sexo: "Macho", zona: "Alerce", tag: "Tímido", desc: "Cachorrito que necesita una familia paciente." },
  { id: 4, img: pet4, name: "Mango", age: "2 años", tipo: "Gato", sexo: "Macho", zona: "Pelluco", tag: "Tranquilo", desc: "Gato adulto vacunado y esterilizado." },
  { id: 5, img: pet1, name: "Rocco", age: "5 años", tipo: "Perro", sexo: "Macho", zona: "Mirasol", tag: "Activo", desc: "Le encantan los paseos largos por la costa." },
  { id: 6, img: pet2, name: "Misha", age: "1 año", tipo: "Gato", sexo: "Hembra", zona: "Centro", tag: "Cariñosa", desc: "Esteriliza y al día con sus vacunas." },
];

const Adopciones = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Todos" | "Perro" | "Gato">("Todos");

  const list = PETS.filter(
    (p) => (filter === "Todos" || p.tipo === filter) && p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-warm py-16">
        <div className="container mx-auto">
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">Adopciones disponibles</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold max-w-3xl">Encuentra al amigo <span className="italic text-gradient-brand">que estaba esperándote</span></h1>
          <p className="mt-4 text-muted-foreground max-w-xl text-lg">Cada mascota viene con su ficha médica completa y proceso de adopción responsable.</p>

          <div className="mt-8 flex flex-wrap gap-3 items-center bg-card rounded-2xl p-3 shadow-card max-w-3xl border border-border">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre..." className="border-0 focus-visible:ring-0 shadow-none px-0" />
            </div>
            <div className="flex gap-1.5">
              {(["Todos", "Perro", "Gato"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 h-10 rounded-full text-sm font-semibold transition-smooth ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary-soft text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <p className="text-sm text-muted-foreground mb-6">{list.length} mascota{list.length !== 1 && "s"} esperan un hogar</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <article key={p.id} className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-2 transition-smooth border border-border">
              <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700" />
                <button className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-card/90 backdrop-blur hover:bg-accent hover:text-accent-foreground transition-smooth">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary-soft text-secondary font-semibold">{p.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{p.tipo} · {p.sexo} · {p.age}</p>
                <p className="text-sm mt-3 text-foreground/80 leading-relaxed">{p.desc}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {p.zona}</div>
                <Button variant="hero" className="w-full mt-5">Iniciar adopción</Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Adopciones;
