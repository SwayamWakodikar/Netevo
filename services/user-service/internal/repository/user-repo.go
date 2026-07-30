package repository

import (
	"context"
	"database/sql"

	"github.com/SwayamWakodikar/netevo/services/user-service/internal/models"
	"github.com/google/uuid"
)

type UserRepo interface {
	CreateUser(ctx context.Context, user *models.User) error
	UpdateUser(ctx context.Context, user *models.User) error
	DeleteUser(ctx context.Context, id uuid.UUID) error
	GetUserById(ctx context.Context, id uuid.UUID) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
}
//DB connect
type DB struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) UserRepo {
	return &DB{db: db};
}

func (r* DB) CreateUser(ctx context.Context,user *models.User) error{
	query := `INSERT INTO users (id, email, username, password, created_at) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.db.ExecContext(ctx, query, user.ID, user.Email, user.Username, user.Password, user.CreatedAt)
	return err	
}

func (r* DB) DeleteUser(ctx context.Context, user *models.User) error {
	query := `DELETE FROM users WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, user.ID)
	return err
}

func (r* DB) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `SELECT id, email, username, password, created_at FROM users WHERE email = $1`
	user := &models.User{}
	err := r.db.QueryRowContext(ctx, query, email).Scan(&user.ID, &user.Email, &user.Username, &user.Password, &user.CreatedAt)
	return user,err
}

func (r* DB) GetUserById(ctx context.Context, id uuid.UUID) (*models.User, error) {
	query := `SELECT id, email, username, password, created_at FROM users WHERE id = $1`
	user := &models.User{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(&user.ID, &user.Email, &user.Username, &user.Password, &user.CreatedAt)
	return user,err
}