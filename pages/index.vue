<template>
  <div class="home-page">
    <header class="home-header">
      <div class="header-content">
        <div class="header-top">
          <div class="header-info">
            <p class="header-greeting">Good morning,</p>
            <h1 class="header-name">{{ store.getPilotInfo.name }}</h1>
            <div class="header-stat">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>{{ store.getPilotInfo.totalFlightHours }} total flight hours</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-bell" aria-label="Notifications">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span class="bell-dot"></span>
            </button>
            <div class="avatar" aria-label="User avatar">JD</div>
          </div>
        </div>
      </div>
    </header>

    <div class="home-content container">
      <section class="section">
        <SectionHeader title="Upcoming Flight" />
        <div class="card card--interactive upcoming-flight">
          <div class="flight-route">
            <div class="flight-point">
              <span class="flight-code">HLP</span>
              <span class="flight-city">Jakarta</span>
            </div>
            <div class="flight-path">
              <div class="flight-line"></div>
              <div class="flight-arrow-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <div class="flight-point">
              <span class="flight-code">CJN</span>
              <span class="flight-city">Pangandaran</span>
            </div>
          </div>
          <div class="flight-meta">
            <span class="flight-date">{{ upcomingDate }}</span>
            <span class="flight-time">{{ upcomingTime }}</span>
            <span class="flight-sep"></span>
            <span class="flight-type-badge">TRX</span>
            <span class="flight-sep"></span>
            <span class="flight-type-text">Training</span>
          </div>
        </div>
      </section>

      <section class="section">
        <SectionHeader title="Latest News" action-label="See all" @action="onSeeAllNews" />
        <div class="news-scroll hide-scrollbar">
          <div class="card card--interactive news-card">
            <div class="news-tag news-tag--safety">Safety</div>
            <h3 class="news-title">New weather briefing procedure</h3>
            <p class="news-desc">Updated mandatory weather briefing before each flight...</p>
          </div>
          <div class="card card--interactive news-card">
            <div class="news-tag news-tag--ops">Ops</div>
            <h3 class="news-title">Route changes for June</h3>
            <p class="news-desc">PDG-CJN route updated due to temporary...</p>
          </div>
          <div class="card card--interactive news-card">
            <div class="news-tag news-tag--training">Training</div>
            <h3 class="news-title">Recurrent schedule announced</h3>
            <p class="news-desc">All pilots must complete recurrent by Oct 14...</p>
          </div>
        </div>
      </section>

      <section class="section">
        <SectionHeader title="Hours to Limit" />
        <HoursToLimit />
      </section>

      <section class="section">
        <SectionHeader title="My Documents" />
        <DocumentsList />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFlightStore } from '~/stores/flight'
const store = useFlightStore()

const upcomingSchedule = computed(() => {
  const today = store.getToday
  const future = (store.schedules.schedules || []).filter((s: any) => s.status === 1 && s.duty_date >= today)
  if (!future.length) return null
  future.sort((a: any, b: any) => a.duty_date.localeCompare(b.duty_date))
  return future[0]
})

const upcomingDate = computed(() => {
  if (!upcomingSchedule.value) return 'Jun 4, 2026'
  const d = new Date(upcomingSchedule.value.duty_date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

// mock time — schedules don't include time in provided data
const upcomingTime = '08:30'

function onSeeAllNews() {
  // placeholder — navigate to news page when available
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 8px;
}

// ── Header ──────────────────────────────────────────
.home-header {
  background: linear-gradient(165deg, #0E2138 0%, #162D4A 100%);
  padding: 24px 20px 24px;
  border-radius: 0 0 28px 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
    border-radius: 50%;
  }

  @media (min-width: 1024px) {
    border-radius: 0;
    padding: 32px 0 48px;
  }
}

.header-content {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: 768px) {
    padding: 0 32px;
  }

  @media (min-width: 1024px) {
    max-width: 960px;
  }

  @media (min-width: 1280px) {
    max-width: 1200px;
    padding: 0 40px;
  }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-greeting {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.header-name {
  color: white;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  line-height: 1.1;
}

.header-stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);

  svg { opacity: 0.7; }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-bell {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover { background: rgba(255, 255, 255, 0.15); }
  &:active { transform: scale(0.95); }
}

.bell-dot {
  position: absolute;
  top: 8px;
  right: 9px;
  width: 8px;
  height: 8px;
  background: $color-brand-red;
  border-radius: 50%;
  border: 2px solid #0E2138;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: $color-brand-red;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover { transform: scale(1.05); }
}

// ── Content ─────────────────────────────────────────
.home-content {
  position: relative;
  z-index: 2;
  padding-top: 1rem;
}

.section {
  margin-bottom: 28px;
}

// ── Upcoming Flight ─────────────────────────────────
.upcoming-flight {
  padding: 20px;

  .flight-route {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .flight-point { text-align: center; }

  .flight-code {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: $color-primary;
    letter-spacing: -0.02em;
  }

  .flight-city {
    font-size: 12px;
    font-weight: 500;
    color: $color-text-secondary;
    margin-top: 2px;
  }

  .flight-path {
    display: flex;
    align-items: center;
    gap: 0;
    flex: 1;
    padding: 0 16px;
    position: relative;
  }

  .flight-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #E5E7EB 0%, #D1D5DB 100%);
  }

  .flight-arrow-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $color-primary;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .flight-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    color: $color-text-secondary;
  }

  .flight-sep {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #D1D5DB;
  }

  .flight-type-badge {
    display: inline-flex;
    padding: 2px 8px;
    background: #F3F4F6;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    color: $color-primary;
    letter-spacing: 0.02em;
  }
}

// ── News ────────────────────────────────────────────
.news-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 4px 8px;
  -webkit-overflow-scrolling: touch;
}

.news-card {
  min-width: 220px;
  max-width: 220px;
  flex-shrink: 0;
  padding: 16px;

  .news-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 12px;

    &--safety   { background: #ECFDF5; color: #059669; }
    &--ops      { background: #EFF6FF; color: #2563EB; }
    &--training { background: #FFFBEB; color: #D97706; }
  }

  .news-title {
    font-size: 14px;
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: 6px;
    line-height: 1.35;
  }

  .news-desc {
    font-size: 12px;
    color: $color-text-secondary;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
