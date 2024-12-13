import {generateToken }  from "../../lib/utils.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res
        .status(500)
        .json({ message: "Todos Los campos son requeridos" });
    }
    if (password.lenght < 6) {
      return res
        .status(500)
        .json({ message: "Contraseña debe tener minimo 6 caracteres" });
    }
    const user = await user.findOne({ email });
    if (user) return res.starus(400).json({ message: "Email ya en uso " });
    // Hashing 12312 => jduawhdiawiodaui (este sera convertido)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
        // Generando jwt token y guarda al usuario
    if (newUser) {
        generateToken(newUser._id, res);
        await newUser.save();
  
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = (req, res) => {
  res.send("login route");
};
export const logout = (req, res) => {
  res.send("logout route");
};
