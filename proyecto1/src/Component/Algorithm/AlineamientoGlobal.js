import Algorithm from "./Algorithm";
import Cell from "./Cell";
import Timer from "../Generic/Timer/Timer";



class AlineamientoGlobal extends Algorithm {
  constructor(coincidence,diference,gap) {
  	super(coincidence,diference,gap);
  }

  solvePair(sequence1,sequence2, avialbleMemory){
  	let string1 = sequence1.data;
  	let string2 = sequence2.data;

  	let matrixResult = [];

    Timer.start();


    //initialize matrix
    //initialize x axis
    for(let m = 0; m < string1.length + 1; m++){
      matrixResult[m] = [new Cell(this.gap*m,true,false,false)];
    }
    //initialize y axis
    for(let m = 0; m < string2.length; m++){
      matrixResult[0].push(new Cell(this.gap*(m+1),false,false,true));
    }

    matrixResult[0][0].left = false;
   /* matrixResult.forEach(
      (column,index)=>{console.log("column " + index, {column})}
    )*/

    //console.log(matrixResult[2][0] )
    //s1 horizontal
    //s2 vertical
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
        }
  		}

      let duration = Timer.end();

      let result = {};
      
      
      result.data = matrixResult;
      result.optimal = [{x:string1.length,y:string2.length}];
      result.max = matrixResult[string1.length][string2.length].value;
      result.duration = duration;
      result.s1 = string1;
      result.s2 = string2;


      //let aligmentSize = Reconstructor.getStimatedSize(matrixResult,result.optimal,string1,string2);
      //console.log({aligmentSize})
      //rebuildAlignments(matrixResult,result.optimal,string1,string2);

      console.log(duration);
      return result;

  }
  


  solveArray(sequenceArray){
    
  }

}


export default AlineamientoGlobal;
