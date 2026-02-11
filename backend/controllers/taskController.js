const Task = require('../models/Task');
const Agent = require('../models/Agent');
const csv = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');

// Upload CSV/Excel and distribute tasks
exports.uploadAndDistribute = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    let records = [];

    // Parse file based on extension
    if (fileExtension === 'csv') {
      // Parse CSV file
      records = await parseCSV(filePath);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Parse Excel file
      records = parseExcel(filePath);
    } else {
      // Delete uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Invalid file type. Only CSV, XLS, XLSX allowed' });
    }

    // Validate records
    if (records.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No valid records found in file' });
    }

    // Validate required columns
    const firstRecord = records[0];
    if (!firstRecord.FirstName || !firstRecord.Phone) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Required columns missing: FirstName, Phone' });
    }

    // Get all agents
    const agents = await Agent.find();
    if (agents.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No agents available. Please add agents first.' });
    }

    // Distribution logic
    const totalRecords = records.length;
    const totalAgents = agents.length;
    const recordsPerAgent = Math.floor(totalRecords / totalAgents);
    const remainingRecords = totalRecords % totalAgents;

    let currentIndex = 0;
    const tasks = [];

    // Distribute records to agents
    for (let i = 0; i < totalAgents; i++) {
      // Calculate how many records this agent should get
      let recordsForThisAgent = recordsPerAgent;
      if (i < remainingRecords) {
        recordsForThisAgent += 1; // First few agents get one extra record
      }

      // Assign records to this agent
      for (let j = 0; j < recordsForThisAgent; j++) {
        if (currentIndex < totalRecords) {
          const record = records[currentIndex];
          tasks.push({
            firstName: record.FirstName || '',
            phone: record.Phone ? record.Phone.toString() : '',
            notes: record.Notes || '',
            assignedAgent: agents[i]._id
          });
          currentIndex++;
        }
      }
    }

    // Save all tasks to database
    await Task.insertMany(tasks);

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({
      message: 'Tasks distributed successfully',
      totalRecords: totalRecords,
      tasksCreated: tasks.length
    });
  } catch (error) {
    console.log(error);
    // Delete file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error during file processing' });
  }
};

// Helper function to parse CSV
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Helper function to parse Excel
function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data;
}

// Get tasks by agent
exports.getTasksByAgent = async (req, res) => {
  try {
    // Get all tasks with agent details
    const tasks = await Task.find().populate('assignedAgent', 'name email mobile');

    // Group tasks by agent
    const tasksByAgent = {};
    tasks.forEach(task => {
      const agentId = task.assignedAgent._id.toString();
      if (!tasksByAgent[agentId]) {
        tasksByAgent[agentId] = {
          agent: {
            id: task.assignedAgent._id,
            name: task.assignedAgent.name,
            email: task.assignedAgent.email,
            mobile: task.assignedAgent.mobile
          },
          tasks: []
        };
      }
      tasksByAgent[agentId].tasks.push({
        id: task._id,
        firstName: task.firstName,
        phone: task.phone,
        notes: task.notes
      });
    });

    // Convert to array
    const result = Object.values(tasksByAgent);

    res.json({ data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};