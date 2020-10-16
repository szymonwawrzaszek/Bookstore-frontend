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
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const themeEdit = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: orange[400],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
});

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


class Author extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        selectedAuthor: {},
        publisher: ""
    }
    console.log("wwww")
    this.selectAuthor(this.props.author);
  }  



  selectAuthor = async (author: any) => {
    try {
      const res = await fetch(`http://localhost:8080/author/${author._id}`, {  
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      })
      const resData = await res.json();
      //resData.book.imageUrl = "http://localhost:8080/images/" + resData.book.imageUrl.substring(7)
      this.setState({
        ...this.state,
        selectedAuthor: resData.author,
        availablePublishers: resData.availablePublishers
      })
    } catch (err) {
     console.log(err);
    }
  }

  deleteAuthor = async () => {
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
      //const resData = await res.json();
      //alert("lol")
      await this.props.displayChange('all')
    } catch (err) {
     console.log(err);
    }
  }

  back = () => {
    this.props.displayChange('all')
  }

  addBook = () => {
    this.props.displayChange('addBook', this.props.author)
  }

  editAuthor = () => {
    this.props.displayChange('edit', this.props.author)
  }

  handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({
      ...this.state,
      publisher: event.target.value
    })
  };

  addPublisher = async () => {
    try {
      const res = await fetch(`http://localhost:8080/author/${this.props.author._id}/add-author-to-publisher`, {  
        method: 'POST',   
        headers: {
           'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            publisherId: this.state.publisher
          })
      })
      const resData = await res.json();
      this.selectAuthor(this.props.author);
    } catch (err) {
     console.log(err);
    }
  }

  render() {
    const classes = this.props.classes;
    //console.log(this.state)
    //console.log(this.state.selectedAuthor)
    //console.log(this.props.userId)
  
    return (  
      <MuiThemeProvider theme={theme}>
        <>
        {Object.keys(this.state.selectedAuthor).length > 0 ?
            <Grid item xs={12} className={classes.padding}>
            <Typography gutterBottom variant="h5" component="h2">
            First name: {this.state.selectedAuthor.firstName}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
                Last name: {this.state.selectedAuthor.lastName}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
                {"Books:"}
            </Typography>
            {this.state.selectedAuthor.books.map( (book: any) => (
            <Typography variant="body2" color="textSecondary" component="p">
                {book.title}
            </Typography>
            ))} 

            <Grid item xs={12} style={{padding: "0", paddingTop: "20px"}}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Select publisher</InputLabel>
                <Select
                  value={this.state.publisher}
                  onChange={this.handleChangeSelect}
                  label="Select publisher"
                >
                  {this.state.availablePublishers.map((publisher: any) => (
                    <MenuItem value={publisher._id}>{publisher.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button size="small" variant="contained" color="primary" onClick={() =>this.addPublisher()} disabled={this.state.publisher.length > 1 ? false : true} >
                  Add publisher
                </Button>
            </Grid>  

            { this.props.userId.includes(this.state.selectedAuthor.user) || this.props.userId.includes("admin") ? <>
            <Button size="small" variant="contained" color="secondary" onClick={() =>this.deleteAuthor()}>
                Delete author
            </Button>
            <MuiThemeProvider theme={themeEdit}>
              <Button size="small" variant="contained" color="primary" onClick={() =>this.editAuthor()}>
                  Edit author
              </Button>
            </MuiThemeProvider>
            <Button size="small" variant="contained" color="primary" onClick={() =>this.addBook()}>
                Add book
            </Button></> : null}
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
});

export default withStyles(styles)(Author);