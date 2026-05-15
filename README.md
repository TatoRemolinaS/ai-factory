# AI Factory 🏭

Fábrica de software automatizada con agentes jerárquicos. Basada en el Blueprint V3.

El flujo completo tiene dos capas: un **sistema de onboarding del cliente** que refina el briefing antes de que toque la fábrica, y la **fábrica en sí** que construye el software de forma automatizada.

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA 1 · CLIENT ONBOARDING                                 │
│                                                             │
│  Llamada con cliente                                        │
│       ↓                                                     │
│  Tú rellenas BRIEFING_TEMPLATE.md                           │
│       ↓                                                     │
│  Sesión de Claude (REFINEMENT_PROMPT.md)                    │
│  convierte el briefing en CEO PROMPT estructurado           │
│       ↓                                                     │
│  CEO recibe el brief y dispara en paralelo:                 │
│       ↓                    ↓                                │
│  Research (preflight)   Estilista (preflight)               │
│  · Mercado y            · 3-4 paletas de color              │
│    competidores         · Tipografías sugeridas             │
│  · FAQs del sector      · Mood visual                       │
│       ↓                    ↓                                │
│       └──────┬─────────────┘                                │
│              ↓                                              │
│      Onboarding Agent                                       │
│      · Consolida outputs en JSON                            │
│      · Preguntas pendientes del cliente                     │
│      · Opciones visuales renderizables                      │
│      · Borrador de features priorizadas                     │
│              ↓                                              │
│      UI Next.js — tú + cliente juntos                       │
│      · Cliente personaliza paleta y tipografía              │
│      · Responde preguntas pendientes                        │
│      · Valida features y scope                              │
│      · Aprueba el Brief Final                               │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │ Brief Final Aprobado
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  CAPA 2 · AI FACTORY                                        │
│                                                             │
│  CEO → Project Dictionary                                   │
│       ↓              ↓                                      │
│  Research          CTO → Blueprint Contract → Gate 1        │
│  (profundo)                  ↓                              │
│                       Coders × N (paralelo)                 │
│                              ↓                              │
│                       QA Gate 2 (por archivo)               │
│                              ↓                              │
│                          Estilista (profundo)               │
│                              ↓                              │
│                       QA Gate 3 (integración)               │
│                              ↓                              │
│                          Entregable                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Agentes del sistema

| Agente | Capa | Rol |
|--------|------|-----|
| **CEO** | Ambas | Orquestador principal. Recibe briefs, genera Project Dictionary, coordina agentes |
| **Research** | Ambas | `MODO: preflight` — mercado y FAQs del sector. `MODO: fabrica` — investigación técnica profunda |
| **Estilista** | Ambas | `MODO: preflight` — paletas y tipografías. `MODO: fabrica` — design system completo |
| **Onboarding Agent** | Solo preflight | Consolida outputs de Research + Estilista en JSON para la UI del cliente |
| **CTO** | Solo fábrica | Arquitectura técnica y Blueprint Contract |
| **Coder** | Solo fábrica | Construcción de módulos (corre en paralelo, N instancias) |
| **QA** | Solo fábrica | Validación por archivo (Gate 2) e integración completa (Gate 3) |

> El CEO incluye el flag `MODO: preflight` o `MODO: fabrica` en cada instrucción
> a Research y Estilista. Ese flag define el scope y formato de output según la capa
> en que operan — sin él, ambos agentes no saben qué producir.

---

## Cómo funciona OpenClaw en esta fábrica

OpenClaw es el runtime que ejecuta los agentes. Entender cómo funciona
internamente es crítico para diseñar system prompts que realmente funcionen
en producción.

### Qué es un agente en OpenClaw

Un agente en OpenClaw no es solo un model + prompt. Es un entorno aislado
con tres componentes propios:

**1. Workspace / agentDir**
Cada agente tiene su propio directorio de trabajo. Ahí viven su configuración,
memoria, y skills. Dos agentes no comparten archivos a menos que se configure
explícitamente — por eso usamos `/workspace/projects/[nombre]/` como zona
compartida entre todos los agentes de un proyecto.

**2. Session Store**
Cada agente mantiene su propio historial de conversación y estado de sesión.
Un agente no "recuerda" lo que otro agente dijo — la memoria cross-agente
se maneja a través del workspace compartido, no del contexto de sesión.

**3. Authentication Context**
Las credenciales (API keys, tokens) son estrictamente por agente. Esto nos
permite dar al CEO acceso a más servicios que a los Coders, por ejemplo.

