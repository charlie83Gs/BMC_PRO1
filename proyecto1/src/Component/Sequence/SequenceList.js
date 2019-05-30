import React, { Component } from 'react';
import Sequence from './Sequence';
import SequenceDisplay from './SequenceDisplay';
import PropTypes from 'prop-types';


/*
const sequences = [];
sequences.push(new Sequence(1,"secuencia1","ABCDEFG"));
sequences.push(new Sequence(2,"secuencia2","ABCDEFGH"));
sequences.push(new Sequence(3,"secuencia3","ABCDEFGHI"));
sequences.push(new Sequence(4,"secuencia4","ABCDEFGHIJ"));
sequences.push(new Sequence(5,"secuencia5","ABCDEFGHIJK"));
sequences.push(new Sequence(1,"secuencia1","ABCDEFG"));
sequences.push(new Sequence(2,"secuencia2","ABCDEFGH"));
sequences.push(new Sequence(3,"secuencia3","ABCDEFGHI"));
sequences.push(new Sequence(4,"secuencia4","ABCDEFGHIJ"));
sequences.push(new Sequence(5,"secuencia5","ABCDEFGHIJK"));
sequences.push(new Sequence(1,"secuencia1","ABCDEFG"));
sequences.push(new Sequence(2,"secuencia2","ABCDEFGH"));
sequences.push(new Sequence(3,"secuencia3","ABCDEFGHI"));
sequences.push(new Sequence(4,"secuencia4","ABCDEFGHIJ"));
sequences.push(new Sequence(5,"secuencia5","ABCDEFGHIJK"));
*/


class SequenceList extends Component {
  constructor(){
    super();
    let selectedSet = new Set();
    this.state = {
      selected :selectedSet
    }

    this.onItemSelected = this.onItemSelected.bind(this);
  }

  onItemSelected(sequence){
    //console.log("Sequence selected ", sequence);
    sequence.selected = !sequence.selected;
    this.forceUpdate();

  }

  render() {
    return (
      <div>
        <h2>Avaible Sequences</h2>
        <div  style={horizontalScroll} >
          {this.props.sequences.map((item, index) => (
            <SequenceDisplay key={index} sequence={item} onClick={(event) => {this.onItemSelected(item)}}/>
          ))}
        </div>
      </div>
    );
  }
}

export default SequenceList;

SequenceList.propTypes = {
  sequences: PropTypes.array.isRequired
};

const horizontalScroll = {
  backgroundColor: "#333",
  overflow: "auto",
  whiteSpace: "nowrap",
  marginTop: "10px",
  textAlign: 'center',
};

