package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByProjectIdAndAssignedToId(Long projectId, Long userId);

    List<Task> findByAssignedToId(Long userId);

    @Query("SELECT DISTINCT t FROM Task t " +
           "WHERE (t.assignedTo.id = :userId " +
           "   OR t.project.owner.id = :userId) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Task> findAccessibleTasks(@Param("userId") Long userId,
                                   @Param("status") TaskStatus status,
                                   @Param("search") String search);

    @Query("SELECT COUNT(t) FROM Task t WHERE (t.assignedTo.id = :userId OR t.project.owner.id = :userId)")
    long countTotalTasksForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE (t.assignedTo.id = :userId OR t.project.owner.id = :userId) AND t.status = :status")
    long countTasksByStatusForUser(@Param("userId") Long userId, @Param("status") TaskStatus status);

    @Query("SELECT t FROM Task t WHERE (t.assignedTo.id = :userId OR t.project.owner.id = :userId) ORDER BY t.createdAt DESC")
    List<Task> findRecentTasksForUser(@Param("userId") Long userId);
}
