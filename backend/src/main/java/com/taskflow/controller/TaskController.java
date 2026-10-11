package com.taskflow.controller;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskStatusUpdateRequest;
import com.taskflow.entity.TaskStatus;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskResponse response = taskService.createTask(request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<TaskResponse> tasks = taskService.getAllAccessibleTasks(userPrincipal.getId(), status, search);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<TaskResponse> tasks = taskService.getTasksByProjectId(projectId, userPrincipal.getId());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskResponse task = taskService.getTaskById(id, userPrincipal.getId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskResponse response = taskService.updateTask(id, request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TaskResponse response = taskService.updateTaskStatus(id, request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        taskService.deleteTask(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
