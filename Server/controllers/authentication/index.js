const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../../models/userTable");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Register User

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      contact_number,
      gender,
      dob,
      blood_group,
      address,
      emergency_contact,
      allergies,
      department,
      qualification,
      availability,
    } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      contact_number,
      profile: {
        gender,
        dob,
        blood_group,
        address,
        emergency_contact,
        allergies: allergies || [],
        department: role === "Doctor" ? department : null,
        qualification: role === "Doctor" ? qualification : null,
        availability: role === "Doctor" ? availability : null,
      },
    });

    await newUser.save();

    res.status(200).json({
      message: "Successfully registered",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne(
      { email },
      { email: 1, name: 1, user_id: 1, role: 1, password: 1 }
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({
      message: "Login successful!",
      token,
      user: payload,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };
