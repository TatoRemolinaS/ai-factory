# Briefing Template — Llamada con Cliente
> Rellena esto durante o inmediatamente después de la llamada.
> No necesita ser perfecto — el paso siguiente (Claude Refinement) lo estructura.
> Deja en blanco lo que no sepas. Marca con ⚠️ lo que quedó ambiguo.

---

## 1. Contexto general

**Nombre del proyecto / empresa:**
<!-- Ej: "Fintool", "La Bodega de Ana" -->

**¿Qué hace este producto en una oración?**
<!-- Ej: "Una app donde restaurantes gestionan sus reservas sin llamadas telefónicas" -->

**¿Por qué lo están construyendo ahora?**
<!-- Contexto de motivación: perdieron clientes, vieron una oportunidad, etc. -->

**¿Existe algo parecido ya? ¿Cómo se diferencia?**
<!-- Competidores directos o referencias del mercado -->

---

## 2. Usuarios objetivo

**¿Quién es el usuario principal?**
<!-- Ej: "Dueños de restaurantes pequeños, 35-55 años, no muy técnicos" -->

**¿Hay más de un tipo de usuario?**
<!-- Ej: "También hay un admin que ve todos los restaurantes" -->

**¿Cuántos usuarios esperan tener al lanzar?**
<!-- Ayuda a dimensionar infraestructura -->

---

## 3. Tipo de proyecto

**¿Qué estamos construyendo?**
- [ ] Landing page / sitio de marketing
- [ ] App web / SaaS
- [ ] Ambos (landing + app)

**Si es landing page:**
- ¿Objetivo principal? (captar leads / vender / informar)
- ¿Tiene formulario de contacto o CTA específico?
- ¿Necesita blog o sección de contenido?

**Si es app web / SaaS:**
- ¿Tiene login / autenticación de usuarios?
- ¿Hay roles distintos? (admin, usuario, superadmin)
- ¿Es multi-tenant? (cada cliente tiene su propio espacio)

---

## 4. Features principales

> Lista las funcionalidades que el cliente mencionó. No filtres aún — eso lo hace Claude.

**Must-have (sin esto no lanza):**
-
-
-

**Nice-to-have (para después del MVP):**
-
-
-

**Explícitamente fuera de scope:**
-
-

---

## 5. Diseño y marca

**¿Tiene logo?**
- [ ] Sí → pedir archivo (SVG preferido)
- [ ] No → la fábrica lo propone

**¿Tiene colores de marca definidos?**
- [ ] Sí → anotar aquí: `#______` `#______` `#______`
- [ ] No → la fábrica propone paleta

**Referencias visuales que mencionó el cliente:**
<!-- URLs de sitios que le gustan, apps que admira, screenshots, etc. -->
-
-

**Palabras que usó para describir el feeling visual:**
<!-- Ej: "moderno pero cálido", "profesional sin ser aburrido", "minimalista" -->

**Cosas que explícitamente NO quiere:**
<!-- Ej: "nada muy corporativo", "sin animaciones exageradas" -->

---

## 6. Restricciones técnicas

**¿Tiene preferencia de stack o tecnología?**
<!-- Ej: "quiere React", "ya tiene backend en Python", "usa Supabase" -->

**¿Hay integraciones con sistemas externos?**
<!-- Ej: Stripe, WhatsApp, Google Calendar, su ERP actual -->
-
-

**¿Tiene dominio propio?**
- [ ] Sí → anotar: `_______________`
- [ ] No

**¿Dónde quiere hostear?**
- [ ] No sabe / lo decide la fábrica
- [ ] Tiene preferencia → anotar: `_______________`

---

## 7. Tiempo y presupuesto

**¿Cuándo necesita el MVP?**
<!-- Fecha o timeframe: "para el 15 de junio", "en 3 semanas" -->

**¿Hay una fecha inamovible? ¿Por qué?**
<!-- Evento, lanzamiento de campaña, inversión condicionada, etc. -->

**Presupuesto aproximado:**
- [ ] No lo dijo / prefiere no decirlo
- [ ] Rango mencionado → `_______________`

---

## 8. Notas libres

> Todo lo que no encajó arriba. Frases textuales del cliente, preocupaciones,
> contexto de la empresa, dinámicas del equipo, lo que sea relevante.




---

## 9. Flags para el paso siguiente

> Marca aquí los temas que quedaron sin resolver o necesitan aclaración
> antes de pasar a Claude Refinement.

- [ ] ⚠️
- [ ] ⚠️
- [ ] ⚠️

---

*Siguiente paso: abre una sesión de Claude con `REFINEMENT_PROMPT.md` como system prompt y pega este documento.*
