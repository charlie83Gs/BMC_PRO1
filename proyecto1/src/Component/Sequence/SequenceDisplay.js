import React, { Component } from 'react';



const SequenceDisplay = function({sequence,onClick}){
  //console.log(selected);
  return (
        <div style={sequence.selected ? selectedItemStyle : itemStyle} onClick={onClick}>
          <label style = {smallText} >ID: </label>
          <label style = {smallText} >{sequence.id}</label>
          <br/>
          <br/>
          <label>NAME: </label>
          <br/>
          <label>{sequence.name}</label>
        </div>
   );

}

const itemStyle = {
  display: 'inline-block',
  color: 'white',
  textAlign: 'center',
  padding: '14px',
  textDecoration: 'none',
  borderColor: 'gray',
  borderRadius: '3px',
  borderStyle: 'solid',
  borderWidth: "2px",
  backgroundColor: "#333",
  margin:"3px",

};

const selectedItemStyle = {
  display: 'inline-block',
  color: 'white',
  textAlign: 'center',
  padding: '14px',
  textDecoration: 'none',
  borderColor: 'white',
  borderStyle: 'solid',
  borderRadius: '3px',
  borderWidth: "2px",
  backgroundColor: "#555",
  margin:"3px",
};


const smallText = {
  fontSize : "8pt",
}

export default SequenceDisplay;