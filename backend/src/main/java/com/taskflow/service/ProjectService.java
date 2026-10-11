package com.taskflow.service;

import com.taskflow.dto.AddMemberRequest;
import com.taskflow.dto.ProjectRequest;
import com.taskflow.dto.ProjectResponse;
import com.taskflow.dto.UserDTO;
import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectMember;
import com.taskflow.entity.User;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private UserRepository userRepository;

    public ProjectResponse createProject(ProjectRequest request, Long currentUserId) {
        User owner = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));

        Project project = new Project(request.getName().trim(), request.getDescription(), owner);
        Project savedProject = projectRepository.save(project);

        // Automatically add owner as OWNER member
        ProjectMember ownerMember = new ProjectMember(savedProject, owner, "OWNER");
        projectMemberRepository.save(ownerMember);

        List<UserDTO> memberDTOs = List.of(UserDTO.fromEntity(owner));
        return ProjectResponse.fromEntity(savedProject, memberDTOs);
    }

    public List<ProjectResponse> getUserProjects(Long currentUserId) {
        List<Project> projects = projectRepository.findProjectsByUserId(currentUserId);
        
        return projects.stream().map(project -> {
            List<ProjectMember> members = projectMemberRepository.findByProjectId(project.getId());
            List<UserDTO> memberDTOs = members.stream()
                    .map(pm -> UserDTO.fromEntity(pm.getUser()))
                    .collect(Collectors.toList());
            return ProjectResponse.fromEntity(project, memberDTOs);
        }).collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long projectId, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));

        // Authorization check: must be owner or member
        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, currentUserId)) {
            throw new AccessDeniedException("You are not a member of this project");
        }

        List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);
        List<UserDTO> memberDTOs = members.stream()
                .map(pm -> UserDTO.fromEntity(pm.getUser()))
                .collect(Collectors.toList());

        return ProjectResponse.fromEntity(project, memberDTOs);
    }

    public ProjectResponse addMemberToProject(Long projectId, AddMemberRequest request, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));

        // Authorization check: only owner can add members
        if (!project.getOwner().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Only the project owner can add new members");
        }

        User userToAdd = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User with email '" + request.getEmail() + "' not found"));

        // Check duplicate membership
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userToAdd.getId())) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember(project, userToAdd, "MEMBER");
        projectMemberRepository.save(member);

        List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);
        List<UserDTO> memberDTOs = members.stream()
                .map(pm -> UserDTO.fromEntity(pm.getUser()))
                .collect(Collectors.toList());

        return ProjectResponse.fromEntity(project, memberDTOs);
    }

    public boolean isUserProjectMember(Long projectId, Long userId) {
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }
}
