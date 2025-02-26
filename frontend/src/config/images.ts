export interface ImageInfo {
  url: string
  description: string
}

// 从 public/images 目录获取所有图片
export const getImages = async (): Promise<ImageInfo[]> => {
  try {
    const response = await fetch('/api/images')
    const files = await response.json()
    return files.map((file: string) => ({
      url: `/images/${file}`,
      description: file.replace(/\.[^/.]+$/, '') // 移除文件扩展名作为描述
    }))
  } catch (error) {
    console.error('获取图片列表失败:', error)
    return []
  }
}
