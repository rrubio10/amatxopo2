# Amatxopo · Gipuzkoa C1 2026

Versión limpia para sustituir la oposición anterior.

## Contenido

- 256 preguntas del documento oficial C1 OP2026/15 (Administrativo/a) y OP2026/16 (Sargento).
- Español y euskera.
- Plantilla oficial de respuestas del Cuestionario A.
- 8 temas según el índice del documento.
- Test aleatorio y por tema.
- Simulacro como en la app anterior: 100 preguntas aleatorias, 110 minutos, navegación libre, respuestas en blanco y corrección al terminar.
- Repaso de preguntas falladas.
- Estadísticas guardadas en el navegador.
- Modo estudio y modo examen.
- PWA sin dependencias externas.

## Publicar en GitHub Pages

1. Borra de la raíz del repositorio los archivos antiguos de la oposición anterior (especialmente cualquier `questions-data*.js`).
2. Sube **todo el contenido de esta carpeta** a la raíz del repositorio.
3. En GitHub: Settings → Pages → Deploy from a branch → `main` / `(root)`.
4. Haz una recarga fuerte del navegador. El nuevo `sw.js` usa una caché distinta: `amatxopo-gipuzkoa-c1-2026-v2`.

## Privacidad / progreso

El progreso usa una clave nueva de `localStorage`: `amatxopo_gipuzkoa_c1_2026_v2`, por lo que no reutiliza las estadísticas de la oposición anterior.

## Fuente

Documento: `PREGUNTAS BATERÍA-1.pdf`, Diputación Foral de Gipuzkoa, Subgrupo C1, 02/10/2026.
