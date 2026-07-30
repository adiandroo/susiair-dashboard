import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFlightStore } from '~/stores/flight'

describe('flight store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('getters', () => {
    it('getToday returns 2026-05-31', () => {
      const store = useFlightStore()
      expect(store.getToday).toBe('2026-05-31')
    })

    it('getPilotInfo returns pilot data', () => {
      const store = useFlightStore()
      store.$patch({
        flightHours: {
          pilot: { name: 'Jane Doe', totalFlightHours: 2000 },
          limits: {},
          chartBounds: {},
          flightHours: [],
        },
      })
      expect(store.getPilotInfo.name).toBe('Jane Doe')
      expect(store.getPilotInfo.totalFlightHours).toBe(2000)
    })

    it('getFlightHoursLimits returns limits', () => {
      const store = useFlightStore()
      store.$patch({
        flightHours: {
          pilot: { name: '', totalFlightHours: 0 },
          limits: { daily: 8, weekly: 40, monthly: 100, annual: 1050 },
          chartBounds: {},
          flightHours: [],
        },
      })
      expect(store.getFlightHoursLimits.daily).toBe(8)
      expect(store.getFlightHoursLimits.annual).toBe(1050)
    })

    it('getScheduleForDate finds matching schedule', () => {
      const store = useFlightStore()
      store.$patch({
        schedules: {
          schedules: [
            { duty_date: '2026-06-01', status: 1, base_name: 'CJN', base_color: '#1FBF8F', count_schedules: 1, count_logbooks: 0 },
          ],
          legend: [],
        },
      })
      const s = store.getScheduleForDate('2026-06-01')
      expect(s).toBeTruthy()
      expect(s.base_name).toBe('CJN')
    })

    it('getScheduleForDate returns null for missing date', () => {
      const store = useFlightStore()
      store.$patch({ schedules: { schedules: [], legend: [] } })
      expect(store.getScheduleForDate('2099-01-01')).toBeFalsy()
    })

    it('getLegend returns legend array', () => {
      const store = useFlightStore()
      const legend = [{ code: 'HLP', label: 'Halim Base', color: '#22C5E8' }]
      store.$patch({ schedules: { schedules: [], legend } })
      expect(store.getLegend).toEqual(legend)
    })

    it('getDocuments returns documents array', () => {
      const store = useFlightStore()
      store.$patch({
        documents: {
          thresholds: { warningDays: 30 },
          documents: [
            { id: '1', label: 'Medical', expiryDate: '2026-12-31' },
          ],
        },
      })
      expect(store.getDocuments).toHaveLength(1)
      expect(store.getDocuments[0].label).toBe('Medical')
    })

    it('getDocumentsWithStatus adds status and daysRemaining', () => {
      const store = useFlightStore()
      store.$patch({
        documents: {
          thresholds: { warningDays: 30 },
          documents: [
            { id: '1', label: 'Safe', expiryDate: '2026-12-31' },
            { id: '2', label: 'Warning', expiryDate: '2026-06-15' },
            { id: '3', label: 'Expired', expiryDate: '2025-06-01' },
          ],
        },
      })
      const docs = store.getDocumentsWithStatus
      expect(docs).toHaveLength(3)

      const expired = docs.find((d: any) => d.id === '3')
      expect(expired.status).toBe('expired')
      expect(expired.daysRemaining).toBeLessThanOrEqual(0)

      const safe = docs.find((d: any) => d.id === '1')
      expect(safe.status).toBe('safe')
      expect(safe.daysRemaining).toBeGreaterThan(0)
    })

    it('getDailyFlightHours returns today hours', () => {
      const store = useFlightStore()
      store.$patch({
        flightHours: {
          pilot: { name: '', totalFlightHours: 0 },
          limits: {},
          chartBounds: {},
          flightHours: [{ date: '2026-05-31', hours: 4.5 }],
        },
      })
      expect(store.getDailyFlightHours).toBe(4.5)
    })

    it('getDailyFlightHours returns 0 if no entry for today', () => {
      const store = useFlightStore()
      store.$patch({
        flightHours: {
          pilot: { name: '', totalFlightHours: 0 },
          limits: {},
          chartBounds: {},
          flightHours: [],
        },
      })
      expect(store.getDailyFlightHours).toBe(0)
    })

    it('getWeeklyFlightHours sums last 7 days', () => {
      const store = useFlightStore()
      const hours = []
      for (let i = 1; i < 7; i++) {
        const d = new Date('2026-05-31T00:00:00')
        d.setDate(d.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        hours.push({ date: ds, hours: 2.0 })
      }
      store.$patch({
        flightHours: {
          pilot: { name: '', totalFlightHours: 0 },
          limits: {},
          chartBounds: {},
          flightHours: hours,
        },
      })
      expect(store.getWeeklyFlightHours).toBe(12.0)
    })

    it('getMonthlyFlightHours sums last 30 days', () => {
      const store = useFlightStore()
      const hours = []
      for (let i = 1; i < 30; i++) {
        const d = new Date('2026-05-31T00:00:00')
        d.setDate(d.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        hours.push({ date: ds, hours: 1.0 })
      }
      store.$patch({
        flightHours: {
          pilot: { name: '', totalFlightHours: 0 },
          limits: {},
          chartBounds: {},
          flightHours: hours,
        },
      })
      expect(store.getMonthlyFlightHours).toBe(29.0)
    })

    it('getAnnualFlightHours sums last 365 days', () => {
      const store = useFlightStore()
      const hours = []
      for (let i = 1; i < 365; i++) {
        const d = new Date('2026-05-31T00:00:00')
        d.setDate(d.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        hours.push({ date: ds, hours: 1.0 })
      }
      store.$patch({
        flightHours: {
          pilot: { name: '', totalFlightHours: 0 },
          limits: {},
          chartBounds: {},
          flightHours: hours,
        },
      })
      expect(store.getAnnualFlightHours).toBe(364.0)
    })

  })

  describe('actions', () => {
    it('setSelectedDate updates selectedDate', () => {
      const store = useFlightStore()
      store.setSelectedDate('2026-06-15')
      expect(store.selectedDate).toBe('2026-06-15')
    })

    it('login sets isLoggedIn to true', () => {
      const store = useFlightStore()
      expect(store.isLoggedIn).toBe(false)
      store.login()
      expect(store.isLoggedIn).toBe(true)
    })

    it('nextMonth increments month', () => {
      const store = useFlightStore()
      store.calendarMonth = 0
      store.calendarYear = 2026
      store.nextMonth()
      expect(store.calendarMonth).toBe(1)
      expect(store.calendarYear).toBe(2026)
    })

    it('nextMonth wraps from December to January', () => {
      const store = useFlightStore()
      store.calendarMonth = 11
      store.calendarYear = 2026
      store.nextMonth()
      expect(store.calendarMonth).toBe(0)
      expect(store.calendarYear).toBe(2027)
    })

    it('prevMonth decrements month', () => {
      const store = useFlightStore()
      store.calendarMonth = 6
      store.calendarYear = 2026
      store.prevMonth()
      expect(store.calendarMonth).toBe(5)
      expect(store.calendarYear).toBe(2026)
    })

    it('prevMonth wraps from January to December', () => {
      const store = useFlightStore()
      store.calendarMonth = 0
      store.calendarYear = 2026
      store.prevMonth()
      expect(store.calendarMonth).toBe(11)
      expect(store.calendarYear).toBe(2025)
    })
  })
})
