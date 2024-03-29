const router = require("express").Router();
const Snippet = require("../models/snippetModel");

//index,create,update,remove

const index = async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.json(snippets);
  } catch (err) {
    res.status(500).send();
  }
};

const create = async (req, res) => {
  try {
    const { title, description, code } = req.body;
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
    });

    const savedSnippet = await newSnippet.save();

    res.json(savedSnippet);
  } catch (err) {
    res.status(500).send();
  }
};

const update = async (req, res) => {
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
    existingSnippet.title = title;
    existingSnippet.description = description;
    existingSnippet.code = code;
    const savedSnippet = await existingSnippet.save();
    res.json(savedSnippet);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

const remove = async (req, res) => {
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
    await existingSnippet.delete();
    res.json(existingSnippet);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

module.exports = {
  index,
  update,
  create,
  remove,
};
