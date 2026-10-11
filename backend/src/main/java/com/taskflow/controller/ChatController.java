package com.taskflow.controller;

import com.taskflow.dto.ChatMessageRequest;
import com.taskflow.dto.ChatMessageResponse;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ChatMessageResponse>> getProjectMessages(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ChatMessageResponse> messages = chatService.getProjectMessages(projectId, userPrincipal.getId());
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable Long projectId,
            @Valid @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ChatMessageResponse response = chatService.sendMessage(projectId, request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }
}
