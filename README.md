# CMSC 128 Lab — CRUD To-do List

A simple CRUD (Create, Read, Update, Delete) web application built for CMSC 128.

## Tech Stack

Pivoted from PHP-MySQL to React.

| Layer | Choice | Why |
|---|---|---|
| Backend | Node.js | Widely used, very reliable | 
| Database | Supabase | Easy to use, lets us treat the database as an API as opposed to needing to write SQL |
| Styling | Tailwind CSS | Utility-first classes let us style quickly without writing separate CSS files |
| Frontend | React + Vite | Familiar with it since we used it for our CMSC 126 |

## Requirements

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)
- A [Supabase](https://supabase.com/) account and project
- A modern web browser

## Setup & Run Locally

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root with your Supabase project credentials:

   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```

   These can be found in the Supabase project under **Settings → API**.
   
4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (or the port Vite prints in the terminal).

## Database Schema

| Table | Columns |
|---|---|
| `category` | `id`, `name` |
| `task` | `id`, `title`, `due_date`, `due_time`, `priority`, `done`, `category_id` (FK → `category.id`) |

## CRUD Operations

| Operation | Description |
|---|---|
| **Create** | Add a new task with a title, due date, due time, priority, and category |
| **Read** | View all tasks in a table, joined with their category name |
| **Update** | Edit an existing task's details or mark it as done |
| **Delete** | Remove a task from the list |

## Authors

- Renz Frederick Bañas
- Yuan Miguel Birondo
