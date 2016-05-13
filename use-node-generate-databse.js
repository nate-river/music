var fs   = require('fs');
var childProcess = require('child_process');

// 递归遍历文件夹 对其中的每一个文件调用 callback
var walk = function(path, callback){
  var files  = fs.readdirSync(path);
  for( var i = 0; i< files.length; i++ ){
    var newpath = path + files[i];
    if ( fs.statSync(newpath).isFile() ){
      callback(files[i],newpath);
    }else if(fs.statSync(newpath).isDirectory() ){
      walk( newpath+'/' ) ;
    }
  }
};

// 遍历./database 文件夹  对其中的音乐文件  调用ffprobe 解析音乐数据
var fileExtension = ['mp3', 'wav'];
var database = [];
walk('./database/', function(name, path){
  var extName = name.split('.').pop();
  if( fileExtension.indexOf(extName) !== -1 ){
    var path = path.trim().replace(/\s/g,'\\ ');
    var data = childProcess.execSync('ffprobe -v quiet -print_format json -show_format  ' + path);
    database.push( JSON.parse(data).format );
  }
});

// 写入js文件
var js =  'var database = ' + JSON.stringify(database, null, 4);
fs.writeFile('./scripts/database.js', js, function (err) {
  if (err){
    throw err;
  }
  console.log('saved!');
});
