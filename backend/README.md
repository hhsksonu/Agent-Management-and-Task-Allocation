# Agent Task Distribution System - Backend

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Multer for file uploads
- csv-parser and xlsx for file processing

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend folder with:
```
MONGO_URI=mongodb://localhost:27017/agent-task-system
JWT_SECRET=mysecretkey12345
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Create Admin User
Run this command to create the default admin:
```bash
node createAdmin.js
```

This will create an admin with:
- Email: admin@gmail.com
- Password: admin123

### 5. Start the Server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Admin Routes
- `POST /api/admin/login` - Admin login
- `POST /api/admin/create` - Create new admin (optional)

### Agent Routes (Protected)
- `POST /api/agents/add` - Add new agent
- `GET /api/agents/all` - Get all agents

### Task Routes (Protected)
- `POST /api/tasks/upload` - Upload CSV/Excel file and distribute tasks
- `GET /api/tasks/by-agent` - Get tasks grouped by agents

## File Upload Format
CSV/Excel files should have these columns:
- FirstName (required)
- Phone (required)
- Notes (optional)

Sample CSV file is provided as `sample-data.csv`

## Testing
1. Login with admin credentials
2. Add some agents
3. Upload the sample CSV file
4. Check task distribution

## Notes
- Make sure MongoDB is running before starting the server
- File uploads are stored temporarily in the `uploads/` folder
- After processing, uploaded files are automatically deleted
