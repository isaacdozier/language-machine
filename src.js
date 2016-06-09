const fs  = require('fs');
const dataFile   = 'data.txt', 
      wordsFile  = 'words.txt';
      
var words = fs.readFileSync(wordsFile,'utf8').toLowerCase().toString().split('\n');

//call to learn language
function learn(count){
  fs.readFile(dataFile, 'utf8', function(error, data) {
    var newData = data.replace(/\r\n/g,'\n').split('\n');
    
    for(var i in newData){
      var noticed = words[count].indexOf(newData[i]) > -1;
      var notTop  = i > 0;
      var flipWords, movePos;
      
      if(noticed && notTop){
        flipWords = newData[i]+'\r\n'+newData[i-1];
        movePos = i - 1;
        
        newData.splice(i-1,2);
        newData.splice(movePos,0,flipWords)
      }
    }
    
    fs.writeFile(dataFile, newData.join('\n'), (err) => {
      if (err) throw err;
      
      console.log(count+'::'+words[count]);
      
      process.nextTick(function(){
        learn(count+1);
      });    
    });
  });
}

learn(0);


//call to build data.txt file
function vData(){
  var cns = 'bcdfghjklmnpqrstvwxz'.split('');
  var vls = 'aeiouy'.split('');
  var a   = [];

  // Vowel - Const - Const
  for(var vi=0;vi<vls.length;vi++){
    for(var ci=0;ci<cns.length;ci++){
      for(var cii=0;cii<cns.length;cii++){
        a = a.concat(vls[vi] + cns[ci] + cns[cii]);
        a = a.concat(cns[ci] + vls[vi] + cns[cii]);
        a = a.concat(cns[ci] + cns[cii]+ vls[vi]);
      }
      a = a.concat(cns[ci] + vls[vi]);
      a = a.concat(vls[vi] + cns[ci]);
    }
    for(var vii=0;vii<vls.length;vii++){
      a = a.concat(vls[vi]  + vls[vii]);
    }
  }

  return a; 
}