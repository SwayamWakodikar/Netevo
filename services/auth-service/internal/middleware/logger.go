package middleware

import (
	"log"

	"github.com/gin-gonic/gin"
)

// LoggingMiddleware logs all incoming requests
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("[%s] %s %s", c.Request.Method, c.Request.URL.Path, c.ClientIP())
		c.Next()
	}
}

// ErrorHandlingMiddleware handles errors
func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Handle errors if any
		if len(c.Errors) > 0 {
			log.Printf("Error: %v", c.Errors)
		}
	}
}
