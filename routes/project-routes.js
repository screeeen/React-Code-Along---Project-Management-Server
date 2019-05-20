//      routes/project-routes.js
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Task = require('../models/Task');
const Project = require('../models/Project');


// POST '/projects'    => to post a new projects
router.post('/projects', (req, res) => {
  const { title, description } = req.body;
  Project.create({ title, description, task: [] }) //hardcoding task so far, empty array
    .then((response) => {
      res
        .status(201) //Created
        .json(response) //send() but in json. like JSON.stringify(response)
    })
    .catch((err) => {
      res
        .status(500) //shit happens
        .json(err)

    })
})



// GET '/projects'		 => to get all the projects
router.get('/projects', (req, res) => {
  Project.find().populate('tasks')
    .then((allProjects) => {
      res
        .json(allProjects)
    })
    .catch((err) => {
      res
        .status(500)
        .json(err)

    })
})



// GET '/api/projects/:id'		 => to get a specific projects
router.get('/projects/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .json({ message: 'Invalid id' })
  }

  Project.findById(id).populate('tasks')// what is populate for, fetches id/objec from array inside 
    .then((foundProject) => {
      res
        .json(foundProject)
    })
    .catch((err) => {
      res
        .status(500) //shit happens
        .json(err)

    })
})



// PUT '/api/projects/:id' 		=> to update a specific project
router.put('/projects/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .json({ message: 'Invalid id' })
  }

  Project.findByIdAndUpdate(id, req.body)
    .then(() => {
      res.json({ message: `Project Updated` })
    })
    .catch((err) => {
      res
        .status(500)
        .json(err)
    })
})



// DELETE '/api/projects/:id'   => to delete a specific project
router.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .json({ message: 'Invalid id' })
  }

  Project.findByIdAndRemove(id)
    .then(() => {
      res
      .status(202)
      .json({ message: `Project Deleted` })
    })
    .catch((err) => {
      res
        .status(500)
        .json(err)
    })
})


module.exports = router;