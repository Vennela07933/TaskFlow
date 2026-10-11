package com.taskflow.dto;

import com.taskflow.entity.ChatMessage;

import java.time.LocalDateTime;

public class ChatMessageResponse {
    private Long id;
    private Long projectId;
    private UserDTO sender;
    private String message;
    private LocalDateTime createdAt;

    public ChatMessageResponse() {
    }

    public static ChatMessageResponse fromEntity(ChatMessage chatMessage) {
        if (chatMessage == null) return null;
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(chatMessage.getId());
        if (chatMessage.getProject() != null) {
            response.setProjectId(chatMessage.getProject().getId());
        }
        response.setSender(UserDTO.fromEntity(chatMessage.getSender()));
        response.setMessage(chatMessage.getMessage());
        response.setCreatedAt(chatMessage.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public UserDTO getSender() {
        return sender;
    }

    public void setSender(UserDTO sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
