const Task = require('../models/Task');
const Agent = require('../models/Agent');
const csv = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');

// csv/Excel 
exports.uploadAndDistribute = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    let records = [];

    if (fileExtension === 'csv') {
      records = await parseCSV(filePath);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      records = parseExcel(filePath);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Invalid file type. Only CSV, XLS, XLSX allowed' });
    }

    // validate 
    if (records.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No valid records found in file' });
    }

    const firstRecord = records[0];
    if (!firstRecord.FirstName || !firstRecord.Phone) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Required columns missing: FirstName, Phone' });
    }

    const agents = await Agent.find();
    if (agents.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No agents available. Please add agents first.' });
    }

    const totalRecords = records.length;
    const totalAgents = agents.length;
    const recordsPerAgent = Math.floor(totalRecords / totalAgents);
    const remainingRecords = totalRecords % totalAgents;

    let currentIndex = 0;
    const tasks = [];

    for (let i = 0; i < totalAgents; i++) {
      let recordsForThisAgent = recordsPerAgent;
      if (i < remainingRecords) {
        recordsForThisAgent += 1; 
      }

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

    // tasks saving 
    await Task.insertMany(tasks);

    fs.unlinkSync(filePath);

    res.json({ 
      message: 'Tasks distributed successfully',
      totalRecords: totalRecords,
      tasksCreated: tasks.length
    });
  } catch (error) {
    console.log(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error during file processing' });
  }
};

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

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data;
}

exports.getTasksByAgent = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedAgent', 'name email mobile');

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

    const result = Object.values(tasksByAgent);

    res.json({ data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
