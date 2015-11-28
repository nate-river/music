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
        r.push( {name:files[i],path:newpath});
      }else if(fs.statSync(newpath).isDirectory() ){
        walk( newpath+'/' ) ;
      }
    }
  }
};
walk('./database/');
var pa;
for(var i = 0; i<r.length; i++){
  pa  = r[i].path.trim().replace(/\s/g,'\\ ');
  exec('ffprobe '+ pa, (function(i){
    return function (error, stdout, stderr) {
      var title_p = /title.*/g,title;
      var artist_p = /artist.*/g,artist;
      var album_p = /artist.*/g,album;
      var duration_p = /Duration.[^,]*,/g,duration;
      title     = (title_p.test(stderr))?stderr.match(/title.*/g)[0].split(':')[1].trim():r[i].name.slice(0,-4);
      artist    = (artist_p.test(stderr))?stderr.match(/artist.*/g)[0].split(':')[1].trim():' ';
      album     = (album_p.test(stderr))?stderr.match(/album.*/g)[0].split(':')[1].trim():' ';
      duration  = (duration_p.test(stderr))?stderr.match(/Duration.[^,]*,/g)[0].slice(-8).slice(0,-4):'00:00';
      // console.log(title,artist,album,duration);
      f.push({name:title,src:r[i].path,artisan:artist,duration:duration});
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
