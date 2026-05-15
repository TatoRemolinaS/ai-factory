#!/bin/bash
# ─────────────────────────────────────────────────────────────
# new-project.sh
# Prepara el workspace para un proyecto aprobado y dispara el CEO
# Uso: ./scripts/new-project.sh nombre-del-proyecto
#
# Prerequisito: el cliente ya aprobó el brief en la UI.
# El onboarding-output.json debe existir con approval.status = "approved"
# en workspace/projects/[nombre]/onboarding-output.json
# ─────────────────────────────────────────────────────────────

set -e

# ── Argumentos ────────────────────────────────────────────────
if [ -z "$1" ]; then
  echo "❌ Falta el nombre del proyecto"
  echo "   Uso: ./scripts/new-project.sh nombre-del-proyecto"
  exit 1
fi

PROJECT_NAME="$1"
PROJECT_DIR="workspace/projects/$PROJECT_NAME"
ONBOARDING_OUTPUT="$PROJECT_DIR/onboarding-output.json"
BRIEF_FINAL="$PROJECT_DIR/brief-final.json"

# ── Cargar variables de entorno ───────────────────────────────
if [ ! -f .env ]; then
  echo "❌ No se encontró .env"
  exit 1
fi
source .env

API="http://localhost:${ADMIN_API_PORT:-3000}"
AUTH="Authorization: Bearer $ADMIN_API_SECRET"

echo "🚀 Iniciando proyecto: $PROJECT_NAME"
echo ""

# ── Verificar que el onboarding está aprobado ────────────────
if [ ! -f "$ONBOARDING_OUTPUT" ]; then
  echo "❌ No se encontró: $ONBOARDING_OUTPUT"
  echo "   Completa el onboarding con el cliente antes de correr este script."
  exit 1
fi

APPROVAL_STATUS=$(python3 -c "
import json
with open('$ONBOARDING_OUTPUT') as f:
    d = json.load(f)
print(d.get('approval', {}).get('status', 'pending'))
")

if [ "$APPROVAL_STATUS" != "approved" ]; then
  echo "❌ El brief aún no está aprobado (status: $APPROVAL_STATUS)"
  echo "   El cliente debe aprobar el brief en la UI antes de continuar."
  exit 1
fi

echo "✅ Brief aprobado por el cliente"

# ── Crear estructura del proyecto en workspace ────────────────
echo ""
echo "📁 Preparando workspace para: $PROJECT_NAME"

mkdir -p "$PROJECT_DIR/preflight"
mkdir -p "$PROJECT_DIR/modules"
mkdir -p "$PROJECT_DIR/qa-reports"
mkdir -p "$PROJECT_DIR/design-system"

# El onboarding-output aprobado se convierte en el brief-final
cp "$ONBOARDING_OUTPUT" "$BRIEF_FINAL"
echo "  ✅ brief-final.json creado desde onboarding aprobado"
echo "  ✅ Estructura de directorios lista"

# ── Notificar al CEO via Admin API ────────────────────────────
echo ""
echo "📨 Enviando brief al CEO en factory-main..."

curl -sf -X POST "$API/api/rooms/factory-main/messages" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": \"system\",
    \"to\": \"ceo\",
    \"content\": \"BRIEF FINAL APROBADO · $PROJECT_NAME\nPATH: /workspace/projects/$PROJECT_NAME/brief-final.json\"
  }" > /dev/null

echo "  ✅ CEO notificado"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Proyecto iniciado: $PROJECT_NAME"
echo ""
echo "  El CEO está generando el Project Dictionary y disparando"
echo "  Research y CTO. Monitorea en:"
echo "  → http://localhost:8080 (room: factory-main)"
echo ""
echo "  Cuando el CTO termine, recibirás una notificación de Gate 1."
echo "  Ejecuta entonces: ./scripts/approve-gate1.sh $PROJECT_NAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
