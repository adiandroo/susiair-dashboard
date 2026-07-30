<template>
  <div>
    <div v-if="loading" class="limit-cards">
      <div v-for="i in 4" :key="i" class="limit-card card limit-card--skeleton">
        <div class="limit-card__header">
          <span class="skeleton skeleton-label"></span>
          <span class="skeleton skeleton-pct"></span>
        </div>
        <div class="limit-card__value">
          <span class="skeleton skeleton-hours"></span>
          <span class="skeleton skeleton-unit"></span>
        </div>
        <div class="limit-card__bar">
          <div class="skeleton skeleton-bar"></div>
        </div>
      </div>
    </div>
    <div v-else class="limit-cards">
      <div class="limit-card card" v-for="card in limitCards" :key="card.label">
        <div class="limit-card__header">
          <span class="limit-card__label">{{ card.label }}</span>
          <span class="limit-card__pct" :style="{ color: card.pct >= 100 ? '#DC2626' : card.pct >= 80 ? '#D97706' : '#059669' }">{{ Math.round(card.pct) }}%</span>
        </div>
        <div class="limit-card__value">
          <span class="limit-card__hours">{{ card.display }}</span>
          <span class="limit-card__unit"> / {{ card.limit }}h</span>
        </div>
        <div class="limit-card__bar">
          <div class="limit-card__fill" :style="{ width: Math.min(card.pct, 100) + '%', backgroundColor: card.pct >= 100 ? '#DC2626' : card.pct >= 80 ? '#D97706' : '#1FBF8F' }"></div>
        </div>
      </div>
    </div>

    <div class="chart-card card">
      <div v-if="loading" class="chart-skeleton">
        <div class="skeleton skeleton-chart"></div>
      </div>
      <div v-else class="chart-wrap" role="img" :aria-label="'Flight hours chart, range ' + toggle">
        <client-only>
          <LineChart :data="chartData" :options="chartOpts" />
        </client-only>
      </div>
      <div class="chart-toggles">
        <button
          v-for="t in ['1w','1m','3m','6m','1y']"
          :key="t"
          :class="['toggle-btn', { active: toggle === t }]"
          @click="toggle = t"
          :aria-pressed="toggle === t"
        >{{ t }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFlightStore } from '~/stores/flight'

const props = withDefaults(defineProps<{ loading?: boolean }>(), { loading: false })
const store = useFlightStore()
const toggle = ref('1w')

const bounds = computed(() => store.flightHours.chartBounds[toggle.value])

const limitCards = computed(() => {
  const l = store.getFlightHoursLimits
  const daily = store.getDailyFlightHours
  const weekly = store.getWeeklyFlightHours
  const monthly = store.getMonthlyFlightHours
  const annual = store.getAnnualFlightHours
  return [
    { label: 'Daily', current: Number(daily), display: String(Math.round(daily * 10) / 10), limit: l.daily, pct: (daily / l.daily) * 100 },
    { label: 'Weekly', current: Number(weekly), display: Number(weekly).toFixed(1), limit: l.weekly, pct: (weekly / l.weekly) * 100 },
    { label: 'Monthly', current: Number(monthly), display: Number(monthly).toFixed(1), limit: l.monthly, pct: (monthly / l.monthly) * 100 },
    { label: 'Annual', current: Number(annual), display: String(Math.round(annual * 10) / 10), limit: l.annual, pct: (annual / l.annual) * 100 }
  ]
})

const chartData = computed(() => {
  const b = bounds.value
  const today = new Date('2026-05-31T00:00:00')
  const range = b.displayRangeDays

  const start = new Date(today); start.setDate(today.getDate() - range)
  const end = new Date(today); end.setDate(today.getDate() + range)

  const labels: string[] = []
  const rolling: number[] = []
  const limitLine: number[] = []

  const d = new Date(start)
  while (d <= end) {
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

    const sumEnd = new Date(d)
    const sumStart = new Date(d); sumStart.setDate(d.getDate() - b.windowDays + 1)

    let sum = 0
    for (const fh of store.flightHours.flightHours) {
      const fd = new Date(fh.date + 'T00:00:00')
      if (fd >= sumStart && fd <= sumEnd) sum += fh.hours
    }

    rolling.push(Math.round(sum * 10) / 10)
    limitLine.push(b.limit)
    d.setDate(d.getDate() + 1)
  }

  return {
    labels,
    datasets: [
      {
        data: rolling,
        borderColor: '#22C5E8',
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart
          const { ctx: c, chartArea } = chart
          if (!chartArea) return 'rgba(34,197,232,0.08)'
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(34,197,232,0.15)')
          gradient.addColorStop(1, 'rgba(34,197,232,0.01)')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#22C5E8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5
      },
      {
        data: limitLine,
        borderColor: '#E63757',
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      }
    ]
  }
})

const chartOpts = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' as const },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0E2138',
      titleFont: { size: 11, weight: '600' },
      bodyFont: { size: 12, weight: '500' },
      padding: { top: 8, bottom: 8, left: 12, right: 12 },
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (ctx: any) => ctx.datasetIndex === 0 ? ctx.raw + 'h' : 'Limit: ' + ctx.raw + 'h'
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: bounds.value.max,
      ticks: {
        callback: (v: any) => v + 'h',
        font: { size: 10, family: 'Inter' },
        color: '#9CA3AF',
        padding: 8
      },
      grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
      border: { display: false }
    },
    x: {
      ticks: {
        font: { size: 10, family: 'Inter' },
        color: '#9CA3AF',
        maxRotation: 0,
        padding: 4
      },
      grid: { display: false },
      border: { display: false }
    }
  }
}))
</script>

<style lang="scss" scoped>
.limit-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.limit-card {
  padding: 14px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(14, 33, 56, 0.08);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__label {
    font-size: 11px;
    font-weight: 600;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__pct {
    font-size: 11px;
    font-weight: 700;
  }

  &__value {
    margin-bottom: 10px;
    display: flex;
    align-items: baseline;
    gap: 2px;
  }

  &__hours {
    font-size: 22px;
    font-weight: 700;
    color: $color-primary;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  &__unit {
    font-size: 12px;
    font-weight: 500;
    color: #9CA3AF;
  }

  &__bar {
    height: 6px;
    background: #F3F4F6;
    border-radius: 3px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.chart-card {
  padding: 16px;
}

.chart-toggles {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 3px;
  background: #F3F4F6;
  border-radius: 10px;
  margin-top: 16px;
}

.toggle-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: $color-text-secondary;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(.active) {
    color: $color-text-primary;
  }

  &:focus-visible {
    outline: 3px solid rgba(14,33,56,0.12);
    outline-offset: 2px;
    border-radius: 8px;
  }

  &.active {
    background: $color-card;
    color: $color-primary;
    box-shadow: 0 1px 3px rgba(14, 33, 56, 0.1);
  }
}

.chart-wrap {
  height: 220px;
}

.chart-skeleton {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-label { width: 40px; height: 12px; }
.skeleton-pct { width: 32px; height: 12px; }
.skeleton-hours { width: 50px; height: 22px; border-radius: 4px; }
.skeleton-unit { width: 40px; height: 12px; }
.skeleton-bar { width: 100%; height: 6px; border-radius: 3px; }
.skeleton-chart { width: 100%; height: 200px; border-radius: 8px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.limit-card--skeleton {
  .limit-card__header,
  .limit-card__value {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .limit-card__header { justify-content: space-between; }
}
</style>
