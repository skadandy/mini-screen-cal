<template>
  <div class="todo-list">
    <div class="todo-item" v-for="(todo, index) in todos" :key="index" :class="{ overdue: todo.isOverdue }">
      <div class="todo-content">{{ todo.content }}</div>
      <div class="due-date">{{ todo.dueDate }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 示例待办事项数据，实际使用时可以从后端获取
const todos = ref([
  {
    content: '完成日历GUI开发',
    dueDate: '2025-03-01',
    isOverdue: false
  },
  {
    content: '添加更多功能模块',
    dueDate: '2025-03-05',
    isOverdue: false
  },
  {
    content: '优化用户界面',
    dueDate: '2025-03-10',
    isOverdue: false
  }
])
</script>

<style scoped>
.todo-list {
  height: 100%;
  overflow-y: auto;
  padding: 8px;
}

.todo-item {
  padding: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-content {
  font-size: 14px;
  color: #303133;
}

.due-date {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.overdue .due-date {
  color: #F56C6C;
}
</style>
