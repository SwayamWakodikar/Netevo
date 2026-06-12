package service

import (
	"fmt"
	"time"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type TokenService struct{}

func NewTokenService() *TokenService {
	return &TokenService{}
}

// HashPassword hashes a plain text password using bcrypt
func (t *TokenService) HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// VerifyPassword compares a hashed password with a plain text password
func (t *TokenService) VerifyPassword(hashedPassword, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

// GenerateToken generates a simple token string for the user
// TODO: Implement proper JWT token generation with expiration and signing
func (t *TokenService) GenerateToken(user *models.User) string {
	// Simple token format: user_id.timestamp
	// In production, this should be a proper JWT token with claims and expiration
	return fmt.Sprintf("%s.%d", user.ID, time.Now().Unix())
}
