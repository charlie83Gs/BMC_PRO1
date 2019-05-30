import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sequence from './Sequence';



class AlgorithmMenu extends Component {
  constructor() {
      super();
      this.state = {
        sequence : this.props.sequence
      }
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

SequenceEditor.propTypes = {
  sequence: PropTypes.instanceOf(Sequence).isRequired
};

export default SequenceEditor;
