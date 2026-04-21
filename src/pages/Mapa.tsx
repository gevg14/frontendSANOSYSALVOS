import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, AlertCircle, Search as SearchIcon, Heart, PawPrint, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ReportType = "perdida" | "encontrada" | "urgente" | "adopcion";

interface Reporte {
  id: string;
  type: ReportType;
  nombre: string;
  especie: string;
  zona: string;
  fecha: string;
  descripcion: string;
  lat: number;
  lng: number;
}

const REPORTES: Reporte[] = [
  { id: "R-482", type: "urgente",    nombre: "Perro herido",  especie: "Perro", zona: "Av. Costanera",   fecha: "Hoy 10:24",   descripcion: "Mestizo café, herido en pata trasera. Necesita atención veterinaria urgente.", lat: -41.4689, lng: -72.9411 },
  { id: "R-483", type: "perdida",    nombre: "Toby",          especie: "Perro", zona: "Pelluco",         fecha: "Hoy 09:10",   descripcion: "Labrador dorado con collar rojo. Responde a su nombre.",                       lat: -41.4612, lng: -72.9203 },
  { id: "R-484", type: "encontrada", nombre: "Gatito blanco", especie: "Gato",  zona: "Centro",          fecha: "Ayer",        descripcion: "Encontrado cerca de la plaza, muy cariñoso, sin chip.",                        lat: -41.4717, lng: -72.9360 },
  { id: "R-485", type: "adopcion",   nombre: "Luna",          especie: "Gata",  zona: "Refugio Alerce",  fecha: "Hace 2 días", descripcion: "Hembra esterilizada, vacunas al día. Busca hogar tranquilo.",                  lat: -41.3825, lng: -72.8830 },
  { id: "R-486", type: "perdida",    nombre: "Copito",        especie: "Perro", zona: "Mirasol",         fecha: "Hoy 07:45",   descripcion: "Poodle blanco pequeño, salió por portón abierto.",                             lat: -41.4901, lng: -72.9580 },
  { id: "R-487", type: "encontrada", nombre: "Perrito negro", especie: "Perro", zona: "Puerto Varas",    fecha: "Hoy 11:30",   descripcion: "Encontrado en la costanera, dócil, parece haber estado perdido varios días.",  lat: -41.3197, lng: -72.9853 },
  { id: "R-488", type: "urgente",    nombre: "Camada gatos",  especie: "Gato",  zona: "Chinquihue",      fecha: "Hoy 08:00",   descripcion: "4 gatitos abandonados, necesitan refugio inmediato.",                          lat: -41.5102, lng: -73.0210 },
  { id: "R-489", type: "adopcion",   nombre: "Rocco",         especie: "Perro", zona: "Refugio Sur",     fecha: "Hace 5 días", descripcion: "Mestizo grande, juguetón y bueno con niños.",                                  lat: -41.4530, lng: -72.9050 },
];

const TYPE_META: Record<ReportType, { label: string; color: string; icon: typeof AlertCircle }> = {
  urgente:    { label: "Urgente",    color: "hsl(var(--destructive))", icon: AlertCircle },
  perdida:    { label: "Perdida",    color: "hsl(var(--primary))",     icon: SearchIcon },
  encontrada: { label: "Encontrada", color: "hsl(var(--secondary))",   icon: PawPrint },
  adopcion:   { label: "Adopción",   color: "hsl(var(--accent))",      icon: Heart },
};

