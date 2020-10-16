import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class Error extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
    }
  }  

  login = () => {
    this.props.onLogIn()
  }

  back = () => {
    window.history.back();
  }

  render() {
    const classes = this.props.classes;
  
    return (  
        <Grid item xs={12} className={classes.padding} container>
             <Grid item xs={12} style={{padding: "15px"}}>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.more}>
                        Something went wrong
                        {this.props.token != "" && this.props.userId != "" ? 
                        <Button size="small" color="primary" onClick={this.back} style={{fontSize: "1.2rem"}}>
                            Back
                        </Button> :
                        <Button size="small" color="primary" onClick={this.login} style={{fontSize: "1.2rem"}}>
                            Log In
                        </Button> }
                    </Typography>
                </Grid>
        </Grid>   
    );
  
  }
}

const styles = (theme : Theme) => ({
  padding: {
    padding: "10px"
  },
});

export default withStyles(styles)(Error);