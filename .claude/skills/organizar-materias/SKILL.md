---
name: organizar-materias
description: Use whenever working with a Qoodle/campus course to track progress across sessions — before explaining a new class (to know where the student left off) and after resolving one (to update the record). Maintains one markdown file per subject under materias/. Triggers alongside explicar-clase-qoodle and any time the user references "la materia", "donde íbamos", "que vimos hasta ahora".
---

# Organizar materias

Mantiene el contexto de cada materia del campus entre sesiones, para no volver a leer todo el curso de cero cada vez.

## Dónde vive

Carpeta `materias/` en la raíz del proyecto (`E:\proyectos\proyectos-2025\js-ts\campus\qoodle-mcp\materias\`). Un archivo `.md` por materia, nombre en kebab-case sin acentos ni espacios, ej: `materias/ingles-2.md`, `materias/programacion-funcional.md`.

Si la carpeta o el archivo no existen todavía, crealos vos — no preguntes, es parte del flujo normal.

## Cuándo leer

Antes de resolver o explicar cualquier clase de una materia: buscá primero si existe `materias/<materia>.md`. Si existe, leelo entero antes de llamar a las tools de qoodle — te ahorra tiempo y te dice exactamente por dónde va el usuario y qué ya se resolvió.

## Cuándo escribir/actualizar

Inmediatamente después de explicar o resolver una clase nueva, o cuando aparece info nueva relevante (un cambio de fecha, un mail de la profe, una aclaración). No esperes a que el usuario lo pida.

## Formato del archivo

```markdown
# <Nombre de la materia>

- courseId Qoodle: <id>
- Última actualización: <fecha AAAA-MM-DD>

## Estado actual
Una o dos líneas: en qué clase están y qué es lo próximo a hacer.

## Clases vistas

### Clase N — <título/tema>
- Tema: qué género/contenido se vio.
- Resuelto: qué se resolvió ya (foros contestados, tareas armadas, etc.) y un resumen corto de la respuesta dada, no el texto completo.
- Pendiente: qué falta que el usuario complete por su cuenta (reflexiones personales, tareas subjetivas).
- Notas: fechas importantes, links externos usados (videos, PRs, docs), cambios que avisó el/la docente.

### Clase N+1 — ...
(mismo formato, se va agregando a medida que avanza el curso)

## Pendientes generales
Cosas sueltas que no son de una clase puntual (ej: clase de Zoom optativa, glosario colaborativo, planilla compartida).
```

## Reglas

- No copies el contenido completo de los PDFs/recursos ahí — es un resumen de estado, no un backup del campus. Para el contenido en detalle, se vuelve a pedir a las tools de qoodle cuando haga falta.
- Si una clase todavía no se laburó, no le agregues sección todavía (o dejala vacía con "no vista aún" si ya se sabe que existe en el temario).
- Cada clase nueva se agrega, nunca se pisa el historial de clases anteriores.
- El "Estado actual" se reescribe cada vez (es el único bloque que cambia de lugar, va siempre arriba).
