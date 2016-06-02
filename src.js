const fs  = require('fs');
const fn  = 'data.txt', fw  = 'words.txt';
var tws = fs.readFileSync(fw,'utf8').toString().split('\n');
var tmp = fs.readFileSync(fn,'utf8').toString().split('\n');
var stm = fs.createWriteStream(fn);

//test
//////

function lrn(cnt){
  var m;
  var n = cnt+1;

  for(var i=0;i<tmp.length;i++){
    if(tws[cnt] && tws[cnt].toLowerCase().includes(tmp[i])){
      if(i===0){m=0;} else{m=1;} 
      tmp.splice(i-m,0,tmp.splice(i,1));  
    }
  }

  fs.writeFile(fn, tmp.join('\n'), (err) => {
    if (err) throw err;
  });

  console.log(cnt+'::'+tws[cnt]);

  if (cnt < 5000) {
    process.nextTick(function(){
      lrn(n);
    });    
  } 
}

lrn(2000);





function learn(cnt){
  var m;
  var n = cnt + 1;
  var wrd = tws[cnt].toLowerCase();
  var stream = fs.createWriteStream("data.txt");
  stream.once('open', function(fd) {
    for(var i=0;i<tmp.length;i++){
      if(wrd.includes(tmp[i])){
        if(i===0){m=0;}else{m=1;}
        tmp.splice(i-m,0,tmp.splice(i,1));
      }
    }
    stream.write(tmp.join('\n'));
    if (cnt < 100) {
      process.nextTick(function() { 
        learn(n) 
      });
    }
    stream.end();
  });
  
  console.log(cnt+'::'+tws[cnt]);
}

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