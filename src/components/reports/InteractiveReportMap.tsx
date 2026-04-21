import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type ReportType = "perdida" | "encontrada" | "urgente";

export interface Reporte {
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

type ReportTypeMeta = Record<ReportType, { label: string; color: string }>;

interface InteractiveReportMapProps {
  reportes: Reporte[];
  typeMeta: ReportTypeMeta;
}

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => htmlEntities[char]);

const makeIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:36px;height:46px;">
        <div style="position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;">
          <svg width="36" height="46" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z" fill="${color}"/>
            <circle cx="18" cy="18" r="7" fill="white"/>
          </svg>
        </div>
      </div>`,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42],
  });

const createPopupHtml = (reporte: Reporte, typeMeta: ReportTypeMeta) => {
  const meta = typeMeta[reporte.type];

  return `
    <div class="min-w-[200px]">
      <p class="text-[10px] uppercase tracking-widest font-bold" style="color:${meta.color}">
        ${escapeHtml(meta.label)} · ${escapeHtml(reporte.id)}
      </p>
      <p class="font-display text-base font-bold mt-1">${escapeHtml(reporte.nombre)}</p>
      <p class="text-xs text-muted-foreground">${escapeHtml(reporte.especie)} · ${escapeHtml(reporte.zona)}</p>
      <p class="text-xs mt-2">${escapeHtml(reporte.descripcion)}</p>
      <p class="text-[10px] text-muted-foreground mt-2">${escapeHtml(reporte.fecha)}</p>
      <a href="/reportar" class="inline-block mt-3 text-xs font-semibold text-primary hover:underline">
        Tengo información →
      </a>
    </div>`;
};

const InteractiveReportMap = ({ reportes, typeMeta }: InteractiveReportMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView([-41.4689, -72.9411], 12);
    const markers = L.layerGroup().addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
    markersRef.current = markers;

    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const markers = markersRef.current;
    if (!markers) return;

    markers.clearLayers();

    reportes.forEach((reporte) => {
      const meta = typeMeta[reporte.type];
      L.marker([reporte.lat, reporte.lng], { icon: makeIcon(meta.color) })
        .bindPopup(createPopupHtml(reporte, typeMeta))
        .addTo(markers);
    });
  }, [reportes, typeMeta]);

  return <div ref={containerRef} className="h-full w-full" aria-label="Mapa de reportes comunitarios" />;
};

export default InteractiveReportMap;
