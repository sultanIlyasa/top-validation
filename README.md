# Top Validation

Top Validation is a full-stack application built using **Next.js** (frontend) and **NestJS** (backend). It uses **PostgreSQL** as the database, **Prisma** as the ORM, and WebSocket for real-time communication.

---

## Prerequisites

Before setting up the project, ensure the following tools are installed on your system:

### Windows Setup
1. **Node.js** (includes npm):
   - Download and install from [Node.js Official Website](https://nodejs.org/).

2. **PostgreSQL**:
   - Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/).
   - During installation, note the username, password, and port (default: 5432).

3. **Git**:
   - Download and install from [Git Official Website](https://git-scm.com/).

4. **Prisma** CLI (optional but recommended):
   - Install globally via npm:
     ```bash
     npm install -g prisma
     ```

---

### Linux Setup
1. **Node.js** (includes npm):
   - Install via package manager:
     ```bash
     sudo apt update
     sudo apt install -y nodejs npm
     ```

2. **PostgreSQL**:
   - Install via package manager:
     ```bash
     sudo apt update
     sudo apt install -y postgresql postgresql-contrib
     ```
   - After installation, start PostgreSQL and set up a user and database:
     ```bash
     sudo service postgresql start
     sudo -u postgres psql
     ```
     Inside the PostgreSQL CLI:
     ```sql
     CREATE USER myuser WITH PASSWORD 'mypassword';
     CREATE DATABASE mydatabase;
     GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
     \q
     ```

3. **Git**:
   - Install via package manager:
     ```bash
     sudo apt install -y git
     ```

4. **Prisma** CLI (optional but recommended):
   - Install globally via npm:
     ```bash
     npm install -g prisma
     ```

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sultanIlyasa/top-validation.git
## Backend Setup
2. **Navigate to the backend folder**:
   ```bash
   cd top-validation/backend
3. **Install backend dependencies**:
   ```bash
   npm install
4. **Set up environment variables for backend**:
   - Create a .env file in the backend directory:
     ```bash
     touch .env
   - Add the following variables (replace placeholders with actual values):
     ```makefile
     DATABASE_URL=postgresql://username:password@localhost:5432/database_name
     JWT_SECRET="Kz+yPLJ45m9Ax3QjZ1tCqRsivD9ZNKM5a8ozXtjEoS1fIRvpJ1n/7fobKaVcUPqaIXYKVc14UglGdGhYmmWSVw=="
     JWT_REFRESH_SECRET="GWoZr9Tf6fcQn20aLst96SDbZj0f0mkdCZSFtw4p4cXjgGDKi7w3k0mC+fEBnYLfzCGu0tsd/ywtAtOMyGHdzQ=="
     IMGBB_API_KEY="11871c9c513f37701f8a7ed5c9e3a68f"
     CLIENT_URL="http://localhost:3000"
     PORT=8000
     FRONTEND_URL="http://localhost:3000"
   - Run Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev
   - Generate the Prisma Client:
     ```bash
     npx prisma generate
   - View and manage your database with Prisma Studio:
     ```bash
     npx prisma studio
## Frontend Setup
5. **Navigate to the backend folder**
   ```bash
   cd top-validation/frontend
6. **Install backend dependencies**:
   ```bash
   npm install
7. **Set up environment variables for frontend**:
   - Create a .env file in the backend directory:
     ```bash
     touch .env
   - Add the following variables (replace placeholders with actual values):
     ```makefile
     NEXTAUTH_SECRET=your_nextauth_secret
     NEXTAUTH_URL=http://localhost:3000
     BACKEND_URL=http://localhost:8000
     NEXT_PUBLIC_API_URL="http://localhost:8000"
     NEXT_PUBLIC_SOCKET_URL="http://localhost:8000"
## Running the Application
1. **Start the backend server:**
   ```bash
   npm run start:dev
2. **Start the nextjs development server:**
   ```bash
   npm run dev
Make sure the environment variables for the frontend are properly set up in .env.local, and the backend in .env






