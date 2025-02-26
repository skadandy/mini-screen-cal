/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, extname } from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'image-list',
      configureServer(server) {
        server.middlewares.use('/api/images', (req, res) => {
          const imagesDir = resolve(__dirname, 'public', 'images')
          try {
            const files = fs.readdirSync(imagesDir)
            const imageFiles = files.filter(file => {
              const ext = extname(file).toLowerCase()
              return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)
            })
            console.log('找到的图片:', imageFiles)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(imageFiles))
          } catch (error) {
            console.error('读取图片目录失败:', error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: '获取图片列表失败' }))
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',  // 允许外部访问
    port: 5173,       // 指定端口
    proxy: {          // 代理配置
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
