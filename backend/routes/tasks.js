const router = require("express").Router();
let Task = require("../models/task.model");

/* read all data */

router.route("/").get((req, res) => {
    Task.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).json("Error: " + err));
});

/* create tasks CREATE data */

router.route("/add").post((req, res) => {
  const description = req.body.description;

  const newTask = new Task({
    description,
  });

  newTask
    .save()
    .then(() => res.json("Task added!"))
    .catch((err) => res.status(400).json("Error : " + err));
});

/*  READ tasks data from collections */

/* filter data by id */

router.route("/:id").get((req, res) => {
    Task.findById(req.params.id)
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).json("Error: " + err));
});

/* delete  tasks data by id */

router.route("/:id").delete((req, res) => {
    Task.findByIdAndDelete(req.params.id)
    .then(() => res.json("Task deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

/* update tasks data by id */

router.route("/update/:id").post((req, res) => {
    Task.findById(req.params.id)
    .then((tasks) => {
        tasks.description = req.body.description;

        tasks
        .save()
        .then(() => res.json("Task updated!"))
        .catch((err) => res.status(400).json("Error : " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
