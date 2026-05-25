package config

import (
	"github.com/joho/godotenv"
	"os"
)

type Config struct {
	SupabaseURL string
	SupabaseKey string
}

func Load() *Config {
	godotenv.Load("../.env")
	
	return &Config{
		SupabaseURL: os.Getenv("SUPABASE_URL"),
		SupabaseKey: os.Getenv("SUPABASE_KEY"),
	}
}
