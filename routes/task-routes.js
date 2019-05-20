const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Task = require('../models/Task');
const Project = require('../models/Project');


//      routes/task-routes.js




// GET '/api/projects/:projectId/tasks/:taskId'   => to retrieve a specific task
router.get('/projects/:projectId/tasks/:taskId', (req, res) => {

  Task.findById(req.params.taskId)
    .then((foundTask) => {
      res
        .json(foundTask);
    })
    .catch((err) => {
      res
        .status(500)
        .json(err)
    })
})

// POST '/api/tasks' => to create a new task
router.post('/tasks', (req, res) => {
  const { title, description, projectID } = req.body

  Task.create({ title, description, projectID })// if key and value have same name you can write it once
    .then((newTask) => {
      Project.findByIdAndUpdate(projectID, { $push: { tasks: newTask._id } })
        .then((response) => {
          res
            .status(201)
            .json(response)
        })
        .catch((err) => {
          res
            .status(500)
            .json(err)
        })
    })
    .catch((err) => {
      res
        .status(500)
        .json(err)
    })
})



// PUT '/api/tasks/:id'    => to update a specific task
router.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .json({ message: 'Invalid id' })
  }


  Task.findByIdAndUpdate(id, { title, description })
    .then(() => {
      res
        .status(201)
        .json({ message: 'Task Update' }) // better doing send to shut connection
    })
    .catch((err) => {
      res
        .status(500)
        // .json( {err})
        .send() // just send the status. they dont care
    })
})



// DELETE '/api/tasks/:id'     => to delete a specific task
router.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .json({ message: 'Invalid id' })
  }


  Task.findByIdAndRemove(id)
    .then(() => {
      res
        .status(201)
        .json({ message: 'Task Delete' }) // better doing send to shut connection  
    })
    .catch((err) => {
      res
        .status(500)
        // .json( {err})
        .send() // just send the status. they dont care
    })
})



module.exports = router;