package main

import (
	"log"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/config"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/service"
)

func main() {

	cfg := config.Load()

	sb := service.NewSupabase(cfg)

	log.Println("Supabase Connected")

	_ = sb
}