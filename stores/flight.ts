import { defineStore } from 'pinia'
import schedulesData from '~/data/mock-schedules.json'
import flightHoursData from '~/data/mock-flight-hours.json'
import documentsData from '~/data/mock-documents.json'

const TODAY = '2026-05-31'

export const useFlightStore = defineStore('flight', {
  state: () => ({
    schedules: schedulesData as any,
    flightHours: flightHoursData as any,
    documents: documentsData as any,
    selectedDate: null as string | null,
    calendarMonth: new Date(TODAY + 'T00:00:00').getMonth(),
    calendarYear: new Date(TODAY + 'T00:00:00').getFullYear(),
    isLoggedIn: false
  }),

  getters: {
    getScheduleForDate: (state) => (date: string) => {
      return state.schedules.schedules.find((s: any) => s.duty_date === date)
    },
    getLegend: (state) => state.schedules.legend,
    getToday: () => TODAY,
    getPilotInfo: (state) => state.flightHours.pilot,
    getFlightHoursLimits: (state) => state.flightHours.limits,
    getDocuments: (state) => state.documents.documents,

    getDocumentsWithStatus: (state) => {
      const today = new Date(TODAY + 'T00:00:00')
      const warningDays = state.documents.thresholds.warningDays
      return state.documents.documents.map((doc: any) => {
        const expiryDate = new Date(doc.expiryDate + 'T00:00:00')
        const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        let status: 'safe' | 'warning' | 'expired' = 'safe'
        if (daysRemaining <= 0) status = 'expired'
        else if (daysRemaining <= warningDays) status = 'warning'
        return { ...doc, daysRemaining, status }
      })
    },

    getDailyFlightHours: (state) => {
      const entry = state.flightHours.flightHours.find((f: any) => f.date === TODAY)
      return entry ? entry.hours : 0
    },

    getWeeklyFlightHours: (state) => {
      const today = new Date(TODAY + 'T00:00:00')
      let sum = 0
      for (let i = 0; i < 7; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        const entry = state.flightHours.flightHours.find((f: any) => f.date === ds)
        if (entry) sum += entry.hours
      }
      return sum
    },

    getMonthlyFlightHours: (state) => {
      const today = new Date(TODAY + 'T00:00:00')
      let sum = 0
      for (let i = 0; i < 30; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        const entry = state.flightHours.flightHours.find((f: any) => f.date === ds)
        if (entry) sum += entry.hours
      }
      return sum
    },

    getAnnualFlightHours: (state) => {
      const today = new Date(TODAY + 'T00:00:00')
      let sum = 0
      for (let i = 0; i < 365; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        const entry = state.flightHours.flightHours.find((f: any) => f.date === ds)
        if (entry) sum += entry.hours
      }
      return Math.round(sum * 10) / 10
    }
  },

  actions: {
    setSelectedDate(date: string) { this.selectedDate = date },
    login() { this.isLoggedIn = true },
    nextMonth() {
      if (this.calendarMonth === 11) { this.calendarMonth = 0; this.calendarYear++ }
      else { this.calendarMonth++ }
    },
    prevMonth() {
      if (this.calendarMonth === 0) { this.calendarMonth = 11; this.calendarYear-- }
      else { this.calendarMonth-- }
    }
  }
})
