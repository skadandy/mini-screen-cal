package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Todo struct {
	ID        int       `json:"id"`
	Content   string    `json:"content"`
	DueDate   time.Time `json:"dueDate"`
	Completed bool      `json:"completed"`
}

var todos []Todo

func main() {
	r := gin.Default()

	// 配置CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API路由
	api := r.Group("/api")
	{
		// Images API
		api.GET("/images", func(c *gin.Context) {
			// 使用绝对路径
			workDir, _ := os.Getwd()
			imagesDir := filepath.Join(workDir, "dist", "images")
			fmt.Printf("Reading images from: %s\n", imagesDir)  // 添加日志
			
			files, err := os.ReadDir(imagesDir)
			if err != nil {
				fmt.Printf("Error reading directory: %v\n", err)  // 添加日志
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read images directory: " + err.Error()})
				return
			}

			var images []string
			for _, file := range files {
				if !file.IsDir() {
					ext := filepath.Ext(file.Name())
					if ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" {
						images = append(images, file.Name())
					}
				}
			}
			
			fmt.Printf("Found images: %v\n", images)  // 添加日志
			
			// 添加调试日志
			if len(images) == 0 {
				c.JSON(http.StatusOK, gin.H{"message": "No images found in directory", "directory": imagesDir})
				return
			}
			
			c.JSON(http.StatusOK, images)
		})

		api.GET("/todos", func(c *gin.Context) {
			c.JSON(http.StatusOK, todos)
		})

		api.POST("/todos", func(c *gin.Context) {
			var newTodo Todo
			if err := c.BindJSON(&newTodo); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			todos = append(todos, newTodo)
			c.JSON(http.StatusCreated, newTodo)
		})
	}

	// 静态文件服务
	r.Static("/assets", "./dist/assets")
	r.Static("/images", "./dist/images")  // 添加图片静态服务
	r.StaticFile("/", "./dist/index.html")
	r.StaticFile("/favicon.ico", "./dist/favicon.ico")

	// 启动服务器
	r.Run(":8080")
}