### Tres mecanismos de comunicación entre agentes

OpenClaw soporta tres patrones de multi-agente. La fábrica usa los tres:

**SubAgent (padre → hijo)**
El CEO lanza agentes especializados como subagentes, les pasa una tarea,
y espera el resultado. Es el patrón principal de la fábrica — CEO delega
a Research, CTO, Coders. Los subagentes ejecutan en paralelo cuando no
tienen dependencias entre sí.

```
CEO
 ├── Research  (paralelo)
 └── Estilista (paralelo)
      ↓ (ambos terminan)
 Onboarding Agent
```

**Agent Teams (peer-to-peer)**
Agentes que comparten contexto y se coordinan en tiempo real. Usado en
la fase de construcción donde Coders y QA se retroalimentan directamente
sin pasar por el CEO en cada iteración.

**AgentToAgent**
Comunicación cross-instancia. Reservado para escalar a múltiples servidores
en el futuro — no necesario para el MVP de la fábrica.

### Memoria y estado: el workspace como fuente de verdad

El mayor error en multi-agente es depender de la memoria de contexto
para pasar información entre agentes. El contexto se pierde entre sesiones.

**La fábrica usa el workspace compartido como fuente de verdad:**

```
/workspace/projects/[nombre-proyecto]/
├── brief-final.json          # Output del onboarding — lo lee el CEO
├── project-dictionary.json   # Output del CEO — lo leen todos
├── research-brief.json       # Output de Research — lo lee el CTO
├── blueprint.yaml            # Output del CTO — lo leen los Coders
├── modules/
│   ├── auth.md               # Coder 1 escribe aquí
│   ├── dashboard.md          # Coder 2 escribe aquí
│   └── api.md                # Coder 3 escribe aquí
└── qa-reports/
    ├── gate2-auth.md         # QA valida por módulo
    └── gate3-integration.md  # QA valida integración completa
```

Cada agente lee lo que necesita del workspace al inicio de su tarea y
escribe su output ahí al terminar. Nunca asume que tiene contexto de
lo que otro agente "dijo" en sesión.

### Modelo por agente: optimización de costo vs calidad

OpenClaw permite asignar modelos distintos por agente. La fábrica usa
una estrategia de dos niveles:

| Agente | Modelo recomendado | Razón |
|--------|-------------------|-------|
| CEO | Claude Opus / GPT-4o | Razonamiento complejo, orquestación |
| Research | Claude Sonnet | Balance costo/calidad para investigación |
| Estilista (preflight) | Claude Sonnet | Generación de paletas y tipografías |
| Onboarding Agent | Claude Sonnet | Consolidación de JSON |
| CTO | Claude Opus | Arquitectura técnica crítica |
| Coder × N | Claude Sonnet / Deepseek | Velocidad, corre en paralelo |
| QA | Claude Sonnet | Validación sistemática |
| Estilista (fábrica) | Claude Sonnet | Design system |

> Configura los modelos en `.env` — todos pasan por OpenRouter para
> tener un solo punto de facturación y poder cambiar modelos sin tocar código.

### Rooms y channel bindings

La fábrica usa tres rooms en OpenClaw para separar el tráfico:

| Room | Agentes | Para qué |
|------|---------|----------|
| `factory-main` | CEO, Research, Onboarding Agent | Orquestación y onboarding |
| `factory-build` | CTO, Coders × N, QA | Construcción del proyecto |
| `factory-design` | Estilista | Design system y assets visuales |

Los agentes escuchan solo en su room. El CEO puede escribir en todos.
Esto evita que los Coders vean el ruido del onboarding y viceversa.

### Mejores prácticas aplicadas a esta fábrica

Estas reglas vienen de deployments en producción — no son teóricas:

**1. Construye un agente a la vez**
No configures los 7 agentes al mismo tiempo. Empieza con el CEO,
valida que funciona, luego agrega Research, valida, y así sucesivamente.
El error más común es configurar todo y debuggear nada.

**2. System prompts cortos y con contratos explícitos**
Cada agente debe saber exactamente: qué recibe, qué produce, en qué
formato, y dónde lo escribe. Si el system prompt no dice esto, el agente
improvisa — y la improvisación rompe el pipeline.

**3. El workspace es sagrado**
Ningún agente sobreescribe el archivo de otro. Cada agente tiene su zona
de escritura definida. El CEO solo escribe `project-dictionary.json`.
Los Coders solo escriben en `modules/`. El QA solo escribe en `qa-reports/`.

