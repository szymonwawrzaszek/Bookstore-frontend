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
import CircularProgress from '@material-ui/core/CircularProgress';

type Search =  {
  books: any[],
  moreBooks: any[],
  searchString: string,
  show: boolean,
  pending: boolean,
  more: boolean
}

type AllBooksState = {
 books: any[] ,
 search: Search,
 selectedBook: any,
 edit: boolean,
 new: boolean,
}


class AllBooks extends React.Component<any & any, AllBooksState> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        books: [],
        search: {
          books: [],
          moreBooks: [],
          searchString: "",
          show: false,
          pending: false,
          more: true
        },
        selectedBook: {},
        edit: false,
        new: false,
        
        
    }
    this.getBooks();
  }  

  timeout: any

  getBooks = async () => {
    try {
      const res = await fetch('http://localhost:8080/books', {
       headers: {
         Authorization: 'Bearer ' + localStorage.getItem('token')
       }
     })
      //console.log(res);
      const resData = await res.json();
      //console.log(resData);
      resData.books = resData.books.map((book: any) => {
       return {...book, imageUrl: "http://localhost:8080/images/" + book.imageUrl.substring(7)}
      })
      this.setState({
         ...this.state,
         books: resData.books
      })
    } catch (err) {
     console.log(err);
    }
   };

  setNew = () => {
    this.props.displayChange('new', this.state.books[0])
  }

  selectBook = (book: any) => {
    this.props.displayChange('details', book)  
  }

  click = () => {
    this.props.onLogIn()
  }

  getBookName = async (event: React.ChangeEvent<{ value: string }>) => {
    let s = this.state.search;
    s.searchString = event.target.value
    this.setState({
      ...this.state,
      search: s
    }) 

    clearTimeout(this.timeout);
    if(event.target.value.length >= 3){
      this.timeout = await setTimeout(() => {
        let s = this.state.search;
        s.pending = true;
        this.setState({
            ...this.state,
            search: s
          })
        this.searchBooks()
      }, 2000);
    }
  }

  searchBooks = async () => {
    try {
      const res = await fetch(`http://localhost:8080/books-search/${this.state.search.searchString}`, {
       method: 'GET', 
       headers: {
         Authorization: 'Bearer ' + localStorage.getItem('token')
       }
     })
      const resData = await res.json();
      resData.books = resData.books.map((book: any) => {
        return {...book, imageUrl: "http://localhost:8080/images/" + book.imageUrl.substring(7)}
       })
      resData.booksDescription = resData.booksDescription.map((book: any) => {
      return {...book, imageUrl: "http://localhost:8080/images/" + book.imageUrl.substring(7)}
      }) 
       console.log(resData)
      let s = this.state.search;
      s.books = resData.books;
      s.moreBooks = resData.booksDescription;
      s.pending = false;
      s.show = true;
      this.setState({
         ...this.state,
         search: s
      })
    } catch (err) {
     console.log(err);
    }
   };

   clearSearch = () => {
     let s = this.state.search;
     s.books = [];
     s.moreBooks = [];
     s.searchString= "";
     s.show = false;
      this.setState({
        ...this.state,
        search: s
    })
   }

   swapMore = () => {
    //console.log(this.state.search)
    let s = this.state.search;
    s.more = !this.state.search.more;
    this.setState({search: s})
   }
  
  render() {
    const classes = this.props.classes;
    //console.log(this.props.userId)
    //console.log(this.state)

    let books: any[] = []
    //console.log(books)
    if(this.state.search.show){
      books = this.state.search.books
      if(this.state.search.moreBooks.length > 0 && !this.state.search.more) {
        //books.push(...this.state.search.moreBooks)
        //console.log(...this.state.search.moreBooks)
        //console.log(books.push(...this.state.search.moreBooks))
        books = books.concat(this.state.search.moreBooks)
      }
    } else {
      books = this.state.books
    }
    //console.log(books)
    let token = localStorage.getItem("token")
    let auth = token != undefined ? true : false
    return (  
        <>
        { this.state.books.length > 0 ? 
            <>
            {auth ? 
              <TextField id="bookSearch" label="Find books" variant="outlined" value={this.state.search.searchString} className={classes.input} onChange={this.getBookName}/> : null}
            {this.state.search.show ? 
              <Button size="small" color="primary" onClick={this.clearSearch} style={{height: "56px"}}>
                  Clear search
              </Button> : null}
            {this.state.search.pending ? <CircularProgress /> : null}
            <Grid  container>
              {books.map((book: any) => (
                  <Grid item xs={4} style={{textAlign: "center", padding: "15px"}}>
                      <Card className={classes.card} style={{backgroundColor: this.props.userId.includes(book.author.user) ||  this.props.userId.includes("admin") ? "#f5f5f5" : "inherit"}}>
                          <CardActionArea style={{padding: "10px"}}>
                              <CardMedia style={{border: this.props.userId.includes(book.author.user) ||  this.props.userId.includes("admin") ? "2px solid green" : "inherit"}}
                              className={classes.media}
                              //image={"/" + book.imageUrl}
                              image={book.imageUrl}
                              />
                              <CardContent>
                              <Typography gutterBottom variant="h5" component="h2">
                                  {book.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p">
                                  {book.description}
                              </Typography>
                              </CardContent>
                          </CardActionArea>
                          <CardActions>
                              <Button size="small" color="primary" onClick={() =>this.selectBook(book)}>
                                  Details
                              </Button>
                              {/* <Button size="small" color="primary">
                              Add to favorites
                              </Button> */}
                          </CardActions>
                      </Card>
                  </Grid>            
              ))}
             </Grid>
             {this.state.search.moreBooks.length > 0 && this.state.search.more ? 
                <Button size="medium" color="primary" style={{textTransform: "none"}} onClick={this.swapMore}>
                  Show results found in description
                </Button> : this.state.search.moreBooks.length > 0 && !this.state.search.more ? 
               <Button size="medium" color="primary" style={{textTransform: "none"}} onClick={this.swapMore}>
                  Clear results found in description
                    </Button>   : null}
              {books.length < 1 ? 
                <Typography variant="body2" color="textSecondary" component="p">
                    No books found
                </Typography> : null}
             {!auth ?
                <Grid item xs={12} style={{padding: "15px"}}>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.more}>
                        Want to see more
                        <Button size="small" color="primary" onClick={this.click} style={{fontSize: "1.2rem"}}>
                            Log In
                        </Button>
                    </Typography>
                </Grid> : null
              }
            </>      
            : <Typography gutterBottom variant="h5" component="h2" className={classes.more}> {"No books yet "}
              {!auth ?
                   <>
                      <Button size="small" color="primary" onClick={this.click} style={{fontSize: "1.2rem"}}>
                          Log In
                      </Button>
                      {" to add books"}
                   </>
                : null
              }

            </Typography> }
            </>          
    ) 
  }
}

const styles = (theme : Theme) => ({
  card: {
    //display: "inline-block"
  },
  media: {
    height: "200px",
    width: "200px",
  },
  more: {
    paddingTop: "20px",
    alignItems: "center",
    width: "inherit",
    textAlign: "center" as "center",
  },
  input: {
    display: "flex",
    width: "50%",
    marginBottom: "40px"
  },
  // moreBooks: {
  //   padding: "15px",
  //   cursor: "pointer",
  //   "&:hover": {
  //     backgroundColor: "#e6f2ff"
  //   }
  // }
});

export default withStyles(styles)(AllBooks);