import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import ImageUploader from 'react-images-upload';
import axios from 'axios'; 
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { fontWeight } from '@material-ui/system';

class NewBook extends React.Component<any & any, any> {
  
  constructor(props : any) {
    super(props, {});  
    this.state = {
        title: "",
        pageCount: 0,
        description: "",
        picture: {}
    }
   
  }  

  getTitle = (event: any) => {
    this.setState({
      ...this.state,
      title: event.target.value
    })
   }
  
   getPageCount = (event: any) => {
    this.setState({
      ...this.state,
      pageCount: event.target.value
    })
   }

   getDescription = (event: any) => {
    this.setState({
      ...this.state,
      description: event.target.value
    })
   }

   getImage = (event: any) => {
     console.log(event.target.files[0])
    //  console.log(event.target.value)
    // this.setState({
    //   ...this.state,
    //   image: event.target.value
    // })
   }

   onDrop = (picture: any) => {
    this.setState({
      ...this.state,
      picture: picture[0],
    });
}

   back = () => {
    this.props.displayChange('all')
    }

   sendNewBook = async (event: any) => {
     let fd = new FormData()
     
     fd.append("title", this.state.title)
     fd.append("pageCount", this.state.pageCount)
     fd.append("description", this.state.description)
     fd.append("image", this.state.picture)
    
    try {
     
      const res = await axios({
        method: 'post',
        url: `http://localhost:8080/author/${this.props.author._id}/book-add`,
        headers: {
        ///'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': `multipart/form-data; `,
      },
        data: fd
      });
      this.props.displayChange('details', this.props.author)
     

////////////////////////////////////////////////
//    const resData = await res.json();  
//     //error
//     if(res.status < 200 || res.status > 299) {
//       this.setState({
//         ...this.state,
//       errorMessage: resData.error,
//       status: res.status
//       })
//     console.log(resData)

//       //author added
//     } else {
//     this.props.displayChange('all')    
//       /////////////////////////////
//     }
    } catch (err) {
      this.setState({
        ...this.state,
        errorMessage: err.response.data.message,
        status: err.response.status
      })
    }
  }

  render() {
    const classes = this.props.classes;

    return (  
        <>
          {this.state.status < 200 || this.state.status > 299 ? 
            <Typography gutterBottom variant="h5" component="h2" color="error" className={classes.error}>
              {this.state.errorMessage}
            </Typography>
          : null}
          <form className={classes.inputContainer} encType="multipart/form-data">
              <TextField id="bookTitle" label="Title" variant="outlined" className={classes.input} onBlur={this.getTitle} />
              <TextField id="bookPageCount" label="Page count" variant="outlined" type="number"  className={classes.input} onBlur={this.getPageCount}/>
              <TextField id="bookDescription" label="Description" variant="outlined" multiline rows={3} className={classes.input} onBlur={this.getDescription} />
              {/* <TextField id="authorLastName" label="Last name" variant="outlined"   className={classes.input} onBlur={this.getLastName}/> */}
              {/* <label htmlFor="image"></label>
              <br/> */}
              {/* <Input type="file" name="image" id="image" className={classes.input} onBlur={this.getImage}></Input> */}
              <ImageUploader
                withIcon={false}
                singleImage
                buttonText='Choose image'
                onChange={this.onDrop}
                
                label='Max file size: 5mb, accepted: jpg | png | gif'
                imgExtension={['.jpg', '.gif', '.png']}
                maxFileSize={5242880}
            />
              {/* <input type="file" name="image" id="image" ></input>
              <br/><br/> */}
              <Button onClick={this.sendNewBook} variant="contained" color="primary" className={classes.submit}>Add new book</Button>
          </form>  
          <Button size="small" variant="outlined" className={classes.back} onClick={() =>this.back()}>
              Back
          </Button> 
        </>
    );
  
  }
}

const styles = (theme : Theme) => ({
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
  back: {
    display: "flex",
    margin: "auto",
  },
  error: {
    textAlign: "center" as "center",
    width : "inherit",
    padding : "10px"
  }
});

export default withStyles(styles)(NewBook);