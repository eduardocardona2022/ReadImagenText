# ReadImagenText

## Contexto
App local de una sola pantalla para extraer texto impreso y manuscrito de imágenes y guardarlo como `.txt`. Corre entera en el navegador, sin backend, router ni estado global.

## Decisiones costosas
- OCR local; las imágenes nunca se suben a un servicio externo.
- El OCR debe cubrir español e inglés, impreso y manuscrito.

## Stack
- React + Vite + TypeScript estricto.
- OCR local con `ppu-paddle-ocr/web` (`V6_SMALL_MODEL`), cargado de forma perezosa en `src/ocr.ts`.
- El modelo no está empaquetado: se descarga de Hugging Face al inicializar.
- Tailwind CSS v4 con `@tailwindcss/vite`; sin `tailwind.config.js` ni PostCSS.
- Vitest + Testing Library + jsdom.

## Comandos
Usa npm (`package-lock.json`).
- `npm run dev` — servidor de desarrollo.
- `npm test` — tests una vez; `npm run test:watch` para watch.
- `npm test -- -t "<parte del nombre>"` — un test por nombre.
- `npm run build` — `tsc --noEmit` + build en `dist/`; `npm test` no valida tipos.
- No hay lint ni formatter configurados.

## Arquitectura
- `src/OcrView.tsx`: toda la interacción (selección, estados, avisos, edición y descarga).
- `src/ocr.ts`: adaptador de PaddleOCR; `recognizeImage(file)` devuelve el texto.
- `src/App.tsx`: shell; inyecta `extractText` (por defecto `recognizeImage`) para poder mockear el OCR.

## Testing
- Vitest se configura en `vite.config.ts` (jsdom, setup `src/test/setup.ts`).
- Los tests no cargan el modelo real: inyectan `extractText`.
- El input acepta `image/*`; para probar archivos inválidos usa `userEvent.setup({ applyAccept: false })`.
- La precisión del OCR se verifica a mano en el navegador con `samples/` (ver `samples/README.md`).

## Convenciones
- Textos de UI, mensajes, nombres de tests y documentación en español; identificadores en inglés.
- En TS/TSX: sin punto y coma, comillas simples y 2 espacios.

## Referencias
- `backlog.md`: historias de usuario.
- `.opencode/skills/`: flujos `backlog`, `story` y `pair` (TDD, sin commits).
