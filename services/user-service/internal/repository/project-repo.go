package repository

import (
	"context"
	"database/sql"

	"github.com/SwayamWakodikar/netevo/services/user-service/internal/models"
)

type ProjectRepository interface {
	CreateProject(ctx context.Context, project *models.Project) error
	GetProject(ctx context.Context, id string) (*models.Project, error)
	ListProjects(ctx context.Context, userID string) ([]models.Project, error)
	UpdateProject(ctx context.Context, project *models.Project) error
	DeleteProject(ctx context.Context, id string) error
}

type projectRepo struct {
	db *sql.DB
}

func NewProjectRepo(db *sql.DB) ProjectRepository {
	return &projectRepo{db: db}
}

func (r *projectRepo) CreateProject(ctx context.Context, project *models.Project) error {
	query := `INSERT INTO projects (id, workspace_id, created_by, name, description, created_at) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.db.ExecContext(ctx, query, project.ID, project.WorkspaceID, project.CreatedBy, project.Name, project.Description, project.CreatedAt)
	return err
}

func (r *projectRepo) GetProject(ctx context.Context, id string) (*models.Project, error) {
	query := `SELECT id, workspace_id, created_by, name, description, created_at FROM projects WHERE id = $1`
	project := &models.Project{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(&project.ID, &project.WorkspaceID, &project.CreatedBy, &project.Name, &project.Description, &project.CreatedAt)
	return project, err
}

func (r *projectRepo) ListProjects(ctx context.Context, userID string) ([]models.Project, error) {
	query := `SELECT id, workspace_id, created_by, name, description, created_at FROM projects WHERE created_by = $1`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(&p.ID, &p.WorkspaceID, &p.CreatedBy, &p.Name, &p.Description, &p.CreatedAt); err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, rows.Err()
}

func (r *projectRepo) UpdateProject(ctx context.Context, project *models.Project) error {
	query := `UPDATE projects SET name = $1, description = $2 WHERE id = $3`
	_, err := r.db.ExecContext(ctx, query, project.Name, project.Description, project.ID)
	return err
}

func (r *projectRepo) DeleteProject(ctx context.Context, id string) error {
	query := `DELETE FROM projects WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
