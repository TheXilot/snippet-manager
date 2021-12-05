const router = require("express").Router();
const Snippet = require("../models/snippetModel");

//index,create,update,remove
class SnippetController {
  async index(req, res) {
    try {
      console.log(req.user);
      const snippets = await Snippet.find();
      res.json(snippets);
    } catch (err) {
      res.status(500).send();
    }
  }
  async create(req, res) {
    try {
      const { title, description, code } = req.body;
      console.log(req.body);
      console.log(req.user);

      //validation

      if (!description && !code) {
        res.status(400).json({
          errorMessage: "you need to enter at least a description or some code",
        });
      }
      const newSnippet = new Snippet({
        title,
        description,
        code,
        userId: req.user,
      });

      const savedSnippet = await newSnippet.save();

      res.json(savedSnippet);
    } catch (err) {
      res.status(500).send();
    }
  }
  async update(req, res) {
    try {
      const snippetId = req.params.id;
      const { title, description, code } = req.body;
      //validation
      if (!description && !code) {
        res.status(400).json({
          errorMessage: "you need to enter at least a description or some code",
        });
      }
      if (!snippetId)
        return res.status(400).json({ errorMessage: "Id Not Found" });
      const existingSnippet = await Snippet.findById(snippetId);
      if (!existingSnippet)
        return res
          .status(400)
          .json({ errorMessage: "no element in database with this id" });
      if (existingSnippet.userId.toString() !== req.user) {
        return res
          .status(400)
          .json({ errorMessage: "You dont have right to update this element" });
      }
      existingSnippet.title = title;
      existingSnippet.description = description;
      existingSnippet.code = code;
      const savedSnippet = await existingSnippet.save();
      res.json(savedSnippet);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }

  async remove(req, res) {
    try {
      const snippetId = req.params.id;

      //validation
      if (!snippetId)
        return res.status(400).json({ errorMessage: "Id Not Found" });
      const existingSnippet = await Snippet.findById(snippetId);
      if (!existingSnippet)
        return res
          .status(400)
          .json({ errorMessage: "no element in database with this id" });
      if (existingSnippet.userId.toString() !== req.user) {
        return res
          .status(400)
          .json({ errorMessage: "You dont have right to update this element" });
      }
      await existingSnippet.delete();
      res.json(existingSnippet);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
}
module.exports = new SnippetController();
