import React, { Component } from "react";
/* icon */
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* css */
import { Form, Button, Modal } from "react-bootstrap";
import "../css/ListComponent.css";
import "../css/Modal.css";
/* axios */
import axios from "axios";
export const ListComponent = (props) => {
  return (
    <div className="ListComponent">
      {/* <img
        id="image"
        src={`http://localhost:5000/tasks/${props.tasks._id}/img`}
      /> */}
      <div className="text-container">{props.tasks.description}</div>
      <ul>
        <li>
          <a
            href="#"
            onClick={() => {
              props.getTask(props.tasks._id);
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </a>
        </li>
        <li id="delete">
          <a href="#!">
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => {
                props.deleteTask(props.tasks._id);
              }}
            />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      description: "",
      file: null,
      show: false,
    };

    this.getTask = this.getTask.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/tasks/")
      .then((response) => {
        this.setState({
          tasks: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* modal handler */
  handleShow() {
    this.setState({
      show: true,
    })
  }
  handleClose() {
    this.setState({
      show: false,
    });
  }

  /* update handler */
  getTask(id) {
    axios
      .get("http://localhost:5000/tasks/" + id)
      .then((response) => {
        this.setState({
          description: response.data.description,
          file: response.data.file,
        });
      })

      .catch(function (error) {
        console.log(error);
      });

    window.testId = id;

    this.handleShow();
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }
  onChangeFile(e) {
    this.setState({
      file: e.target.files[0],
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", this.state.description);
    formData.append("file", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(
        "http://localhost:5000/tasks/update/" + window.testId,
        formData,
        config
      )
      .then((res) => console.log(res.data));

    window.location = "/";
  }

  /* delete handler */
  deleteTask(id) {
    axios.delete("http://localhost:5000/tasks/" + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      tasks: this.state.tasks.filter((el) => el._id !== id),
    });
  }

  exerciseList() {
    return this.state.tasks.map((currentTask, index) => {
      return (
        <ListComponent
          tasks={currentTask}
          getTask={this.getTask}
          deleteTask={this.deleteTask}
          key={currentTask._id}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Form onSubmit={this.onSubmit}>
              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label className="d-flex justify-content-center label-header-modal">
                  Edit task
                </Form.Label>
                <Form.Control
                  id="input-form-modal"
                  placeholder="Task name"
                  type="text"
                  required
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                />
                <Form.Control
                  id="input-form-modal"
                  placeholder="Task name"
                  type="file"
                  name="file"
                  onChange={this.onChangeFile}
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <button type="submit" className="modal-btn prime">
                  Save
                </button>
                <Button
                  variant="secondary"
                  className="modal-btn secondary"
                  onClick={this.handleClose}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
        <div className="d-flex justify-content-center ListSection">
          <div className="ListContainer">
            <h3>Tasks</h3>
            {this.exerciseList()}
          </div>
        </div>
      </div>
    );
  }
}
