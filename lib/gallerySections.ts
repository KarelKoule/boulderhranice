export const GALLERY_SECTIONS = [
  { key: "velky-previs", image: "/images/velky-previs.png" },
  { key: "maly-previs", image: "/images/maly-previs.png" },
  { key: "rovina", image: "/images/rovina.png" },
  { key: "mala-rovina", image: "/images/mala-rovina.png" },
] as const;

export type GallerySectionKey = (typeof GALLERY_SECTIONS)[number]["key"];

