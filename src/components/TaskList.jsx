import React, { Component } from "react";
/* icon */
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* css */
import { Form, Button, Modal } from "react-bootstrap";
import "../css/ListComponent.css";
/* axios */
import axios from "axios";
export const ListComponent = (props) => {
  return (
    <div className="ListComponent">
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
      show: false,
    };

    this.getTask = this.getTask.bind(this);
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
    });
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

  onSubmit(e) {
    e.preventDefault();

    const task = {
      description: this.state.description,
    };

    axios
      .post("http://localhost:5000/tasks/update/" + window.testId, task)
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
    return this.state.tasks.map((currentTask) => {
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
                <Form.Label>Description :</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal>
        </div>
        <div className="d-flex justify-content-center ListSection">
          <div className="ListContainer">{this.exerciseList()}</div>
        </div>
      </div>
    );
  }
}
