# ReadImagenText

Aplicación local para extraer el texto impreso o manuscrito de una imagen y guardarlo como `.txt`. Reconoce español e inglés, está pensada para uso personal y corre entera en el navegador.

## Características

- Carga una imagen desde el computador.
- Reconoce texto impreso y manuscrito en español e inglés.
- Permite corregir el texto antes de guardarlo.
- Guarda el resultado como `.txt` con el nombre de la imagen.
- Avisa cuando la imagen no contiene texto o el archivo no es una imagen.

## Requisitos

- Node.js 22.12+ LTS y npm (probado con Node 22.23).
- Navegador moderno con WebAssembly (WebGPU opcional).
- Conexión a internet la primera vez que se usa el OCR: el modelo se descarga desde Hugging Face.

## Instalación y uso

1. Instala las dependencias con `npm install`.
2. Arranca el servidor de desarrollo con `npm run dev`.
3. Abre la URL que muestra Vite.
4. Selecciona una imagen, espera a que termine el OCR y revisa el texto.
5. Corrige lo que haga falta y pulsa «Guardar .txt».

La primera vez que se ejecuta el OCR puede tardar mientras se descarga el modelo.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm test` | Ejecuta los tests una vez. |
| `npm run test:watch` | Ejecuta los tests en modo watch. |
| `npm test -- -t "<parte del nombre>"` | Ejecuta un test por nombre. |
| `npm run build` | Valida tipos (`tsc --noEmit`) y genera el build en `dist/`. |
| `npm run preview` | Sirve el build de `dist/`. |

## Stack

- React + Vite + TypeScript.
- OCR local con `ppu-paddle-ocr/web` (modelo `V6_SMALL_MODEL`) sobre ONNX Runtime Web.
- Tailwind CSS v4.
- Vitest + Testing Library + jsdom.

## Estructura

- `src/App.tsx`: shell de la aplicación.
- `src/OcrView.tsx`: selección de imagen, estados del OCR, edición y descarga.
- `src/ocr.ts`: adaptador de PaddleOCR.
- `src/test/setup.ts`: setup de Vitest.
- `samples/`: imágenes para verificar el OCR a mano.

## Pruebas

`npm test` ejecuta la suite con Vitest. Los tests no cargan el modelo real: inyectan un `extractText` mockeado. Para comprobar la precisión del OCR, usa las imágenes de `samples/` en el navegador (ver `samples/README.md`).

## Privacidad

Las imágenes y el texto extraído se procesan y permanecen en el navegador; no se envían a ningún servidor. La primera vez que se usa el OCR, el modelo se descarga desde Hugging Face; esa descarga no incluye tus imágenes.

## Limitaciones

- La calidad del OCR depende de la imagen; el texto manuscrito puede necesitar correcciones.
- Se procesa una imagen a la vez.
- No hay historial: el texto se pierde al recargar la página si no lo has guardado.

## Desarrollo

- `AGENTS.md`: convenciones, comandos y decisiones para agentes.
- `backlog.md`: historias de usuario.
- `.opencode/skills/`: flujos de `backlog`, `story` y `pair`.
