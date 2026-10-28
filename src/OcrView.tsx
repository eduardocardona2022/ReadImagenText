import { useState, type ChangeEvent } from 'react'

type OcrViewProps = {
  extractText: (file: File) => Promise<string>
}

function OcrView({ extractText }: OcrViewProps) {
  const [text, setText] = useState('')
  const [imageName, setImageName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [notice, setNotice] = useState('')

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setNotice(
        'No se pudo leer el archivo. Asegúrate de que sea una imagen y prueba de nuevo.',
      )
      return
    }

    setIsProcessing(true)
    try {
      const recognizedText = await extractText(file)
      if (!recognizedText.trim()) {
        setNotice('No se encontró texto en la imagen. Prueba con otra imagen.')
        return
      }
      setText(recognizedText)
      setImageName(file.name.replace(/\.[^.]+$/, ''))
    } finally {
      setIsProcessing(false)
    }
  }

  function handleSave() {
    const url = URL.createObjectURL(
      new Blob([text], { type: 'text/plain;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `${imageName}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="image" className="text-sm font-medium text-slate-200">
          Imagen
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-slate-100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="recognized-text" className="text-sm font-medium text-slate-200">
          Texto reconocido
        </label>
        {isProcessing ? (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-64 items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300"
          >
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Procesando imagen...
          </div>
        ) : notice ? (
          <div
            role="alert"
            className="flex min-h-64 items-center rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-200"
          >
            {notice}
          </div>
        ) : (
          <textarea
            id="recognized-text"
            rows={12}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="resize-y rounded-lg border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100"
          />
        )}
      </div>

      <button
        type="button"
        disabled={!text}
        onClick={handleSave}
        className="self-end rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Guardar .txt
      </button>
    </section>
  )
}

export default OcrView
