#!/bin/bash
# ─────────────────────────────────────────────────────────────
# approve-gate1.sh
# Muestra el Blueprint Contract y lo aprueba si confirmas
# Uso: ./scripts/approve-gate1.sh nombre-del-proyecto
# ─────────────────────────────────────────────────────────────

set -e

# ── Argumentos ────────────────────────────────────────────────
if [ -z "$1" ]; then
  echo "❌ Falta el nombre del proyecto"
  echo "   Uso: ./scripts/approve-gate1.sh nombre-del-proyecto"
  exit 1
fi

PROJECT_NAME="$1"
PROJECT_DIR="workspace/projects/$PROJECT_NAME"
BLUEPRINT="$PROJECT_DIR/blueprint.yaml"

# ── Cargar variables de entorno ───────────────────────────────
if [ ! -f .env ]; then
  echo "❌ No se encontró .env"
  exit 1
fi
source .env

API="http://localhost:${ADMIN_API_PORT:-3000}"
AUTH="Authorization: Bearer $ADMIN_API_SECRET"

# ── Verificar blueprint ───────────────────────────────────────
if [ ! -f "$BLUEPRINT" ]; then
  echo "❌ No se encontró: $BLUEPRINT"
  echo "   El CTO aún no ha generado el Blueprint Contract."
  echo "   Monitorea el progreso en: http://localhost:8080 (room: factory-build)"
  exit 1
fi

GATE1_STATUS=$(python3 -c "
import re
content = open('$BLUEPRINT').read()
match = re.search(r'gate1:\s*\n\s*status:\s*(\w+)', content)
print(match.group(1) if match else 'unknown')
")

if [ "$GATE1_STATUS" = "approved" ]; then
  echo "⚠️  Gate 1 ya fue aprobado para: $PROJECT_NAME"
  echo "   Los Coders ya están corriendo."
  exit 0
fi

# ── Mostrar blueprint para revisión ──────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏸  GATE 1 — Blueprint Contract: $PROJECT_NAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat "$BLUEPRINT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Revisa el blueprint completo antes de continuar."
echo "Si necesitas cambios, indica al CTO qué corregir en factory-build."
echo ""
read -p "¿Apruebas este Blueprint Contract? (s/N): " confirm

if [[ ! "$confirm" =~ ^[Ss]$ ]]; then
  echo ""
  echo "❌ Gate 1 rechazado"
  echo "   Indica al CTO los cambios necesarios en factory-build."
  exit 0
fi

# ── Actualizar gates.gate1 en el blueprint ────────────────────
APPROVED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

python3 - <<PYEOF
import re

with open('$BLUEPRINT', 'r') as f:
    content = f.read()

content = re.sub(
    r'(  gate1:\n    status:)\s*pending',
    r'\1 approved',
    content
)
content = re.sub(
    r'(  gate1:\n    status: approved\n    approved_at:)\s*null',
    r'\1 "$APPROVED_AT"',
    content
)

with open('$BLUEPRINT', 'w') as f:
    f.write(content)

print('Blueprint actualizado')
PYEOF

echo ""
echo "✅ gates.gate1.status → approved ($APPROVED_AT)"

# ── Notificar al CEO ──────────────────────────────────────────
echo ""
echo "📨 Notificando al CEO para arrancar los Coders..."

curl -sf -X POST "$API/api/rooms/factory-build/messages" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": \"system\",
    \"to\": \"ceo\",
    \"content\": \"GATE 1 APROBADO · $PROJECT_NAME\nBLUEPRINT: /workspace/projects/$PROJECT_NAME/blueprint.yaml\nAprobado en: $APPROVED_AT\"
  }" > /dev/null

echo "  ✅ CEO notificado"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Gate 1 aprobado — $PROJECT_NAME"
echo ""
echo "  Los Coders están arrancando en paralelo."
echo "  Monitorea en: http://localhost:8080 (room: factory-build)"
echo ""
echo "  Gate 2 (QA por módulo) corre automáticamente."
echo "  Gate 3 (integración) corre al finalizar todos los módulos."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
