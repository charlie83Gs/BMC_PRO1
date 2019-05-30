
const MAX_ALIMENT_SIZE = 10737418240; //10GB
var total = 0;
async function reconstruct(AligmentMatrix, optimaArray,string1,string2,callback){
  total = 0;
  let stimated = getStimatedSize(AligmentMatrix, optimaArray,string1,string2);
  if(stimated > MAX_ALIMENT_SIZE){if(callback) callback(false); return;}

  var fileStream = streamSaver.createWriteStream('alignment.txt')
  var writer = fileStream.getWriter();
  for (var i = optimaArray.length - 1; i >= 0; i--) {
    var optimal = optimaArray[i];

    await streamRecursiveBuild(AligmentMatrix,optimal.x,optimal.y,string1,string2,writer);

  }
  writer.close();  
  if(callback) callback(true);

}



async function reconstructIterative(AligmentMatrix, optimaArray,string1,string2,callback){
  total = 0;
  let stimated = getStimatedSize(AligmentMatrix, optimaArray,string1,string2);
  if(stimated > MAX_ALIMENT_SIZE){if(callback) callback(false); return;}

  var fileStream = streamSaver.createWriteStream('alignment.txt')
  var writer = fileStream.getWriter();

  for (var i = optimaArray.length - 1; i >= 0; i--) {
    var optimal = optimaArray[i];
    await streamIterativeBuild(AligmentMatrix,optimal.x,optimal.y,string1,string2,writer);

  }

  writer.close();  
  if(callback) callback(true);

}

const streamSaver = require("streamsaver");


const  encoder = new TextEncoder()


async function streamIterativeBuild(AligmentMatrix,x,y,string1,string2,writer){
  let result = createNode(x,y);
  result.p1 = "";
  result.p2 = "";
  //console.log(result);
  let working = [];
  let total = 1;
  let maxString = Math.max(string1.length,string2.length)*2;

  working.push(result);
  while(working.length > 0){
    let currentNode = working.pop();



    x = currentNode.x;
    y = currentNode.y;

    if(x == 0 && y == 0){
      let encodedA = encoder.encode(currentNode.p1 + "\n");
      let encodedB = encoder.encode(currentNode.p2 + "\n\n");
      total++;
      await writer.write(encodedA);
      await writer.write(encodedB);

      if(total %1000 == 0)
      console.log(total);
    }

    //console.log(currentNode);
    let currentCell = AligmentMatrix[x][y];

    if(currentCell.left && x > 0) {
      let newNode = createNode(x-1,y);
      newNode.p1 = string1.charAt(x-1) + currentNode.p1;
      newNode.p2 = "_" + currentNode.p2;
      working.push(newNode);
    }
    if(currentCell.diagonal && x > 0 &&  y > 0) {
      let newNode = createNode(x-1,y-1);
      newNode.p1 = string1.charAt(x-1) + currentNode.p1;
      newNode.p2 = string2.charAt(y-1) + currentNode.p2;
      working.push(newNode);
      }
    if(currentCell.top && y > 0) {
      let newNode = createNode(x,y-1);
      newNode.p1 = "_"  + currentNode.p1;
      newNode.p2 = string2.charAt(y-1) + currentNode.p2;
      working.push(newNode);

    }

    }

    
    return;

}


async function streamRecursiveBuild(AligmentMatrix,x,y,string1,string2,writer){
    
    //console.log(writer);
    let res2 = await buildRecursive(AligmentMatrix,x,y,string1,string2,"","",writer);
    
    

}





//depth first build alignments
async function  buildRecursive(AligmentMatrix,x,y,string1,string2,acumulatedA,acumulatedB,writer){
    if(x == 0 && y == 0){
      let encodedA = encoder.encode(acumulatedA + "\n");
      let encodedB = encoder.encode(acumulatedB + "\n\n");

      total++;
      //writer.ready;
      await writer.write(encodedA);
      await writer.write(encodedB);

      //await for writer to be ready again
      var sleeping = true;
      /*writer.ready.then(() => {
      console.log("Not sleeping");
      sleeping = false;
      }).catch((e) =>{console.log("Not sleeping")});
      while(sleeping){};*/

      if(total %1000 == 0)
      console.log(total);
      return;
    }
    //console.log(x,"--",AligmentMatrix.length,"|",y,"--",AligmentMatrix[0].length);
    let currentCell = AligmentMatrix[x][y];
    //stop condition
    


    if(currentCell.left && x > 0) {
        await buildRecursive(AligmentMatrix,x-1,y,string1,string2,
                       string1.charAt(x) + acumulatedA,
                       "_" + acumulatedB,
                       writer);
    }

    if(currentCell.diagonal && x > 0 &&  y > 0) {
        await buildRecursive(AligmentMatrix,x-1,y-1,string1,string2,
                       string1.charAt(x) + acumulatedA,
                       string2.charAt(y) + acumulatedB,
                       writer);

    }

    if(currentCell.top && y > 0) {
      await buildRecursive(AligmentMatrix,x,y-1,string1,string2,
                       "_" + acumulatedA,
                        string2.charAt(y)+ acumulatedB,
                        writer);
    }
    


    return;

}



