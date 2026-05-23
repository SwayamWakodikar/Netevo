package handlers
import (
	// "net/http"

	// "github.com/SwayamWakodikar/netevo/services/auth-service/internal/models"

	// "github.com/gin-gonic/gin"
	supabase "github.com/nedpals/supabase-go"
)
type AuthHandler struct {
	Supabase *supabase.Client
}

func NewAuthHandler(
	sb *supabase.Client,
) *AuthHandler {

	return &AuthHandler{
		Supabase: sb,
	}
}