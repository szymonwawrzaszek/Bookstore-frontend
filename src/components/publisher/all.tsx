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

class AllPublishers extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        publishers: [],
        selectedPublishers: {},
        edit: false,
        new: false,
    }
    this.getPublishers();
  }  

  getPublishers = async () => {
   try {
     const res = await fetch('http://localhost:8080/publishers', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
     const resData = await res.json();
     this.setState({
        ...this.state,
        publishers: resData.publishers
     })
   } catch (err) {
    console.log(err);
   }
  };

  setNew = () => {
    this.props.displayChange('new')
  }

  selectPublisher = (publisher: any) => {
    this.props.displayChange('details', publisher)  
  }

  render() {
    const classes = this.props.classes;
  
    return (  
        <>
        { this.state.publishers.length > 0 ? 
            <>
            {this.state.publishers.map((publisher: any) => (
            <Grid item xs={12} style={{padding: "15px"}}>
                <Card className={classes.card}>
                    <CardActionArea style={{padding: "10px"}}>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {publisher.name}
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
                        <Button size="small" color="primary" onClick={() =>this.selectPublisher(publisher)}>
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
                Add new publisher
            </Button>
            </Grid>
            </>      
            : <Grid item xs={12} style={{ padding: "15px"}}>
              <p>No publishers yet</p>
              <Button size="small" color="primary" variant="contained" onClick={this.setNew}>
                  Add new publisher
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

export default withStyles(styles)(AllPublishers);