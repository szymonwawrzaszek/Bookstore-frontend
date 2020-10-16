import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      input:{
        padding: "10px"
      }
    },
    MuiInputLabel: {
      outlined: {
        transform: "translate(14px, 10px) scale(1)"
      }
    },
  }
});


class Publisher extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        selectedPublisher: {},
        availableAuthors: [],
        //author: '',
        checkboxes: []
    }
    this.selectPublisher(this.props.publisher);
  }  



  selectPublisher = async (publisher: any) => {
    try {
      const res = await fetch(`http://localhost:8080/publisher/${publisher._id}`, {  
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      })
      const resData = await res.json();
      this.setState({
        ...this.state,
        selectedPublisher: resData.publisher,
        availableAuthors: resData.availableAuthors
      })
    } catch (err) {
     console.log(err);
    }
  }

  deletePublisher = async () => {
    try {
      const res = await fetch(`http://localhost:8080/author/${this.state.selectedAuthor._id}/delete`, { 
        method: 'POST',   
        headers: {
           'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
          })
      })
      await this.props.displayChange('all')
    } catch (err) {
     console.log(err);
    }
  }

  addAuthor = async () => {
    try {
      const res = await fetch(`http://localhost:8080/publisher/${this.props.publisher._id}/add-authors`, {  
        method: 'POST',   
        headers: {
           'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            authorIds: this.state.checkboxes
          })
      })
      const resData = await res.json();
      this.setState({checkboxes: []})
      this.selectPublisher(this.props.publisher);
    } catch (err) {
     console.log(err);
    }
  }


  back = () => {
    this.props.displayChange('all')
  }

  // addPublisher = () => {
  //   this.props.displayChange('addPublisher', this.props.publisher)
  // }

  // handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
  //   this.setState({
  //     ...this.state,
  //     author: event.target.value
  //   })
  // };

  handleChangeCheckbox = (id: string) => {
    let ids = this.state.checkboxes
    if(ids.includes(id)) {
      ids = ids.filter((x: any) => x != id)
    } else {
      ids.push(id)
    }
    this.setState({checkboxes: ids })  
  };
  

  render() {
    const classes = this.props.classes;

    let confirmedAuthors = []
    let unconfirmedAuthors = []
  
    if(Object.keys(this.state.selectedPublisher).length > 0) {
      confirmedAuthors = this.state.selectedPublisher.authors.filter((x: any) => x.status != "Not accepted")
      unconfirmedAuthors = this.state.selectedPublisher.authors.filter((x: any) => x.status == "Not accepted")
    }  

    return ( 
      <MuiThemeProvider theme={theme}>
        <>
        {Object.keys(this.state.selectedPublisher).length > 0 ?
            <Grid item xs={12} className={classes.padding}>
            <Typography gutterBottom variant="h5" component="h2">
              Name: {this.state.selectedPublisher.name}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Address:
            </Typography>
            <Typography gutterBottom variant="body2" component="p">
              City: {this.state.selectedPublisher.address.city}
            </Typography>
            <Typography gutterBottom variant="body2" component="p">
              Street: {this.state.selectedPublisher.address.street}
            </Typography>
            <Typography gutterBottom variant="body2" component="p">
              Post code: {this.state.selectedPublisher.address.postCode}
            </Typography>
            {confirmedAuthors.length > 0 ? 
              <>
                <Typography gutterBottom variant="h5" component="h2" style={{paddingTop: "20px"}}>
                  Authors:
                </Typography>
                {confirmedAuthors.map( (author: any) => (
                <Typography variant="body2" color="textSecondary" component="p">
                    {author.author.firstName + " " + author.author.lastName}
                </Typography>
                ))} 
              </>
              :
              <Typography gutterBottom variant="h5" component="h2">
                No authors yet
              </Typography>
            }
            {unconfirmedAuthors.length > 0 ? 
              <>
                <Typography gutterBottom variant="h5" component="h2" style={{paddingTop: "20px"}}>
                  Authors waiting for accept:
                </Typography>
                {unconfirmedAuthors.map( (author: any, i: number) => (
                <Typography variant="body2" color="textSecondary" component="p">
                    {author.author.firstName + " " + author.author.lastName}
                    <Checkbox
                      key={author.author._id}
                      onChange={() => this.handleChangeCheckbox(author.author._id)}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    {i == unconfirmedAuthors.length -1 ? 
                     <Button size="small" variant={this.state.checkboxes.length <= 0 ? "outlined" : "contained"} color="primary" disabled={this.state.checkboxes.length <= 0} onClick={() =>this.addAuthor()}>
                      Add authors
                    </Button> : null }
                </Typography>
                ))} 
              </>
              :
              null
            }
            {/* <Grid item xs={12} style={{padding: "0", paddingTop: "20px"}}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Select author</InputLabel>
                <Select
                  value={this.state.author}
                  onChange={this.handleChangeSelect}
                  label="Select author"
                >
                  {this.state.availableAuthors.map((author: any) => (
                    <MenuItem value={author._id}>{author.firstName + " " + author.lastName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button size="small" variant="contained" color="primary" onClick={() =>this.addAuthor()} disabled={this.state.author.length > 1 ? false : true} >
                  Add author
                </Button>
            </Grid> */}
            <Button size="small" variant="outlined" onClick={() =>this.back()}>
                Back
            </Button> 
            </Grid>   : <p>Loading...</p>}
       </>
     </MuiThemeProvider> 
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
  margin: {
    margin: "35px 0 px"
  },
  typography: {
    display: "flex",
    justifyContent: "space-around"
  },
  selected: {
    backgroundColor: "#e9f1f5"
  },
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
  media: {
      height: "200px",
      width: "200px",
  },
  card: {
    //display: "inline-block"
  },
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectInput: {
    padding: "10px"
  }
});

export default withStyles(styles)(Publisher);