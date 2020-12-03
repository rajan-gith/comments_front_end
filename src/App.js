import logo from './logo.svg';
import Login from './components/auth/login.js'
import SignUp from './components/auth/signup.js'
import CNavbar from './components/auth/cnavbar.js'
import Index from './components/comment/index.js'

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div >
        <BrowserRouter>
          <Route path='/' component = {CNavbar}/>
          <div className="App">
            
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/comments" component={Index} />
              <Route path="/sign_up" component={SignUp} />
            </Switch>
          </div>
          {/* <Route path='/' component = {Footer}/> */}
        </BrowserRouter>
    </div>
  );
}

export default App;
