# Agent Task Distribution System - MERN Stack

## Project Overview

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that enables administrators to manage agents and automatically distribute customer tasks from CSV/Excel files equally among all available agents.

## Complete Feature List

### 1. Admin Authentication
- Secure login system with email and password
- JWT (JSON Web Token) based authentication
- Protected routes and session management
- Automatic redirect on successful/failed login

### 2. Agent Management
- Add new agents with complete details:
  - Full Name
  - Email Address
  - Mobile Number (with country code)
  - Password (encrypted using bcryptjs)
- View all registered agents in tabular format
- Agent data persistence in MongoDB database

### 3. CSV/Excel File Upload and Task Distribution
- Support for multiple file formats: .csv, .xlsx, .xls
- File type validation before processing
- Column validation (required: FirstName, Phone, Notes)
- Automatic equal distribution among all available agents
- Intelligent remainder handling
- Example distribution:
  - 25 tasks / 5 agents = 5 tasks per agent
  - 27 tasks / 5 agents = 2 agents get 6 tasks, 3 agents get 5 tasks
- Task assignment saved to database
- Visual display of distributed tasks by agent

## Technology Stack

### Backend
- Node.js - Runtime environment
- Express.js - Web application framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- JWT - Authentication tokens
- bcryptjs - Password hashing
- Multer - File upload handling
- csv-parser - CSV file processing
- xlsx - Excel file processing

### Frontend
- React.js - User interface library
- React Router DOM - Client-side routing
- Axios - HTTP client for API requests
- CSS3 - Styling and responsive design

## Project Structure
```
agent-task-system/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── agentController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Agent.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── agentRoutes.js
│   │   └── taskRoutes.js
│   ├── uploads/
│   ├── server.js
│   ├── createAdmin.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddAgent.js
│   │   │   ├── AgentList.js
│   │   │   ├── TaskList.js
│   │   │   └── UploadCSV.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── README.md
└── VIDEO_DEMO_INSTRUCTIONS.md
```

## Installation and Setup

