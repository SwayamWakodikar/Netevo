package middleware

import (
	"net/http"
	"strings"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
	TokenService *service.TokenService
	RedisService *service.RedisService
}

func NewAuthMiddleware(tokenService *service.TokenService, redisService *service.RedisService) *AuthMiddleware {
	return &AuthMiddleware{
		TokenService: tokenService,
		RedisService: redisService,
	}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid Authorization header"})
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := m.TokenService.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		valid, err := m.RedisService.IsAccessTokenValid(c.Request.Context(), claims.UserID, token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Session lookup failed"})
			return
		}
		if !valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Session not found or token revoked"})
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("username", claims.Username)
		c.Next()
	}
}
