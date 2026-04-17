# Project Task Board Application

A full-stack task management application built using React and ASP.NET Core Web API with a SQLite database.

This project was developed as part of a take-home assignment for a Junior Full-Stack Developer role. It demonstrates API design, database persistence, and frontend state management using modern best practices.

---

## Features

### Dashboard
- Displays total tasks and project insights
- Task distribution by status
- Highlights overdue tasks
- Shows upcoming deadlines

### Project Management
- Create, update, and delete projects
- Unique project name validation
- Each project contains multiple tasks

### Task Management
- Create, edit, and delete tasks
- Fields include:
  - Title and Description
  - Priority (Low, Medium, High, Critical)
  - Status (Todo, InProgress, Review, Done)
  - Due Date (validated: present or future)

### Filtering, Sorting and Pagination
- Filter tasks by status and priority
- Sort by due date and created date
- Pagination implemented

### Comments System
- Add comments to tasks
- Delete comments

---

## Tech Stack

### Frontend
- React (Hooks and Context API)
- React Router
- Axios

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQLite

---

## Project Structure

### Frontend (src/)
components/
pages/
hooks/
context/
services/

### Backend (TaskBackend/)
Controllers/
Models/
Data/
Migrations/

---

## Setup Instructions

### Backend

cd TaskBackend  
dotnet restore  
dotnet ef database update  
dotnet run  

Runs on http://localhost:5000

---

### Frontend

cd TO-DO-APP-IN-REACT-CODE  
npm install  
npm start  

Runs on http://localhost:3000

---

## Key Highlights

- Clean architecture using DTOs
- RESTful API design
- SQLite persistence with migrations
- Filtering, sorting, and pagination
- React Context and custom hooks
- Search
-  Dark Mode

---

## Notes

- UI spacing and layout improvements applied for better usability

---

## Author

Raj  
Junior Full-Stack Developer (React + .NET)
