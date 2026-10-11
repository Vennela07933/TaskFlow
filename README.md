# TaskFlow — Simple Team Task Management System

![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![License](https://img.shields.io/badge/College%20Project-Submission%20Ready-success)

---

## 1. Project Abstract
**TaskFlow** is a lightweight, beginner-friendly full-stack web application designed for small teams and student project groups to assign, track, and collaborate on tasks in real-time. Built with **Spring Boot** (Java 17), **React** (Vite), and **MySQL**, TaskFlow provides an intuitive dashboard, project workspace management, member assignment, status tracking, and a shared team chat room per project.

---

## 2. Problem Statement
In academic and small team environments, team members often struggle with scattered task updates across messaging apps and spreadsheets. Existing enterprise task managers (like Jira or Trello) can be overly complex for beginners. **TaskFlow** solves this by providing a clean, simple, and central task tracking solution with basic team collaboration and shared chat.

---

## 3. Objectives
- Provide a secure user authentication system using **BCrypt** password hashing and **JWT** tokens.
- Allow users to create projects and manage team memberships.
- Enable project owners to assign tasks to team members with due dates, priority, and status tracking.
- Provide a real-time shared project chat room using periodic polling.
- Build a clean, responsive UI suitable for college project demonstrations and resume showcase.

---

## 4. Key Features
- **User Authentication & Authorization**:
  - Registration with duplicate email prevention.
  - Secure login with BCrypt password hashing and JWT stateless tokens.
  - Private REST API endpoints protected by Spring Security.
- **Interactive Dashboard**:
  - Personalized welcome message.
  - Live statistics: Total Tasks, Pending (To Do), In Progress, and Completed.
  - Recent tasks overview directly retrieved from database.
- **Task Management**:
  - Create, view, edit, and delete tasks (with confirmation modal).
  - Assign tasks to project members with due date, priority (Low, Medium, High), and status (To Do, In Progress, Completed).
  - Instant title search and status filtering.
- **Team Collaboration & Projects**:
  - Project creation with name & description.
  - Add existing registered users to project workspaces.
  - Strict authorization: Only project members can view and access project tasks.
  - Members can update the status of their assigned tasks; owners see live status updates.
- **Shared Project Chat**:
  - Dedicated chat room per project.
  - Real-time periodic polling (auto-refreshing messages every 3 seconds).
  - MySQL persistence for chat history.

---

## 5. Technology Stack
- **Frontend**: React 18, Vite, JavaScript, CSS3, Axios, React Router v6, Lucide Icons.
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security, BCrypt, JJWT.
- **Database**: MySQL Server 8.0+ / 9.0+.
- **Build Tools**: Maven (Backend), npm / Vite (Frontend).

---

## 6. System Architecture & Database Schema

### Database Tables (MySQL)
1. **`users`**: `id`, `name`, `email` (UNIQUE), `password_hash`, `created_at`
2. **`projects`**: `id`, `name`, `description`, `owner_id` (FK -> `users.id`), `created_at`
3. **`project_members`**: `id`, `project_id` (FK -> `projects.id`), `user_id` (FK -> `users.id`), `role`, `joined_at`
4. **`tasks`**: `id`, `title`, `description`, `project_id` (FK), `created_by` (FK), `assigned_to` (FK), `priority`, `status`, `due_date`, `created_at`
5. **`chat_messages`**: `id`, `project_id` (FK), `sender_id` (FK), `message`, `created_at`

---

## 7. Prerequisites & Installation

### Requirements
- **Java 17 JDK** or higher installed.
- **Apache Maven 3.8+** installed.
- **Node.js 18+ & npm** installed.
- **MySQL Server 8.0+** running locally on port `3306`.

---

## 8. MySQL Database Setup

1. Open your MySQL client (MySQL Command Line Client or MySQL Workbench).
2. Run the database setup script located at `database/schema.sql` (or `database/setup.sql` for sample data):

```sql
CREATE DATABASE IF NOT EXISTS taskflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Update backend database credentials in `backend/src/main/resources/application.properties` if your local MySQL username/password is different:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskflow_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

*(Note: Spring Boot will automatically create all required tables on first startup via `spring.jpa.hibernate.ddl-auto=update`)*

---

## 9. Running the Application

### Step 1: Run Spring Boot Backend
Open a terminal in the `backend/` directory:

```bash
cd backend
mvn spring-boot:run
```

The backend server will start on **`http://localhost:8080`**.

*(Optional H2 zero-setup mode: `mvn spring-boot:run -Dspring-boot.run.profiles=h2`)*

### Step 2: Run React Frontend
Open a separate terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will open on **`http://localhost:5173`**.

---

## 10. REST API Documentation (Key Endpoints)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | ❌ |
| `GET` | `/api/auth/me` | Get current logged-in user profile | ✅ |
| `GET` | `/api/projects` | List projects user belongs to | ✅ |
| `POST` | `/api/projects` | Create a new team project | ✅ |
| `POST` | `/api/projects/{id}/members` | Add existing registered user as project member | ✅ |
| `GET` | `/api/tasks` | Get all accessible tasks (supports `?status=` & `?search=`) | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PATCH` | `/api/tasks/{id}/status` | Update task status | ✅ |
| `DELETE` | `/api/tasks/{id}` | Delete task (owner/creator only) | ✅ |
| `GET` | `/api/chats/project/{id}` | Retrieve project chat messages | ✅ |
| `POST` | `/api/chats/project/{id}` | Send message to project chat | ✅ |
| `GET` | `/api/dashboard` | Retrieve live dashboard statistics | ✅ |

---

## 11. Testing & Verification

1. **User Registration & Login**: Register User A (`owner@college.edu`) and User B (`member@college.edu`). Verify JWT token generated.
2. **Project Creation**: Log in as User A and create project "TaskFlow Mini Project".
3. **Member Addition**: User A adds User B using `member@college.edu`.
4. **Task Assignment**: User A creates a task "Build REST APIs" and assigns it to User B.
5. **Task Status Update**: Log in as User B in a separate browser window. View assigned task and update status to "Completed".
6. **Owner View Update**: Switch back to User A's browser and refresh. Verify status is updated to "Completed".
7. **Project Chat**: Send chat messages between User A and User B in the shared project chat room.

---

## 12. Limitations & Future Enhancements
- **Limitations**: Uses simple HTTP periodic polling for chat instead of WebSockets to keep architecture clean and beginner-friendly.
- **Future Enhancements**:
  - WebSocket/STOMP integration for instant push messaging.
  - File attachment support for tasks.
  - Email reminders for upcoming due dates.
