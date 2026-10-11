package com.taskflow.dto;

import java.util.List;

public class DashboardSummaryDTO {
    private String userName;
    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private List<TaskResponse> recentTasks;

    public DashboardSummaryDTO() {
    }

    public DashboardSummaryDTO(String userName, long totalTasks, long pendingTasks, long inProgressTasks, long completedTasks, List<TaskResponse> recentTasks) {
        this.userName = userName;
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
        this.recentTasks = recentTasks;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public List<TaskResponse> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<TaskResponse> recentTasks) {
        this.recentTasks = recentTasks;
    }
}
