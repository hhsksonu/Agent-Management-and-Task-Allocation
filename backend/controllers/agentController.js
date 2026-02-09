const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');

//add agent
exports.addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = new Agent({
      name,
      email,
      mobile,
      password: hashedPassword
    });

    await agent.save();
    res.status(201).json({ 
      message: 'Agent added successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json({ agents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
