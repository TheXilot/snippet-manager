const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uploadFile = require("../middleware/upload");

//index,create,update,remove
class userController {
  async create(req, res) {
    await uploadFile(req, res);
    console.log(req.file);
    let picture = undefined;
    try {
      const {
        fullName,
        experience,
        competence,
        education,
        location,
        email,
        password,
        passwordVerify,
      } = req.body;
      console.log(req.body);
      //basic validation
      if (!email || !password || !passwordVerify) {
        res.status(400).json({
          errorMessage: "you need to enter your email and your password",
        });
      }
      if (!fullName) {
        res.status(400).json({
          errorMessage: "you need to enter your Name",
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
      if (req.file) picture = req.file.path;
      const newUser = new User({
        fullName,
        experience,
        competence,
        education,
        location,
        picture,
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
      res.status(200).json("ok");
      // .cookie("token", token, { httpOnly: true, withCredentials: true })
    } catch (err) {
      res.status(500).json({ errorMessage: err.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      //basic validation
      if (!email || !password) {
        res.status(400).json({
          errorMessage: "vous devez saisir votre Email",
        });
      }
      if (password < 6) {
        res.status(400).json({
          errorMessage: "Le mot de passe doit être superieur a 6 caractere",
        });
      }
      //verification if email exist
      const existingEmail = await User.findOne({ email: email });
      if (!existingEmail) {
        res.status(400).json({
          errorMessage: "Verifiez votre Email ou mot de passe !",
        });
      }
      //verify passwordHash
      const isCorrectPassword = await bcrypt.compare(
        password,
        existingEmail.passwordHash
      );
      if (!isCorrectPassword) {
        res.status(400).json({
          errorMessage: "Verifiez votre Email ou mot de passe !",
        });
      }
      //create a JWT Token
      const token = jwt.sign(
        {
          _id: existingEmail._id,
          fullName: existingEmail.fullName,
          experience: existingEmail.experience,
          competence: existingEmail.competence,
          education: existingEmail.education,
          location: existingEmail.location,
          email: existingEmail.email,
          picture: existingEmail.picture,
        },
        process.env.JWT_SECRET
      );
      const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
      console.log(validatedUser);
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
      // console.log(validatedUser);
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
      await uploadFile(req, res);
      console.log(req.file);
      // if (req.file == undefined) {
      //   return res.status(400).send({ message: "Please upload a file!" });
      // }
      const userId = req.params.id;
      const {
        email,
        fullName,
        experience,
        competence,
        education,
        location,
        picture,
      } = req.body;
      //validation
      //is valid user
      if (!userId)
        return res.status(400).json({ errorMessage: "Id Not Found" });
      //email
      if (!email) {
        res.status(400).json({
          errorMessage: "Vous devez saisir votre Email",
        });
      }
      //fullName
      if (!fullName)
        return res
          .status(400)
          .json({ errorMessage: "Vous devez saisir votre Nom Complet" });
      //find user by id
      const existinguser = await User.findById(userId).select("-passwordHash");
      if (!existinguser)
        return res
          .status(400)
          .json({ errorMessage: "Utilisateur inexistant!" });
      //verify if email was changed
      if (existinguser.email !== email) {
        const isNotAvalaible = await User.find({ email: email });
        if (isNotAvalaible)
          return res
            .status(400)
            .json({ errorMessage: "Cet email est déja existant !" });
        existinguser.email = email;
      }
      existinguser.fullName = fullName;
      existinguser.experience = experience;
      existinguser.competence = competence;
      existinguser.location = location;
      existinguser.education = education;
      if (req.file) existinguser.picture = req.file.path;

      //picture

      const saveduser = await existinguser.save();
      //generate new token
      const token = jwt.sign(
        {
          _id: saveduser._id,
          fullName: saveduser.fullName,
          experience: saveduser.experience,
          competence: saveduser.competence,
          education: saveduser.education,
          location: saveduser.location,
          email: saveduser.email,
          picture: saveduser.picture,
        },
        process.env.JWT_SECRET
      );
      // saveduser.id = saveduser._id.value;
      // saveduser.id = saveduser._id;
      // console.log("saveduser : ", saveduser);
      res
        .cookie("token", token, { httpOnly: true, withCredentials: true })
        .json({ saveduser, token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ errorMessage: err.message });
      // res.status(500).send();
    }
  }
  async indexByOne(req, res) {
    console.log(req.params.id);
    try {
      const userId = req.params.id;
      if (!userId)
        return res.status(400).json({ errorMessage: "Id introuvable" });
      const existinguser = await User.findById(userId).select("-passwordHash");
      if (!existinguser)
        return res
          .status(400)
          .json({ errorMessage: "Aucun utilisateur avec ce identifiant" });
      console.log(existinguser);
      res.json(existinguser);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
  async index(req, res) {
    try {
      const columns = [
        "email",
        "fullName",
        "experience",
        "competence",
        "education",
        "location",
        "picture",
      ];
      const users = await User.find().select(
        "email fullName experience competence education location picture"
      );
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({ errorMessage: err });
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
