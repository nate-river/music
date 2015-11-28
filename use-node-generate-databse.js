var fs  = require('fs');
// var walk = function(path){
//   var r = {};
//   var files  = fs.readdirSync(path);
//   for( var i = 0; i< files.length; i++ ){
//     if( files[i] !== '.DS_Store' ){
//       var newpath = path + files[i];
//       if ( fs.statSync(newpath).isFile() ){
//         if( !r[path] ){
//           r[ path ] = [];
//         }
//         r[ path ].push(newpath);
//       }else if(fs.statSync(newpath).isDirectory() ){
//         if( !r[path] ){
//           r[ path ] = [];
//         }
//         r[ path ].push( walk( newpath+'/' ) );
//       }
//     }
//   }
//   return r;
// };
var r = [];
var walk = function(path){
  var files  = fs.readdirSync(path);
  for( var i = 0; i< files.length; i++ ){
    if( files[i] !== '.DS_Store' ){
      var newpath = path + files[i];
      if ( fs.statSync(newpath).isFile() ){
        r.push( { name:files[i],src:newpath } );
      }else if(fs.statSync(newpath).isDirectory() ){
        walk( newpath+'/' ) ;
      }
    }
  }
};
walk('./database/');
var js =  'var database=' + JSON.stringify(r);
fs.writeFile('./scripts/database.js', js, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
