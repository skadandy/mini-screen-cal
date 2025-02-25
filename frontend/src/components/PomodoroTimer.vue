<template>
  <div class="pomodoro-container">
    <el-icon class="tomato-icon"><Food /></el-icon>
    <div class="timer-display">{{ formatTime(timeLeft) }}</div>
    <div class="button-group">
      <el-button 
        type="primary" 
        :class="{ 'running': isRunning }"
        @click="toggleTimer"
      >
        {{ isRunning ? '暂停' : '开始' }}
      </el-button>
      <el-button 
        type="info"
        @click="resetTimer"
        :disabled="isRunning"
      >
        重置
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue'
import { Food } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'PomodoroTimer',
  components: {
    Food,
  },
  setup() {
    const defaultTime = 25 * 60 // 25 minutes in seconds
    const timeLeft = ref(defaultTime)
    const isRunning = ref(false)
    let timerInterval: number | null = null

    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    }

    const startTimer = () => {
      if (timerInterval) return
      isRunning.value = true
      timerInterval = window.setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--
        } else {
          stopTimer()
          resetTimer()
        }
      }, 1000)
    }

    const stopTimer = () => {
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
      isRunning.value = false
    }

    const resetTimer = () => {
      if (!isRunning.value) {
        timeLeft.value = defaultTime
      }
    }

    const toggleTimer = () => {
      if (isRunning.value) {
        stopTimer()
      } else {
        startTimer()
      }
    }

    onUnmounted(() => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    })

    return {
      timeLeft,
      isRunning,
      formatTime,
      toggleTimer,
      resetTimer
    }
  }
})
</script>

<style scoped>
.pomodoro-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.tomato-icon {
  font-size: 1.5rem;
  color: #F56C6C;
  margin-right: 4px;
}

.timer-display {
  font-size: 1.8rem;
  font-weight: bold;
  font-family: monospace;
  color: #409EFF;
  min-width: 85px;
}

.button-group {
  display: flex;
  gap: 8px;
}

.running {
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}
</style>