const makeIcon = (type: ReportType) => {
  const color = TYPE_META[type].color;
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:36px;height:46px;">
        <div style="position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;">
          <svg width="36" height="46" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z" fill="${color}"/>
            <circle cx="18" cy="18" r="7" fill="white"/>
          </svg>
        </div>
      </div>`,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42],
  });
};

const Mapa = () => {
  const [filters, setFilters] = useState<Record<ReportType, boolean>>({
    urgente: true, perdida: true, encontrada: true, adopcion: true,
  });
  const [query, setQuery] = useState("");

  const visibles = useMemo(
    () =>
      REPORTES.filter(
        (r) =>
          filters[r.type] &&
          (query === "" ||
            r.nombre.toLowerCase().includes(query.toLowerCase()) ||
            r.zona.toLowerCase().includes(query.toLowerCase()) ||
            r.id.toLowerCase().includes(query.toLowerCase())),
      ),
    [filters, query],
  );

  const counts = useMemo(() => {
    const c: Record<ReportType, number> = { urgente: 0, perdida: 0, encontrada: 0, adopcion: 0 };
    REPORTES.forEach((r) => (c[r.type] += 1));
    return c;
  }, []);

  const toggle = (t: ReportType) => setFilters((f) => ({ ...f, [t]: !f[t] }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-semibold uppercase tracking-widest">
              <MapPin className="h-3.5 w-3.5" /> Mapa comunitario
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-5 leading-tight">
              Mapa de reportes en tiempo real
            </h1>
            <p className="text-lg text-primary-foreground/80 mt-4">
              Visualiza mascotas perdidas, encontradas, en adopción y casos urgentes cerca de ti.
              Cada punto representa un reporte de la comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* Mapa + sidebar */}
      <section className="flex-1 bg-muted/30">
        <div className="container mx-auto py-10">
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            {/* Sidebar filtros */}
            <aside className="space-y-5">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg font-bold">Filtrar reportes</h2>
                </div>

                <div className="relative mb-4">
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nombre, zona, ID..."
                    className="pl-9 bg-muted/50 border-0"
                  />
                </div>

                <div className="space-y-2">
                  {(Object.keys(TYPE_META) as ReportType[]).map((t) => {
                    const meta = TYPE_META[t];
                    const active = filters[t];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={t}
                        onClick={() => toggle(t)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-smooth text-left ${
                          active
                            ? "border-border bg-muted/40 shadow-soft"
                            : "border-dashed border-border/60 opacity-50 hover:opacity-80"
                        }`}
                      >
                        <span
                          className="h-9 w-9 rounded-xl grid place-items-center text-primary-foreground"
                          style={{ backgroundColor: meta.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{meta.label}</p>
                          <p className="text-xs text-muted-foreground">{counts[t]} reporte{counts[t] !== 1 ? "s" : ""}</p>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${active ? "bg-secondary" : "bg-muted-foreground/30"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-5 shadow-card">
                <PawPrint className="h-7 w-7 text-accent mb-2" />
                <h3 className="font-display text-lg font-bold">¿Viste o perdiste una mascota?</h3>
                <p className="text-sm text-primary-foreground/80 mt-1">
                  Crea un reporte y aparecerá en el mapa para que la comunidad ayude.
                </p>
                <Button asChild variant="warm" size="sm" className="mt-4 w-full">
                  <Link to="/reportar">Crear reporte</Link>
                </Button>
              </div>
            </aside>

            {/* Mapa */}
            <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Resultados visibles</p>
                  <p className="font-display text-xl font-bold">
                    {visibles.length} reporte{visibles.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" /> Actualizando en vivo
                </div>
              </div>

              <div className="h-[560px] w-full">
                <MapContainer
                  center={[-41.4689, -72.9411]}
                  zoom={12}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {visibles.map((r) => (
                    <div key={r.id}>
                      <CircleMarker
                        center={[r.lat, r.lng]}
                        radius={22}
                        pathOptions={{
                          color: TYPE_META[r.type].color,
                          fillColor: TYPE_META[r.type].color,
                          fillOpacity: 0.15,
                          weight: 1,
                        }}
                      />
                      <Marker position={[r.lat, r.lng]} icon={makeIcon(r.type)}>
                        <Popup>
                          <div className="min-w-[200px]">
                            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: TYPE_META[r.type].color }}>
                              {TYPE_META[r.type].label} · {r.id}
                            </p>
                            <p className="font-display text-base font-bold mt-1">{r.nombre}</p>
                            <p className="text-xs text-muted-foreground">{r.especie} · {r.zona}</p>
                            <p className="text-xs mt-2">{r.descripcion}</p>
                            <p className="text-[10px] text-muted-foreground mt-2">{r.fecha}</p>
                            <Link
                              to="/reportar"
                              className="inline-block mt-3 text-xs font-semibold text-primary hover:underline"
                            >
                              Tengo información →
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    </div>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Lista de reportes */}
          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold mb-4">Reportes recientes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibles.map((r) => {
                const meta = TYPE_META[r.type];
                const Icon = meta.icon;
                return (
                  <article key={r.id} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-card transition-smooth">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="h-10 w-10 rounded-xl grid place-items-center text-primary-foreground shrink-0"
                        style={{ backgroundColor: meta.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{r.id}</span>
                    </div>
                    <p className="font-display text-lg font-bold mt-3">{r.nombre}</p>
                    <p className="text-xs text-muted-foreground">{r.especie} · {r.zona}</p>
                    <p className="text-sm mt-2 line-clamp-2">{r.descripcion}</p>
                    <p className="text-xs text-muted-foreground mt-3">{r.fecha}</p>
                  </article>
                );
              })}
              {visibles.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-10">
                  No hay reportes que coincidan con tus filtros.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Mapa;
