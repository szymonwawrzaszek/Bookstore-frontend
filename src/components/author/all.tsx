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
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

class AllAuthors extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        authors: [],
        selectedAuthor: {},
        edit: false,
        new: false,
    }
    this.getAuthors();
  }  

  getAuthors = async () => {
   try {
     const res = await fetch('http://localhost:8080/authors', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

     const resData = await res.json();
    //  resData.authors = resData.authors.map((book: any) => {
    //   return {...book, imageUrl: "http://localhost:8080/images/" + book.imageUrl.substring(7)}
    //  })
     this.setState({
        ...this.state,
        authors: resData.authors
     })
   } catch (err) {
    console.log(err);
   }
  };

  setNew = () => {
    this.props.displayChange('new')
  }

  selectAuthor = (author: any) => {
    this.props.displayChange('details', author)  
  }

  render() {
    const classes = this.props.classes;
  
    return (  
        <>
        { this.state.authors.length > 0 ? 
            <>
            {this.state.authors.map((author: any) => (
            <Grid item xs={12} style={{padding: "15px"}} key={author._id}>
                <Card className={classes.card} style={{backgroundColor: this.props.userId.includes(author.user) || this.props.userId.includes("admin") ? "#f5f5f5" : "inherit"}}>
                    <CardActionArea style={{padding: "10px"}}>
                        {/* <CardMedia
                        className={classes.media}
                        //image={"/" + book.imageUrl}
                        image={book.imageUrl}
                        /> */}
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {author.firstName + " " + author.lastName}
                        </Typography>
                        {/* <Typography variant="body2" color="textSecondary" component="p">
                            {"Books:"}
                        </Typography>
                        {author.books.map( (book: any) => (
                            <Typography variant="body2" color="textSecondary" component="p">
                            {book.title}
                            </Typography>
                        ))} */}
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() =>this.selectAuthor(author)}>
                            Details
                        </Button> 
                        {/* <Button size="small" color="primary">
                        Add to favorites
                        </Button> */}
                    </CardActions>
                </Card>
            </Grid>            
            ))}
            <Grid item xs={12} style={{ padding: "15px"}}>
            <Button size="small" color="primary" variant="contained" onClick={this.setNew}>
                Add new author
            </Button>
            </Grid>
            </>      
            : <Grid item xs={12} style={{ padding: "15px"}}>
              <p>No authors yet</p>
              <Button size="small" color="primary" variant="contained" onClick={this.setNew}>
                  Add new author
              </Button>
            </Grid> }
            </>
            
    ) 
  }
}

const styles = (theme : Theme) => ({
  card: {
    //display: "inline-block"
  }
});

export default withStyles(styles)(AllAuthors);