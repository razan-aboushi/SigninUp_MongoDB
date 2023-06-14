const User = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const secretKey = "12345";

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance with hashed password
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      age: age,
      gender: gender,
    });

    // Save the new user to the database
    const savedUser = await user.save();

    // Generate a JSON Web Token (JWT) for user authentication
    const token = jwt.sign({ userId: savedUser._id }, secretKey, {
      expiresIn: "1h",
    });

    // Update the user's token in the database
    savedUser.token = token;
    await savedUser.save();

    // Send the saved user data in the response
    res.status(201).json(savedUser);
  } catch (error) {
    // Handle any errors that occurred during the registration process
    res.status(400).json({ error: error.message });
  }
};

// Controller function for user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a new JWT for user authentication
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    // Update the user's token in the database
    user.token = token;
    await user.save();

    // Send the user data in the response
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occurred during the login process
    res.status(400).json({ error: error.message });
  }
};

// Controller function to get all users
const allUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors that occurred while retrieving users
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the controller functions
module.exports = {
  createUser,
  login,
  allUsers,
};