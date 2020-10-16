import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import Login from './auth/login';
import Signin from './auth/signin';
import Books from './book/main';
import Authors from './author/main';
import Publishers from './publisher/main';
import Admin from './admin/main';
import Error from './error';

const theme = createMuiTheme({
  overrides: {
    MuiTab: {
      "root": {
        "&$selected": {
          "backgroundColor": "#e9f1f5"
        }
      }
    }
  }
});



class Main extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
      selectedLink: 0,
      isAuth: false,
      token: "",
      userId: ""
    }
  }  

  componentDidMount() {
    this.setLinkUnderscore()

    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    if (new Date(expirationDate) <= new Date()) {
      this.logOut();
      return;
    }
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds =
      new Date(expirationDate).getTime() - new Date().getTime();
    this.setState({ 
      isAuth: true, 
      token: token, 
      userId: userId,
    });
    this.setAutoLogout(remainingMilliseconds); 
  }

  componentDidUpdate() {
    if( localStorage.getItem('token') && localStorage.getItem('userId') && (this.state.token === '' || this.state.userId === '')) {
      this.setState({
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId')
       })
    }
  }

  setLinkUnderscore = () => {
    let path = window.location.pathname
    let num  = 0;
    switch (path) {
      case '/books':
        num = 0
        break;
      case '/authors':
        num = 1
        break;
      case '/publishers':
        num = 2
        break;
      case '/admin':
        num = 3
        break;
      case '/login':
        num = 5
        break;
      case '/signin':
        num = 6
        break;
      case '/':
          num = 0
          break;
      case '':  
        num = 0
        break;  
      default:
        break;
    }
    this.setState({ 
      selectedLink: num
    });
    //console.log(window.location.href, window.location)
    //console.log(path)
  }

  selectMenuItem = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ selectedLink: newValue})
  };

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');

    this.setState({ 
      isAuth: false, 
      token: '',
      userId:'',
      selectedLink: 5
    });

    //console.log(window.location.host + "/login")
    //window.open(window.location.host + "/login", '_self'); 
    const button = document.getElementById("login");
    if(button) {
      button.click();
    }
  }

  setAutoLogout = (milliseconds: number) => {
    setTimeout(() => {
      this.logOut();
    }, milliseconds);
  };

  logIn = () => {
    this.setState({
      selectedLink: 0,
      isAuth: true,
      userId: localStorage.getItem('userId')
    })
    const button = document.getElementById("books");
    if(button) {
      button.click();
    }
  }

  signIn = () => {
    this.setState({ selectedLink: 3 })
    const button = document.getElementById("login");
    if(button) {
      button.click();
    }
  }
  // selectedComponent = () => {
  //   switch (this.state.selectedLink) {
  //     case 0:
  //         return (
  //           <Books></Books>
  //         )
  //       break;
  //     case 1:
        
  //       break;
  //     case 2:
        
  //       break;
  //     case 3:
  //       return (
  //         <Login></Login>
  //       )
  //       break;
  //     case 4:
  //       return (
  //         <Signin></Signin>
  //       )
  //       break;
  //     default:
  //       break;
  //   }
  // }
  
  render() {
    const classes = this.props.classes;
    
    return (
      <Grid container className={classes.container}>
        <Paper elevation={3} className={classes.paper} >
          <Grid item xs={12} className={classes.padding}>
             <MuiThemeProvider theme={theme}>
              <Router>
                <Tabs 
                    value={this.state.selectedLink}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.selectMenuItem}
                    //centered={true}    
                >
                  <Tab label="All books" component={Link} id="books" to="/books" />
                  <Tab label="All authors" component={Link} to="/authors" style={{display: this.state.isAuth ? "inherit" : "none" }}/>
                  <Tab label="All publishers" component={Link} to="/publishers" style={{display: this.state.isAuth ? "inherit" : "none"}}/> 
                  <Tab label="Admin panel" component={Link} to="/admin" style={{color: "red", display: this.state.isAuth && this.state.userId.includes("-") ? "inline-flex" : "none" }}/>
                  <Tab label="Logout" component={Link} to="/login" onClick={this.logOut} style={{display: this.state.isAuth ? "inline-flex" : "none" }}/>
                  <Tab label="Login" component={Link} id="login" to="/login" style={{display: this.state.isAuth ? "none" : "inline-flex" }}/>
                  <Tab label="Register" component={Link} to="/signin" style={{display: this.state.isAuth ? "none" : "inline-flex" }}/>
                </Tabs>
                <Switch>
                  <Route path="/books" exact component={(props: any) => <Books {...props} token={this.state.token} userId={this.state.userId} onLogIn={this.signIn}/>} >
                    {/* <Books token={this.state.token} userId={this.state.userId} onLogIn={this.signIn}/> */}
                  </Route>
                  {this.state.isAuth ?
                    <Route path="/authors" exact>
                      <Authors token={this.state.token} userId={this.state.userId} />
                    </Route> : null}
                  {this.state.isAuth ?
                    <Route path="/publishers"exact>
                      <Publishers token={this.state.token} userId={this.state.userId} />
                    </Route> : null}
                  <Route path="/admin" exact>
                    <Admin token={this.state.token} userId={this.state.userId} onLogIn={this.signIn}/>
                  </Route>
                  <Route path="/login" exact>
                    <Login onLogIn={this.logIn} setAutoLogout={this.setAutoLogout}/>
                  </Route>
                  <Route path="/signin" exact>
                    <Signin onSignIn={this.signIn}/>
                  </Route>
                  <Route path="/" exact>
                    <Books token={this.state.token} userId={this.state.userId} onLogIn={this.signIn}/> 
                  </Route>
                  <Route path="/">
                    <Error token={this.state.token} userId={this.state.userId} onLogIn={this.signIn}/>
                  </Route>
                </Switch>
              </Router>  
            </MuiThemeProvider>   
          </Grid>
          {/* {this.selectedComponent()} */}
        </Paper>
      </Grid> 
    );
  
  }
}

const styles = (theme : Theme) => ({
  container: {
   minWidth: "60%",
   maxWidth: "60%",
   width: "fit-content",
   margin: "auto",
   padding: "20px"
  },
  paper: {
    width: "100%"
  },
  padding: {
    padding: "15px"
  },
  typography: {
    display: "flex",
    justifyContent: "space-around"
  },
  selected: {
    backgroundColor: "#e9f1f5"
  },
  inputContainer: {
    paddingTop: "40px"
  },
  input: {
    display: "flex",
    width: "50%",
    margin: "auto",
    marginBottom: "40px"
  },
  submit: {
    display: "flex",
    width: "50%",
    margin: "auto",
    padding: "14px",
    marginBottom: "40px"
  }
});

export default withStyles(styles)(Main);