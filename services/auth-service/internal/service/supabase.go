package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/config"
	"github.com/SwayamWakodikar/netevo/services/auth-service/internal/models"
)

type SupabaseService struct {
	Config *config.Config
	Client *http.Client
}

func NewSupabaseService(cfg *config.Config, client *http.Client) *SupabaseService {
	return &SupabaseService{
		Config: cfg,
		Client: client,
	}
}

// GetUserByEmail fetches a user from Supabase by email
func (s *SupabaseService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	url := fmt.Sprintf("%s/rest/v1/users?email=eq.%s", s.Config.SupabaseURL, email)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	s.setSupabaseHeaders(req)

	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch user: status %d", resp.StatusCode)
	}

	var users []models.User
	body, _ := io.ReadAll(resp.Body)
	err = json.Unmarshal(body, &users)
	if err != nil {
		return nil, err
	}

	if len(users) == 0 {
		return nil, nil
	}

	return &users[0], nil
}

// GetUserByID fetches a user from Supabase by ID
func (s *SupabaseService) GetUserByID(ctx context.Context, userID string) (*models.User, error) {
	url := fmt.Sprintf("%s/rest/v1/users?id=eq.%s", s.Config.SupabaseURL, userID)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	s.setSupabaseHeaders(req)

	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch user: status %d", resp.StatusCode)
	}

	var users []models.User
	body, _ := io.ReadAll(resp.Body)
	err = json.Unmarshal(body, &users)
	if err != nil {
		return nil, err
	}

	if len(users) == 0 {
		return nil, nil
	}

	return &users[0], nil
}

// CreateUser creates a new user in Supabase
func (s *SupabaseService) CreateUser(ctx context.Context, payload map[string]interface{}) (*models.User, error) {
	url := fmt.Sprintf("%s/rest/v1/users", s.Config.SupabaseURL)

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	s.setSupabaseHeaders(req)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("failed to create user: status %d", resp.StatusCode)
	}

	var users []models.User
	respBody, _ := io.ReadAll(resp.Body)
	err = json.Unmarshal(respBody, &users)
	if err != nil {
		return nil, err
	}

	if len(users) == 0 {
		return nil, fmt.Errorf("user creation response empty")
	}

	return &users[0], nil
}

// setSupabaseHeaders sets required Supabase headers for API requests
func (s *SupabaseService) setSupabaseHeaders(req *http.Request) {
	req.Header.Set("apikey", s.Config.SupabaseKey)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.Config.SupabaseKey))
}
