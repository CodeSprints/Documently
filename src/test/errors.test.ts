import { describe, expect, it } from 'vitest'
import { normaliseError, userMessage } from '../lib/errors'

describe('error handling', () => {
  it('normalises Error values with context and timestamp', () => {
    const result = normaliseError(new Error('Network unavailable'), 'Upload')
    expect(result.message).toBe('Network unavailable')
    expect(result.context).toBe('Upload')
    expect(result.time).toMatch(/T/)
    expect(result.id).toHaveLength(36)
  })

  it('limits long messages shown to users', () => {
    expect(userMessage('x'.repeat(200))).toHaveLength(180)
    expect(userMessage(null)).toBe('Wystąpił nieoczekiwany błąd.')
  })
})
