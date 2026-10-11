package com.taskflow.dto;

import com.taskflow.entity.Priority;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Long projectId;
    private String projectName;
    private Long projectOwnerId;
    private UserDTO createdBy;
    private UserDTO assignedTo;
    private Priority priority;
    private TaskStatus status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;

    public TaskResponse() {
    }

    public static TaskResponse fromEntity(Task task) {
        if (task == null) return null;
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        if (task.getProject() != null) {
            response.setProjectId(task.getProject().getId());
            response.setProjectName(task.getProject().getName());
            if (task.getProject().getOwner() != null) {
                response.setProjectOwnerId(task.getProject().getOwner().getId());
            }
        }
        response.setCreatedBy(UserDTO.fromEntity(task.getCreatedBy()));
        response.setAssignedTo(UserDTO.fromEntity(task.getAssignedTo()));
        response.setPriority(task.getPriority());
        response.setStatus(task.getStatus());
        response.setDueDate(task.getDueDate());
        response.setCreatedAt(task.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Long getProjectOwnerId() {
        return projectOwnerId;
    }

    public void setProjectOwnerId(Long projectOwnerId) {
        this.projectOwnerId = projectOwnerId;
    }

    public UserDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserDTO createdBy) {
        this.createdBy = createdBy;
    }

    public UserDTO getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(UserDTO assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
