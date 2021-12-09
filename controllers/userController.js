const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//index,create,update,remove
class userController {
  async create(req, res) {
    try {
      const { email, password, passwordVerify } = req.body;
      console.log(req.body);
      //basic validation
      if (!email || !password || !passwordVerify) {
        res.status(400).json({
          errorMessage: "you need to enter your email and your password",
        });
      }
      if (password.length < 6) {
        res.status(400).json({
          errorMessage: "password need to be at least 6 caractere",
        });
      }
      if (password !== passwordVerify) {
        res.status(400).json({
          errorMessage:
            "password verification need to be the same as the password",
        });
      }
      //verify if is new email
      const existingEmail = await User.findOne({ email: email });
      if (existingEmail) {
        res.status(400).json({
          errorMessage: "this email exist already !",
        });
      }
      //hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      // console.log(passwordHash);
      const newUser = new User({
        email,
        passwordHash,
      });
      const savedUser = await newUser.save();
      // res.send(savedUser);

      //create a JWT Token
      const token = jwt.sign(
        {
          id: savedUser._id,
        },
        process.env.JWT_SECRET
      );
      res
        .cookie("token", token, { httpOnly: true, withCredentials: true })
        .send();
    } catch (err) {
      res.status(500).send();
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      //basic validation
      if (!email || !password) {
        res.status(400).json({
          errorMessage: "you need to enter your email and your password",
        });
      }
      if (password < 6) {
        res.status(400).json({
          errorMessage: "password need to be at least 6 caractere",
        });
      }
      //verification if email exist
      const existingEmail = await User.findOne({ email: email });
      if (!existingEmail) {
        res.status(400).json({
          errorMessage: "You are not able to connect to this app",
        });
      }
      //verify passwordHash
      const isCorrectPassword = await bcrypt.compare(
        password,
        existingEmail.passwordHash
      );
      if (!isCorrectPassword) {
        res.status(400).json({
          errorMessage: "Password : You are not able to connect to this app",
        });
      }
      //create a JWT Token
      const token = jwt.sign(
        {
          id: existingEmail._id,
          email: existingEmail.email,
          picture: null,
        },
        process.env.JWT_SECRET
      );
      res
        .cookie("token", token, { httpOnly: true, withCredentials: true })
        .send(token);
    } catch (err) {
      res.status(500).send();
    }
  }
  async loggedIn(req, res) {
    try {
      //create a JWT Token
      const token = req.cookies.token;
      if (!token)
        return res.status(401).json({ errorMessage: "Unautorized !" });
      const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
      return res.json(validatedUser);
    } catch (err) {
      return res.json(null);
    }
  }
  async logOut(req, res) {
    try {
      res.clearCookie("token").send();
    } catch (err) {
      return res.json(err);
    }
  }
  async update(req, res) {
    try {
      const userId = req.params.id;
      const { email, fullName, experience, competence, picture } = req.body;
      //validation
      //is valid user
      if (!userId)
        return res.status(400).json({ errorMessage: "Id Not Found" });
      //email
      if (!email) {
        res.status(400).json({
          errorMessage: "you need to enter at least a description or some code",
        });
      }
      //fullName
      if (!fullName)
        return res
          .status(400)
          .json({ errorMessage: "you must enter full name" });
      //find user by id
      const existinguser = await user.findById(userId);
      if (!existinguser)
        return res
          .status(400)
          .json({ errorMessage: "no element in database with this id" });
      //verify if email was changed
      if (existinguser.email !== email) {
        const isNotAvalaible = await User.find({ email: email });
        if (isNotAvalaible)
          return res
            .status(400)
            .json({ errorMessage: "Please enter another mail !" });
        existinguser.email = email;
      }
      existinguser.fullName = fullName;
      existinguser.experience = experience;
      existinguser.competence = competence;
      //picture

      const saveduser = await existinguser.save();
      res.json(saveduser);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
  async indexByOne(req, res) {
    console.log(req.params.id);
    try {
      const userId = req.params.id;
      if (!userId)
        return res.status(400).json({ errorMessage: "Id Not Found" });
      const existinguser = await User.findById(userId).select("-passwordHash");
      if (!existinguser)
        return res
          .status(400)
          .json({ errorMessage: "no element in database with this id" });
      console.log(existinguser);
      res.json(existinguser);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
  // async remove(req, res) {
  //   try {
  //     const userId = req.params.id;

  //     //validation
  //     if (!userId)
  //       return res.status(400).json({ errorMessage: "Id Not Found" });
  //     const existinguser = await user.findById(userId);
  //     if (!existinguser)
  //       return res
  //         .status(400)
  //         .json({ errorMessage: "no element in database with this id" });
  //     await existinguser.delete();
  //     res.json(existinguser);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send();
  //   }
  // }
}
module.exports = new userController();
