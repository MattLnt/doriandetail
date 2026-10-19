/**
 * Carte de la zone d'intervention.
 *
 * Dessinee en SVG plutot qu'integree depuis Google Maps : un iframe Google
 * n'est pas stylable, impose un fond clair au milieu d'une section noire,
 * depose des cookies tiers et ajoute une requete bloquante. Ici tout est
 * inline, donc instantane et aux couleurs du site.
 *
 * Les positions viennent des coordonnees reelles, projetees ci-dessous : la
 * geographie est juste, ce n'est pas un schema decoratif.
 */

const WIDTH = 620;
const HEIGHT = 440;
/** L'atelier, au centre de la projection. */
const BASE = { lat: 50.6331, lon: 4.3529 };
/** Demi-largeur de la carte, en kilometres. */
const SPAN_KM = 26;

const KM_PER_LAT = 111.2;
/** Un degre de longitude se resserre vers les poles : cos(50,6°) ≈ 0,635. */
const KM_PER_LON = 111.32 * Math.cos((BASE.lat * Math.PI) / 180);

/** Kilometres -> pixels. La carte est plus large que haute, l'echelle est
    donnee par la largeur pour que les deux axes restent proportionnels. */
const PX_PER_KM = WIDTH / 2 / SPAN_KM;

function project(lat: number, lon: number) {
  return {
    x: WIDTH / 2 + (lon - BASE.lon) * KM_PER_LON * PX_PER_KM,
    y: HEIGHT / 2 - (lat - BASE.lat) * KM_PER_LAT * PX_PER_KM,
  };
}

/** `side` place le libelle pour eviter qu'il sorte du cadre ou chevauche un
    voisin. */
const TOWNS: { name: string; lat: number; lon: number; side?: "left" }[] = [
  { name: "Waterloo", lat: 50.7156, lon: 4.3989 },
  { name: "La Hulpe", lat: 50.7333, lon: 4.4833 },
  { name: "Rixensart", lat: 50.7139, lon: 4.5278 },
  { name: "Wavre", lat: 50.7167, lon: 4.6 },
  { name: "Ottignies", lat: 50.665, lon: 4.5667 },
  { name: "Genappe", lat: 50.6111, lon: 4.4506 },
  { name: "Nivelles", lat: 50.5981, lon: 4.3272, side: "left" },
  { name: "Tubize", lat: 50.6919, lon: 4.2003, side: "left" },
  { name: "Lillois", lat: 50.65, lon: 4.35, side: "left" },
];

export function CoverageMap() {
  const base = project(BASE.lat, BASE.lon);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="Carte de la zone d'intervention autour de Braine-l'Alleud, couvrant le Brabant wallon"
    >
      <defs>
        <radialGradient id="zone-proche">
          <stop offset="0%" stopColor="#cc9286" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#cc9286" stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="halo-atelier">
          <stop offset="0%" stopColor="#cc9286" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#cc9286" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Quadrillage : donne l'echelle sans surcharger. */}
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
        {Array.from({ length: 13 }).map((_, index) => (
          <line
            key={`v${index}`}
            x1={(index * WIDTH) / 12}
            y1="0"
            x2={(index * WIDTH) / 12}
            y2={HEIGHT}
          />
        ))}
        {Array.from({ length: 10 }).map((_, index) => (
          <line
            key={`h${index}`}
            x1="0"
            y1={(index * HEIGHT) / 9}
            x2={WIDTH}
            y2={(index * HEIGHT) / 9}
          />
        ))}
      </g>

      {/* Rayons de 10, 20 et 30 km. */}
      {[30, 20, 10].map((km) => (
        <circle
          key={km}
          cx={base.x}
          cy={base.y}
          r={km * PX_PER_KM}
          fill={km === 10 ? "url(#zone-proche)" : "none"}
          stroke="rgba(204,146,134,0.3)"
          strokeWidth="1"
          strokeDasharray={km === 10 ? undefined : "5 7"}
        />
      ))}

      {[30, 20].map((km) => (
        <text
          key={`label-${km}`}
          x={base.x}
          y={base.y - km * PX_PER_KM + 15}
          textAnchor="middle"
          className="fill-[#8c8886] text-[11px]"
        >
          {km} km
        </text>
      ))}

      {/* Villes desservies. */}
      {TOWNS.map((town) => {
        const { x, y } = project(town.lat, town.lon);
        const left = town.side === "left";
        return (
          <g key={town.name}>
            <circle cx={x} cy={y} r="3.5" fill="#f5f3f2" opacity="0.75" />
            <text
              x={left ? x - 9 : x + 9}
              y={y + 4}
              textAnchor={left ? "end" : "start"}
              className="fill-[#a8a4a2] text-[12.5px]"
            >
              {town.name}
            </text>
          </g>
        );
      })}

      {/* L'atelier. */}
      <circle cx={base.x} cy={base.y} r="34" fill="url(#halo-atelier)" />
      <circle
        cx={base.x}
        cy={base.y}
        r="8"
        fill="#cc9286"
        stroke="#1b0f0a"
        strokeWidth="2.5"
      />
      <text
        x={base.x}
        y={base.y + 30}
        textAnchor="middle"
        className="fill-[#f5f3f2] text-[13.5px] font-semibold"
      >
        Braine-l&apos;Alleud
      </text>
      <text
        x={base.x}
        y={base.y + 47}
        textAnchor="middle"
        className="fill-[#cc9286] text-[11.5px] font-semibold uppercase tracking-[0.12em]"
      >
        Notre atelier
      </text>
    </svg>
  );
}
