import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'
const initial_state = {
  error: "",
  message: "",
  comments: [],
  new_comment: {
    title: "",
    description: "",
  },
  new_comment_modal: false,
  edit_comment_modal: false,
}


export default class Index extends Component{
  _isMounted = false
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleClose = () => {
    this.setState({
      new_comment_modal: false,
      edit_comment_modal: false,
    })
  }
	constructor(props){
    super(props);
    this.state = initial_state;
  }
  componentDidMount () {
    this._isMounted = true;
    this.getCommentsList()
  }

  getCommentsList = () => {
    let url = process.env.REACT_APP_BACKEND_BASE_URL + "/comments"
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("user_token"),
        "Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": "*",
				"Access-Control-Expose-Headers": "*",
				"Access-Control-Max-Age": "*",
				"Access-Control-Allow-Methods": "*",
				"Access-Control-Allow-Headers": "*"
      }
    }).then(res => res.json())
    .then((result) => {
      if (this._isMounted){
        if (result.status === 200){
          this.setState({
            isLoaded: true,
            comments: result.comments,
          });
        }else if (result.status === 401) {
          localStorage.removeItem("user_token");
          window.location.href = "/login"
        }else {
          this.setState({
            variant: "danger",
            message: result.message
          });
          this.clearMessageTimeout = setTimeout(() => {
            this.setState(() => ({message: ""}))
          }, 2000);
        }
      }
    })
  }
  createComment = () => {
    let url = process.env.REACT_APP_BACKEND_BASE_URL + "/comments"
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("user_token"),
        "Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": "*",
				"Access-Control-Expose-Headers": "*",
				"Access-Control-Max-Age": "*",
				"Access-Control-Allow-Methods": "*",
				"Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({comment: this.state.new_comment}),

    }).then(res => res.json())
    .then((result) => {
      if (this._isMounted){
        this.setState({
          new_comment_modal: false,
        })
        this.getCommentsList()
      }
    })
  }

  deleteComment = (id) => {
    console.log(id);
    let url = process.env.REACT_APP_BACKEND_BASE_URL + "/comments/" + id
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("user_token"),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "*",
        "Access-Control-Expose-Headers": "*",
        "Access-Control-Max-Age": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*"
      }
    }).then(res => res.json())
    .then((result) => {
      if (this._isMounted){
        this.getCommentsList()
      }
    })
  }

  editComment = (id) => {
    let url = process.env.REACT_APP_BACKEND_BASE_URL + "/comments/" + id
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("user_token"),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "*",
        "Access-Control-Expose-Headers": "*",
        "Access-Control-Max-Age": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({comment: this.state.new_comment}),
    }).then(res => res.json())
    .then((result) => {
      if (this._isMounted){
        this.setState({
          edit_comment_modal: false,
        })
        this.getCommentsList()
      }
    })
  }

  openEditModal = (comment) => {
    this.setState({
      new_comment: comment,
    }, function () {
      this.setState({
        edit_comment_modal: true,
      })
    })

  }
  openNewModal = () => {
    this.setState({
      new_comment_modal: true,
    })
  }
  updateComment = (event) => {
    const{ name, value } = event.target;
    this.setState({
      new_comment: {
      ...this.state.new_comment,
      [name]: value
      }
    });
	}

	render() {
    const comments_list = this.state.comments.map((comment) => {
      return (
        <tr>
          <td>{comment.title}</td>
          <td>{comment.description}</td>
          <td>{comment.author}</td>
          <td><Link to="#" onClick={(e) => this.deleteComment(comment.id)}>DELETE</Link></td>
          <td><Link to="#" onClick={(e) => this.openEditModal(comment)}>EDIT</Link></td>
        </tr>
      )
    })
    return (
      <div>
        <Link to="#" onClick={this.openNewModal}>create</Link>
        <table class="center">
          <tr>
            <th>title</th>
            <th>Description</th>
            <th>author</th>
            <th>action</th>
            <th>action</th>
          </tr>
          {comments_list}
        </table>
        <Modal show={this.state.new_comment_modal} onHide={this.handleClose} backdrop={true}>
          <Modal.Header closeButton>
            <Modal.Title>New comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input name="title" value={this.state.new_comment.title} onChange={this.updateComment}/>
            <input name="description" value={this.state.new_comment.description} onChange={this.updateComment}/>
            <button value="submit" onClick={this.createComment}/>


          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
        <Modal show={this.state.edit_comment_modal} onHide={this.handleClose} backdrop={true}>
          <Modal.Header closeButton>
            <Modal.Title>Edit comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input name="title" value={this.state.new_comment.title} onChange={this.updateComment}/>
            <input name="description" value={this.state.new_comment.description} onChange={this.updateComment}/>
            <button value="submit" onClick={this.editComment}/>


          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </div>
    )
  }

}
