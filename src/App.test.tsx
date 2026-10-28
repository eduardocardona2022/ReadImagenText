import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  it('muestra el texto completo con sus saltos de línea', async () => {
    const user = userEvent.setup()
    const extractText = vi.fn(async () => 'Primera línea\nSegunda línea')

    render(<App extractText={extractText} />)

    const file = new File(['imagen'], 'nota.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Imagen'), file)

    await waitFor(() => {
      expect(screen.getByLabelText('Texto reconocido')).toHaveValue(
        'Primera línea\nSegunda línea',
      )
    })
    expect(extractText).toHaveBeenCalledWith(file)
  })
})
