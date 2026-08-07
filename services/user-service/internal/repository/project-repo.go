package repository

import (
	"context"
	"github.com/SwayamWakodikar/netevo/services/user-service/internal/models"
)

type ProjectRepository interface {
	CreateProject(ctx context.Context, project *models.Project) error
	GetProject(ctx context.Context, id string) (*models.Project, error)
	ListProjects(ctx context.Context, userID string) ([]models.Project, error)
	UpdateProject(ctx context.Context, project *models.Project) error
	DeleteProject(ctx context.Context, id string) error
}

