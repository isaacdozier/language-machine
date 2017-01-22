//
//    Copyright: 2016
//    Author: Isaac Dozier
//    Email: isaactdozier@gmail.com
//

const fs  = require('fs');

const alphaConst = 'bcdfghjklmnpqrstvwxz'.split('');
const alphaVowel = 'aeiouy'.split('');

//read and write files
const fileData          = 'data.txt', 
      fileHistory       = 'history.txt',
      fileEnglishWords  = 'words.txt',
      
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
      fileTestWords = 'testWords.txt';

//read wordsFile or fileTestWords and convert to array   
var wordsArray = wordlistToArray(fs.readFileSync(fileTestWords,'utf8'));

//read current data.txt, history.txt files
var data    = fs.readFileSync(fileData, 'utf8');
var history = fs.readFileSync(fileHistory, 'utf8');

//clean data.txt file stream of seperators
var dataArray = data.replace(/\r\n/g,'\n').split('\n');
var dataNew   = dataArray;

//check that altered data stream is not corrupted
var streamSynced = dataNew.length === dataArray.length;

var base = dataArray.length * 0.3;

var build   = new Object();
var trail   = new Object();
var section = new Object();

function wordSwap(i){
  var tmp = dataNew[i] + '\r\n' + dataNew[i - 1];
  if(streamSynced){
    dataNew.splice(i - 1, 2, tmp);
    return dataNew;
  } else {
    throw new errorMsg("file sizes do not match");
  }
}

wordsArray.map(function(t,i){
  var word       = t.replace('.', '');
  
  //WORD
  build.word  = word;
  
  //DNA
  build.dna = dataNew.filter(function(str,piece){
    return build.word.includes(str) && i < base;
  },dataNew);
  
  //SCORE
  build.score = build.dna.map(function(str){
    return dataNew.indexOf(str);
  });
  
  //SCORE-AVERAGE 
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
  
  //GATHER
  //
  //evaluate trail of words and split into sections
  //to be used in follow section seperator
  if(trail.gather == undefined){
    trail.gather = build.word;
  } else {
    trail.gather = trail.gather.concat(' ' + t);
  }
  
  //section seperator
  //seperates according to punctuation
  //variables check for period / end of sentence(statement)
  var findPeriod   = t.lastIndexOf('.') > 0;
  var endStatement = wordsArray.length - 1 === i;
  if(findPeriod || endStatement){
    if(section.evaluate == undefined){
      section.evaluate = trail.gather;
    } else {
      section.evaluate = section.evaluate.concat('\r\n' + trail.gather);
    }
    
    trail.history += trail.gather
    //clear section gathering
    //for next sentence
    delete trail.gather;
  }
  
  //alter dataNew array
  //to overwrite data.txt
  dataNew.map(function(str){
    if(build.word.includes(str)){
      wordSwap(dataNew.indexOf(str));
    }
  })
    
  //for the humans
  console.log(build);
});

//
//clear stack before moving on to next cycle
//
  //
  //write changes to: data.txt
  //                  history.txt
  
process.nextTick(function(){
  
  if(streamSynced){
    fs.writeFileSync(fileData, dataNew.join('\n'),'utf8');
    fs.writeFileSync(fileHistory, section.evaluate + '\r\n' + history,'utf8');
  } else {
    throw new errorMsg("data stream does not match - check wordSwap() function incomplete");
  }
  delete section.evaluate
});

//
//

//helper functions
function removeVowelArr(str){;
  return str.split('').filter(function(l){
    return alphaVowel.indexOf(l) > - 1;
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

//returns combined values of all numbers in array
function addArray(arr){
  var t = 0;
  arr.map(function(n){
    t += n;
  })
  return t;
}

function errorMsg(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    // capture stack trace 
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}