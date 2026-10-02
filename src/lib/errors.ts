export type AppError = {
  id: string
  message: string
  context: string
  time: string
}

export function normaliseError(error: unknown, context = 'Aplikacja'): AppError {
  const message = error instanceof Error ? error.message : String(error || 'Nieznany błąd')
  return { id: crypto.randomUUID(), message, context, time: new Date().toISOString() }
}

export function userMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || '')
  return message.length > 180 ? `${message.slice(0, 177)}...` : message || 'Wystąpił nieoczekiwany błąd.'
}
