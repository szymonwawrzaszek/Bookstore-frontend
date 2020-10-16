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


class Signin extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
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

   getConfirmPassword = (event: any) => {
    this.setState({
      ...this.state,
      confirmPassword: event.target.value
    })
   }

   sendSignin = async (event: any) => {
    try {
      const res = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
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
      this.setState({...this.state,
      errorMessage: "",
      status: res.status
      })
      //dodano nowe konto
      this.props.onSignIn();
    }
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const classes = this.props.classes;

    return (
        <Grid item xs={12} className={classes.padding}>  
            {this.state.status < 200 || this.state.status > 299 ? 
              <Typography gutterBottom variant="h5" component="h2" color="error" style={{textAlign: "center"}}>
                {this.state.errorMessage}
              </Typography>
            : null}
            <form className={classes.inputContainer}>
                <TextField id="signinEmail" label="Email" variant="outlined" type="email" className={classes.input} onBlur={this.getEmail}/>
                <TextField id="signinPassword" label="Password" variant="outlined" type="password" className={classes.input} onBlur={this.getPassword}/>
                <TextField id="signinConfirmPassword" label="Confirm password" variant="outlined" type="password" className={classes.input} onBlur={this.getConfirmPassword}/>
                <Button onClick={this.sendSignin} variant="contained" color="primary" className={classes.submit}>Sign Up</Button>
            </form>
        </Grid>   
    );
  
  }
}

const styles = (theme : Theme) => ({
  container: {
   minWidth: "50%",
   width: "fit-content",
   margin: "auto",
   padding: "20px"
  },
  paper: {
    width: "100%"
  },
  padding: {
    padding: "10px"
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

export default withStyles(styles)(Signin);