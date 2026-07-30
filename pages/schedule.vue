<template>
  <div class="schedule-page">
    <PageHeader title="Schedule" />
    <div class="container">
      <div class="month-nav">
        <button @click="store.prevMonth()" class="arrow-btn" aria-label="Previous month">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="month-title">{{ monthName }} {{ store.calendarYear }}</h2>
        <button @click="store.nextMonth()" class="arrow-btn" aria-label="Next month">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <div class="calendar card">
        <div class="cal-weekdays">
          <span v-for="d in weekdays" :key="d">{{ d }}</span>
        </div>
        <div class="cal-grid">
          <div
            v-for="(day, i) in calendarDays"
            :key="i"
            :class="['cal-day', { 'other-month': !day.isCurrentMonth, 'is-today': day.isToday, 'has-schedule': !!day.schedule }]"
            @click="day.schedule && store.setSelectedDate(day.date)"
          >
            <span class="day-num" :class="{ 'today-num': day.isToday }">{{ day.day }}</span>
            <div v-if="day.schedule" class="day-badge" :style="{ backgroundColor: day.schedule.base_color }">
              <svg v-if="day.schedule.count_logbooks === day.schedule.count_schedules && day.schedule.count_schedules > 0" width="10" height="10" fill="white" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              <span v-else class="badge-count">{{ day.schedule.count_schedules }}</span>
            </div>
            <span v-if="day.schedule" class="day-code">{{ day.schedule.base_name }}</span>
          </div>
        </div>
      </div>

      <div class="legend">
        <div v-for="l in store.getLegend" :key="l.code" class="legend-item">
          <span class="legend-dot" :style="{ backgroundColor: l.color }"></span>
          <span class="legend-label">{{ l.label }}</span>
        </div>
      </div>

      <Transition name="slide-up">
        <div v-if="store.selectedDate" class="detail-banner card">
          <p>Detail page coming soon.</p>
          <button class="btn btn--outline btn--sm" @click="store.setSelectedDate('')">Close</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFlightStore } from '~/stores/flight'

const store = useFlightStore()
const { fmt, monthNames } = useDateFormat()

useHead({
  title: 'Schedule',
  meta: [
    { name: 'description', content: 'Monthly flight schedule calendar with duty type information.' },
  ],
})

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthName = computed(() => monthNames[store.calendarMonth])

const calendarDays = computed(() => {
  const y = store.calendarYear, m = store.calendarMonth
  const first = new Date(y, m, 1)
  const last = new Date(y, m + 1, 0)
  const todayStr = store.getToday
  const days: any[] = []

  for (let i = first.getDay() - 1; i >= 0; i--) {
    const d = new Date(y, m, -i)
    const ds = fmt(d)
    days.push({ date: ds, day: d.getDate(), isCurrentMonth: false, isToday: false, schedule: store.getScheduleForDate(ds) })
  }
  for (let i = 1; i <= last.getDate(); i++) {
    const d = new Date(y, m, i)
    const ds = fmt(d)
    days.push({ date: ds, day: i, isCurrentMonth: true, isToday: ds === todayStr, schedule: store.getScheduleForDate(ds) })
  }
  const pad = 42 - days.length
  for (let i = 1; i <= pad; i++) {
    const d = new Date(y, m + 1, i)
    const ds = fmt(d)
    days.push({ date: ds, day: i, isCurrentMonth: false, isToday: false, schedule: store.getScheduleForDate(ds) })
  }
  return days
})
</script>

<style lang="scss" scoped>
.schedule-page {
  padding-bottom: 16px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 16px;
}

.arrow-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-card;
  border: 1px solid #F3F4F6;
  border-radius: 12px;
  cursor: pointer;
  color: $color-text-primary;
  transition: all 0.2s ease;

  &:hover { background: #F9FAFB; border-color: #E5E7EB; }
  &:active { transform: scale(0.95); }
}

.month-title {
  font-size: 18px;
  font-weight: 700;
  color: $color-text-primary;
  letter-spacing: -0.01em;
}

.calendar {
  padding: 16px;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s ease;
  padding: 2px;
  position: relative;

  @media (min-width: 768px) {
    aspect-ratio: 1;
  }

  @media (max-width: 767px) {
    min-height: 48px;
  }

  &.other-month { opacity: 0.25; }

  &.has-schedule {
    &:hover { background: #F3F4F6; }
  }

  .day-num {
    font-weight: 500;
    margin-bottom: 2px;
    color: $color-text-primary;
  }

  .today-num {
    background: $color-brand-red;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(230, 55, 87, 0.3);
  }

  .day-badge {
    width: 22px;
    height: 14px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    .badge-count {
      font-size: 9px;
      font-weight: 700;
      color: white;
      line-height: 1;
    }
  }

  .day-code {
    font-size: 7px;
    font-weight: 600;
    color: $color-text-secondary;
    margin-top: 1px;
    letter-spacing: 0.02em;
  }
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  padding: 12px 16px;
  background: $color-card;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(14, 33, 56, 0.04);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  font-size: 11px;
  font-weight: 500;
  color: $color-text-secondary;
}

.detail-banner {
  margin-top: 16px;
  text-align: center;
  padding: 24px 20px;

  p {
    margin-bottom: 16px;
    color: $color-text-secondary;
    font-size: 14px;
  }
}
</style>
