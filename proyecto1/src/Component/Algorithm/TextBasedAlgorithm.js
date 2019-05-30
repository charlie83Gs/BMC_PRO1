

import Algorithm from "./Algorithm";
import Cell from "./Cell";
import Timer from "../Generic/Timer/Timer";
import Sequence from '../Sequence/Sequence';



const CHUNK_SIZE = 20;
const MAX_CLUSTER_DISTANCE = 1;
//const COMPARE = 0.2; //in percentaje


//aceptance criteria must be modified for needs

class TextBasedAlgorithm extends Algorithm {
  constructor(coincidence,diference,gap) {
  	super(coincidence,diference,gap);
  }

  solvePair(sequence1,sequence2, avialbleMemory){
  	let string1 = sequence1.data;
  	let string2 = sequence2.data;
    Timer.start();


    	//split sequence two in words
       var s1Parts = string1.match(/("[^"]+"|[^"\s]+)/g);
       var s2Parts = string2.match(/("[^"]+"|[^"\s]+)/g);

       	var textPieces1 = []

	    while (s1Parts.length > 0)
		    textPieces1.push(s1Parts.splice(0, CHUNK_SIZE));

		var textPieces2 = []

	    while (s2Parts.length > 0)
		    textPieces2.push(s2Parts.splice(0, CHUNK_SIZE));
		
 
	  let highlyRelated = [];

	  textPieces1.forEach(
	  	(wordArray1,index1) => {
	  		textPieces2.forEach(
	  		(wordArray2,index2) => {
	  			let globalV = linealGlobalWordCompare(wordArray1,wordArray2,this.coincidence,this.diference,this.gap);
	  			let localV = linealLocalWordCompare(wordArray1,wordArray2,this.coincidence,this.diference,this.gap);

	  			if(globalV > 0 || localV > CHUNK_SIZE/2){
	  				let newRelation = {a:index1,b:index2};
	  				highlyRelated.push(newRelation);
	  			}

	  			//console.log({wordArray1,wordArray2,globalV,localV});
	  		}
	  		)
	  	}
	  )

	  


	  highlyRelated.sort(function(x, y) {
		  if (x.a < x.a) {
		    return -1;
		  }
		  if (x.a > x.a) {
		    return 1;
		  }
		  return 0;
		});
	  console.log(highlyRelated);
	  let groupsA = getGroups(highlyRelated,"a",MAX_CLUSTER_DISTANCE);

	  highlyRelated.sort(function(x, y) {
		  if (x.b < x.b) {
		    return -1;
		  }
		  if (x.b > x.b) {
		    return 1;
		  }
		  return 0;
		});
	  //console.log(highlyRelated);
	  let groupsB = getGroups(highlyRelated,"b",MAX_CLUSTER_DISTANCE);


	  console.log(groupsA)
	  console.log(groupsB)

	  let bigestGroup = groupsA[0];

	  groupsA.forEach(
	  	(group)=>{
	  		if(group.length > bigestGroup.length){
	  			bigestGroup = group;
	  		}
	  	}
	  )


	  groupsB.forEach(
	  	(group)=>{
	  		if(group.length > bigestGroup.length){
	  			bigestGroup = group;
	  		}
	  	}
	  )


      let duration = Timer.end();

      let result = "";
	  
	  bigestGroup.forEach(
	  	(v) => {
	  		result += textPieces1[v.a]+ " ";
	  	}
	  )
	  result += "/n"
	  bigestGroup.forEach(
	  	(v) => {
	  		result += textPieces1[v.b]+ " ";
	  	}
	  )
      
      /*result.data = matrixResult;
      result.optimal = [{x:string1.length,y:string2.length}];
      result.max = matrixResult[string1.length][string2.length].value;
      result.duration = duration;
      result.s1 = string1;
      result.s2 = string2;


      //let aligmentSize = Reconstructor.getStimatedSize(matrixResult,result.optimal,string1,string2);
      //console.log({aligmentSize})
      //rebuildAlignments(matrixResult,result.optimal,string1,string2);

      console.log(duration);*/
      return result;

  }
  


  solveArray(sequenceArray){
    
  }

}


