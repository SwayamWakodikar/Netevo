package main

import (
	"log"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/config"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/routes"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.Load()

	if cfg.SupabaseURL == "" || cfg.SupabaseKey == "" {
		log.Fatal("SUPABASE_URL or SUPABASE_KEY not set in environment")
	}

	log.Println("Config loaded successfully")
	log.Printf("Environment: %s\n", cfg.Environment)

	redisService, err := service.NewRedisService(cfg.RedisURL)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer redisService.Close()
	log.Println("Connected to Redis successfully")

	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	routes.SetupRoutes(router, cfg, redisService)

	port := ":" + cfg.Port
	log.Printf("Starting Auth Service on %s (environment: %s)\n", port, cfg.Environment)
	if err := router.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
