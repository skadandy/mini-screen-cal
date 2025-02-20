<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Solar } from 'lunar-typescript'

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
  return solar.getLunar()
})

// 生成日历数据
const calendarDays = computed(() => {
  const firstDay = currentDate.value.startOf('month')
  const lastDay = currentDate.value.endOf('month')
  const days = []
  
  // 填充上个月的日期
  const firstDayWeek = firstDay.day()
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    days.push({
      date: firstDay.subtract(i + 1, 'day'),
      isCurrentMonth: false
    })
  }
  
  // 当月日期
  for (let i = 0; i < lastDay.date(); i++) {
    days.push({
      date: firstDay.add(i, 'day'),
      isCurrentMonth: true
    })
  }
  
  // 填充下个月的日期
  const remainingDays = 42 - days.length // 保持6行
  for (let i = 0; i < remainingDays; i++) {
    days.push({
      date: lastDay.add(i + 1, 'day'),
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
        <div v-for="day in ['一', '二', '三', '四', '五', '六', '日']" :key="day" class="weekday">
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
            'today': day.date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
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
        :icon="isFullscreen ? 'FullscreenExit' : 'FullScreen'"
        @click="toggleFullscreen"
      >
        <span class="btn-text">{{ isFullscreen ? '退出' : '全屏' }}</span>
      </el-button>
      <div class="center-content">
        <div class="date-info">
          <div class="weekday">{{ currentTime.format('dddd') }}</div>
          <div class="lunar">{{ lunarInfo.toString() }}</div>
        </div>
        <div class="time-display">
          <div class="hours-minutes">{{ currentTime.format('HH:mm') }}</div>
          <div class="seconds">{{ currentTime.format('ss') }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧待办事项 -->
    <div class="todo-section">
      <h2>待办事项</h2>
      <el-button type="primary" size="small" style="margin-bottom: 10px">添加待办</el-button>
      <div class="todo-list">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="todo-item"
          :class="{ 'overdue': isOverdue(todo.dueDate) }"
        >
          <el-checkbox v-model="todo.completed">{{ todo.content }}</el-checkbox>
          <div class="due-date">到期: {{ todo.dueDate.format('MM-DD HH:mm') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 1260px;
  height: 380px;
  padding: 5px;
  gap: 40px;
  background: #f5f7fa;
  box-sizing: border-box;
  overflow: hidden;
  margin: 10px auto;
}

/* 日历样式 */
.calendar {
  flex: 0 0 360px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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

/* 时钟部分样式 */
.clock-section {
  flex: 0 0 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  overflow: hidden;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 20px;
}

.fullscreen-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
}

.fullscreen-btn:hover {
  background: #409EFF;
  color: white;
  border-color: #409EFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.btn-text {
  display: inline-block;
  min-width: 2em;
  text-align: center;
}

.date-info {
  text-align: center;
  padding: 15px 30px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.weekday {
  font-size: 28px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: 4px;
}

.lunar {
  font-size: 16px;
  color: #606266;
  letter-spacing: 1px;
}

.time-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px 40px;
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

/* 待办事项样式 */
.todo-section {
  flex: 0 0 260px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.todo-section h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.todo-list {
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
}

.todo-item {
  padding: 8px;
  border-bottom: 1px solid #EBEEF5;
}

.todo-item:last-child {
  border-bottom: none;
}

.due-date {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  margin-left: 24px;
}

.overdue {
  color: #F56C6C;
}

.overdue .due-date {
  color: #F56C6C;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
