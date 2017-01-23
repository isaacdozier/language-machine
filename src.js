//
//    Copyright: 2016
//    Author: Isaac Dozier
//    Email: isaactdozier@gmail.com
//

const dataSizeMatchMsg = "Data file Size Issue (data stream does not match/sync, check that both dataNew and dataArray are working streams of data.txt file)"

const fs  = require('fs');

const alphaConst = 'bcdfghjklmnpqrstvwxz'.split('');
const alphaVowel = 'aeiouy'.split('');

//read and write files
const fileData          = 'data.txt', 
      fileRecentWords   = 'recentWords.txt',
      fileSection       = 'section.txt',
      fileHistory       = 'history.txt',
      fileEnglishWords  = 'words.txt',
      
      //testing purposes--
      //Beta testing paragraphs (current version | v1.0.1)
      fileTestWords = 'testWords.txt';

//read wordsFile or fileTestWords and convert to array   
var wordsArray = wordlistToArray(fs.readFileSync(fileTestWords,'utf8'));

//read current data.txt, history.txt files
var data    = fs.readFileSync(fileData, 'utf8');
var history = fs.readFileSync(fileHistory, 'utf8');

//clean data.txt file stream of seperators
var dataArray = data.replace(/\r\n/g,'\n').split('\n');
var dataNew   = dataArray;
var dataSection;
var dataTrail;

//check that altered data stream is not corrupted
var streamSynced = streamCheck(dataNew, dataArray);

var base = dataArray.length * 0.3;

var build   = new Object();

function streamCheck(a,b){
  //basic size match before deep check
  var equalDataSize = a.length === b.length;
  var partIdentify;
  var fullIdentify;
  var checkCleanTail;
  var hickup;
  if(equalDataSize){
    for(var i=0;i<a.length;i++){
      var equalStrSet    = a[i] === b[i];
      var equalStrOffset = a[i] === b[i+1] || b[i] === a[i+1];
      if(equalStrOffset && !partIdentify){
        partIdentify = true;
      } else if(equalStrOffset && partIdentify){
        fullIdentify = true;
      } else if(fullIdentify && !equalStrSet){
        hickup = false;
      } else if(!hickup){
        return true;
      }
    }
  } else {
    //throws error before deep stream sync check
    throw new errorMsg(dataSizeMatchMsg)
  }
};

function wordSwap(i){
  const mark = '-';
    var a    = dataNew[i]
    var b    = dataNew[i - 1];
  //check if str set is first in array
  //if so, dont do anything
  var moveable = i !== 0;
  if(streamSynced){
    if(moveable){
      if(a.indexOf(mark) > -1){
        a.replace(mark, '');
      }            
      return dataNew.splice(i - 1, 2, a + '\r\n' + b);
    }
  } else {
    throw new errorMsg(dataSizeMatchMsg);
  }
}

function recognitionCheckBasic(str){
  return 'test';
}

//main functionality
wordsArray.map(function(t,i){
  var ref   = '"(){}[]'.concat("'").split('');
  var word  = scrubRef(t,ref);
  
  //WORD
  build.word  = word;
  
  //REC
  build.rec   = recognitionCheckBasic(word);
  
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
    build.scoreAvg = arrayTotalValue(build.score) / build.score.length;
  } else {
    build.scoreAvg = Array();
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

  if(dataTrail == undefined){
    dataTrail = build.word;
  } else {
    dataTrail = dataTrail.concat(' ' + t);
  }
  
  //section seperator
  //seperates according to punctuation
  var endStatement = wordsArray.length === i;
  if(endStatement){
    if(dataSection == undefined){
      dataSection = dataTrail;
    } else {
      dataSection = dataSection.concat('\r\n' + dataTrail);
    }
    
    //write to save files
    //short term memory save
    writeFile(fileSection, dataTrail.split(' ').join('\n'));
    //history save
    writeFile(fileHistory, dataSection + '\r\n' + history);
    
    //clear section gathering
    //for next sentence
    dataTrail = null;
  }
  //
  //alter dataNew array
  //to overwrite data.txt
  dataNew.map(function(str){
    if(build.word.includes(str)){
      wordSwap(dataNew.indexOf(str));
      writeFile(fileData,    dataNew.join('\n'));
    }
  })
    
  //for the humans
  console.log(build.word + '-' + build.scoreAvg + '-' + build.rec);
});

//
//clear stack before moving on to next cycle
//
  //
  //write changes to: data.txt
  //                  history.txt
function writeFile(file,data){
  process.nextTick(function(){
  if(streamSynced){
    fs.writeFileSync(file,data,'utf8');
  }
});
}

//helper functions
function removeVowelArr(str){;
  return str.split('').filter(function(l){
    return alphaVowel.indexOf(l) > - 1;
  });
}

function scrubRef(word,refArray){
  var tmp = word;
  refArray.map(function(p){
    tmp = tmp.replace(p, '')
  });
  return tmp;
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
function arrayTotalValue(arr){
  var t = 0;
  arr.map(function(n){
    t += n;
  })
  return t;
}

//basic error message handling
function errorMsg(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    // capture stack trace 
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}