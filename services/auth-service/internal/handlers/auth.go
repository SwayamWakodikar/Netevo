package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/config"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/models"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	SupabaseService *service.SupabaseService
	TokenService    *service.TokenService
}

func NewAuthHandler(cfg *config.Config) *AuthHandler {
	client := &http.Client{Timeout: 10 * time.Second}
	return &AuthHandler{
		SupabaseService: service.NewSupabaseService(cfg, client),
		TokenService:    service.NewTokenService(cfg.JWT_SECRET),
	}
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var req models.SignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request: " + err.Error(),
		})
		return
	}

	ctx := context.Background()

	existingUser, err := h.SupabaseService.GetUserByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		c.JSON(http.StatusConflict, models.ErrorResponse{
			Error: "User with this email already exists",
		})
		return
	}

	hashedPassword, err := h.TokenService.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to process password",
		})
		return
	}

	newUserPayload := map[string]interface{}{
		"email":      req.Email,
		"username":   req.Username,
		"password":   hashedPassword,
		"created_at": time.Now().UTC().Format(time.RFC3339),
	}

	user, err := h.SupabaseService.CreateUser(ctx, newUserPayload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to create user: " + err.Error(),
		})
		return
	}

	accessToken, refreshToken, err := h.TokenService.GenerateTokens(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to generate tokens",
		})
		return
	}

	user.Password = ""

	c.JSON(http.StatusCreated, models.AuthResponse{
		Message:      "User signed up successfully",
		User:         user,
		Token:        accessToken,
		RefreshToken: refreshToken,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request: " + err.Error(),
		})
		return
	}

	ctx := context.Background()

	user, err := h.SupabaseService.GetUserByEmail(ctx, req.Email)
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error: "Invalid email or password",
		})
		return
	}

	if !h.TokenService.VerifyPassword(user.Password, req.Password) {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error: "Invalid email or password",
		})
		return
	}

	accessToken, refreshToken, err := h.TokenService.GenerateTokens(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to generate tokens",
		})
		return
	}

	user.Password = ""

	c.JSON(http.StatusOK, models.AuthResponse{
		Message:      "User logged in successfully",
		User:         user,
		Token:        accessToken,
		RefreshToken: refreshToken,
	})
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Protected profile endpoint",
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req models.RefreshRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request: " + err.Error(),
		})
		return
	}

	claims, err := h.TokenService.ValidateToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error: "Invalid or expired refresh token",
		})
		return
	}

	user := &models.User{
		ID: claims.UserID,
	}

	accessToken, refreshToken, err := h.TokenService.GenerateTokens(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to generate tokens",
		})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Message:      "Tokens refreshed successfully",
		Token:        accessToken,
		RefreshToken: refreshToken,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, models.AuthResponse{
		Message: "User logged out successfully",
	})
}
