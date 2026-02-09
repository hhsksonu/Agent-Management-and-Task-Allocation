# Agent Task Distribution System - Frontend

## Tech Stack
- React.js
- React Router DOM (for routing)
- Axios (for API calls)
- CSS (for styling)

## Features
- Admin Login
- Add Agents
- Upload CSV/Excel files
- View task distribution by agent
- Protected routes

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the React App
```bash
npm start
```

The app will run on `http://localhost:3000`

### 3. Make sure Backend is Running
Before using the frontend, make sure the backend server is running on `http://localhost:5000`

## Default Admin Credentials
- **Email:** admin@gmail.com
- **Password:** admin123

## Usage Flow

### Step 1: Login
- Open `http://localhost:3000`
- Enter admin credentials
- Click Login

### Step 2: Add Agents
- Click on "Add Agent" tab
- Fill in agent details:
  - Name
  - Email
  - Mobile (with country code like +919876543210)
  - Password
- Click "Add Agent"
- You can add multiple agents

### Step 3: Upload CSV File
- Click on "Upload CSV" tab
- Select a CSV/Excel file (.csv, .xlsx, .xls)
- File must have columns: FirstName, Phone, Notes
- Click "Upload & Distribute"
- Tasks will be automatically distributed among agents

### Step 4: View Task Distribution
- Click on "View Tasks" tab
- See all agents and their assigned tasks
- Tasks are displayed in a table format

## File Format
Your CSV/Excel file should look like this:

| FirstName | Phone      | Notes                  |
|-----------|------------|------------------------|
| John      | 9876543210 | Follow up for demo     |
| Sarah     | 9876543211 | Interested in plan     |
| Michael   | 9876543212 | Called back on Monday  |

## Folder Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddAgent.js
│   │   ├── UploadCSV.js
│   │   └── TaskList.js
│   ├── pages/
│   │   ├── Login.js
│   │   └── Dashboard.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## Notes
- Token is stored in localStorage for authentication
- Logout will clear the token
- All routes except login are protected
- API base URL is set to `http://localhost:5000/api`
