package routes

import (
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/config"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/handlers"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/middleware"
	"github.com/gin-gonic/gin"
)

// SetupRoutes initializes all auth service routes
func SetupRoutes(router *gin.Engine, cfg *config.Config) {
	// Apply global middleware
	router.Use(middleware.LoggingMiddleware())
	router.Use(middleware.ErrorHandlingMiddleware())

	authHandler := handlers.NewAuthHandler(cfg)

	// Public routes (no authentication required)
	auth := router.Group("/api/v1/auth")
	{
		auth.POST("/signup", authHandler.Signup)
		auth.POST("/login", authHandler.Login)
		auth.POST("/logout", authHandler.Logout)
	}

	// Protected routes (would require auth middleware in production)
	protected := router.Group("/api/v1/user")
	{
		protected.GET("/profile", authHandler.GetProfile)
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "auth-service",
		})
	})
}
