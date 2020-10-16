import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import AllBooks from './all'
import NewBook from './new'
import Details from './details'
import Edit from './edit'

class Book extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        display: 0,
        book: {}
    }
  }  

  displayChange = (s: string, book: any = undefined) => { 
    let n = 0  
    switch (s) {
        case 'all':
            n = 0;    
            break;
        // case 'new':
        //     n = 1;   
        //     break;
        case 'details':
            n = 2;   
            break;
        case 'edit':
            n = 3;   
            break;        
        default:
            n = 0; 
            break;
    }
    this.setState({
        ...this.state,
        display: n,
        book: book
     })    
  }

  render() {
    const classes = this.props.classes;
    //let history = this.props.history
    const { history } = this.props
    //console.log(history)
    return (  
        <Grid item xs={12} className={classes.padding} container>
            {/* <Button size="small" variant="outlined" className={classes.back} onClick={() =>history.push('/publishers')}>
              Go to Publishers
            </Button>  */}
            {this.state.display == 0 ? 
                <AllBooks displayChange={this.displayChange} token={this.props.token} userId={this.props.userId} onLogIn={this.props.onLogIn}/> : 
            // this.state.display == 1 ? 
            //     <NewBook displayChange={this.displayChange} book={this.state.book}/> :
            this.state.display == 2 ? 
                <Details book={this.state.book} displayChange={this.displayChange} userId={this.props.userId}/> : 
            this.state.display == 3 ? 
                <Edit book={this.state.book} displayChange={this.displayChange} userId={this.props.userId}/> :     
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

export default withStyles(styles)(Book);