**4. Gates = puntos de control humano**
Gate 1 (blueprint) es tu oportunidad de corregir la arquitectura antes
de que se construya. Gate 2 y 3 son automáticos. Nunca saltes Gate 1.

**5. Paralelismo solo donde no hay dependencias**
Research y Estilista corren en paralelo — no dependen entre sí.
CTO depende de Research — corre después. Coders dependen del blueprint —
corren después del CTO. Mapea las dependencias antes de configurar
la orquestación.

**6. Un modelo barato para tareas repetitivas**
Los Coders hacen la tarea más repetitiva y cara en tokens. Usa Deepseek
o Claude Sonnet para ellos. Guarda Opus para el CEO y el CTO donde
el razonamiento importa.

---

## Arranque rápido (primera vez)

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# → Abre .env y agrega tu OPENROUTER_API_KEY y genera los secrets

# 2. Levantar el stack
docker compose up -d

# 3. Crear agentes y rooms (en orden — un agente a la vez)
chmod +x scripts/*.sh
./scripts/setup-agents.sh
```

Listo. Abre **http://localhost:8080** y empieza a hablar con el CEO en `factory-main`.

---

## Flujo de trabajo completo

### Paso 0 · Pre-flight: Refinar el briefing del cliente

**0.1 · Llamada con el cliente**

Durante la llamada, rellena `client-onboarding/BRIEFING_TEMPLATE.md`.
Cubre: idea de negocio, usuarios objetivo, features principales, referencias
visuales, restricciones técnicas y presupuesto/tiempo.

**0.2 · Refinamiento con Claude**

Abre una sesión de Claude nueva y usa `client-onboarding/REFINEMENT_PROMPT.md`
como system prompt. Pega el template rellenado. Claude te devuelve:
- Resumen estructurado del proyecto
- Preguntas abiertas resueltas con opciones
- CEO PROMPT listo para pegar en OpenClaw

**0.3 · CEO dispara el pipeline de onboarding**

Pega el CEO PROMPT en OpenClaw (`factory-main`). El CEO orquesta:
- Research en modo preflight → contexto de mercado y FAQs
- Estilista en modo preflight → paletas, tipografías, mood visual
- Onboarding Agent → consolida todo en JSON para la UI

**0.4 · Sesión con el cliente en la UI**

```bash
docker compose --profile onboarding up -d
# → Disponible en http://localhost:3001
# → Abre esto con el cliente presente
```

El cliente personaliza opciones visuales, responde preguntas pendientes
y aprueba el Brief Final. Tú estás presente durante esta sesión.

**0.5 · Entregar el brief aprobado a la fábrica**

```bash
./scripts/new-project.sh nombre-del-proyecto
# → Copia el Brief Final Aprobado al workspace
# → Inicia el proyecto en factory-main
```

---

### Paso 1 · Fábrica: Investigación y blueprint

El CEO recibe el Brief Final, genera el **Project Dictionary** y delega:
- Research (modo fábrica) → **Research Brief** completo
- CTO → **Blueprint Contract** con arquitectura técnica

```bash
# Revisar y aprobar el blueprint antes de que arranquen los coders
./scripts/approve-gate1.sh
```

Gate 1 es tu única revisión humana de arquitectura. Corrígela aquí, no después.

---

### Paso 2 · Fábrica: Construcción

Los Coders trabajan en paralelo sobre los módulos del blueprint.
Cada archivo pasa por QA Gate 2 antes de considerarse completo.

---

### Paso 3 · Fábrica: Estilismo e integración

El Estilista (modo fábrica) aplica el design system aprobado por el cliente
sobre el código producido. QA Gate 3 valida la integración completa.

---

## Estructura del repo

```
ai-factory/
├── docker-compose.yml              # Stack completo (fábrica + client UI)
├── .env.example                    # Template de variables
├── .gitignore
│
├── client-onboarding/              # Capa de pre-flight
│   ├── BRIEFING_TEMPLATE.md        # Tú rellenas esto durante la llamada
│   ├── REFINEMENT_PROMPT.md        # System prompt para sesión de Claude
│   └── client-ui/                  # UI Next.js — tú + cliente juntos
│       ├── Dockerfile
│       ├── package.json
│       └── src/
│           ├── app/
│           ├── components/
│           │   ├── ColorPicker.tsx      # Selector visual de paletas
│           │   ├── FontPicker.tsx       # Selector de tipografías
│           │   ├── FeatureCards.tsx     # Validación de features
│           │   ├── PendingQuestions.tsx # Preguntas pendientes del cliente
│           │   └── BriefSummary.tsx     # Resumen del brief en tiempo real
│           └── lib/
│               └── api.ts               # Conexión con OpenRouter / fábrica
│
├── agents/
│   └── system-prompts/             # Un .md por agente
│       ├── ceo.md                  # Orquestador principal — ambas capas
│       ├── onboarding-agent.md     # Consolidador preflight → JSON para UI
│       ├── research.md             # Investigación (MODO: preflight | fabrica)
│       ├── estilista.md            # Diseño (MODO: preflight | fabrica)
│       ├── cto.md                  # Arquitectura y blueprint
│       ├── coder.md                # Construcción de módulos
│       └── qa.md                   # Gates 2 y 3
│
├── scripts/
│   ├── setup-agents.sh             # Crea agentes y rooms (correr una vez)
│   ├── new-project.sh              # Inicia nuevo proyecto con brief aprobado
│   └── approve-gate1.sh            # Gate 1: aprueba el Blueprint Contract
│
└── workspace/
    ├── projects/                   # Un directorio por proyecto activo
    │   └── [nombre-proyecto]/
    │       ├── brief-final.json
    │       ├── project-dictionary.json
    │       ├── research-brief.json
    │       ├── blueprint.yaml
    │       ├── modules/
    │       └── qa-reports/
    ├── templates/                  # Schemas de referencia — los agentes los leen al arrancar
    │   ├── project-dictionary.json
    │   ├── research-brief.json
    │   ├── research-preflight.json
    │   ├── estilista-preflight.json
    │   ├── onboarding-output.json
    │   ├── blueprint.yaml
    │   └── module.md
    └── .archive/                   # Proyectos terminados (ignorado en Git)
```

---

## Servicios del stack

| Servicio | URL | Para qué |
|----------|-----|----------|
| OpenClaw Web UI | http://localhost:8080 | Chat con agentes, monitoreo interno |
| Client UI | http://localhost:3001 | Onboarding del cliente (tú + cliente) |
| Admin API | http://localhost:3000 | Gestión programática |
| ChromaDB | http://localhost:8000 | RAG / soluciones previas |
| PostgreSQL | localhost:5432 | Estado y memoria de agentes |

---

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `OPENROUTER_API_KEY` | Tu API key de OpenRouter |
| `ADMIN_API_SECRET` | Secret para el Admin API (`openssl rand -hex 32`) |
| `POSTGRES_PASSWORD` | Password de la base de datos |
| `CLIENT_UI_SECRET` | Token para autenticar la UI del cliente (`openssl rand -hex 32`) |

Los modelos por agente se configuran en el `.env` — todos pasan por OpenRouter.

---

## Roadmap

| Artefacto | Estado | Descripción |
|-----------|--------|-------------|
| `client-onboarding/BRIEFING_TEMPLATE.md` | ✅ Listo y probado | Template de llamada con cliente |
| `client-onboarding/REFINEMENT_PROMPT.md` | ✅ Listo y probado | System prompt de sesión de Claude |
| `ceo.md` | ✅ Revisado | Orquestador principal — pipeline completo hasta Gate 3 |
| `onboarding-agent.md` | ✅ Revisado | Consolidador preflight → JSON para UI (schema de colores corregido) |
| `research.md` | ✅ Listo | Investigación (MODO: preflight \| fabrica) |
| `estilista.md` | ✅ Revisado | Diseño (MODO: preflight \| fabrica) — gate de activación corregido |
| `cto.md` | ✅ Listo | Arquitectura y Blueprint Contract |
| `coder.md` | ✅ Listo | Construcción de módulos (paralelo) |
| `qa.md` | ✅ Listo | Gate 2 (módulo) y Gate 3 (integración) |
| `workspace/templates/` | ✅ Listo | Schemas de referencia para todos los agentes |
| `docker-compose.yml` + `.env.example` | ✅ Listo | Stack completo con todos los servicios |
| `scripts/setup-agents.sh` | ✅ Listo | Crea los 9 agentes y 3 rooms en OpenClaw |
| `scripts/new-project.sh` | ✅ Listo | Valida brief aprobado, prepara workspace, dispara CEO |
| `scripts/approve-gate1.sh` | ✅ Listo | Muestra blueprint, actualiza gate1.status, notifica CEO |
| `client-ui/` | ✅ Listo | UI Next.js 14 — wizard de 6 pasos, API routes, integración con workspace |
