//
//    Copyright: 2016
//    Author: Isaac Dozier
//    Email: isaactdozier@gmail.com
//

const fs  = require('fs');

const alphaConst = 'bcdfghjklmnpqrstvwxz'.split('');
const alphaVowel = 'aeiouy'.split('');

//read and write files
const dataFile          = 'data.txt', 
      dataHistory       = 'history.txt',
      englishWordsFile  = 'words.txt',
      
      //testing purposes--
      //create an empty .txt file named 'testWords' 
      //make a list of words you would like to test.
      //
      //  example:
      //    house
      //    furnace
      //    bounce
      //    [etc]...
      //
      //ONE word per line only (current version | v1.0.0)
      testWordsFile = 'testWords.txt';

//read wordsFile or testWordsFile and convert to array   
var readWords = wordlistToArray(fs.readFileSync(testWordsFile,'utf8'));

//read current data.txt, history.txt files
var data = fs.readFileSync(dataFile, 'utf8');
var history = fs.readFileSync(dataHistory, 'utf8');

//clean data.txt file stream of seperators
var cleanData = data.replace(/\r\n/g,'\n').split('\n');

//assume <language>
var call   = true,
    likely = 100,
    
    //decision base factors
    rBase = data.length * 0.05,
    sBase = data.length * 0.03; 

var build   = new Object();
var trail   = new Object();
var section = new Object();

function alterData(here){
  cleanData.splice(here - 1, 2);
  cleanData.splice(here, 0, cleanData[here] + '\r\n' + cleanData[here - 1]);
  return cleanData;
}

var isIt = function(score){
  return score > sBase;
}

readWords.map(function(t,i){
  var word       = t.replace('.', '');
  var findPeriod = word.lastIndexOf('.') > 0;
  
  //WORD
  build.word  = word;
  
  //DNA
  build.dna = cleanData.filter(function(str,piece){
    return build.word.includes(str) && i < rBase;
  },cleanData);
  
  //STAGE ONE
  //use these for stage one checks
  var isLength = build.word.length > 2;
  var isEqual  = build.dna.indexOf(word) > 0;
      //build falsy object
      build.stageOne = isEqual && isLength;
  
  //SCORE
  build.score = build.dna.map(function(str){
    return cleanData.indexOf(str);
  });
  
  //SCORE 
  if(build.score.length > 0){
    build.scoreAverage = addArray(build.score) / build.score.length;
  } else {
    build.scoreAverage = Array();
  }
  
  //CONST
  build.const = alphaConst.filter(function(str){
    return build.dna.toString().includes(str);
  });
  
  //VOWEL
  build.vowel = alphaVowel.filter(function(str){
    return build.dna.toString().includes(str);
  });
  
  //evaluate trail of words and split into sections
  //to be used in follow section seperator
  if(trail.gather == undefined){
    trail.gather = build.word;
  } else {
    trail.gather = trail.gather.concat(' ' + t);
  }
  
  //section seperator
  //seperates according to punctuation
  if(findPeriod || readWords.length === i+1){
    if(section.evaluate == undefined){
      section.evaluate = trail.gather;
    } else {
      section.evaluate = section.evaluate.concat('\r\n' + trail.gather);
    }
    
    //clear section gathering
    //for next sentence
    delete trail.gather;
  }
  
  build.recognized = build.scoreAverage < sBase;
  
  cleanData.map(function(str){
    if(build.word.includes(str)){
      alterData(cleanData.indexOf(str));
    }
  })
    
  //for the humans
  console.log(build);
});

//
//STRICT --- DO NOT EDIT OR REMOVE
//clear stack before moving on to next cycle
//
  //
  //write changes to: data.txt
  //                  history.txt
  
process.nextTick(function(){
  fs.writeFileSync(dataFile, cleanData.join('\n'),'utf8');
  fs.writeFileSync(dataHistory, section.evaluate + '\r\n' + history,'utf8');
  
  delete section.evaluate
});
//
//END STRICT
//

//helper functions
function removeVowelArr(str){;
  return str.split('').filter(function(l){
    return alphaVowel.indexOf(l) > -1;
  });
}

function wordlistToArray(data){
  
  //trim whitespace line-by-line
  data = data.split('\n').map(function(line){
    return line.trim();
  }).join('\n');
  
  //seperate words line-by-line
  data = data.replace(/ /g,'\n');
  
  //return data as array
  return data.toLowerCase().toString().split('\n');
}

function addArray(arr){
  var t = 0;
  arr.map(function(n){
    t += n;
  })
  return t;
}


//loop data.txt stream
/*
for(var i in dna){
  
  //basic variables for searching
  var len = cleanData[i].length;
  
  //look for last word or other funky stuff
  var check    = words[count] !== undefined;
  var noticed  = check ? words[count].indexOf(cleanData[i]) > -1 : false;
  
  //define new pair and position parameter
  var newPair, movePosition;
  
  //only if we find a match
  //AND
  //it's not the first in the array
  //execute word flip
  if(noticed){
    
    //define new pair set
    //define set position
    newPair      = cleanData[i]+'\r\n'+cleanData[i-1];
    movePosition = i - 1;
    
    //remove old pair
    //add new pair
    cleanData.splice(i-1,2);
    cleanData.splice(movePosition,0,newPair);
    
    //add up found string position
    //add up found strings count 
    //if less-than postion base
    if(i < base && len == 2){
      addBase += i;
      addCount++;
    } else {
      likely--;
    }
    
    addReal = addBase / addCount;
  }
}
*/
