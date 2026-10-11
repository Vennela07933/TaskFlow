package com.taskflow.controller;

import com.taskflow.dto.AddMemberRequest;
import com.taskflow.dto.ProjectRequest;
import com.taskflow.dto.ProjectResponse;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProjectResponse response = projectService.createProject(request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ProjectResponse> projects = projectService.getUserProjects(userPrincipal.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProjectResponse project = projectService.getProjectById(id, userPrincipal.getId());
        return ResponseEntity.ok(project);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ProjectResponse> addMember(
            @PathVariable Long id,
            @Valid @RequestBody AddMemberRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProjectResponse response = projectService.addMemberToProject(id, request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }
}
