import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import Navbar from 'react-bootstrap/Navbar'

export default class CNavbar extends Component{
  constructor(props){
    super(props);
    this.state = {
      logged_in: false
    }
  }

  handleLogout = () => {
    this.setState({
      logged_in: false
    })
    localStorage.removeItem("user_token");
    this.props.history.push('/login')
  }

  checkTokenMethod = () => {
    let url = process.env.REACT_APP_BACKEND_BASE_URL + "/users/check_token"
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
      if (result.status !== 100){
        let path_name = ""
        path_name = this.props.location.pathname
        if ((path_name === "/sign_up") || (path_name === "/login") ){
          this.props.history.push(this.props.location.pathname)
        }
        else {
          this.props.history.push('/login')
        }
      }else {
        this.props.history.push('/')
        this.setState({
          logged_in: true
        });

      }
    })
  }

  componentDidMount () {
    this.checkTokenMethod()
  }

  login_log_out_div = () => {
    if (localStorage.getItem("user_token")){
      return(
        <>
          <Link to='#' className="red-btn login-btn" onClick={this.handleLogout}>Logout</Link>
        </>
      )
    }else {
      return(
        <> <Link to='/login' className="red-btn login-btn">Login</Link>&nbsp; <Link to="/sign_up" className="red-btn register-btn">Register</Link>
        </>
      )
    }
  }


  render(){
    return(
      <>

      <Navbar>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          { this.login_log_out_div() }
          <br/>
          <br/>
          <br/>

        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
    <Link to='/comments' className="red-btn login-btn">view comments here</Link>
  </>
    )
  }
}
