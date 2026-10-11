package com.taskflow.dto;

import com.taskflow.entity.Project;

import java.util.List;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private UserDTO owner;
    private List<UserDTO> members;

    public ProjectResponse() {
    }

    public ProjectResponse(Long id, String name, String description, UserDTO owner, List<UserDTO> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.members = members;
    }

    public static ProjectResponse fromEntity(Project project, List<UserDTO> members) {
        if (project == null) return null;
        return new ProjectResponse(
            project.getId(),
            project.getName(),
            project.getDescription(),
            UserDTO.fromEntity(project.getOwner()),
            members
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    public List<UserDTO> getMembers() {
        return members;
    }

    public void setMembers(List<UserDTO> members) {
        this.members = members;
    }
}
