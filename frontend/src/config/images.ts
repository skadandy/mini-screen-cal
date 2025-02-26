export interface ImageInfo {
  url: string
  description: string
}

// 从后端API获取所有图片
export const getImages = async (): Promise<ImageInfo[]> => {
  try {
    const response = await fetch('http://localhost:8080/api/images')
    const files = await response.json()
    return files.map((file: string) => ({
      url: `http://localhost:8080/images/${file}`,
      description: file.replace(/\.[^/.]+$/, '') // 移除文件扩展名作为描述
    }))
  } catch (error) {
    console.error('获取图片列表失败:', error)
    return []
  }
}
