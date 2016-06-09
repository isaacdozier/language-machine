//
//    Copyright: 2016
//    Author: Isaac Dozier
//    Email: isaactdozier@gmail.com
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//

const fs  = require('fs');

//read and write files
const dataFile   = 'data.txt', 
      wordsFile  = 'words.txt',
      
      //for testing purposes
      //simply create an empty file named 'testWords.txt' 
      //and make a list of words you would like to test.
      //ONE word per line only (current version | v1.0.0)
      testWordsFile = 'testWords.txt';

//read word-list of test-words-list 
//for machine learning or testing algorithm accuracy       
var words = fs.readFileSync(testWordsFile,'utf8').toLowerCase().toString().split('\n');

//call to learn language
function learn(count){
  
  //read current data.txt file
  fs.readFile(dataFile, 'utf8', function(error, data) {
    
    //clean data.txt file stream of \n \r and other seperators
    var newData = data.replace(/\r\n/g,'\n').split('\n');
    
    //loop data.txt stream
    for(var i in newData){
      
      //look for last word or other funky stuff
      //define flip and position parameters
      var check    = words[count] !== undefined;
      var noticed  = check ? words[count].indexOf(newData[i]) > -1 : false;
      var notFirst = i > 0;
      var flipWords, movePosition;
      
      //only if we find a match
      //AND
      //it's not the first in the array
      //execute word flip
      if(noticed && notFirst){
        flipWords = newData[i]+'\r\n'+newData[i-1];
        movePosition = i - 1;
        newData.splice(i-1,2);
        newData.splice(movePosition,0,flipWords)
      }
    }
    
    //write changes to data.tx file
    fs.writeFile(dataFile, newData.join('\n'), (err) => {
      if (err) {throw err;}
      
      //checking for end of words.txt or testWords.txt file
      if(words.length > count){
        
        //for humans to read
        console.log(count+'::'+words[count]);
        
        //clear stack before moving on to next cycle
        process.nextTick(function(){
          learn(count+1);
        });
      }
    });
  });
}

learn(0);


//call to build data for .txt file
//this function has been left here
//for building customized data sets
function vData(){
  var cns = 'bcdfghjklmnpqrstvwxz'.split('');
  var vls = 'aeiouy'.split('');
  var a   = [];

  //start the engine
  for(var vi=0;vi<vls.length;vi++){
    for(var ci=0;ci<cns.length;ci++){
      for(var cii=0;cii<cns.length;cii++){
        
        // Vowel - Const - Const
        a = a.concat(vls[vi] + cns[ci] + cns[cii]);
        
        // Const - Vowel - Const
        a = a.concat(cns[ci] + vls[vi] + cns[cii]);
        
        // Const - Const - Vowel
        a = a.concat(cns[ci] + cns[cii]+ vls[vi]);
        
      }
      
      // Const - Vowel
      a = a.concat(cns[ci] + vls[vi]);
      
      // Vowel - Const
      a = a.concat(vls[vi] + cns[ci]);
      
    }
    for(var vii=0;vii<vls.length;vii++){
      
      // Vowel - Vowel
      a = a.concat(vls[vi]  + vls[vii]);
      
    }
  }

  return a; 
}