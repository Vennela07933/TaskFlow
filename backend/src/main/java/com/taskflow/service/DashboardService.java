package com.taskflow.service;

import com.taskflow.dto.DashboardSummaryDTO;
import com.taskflow.dto.TaskResponse;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import com.taskflow.entity.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardSummaryDTO getDashboardSummary(Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long totalTasks = taskRepository.countTotalTasksForUser(currentUserId);
        long pendingTasks = taskRepository.countTasksByStatusForUser(currentUserId, TaskStatus.TO_DO);
        long inProgressTasks = taskRepository.countTasksByStatusForUser(currentUserId, TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countTasksByStatusForUser(currentUserId, TaskStatus.COMPLETED);

        List<Task> recentTasksList = taskRepository.findRecentTasksForUser(currentUserId);
        List<TaskResponse> recentTasks = recentTasksList.stream()
                .limit(5)
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());

        return new DashboardSummaryDTO(
                user.getName(),
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                recentTasks
        );
    }
}
