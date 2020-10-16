import React from 'react';

import Main  from './components/main';


class App extends React.Component<any & any, any> {
  constructor(props : any) {
    super(props, {});
  }  

  render() {
   
    return (
      <div className="App">
        <Main style={{margin: "10px"}}/>
      </div>
    );
  
  }
}

export default App; 
