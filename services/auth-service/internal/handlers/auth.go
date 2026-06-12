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
		TokenService:    service.NewTokenService(),
	}
}

// Signup handles user registration
func (h *AuthHandler) Signup(c *gin.Context) {
	var req models.SignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request: " + err.Error(),
		})
		return
	}

	ctx := context.Background()

	// Check if user already exists
	existingUser, err := h.SupabaseService.GetUserByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		c.JSON(http.StatusConflict, models.ErrorResponse{
			Error: "User with this email already exists",
		})
		return
	}

	// Hash password
	hashedPassword, err := h.TokenService.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to process password",
		})
		return
	}

	// Create new user
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

	// Generate token
	token := h.TokenService.GenerateToken(user)

	c.JSON(http.StatusCreated, models.AuthResponse{
		Message: "User signed up successfully",
		User:    user,
		Token:   token,
	})
}

// Login handles user authentication
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request: " + err.Error(),
		})
		return
	}

	ctx := context.Background()

	// Find user by email
	user, err := h.SupabaseService.GetUserByEmail(ctx, req.Email)
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error: "Invalid email or password",
		})
		return
	}

	// TODO: Implement password hash verification with user.Password

	// Generate token
	token := h.TokenService.GenerateToken(user)

	c.JSON(http.StatusOK, models.AuthResponse{
		Message: "User logged in successfully",
		User:    user,
		Token:   token,
	})
}

// GetProfile returns the current user's profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error: "Unauthorized",
		})
		return
	}

	ctx := context.Background()

	user, err := h.SupabaseService.GetUserByID(ctx, userID)
	if err != nil || user == nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error: "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Message: "Profile retrieved",
		User:    user,
	})
}

// Logout handles user logout
func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, models.AuthResponse{
		Message: "User logged out successfully",
	})
}
