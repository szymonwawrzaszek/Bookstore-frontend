import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

class Login extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      status: 200
    }
  }  

 getEmail = (event: any) => {
  this.setState({
    ...this.state,
    email: event.target.value
  })
 }

 getPassword = (event: any) => {
  this.setState({
    ...this.state,
    password: event.target.value
  })
 }

  sendLogin = async (event: any) => {
    try {
      const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    const resData = await res.json();  
    if(res.status < 200 || res.status > 299) {
      this.setState({
        ...this.state,
      errorMessage: resData.message,
      status: res.status
      })
    } else {
      this.setState({
        ...this.state,
      errorMessage: "",
      status: res.status
      })
      //logged in
      localStorage.setItem('token', resData.token);
      localStorage.setItem('userId', resData.userId);
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(
        new Date().getTime() + remainingMilliseconds
      );
      localStorage.setItem('expirationDate', expiryDate.toISOString()); 
      this.props.setAutoLogout(remainingMilliseconds); 
      this.props.onLogIn();
    }
    } catch (err) {
      console.log(err)
      this.setState({
        ...this.state,
      errorMessage: "Not Connected! Try agin later.",
      status: 503
      })
    }
  }
 
  render() {
    const classes = this.props.classes;
  
    return (  
        <Grid item xs={12} className={classes.padding}>
            {this.state.status < 200 || this.state.status > 299 ? 
              <Typography gutterBottom variant="h5" component="h2" color="error" className={classes.error}>
                {this.state.errorMessage}
              </Typography>
            : null}
            <form className={classes.inputContainer}>
                <TextField id="loginEmail" label="Email" variant="outlined" type="email" className={classes.input} onBlur={this.getEmail} />
                <TextField id="loginPassword" label="Password" variant="outlined" type="password" className={classes.input} onBlur={this.getPassword}/>
                <Button onClick={this.sendLogin} variant="contained" color="primary" className={classes.submit}>Log In</Button>
            </form>
        </Grid>   
    );
  
  }
}

const styles = (theme : Theme) => ({
  padding: {
    padding: "10px"
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
  },
  error: {
    textAlign: "center" as "center",
    width : "inherit",
    padding : "10px"
  }
});

export default withStyles(styles)(Login);