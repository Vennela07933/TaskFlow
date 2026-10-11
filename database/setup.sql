-- =========================================================
-- TaskFlow Complete Database Setup & Seed Data (MySQL)
-- Project: TASKFLOW - Simple Team Task Management System
-- =========================================================

-- 1. Create and Select Database
CREATE DATABASE IF NOT EXISTS `taskflow_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `taskflow_db`;

-- 2. Drop existing tables if any (in correct reverse foreign key order)
DROP TABLE IF EXISTS `chat_messages`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `project_members`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `users`;

-- 3. Create Tables

-- A. Users Table
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- B. Projects Table
CREATE TABLE `projects` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `owner_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_projects_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- C. Project Members Table
CREATE TABLE `project_members` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `project_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pm_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `unique_project_user` UNIQUE (`project_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- D. Tasks Table
CREATE TABLE `tasks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `project_id` BIGINT NOT NULL,
    `created_by` BIGINT NOT NULL,
    `assigned_to` BIGINT DEFAULT NULL,
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    `status` VARCHAR(20) NOT NULL DEFAULT 'TO_DO',
    `due_date` DATE DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tasks_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tasks_assignee` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- E. Chat Messages Table
CREATE TABLE `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `project_id` BIGINT NOT NULL,
    `sender_id` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chat_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_chat_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Seed Initial Users (Password for all accounts is: password123)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`) VALUES
(1, 'Rahul Sharma (Owner)', 'rahul@college.edu', '$2a$10$ZngP94IhnQg3XwFnLvJ8R.vhqw48sKLh0xGeENkRH0qPwXVHt64ZG'),
(2, 'Priya Patel (Member)', 'priya@college.edu', '$2a$10$ZngP94IhnQg3XwFnLvJ8R.vhqw48sKLh0xGeENkRH0qPwXVHt64ZG'),
(3, 'Amit Kumar (Member)', 'amit@college.edu', '$2a$10$ZngP94IhnQg3XwFnLvJ8R.vhqw48sKLh0xGeENkRH0qPwXVHt64ZG');

-- 5. Seed Initial Project
INSERT INTO `projects` (`id`, `name`, `description`, `owner_id`) VALUES
(1, 'College Mini Project - TaskFlow', 'Full-stack team task management system built with Spring Boot and React', 1);

-- 6. Seed Project Members
INSERT INTO `project_members` (`id`, `project_id`, `user_id`, `role`) VALUES
(1, 1, 1, 'OWNER'),
(2, 1, 2, 'MEMBER'),
(3, 1, 3, 'MEMBER');

-- 7. Seed Initial Tasks
INSERT INTO `tasks` (`id`, `title`, `description`, `project_id`, `created_by`, `assigned_to`, `priority`, `status`, `due_date`, `created_at`) VALUES
(1, 'Design Database Schema', 'Create tables for users, projects, tasks, and chat in MySQL', 1, 1, 1, 'HIGH', 'COMPLETED', '2026-10-15', NOW()),
(2, 'Build Spring Boot REST APIs', 'Implement Auth, Project, Task, and Chat controllers in Java', 1, 1, 2, 'HIGH', 'IN_PROGRESS', '2026-10-18', NOW()),
(3, 'Create React Dashboard UI', 'Design responsive dashboard, task cards, and project details', 1, 1, 3, 'MEDIUM', 'TO_DO', '2026-10-20', NOW());

-- 8. Seed Initial Chat Messages
INSERT INTO `chat_messages` (`id`, `project_id`, `sender_id`, `message`, `created_at`) VALUES
(1, 1, 1, 'Welcome team! Let us complete our TaskFlow project submission on time.', NOW()),
(2, 1, 2, 'Hi Rahul, I am working on the Spring Boot REST APIs now.', NOW()),
(3, 1, 3, 'Awesome! I will start building the React components.', NOW());
