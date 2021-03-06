import React, { Component, useState } from "react";
/* icon */
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* css */
import { Form, Button, Modal } from "react-bootstrap";
import "../css/ButtonAdd.css";
import "../css/Modal.css";
/* axios */
import axios from "axios";

export const AddModal = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <button
        className="ButtonAdd d-flex justify-content-center"
        onClick={handleShow}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={props.onSubmit}>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label className="d-flex justify-content-center label-header-modal">
              Create new task
            </Form.Label>
            <Form.Control
              id="input-form-modal"
              placeholder="Task name"
              type="text"
              required
              value={props.value}
              onChange={props.onChange}
            />
            <Form.Control
              id="input-form-modal"
              placeholder="Task name"
              style={{marginTop : '10' + 'px'}}
              type="file"
              name="file"
              required
              onChange={props.onChangeFile}
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <button type="submit" className="modal-btn prime">
              Add Task
            </button>
            <Button
              variant="secondary"
              className="modal-btn secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      file: "",
    };
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      .post("http://localhost:5000/tasks/add", formData, config)
      .then((res) => console.log(res.data));

    window.location.href = "/";
  }

  render() {
    return (
      <div>
        <AddModal
          onSubmit={this.onSubmit}
          onChange={this.onChangeDescription}
          value={this.state.description}
          onChangeFile={this.onChangeFile}
        />
      </div>
    );
  }
}