/*
function awaitWrite(asyncAwaitedFunction){
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {asyncAwaitedFunction.then( ()=> {resolve(true)})}, 1000) // resolve
  })

  await promise;

}*/
function getStimatedSize(AligmentMatrix, optimalArray,string1,string2){
  let total = 0;
  optimalArray.forEach(
    (optimal) => {
      total += getPartialStimatedSize(AligmentMatrix, optimal.x,optimal.y,string1,string2);
    }
  );
  return total;
}


function getPartialStimatedSize(AligmentMatrix,x,y,string1,string2){
   let result = createNode(x,y);
  //console.log(result);
  let working = [];
  let total = 1;
  let maxString = Math.max(string1.length,string2.length)*2;

  working.push(result);
  while(working.length > 0){
    let currentNode = working.pop();

    var pendingPieces = 0;

    x = currentNode.x;
    y = currentNode.y;

    //console.log(currentNode);
    let currentCell = AligmentMatrix[x][y];

    if(currentCell.left && x > 0) {
      let newNode = createNode(x-1,y);
      working.push(newNode);
      pendingPieces++;

    }
    if(currentCell.diagonal && x > 0 &&  y > 0) {
      let newNode = createNode(x-1,y-1);
      working.push(newNode);
      pendingPieces++;

      }
    if(currentCell.top && y > 0) {
      let newNode = createNode(x,y-1);
      working.push(newNode);
      pendingPieces++;

    }

    if(pendingPieces > 0) {
      total *= pendingPieces;
      if(MAX_ALIMENT_SIZE < maxString *total){
        console.log("Aligments: ", total);
        return maxString *total;
      }
      //console.log(total);
    }

    }

    
    return maxString * total;
}

function createNode(x,y){
  let newNode = {};
  //newNode.c = c;
  newNode.x = x;
  newNode.y = y;
  //newNode.v1 = v1;
  //newNode.v2 = v2;

  return newNode;
}

function rebuildAlignment(AligmentMatrix,x,y,string1,string2){
  let resultsA = [""];
  let resultsB = [""];

  let result = createNode(x,y);
  //console.log(result);
  let working = [];
  working.push(result);
  while(working.length > 0){
    let currentNode = working.pop();

    var newPieces = [];

    x = currentNode.x;
    y = currentNode.y;
    //console.log(currentNode);
    let currentCell = AligmentMatrix[x][y];
      
    //console.log({currentCell,x,y})
    //creates diferent comparisons
    if(currentCell.left && x > 0) {
        let newNode = createNode(x-1,y);
        //currentNode.c.push(newNode);
        working.push(newNode);

        let newPiece = {};
        newPiece.v1 = string1.charAt(x);
        newPiece.v2 = "_";
        newPieces.push(newPiece);
    }
    if(currentCell.diagonal && x > 0 &&  y > 0) {
        let newNode = createNode(x-1,y-1);
        //currentNode.c.push(newNode);
        working.push(newNode);

        let newPiece = {};
        newPiece.v1 = string1.charAt(x);
        newPiece.v2 = string2.charAt(y);
        newPieces.push(newPiece);

      }
    if(currentCell.top && y > 0) {
        let newNode = createNode(x,y-1);
        //currentNode.c.push(newNode);
        working.push(newNode);

        let newPiece = {};
        newPiece.v1 = "_";
        newPiece.v2 = string2.charAt(y);
        newPieces.push(newPiece);

      }
 


    //update al posible alignments
    if(newPieces.length > 0){
    var newResultA = [];
    var newResultB = [];
    newPieces.forEach(
        (piece) => {
            resultsA.forEach((r) => {
              r = piece.v1 + r;
              newResultA.push(r);
            })
            resultsB.forEach((r) => { 
              r = piece.v2 + r;
              newResultB.push(r);
            })
        }
    )
    resultsA = newResultA;
    resultsB = newResultB;
    }
    console.log({resultsA,resultsB});

  

  }


  
  return result;

}

let Reconstructor = {};
Reconstructor.reconstruct = reconstruct;
Reconstructor.reconstructIterative = reconstructIterative;
Reconstructor.getStimatedSize = getStimatedSize;

export default Reconstructor;
