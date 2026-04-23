import { useState } from "react";
import { Search, Heart, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import pet1 from "@/assets/Luka.jpeg";
import pet2 from "@/assets/Lia.jpeg";
import pet3 from "@/assets/Kitty.jpeg";
import pet4 from "@/assets/Kira.jpeg";
import pet5 from "@/assets/Bobby.jpeg";
import pet6 from "@/assets/Dominique.jpeg";
import pet7 from "@/assets/Bob.jpeg";
import pet8 from "@/assets/Kira_A.jpeg";
import pet9 from "@/assets/Dominga.jpeg";

const PETS = [
  { id: 1, img: pet1, name: "Luka", age: "4 meses", tipo: "Perro", sexo: "Macho", zona: "Puerto Montt", tag: "Juguetón", desc: "Le gusta jugar con sus seres queridos." },
  { id: 2, img: pet2, name: "Lia", age: "4 meses", tipo: "Gato", sexo: "Hembra", zona: "Pta Sur", tag: "Enojona", desc: "Gatita enojona con los demás pero con sus seres queridos es buena." },
  { id: 3, img: pet3, name: "Kitty", age: "1 año", tipo: "Gato", sexo: "Hembra", zona: "Alerce", tag: "Dócil", desc: "Gatita súper dócil, le gusta dormir." },
  { id: 4, img: pet4, name: "Kira", age: "4 meses", tipo: "Perro", sexo: "Hembra", zona: "Pelluco", tag: "Tímida", desc: "Perrita tímida cuando no se siente en confianza pero es muy cariñosa." },
  { id: 5, img: pet5, name: "Bobby", age: "9 años", tipo: "Perro", sexo: "Macho", zona: "Mirasol", tag: "Dormilón", desc: "Le encanta dormir pero es cariñoso." },
  { id: 6, img: pet6, name: "Dominique", age: "4 años", tipo: "Gato", sexo: "Hembra", zona: "Mirasol", tag: "Regalona", desc: "Le encantan los cariños y también es intensa." },
  { id: 7, img: pet7, name: "Bob", age: "5 años", tipo: "Perro", sexo: "Macho", zona: "Mirasol", tag: "Loco", desc: "Bob es un perro loco, le gusta mucho llamar la atención." },
  { id: 8, img: pet8, name: "Kira", age: "5 años", tipo: "Perro", sexo: "Hembra", zona: "Mirasol", tag: "Mañosa", desc: "Kira es mañosa porque no hace caso a lo que uno le dice." },
  { id: 9, img: pet9, name: "Dominga", age: "4 años", tipo: "Perro", sexo: "Hembra", zona: "Mirasol", tag: "Brava", desc: "Dominga es brava con personas que no son cercanas a su dueño/a, pero adorable con su círculo." },
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
