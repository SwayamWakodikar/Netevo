package models

import (
    "time"

    "github.com/google/uuid"
)

type User struct {
    ID        uuid.UUID `json:"id" db:"id"`
    Email     string    `json:"email" db:"email"`
    Username  string    `json:"username" db:"username"`
    Password  string    `json:"password" db:"password"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Workspace struct {
    ID        uuid.UUID  `json:"id" db:"id"`
    OwnerID   uuid.UUID  `json:"owner_id" db:"owner_id"`
    Name      string     `json:"name" db:"name"`
    CreatedAt time.Time  `json:"created_at" db:"created_at"`
}

type WorkspaceMember struct {
    WorkspaceID uuid.UUID  `json:"workspace_id" db:"workspace_id,primary"`
    UserID     uuid.UUID  `json:"user_id" db:"user_id,primary"`
    Role       string     `json:"role" db:"role"`
    JoinedAt   time.Time  `json:"joined_at" db:"joined_at"`
}

type Project struct {
    ID          uuid.UUID  `json:"id" db:"id"`
    WorkspaceID uuid.UUID  `json:"workspace_id" db:"workspace_id"`
    CreatedBy   uuid.UUID  `json:"created_by" db:"created_by"`
    Name        string     `json:"name" db:"name"`
    Description string     `json:"description" db:"description"`
    CreatedAt   time.Time  `json:"created_at" db:"created_at"`
}

type Task struct {
    ID          uuid.UUID  `json:"id" db:"id"`
    ProjectID   uuid.UUID  `json:"project_id" db:"project_id"`
    AssignedTo  uuid.UUID  `json:"assigned_to" db:"assigned_to"`
    CreatedBy   uuid.UUID  `json:"created_by" db:"created_by"`
    Title       string     `json:"title" db:"title"`
    Description string     `json:"description" db:"description"`
    Status      string     `json:"status" db:"status"`
    Priority    string     `json:"priority" db:"priority"`
    DueDate     time.Time  `json:"due_date" db:"due_date"`
    CreatedAt   time.Time  `json:"created_at" db:"created_at"`
    UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

type Comment struct {
    ID           uuid.UUID  `json:"id" db:"id"`
    TaskID       uuid.UUID  `json:"task_id" db:"task_id"`
    CommentedBy  uuid.UUID  `json:"commented_by" db:"commented_by"`
    Content      string     `json:"content" db:"content"`
    CommentedAt  time.Time  `json:"commented_at" db:"commented_at"`
}