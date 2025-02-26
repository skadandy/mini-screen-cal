<template>
  <div class="work-timer">
    <div class="countdown">
      <div class="countdown-label">{{ countdownLabel }}</div>
      <div class="countdown-time">{{ countdownTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { workTime } from '@/config/workTime'

dayjs.extend(duration)

const countdownLabel = ref('')
const countdownTime = ref('')
let timer: number | null = null

const updateCountdown = () => {
  const now = dayjs()
  const today = now.format('YYYY-MM-DD')
  const workStart = dayjs(`${today} ${workTime.start}`)
  const workEnd = dayjs(`${today} ${workTime.end}`)

  if (now.isBefore(workStart)) {
    // 上班前
    countdownLabel.value = '距离上班'
    countdownTime.value = formatDuration(workStart.diff(now))
  } else if (now.isAfter(workEnd)) {
    // 下班后
    const nextWorkStart = workStart.add(1, 'day')
    countdownLabel.value = '距离上班'
    countdownTime.value = formatDuration(nextWorkStart.diff(now))
  } else {
    // 工作中
    countdownLabel.value = '距离下班'
    countdownTime.value = formatDuration(workEnd.diff(now))
  }
}

const formatDuration = (ms: number) => {
  const duration = dayjs.duration(ms)
  const hours = duration.hours().toString().padStart(2, '0')
  const minutes = duration.minutes().toString().padStart(2, '0')
  const seconds = duration.seconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateCountdown()
  timer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.work-timer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown {
  text-align: center;
  width: 100%;
}

.countdown-label {
  font-size: 24px;
  color: #909399;
  margin-bottom: 10px;
}

.countdown-time {
  font-size: 48px;
  font-weight: bold;
  color: #409EFF;
  font-family: monospace;
}
</style>
