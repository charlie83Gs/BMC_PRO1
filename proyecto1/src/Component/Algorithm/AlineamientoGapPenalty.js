import Algorithm from "./Algorithm";
import Cell from "./Cell";
import Timer from "../Generic/Timer/Timer";



//w(0) = 0   | w(2) = 2,w(3) = 1,w(4) = 0,w(5) = 0  ... w(n) = 0
function GapPenalty(k){
	if(0) return 0;
	return -Math.max(4-k,0);

}


class AlineamientoGapPenalty extends Algorithm {
  constructor(coincidence,diference,gap) {
  	super(coincidence,diference,gap);
  }

   solvePair(sequence1,sequence2, avialbleMemory){
  	let string1 = sequence1.data;
  	let string2 = sequence2.data;

  	let matrixResult = [];
  	let matrixGap = [];

    Timer.start();


    //initialize matrix
    //initialize x axis
    let prev = 0;
    for(let m = 0; m < string1.length + 1; m++){
      let newV = prev + GapPenalty(m);
      matrixResult[m] = [new Cell(newV,true,false,false)];
      matrixGap[m] = [{l:m,t:0}];
      prev = newV;
    }
    //initialize y axis
    prev = 0;
    for(let m = 0; m < string2.length; m++){
      let newV = prev + GapPenalty(m);
      matrixResult[0].push(new Cell(newV,false,false,true));
      matrixGap[0].push({l:0,t:m});
      prev = newV;
    }
    
    //console.log(matrixResult)

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
  			//get left gaps
  			
  			var  leftGaps = matrixGap[s1Index][s2Index+1].l;
	        var  leftValue = matrixResult[s1Index][s2Index+1].value + GapPenalty(leftGaps);

	        //get top  gaps
	        var  topGaps = matrixGap[s1Index][s2Index+1].t;
	        var  topValue = matrixResult[s1Index+1][s2Index].value + GapPenalty(topGaps); 

	        var  diagonalValue = matrixResult[s1Index][s2Index].value + equality;


	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));


	        var left = leftValue == newValue;
	        var diagonal = diagonalValue == newValue; 
	        var top = topValue == newValue;

	        


	        var newCell = new Cell(newValue, left, diagonal, top);
  			matrixResult[s1Index +1].push(newCell);


  			//update gaps
	        let newGaps = {};
	        newGaps.l = left ? leftGaps + 1 : 0;
	        newGaps.t = top ? topGaps + 1 : 0;
  			matrixGap[s1Index +1].push(newGaps);

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

export default AlineamientoGapPenalty;