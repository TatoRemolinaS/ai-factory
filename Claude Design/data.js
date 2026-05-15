/* Mocked onboarding-output.json for the "Sereno" project.
   Stands in for GET /api/[slug] in the prototype. */

window.ONBOARDING_DATA = {
  project: {
    name: "Sereno",
    slug: "sereno",
    type: "app",
    description:
      "Plataforma para terapeutas que envía check-ins guiados a sus pacientes entre sesiones, recoge datos cualitativos y los devuelve al clínico en un panel curado antes de la próxima cita.",
    timeline: "8 semanas hasta MVP en producción",
    generated_at: "2026-05-15T09:42:11Z",
  },
  market_context: {
    sector: "Salud mental digital · B2B SaaS",
    problem_statement:
      "Los terapeutas pierden el contexto del paciente entre sesiones. O dependen de la memoria del paciente, o usan herramientas genéricas que no respetan el secreto profesional ni el modelo terapéutico.",
    competitors: [
      { name: "SimplePractice", url: null, differentiator: "Sereno se especializa en seguimiento entre sesiones, no en facturación." },
      { name: "Wysa", url: null, differentiator: "Sereno acompaña al terapeuta humano, no lo reemplaza con un chatbot." },
      { name: "Quenza", url: null, differentiator: "Interfaz pensada para terapeutas hispanohablantes y modelos breves." },
    ],
    faqs: [
      { question: "¿Cumple con normativa de datos clínicos?", answer: "Cifrado E2E, hosting en EU, contrato DPA estándar." },
      { question: "¿Mis pacientes necesitan instalar algo?", answer: "No. Reciben un enlace al check-in vía email o SMS." },
    ],
    market_notes:
      "El mercado de práctica privada hispanohablante (ES + LATAM) está fragmentado y subatendido. Casi todas las soluciones serias son en inglés.",
  },
  users: [
    { role: "Psicólogo/a en práctica privada", description: "5–60 pacientes activos, factura por sesión.", technical_level: "medium", primary: true },
    { role: "Paciente en terapia activa", description: "Responde check-ins desde móvil 1–3 veces por semana.", technical_level: "low", primary: false },
    { role: "Coordinador de centro pequeño", description: "Gestiona 3–8 terapeutas, ve métricas agregadas.", technical_level: "medium", primary: false },
  ],
  features: {
    mvp: [
      { id: "f_checkins", name: "Constructor de check-ins", description: "Plantillas (PHQ-9, GAD-7, libre) que el terapeuta personaliza por paciente.", priority: 1, confirmed: true },
      { id: "f_schedule", name: "Programación automática", description: "Cadencia diaria/semanal con recordatorios por email o SMS.", priority: 1, confirmed: true },
      { id: "f_dashboard", name: "Dashboard del clínico", description: "Vista por paciente con tendencias, alertas y notas pre-sesión.", priority: 1, confirmed: true },
      { id: "f_patient_link", name: "Acceso del paciente sin cuenta", description: "Enlaces firmados de un solo uso. Sin registro, sin app.", priority: 2, confirmed: true },
      { id: "f_consent", name: "Consentimiento informado digital", description: "Firma electrónica y exportable al historial clínico.", priority: 2, confirmed: true },
      { id: "f_export", name: "Exportar a PDF la sesión", description: "Resumen impreso con métricas y notas, para archivo o derivación.", priority: 3, confirmed: false },
    ],
    nice_to_have: [
      { id: "f_voicemood", name: "Check-in por nota de voz", description: "Paciente graba 30s, IA transcribe y etiqueta tono.", priority: 2, confirmed: false },
      { id: "f_groupmode", name: "Modo grupos / parejas", description: "Un check-in compartido entre dos o más pacientes.", priority: 3, confirmed: false },
      { id: "f_ehr", name: "Integración con historiales clínicos", description: "Sincroniza con sistemas hospitalarios vía HL7/FHIR.", priority: 3, confirmed: false },
    ],
    out_of_scope: [
      "Facturación a aseguradoras o cobro a pacientes",
      "Chatbot de respuesta automática al paciente",
      "Telemedicina por videollamada dentro de la plataforma",
      "App móvil nativa (web responsive en MVP)",
    ],
  },
  design: {
    feeling: ["sereno", "clínico", "honesto", "cálido", "confiable", "ligero"],
    references: [],
    palettes: [
      {
        id: "palette_1",
        name: "Hospital al amanecer",
        recommended: true,
        colors: {
          primary: "#3A6E8F",
          secondary: "#9CC0D2",
          accent: "#E8A87C",
          background: "#F6F4EF",
          surface: "#FFFFFF",
          text_primary: "#1B2A33",
          text_secondary: "#5A6C75",
        },
        rationale:
          "Azul desaturado evoca calma clínica sin sentirse frío. El acento melocotón devuelve calidez humana — clave para que el paciente sienta que escribe a una persona, no a un sistema.",
      },
      {
        id: "palette_2",
        name: "Cuaderno de notas",
        recommended: false,
        colors: {
          primary: "#2A2A2A",
          secondary: "#7A7468",
          accent: "#C8553D",
          background: "#F4EFE6",
          surface: "#FBF8F1",
          text_primary: "#1A1A1A",
          text_secondary: "#5C564C",
        },
        rationale:
          "Tonos papel y tinta. Refuerza la metáfora de cuaderno terapéutico. Más editorial y cálido, pero menos legible en pantallas pequeñas para pacientes mayores.",
      },
      {
        id: "palette_3",
        name: "Salvia profunda",
        recommended: false,
        colors: {
          primary: "#3F5E4F",
          secondary: "#A8BBA2",
          accent: "#D9A441",
          background: "#F1EFE9",
          surface: "#FFFFFF",
          text_primary: "#1F2E26",
          text_secondary: "#566B5F",
        },
        rationale:
          "Verde sobrio y mostaza apagada. Tiene un acento más bioético / natural. Atrevida para sector salud — puede diferenciar pero asume cierto riesgo.",
      },
      {
        id: "palette_4",
        name: "Tinta y arcilla",
        recommended: false,
        colors: {
          primary: "#1F3A5F",
          secondary: "#C8A98B",
          accent: "#D14B3D",
          background: "#FAF6F0",
          surface: "#FFFFFF",
          text_primary: "#141B26",
          text_secondary: "#5C5249",
        },
        rationale:
          "Azul marino con neutro arcilla — proyecta autoridad clínica con un punto humanístico. La paleta más institucional de las cuatro.",
      },
    ],
    typography: [
      {
        id: "typo_1",
        name: "Editorial sereno",
        recommended: true,
        heading: { family: "Newsreader", google_fonts_url: "https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&display=swap", weight: "500" },
        body: { family: "Inter Tight", google_fonts_url: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap", weight: "400" },
        rationale:
          "Serifa Newsreader para titulares — calidez editorial, evoca un libro de consulta. Inter Tight como cuerpo lee impecable en pantallas pequeñas, donde el paciente respondrá los check-ins.",
      },
      {
        id: "typo_2",
        name: "Humanista clínico",
        recommended: false,
        heading: { family: "Fraunces", google_fonts_url: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap", weight: "600" },
        body: { family: "Manrope", google_fonts_url: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap", weight: "400" },
        rationale:
          "Fraunces aporta personalidad sin perder seriedad. Manrope es una sans humanista neutra. Más expresiva — puede sentirse algo lifestyle para algunos pacientes.",
      },
      {
        id: "typo_3",
        name: "Honesta y plana",
        recommended: false,
        heading: { family: "Söhne", google_fonts_url: null, weight: "600" },
        body: { family: "Söhne", google_fonts_url: null, weight: "400" },
        rationale:
          "Una sola familia, en mayor y menor peso. La opción más sobria. Apropiada para una herramienta clínica que no quiere llamar la atención. Söhne es licencia comercial — coste fijo.",
      },
    ],
    logo: { status: "to_create", format: "svg", notes: "El cliente no tiene logo. Estilista propondrá 3 direcciones en la fase de fábrica." },
  },
  pending_questions: [
    {
      id: "q1",
      question: "¿Cuándo se envían los recordatorios al paciente si no ha completado su check-in?",
      context: "Define la lógica de scheduling del módulo de envíos. Decisión bloqueante: condiciona la arquitectura del worker de notificaciones.",
      options: [
        { label: "A las 24h del envío original", value: "24h", recommended: true },
        { label: "A las 12h (dos recordatorios al día)", value: "12h", recommended: false },
        { label: "Solo si el terapeuta lo activa manualmente", value: "manual", recommended: false },
      ],
      answered: false,
      answer: null,
    },
    {
      id: "q2",
      question: "¿Pueden los pacientes ver su propio histórico de respuestas?",
      context: "Afecta a la UI del enlace de paciente y al modelo de privacidad. Algunos terapeutas prefieren controlar la narrativa de la mejora.",
      options: [
        { label: "Sí, siempre accesible al paciente", value: "always", recommended: false },
        { label: "Sí, pero el terapeuta decide qué se comparte", value: "controlled", recommended: true },
        { label: "No, sólo lo ve el terapeuta", value: "private", recommended: false },
      ],
      answered: false,
      answer: null,
    },
    {
      id: "q3",
      question: "¿En qué idiomas tiene que estar el MVP?",
      context: "Cada idioma adicional añade ~3 días de trabajo y coordinación de copy clínico revisado.",
      options: [
        { label: "Solo español (ES + LATAM neutro)", value: "es", recommended: true },
        { label: "Español + inglés", value: "es_en", recommended: false },
        { label: "Español, inglés y portugués", value: "es_en_pt", recommended: false },
      ],
      answered: false,
      answer: null,
    },
    {
      id: "q4",
      question: "¿Hay algún flujo o decisión que olvidamos cubrir en este brief? Cualquier cosa que te preocupe.",
      context: "Última oportunidad para añadir contexto antes de que la fábrica empiece a construir. Cualquier cosa que pienses cuenta — copy, integraciones, modelo de negocio.",
      options: [],
      answered: false,
      answer: null,
    },
  ],
  tech: {
    stack_suggestion: { frontend: "Next.js 14", backend: "Next API routes + Postgres", database: "Postgres (Supabase)", hosting: "Vercel + Supabase EU", notes: "Cifrado de datos clínicos a nivel de columna." },
    integrations: [
      { service: "Resend", purpose: "Envíos de email transaccionales", mvp: true },
      { service: "Twilio", purpose: "SMS de recordatorio", mvp: true },
      { service: "Stripe", purpose: "Suscripción mensual del terapeuta", mvp: true },
    ],
  },
  approval: {
    status: "pending",
    approved_at: null,
    approved_by: null,
    selected_palette: null,
    selected_typography: null,
    notes: null,
  },
};

/* Alternate palettes & typography pairings returned by the estilista agent
   on regeneration. In production these would be generated dynamically by the
   agent based on the selected reference. In this prototype they're pre-authored
   variations that fit Sereno; the rationale is templated at runtime. */
window.PALETTE_ALTERNATES = [
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

window.TYPOGRAPHY_ALTERNATES = [
  {
    name: "Susurrante",
    heading: { family: "Spectral", google_fonts_url: "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&display=swap", weight: "500" },
    body:    { family: "DM Sans",  google_fonts_url: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Serifa Spectral, hecha para pantalla a cuerpos pequeños. DM Sans es neutra y muy legible. Suena más íntima que la opción editorial.",
  },
  {
    name: "Médico moderno",
    heading: { family: "Libre Caslon Text", google_fonts_url: "https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&display=swap", weight: "700" },
    body:    { family: "Source Sans 3",    google_fonts_url: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Libre Caslon tiene autoridad clínica de toda la vida. Source Sans 3 es una de las sans más legibles. Pareja conservadora que envejece bien.",
  },
  {
    name: "Cuaderno cosido",
    heading: { family: "Lora",    google_fonts_url: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&display=swap", weight: "600" },
    body:    { family: "Nunito",  google_fonts_url: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600&display=swap", weight: "400" },
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
    body:    { family: "IBM Plex Sans",  google_fonts_url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap", weight: "400" },
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
    body:    { family: "Asap",                google_fonts_url: "https://fonts.googleapis.com/css2?family=Asap:wght@400;500;600&display=swap", weight: "400" },
    rationale: "Cormorant Garamond es delicada y literaria. Asap aporta ritmo sin gritar. La opción más \"libro\" — quizá demasiado romántica para producto clínico.",
  },
];
