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
import { purple, orange, yellow } from '@material-ui/core/colors';
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

class Book extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        selectedBook: {},
    }
    this.selectBook(this.props.book);
  }  



  selectBook = async (book: any) => {
   
    try {
      const res = await fetch(`http://localhost:8080/author/${book.author._id}/book/${book._id}`, { })
      const resData = await res.json();
      resData.book.imageUrl = "http://localhost:8080/images/" + resData.book.imageUrl.substring(7)
      this.setState({
        ...this.state,
        selectedBook: {book: resData.book, author: resData.author}
      })
    } catch (err) {
     console.log(err);
    }
  }

  deleteBook = async () => {
   
    try {
      const res = await fetch(`http://localhost:8080/author/${this.state.selectedBook.author._id}/book-delete`, { 
        method: 'POST',   
        headers: {
           'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            id: this.state.selectedBook.book._id
          })
      })
      //console.log(res);
      const resData = await res.json();
      console.log(resData);
      this.back()
    } catch (err) {
     console.log(err);
    }
  }

//   deleteAuthor = async () => {
//     try {
//       const res = await fetch(`http://localhost:8080/author/${this.state.selectedAuthor._id}/delete`, { 
//         method: 'POST',   
//         headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('token')
//           }
//       })
//       console.log(res);
//       const resData = await res.json();
//       this.props.displayChange('all')
//     } catch (err) {
//      console.log(err);
//     }
//   }

  back = () => {
    this.props.displayChange('all')
  }


  render() {
    const classes = this.props.classes;
    console.log(this.state.selectedBook)
    console.log(this.props)
  
    return (  
        <>
        {Object.keys(this.state.selectedBook).length > 0 ?
            <Grid item xs={12} className={classes.padding}>
            <Typography gutterBottom variant="h5" component="h2">
               Title: {this.state.selectedBook.book.title}
           </Typography>
           <Typography gutterBottom variant="h5" component="h2">
               Description: {this.state.selectedBook.book.description}
           </Typography>
           <Typography gutterBottom variant="h5" component="h2">
               Number of pages: {this.state.selectedBook.book.pageCount}
           </Typography>
           <Typography gutterBottom variant="h5" component="h2">
               Author: {this.state.selectedBook.author.firstName + " " + this.state.selectedBook.author.lastName}
           </Typography>
           <CardMedia
             className={`${classes.media} ${classes.margin}`}
             //image={"/" + book.imageUrl}
             image={this.state.selectedBook.book.imageUrl}
           />
            {this.props.userId.includes(this.state.selectedBook.author.user) ||  this.props.userId.includes("admin") ?
            <>
              <MuiThemeProvider theme={themeEdit}>
                <Button size="small" variant="contained" color="primary" onClick={() =>this.props.displayChange('edit', this.state.selectedBook.book)}>
                    Edit book
                </Button>
              </MuiThemeProvider> 
              <Button size="small" variant="contained" color="primary" onClick={() =>this.deleteBook()}>
                Delete Book
              </Button>
            </> : null } 
            <Button size="small" variant="outlined" onClick={() =>this.back()}>
              Back
            </Button>
         </Grid>   : <p>Loading...</p>}
     </>
    );
  
  }
}

const styles = (theme : Theme) => ({
    padding: {
      padding: "10px"
    },
    margin: {
      margin: "35px 0px"
    },
    media: {
        height: "200px",
        width: "200px",
    }
  });

export default withStyles(styles)(Book);