### Prerequisites
- Node.js (version 14.x or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend folder with the following:
```
MONGO_URI=mongodb://localhost:27017/agent-task-system
JWT_SECRET=mysecretkey12345
PORT=5000
```

Note: If using MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

4. Create the initial admin user:
```bash
node createAdmin.js
```

This will create an admin account with:
- Email: admin@gmail.com
- Password: admin123

5. Start the backend server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The backend server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React application:
```bash
npm start
```

The frontend application will run on http://localhost:3000

## Usage Instructions

### Step 1: Admin Login
1. Open your browser and navigate to http://localhost:3000
2. Enter admin credentials:
   - Email: admin@gmail.com
   - Password: admin123
3. Click "Login" button
4. Upon successful authentication, you will be redirected to the dashboard

### Step 2: Add Agents
1. Click on the "Add Agent" tab in the dashboard
2. Fill in the agent details:
   - Name: Full name of the agent
   - Email: Valid email address
   - Mobile: Phone number with country code (e.g., +919876543210)
   - Password: Password for the agent
3. Click "Add Agent" button
4. Repeat to add multiple agents (minimum 5 recommended for testing)

### Step 3: View All Agents
1. Click on the "View Agents" tab
2. Review the list of all registered agents
3. Information displayed: Name, Email, Mobile Number, Creation Date

### Step 4: Upload CSV File
1. Click on the "Upload CSV" tab
2. Prepare a CSV/Excel file with the following columns:
   - FirstName (required)
   - Phone (required)
   - Notes (optional)
3. Click "Choose File" and select your CSV/XLSX/XLS file
4. Click "Upload & Distribute" button
5. The system will validate and distribute tasks automatically

### Step 5: View Task Distribution
1. Click on the "View Tasks" tab
2. Review how tasks are distributed among agents
3. Each agent section shows:
   - Agent details (Name, Email, Mobile)
   - Total tasks assigned
   - Individual task details in table format

### Step 6: Logout
1. Click the "Logout" button in the navigation bar
2. You will be redirected to the login page
3. JWT token is cleared from browser storage

## Sample CSV File Format
```csv
FirstName,Phone,Notes
John,9876543210,Follow up for product demo
Sarah,9876543211,Interested in premium plan
Michael,9876543212,Called back on Monday
Emma,9876543213,Send quotation
David,9876543214,Schedule meeting next week
```

A sample CSV file (sample-data.csv) is included in the backend folder for testing purposes.

## API Documentation

### Admin Routes
- POST /api/admin/login - Authenticate admin user
- POST /api/admin/create - Create new admin (optional)

### Agent Routes (Protected - Requires JWT Token)
- POST /api/agents/add - Add new agent
- GET /api/agents/all - Retrieve all agents

### Task Routes (Protected - Requires JWT Token)
- POST /api/tasks/upload - Upload CSV file and distribute tasks
- GET /api/tasks/by-agent - Retrieve tasks grouped by agent

## Security Features

1. Password Encryption: All passwords are hashed using bcryptjs before storage
2. JWT Authentication: Secure token-based authentication system
3. Protected Routes: Frontend routes protected from unauthorized access
4. Input Validation: Server-side validation for all inputs
5. File Validation: Strict file type and format checking

## Error Handling

The application handles the following scenarios:
- Invalid login credentials
- Duplicate email addresses for agents
- Invalid file formats
- Missing required columns in CSV
- Empty CSV files
- No agents available for distribution
- Database connection errors
- Invalid or expired JWT tokens

## Validation Rules

### File Upload
- Accepted formats: .csv, .xlsx, .xls only
- Required columns: FirstName, Phone
- Optional columns: Notes
- File must contain at least one data row

### Agent Creation
- All fields are required
- Email must be unique
- Password minimum length: 6 characters
- Mobile number should include country code

## Distribution Algorithm

The system uses a simple and fair distribution algorithm:

1. Calculate base tasks per agent: totalTasks / totalAgents (rounded down)
2. Calculate remainder: totalTasks % totalAgents
3. First 'remainder' agents receive (base + 1) tasks
4. Remaining agents receive base tasks

Example:
- 27 tasks, 5 agents
- Base: 27 / 5 = 5 tasks per agent
- Remainder: 27 % 5 = 2 extra tasks
- Distribution: [6, 6, 5, 5, 5]

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Verify MONGO_URI in .env file is correct
- For local MongoDB: mongodb://localhost:27017/agent-task-system
- For MongoDB Atlas: Check network access and credentials

### Backend Port Already in Use
- Change PORT value in .env file
- Kill the process using port 5000
- Restart the backend server

### Frontend Cannot Connect to Backend
- Verify backend is running on port 5000
- Check API_URL in frontend/src/services/api.js
- Ensure CORS is enabled in backend (already configured)

### Login Issues
- Verify admin user was created using createAdmin.js
- Check browser console for errors
- Clear browser cache and localStorage

### File Upload Fails
- Verify file format is .csv, .xlsx, or .xls
- Ensure FirstName and Phone columns exist
- Check that at least one agent is registered
- Review backend console for detailed error messages

## Development Notes

### Code Style
- Written with beginner-friendly approach
- Clear variable names and function names
- Comments explain key logic sections
- Simple folder structure without over-engineering
- No complex design patterns or abstractions

### Database Schema
- Admin: email, password, timestamps
- Agent: name, email, mobile, password, timestamps
- Task: firstName, phone, notes, assignedAgent (reference), timestamps

## Evaluation Criteria Coverage

1. Functionality: All required features implemented and tested
2. Code Quality: Clean, readable, well-structured code with appropriate comments
3. Validation: Comprehensive input validation and error handling
4. User Interface: Clean, intuitive, and responsive design
5. Execution: Clear setup instructions and easy deployment process

## Video Demonstration

A video demonstration is required as part of the submission. Refer to VIDEO_DEMO_INSTRUCTIONS.md for detailed recording guidelines.

The video should cover:
- Project setup and server startup
- Admin login process
- Adding multiple agents
- Viewing registered agents
- Uploading CSV file
- Viewing task distribution
- Logout functionality

## Future Enhancements (Not Implemented)

Potential features for future versions:
- Agent login portal
- Task status updates
- Edit and delete functionality for agents
- Task reassignment capability
- Export distributed tasks to Excel
- Email notifications to agents
- Dashboard analytics and reports

## License

This project is created for educational and assessment purposes.

## Author

Developed as a Machine Test submission for MERN Stack Developer position.

## Connect With Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hhsksonu)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hhsksonu)

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review backend/frontend README files
3. Verify all setup steps were completed correctly
4. Check MongoDB connection and server logs
