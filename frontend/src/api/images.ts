import fs from 'fs'
import path from 'path'

export const getImageFiles = () => {
  const imagesDir = path.join(process.cwd(), 'public', 'images')
  try {
    const files = fs.readdirSync(imagesDir)
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)
    })
  } catch (error) {
    console.error('读取图片目录失败:', error)
    return []
  }
}
