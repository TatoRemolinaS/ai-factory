#!/bin/bash
# ─────────────────────────────────────────────────────────────
# setup-agents.sh
# Crea todos los agentes y rooms de la fábrica via OpenClaw Admin API
# Correr DESPUÉS de: docker compose up -d (stack healthy)
# Uso: ./scripts/setup-agents.sh
# ─────────────────────────────────────────────────────────────

set -e

# ── Cargar variables de entorno ───────────────────────────────
if [ ! -f .env ]; then
  echo "❌ No se encontró .env — copia .env.example como .env y rellena los valores"
  exit 1
fi
source .env

API="http://localhost:${ADMIN_API_PORT:-3000}"
AUTH="Authorization: Bearer $ADMIN_API_SECRET"

# ── Helpers ───────────────────────────────────────────────────
wait_for_api() {
  echo "⏳ Esperando que el Admin API esté listo..."
  for i in {1..20}; do
    if curl -sf "$API/health" > /dev/null 2>&1; then
      echo "✅ Admin API lista"
      return 0
    fi
    sleep 3
  done
  echo "❌ Admin API no respondió después de 60s — verifica: docker compose ps"
  exit 1
}

create_agent() {
  local name=$1
  local role=$2
  local model=$3
  local prompt_file=$4
  local skills=$5

  if [ ! -f "$prompt_file" ]; then
    echo "  ❌ No se encontró el system prompt: $prompt_file"
    exit 1
  fi

  local prompt
  prompt=$(cat "$prompt_file")

  echo "  → Creando agente: $name ($model)"
  curl -sf -X POST "$API/api/agents" \
    -H "$AUTH" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$name\",
      \"role\": \"$role\",
      \"model\": \"$model\",
      \"system_prompt\": $(echo "$prompt" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'),
      \"skills\": $skills
    }" > /dev/null
  echo "  ✅ $name creado"
}

create_room() {
  local name=$1
  local agents=$2

  echo "  → Creando room: $name"
  curl -sf -X POST "$API/api/rooms" \
    -H "$AUTH" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$name\", \"agents\": $agents}" > /dev/null
  echo "  ✅ Room $name creada"
}

# ── Esperar API ───────────────────────────────────────────────
wait_for_api

# ── Crear agentes ─────────────────────────────────────────────
# Crea un agente a la vez y valida antes de continuar (no crear todo junto)
echo ""
echo "🤖 Creando agentes..."

create_agent "ceo" \
  "Orchestrator" \
  "$MODEL_CEO" \
  "agents/system-prompts/ceo.md" \
  '["filesystem"]'

create_agent "research" \
  "Technical Researcher" \
  "$MODEL_RESEARCH" \
  "agents/system-prompts/research.md" \
  '["web-search", "filesystem"]'

create_agent "onboarding-agent" \
  "Onboarding Consolidator" \
  "$MODEL_ONBOARDING_AGENT" \
  "agents/system-prompts/onboarding-agent.md" \
  '["filesystem"]'

create_agent "estilista" \
  "UI/UX Designer" \
  "$MODEL_ESTILISTA" \
  "agents/system-prompts/estilista.md" \
  '["filesystem"]'

create_agent "cto" \
  "Software Architect" \
  "$MODEL_CTO" \
  "agents/system-prompts/cto.md" \
  '["filesystem"]'

# Crear 3 instancias del Coder para paralelismo
for i in 1 2 3; do
  create_agent "coder-$i" \
    "Software Developer" \
    "$MODEL_CODER" \
    "agents/system-prompts/coder.md" \
    '["filesystem", "code-runner"]'
done

create_agent "qa" \
  "QA Engineer" \
  "$MODEL_QA" \
  "agents/system-prompts/qa.md" \
  '["filesystem"]'

# ── Crear rooms ───────────────────────────────────────────────
# Rooms separados para evitar que los agentes vean ruido de otras capas
echo ""
echo "💬 Creando rooms..."

# CEO escribe en los tres rooms. Los demás solo escuchan en el suyo.
create_room "factory-main" \
  '["ceo", "research", "onboarding-agent"]'

create_room "factory-build" \
  '["ceo", "cto", "coder-1", "coder-2", "coder-3", "qa"]'

create_room "factory-design" \
  '["ceo", "estilista"]'

# ── Verificar ─────────────────────────────────────────────────
echo ""
echo "🔍 Verificando setup..."
agent_count=$(curl -sf "$API/api/agents" -H "$AUTH" \
  | python3 -c 'import json,sys; print(len(json.load(sys.stdin)))' 2>/dev/null || echo "?")
echo "  Agentes activos: $agent_count (esperado: 9)"

room_count=$(curl -sf "$API/api/rooms" -H "$AUTH" \
  | python3 -c 'import json,sys; print(len(json.load(sys.stdin)))' 2>/dev/null || echo "?")
echo "  Rooms activos: $room_count (esperado: 3)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup completo"
echo ""
echo "  Web UI:    http://localhost:8080"
echo "  Admin API: http://localhost:${ADMIN_API_PORT:-3000}"
echo "  ChromaDB:  http://localhost:8000"
echo ""
echo "  Próximo paso:"
echo "  1. Rellena client-onboarding/BRIEFING_TEMPLATE.md durante la llamada"
echo "  2. Usa client-onboarding/REFINEMENT_PROMPT.md para generar el CEO PROMPT"
echo "  3. Pega el CEO PROMPT en factory-main"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
