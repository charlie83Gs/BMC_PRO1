import React, { Component } from 'react';
import '../Button/Button.css';
import DragAndDrop from '../Generic/DragAndDrop/DragAndDrop';
import Sequence from '../Sequence/Sequence';


class Menu extends Component {
  constructor() {
      super();
      this.state = {
        isFile : false,
        data : "",
        name: "",
        file : undefined,
        fileName : undefined,
        totalSequences : 0,
      }

      this.useFile = this.useFile.bind(this);
      this.useText = this.useText.bind(this);
      this.onDataChange = this.onDataChange.bind(this);
      this.onFileChange = this.onFileChange.bind(this);
      this.handleDrop = this.handleDrop.bind(this);
      this.onSaveButton = this.onSaveButton.bind(this);
      this.onNameChange = this.onNameChange.bind(this);
   }

  useFile(){
    this.setState({isFile:true});
  }


  useText(){
    this.setState({isFile:false});
  }

  onDataChange(event){
    this.setState({data:  event.target.value});
  }

  onFileChange(event){
    this.setState({file:  event.target.value});
  }

  onSaveButton(){
    let myself = this;
    
    
    if(this.state.isFile){
    let fileReader = new FileReader();
    //create callback when file is read
    fileReader.onload = 
    (event) => {
        let content = fileReader.result;
        myself.setState({data:content});

        let newSequence = new Sequence(this.state.totalSequences,myself.state.name,content);
        this.props.sequences.push(newSequence);
        console.log("New sequence created " + myself.state.name)

        //console.log(content);
        //reset state
        let newState = {
            data : "",
            name: "",
            file : undefined,
            fileName : undefined,
            totalSequences : this.state.totalSequences+1,
          };

        this.setState(newState);
    };
    
    //read the file
    if(this.state.file)
    fileReader.readAsText(this.state.file);

    }else{
        let newSequence = new Sequence(this.state.totalSequences,myself.state.name,myself.state.data);
        this.props.sequences.push(newSequence);
        console.log("New sequence created " + myself.state.name)
        //console.log(content);
        //reset state
        let newState = {
            data : "",
            name: "",
            file : undefined,
            fileName : undefined,
            totalSequences : this.state.totalSequences+1,
          };
        this.setState(newState);
    }

    
  }



  onNameChange(event){
    this.setState({ name:event.target.value});
  }


  handleDrop(files){
    //let fileList = this.state.files
    let file = files[0];
    console.log(file.name);
    /*for (var i = 0; i < files.length; i++) {
      if (!files[i].name) return
      fileList.push(files[i].name)
    }*/

    let newState = {
                    file: file,
                    fileName: file.name,
                   };

    this.setState(newState);
  }


  render() {
    return (
      <div style={centerBody}>
        <h2>Name: </h2>
        <input type="text" value ={this.state.name} onChange={this.onNameChange}/>

        <h2>Data: </h2>
        

        {this.state.isFile &&
        <div>
          <button className="btn blue small" onClick={this.useText}>Text</button>
          <br/>
          
          <DragAndDrop style={FileDragArea} handleDrop={this.handleDrop}>
              <p>or ...</p>
              <div style = {centerElement}>{this.state.fileName ? this.state.fileName : "Drag a file here"}</div>
          </DragAndDrop>
        </div>
        }

        {!this.state.isFile &&
        <div>
          <button  className="btn blue small" onClick={this.useFile}>File</button>
          <br/>
          <textarea style = {textAreaStyle} value={this.state.data} onChange={this.onDataChange}/>
        </div>
        }
        <button  className="btn green normal" onClick={this.onSaveButton}>Save Sequence</button>
      </div>
    );
  }
}

//<input type="file" value={this.state.file} onChange={this.onFileChange}/>
const centerBody = {
  textAlign: 'center',
  padding: '14px',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const textAreaStyle = {
  width : '70%',
  height : '300px',

};

const inputAreaStyle = {
  width : '70%',
  height : '300px',

};

const FileDragArea = {
  width : '70%',
  height : '300px',
  background:"#DDDDDD", 
  textAlign:"center", 
  display:"flex",
  alignItems:"center",
  margin:"auto"
}

const centerElement =  {
  margin: 'auto',
  width: '50%',
  border: '3px',
  padding: '10px',
}

export default Menu;
