import React, { Component, useState } from "react";
/* icon */
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* css */
import { Form, Button, Modal } from "react-bootstrap";
import "../css/ButtonAdd.css";
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
            <Form.Label>Task :</Form.Label>
            <Form.Control
              type="text"
              required
              value={props.value}
              onChange={props.onChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
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
    };

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      .post("http://localhost:5000/tasks/add", task)
      .then((res) => console.log(res.data));

    window.location = "/";
  }

  render() {
    return (
      <div>
        <AddModal
          onSubmit={this.onSubmit}
          onChange={this.onChangeDescription}
          value={this.state.description}
        />
      </div>
    );
  }
}
