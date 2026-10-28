import OcrView from './OcrView'
import { recognizeImage, type ExtractText } from './ocr'

type AppProps = {
  extractText?: ExtractText
}

function App({ extractText = recognizeImage }: AppProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-8 py-6">
        <h1 className="text-2xl font-semibold">ReadImagenText</h1>
        <p className="mt-1 text-sm text-slate-400">
          Carga una imagen para extraer su texto.
        </p>
      </header>
      <OcrView extractText={extractText} />
    </main>
  )
}

export default App
