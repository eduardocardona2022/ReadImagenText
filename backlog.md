# Backlog — ReadImagenText

## Contexto
App local, sin servidor, para extraer el texto impreso y manuscrito de imágenes y guardarlo en el computador. Pensada para uso personal en el navegador.

Stack: React + Vite + TypeScript + PaddleOCR.js + Tailwind CSS
Decisiones costosas: OCR local para texto impreso y manuscrito; multi-idioma en el OCR (español e inglés)

## Backlog
1. Como usuario, quiero cargar una imagen desde mi computador y ver el texto impreso o manuscrito que contiene, extraído en español e inglés, para recuperar su contenido sin volver a escribirlo.
2. Como usuario, quiero guardar el texto extraído como un archivo .txt en mi computador, para conservarlo y usarlo en otros programas. Requires: #1
3. Como usuario, quiero corregir el texto extraído antes de guardarlo, para arreglar los errores del OCR. Requires: #2
4. Como usuario, quiero recibir un aviso claro cuando la imagen no tiene texto o el archivo no es válido, para saber qué pasó y probar con otra imagen. Requires: #1
