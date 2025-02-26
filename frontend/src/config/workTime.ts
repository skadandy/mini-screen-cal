interface WorkTime {
  start: string
  end: string
}

export const workTime: WorkTime = {
  start: '08:30',
  end: '17:00'
}

// 工作时间配置
export const workSchedule = {
  startHour: 9,
  startMinute: 0,
  endHour: 18,
  endMinute: 0
}

// 获取上班时间
export const getWorkStartTime = () => {
  return `${workSchedule.startHour.toString().padStart(2, '0')}:${workSchedule.startMinute.toString().padStart(2, '0')}`
}

// 获取下班时间
export const getWorkEndTime = () => {
  return `${workSchedule.endHour.toString().padStart(2, '0')}:${workSchedule.endMinute.toString().padStart(2, '0')}`
}
