package service

import (
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/config"

	supabase "github.com/nedpals/supabase-go"
)

func NewSupabase(cfg *config.Config) *supabase.Client {

	client := supabase.CreateClient(
		cfg.SupabaseURL,
		cfg.SupabaseKey,
	)

	return client
}