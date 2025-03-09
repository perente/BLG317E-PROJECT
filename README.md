
# BLG317E Project

## Project Description
This project consists of a **frontend** built with Next.js and Tailwind CSS and a **backend** implemented in Python. It allows interaction with data related to Olympics 2024.

---

## Prerequisites

1. **Frontend**:
   - Node.js (version 18 or higher)
   - npm or pnpm package manager (pnpm is recommended)
   ```bash
   npm install -g pnpm
   ```

2. **Backend**:
   - Python (version 3.9 or higher)
   - `pip` (Python package manager)

---

## Database Server Setup
   - Fill the blanks on the `server/setting.py` file with your database credentials.
   ```python
      db_host = ""
      db_password = ""
      db_user = ""
      db_name = ""
      db_port = ""
   ```

## Installation and Setup

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize the database:
   ```bash
   python create_db.py
   ```

4. Run the backend server:
   ```bash
   python server.py
   ```
   The server will start at `http://localhost:8080`.

---

### Step 2: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

---

## Usage

1. Access the frontend through the browser at `http://localhost:3000`.
2. The backend API endpoints are hosted at `http://localhost:8080`.
3. Interact with the project through the provided interface or API.

---

## Project Structure

### Backend
- **`server.py`**: Main entry point for the backend server.
- **`Data/Tables`**: Contains sample CSV data for database initialization.
- **`requirements.txt`**: Python dependencies for the backend.

### Frontend
- **`src/app`**: Contains pages and components.

---

