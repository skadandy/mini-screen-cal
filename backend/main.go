package main

import (
	"net/http"
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
	r.StaticFile("/", "./dist/index.html")
	r.StaticFile("/favicon.ico", "./dist/favicon.ico")

	// 启动服务器
	r.Run(":8080")
}
