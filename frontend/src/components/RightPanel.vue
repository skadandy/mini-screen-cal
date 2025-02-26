<template>
  <div class="right-panel">
    <div class="panel-header">
      <el-button-group>
        <el-button 
          v-for="(module, index) in modules" 
          :key="index"
          size="small"
          :type="currentModuleIndex === index ? 'primary' : ''"
          @click="selectModule(index)"
        >
          {{ module.name }}
        </el-button>
      </el-button-group>
      <el-switch
        v-model="autoSwitch"
        size="small"
        inline-prompt
        :active-icon="Timer"
        :inactive-icon="Lock"
      />
    </div>

    <div class="panel-content">
      <transition name="fade" mode="out-in">
        <component :is="currentModule.component" :key="currentModuleIndex"></component>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Timer, Lock } from '@element-plus/icons-vue'
import TodoList from './TodoList.vue'
import ImageDisplay from './ImageDisplay.vue'
import WorkTimer from './WorkTimer.vue'

const modules = [
  { name: '待办事项', component: TodoList },
  { name: '图片展示', component: ImageDisplay },
  { name: '工作计时', component: WorkTimer }
]

const currentModuleIndex = ref(0)
const autoSwitch = ref(false)
let autoSwitchTimer: number | null = null

const currentModule = computed(() => modules[currentModuleIndex.value])

const selectModule = (index: number) => {
  currentModuleIndex.value = index
}

const startAutoSwitch = () => {
  if (autoSwitchTimer) return
  autoSwitchTimer = window.setInterval(() => {
    currentModuleIndex.value = (currentModuleIndex.value + 1) % modules.length
  }, 10000) // 10秒切换一次
}

const stopAutoSwitch = () => {
  if (autoSwitchTimer) {
    clearInterval(autoSwitchTimer)
    autoSwitchTimer = null
  }
}

// 监听自动切换开关
watch(autoSwitch, (newValue) => {
  if (newValue) {
    startAutoSwitch()
  } else {
    stopAutoSwitch()
  }
})

onMounted(() => {
  if (autoSwitch.value) {
    startAutoSwitch()
  }
})

onUnmounted(() => {
  stopAutoSwitch()
})
</script>

<style scoped>
.right-panel {
  flex: 0 0 420px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #EBEEF5;
}

.panel-content {
  flex: 1;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
