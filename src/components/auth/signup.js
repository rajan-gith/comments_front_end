import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const initial_state = {
  error: "",
  message: "",
  user: {
    email: "",
    password: "",
  }
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
    let url = process.env.REACT_APP_BACKEND_BASE_URL + "/users"
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
      if (result.status === 201) {
        this.setState({message: ""})
        this.props.history.push('/')
      }else {
        this.setState({message: result.message,
        variant: "danger"});
      }
      this.clearMessageTimeout = setTimeout(() => {
        this.setState(() => ({message: ""}))
      }, 2000);
		}, (error) => {
      this.props.history.push('/sign_up')
		});
  }
  submitHandler = (event) => {
		event.preventDefault();
    this.submitForm()
  }
  componentWillUnmount() {
    clearTimeout(this.clearMessageTimeout);
  }


  updateUser = (event) => {
    const{ name, value } = event.target;
    this.setState({
      user: {
      ...this.state.user,
      [name]: value
      }
    }, function () {
    });
	}


	render() {
		return (
      <div className="container custom_container px-0">
            <form onSubmit = {this.submitHandler}>
              <div className="signup-code row mx-0">
                <div className="col-md-6 mt-2">
                  <label className="">Email</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                    </div>
                    <input type="email" className="form-control" name="email" onChange={this.updateUser} autoComplete="off" />
                  </div>
                </div>

                <div className="col-md-6 mt-2">
                  <label className="">Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                    </div>
                    <input type="password" className="form-control" name="password" onChange={this.updateUser} autoComplete="false" />
                  </div>
                </div>
                <div className="col-md-12 mt-3 text-center">
                  <button className="red-btn submit-btn my-0 mx-auto" type="submit" data-toggle="modal" data-target="#verfiyModal">Sign Up</button>
                  <div className="already-user">
                    <span>Already registered? </span>
                    <Link to="/login" href="login.html" title="Login Now">Login Now</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
    );
	}
}