function getGroups(relArray, key,dist){
	let groups = [];
	let group = [];
	relArray.forEach(
		(rel) => {

			if(group.length <= 0)
				group.push(rel)
			else if(Math.abs(group[group.length-1][key] - rel[key]) >= dist){
				//console.log(group[group.length-1][key],rel[key])
			//console.log(Math.abs(group[group.length-1][key] - rel[key]));
				group.push(rel)
			}else{
				group.push(rel)
				groups.push(group)
				group = [];
			}
		}
	)
	if(group.length > 0) groups.push(group);
	return groups;
}



function linealGlobalWordCompare(sequence1,sequence2,coincidence,difference,gap){

	var actualLine;
	var newLine;


	//initialize line 0
	actualLine = [];
	for (var i = sequence1.length - 1; i >= 0; i--) {
		actualLine.push(i*gap);
	}

	//solve global alignment
	for (var s2 = 0; s2 < sequence2.length; s2++) {
		var word2 = sequence2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  sequence1.length; s1++) {
			var word1 = sequence1[s1];
			var equality = word1.toLowerCase() == word2.toLowerCase() ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = s2*gap + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = s2*gap + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return actualLine[newLine.length -1];

}

function linealLocalWordCompare(sequence1,sequence2,coincidence,difference,gap){

	var actualLine;
	var newLine;
	var maxValue = -100000000000;


	//initialize line 0
	actualLine = [];
	for (var i = sequence1.length - 1; i >= 0; i--) {
		actualLine.push(0);
	}

	//solve global alignment
	for (var s2 = 0; s2 < sequence2.length; s2++) {
		var word2 = sequence2[s2];
		newLine = [];
		for (var s1 = 0 ; s1 <  sequence1.length; s1++) {
			var word1 = sequence1[s1];
			var equality = word1 == word2 ? coincidence : difference;
			//console.log({word1,word2});
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = 0 + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = 0 + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(0,Math.max(leftValue,Math.max(diagonalValue,topValue)));

	        maxValue = Math.max(newValue,maxValue);
	        
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return maxValue;

}



function linealGlobalCompare(sequence1,sequence2,coincidence,difference,gap){

	var actualLine;
	var newLine;


	//initialize line 0
	actualLine = [];
	for (var i = sequence1.length - 1; i >= 0; i--) {
		actualLine.push(i*gap);
	}

	//solve global alignment
	for (var s2 = 0; s2 < sequence2.length; s2++) {
		var char2 = sequence2.charAt(s2);
		newLine = [];
		for (var s1 = 0 ; s1 <  sequence1.length; s1++) {
			var char1 = sequence1.charAt(s1);
			var equality = char2 == char1 ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = s2*gap + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = s2*gap + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return actualLine[newLine.length -1];

}


function linealSemiGlobalCompare(sequence1,sequence2,coincidence,difference,gap){

	var actualLine;
	var newLine;
	var maxValue = -100000000000;


	//initialize line 0
	actualLine = [];
	for (var i = sequence1.length - 1; i >= 0; i--) {
		actualLine.push(0);
	}

	//solve global alignment
	for (var s2 = 0; s2 < sequence2.length; s2++) {
		var char2 = sequence2.charAt(s2);
		newLine = [];
		for (var s1 = 0 ; s1 <  sequence1.length; s1++) {
			var char1 = sequence1.charAt(s1);
			var equality = char2 == char1 ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = 0 + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = 0 + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));
	        if(s1 == sequence1.length -1 || s2 == sequence2.length -1 ){
	        	maxValue = Math.max(newValue,maxValue);
	        }
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return maxValue;

}



function linealLocalCompare(sequence1,sequence2,coincidence,difference,gap){

	var actualLine;
	var newLine;
	var maxValue = -100000000000;


	//initialize line 0
	actualLine = [];
	for (var i = sequence1.length - 1; i >= 0; i--) {
		actualLine.push(0);
	}

	//solve global alignment
	for (var s2 = 0; s2 < sequence2.length; s2++) {
		var char2 = sequence2.charAt(s2);
		newLine = [];
		for (var s1 = 0 ; s1 <  sequence1.length; s1++) {
			var char1 = sequence1.charAt(s1);
			var equality = char2 == char1 ? coincidence : difference;
			
			if(s1 > 0)//calculate left value for this slot
				var  leftValue = newLine[s1-1] + gap;
	        else
	        	var  leftValue = 0 + gap;
	        var  topValue = actualLine[s1] + gap; 

	        if(s1 > 0) //calculate diagonal value for this slot
	        	var  diagonalValue = actualLine[s1-1] + equality;
	        else
	        	var  diagonalValue = 0 + equality;

	        //console.log(leftValue,diagonalValue,topValue)
	        //the optimal value of this slot
	        var newValue = Math.max(leftValue,Math.max(diagonalValue,topValue));

	        maxValue = Math.max(newValue,maxValue);
	        
	        newLine.push(newValue);//add new value to current line

		}
		actualLine = newLine;
	}

	return maxValue;

}
/*
console.log(linealGlobalCompare("gatoabbbbc","patoabbbbc",1,-1,-2));
console.log(linealSemiGlobalCompare("gatoabbbbc","pgatoabbbbc",1,-1,-2));
console.log(linealLocalCompare("gatoabbbbc","pgatoabbbbc",1,-1,-2));
*/

let tba = new TextBasedAlgorithm(1,-1,-2);

let sq1 = new Sequence(1,"gato1","Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, ‘and what is the use of a book,’ thought Alice ‘without pictures or conversations?’ So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her. There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, ‘Oh dear! Oh dear! I shall be late!’ (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge. In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well. Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled ‘ORANGE MARMALADE’, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it. ‘Well!’ thought Alice to herself, ‘after such a fall as this, I shall think nothing of tumbling down stairs! How brave they’ll all think me at home! Why, I wouldn’t say anything about it, even if I fell off the top of the house!’ (Which was very likely true.) Down, down, down. Would the fall never come to an end! ‘I wonder how many miles I’ve fallen by this time?’ she said aloud. ‘I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—’ (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) ‘—yes, that’s about the right distance—but then I wonder what Latitude or Longitude I’ve got to?’ (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.) Presently she began again. ‘I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think—’ (she was rather glad there was no one listening, this time, as it didn’t sound at all the right word) ‘—but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?’ (and she tried to curtsey as she spoke—fancy curtseying as you’re falling through the air! Do you think you could manage it?) ‘And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere.’ Down, down, down. There was nothing else to do, so Alice soon began talking again. ‘Dinah’ll miss me very much to-night, I should think!’ (Dinah was the cat.) ‘I hope they’ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I’m afraid, but you might catch a bat, and that’s very like a mouse, you know. But do cats eat bats, I wonder?’ And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, ‘Do cats eat bats? Do cats eat bats?’ and sometimes, ‘Do bats eat cats?’ for, you see, as she couldn’t answer either question, it didn’t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, ‘Now, Dinah, tell me the truth: did you ever eat a bat?’ when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over. Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, ‘Oh my ears and whiskers, how late it’s getting!’ She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof. There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again. Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice’s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted! Alice opened the door and found that it led into a small passage, not much larger than a rat-hole: she knelt down and looked along the passage into the loveliest garden you ever saw. How she longed to get out of that dark hall, and wander about among those beds of bright flowers and those cool fountains, but she could not even get her head through the doorway; ‘and even if my head would go through,’ thought poor Alice, ‘it would be of very little use without my shoulders. Oh, how I wish I could shut up like a telescope! I think I could, if I only knew how to begin.’ For, you see, so many out-of-the-way things had happened lately, that Alice had begun to think that very few things indeed were really impossible. There seemed to be no use in waiting by the little door, so she went back to the table, half hoping she might find another key on it, or at any rate a book of rules for shutting people up like telescopes: this time she found a little bottle on it, (‘which certainly was not here before,’ said Alice,) and round the neck of the bottle was a paper label, with the words ‘DRINK ME’ beautifully printed on it in large letters. It was all very well to say ‘Drink me,’ but the wise little Alice was not going to do that in a hurry. ‘No, I’ll look first,’ she said, ‘and see whether it’s marked “poison” or not’; for she had read several nice little histories about children who had got burnt, and eaten up by wild beasts and other unpleasant things, all because they would not remember the simple rules their friends had taught them: such as, that a red-hot poker will burn you if you hold it too long; and that if you cut your finger very deeply with a knife, it usually bleeds; and she had never forgotten that, if you drink much from a bottle marked ‘poison,’ it is almost certain to disagree with you, sooner or later. However, this bottle was not marked ‘poison,’ so Alice ventured to taste it, and finding it very nice, (it had, in fact, a sort of mixed flavour of cherry-tart, custard, pine-apple, roast turkey, toffee, and hot buttered toast,) she very soon finished it off.");
let sq2 = new Sequence(2,"gato2"," once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, ‘and what is the use of a book,’ thought Alice ‘without pictures or conversations?’ So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her. There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, ‘Oh dear! Oh dear! I shall be late!’ (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge. In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well. Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled ‘ORANGE MARMALADE’, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it. ‘Well!’ thought Alice to herself, ‘after such a fall as this, I shall think nothing of tumbling down stairs! How brave they’ll all think me at home! Why, I wouldn’t say anything about it, even if I fell off the top of the house!’ (Which was very likely true.) Down, down, down. Would the fall never come to an end! ‘I wonder how many miles I’ve fallen by this time?’ she said aloud. ‘I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—’ (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) ‘—yes, that’s about the right distance—but then I wonder what Latitude or Longitude I’ve got to?’ (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.) Presently she began again. ‘I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think—’ (she was rather glad there was no one listening, this time, as it didn’t sound at all the right word) ‘—but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?’ (and she tried to curtsey as she spoke—fancy curtseying as you’re falling through the air! Do you think you could manage it?) ‘And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere.’ Down, down, down. There was nothing else to do, so Alice soon began talking again. ‘Dinah’ll miss me very , I should think!’ (Dinah was the cat.) ‘I hope they’ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I’m afraid, but you might catch a bat, and that’s very like a mouse, you know. But do cats eat bats, I wonder?’ And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, ‘Do cats eat bats? Do cats eat bats?’ and sometimes, ‘Do bats eat cats?’ for, you see, as she couldn’t answer either question, it didn’t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, ‘Now, Dinah, tell me the truth: did you ever eat a bat?’ when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over. Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, ‘Oh my ears and whiskers, how late it’s getting!’ She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof. There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again. Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice’s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted! Alice opened the door and found that it led into a small passage, not much larger than a rat-hole: she knelt down and looked along the passage into the loveliest garden you ever saw. How she longed to get out of that dark hall, and wander about among those beds of bright flowers and those cool fountains, but she could not even get her head through the doorway; ‘and even if my head would go through,’ thought poor Alice, ‘it would be of very little use without my shoulders. Oh, how I wish I could shut up like a telescope! I think I could, if I only knew how to begin.’ For, you see, so many cats playing outside with hammers lately, that Alice had begun to think that very few things indeed were really impossible. There seemed to be no use in waiting by the little door, so she went back to the table, half hoping she might find another key on it, or at any rate a book of rules for shutting people up like telescopes: this time she found a little bottle on it, (‘which certainly was not here before,’ said Alice,) and round the neck of the bottle was a paper label, with the words ‘DRINK ME’ beautifully printed on it in large letters. It was all very well to say ‘Drink me,’ but the wise little Alice was not going to do that in a hurry. ‘No, I’ll look first,’ she said, ‘and see whether it’s marked “poison” or not’; for she had read several nice little histories about children who had got burnt, and eaten up by wild beasts and other unpleasant things, all because they would not remember the simple rules their friends had taught them: such as, that a red-hot poker will burn you if you hold it too long; and that if you cut your finger very deeply with a knife, it usually bleeds; and she had never forgotten that, if you drink much from a bottle marked ‘poison,’ it is almost certain to disagree with you, sooner or later. However, this bottle was not marked ‘poison,’ so Alice ventured to taste it, and finding it very nice, (it had, in fact, a sort of mixed flavour of cherry-tart, custard, pine-apple, roast turkey, toffee, and hot buttered toast,) she very soon finished it off.");

console.log(tba.solvePair(sq1,sq2));



export default TextBasedAlgorithm;
