package service

import (
	"errors"
	"time"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type TokenService struct {
	JWTSecret string
}

func NewTokenService(secret string) *TokenService {
	return &TokenService{
		JWTSecret: secret,
	}
}

func (t *TokenService) HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func (t *TokenService) VerifyPassword(hashedPassword, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

func (t *TokenService) GenerateTokens(user *models.User) (string, string, error) {
	accessTokenClaims := jwt.MapClaims{
		"user_id":  user.ID,
		"email":    user.Email,
		"username": user.Username,
		"exp":      time.Now().Add(15 * time.Minute).Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	accessTokenString, err := accessToken.SignedString([]byte(t.JWTSecret))
	if err != nil {
		return "", "", err
	}

	refreshTokenClaims := jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	refreshTokenString, err := refreshToken.SignedString([]byte(t.JWTSecret))
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}

func (t *TokenService) ValidateToken(tokenStr string) (*models.JWTClaims, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(t.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		var userID, email, username string
		if id, ok := claims["user_id"].(string); ok {
			userID = id
		}
		if em, ok := claims["email"].(string); ok {
			email = em
		}
		if un, ok := claims["username"].(string); ok {
			username = un
		}

		return &models.JWTClaims{
			UserID:   userID,
			Email:    email,
			Username: username,
		}, nil
	}

	return nil, errors.New("invalid token")
}
