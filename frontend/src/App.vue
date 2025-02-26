<template>
  <div class="container">
    <!-- 左侧日历 -->
    <div class="calendar">
      <div class="calendar-header">
        <el-button @click="currentDate = dayjs(currentDate).subtract(1, 'month')">上月</el-button>
        <span>{{ currentDate.format('YYYY年MM月') }}</span>
        <el-button @click="currentDate = dayjs(currentDate).add(1, 'month')">下月</el-button>
      </div>
      <div class="weekdays">
        <div 
          v-for="(day, index) in ['日', '一', '二', '三', '四', '五', '六']" 
          :key="day" 
          class="weekday"
          :class="{ 'weekend': index === 0 || index === 6 }"
        >
          {{ day }}
        </div>
      </div>
      <div class="days">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="day"
          :class="{
            'current-month': day.isCurrentMonth,
            'today': day.date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'),
            'weekend': day.date.day() === 0 || day.date.day() === 6
          }"
        >
          {{ day.date.date() }}
        </div>
      </div>
    </div>

    <!-- 中间时钟和日期信息 -->
    <div class="clock-section">
      <el-button 
        class="fullscreen-btn"
        @click="toggleFullscreen"
      >
        <el-icon class="btn-icon">
          <component :is="isFullscreen ? Close : FullScreen" />
        </el-icon>
        <span class="btn-text">{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
      </el-button>
      <div class="center-content">
        <div class="date-info">
          <div class="lunar-info">
            <span class="lunar">{{ lunarInfo }}</span>
            <span class="solar-term">{{ getSolarTermInfo() }}</span>
            <span class="holiday">{{ getNextHolidayInfo }}</span>
          </div>
          <div class="weekday">{{ currentTime.format('dddd') }}</div>
        </div>
        <div class="time-display">
          <div class="hours-minutes">{{ currentTime.format('HH:mm') }}</div>
          <div class="seconds">{{ currentTime.format('ss') }}</div>
        </div>
        <PomodoroTimer />
      </div>
    </div>

    <!-- 右侧面板 -->
    <RightPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Solar, Lunar } from 'lunar-typescript'
import { FullScreen, Close } from '@element-plus/icons-vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import { getNextHoliday } from './utils/holidays'
import RightPanel from './components/RightPanel.vue'

dayjs.locale('zh-cn')

// 当前时间
const currentTime = ref(dayjs())
const currentDate = ref(dayjs())

// 全屏控制
const isFullscreen = ref(false)
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 更新时间
setInterval(() => {
  currentTime.value = dayjs()
}, 1000)

