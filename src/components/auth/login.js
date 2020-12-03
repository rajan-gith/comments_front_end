import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const initial_state = {
  error: "",
  message: "",
  user: {
    email: "",
    password: ""
  },
}
export default class Login extends Component{
	constructor(props){
    super(props);
    this.state = initial_state;
  }

  componentDidMount () {
    if (localStorage.getItem("user_token")){
			this.props.history.push('/')
		}
  }
  submitForm = () => {
    let url = process.env.REACT_APP_BACKEND_BASE_URL + "/users/sign_in"
  	fetch(url ,{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": "*",
				"Access-Control-Expose-Headers": "*",
				"Access-Control-Max-Age": "*",
				"Access-Control-Allow-Methods": "*",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({user: this.state.user}),
		}).then(res => res.json())
    .then((result) => {
      if (result.status === 202) {
        this.setState({
          logged_in: true,
          variant: "success"
        });
        this.clearMessageTimeout = setTimeout(() => {
          this.setState(() => ({message: ""}))
        }, 2000);
        localStorage.setItem("user_token", result.user.token);
        // window.location.href = "/"
        if (result.user.is_admin === true){
          this.props.history.push('/admin')
        }else {
          this.props.history.push('/user')
        }
      }else {
        this.setState({
          message: result.message,
          variant: "danger"
        });
        this.clearMessageTimeout = setTimeout(() => {
          this.setState(() => ({message: ""}))
        }, 2000);
      }
		}, (error) => {
      this.props.history.push('/login')
		});
  }
  componentWillUnmount() {
    clearTimeout(this.clearMessageTimeout);
  }
  submitHandler = (event) => {
    event.preventDefault();
    let formIsValid = this.checkFormValidation()
    if (formIsValid){
      this.submitForm()
    }
  }
  checkFormValidation = () => {
    let user_email_error = "";
    let user_password_error = "";
    if (this.state.user.email === ""){
      user_email_error = "Email can't be blank!"
    }else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(this.state.user.email)))
    {
      user_email_error = "Invalid email!"
    }
    if (this.state.user.password === ""){
      user_password_error = "Password can't be blank!"
    }else if (this.state.user.password.length < 6) {
      user_password_error = "Password length cannot be less than 6!"
    }
    this.setState({
      user_email_error,
      user_password_error,
    },function () {
      if (user_email_error !== "" || user_password_error !== "" ){
        return false;
      }else {
        return true;
      }
    });

    if (user_email_error !== "" || user_password_error !== ""){
      this.setState({
        user_email_error,
        user_password_error,
      });
      return false;
    }else {
      return true;
    }
  }
  updateUser = (event) => {
    const{ name, value } = event.target;
    this.setState({
      user: {
      ...this.state.user,
      [name]: value
      }
    },
    function () {
      this.customCheckFormValidation(name);
    });
	}
  customCheckFormValidation = (name) => {
    let user_email_error = "";
    let user_password_error = "";
    if (name === "email") {
      if (this.state.user.email === ""){
        user_email_error = "Email can't be blank!"
      }else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(this.state.user.email)))
      {
        user_email_error = "Invalid email!"
      }
      this.setState({
        user_email_error
      });
    }else if (name === "password") {
      if (this.state.user.password === ""){
        user_password_error = "Password can't be blank!"
      }
      this.setState({
        user_password_error
      });
    }
  }

  addErrorMessage = (msg) => {
    if (msg === ""){
      return ;
    }else{
      return (<span className="error-class"> {msg} </span>);
    }
  }
	render() {
		return (
      <div>
                {
                  this.state.message ? <Alert variant={this.state.variant}>{this.state.message}</Alert> : null
                }
                <form onSubmit = {this.submitHandler}>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onChange={this.updateUser} autoComplete="false" className="form-control"/>
                    {this.addErrorMessage(this.state.user_email_error)}
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={this.updateUser} autoComplete="false" className="form-control"/>
                    {this.addErrorMessage(this.state.user_password_error)}
                  </div>
                  <div className="form-group mb-0">
                    <button className="red-btn submit-btn" type="submit">Login</button>
                  </div>
                </form>

                <div className="already-user">
                  Not a member?
                  <Link to="/sign_up" title="Login Now">Get Stated for FREE</Link>
                </div>
      </div>

		);
	}
}
