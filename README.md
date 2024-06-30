# Budget Minder

Budget Minder is a web-based application designed to help users manage and forecast their monthly budgets. Users can input their income and expenses, set savings goals, and track their progress. The application provides robust data security and user-friendly interfaces for a seamless budgeting experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Team](#team)

## Features

- User authentication (registration and login)
- Secure password storage using bcrypt
- JWT-based authentication
- CRUD operations for transactions (income and expenses)
- Categories for income and expenses
- User profile management
- Real-time budget tracking and forecasting

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using Sequelize ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Others**: bcrypt for password hashing, cors for Cross-Origin Resource Sharing, body-parser for parsing incoming request bodies

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/budget-minder.git
    cd budget-minder
    ```

2. Install backend dependencies:

    ```bash
    cd backend
    npm install
    ```

3. Start the backend server:

    ```bash
    npm run dev
    ```

### Frontend Setup

1. Navigate to the `frontend` directory:

    ```bash
    cd ../frontend
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000` to access the application.
2. Register a new user account.
3. Log in with your credentials.
4. Add, edit, delete, and view transactions.
5. Manage categories and track your budget.

## API Endpoints

### Authentication

- **POST /api/register**: Register a new user.
- **POST /api/login**: Log in an existing user.
- **GET /api/user**: Fetch user profile.
- **PUT /api/user**: Update user profile.

### Transactions

- **POST /api/transactions**: Add a new transaction.
- **PUT /api/transactions/:id**: Edit a transaction.
- **DELETE /api/transactions/:id**: Delete a transaction.
- **GET /api/transactions**: Get all transactions for a user.

### Categories

- **GET /api/categories**: Get all categories.

## Team

- **Jeet R Patel** (Scrum Master)
- **Pranitha Bollepalli**
- **Nikhith Beta**
- **Chanakya Dandamudi**
- **Vineeth Ketham**
