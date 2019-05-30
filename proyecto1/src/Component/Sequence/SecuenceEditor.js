import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sequence from './Sequence';



class SequenceEditor extends Component {
  constructor() {
      super();
      this.state = {
        sequence : this.props.sequence
      }
   }


  onNameChange(event){
    let newName = event.target.value;
    this.setState({sequence:  newName});
  }

  onDataChange(event){
    let newData = event.target.value;
    this.setState({sequence:  newData});
  }

  render() {
    return (
      <div>
      <label>this.state.id</label>
      <input value={this.state.sequence.name} onChange={this.onNameChange}/>
      <textarea value={this.state.sequence.data} onChange={this.onDataChange} />
      </div>
    );
  }
}

SequenceEditor.propTypes = {
  sequence: PropTypes.instanceOf(Sequence).isRequired
};

export default SequenceEditor;
