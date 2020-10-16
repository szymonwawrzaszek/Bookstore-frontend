import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import AllAuthors from './all'
import NewAuthor from './new'
import Details from './details'
import NewBook from './newBook'
import Edit from './edit'

class Author extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        display: 0,
        author: {}
    }
  }  

  displayChange = (s: string, author: any = undefined) => {
    let n = 0  
    switch (s) {
        case 'all':
            n = 0;    
            break;
        case 'new':
            n = 1;   
            break;
        case 'details':
            n = 2;   
            break;
        case 'addBook':
            n = 3;   
            break; 
        case 'edit':
            n = 4;   
            break;                  
        default:
            n = 0; 
            break;
    }
    this.setState({
        ...this.state,
        display: n,
        author: author
     })    
  }

  render() {
    const classes = this.props.classes;
  
    return (  
        <Grid item xs={12} className={classes.padding} container>
            {this.state.display == 0 ? 
                <AllAuthors displayChange={this.displayChange} userId={this.props.userId}/> : 
            this.state.display == 1 ? 
                <NewAuthor displayChange={this.displayChange}/> :
            this.state.display == 2 ? 
                <Details author={this.state.author} displayChange={this.displayChange} userId={this.props.userId}/> : 
            this.state.display == 3 ? 
                <NewBook author={this.state.author} displayChange={this.displayChange}/> : 
            this.state.display == 4 ? 
                <Edit author={this.state.author} displayChange={this.displayChange}/> :        
            null}
        </Grid>   
    );
  
  }
}

const styles = (theme : Theme) => ({
  padding: {
    padding: "10px"
  },
});

export default withStyles(styles)(Author);