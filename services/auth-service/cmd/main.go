package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, "auth service")
	})
	
	log.Println("Server running on :8080")
	r.Run(":8080")
}