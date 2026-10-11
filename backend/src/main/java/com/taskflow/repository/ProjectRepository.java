package com.taskflow.repository;

import com.taskflow.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId);

    @Query("SELECT DISTINCT pm.project FROM ProjectMember pm WHERE pm.user.id = :userId")
    List<Project> findProjectsByUserId(@Param("userId") Long userId);
}
