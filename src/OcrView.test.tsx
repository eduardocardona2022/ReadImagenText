import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import OcrView from './OcrView'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('OcrView', () => {
  it('deshabilita la acción de guardar cuando no hay texto reconocido', () => {
    render(<OcrView extractText={vi.fn()} />)

    expect(screen.getByRole('button', { name: /guardar .txt/i })).toBeDisabled()
  })

  it('descarga el texto reconocido en un archivo .txt', async () => {
    const user = userEvent.setup()
    let downloaded: Blob | undefined
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      downloaded = blob as Blob
      return 'blob:test'
    })
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})

    render(<OcrView extractText={vi.fn(async () => 'Hola mundo')} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)
    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue('Hola mundo')
    })

    await user.click(screen.getByRole('button', { name: /guardar .txt/i }))

    expect(clickSpy).toHaveBeenCalled()
    expect(downloaded).toBeDefined()
    expect(await downloaded!.text()).toBe('Hola mundo')
  })

  it('nombra el archivo .txt con el nombre de la imagen cargada', async () => {
    const user = userEvent.setup()
    let downloadedName: string | undefined
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
      function (this: HTMLAnchorElement) {
        downloadedName = this.download
      },
    )

    render(<OcrView extractText={vi.fn(async () => 'Hola mundo')} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)
    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue('Hola mundo')
    })

    await user.click(screen.getByRole('button', { name: /guardar .txt/i }))

    expect(downloadedName).toBe('nota.txt')
  })

  it('permite editar el texto reconocido', async () => {
    const user = userEvent.setup()
    render(<OcrView extractText={vi.fn(async () => 'Hola mundo')} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)
    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue('Hola mundo')
    })

    const textarea = screen.getByLabelText('Texto reconocido')
    await user.clear(textarea)
    await user.type(textarea, 'Hola mundo corregido')

    expect(textarea).toHaveValue('Hola mundo corregido')
  })

  it('descarga el texto corregido en el archivo .txt', async () => {
    const user = userEvent.setup()
    let downloaded: Blob | undefined
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      downloaded = blob as Blob
      return 'blob:test'
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    render(<OcrView extractText={vi.fn(async () => 'Texto original')} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)
    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue(
        'Texto original',
      )
    })

    const textarea = screen.getByLabelText('Texto reconocido')
    await user.clear(textarea)
    await user.type(textarea, 'Primera línea{Enter}Segunda línea')

    await user.click(screen.getByRole('button', { name: /guardar .txt/i }))

    expect(downloaded).toBeDefined()
    expect(await downloaded!.text()).toBe('Primera línea\nSegunda línea')
  })

  it('deshabilita la acción de guardar cuando se borra todo el texto', async () => {
    const user = userEvent.setup()
    render(<OcrView extractText={vi.fn(async () => 'Hola mundo')} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)
    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue('Hola mundo')
    })

    expect(screen.getByRole('button', { name: /guardar .txt/i })).toBeEnabled()

    await user.clear(screen.getByLabelText('Texto reconocido'))

    expect(screen.getByRole('button', { name: /guardar .txt/i })).toBeDisabled()
  })

  it('muestra el texto reconocido al elegir una imagen', async () => {
    const user = userEvent.setup()
    const extractText = vi.fn(async () => 'Hola mundo')

    render(<OcrView extractText={extractText} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)

    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue('Hola mundo')
    })
    expect(extractText).toHaveBeenCalledWith(file)
  })

  it('muestra un spinner mientras se reconoce la imagen y lo quita al terminar', async () => {
    const user = userEvent.setup()
    let resolveText!: (value: string) => void
    const extractText = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveText = resolve
        }),
    )

    render(<OcrView extractText={extractText} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)

    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect(screen.queryByLabelText('Texto reconocido')).not.toBeInTheDocument()

    resolveText('Hola mundo')

    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue('Hola mundo')
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('muestra un aviso cuando la imagen no tiene texto', async () => {
    const user = userEvent.setup()
    render(<OcrView extractText={vi.fn(async () => '   \n  ')} />)

    const file = new File(['imagen'], 'vacia.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)

    const notice = await screen.findByRole('alert')
    expect(notice).toHaveTextContent(/no se encontró texto/i)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /guardar .txt/i }),
    ).toBeDisabled()
  })

  it('muestra un aviso y no inicia el OCR cuando el archivo no es una imagen', async () => {
    const user = userEvent.setup({ applyAccept: false })
    const extractText = vi.fn(async () => 'texto')
    render(<OcrView extractText={extractText} />)

    const file = new File(['contenido'], 'nota.pdf', {
      type: 'application/pdf',
    })
    await user.upload(screen.getByLabelText('Imagen'), file)

    const notice = await screen.findByRole('alert')
    expect(notice).toHaveTextContent(/no se pudo leer el archivo/i)
    expect(extractText).not.toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: /guardar .txt/i }),
    ).toBeDisabled()
  })
})
