package repository

import (
	"context"
	"database/sql"

	"github.com/SwayamWakodikar/netevo/services/user-service/internal/models"
)

type WorkspaceRepository interface{
	CreateWorkspace(ctx context.Context, workspace *models.Workspace) error
	GetWorkspace(ctx context.Context, id string) (*models.Workspace, error)
	ListWorkspaces(ctx context.Context, userID string) ([]models.Workspace, error)
	UpdateWorkspace(ctx context.Context, workspace *models.Workspace) error
	DeleteWorkspace(ctx context.Context, id string) error
}

type workspaceRepo struct {
	db *sql.DB
}

func NewWorkspaceRepo(db *sql.DB) WorkspaceRepository {
	return &workspaceRepo{db: db}
}

func (r *workspaceRepo) CreateWorkspace(ctx context.Context, workspace *models.Workspace) error {
	query := `INSERT INTO workspaces (id, owner_id, name, created_at) VALUES ($1, $2, $3, $4)`
	_, err := r.db.ExecContext(ctx, query, workspace.ID, workspace.OwnerID, workspace.Name, workspace.CreatedAt)
	return err
}

func (r *workspaceRepo) GetWorkspace(ctx context.Context, id string) (*models.Workspace, error) {
	query := `SELECT id, owner_id, name, created_at FROM workspaces WHERE id = $1`
	workspace := &models.Workspace{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(&workspace.ID, &workspace.OwnerID, &workspace.Name, &workspace.CreatedAt)
	return workspace, err
}

func (r *workspaceRepo) ListWorkspaces(ctx context.Context, userID string) ([]models.Workspace, error) {
	query := `SELECT id, owner_id, name, created_at FROM workspaces WHERE owner_id = $1`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var workspaces []models.Workspace
	for rows.Next() {
		var w models.Workspace
		if err := rows.Scan(&w.ID, &w.OwnerID, &w.Name, &w.CreatedAt); err != nil {
			return nil, err
		}
		workspaces = append(workspaces, w)
	}
	return workspaces, rows.Err()
}

func (r *workspaceRepo) UpdateWorkspace(ctx context.Context, workspace *models.Workspace) error {
	query := `UPDATE workspaces SET name = $1 WHERE id = $2`
	_, err := r.db.ExecContext(ctx, query, workspace.Name, workspace.ID)
	return err
}

func (r *workspaceRepo) DeleteWorkspace(ctx context.Context, id string) error {
	query := `DELETE FROM workspaces WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
