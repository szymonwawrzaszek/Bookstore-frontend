import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


class NewPublisher extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        name: "",
        street: "",
        city: "",
        postCode: "",
        errorMessage: "",
        status: 200
    }
   
  }  

  getName = (event: any) => {
    this.setState({...this.state, name: event.target.value})
   }
  
  getStreet = (event: any) => {
  this.setState({...this.state, street: event.target.value})
  }

  getCity = (event: any) => {
  this.setState({...this.state, city: event.target.value})
  }

  getPostCode = (event: any) => {
  this.setState({...this.state, postCode: event.target.value})
  }
   

  back = () => {
  this.props.displayChange('all')
  }

  sendNewPublisher = async (event: any) => {
    try {
      const res = await fetch('http://localhost:8080/publisher/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: this.state.name,
        street: this.state.street,
        city: this.state.city,
        postCode: this.state.postCode,
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
        <div style={{width: "100%", paddingTop: "40px"}}>
             {this.state.status < 200 || this.state.status > 299 ? 
              <Typography gutterBottom variant="h5" component="h2" color="error" className={classes.error}>
                {this.state.errorMessage}
              </Typography>
            : null}
            <form className={classes.inputContainer}>
              <div className={classes.container}>
                <TextField id="publisherName" label="Name" variant="outlined" className={classes.input} onBlur={this.getName} />
                <Typography gutterBottom variant="h5" component="h2" className={classes.text}>
                  {"Address:"}
                </Typography>
                <TextField id="publisherStreet" label="Street" variant="outlined"   className={classes.input} onBlur={this.getStreet}/>
                <TextField id="publisherCity" label="City" variant="outlined"   className={classes.input} onBlur={this.getCity}/>
                <TextField id="publisherPostCode" label="PostCode" variant="outlined"   className={classes.input} onBlur={this.getPostCode}/>
                <Button onClick={this.sendNewPublisher} variant="contained" color="primary" className={classes.submit}>Add new publisher</Button>
                </div>
            </form>  
            <Button size="small" variant="outlined" className={classes.back} onClick={() =>this.back()}>
                Back
            </Button> 
        </div>
    );
  
  }
}

const styles = (theme : Theme) => ({
  inputContainer: {
    width: "100%"
  },
  input: {
    display: "flex",
    marginBottom: "40px"
  },
  container: {
    //display: "flex",
    width: "50%",
    margin: "auto",
  }, 
  text: {
    display: "flex",
    marginBottom: "20px"
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

export default withStyles(styles)(NewPublisher);