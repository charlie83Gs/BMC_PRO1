import React, { Component } from 'react'
import '../../Button/Button.css';

class DragAndDrop extends Component {
  state = {
    drag: false
  }
  dropRef = React.createRef()
  handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({drag: true})
    }
  }
  handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter === 0) {
      this.setState({drag: false})
    }
  }
  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({drag: false})
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files)
      e.dataTransfer.clearData()
      this.dragCounter = 0    
    }
  }
  openFile = (event) => {
    console.log(event)
    this.props.handleDrop(event.target.files);
  }

  componentDidMount() {
    let div = this.dropRef.current
    div.addEventListener('dragenter', this.handleDragIn)
    div.addEventListener('dragleave', this.handleDragOut)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop)
  }
  componentWillUnmount() {
    let div = this.dropRef.current
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }


  render() {
    return (
      <div
        style={this.props.style ?  this.props.style :{ display: 'inline-block', position: 'relative'}}
        ref={this.dropRef}
      >
      <div style={innerDivStyle}>
      <input id="file" type="file" style={invisibleFile}  onChange={this.openFile}></input>
      <label htmlFor="file" className="btn blue small">Choose a file</label>

        {this.state.dragging &&
          <div 
            style={{
              border: 'dashed grey 4px',
              backgroundColor: 'rgba(255,255,255,.8)',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0, 
              right: 0,
              zIndex: 9999
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                left: 0,
                textAlign: 'center',
                color: 'grey',
                fontSize: 36
              }}
            >
              <div>drop here :)</div>
            </div>
          </div>
        }
        {this.props.children}
        </div>
      </div>
    )
  }
}


export default DragAndDrop

const innerDivStyle = {
   display: "block",
   textAlign:"center",
   width:"100%",
}

const buttonInput = {
  width : "135px",
  backgroundColor: "#82c8a0",
}

const invisibleFile = {
  width: "0.1px",
  height: "0.1px",
  opacity: "0",
  overflow: "hidden",
  position: "absolute",
  zIndex: "-1",
}