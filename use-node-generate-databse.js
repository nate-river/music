var fs   = require('fs');
var exec = require('child_process').exec;
var r = [];
var f = [];
var walk = function(path){
  var files  = fs.readdirSync(path);
  for( var i = 0; i< files.length; i++ ){
    if( files[i] !== '.DS_Store' ){
      var newpath = path + files[i];
      if ( fs.statSync(newpath).isFile() ){
        r.push( newpath );
      }else if(fs.statSync(newpath).isDirectory() ){
        walk( newpath+'/' ) ;
      }
    }
  }
};
walk('./database/');
for(var i = 0; i<r.length; i++){
  exec('ffprobe '+ r[i], (function(i){
    return function (error, stdout, stderr) {
      var title =  stderr.match(/title.*/g)[0].split(':')[1].trim();
      var artist = stderr.match(/artist.*/g)[0].split(':')[1].trim();
      var album = stderr.match(/album.*/g)[0].split(':')[1].trim();
      var duration = stderr.match(/Duration.[^,]*,/g)[0].slice(-8).slice(0,-4);
      f.push({name:title,src:r[i],artisan:artist,duration:duration});
    };
  })(i));
}
setTimeout(function(){
  var js =  'var database=' + JSON.stringify(f);
  fs.writeFile('./scripts/database.js', js, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
},3000);




// exec('ffprobe ./database/1.MP3', function (error, stdout, stderr) {
//   // console.log('stdout: ' + stdout);
//   //ffprobe
//   // console.log('stderr: ' + stderr);
//   var title =  stderr.match(/title.*/g)[0].split(':')[1].trim();
//   var artist = stderr.match(/artist.*/g)[0].split(':')[1].trim();
//   var album = stderr.match(/album.*/g)[0].split(':')[1].trim();
//   var duration = stderr.match(/Duration.[^,]*,/g)[0].slice(-8).slice(0,-4);
//   console.log(title,artist,album,duration);
// });

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
