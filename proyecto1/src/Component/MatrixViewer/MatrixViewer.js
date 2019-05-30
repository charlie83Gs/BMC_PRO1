import React, { Component } from 'react';
import PropTypes from 'prop-types';
import P5Wrapper from 'react-p5-wrapper';


class MaxtrixViewer extends Component {
  constructor(){
    super();
    this.state = {
    }
  }

  render() {
    return (
      <div>
         <P5Wrapper sketch={drawMatrix} data = {this.props.data} sequence1={this.props.sequence1} sequence2={this.props.sequence2}></P5Wrapper>
      </div>
    );
  }
}

export default MaxtrixViewer;

MaxtrixViewer.propTypes = {
  data: PropTypes.object.isRequired
};

const horizontalScroll = {
  backgroundColor: "#333",
  overflow: "auto",
  whiteSpace: "nowrap",
  marginTop: "10px",
  textAlign: 'center',
};



















//scketch
let squareSize = 50;


function drawMatrix(p){
    let canvas;
    let matrixData;
    let optimalResultMap;
    let sequence1 ="";
    let sequence2 ="";

    let xDisp = 0;
    let yDisp = 0;
    let zoom = 1;
    let zoomSpeed = 0.0005;


    p.setup = () => {
      canvas = p.createCanvas(window.innerWidth, window.innerHeight*0.8);
      //p.noStroke();
      p.stroke(255);
    }


    p.draw = () => {
      //matrix translation
      if(!matrixData) return;

      p.background('#707070');
      p.push();
      p.scale(zoom);
      p.translate(xDisp,yDisp);
      

      //p.background('#FFFFFF');
      //p.ellipse(150, 100, 100, 100);
      let xlength = matrixData.length;
      let ylength = matrixData[0].length;
      let halfSq = squareSize/2;
      
     //console.log({xlength,ylength})

     let initialX = Math.max(0,Math.floor(-xDisp / squareSize));
     let finalX = Math.min(xlength,Math.ceil(( p.width/zoom - xDisp )/squareSize));

     let initialY = Math.max(0,Math.floor(-yDisp / squareSize));
     let finalY  =Math.min(ylength,Math.ceil(( p.height/zoom - yDisp )/squareSize));

     //console.log({initialX,finalX});
    // console.log({initialY,finalY});

    

      for (var x = initialX; x < finalX; x++) {
        for (var y = initialY; y < finalY; y++) {
          var currentCell = matrixData[x][y];
          var canvasX = x*squareSize;
          var canvasY = y*squareSize;

          p.strokeWeight(1);
          p.fill("#404040");
          p.stroke(255);
          //console.log(x+"__"+y);
          if(optimalResultMap[x+"_"+y]) p.fill(100,180,100);
          p.rect(canvasX,canvasY,squareSize,squareSize);
          p.noStroke();
          p.fill(255)
          p.text(currentCell.value ,canvasX + halfSq,canvasY + halfSq);

          //draw matrix paths
          p.stroke("#C0C0C0A0");
          p.strokeWeight(2);
          if(currentCell.left){
            p.line(canvasX + halfSq,canvasY + halfSq , canvasX + halfSq -squareSize, canvasY + halfSq);

            //draw line head
            p.line(canvasX + halfSq -squareSize/2 , canvasY + halfSq , canvasX + halfSq -squareSize/4 , canvasY + halfSq +squareSize/8);
            p.line(canvasX + halfSq -squareSize/2 , canvasY + halfSq , canvasX + halfSq -squareSize/4 , canvasY + halfSq -squareSize/8);
          } 
          if(currentCell.diagonal){
            p.line(canvasX + halfSq,canvasY + halfSq , canvasX + halfSq -squareSize, canvasY + halfSq -squareSize);

            p.line(canvasX + halfSq -squareSize/2,canvasY + halfSq -squareSize/2 , canvasX + halfSq - squareSize/2.4 ,canvasY + halfSq - squareSize/4);
            p.line(canvasX + halfSq -squareSize/2,canvasY + halfSq -squareSize/2 , canvasX + halfSq - squareSize/4 ,canvasY + halfSq - squareSize/2.4);

          }
          if(currentCell.top){
            p.line(canvasX + halfSq,canvasY + halfSq , canvasX + halfSq , canvasY + halfSq -squareSize);

            //draw line head
            p.line(canvasX + halfSq , canvasY + halfSq -squareSize/2, canvasX + halfSq +squareSize/8, canvasY + halfSq -squareSize/4);
            p.line(canvasX + halfSq , canvasY + halfSq -squareSize/2, canvasX + halfSq -squareSize/8 , canvasY + halfSq -squareSize/4);
          }

        }
      }
      //console.log(mousePressed);

      p.pop();

       //draw header
      p.scale(zoom);
      p.noStroke();
      
      for (var i = initialX; i < finalX; i++) {
         var currentChar = sequence1.charAt(i);
         p.fill(255);
         p.ellipse(squareSize + i*squareSize + xDisp + halfSq - p.textWidth(currentChar)/2,5,halfSq,halfSq);
         p.fill(0);
         p.text(currentChar, squareSize + i*squareSize + xDisp + halfSq/2,10);
       }

      for (var i = initialY; i < finalY; i++) {
         var currentChar = sequence2.charAt(i);
         p.fill(255);
         p.ellipse(15,squareSize +i*squareSize + yDisp +halfSq/1.5,halfSq,halfSq);
         p.fill(0);
         p.text(currentChar,10, squareSize +i*squareSize + yDisp +halfSq);
       }

      }

    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
      matrixData = newProps.data.data;
      //console.log(matrixData)

      let optimal = newProps.data.optimal;
      if(newProps.sequence1)
      sequence1 = newProps.sequence1;
      if(newProps.sequence2)
      sequence2 = newProps.sequence2;


      optimalResultMap = {};
      //craete optimal result map
      optimal.forEach(
        (coord) =>  {
          optimalResultMap[coord.x +"_" + coord.y] = true;
        }
      )


      //reset position and zoom
      xDisp = 0;
      yDisp = 0;
      zoom = 1;

      //console.log(optimalResultMap)
      //console.log({sequence1,sequence2})

      //if(canvas) //Make sure the canvas has been created
        //p.fill(newProps.color);
    }

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth*0.95, window.innerHeight*0.8);
    }


    p.mouseDragged = (event) => {
      //console.log(event);
      //console.log(event.movementX);
      xDisp += event.movementX*3;
      yDisp += event.movementY*3;
    }

    p.mouseWheel = (event) => {

      zoom -= event.delta * zoomSpeed;
      zoom = Math.max(zoom,0.5);
      zoom = Math.min(zoom,1.5);

      //console.log(zoom);
      //uncomment to block page scrolling
      //return false;
    }


}

