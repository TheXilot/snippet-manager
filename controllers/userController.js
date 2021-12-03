const router = require("express").Router();
const User = require("../models/userModel");

//index,create,update,remove
class userController {
  // async index(req, res) {
  //   try {
  //     const users = await user.find();
  //     res.json(users);
  //   } catch (err) {
  //     res.status(500).send();
  //   }
  // }

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
      if (password < 6) {
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
    } catch (err) {
      res.status(500).send();
    }
  }
  // async update(req, res) {
  //   try {
  //     const userId = req.params.id;
  //     const { title, description, code } = req.body;
  //     //validation
  //     if (!description && !code) {
  //       res.status(400).json({
  //         errorMessage: "you need to enter at least a description or some code",
  //       });
  //     }
  //     if (!userId)
  //       return res.status(400).json({ errorMessage: "Id Not Found" });
  //     const existinguser = await user.findById(userId);
  //     if (!existinguser)
  //       return res
  //         .status(400)
  //         .json({ errorMessage: "no element in database with this id" });
  //     existinguser.title = title;
  //     existinguser.description = description;
  //     existinguser.code = code;
  //     const saveduser = await existinguser.save();
  //     res.json(saveduser);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send();
  //   }
  // }

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
