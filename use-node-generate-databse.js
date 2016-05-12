var fs   = require('fs');
var childProcess = require('child_process');

// 遍历文件夹的函数
var walk = function(path, callback){
  var files  = fs.readdirSync(path);
  for( var i = 0; i< files.length; i++ ){
    if( files[i] !== '.DS_Store' ){
      var newpath = path + files[i];
      if ( fs.statSync(newpath).isFile() ){
        callback(files[i],newpath);
      }else if(fs.statSync(newpath).isDirectory() ){
        walk( newpath+'/' ) ;
      }
    }
  }
};

// 调用ffprobe 解析音乐数据
var database = [];
walk('./database/', function(name,path){
    var path = path.trim().replace(/\s/g,'\\ ');
    var data = childProcess.execSync('ffprobe -v quiet -print_format json -show_format  ' + path);
    database.push( JSON.parse(data).format );
});

// 写入js文件
var js =  'var database = ' + JSON.stringify(database);
fs.writeFile('./scripts/database.js', js, function (err) {
  if (err){
    throw err;
  }
  console.log('saved!');
});
