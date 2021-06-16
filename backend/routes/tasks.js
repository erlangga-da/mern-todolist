const router = require("express").Router();
let Task = require("../models/task.model");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*  
====versi baru==== 

- benerin bug update
file jadi null ketika update tanpa mengisi form input value

- meningkatkan optimalisasi penyimpanan
ketika delete data, file gambar tidak ikut terhapus sehingga berpotensi terjadi menumpuknya file

*/


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    let ext;
    switch (file.mimetype) {
      case "image/png":
        ext = ".png";
        break;
      case "image/jpeg":
        ext = ".jpg";
        break;
      default:
        break;
    }
    cb(null, "TaskImg - " + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
}).single("file");

/* read all data */

router.route("/").get((req, res) => {
  Task.find()
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

/* create tasks CREATE data */

router.route("/add").post((req, res) => {
  upload(req, res, (err) => {
    const description = req.body.description;
    const file = req.file ? req.file.filename : "";
    const newTask = new Task({
      description,
      file,
    });
    newTask
      .save()
      .then(() => res.json("Task added!"))
      .catch((err) => res.status(400).json("Error : " + err));
  });
});

/*  READ tasks data from collections */

/* filter data by id */

router.route("/:id").get((req, res) => {
  Task.findById(req.params.id)
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id/img").get((req, res, next) => {
  Task.findById(req.params.id)
    .then((tasks) =>
      res.sendFile(process.cwd() + "/images/" + tasks.file, (e) => {
        if (e) {
          next(e);
        }
      })
    )
    .catch((err) => res.status(400).json("Error: " + path.dirname));
});

/* delete  tasks data by id */

router.route("/:id").delete((req, res) => {
  Task.findById(req.params.id)
    .then((tasks) => {
      const path = process.cwd() + "/images/" + tasks.file;
      fs.unlinkSync(path);

      Task.findByIdAndDelete(req.params.id)
        .then(() => res.json("Task deleted"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + path.dirname));
});

/* update tasks data by id */

router.route("/update/:id").post((req, res) => {
  upload(req, res, (err) => {
    const description = req.body.description;
    const file = req.file ? req.file.filename : req.body.file;

    Task.findById(req.params.id)
      .then((tasks) => {
        tasks.description = description;
        tasks.file = file;

        tasks
          .save()
          .then(() => res.json("Task updated!"))
          .catch((err) => res.status(400).json("Error : " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
