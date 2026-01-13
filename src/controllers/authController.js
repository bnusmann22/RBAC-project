const userSchema = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const register = async(req, res) => {
  // Registration logic here
  try{
   const { username,  password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userSchema({
    username,
    password: hashedPassword,
    role
  });

  await newUser.save();

  res.status(201).json({ message: `User registered with username ${username}` });
}catch(err){
  res.status(500).json({ error: 'Something went wrong' });   
}}

const login = async(req, res) => {
    try{
    const { username,  password, } = req.body;
    const user = await userSchema.findOne   ({ username }); 
    if(!user){
        return res.status(400).json({ error: `User with username ${username} not found` });
    } 
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({ error: 'Invalid Credentials ' }); 
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.status(200).json({ token });
    } catch(err){
        res.status(500).json({ error: 'Something went wrong' });   
    }
  // Login logic here
}   

module.exports = {
  register,
  login
};