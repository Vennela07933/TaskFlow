package com.taskflow.service;

import com.taskflow.dto.ChatMessageRequest;
import com.taskflow.dto.ChatMessageResponse;
import com.taskflow.entity.ChatMessage;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.repository.ChatMessageRepository;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatMessageResponse sendMessage(Long projectId, ChatMessageRequest request, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));

        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, currentUserId)) {
            throw new AccessDeniedException("You are not a member of this project");
        }

        User sender = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Sender user not found"));

        ChatMessage message = new ChatMessage(project, sender, request.getMessage().trim());
        ChatMessage savedMessage = chatMessageRepository.save(message);

        return ChatMessageResponse.fromEntity(savedMessage);
    }

    public List<ChatMessageResponse> getProjectMessages(Long projectId, Long currentUserId) {
        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, currentUserId)) {
            throw new AccessDeniedException("You are not a member of this project");
        }

        List<ChatMessage> messages = chatMessageRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
        return messages.stream().map(ChatMessageResponse::fromEntity).collect(Collectors.toList());
    }
}
