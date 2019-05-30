// your code goes here

const DNA_ENCODING = {
	A: 0,
	C: 1,
	T: 2,
	G: 3,
	"0": "A",
	"1": "C",
	"2": "T",
	"3": "G",
}

const RNA_ENCODING = {
	A: 0,
	C: 1,
	U: 2,
	G: 3,
	"0": "A",
	"1": "C",
	"2": "U",
	"3": "G",
}


function compress(sequence,encoding){
	let encodignLenght = Object.keys(encoding).length;
	let bitsPerChar = Math.ceil(Math.sqrt(encodignLenght));
	let result = 0;
	for (var i = 0; i < sequence.length; i++) {
  		let currentChar = sequence.charAt(i);
  		let currentValue = encoding[currentChar];
  		console.log("index:" + i + "----" + currentValue + "----" + result);
  		if(currentValue){
  			//move bits left
  			result = result << bitsPerChar;
  			result += currentValue;
  		}

	}

	let compresedString = "";
	while(result > 0){
		let currentCharValue = result%256;
		console.log(currentCharValue);
		compresedString = String.fromCharCode(currentCharValue) + compresedString;
		result /= 256;
		result  = Math.floor(result);
	}

	return compresedString;
	
}


function decompress(sequence,encoding){
	let encodignLenght = Object.keys(encoding).length;
	let bitsPerChar = Math.ceil(Math.sqrt(encodignLenght));
	let mask = getBitMask(bitsPerChar);
	let decompressedString = "";
	for (var i = 0; i < sequence.length; i++) {
  		var currentChar = sequence.charAt(i);
  		//decode char
  		var decoded = "";
  		var charNumber = currentChar.charCodeAt(0);
  		for(var c = 0; c < bitsPerChar;c++){
  			var actualPart = charNumber & mask;
  			//console.log(actualPart,encoding[charNumber],encoding);
  			console.log(actualPart,encoding[actualPart],encoding);
  			decoded = encoding[actualPart] + decoded;
  			charNumber >> bitsPerChar;
  		}
  		decompressedString += decoded;
	}

	return decompressedString;

}


function getBitMask(number){
	let mask = 0;
	for(var i = 0; i < number; i++){
		mask << 1;
		mask++;
	}
	return mask;
}

/*
let original = "ACCTGGGCACT";
let compresed = compress(original,DNA_ENCODING);
let decompresed = decompress(compresed,DNA_ENCODING);


console.log(original);
console.log(compresed);
console.log(decompresed);
*/