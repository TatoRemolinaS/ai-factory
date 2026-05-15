import type { PaletteAlternate, TypographyAlternate } from "./types";

export const PALETTE_ALTERNATES: PaletteAlternate[] = [
  {
    name: "Aurora ártica",
    colors: { primary: "#6B9DBF", secondary: "#CBDCE5", accent: "#F2C5BE", background: "#F4F7F9", surface: "#FFFFFF", text_primary: "#1E2A34", text_secondary: "#5C6B76" },
    rationale: "Una versión más etérea, con menos contraste y más aire. El acento melocotón se vuelve más pálido — apropiada si la mayoría de pacientes responde desde móvil al despertar.",
  },
  {
    name: "Estudio del psicólogo",
    colors: { primary: "#2D4A5C", secondary: "#A89B7E", accent: "#C77B5E", background: "#F5EFE6", surface: "#FFFFFF", text_primary: "#1A2329", text_secondary: "#5A5448" },
    rationale: "Teal profundo con camel cálido. Sensación de despacho terapéutico clásico — moqueta, libros, lámpara baja.",
  },
  {
    name: "Lavanda terapéutica",
    colors: { primary: "#7E7AAB", secondary: "#C9C2D9", accent: "#8FA587", background: "#F7F4F1", surface: "#FFFFFF", text_primary: "#2A2535", text_secondary: "#5F5970" },
    rationale: "Lila suave con verde salvia. Toca registros emocionales sin caer en el cliché 'wellness' rosa.",
  },
  {
    name: "Madera y lino",
    colors: { primary: "#7B5C3F", secondary: "#D9CDB8", accent: "#5A7A60", background: "#F4F0E8", surface: "#FFFFFF", text_primary: "#2B1F12", text_secondary: "#675A48" },
    rationale: "Marrones de madera con un verde musgo discreto. Más orgánico — sirve si el branding empuja hacia naturopatía o terapia integrativa.",
  },
  {
    name: "Atardecer suave",
    colors: { primary: "#9C5765", secondary: "#E8C5C0", accent: "#6E5478", background: "#FAF3EE", surface: "#FFFFFF", text_primary: "#2E1B22", text_secondary: "#6D5260" },
    rationale: "Rosa polvo y ciruela. Apropiada si la mayoría de pacientes son mujeres adultas o el branding se inclina hacia salud reproductiva o vínculo.",
  },
  {
    name: "Cobalto sereno",
    colors: { primary: "#1F3A8A", secondary: "#A9B6D9", accent: "#D4A55C", background: "#F5F3EE", surface: "#FFFFFF", text_primary: "#0F1A33", text_secondary: "#4B5670" },
    rationale: "Azul cobalto con ocre cálido. Más institucional, casi editorial — buena para una versión 'profesional' del producto.",
  },
  {
    name: "Brisa marina",
    colors: { primary: "#5C998C", secondary: "#C5D9D2", accent: "#E89B7C", background: "#F4F6F2", surface: "#FFFFFF", text_primary: "#1E2B27", text_secondary: "#54665F" },
    rationale: "Verde-azulado y coral. Trae aire mediterráneo sin caer en pasteles. Buena si la marca tiene una versión costera o veraniega.",
  },
  {
    name: "Pino y nube",
    colors: { primary: "#2F4D3F", secondary: "#D4D8CF", accent: "#C29C5B", background: "#F5F5F0", surface: "#FFFFFF", text_primary: "#16241D", text_secondary: "#4F5A52" },
    rationale: "Verde pino oscuro sobre nube clara, con oro mostaza. Sobria y discreta — la opción más editorial.",
  },
  {
    name: "Café y cuaderno",
    colors: { primary: "#4A3328", secondary: "#D9C5B0", accent: "#8B7A4F", background: "#F4ECE0", surface: "#FFFFFF", text_primary: "#241712", text_secondary: "#6B5848" },
    rationale: "Espresso, crema y oliva. Una variación cálida que mantiene la metáfora del cuaderno terapéutico pero más íntima.",
  },
];

export const TYPOGRAPHY_ALTERNATES: TypographyAlternate[] = [
  {
    name: "Susurrante",
    heading: { family: "Spectral", google_fonts_url: "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&display=swap", weight: "500" },
    body:    { family: "DM Sans",  google_fonts_url: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Serifa Spectral, hecha para pantalla a cuerpos pequeños. DM Sans es neutra y muy legible. Suena más íntima que la opción editorial.",
  },
  {
    name: "Médico moderno",
    heading: { family: "Libre Caslon Text", google_fonts_url: "https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&display=swap", weight: "700" },
    body:    { family: "Source Sans 3", google_fonts_url: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Libre Caslon tiene autoridad clínica de toda la vida. Source Sans 3 es una de las sans más legibles. Pareja conservadora que envejece bien.",
  },
  {
    name: "Cuaderno cosido",
    heading: { family: "Lora", google_fonts_url: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&display=swap", weight: "600" },
    body:    { family: "Nunito", google_fonts_url: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Lora tiene un punto de brevity manuscrito. Nunito es redondeada y cálida — buena para textos largos en pacientes mayores.",
  },
  {
    name: "Honesto y abierto",
    heading: { family: "Crimson Pro", google_fonts_url: "https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap", weight: "600" },
    body:    { family: "Public Sans", google_fonts_url: "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Crimson Pro es una transitional moderna; Public Sans está diseñada para servicios públicos digitales. Lectura sin ruido.",
  },
  {
    name: "Clínica humanista",
    heading: { family: "Source Serif 4", google_fonts_url: "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600&display=swap", weight: "600" },
    body:    { family: "IBM Plex Sans", google_fonts_url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Source Serif y IBM Plex se diseñaron para coexistir. Estética producto técnico — eficaz si la marca va más al lado de health-tech que terapia humanista.",
  },
  {
    name: "Voz cálida",
    heading: { family: "Cardo", google_fonts_url: "https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap", weight: "700" },
    body:    { family: "Karla", google_fonts_url: "https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Cardo viene de la tradición editorial humanística; Karla es una grotesca cálida. La combinación lee como una carta personal, no un dashboard.",
  },
  {
    name: "Editorial limpio",
    heading: { family: "Bitter", google_fonts_url: "https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;600&display=swap", weight: "600" },
    body:    { family: "Outfit", google_fonts_url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Bitter es una slab serif pensada para pantalla. Outfit aporta un toque geométrico contemporáneo. Más joven, más app que despacho.",
  },
  {
    name: "Apunte rápido",
    heading: { family: "Domine", google_fonts_url: "https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600&display=swap", weight: "600" },
    body:    { family: "Mulish", google_fonts_url: "https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Domine tiene fuerza serif sin gravedad. Mulish es una sans amigable y muy legible — pareja productiva sin perder calor.",
  },
  {
    name: "Conversación íntima",
    heading: { family: "Cormorant Garamond", google_fonts_url: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap", weight: "600" },
    body:    { family: "Asap", google_fonts_url: "https://fonts.googleapis.com/css2?family=Asap:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Cormorant Garamond es delicada y literaria. Asap aporta ritmo sin gritar. La opción más 'libro' — quizá demasiado romántica para producto clínico.",
  },
];
