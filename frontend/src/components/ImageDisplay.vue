<template>
  <div class="image-display">
    <el-carousel 
      v-if="images.length > 0"
      height="400px"
      :interval="5000"
      arrow="hover"
      indicator-position="none"
      :autoplay="true"
    >
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <div class="image-wrapper">
          <img :src="image.url" :alt="image.description" @error="handleImageError">
          <div class="image-description">{{ image.description }}</div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-if="images.length === 0" class="no-images">
      {{ loading ? '加载中...' : '暂无图片' }}
    </div>
    <el-button 
      class="refresh-btn" 
      circle 
      @click="refreshImages"
      :icon="Refresh"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getImages, type ImageInfo } from '@/config/images'
import { Refresh } from '@element-plus/icons-vue'

const images = ref<ImageInfo[]>([])
const loading = ref(false)

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  console.error('图片加载失败:', img.src)
}

const refreshImages = async () => {
  loading.value = true
  try {
    images.value = await getImages()
    console.log('刷新后的图片列表:', images.value)
  } catch (error) {
    console.error('刷新图片失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshImages()
})
</script>

<style scoped>
.image-display {
  width: 100%;
  height: 400px;
  position: relative;
  background-color: #f5f7fa;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-description {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 12px;
  text-align: center;
}

.no-images {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-size: 14px;
}

.refresh-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.refresh-btn:hover {
  opacity: 1;
}

:deep(.el-carousel__container) {
  height: 100%;
}

:deep(.el-carousel__item) {
  height: 100%;
}
</style>