// 农历信息
const lunarInfo = computed(() => {
  const solar = Solar.fromDate(currentDate.value.toDate())
  const lunar = solar.getLunar()
  return `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
})

// 获取节气信息
const getSolarTermInfo = () => {
  const lunar = Lunar.fromDate(currentTime.value.toDate())
  const currentTerm = lunar.getCurrentJieQi()
  const nextTerm = lunar.getNextJieQi()
  
  if (currentTerm) {
    return `今日节气：${currentTerm.getName()}`
  } else if (nextTerm) {
    // 计算距离下一个节气的天数
    const today = dayjs()
    // 获取下一个节气的阳历日期
    const nextTermSolar = nextTerm.getSolar()
    const nextTermDate = dayjs(new Date(nextTermSolar.getYear(), nextTermSolar.getMonth() - 1, nextTermSolar.getDay()))
    const daysUntil = nextTermDate.diff(today, 'day')
    return `距离${nextTerm.getName()}还有${daysUntil}天`
  }
  return ''
}

// 获取下一个节假日信息
const getNextHolidayInfo = computed(() => {
  const nextHoliday = getNextHoliday(currentTime.value.toDate())
  if (nextHoliday) {
    return `距离${nextHoliday.name}还有${nextHoliday.daysUntil}天`
  }
  return ''
})

// 生成日历数据
const calendarDays = computed(() => {
  const firstDay = currentDate.value.startOf('month')
  const lastDay = currentDate.value.endOf('month')
  const days = []

  // 获取当月第一天是星期几 (0-6, 0 是星期日)
  const firstDayOfWeek = firstDay.day()
  
  // 添加上个月的日期
  const prevMonthLastDay = firstDay.subtract(1, 'day')
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay.subtract(i, 'day'),
      isCurrentMonth: false
    })
  }

  // 添加当月的日期
  let currentDay = firstDay
  while (currentDay.isBefore(lastDay) || currentDay.isSame(lastDay, 'day')) {
    days.push({
      date: currentDay,
      isCurrentMonth: true
    })
    currentDay = currentDay.add(1, 'day')
  }

  // 添加下个月的日期，补齐到42个格子（6行7列）
  const remainingDays = 42 - days.length
  let nextMonthDay = lastDay.add(1, 'day')
  for (let i = 0; i < remainingDays; i++) {
    days.push({
      date: nextMonthDay.add(i, 'day'),
      isCurrentMonth: false
    })
  }

  return days
})

// 待办事项示例数据
const todos = ref([
  {
    id: 1,
    content: '完成日历系统开发',
    dueDate: dayjs().add(2, 'day'),
    completed: false
  },
  {
    id: 2,
    content: '测试农历显示',
    dueDate: dayjs().subtract(1, 'day'),
    completed: false
  }
])

// 检查是否过期
const isOverdue = (dueDate: dayjs.Dayjs) => {
  return dueDate.isBefore(dayjs(), 'day')
}
</script>

<style scoped>
.container {
  display: flex;
  width: 1260px;
  height: 380px;
  padding: 5px;
  gap: 10px;
  background: #f5f7fa;
  box-sizing: border-box;
  overflow: hidden;
  margin: 10px auto;
}

/* 日历样式 */
.calendar {
  flex: 0 0 300px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.calendar-header span {
  font-size: 14px;
}

.calendar-header .el-button {
  padding: 4px 8px;
  font-size: 12px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 5px;
}

.weekday {
  padding: 2px;
  color: #606266;
  font-size: 14px;
}

.weekend {
  color: #ff9999;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  flex: 1;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.day:hover {
  background-color: #f5f7fa;
}

.current-month {
  color: #303133;
}

.day:not(.current-month) {
  color: #C0C4CC;
}

.today {
  background-color: #409EFF;
  color: white !important;
}

.weekend.current-month {
  color: #ff6666;
}

.time {
  font-size: 48px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.date {
  font-size: 24px;
  color: #606266;
  margin-bottom: 4px;
}

.lunar-info {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
  min-height: 24px;
}

.lunar, .solar-term, .holiday {
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
}

.lunar {
  background: #f0f9eb;
  color: #67c23a;
}

.solar-term {
  background: #ecf5ff;
  color: #409eff;
}

.holiday {
  background: #fef0f0;
  color: #f56c6c;
}

.weekday {
  font-size: 20px;
  color: #909399;
}

/* 时钟部分样式 */
.clock-section {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.date-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.weekday {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.lunar-info {
  display: flex;
  gap: 10px;
  font-size: 1rem;
  color: #666;
}

.time-display {
  font-size: 3.5rem;
  font-weight: bold;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.8);
  padding: 15px 30px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.hours-minutes {
  font-size: 86px;
  font-weight: 600;
  color: #303133;
  font-family: 'Arial', sans-serif;
  line-height: 1;
  letter-spacing: -2px;
}

.seconds {
  font-size: 42px;
  font-weight: 500;
  color: #409EFF;
  font-family: 'Arial', sans-serif;
  line-height: 1;
  padding-bottom: 15px;
  opacity: 0.9;
}

/* 添加一些动画效果 */
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.01); opacity: 0.95; }
  100% { transform: scale(1); opacity: 1; }
}

.time-display {
  animation: pulse 2s infinite;
  animation-timing-function: ease-in-out;
}

/* 添加秒数变化动画 */
.seconds {
  transition: all 0.2s ease-out;
}

/* 全屏按钮样式 */
.fullscreen-btn {
  position: fixed;
  top: 5px;
  left: 5px;
  z-index: 1000;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.fullscreen-btn:hover {
  opacity: 1;
}

.btn-icon {
  font-size: 16px;
  color: currentColor;
}

.btn-text {
  text-align: center;
  white-space: nowrap;
  color: currentColor;
}

.holiday {
  color: #666;
}
</style>
