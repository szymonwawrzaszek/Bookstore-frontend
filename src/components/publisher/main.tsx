import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import AllPublishers from './all'
import NewPublisher from './new'
import Details from './details'

class Publisher extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        display: 0,
        publisher: {}
    }
  }  

  displayChange = (s: string, publisher: any = undefined) => { 
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
        default:
            n = 0; 
            break;
    }
    this.setState({
        ...this.state,
        display: n,
        publisher: publisher
     })    
  }

  render() {
    const classes = this.props.classes;
  
    return (  
        <Grid item xs={12} className={classes.padding} container>
            {this.state.display == 0 ? 
                <AllPublishers displayChange={this.displayChange}/> : 
            this.state.display == 1 ? 
                <NewPublisher displayChange={this.displayChange}/> :
            this.state.display == 2 ? 
                <Details publisher={this.state.publisher} displayChange={this.displayChange} userId={this.props.userId}/> : 
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

export default withStyles(styles)(Publisher);