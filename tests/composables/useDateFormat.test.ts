import { describe, it, expect } from 'vitest'
import { useDateFormat } from '~/composables/useDateFormat'

describe('useDateFormat', () => {
  const { fmt, displayDate, monthNames } = useDateFormat()

  describe('fmt', () => {
    it('formats a date to YYYY-MM-DD', () => {
      expect(fmt(new Date(2026, 4, 31))).toBe('2026-05-31')
    })

    it('pads single-digit month and day', () => {
      expect(fmt(new Date(2026, 0, 1))).toBe('2026-01-01')
    })

    it('handles December correctly', () => {
      expect(fmt(new Date(2026, 11, 25))).toBe('2026-12-25')
    })
  })

  describe('displayDate', () => {
    it('formats date string to readable format', () => {
      const result = displayDate('2026-05-31')
      expect(result).toContain('May')
      expect(result).toContain('31')
      expect(result).toContain('2026')
    })
  })

  describe('monthNames', () => {
    it('contains all 12 months', () => {
      expect(monthNames).toHaveLength(12)
    })

    it('has January at index 0', () => {
      expect(monthNames[0]).toBe('January')
    })

    it('has December at index 11', () => {
      expect(monthNames[11]).toBe('December')
    })
  })
})
