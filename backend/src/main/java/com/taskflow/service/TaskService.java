package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskStatusUpdateRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import com.taskflow.entity.User;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request, Long currentUserId) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + request.getProjectId()));

        // Check if user belongs to project
        if (!projectMemberRepository.existsByProjectIdAndUserId(project.getId(), currentUserId)) {
            throw new AccessDeniedException("You cannot create tasks in a project you do not belong to");
        }

        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found"));

        User assignee = null;
        if (request.getAssignedToId() != null) {
            assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new IllegalArgumentException("Assigned user not found"));
            
            // Verify assigned user is a project member
            if (!projectMemberRepository.existsByProjectIdAndUserId(project.getId(), assignee.getId())) {
                throw new IllegalArgumentException("Assigned user must be a member of the project");
            }
        }

        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setCreatedBy(creator);
        task.setAssignedTo(assignee);
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO);
        task.setDueDate(request.getDueDate());

        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    public List<TaskResponse> getAllAccessibleTasks(Long currentUserId, TaskStatus status, String search) {
        List<Task> tasks = taskRepository.findAccessibleTasks(
                currentUserId,
                status,
                (search != null && !search.trim().isEmpty()) ? search.trim() : null
        );
        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByProjectId(Long projectId, Long currentUserId) {
        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, currentUserId)) {
            throw new AccessDeniedException("You do not have access to this project's tasks");
        }

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long taskId, Long currentUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        if (!projectMemberRepository.existsByProjectIdAndUserId(task.getProject().getId(), currentUserId)) {
            throw new AccessDeniedException("You do not have permission to view this task");
        }

        return TaskResponse.fromEntity(task);
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request, Long currentUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        boolean isOwner = task.getProject().getOwner().getId().equals(currentUserId);
        boolean isCreator = task.getCreatedBy().getId().equals(currentUserId);

        if (!isOwner && !isCreator) {
            throw new AccessDeniedException("Only the project owner or task creator can change task details, due date, and priority. Assignees can only update status.");
        }

        Long projectId = task.getProject().getId();
        User assignee = null;
        if (request.getAssignedToId() != null) {
            assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new IllegalArgumentException("Assigned user not found"));
            
            if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, assignee.getId())) {
                throw new IllegalArgumentException("Assigned user must be a member of the project");
            }
        }

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setAssignedTo(assignee);
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    public TaskResponse updateTaskStatus(Long taskId, TaskStatusUpdateRequest request, Long currentUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        Long projectId = task.getProject().getId();
        boolean isMember = projectMemberRepository.existsByProjectIdAndUserId(projectId, currentUserId);
        
        if (!isMember) {
            throw new AccessDeniedException("You do not have permission to update task status in this project");
        }

        task.setStatus(request.getStatus());
        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    public void deleteTask(Long taskId, Long currentUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        boolean isOwner = task.getProject().getOwner().getId().equals(currentUserId);
        boolean isCreator = task.getCreatedBy().getId().equals(currentUserId);

        if (!isOwner && !isCreator) {
            throw new AccessDeniedException("Only project owners or task creators can delete this task");
        }

        taskRepository.delete(task);
    }
}
