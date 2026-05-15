export interface PaletteColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text_primary: string;
  text_secondary: string;
}

export interface Palette {
  id: string;
  name: string;
  recommended: boolean;
  colors: PaletteColors;
  rationale: string;
}

export interface FontVariant {
  family: string;
  google_fonts_url: string | null;
  weight: string;
}

export interface Typography {
  id: string;
  name: string;
  recommended: boolean;
  heading: FontVariant;
  body: FontVariant;
  rationale: string;
}

export interface User {
  role: string;
  description: string;
  technical_level: string;
  primary: boolean;
}

export interface QuestionOption {
  label: string;
  value: string;
  recommended: boolean;
}

export interface PendingQuestion {
  id: string;
  question: string;
  context: string;
  options: QuestionOption[];
  answered: boolean;
  answer: string | null;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: number;
  confirmed: boolean;
}

export interface Approval {
  status: "pending" | "approved";
  approved_at: string | null;
  approved_by: string | null;
  selected_palette: string | null;
  selected_typography: string | null;
  notes: string | null;
}

export interface OnboardingData {
  project: {
    name: string;
    slug: string;
    type: string;
    description: string;
    timeline: string;
    generated_at: string;
  };
  market_context: {
    sector: string;
    problem_statement: string;
    competitors: Array<{ name: string; url: string | null; differentiator: string }>;
    faqs: Array<{ question: string; answer: string }>;
    market_notes: string;
  };
  users: User[];
  features: {
    mvp: Feature[];
    nice_to_have: Feature[];
    out_of_scope: string[];
  };
  design: {
    feeling: string[];
    references: string[];
    palettes: Palette[];
    typography: Typography[];
    logo: { status: string; format: string; notes: string };
  };
  pending_questions: PendingQuestion[];
  tech: {
    stack_suggestion: { frontend: string; backend: string; database: string; hosting: string; notes: string };
    integrations: Array<{ service: string; purpose: string; mvp: boolean }>;
  };
  approval: Approval;
}

export interface PaletteAlternate {
  name: string;
  colors: PaletteColors;
  rationale: string;
}

export interface TypographyAlternate {
  name: string;
  heading: FontVariant;
  body: FontVariant;
  rationale: string;
}

export interface HistorySnapshot<T> {
  items: T[];
  label: string;
  referenceName: string | null;
}

export interface AnswerState {
  answered: boolean;
  answer: string | null;
}
