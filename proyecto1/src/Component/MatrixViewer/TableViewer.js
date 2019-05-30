import React, { Component } from 'react';
import Sequence from '../Sequence/Sequence';
import PropTypes from 'prop-types';
import AlineamientoGlobal from '../Algorithm/AlineamientoGlobal';
import AlineamientoSemiglobal from '../Algorithm/AlineamientoSemiglobal';
import AlineamientoLocal from '../Algorithm/AlineamientoLocal';
import AlineamientoGapPenalty from '../Algorithm/AlineamientoGapPenalty';
import AlineamientoAffinity from '../Algorithm/AlineamientoAffinity';
import TextBasedAlgorithm from '../Algorithm/TextBasedAlgorithm';
import MatrixViewer from './MatrixViewer';
import Reconstructor from "../Reconstructor/Reconstructor";
import Timer from "../Generic/Timer/Timer";

var sizeof = require('object-sizeof');



const availableAlgorithms = [
   {name : "Global Alignment", algorithm : AlineamientoGlobal}, 
   {name : "Semiglobal Alignment", algorithm : AlineamientoSemiglobal}, 
   {name : "Local Alignment", algorithm : AlineamientoLocal}, 
   {name : "Gap Penalty Alignment", algorithm : AlineamientoGapPenalty}, 
   {name : "Affinity Alignment", algorithm : AlineamientoAffinity}, 
]

class TableViewer extends Component {
  constructor(){
    super();
    this.state = {
      selected1           : 0,
      selected2           : 0,
      coincidence         : 1,
      difference          : -1,
      gap                 : -2,
      algorithm           : AlineamientoGlobal,
      selectedAlgorithm   : 0,
      result              : undefined,
      error              : "",
      generating              : false,
      //take 10 mb for program
      memory   : (window.performance.memory.jsHeapSizeLimit - 10485760),
    }

    this.onComboBox1 = this.onComboBox1.bind(this);
    this.onComboBox2 = this.onComboBox2.bind(this);
    this.onAlgorithmComboBox = this.onAlgorithmComboBox.bind(this);
    this.onGenerateMatrix = this.onGenerateMatrix.bind(this);
    this.onGenerateAlignments = this.onGenerateAlignments.bind(this);
  } 

  onChange(key,event){
    let newState = {};
    newState[key] = event.target.value;
    this.setState(newState);

  }

  onChangeInt(key,event){
    let newState = {};
    newState[key] = parseInt(event.target.value);
    this.setState(newState);

  }

  onComboBox1(event){
    this.setState({selected1: event.target.value});
  }
  onComboBox2(event){
    this.setState({selected2: event.target.value});
  }
  onAlgorithmComboBox(event){
    let selectedAlgorithm = availableAlgorithms[event.target.value].algorithm;
    this.setState({algorithm: selectedAlgorithm ,"selectedAlgorithm": event.target.value});
  }


  onGenerateMatrix(){
    this.forceUpdate(); //update viewed sequences
    let seq1 = this.props.sequences[this.state.selected1];
    let seq2 = this.props.sequences[this.state.selected2];
    let predicted = predictMatrixSize(seq1,seq2);
    if(this.state.memory > predicted){
      console.log(predicted);
      console.log(this.state.coincidence,this.state.difference,this.state.gap);
      let algo = new this.state.algorithm(this.state.coincidence,this.state.difference,this.state.gap);
      let res = algo.solvePair(seq1,seq2);
      this.setState({result : res});


      console.log("real size: ",sizeof(res) / 1024,"kb" ,"--- Max Size: " , this.state.memory);
    }else{
      //print out of memory exception
    }

  }

  onGenerateAlignments(){
    this.setState({generating:true});
    let res = this.state.result;
    let myself = this;
    let okms = "Sequencias almacenadas correctamente";
    let errms = "El archivo que intentas generar supera el limite de 10GB permitido";
    Timer.start();
    Reconstructor.reconstructIterative(res.data,res.optimal,res.s1,res.s2, 
      (valid) =>{
        myself.setState({generating:false});
        //console.log({valid});
        let elapsedTime = Timer.end();
        myself.setState({error: valid ?  okms +" time: " + elapsedTime + "ms": errms + " time: " + elapsedTime + "ms"})

      }
      );
  }

  render() {
    let myself = this;
    return (
      <div>
        <h2>Table Visualization</h2>
        <label>{this.state.error}</label>
        <br/>
        <select value={this.state.selected1} onChange={this.onComboBox1}>
          {this.props.sequences.map((item, index) => {
            return <option key = {index} value={index} >{item.name}</option>
          })}
        </select>


        <select value={this.state.selected2} onChange={this.onComboBox2}>
          {this.props.sequences.map((item, index) => {
            return <option key = {index} value={index} >{item.name}</option>
          })}
        </select>

        <select value={this.state.selectedAlgorithm} onChange={this.onAlgorithmComboBox}>
          {availableAlgorithms.map((item, index) => {
            return <option key = {index} value={index} >{item.name}</option>
          })}
        </select>
        {!this.state.generating && 
        <button onClick = {this.onGenerateMatrix}>Generate</button>
        }
        {this.state.result && !this.state.generating && 
          <button onClick = {this.onGenerateAlignments}>Generate Alignments</button>
        }
        {this.state.result && 
           <label>Score: {" " + this.state.result.max}</label>
        }
        <label>{"----"}</label>
        {this.state.result && 
           <label>Elapsed Time: {" " + this.state.result.duration + "ms"}</label>
        }
        

        <br/>
        <label>Coincidence:</label>
        <input type ="number" style={inputProp} value={this.state.coincidence} onChange={(event) =>{myself.onChangeInt("coincidence",event)}}/>
        <label>Diference:</label>
        <input type ="number" style={inputProp} value={this.state.difference} onChange={(event) =>{myself.onChangeInt("difference",event)}}/>
        <label>Gap:</label>
        <input type ="number" style={inputProp} value={this.state.gap} onChange={(event) =>{myself.onChangeInt("gap",event)}}/>
      

        {this.state.result &&
          <MatrixViewer data={this.state.result} sequence1={this.props.sequences[this.state.selected1].data} sequence2={this.props.sequences[this.state.selected2].data}/>
        }


      </div>
    );
  }
}

export default TableViewer;

TableViewer.propTypes = {
  sequences: PropTypes.array.isRequired
};

const horizontalScroll = {
  backgroundColor: "#333",
  overflow: "auto",
  whiteSpace: "nowrap",
  marginTop: "10px",
  textAlign: 'center',
};

const inputProp={
  width: "40pt",
}



function predictMatrixSize(sequence1,sequence2){
  let string1 = sequence1.data;
  let string2 = sequence2.data;
  let predictedMatrixSize = ((8 + 60)*string1.length*string2.length + 2048) /1024;
  return predictedMatrixSize;
}