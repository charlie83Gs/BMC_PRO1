import Algorithm from "./Algorithm";
import Cell from "./Cell";
import Timer from "../Generic/Timer/Timer";


class AlineamientoSemiglobal extends Algorithm {
  constructor(coincidence,diference,gap) {
  	super(coincidence,diference,gap);
  }

  solvePair(sequence1,sequence2){
    let string1 = sequence1.data;
    let string2 = sequence2.data;

    let matrixResult = [];

    Timer.start();

    //initialize matrix
    //initialize x axis
    for(let m = 0; m < string1.length + 1; m++){
      matrixResult[m] = [new Cell(0,true,false,false)];
    }
    //initialize y axis
    for(let m = 0; m < string2.length; m++){
      matrixResult[0].push(new Cell(0,false,false,true));
    }

    matrixResult[0][0].left = false;

   /* matrixResult.forEach(
      (column,index)=>{console.log("column " + index, {column})}
    )*/

    //console.log(matrixResult[2][0] )
    //s1 horizontal
    //s2 vertical
    let maxValue = -100000000;
    let maxValueCoord = []

  	for(var s1Index = 0; s1Index < string1.length; s1Index++){
  		var currentChar = string1.charAt(s1Index);
  		for(var s2Index = 0; s2Index < string2.length; s2Index++){
  			var currentChar2 = string2.charAt(s2Index);
  			var equality = (currentChar == currentChar2) ? this.coincidence : this.diference;


  			//console.log(s1Index,s2Index)
        var  leftValue = matrixResult[s1Index][s2Index+1].value + this.gap;
        var  topValue = matrixResult[s1Index+1][s2Index].value + this.gap; 
        var  diagonalValue = matrixResult[s1Index][s2Index].value + equality;

        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));


        var left = leftValue == newValue;
        var diagonal = diagonalValue == newValue; 
        var top = topValue == newValue;

        var newCell = new Cell(newValue, left, diagonal, top);
  			matrixResult[s1Index +1].push(newCell);

        //console.log(s1Index == string1.length -1, s2Index == string2.length -1)
        //console.log({newValue,maxValue} , newValue >= maxValue)
        if((s1Index == string1.length -1 || s2Index == string2.length -1) && newValue >= maxValue){
          let newMaxValue = /*Math.max(maxValue, newValue)*/ newValue;
          //console.log(newMaxValue);
          if(newMaxValue == maxValue){
            let newCoord= {x:s1Index+1,y:s2Index+1}
            maxValueCoord.push(newCoord);
          }else{
            //reset max value coords
            maxValueCoord = []
            let newCoord= {x:s1Index+1,y:s2Index+1}
            maxValueCoord.push(newCoord);
          }
          maxValue = newMaxValue;
        }
        }
  		}

      let duration = Timer.end();

      let result = {};
      
      result.data = matrixResult;
      result.optimal = maxValueCoord;
      result.max = maxValue;
      result.duration = duration;
      result.s1 = string1;
      result.s2 = string2;

      console.log(duration);

      return result;


  }

  solveArray(sequenceArray){

  }

}

export default AlineamientoSemiglobal;

