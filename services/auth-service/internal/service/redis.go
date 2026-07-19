package service

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

const accessTokenPrefix = "access_token:"

type RedisService struct {
	Client *redis.Client
}

func NewRedisService(url string) (*RedisService, error) {
	opts, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}

	client := redis.NewClient(opts)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}

	return &RedisService{Client: client}, nil
}

func (r *RedisService) StoreAccessToken(ctx context.Context, userID, token string, ttl time.Duration) error {
	return r.Client.Set(ctx, accessTokenPrefix+userID, token, ttl).Err()
}

func (r *RedisService) GetAccessToken(ctx context.Context, userID string) (string, error) {
	return r.Client.Get(ctx, accessTokenPrefix+userID).Result()
}

func (r *RedisService) DeleteAccessToken(ctx context.Context, userID string) error {
	return r.Client.Del(ctx, accessTokenPrefix+userID).Err()
}

func (r *RedisService) IsAccessTokenValid(ctx context.Context, userID, token string) (bool, error) {
	stored, err := r.GetAccessToken(ctx, userID)
	if err == redis.Nil {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return stored == token, nil
}

func (r *RedisService) Close() error {
	return r.Client.Close()
}
