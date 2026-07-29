package repository

import (
	"context"
	"database/sql"

	"github.com/SwayamWakodikar/netevo/services/user-service/internal/models"
	"github.com/google/uuid"
)

type UserRepo interface{
	CreateUser(ctx context.Context , user *models.User) error
	UpdateUser(ctx context.Context , user *models.User) error
	DeleteUser(ctx context.Context , id uuid.UUID) error
	GetUserById(ctx context.Context , id uuid.UUID) (*models.User, error)
	GetUserByEmail(ctx context.Context , email string) (*models.User, error)
}
type DB struct{
	db *sql.DB;
}

func NewUserRepo(db *sql.DB) UserRepo {
	return &DB{db: db}
}