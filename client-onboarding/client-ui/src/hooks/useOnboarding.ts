"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { OnboardingData, Palette, Typography, HistorySnapshot, AnswerState, PaletteAlternate, TypographyAlternate } from "@/lib/types";
import { apiGet, apiPatch, apiApprove } from "@/lib/api";
import { PALETTE_ALTERNATES, TYPOGRAPHY_ALTERNATES } from "@/lib/alternates";

function buildPaletteAlternate(alt: PaletteAlternate, i: number, reference: Palette): Palette {
  return {
    id: `gen_p_${Date.now()}_${i}`,
    name: alt.name,
    recommended: i === 0,
    colors: alt.colors,
    rationale: `Inspirada en "${reference.name}". ${alt.rationale}`,
  };
}

function buildTypoAlternate(alt: TypographyAlternate, i: number, reference: Typography): Typography {
  return {
    id: `gen_t_${Date.now()}_${i}`,
    name: alt.name,
    recommended: i === 0,
    heading: alt.heading,
    body: alt.body,
    rationale: `Inspirada en "${reference.name}". ${alt.rationale}`,
  };
}

export function useOnboarding(slug: string) {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [selectedTypo, setSelectedTypo] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [extraUsers, setExtraUsers] = useState<Array<{ role: string; technical_level: string; primary: boolean }>>([]);
  const [extraFeelings, setExtraFeelings] = useState<string[]>([]);

  const [paletteHistory, setPaletteHistory] = useState<HistorySnapshot<Palette>[]>([]);
  const [paletteHistoryIdx, setPaletteHistoryIdx] = useState(0);
  const [paletteRegenAttempts, setPaletteRegenAttempts] = useState(3);
  const [isRegeneratingPalette, setIsRegeneratingPalette] = useState(false);

  const [typoHistory, setTypoHistory] = useState<HistorySnapshot<Typography>[]>([]);
  const [typoHistoryIdx, setTypoHistoryIdx] = useState(0);
  const [typoRegenAttempts, setTypoRegenAttempts] = useState(3);
  const [isRegeneratingTypo, setIsRegeneratingTypo] = useState(false);

  const [stepIdx, setStepIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approvedAt, setApprovedAt] = useState<string | null>(null);

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const [toast, setToast] = useState<{ message: string; kind: string; id: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (message: string, kind = "default", ms = 1600) => {
    clearTimeout(toastTimer.current);
    setToast({ message, kind, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };

  const runSave = async (fn: () => Promise<void>) => {
    setSaveState("saving");
    try {
      await fn();
      setSaveState("saved");
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaveState("idle"), 1400);
    } catch {
      setSaveState("idle");
      throw new Error("save failed");
    }
  };

  useEffect(() => {
    apiGet(slug)
      .then((d) => {
        setData(d);
        setSelectedPalette(d.approval.selected_palette);
        setSelectedTypo(d.approval.selected_typography);
        setPaletteHistory([{ items: d.design.palettes, label: "Originales", referenceName: null }]);
        setTypoHistory([{ items: d.design.typography, label: "Originales", referenceName: null }]);
        const a: Record<string, AnswerState> = {};
        d.pending_questions.forEach((q) => { a[q.id] = { answered: q.answered, answer: q.answer }; });
        setAnswers(a);
        const f: Record<string, boolean> = {};
        [...d.features.mvp, ...d.features.nice_to_have].forEach((feat) => { f[feat.id] = feat.confirmed; });
        setFeatures(f);
        if (d.approval.status === "approved") {
          setApproved(true);
          setApprovedAt(d.approval.approved_at);
        }
      })
      .catch((e: Error) => setLoadError(e.message || "No se pudo cargar el brief."));
  }, [slug]);

  const onSelectPalette = async (id: string) => {
    setSelectedPalette(id);
    try { await runSave(() => apiPatch(slug, { approval: { selected_palette: id } })); }
    catch { showToast("No se pudo guardar la paleta.", "error"); }
  };

  const onSelectTypo = async (id: string) => {
    setSelectedTypo(id);
    try { await runSave(() => apiPatch(slug, { approval: { selected_typography: id } })); }
    catch { showToast("No se pudo guardar la tipografía.", "error"); }
  };

  const onAnswer = async (qid: string, value: string) => {
    const isText = !data?.pending_questions.find((q) => q.id === qid)?.options.length;
    const answered = isText ? value.trim().length > 0 : true;
    setAnswers((prev) => ({ ...prev, [qid]: { answered, answer: value } }));
    try { await runSave(() => apiPatch(slug, { pending_questions: [{ id: qid, answered, answer: value }] })); }
    catch { showToast("No se pudo guardar la respuesta.", "error"); }
  };

  const onToggleFeature = async (fid: string, confirmed: boolean) => {
    setFeatures((prev) => ({ ...prev, [fid]: confirmed }));
    try { await runSave(() => apiPatch(slug, { features: { [fid]: confirmed } })); }
    catch { showToast("No se pudo guardar la feature.", "error"); }
  };

  const onAddUser = async (role: string) => {
    const newUser = { role, technical_level: "medium", primary: false };
    setExtraUsers((prev) => [...prev, newUser]);
    try { await runSave(() => apiPatch(slug, { users_added: [newUser] })); }
    catch { showToast("No se pudo guardar el usuario.", "error"); }
  };

  const onRemoveUser = async (i: number) => {
    setExtraUsers((prev) => prev.filter((_, idx) => idx !== i));
    try { await runSave(() => apiPatch(slug, { users_removed: i })); }
    catch { showToast("No se pudo quitar el usuario.", "error"); }
  };

  const onAddFeeling = async (word: string) => {
    const all = [...(data?.design.feeling ?? []), ...extraFeelings].map((f) => f.toLowerCase());
    if (all.includes(word)) { showToast("Esa palabra ya está en la lista.", "error"); return; }
    setExtraFeelings((prev) => [...prev, word]);
    try { await runSave(() => apiPatch(slug, { feeling_added: word })); }
    catch { showToast("No se pudo guardar la palabra.", "error"); }
  };

  const onRemoveFeeling = async (i: number) => {
    setExtraFeelings((prev) => prev.filter((_, idx) => idx !== i));
    try { await runSave(() => apiPatch(slug, { feeling_removed: i })); }
    catch { showToast("No se pudo quitar la palabra.", "error"); }
  };

  const handleRegeneratePalette = async () => {
    const snap = paletteHistory[paletteHistoryIdx];
    const reference = snap?.items.find((p) => p.id === selectedPalette) as Palette | undefined;
    if (!reference || paletteRegenAttempts === 0) return;

    setIsRegeneratingPalette(true);
    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 800));

    const attemptIdx = 3 - paletteRegenAttempts;
    const sliceStart = attemptIdx * 3;
    const newAlternates = PALETTE_ALTERNATES.slice(sliceStart, sliceStart + 3).map((alt, i) =>
      buildPaletteAlternate(alt, i, reference)
    );

    const newSnapshot: HistorySnapshot<Palette> = {
      items: [{ ...reference, recommended: false }, ...newAlternates],
      label: `Gen ${attemptIdx + 1} · ${reference.name}`,
      referenceName: reference.name,
    };

    const truncated = paletteHistory.slice(0, paletteHistoryIdx + 1);
    setPaletteHistory([...truncated, newSnapshot]);
    setPaletteHistoryIdx(truncated.length);
    setPaletteRegenAttempts((p) => p - 1);
    setIsRegeneratingPalette(false);
    showToast(`3 paletas nuevas · inspiradas en "${reference.name}"`, "success", 2400);
  };

  const handleRegenerateTypo = async () => {
    const snap = typoHistory[typoHistoryIdx];
    const reference = snap?.items.find((t) => t.id === selectedTypo) as Typography | undefined;
    if (!reference || typoRegenAttempts === 0) return;

    setIsRegeneratingTypo(true);
    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 800));

    const attemptIdx = 3 - typoRegenAttempts;
    const sliceStart = attemptIdx * 3;
    const newAlternates = TYPOGRAPHY_ALTERNATES.slice(sliceStart, sliceStart + 3).map((alt, i) =>
      buildTypoAlternate(alt, i, reference)
    );

    const newSnapshot: HistorySnapshot<Typography> = {
      items: [{ ...reference, recommended: false }, ...newAlternates],
      label: `Gen ${attemptIdx + 1} · ${reference.name}`,
      referenceName: reference.name,
    };

    const truncated = typoHistory.slice(0, typoHistoryIdx + 1);
    setTypoHistory([...truncated, newSnapshot]);
    setTypoHistoryIdx(truncated.length);
    setTypoRegenAttempts((p) => p - 1);
    setIsRegeneratingTypo(false);
    showToast(`3 tipografías nuevas · inspiradas en "${reference.name}"`, "success", 2400);
  };

  const navPaletteHistory = (delta: number) =>
    setPaletteHistoryIdx((i) => Math.max(0, Math.min(paletteHistory.length - 1, i + delta)));
  const navTypoHistory = (delta: number) =>
    setTypoHistoryIdx((i) => Math.max(0, Math.min(typoHistory.length - 1, i + delta)));

  const totalQs = data?.pending_questions.length ?? 0;
  const doneQs = data ? data.pending_questions.filter((q) => answers[q.id]?.answered).length : 0;
  const mvpKept = data ? data.features.mvp.filter((f) => features[f.id] !== false).length : 0;
  const allAnswered = totalQs > 0 && doneQs === totalQs;

  const checklist = [
    { label: "Paleta de color seleccionada", done: !!selectedPalette },
    { label: "Combinación tipográfica seleccionada", done: !!selectedTypo },
    { label: `Preguntas respondidas (${doneQs}/${totalQs})`, done: allAnswered },
    { label: `Features del MVP revisadas (${mvpKept} confirmadas)`, done: mvpKept > 0 },
  ];
  const allReady = checklist.every((c) => c.done);

  const stepDone: Record<string, boolean> = {
    summary: true,
    palette: !!selectedPalette,
    typo: !!selectedTypo,
    questions: allAnswered,
    features: mvpKept > 0,
    approve: false,
  };

  const goNext = () => {
    setStepIdx((i) => Math.min(5, i + 1));
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const goPrev = () => {
    setStepIdx((i) => Math.max(0, i - 1));
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const jumpTo = (i: number) => {
    setStepIdx(i);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const handleApproveClick = () => {
    if (!allReady) return;
    setModalError(null);
    setModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    setSubmitting(true);
    setModalError(null);
    const res = await apiApprove(slug, {
      selected_palette: selectedPalette,
      selected_typography: selectedTypo,
      all_answered: allAnswered,
      notes,
    });
    setSubmitting(false);
    if (!res.ok) { setModalError(res.error ?? "Error desconocido."); return; }
    const ts = new Date().toISOString();
    setApprovedAt(ts);
    setApproved(true);
    setModalOpen(false);
  };

  const allPalettes = useMemo(() => paletteHistory.flatMap((h) => h.items), [paletteHistory]);
  const allTypos = useMemo(() => typoHistory.flatMap((h) => h.items), [typoHistory]);

  const currentPalettes = paletteHistory[paletteHistoryIdx]?.items ?? (data?.design.palettes ?? []);
  const currentTypos = typoHistory[typoHistoryIdx]?.items ?? (data?.design.typography ?? []);

  return {
    data, loadError,
    selectedPalette, selectedTypo, answers, features, notes, setNotes,
    extraUsers, extraFeelings,
    paletteHistory, paletteHistoryIdx, paletteRegenAttempts, isRegeneratingPalette,
    typoHistory, typoHistoryIdx, typoRegenAttempts, isRegeneratingTypo,
    stepIdx, modalOpen, setModalOpen, modalError, submitting, approved, approvedAt,
    saveState, toast,
    checklist, allReady, stepDone, doneQs, totalQs, mvpKept,
    allPalettes, allTypos, currentPalettes, currentTypos,
    onSelectPalette, onSelectTypo, onAnswer, onToggleFeature,
    onAddUser, onRemoveUser, onAddFeeling, onRemoveFeeling,
    handleRegeneratePalette, handleRegenerateTypo,
    navPaletteHistory, navTypoHistory,
    handleApproveClick, handleConfirmApprove,
    goNext, goPrev, jumpTo,
  };
}
