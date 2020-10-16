import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


class NewAuthor extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        firstName: "",
        lastName: "",
        errorMessage: "",
        status: 200
    }
   
  }  

  getFirstName = (event: any) => {
    this.setState({
      ...this.state,
      firstName: event.target.value
    })
   }
  
   getLastName = (event: any) => {
    this.setState({
      ...this.state,
      lastName: event.target.value
    })
   }

   back = () => {
    this.props.displayChange('all')
    }

   sendNewAuthor = async (event: any) => {
    try {
      const res = await fetch('http://localhost:8080/author/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName
      })
    })

////////////////////////////////////////////////
    const resData = await res.json();  
    //error
    if(res.status < 200 || res.status > 299) {
      this.setState({
        ...this.state,
      errorMessage: resData.message,
      status: res.status
      })
    //   console.log(resData)

      //author added
    } else {
      this.setState({
        ...this.state,
        errorMessage:"",
        status: 200
      })  
      this.props.displayChange('all')    
      /////////////////////////////
    }
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const classes = this.props.classes;
  
    return (  
        <>
             {this.state.status < 200 || this.state.status > 299 ? 
              <Typography gutterBottom variant="h5" component="h2" color="error" className={classes.error}>
                {this.state.errorMessage}
              </Typography>
            : null}
            <form className={classes.inputContainer}>
                <TextField id="authorFirstName" label="First name" variant="outlined" className={classes.input} onBlur={this.getFirstName} />
                <TextField id="authorLastName" label="Last name" variant="outlined"   className={classes.input} onBlur={this.getLastName}/>
                <Button onClick={this.sendNewAuthor} variant="contained" color="primary" className={classes.submit}>Add new author</Button>
            </form>  
            <Button size="small" variant="outlined" className={classes.back} onClick={() =>this.back()}>
                Back
            </Button> 
        </>
    );
  
  }
}

const styles = (theme : Theme) => ({
  inputContainer: {
    paddingTop: "40px",
    width: "100%"
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
  back: {
    display: "flex",
    margin: "auto",
  },
  error: {
    textAlign: "center" as "center",
    width : "inherit",
    padding : "10px"
  }
});

export default withStyles(styles)(NewAuthor);