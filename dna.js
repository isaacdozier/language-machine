//call to build data for data.txt file
//this function has been left
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