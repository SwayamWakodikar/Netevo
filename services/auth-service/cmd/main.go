package main

import (
	"log"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/config"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/service"
)

func main() {

	cfg := config.Load()

	if cfg.SupabaseURL == "" || cfg.SupabaseKey == "" {
		log.Fatal("SUPABASE_URL or SUPABASE_KEY not set in environment")
	}
	
	sb := service.NewSupabase(cfg)

	log.Println("Supabase Connected")

	_ = sb
}