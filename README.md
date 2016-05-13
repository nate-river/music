# web音乐播放器解决方案
如何制作一个运行在浏览器中的本地音乐播放器?
本方案提供一种简单的可扩展思路.

##  获取本地音乐文件的数据信息

方案中采用开源 `ffprobe` 项目来得到多媒体文件的详细信息,包括歌曲的播放时长, `id3` 标签.

安装 `ffprobe` 访问 http://ffmpeg.org/

将所有希望本地播放的音乐文件放置在 `musics/` 目录下
然后运行

```shell
  node use-node-generate-database.js
```

在本示例中会生成一个 `database.js`,
```javascript
var database = [
  {
    "filename":"./database/1.mp3",
    "nb_streams":1,
    "nb_programs":0,
    "format_name":"mp3",
    "format_long_name":"MP2/3 (MPEG audio layer 2/3)",
    "start_time":"0.025057",
    "duration":"156.760816",
    "size":"2508914",
    "bit_rate":"128037",
    "probe_score":51,
    "tags":{
      "album":"Vivaldi : Le quattro stagioni [The Four Seasons] & Concertos",
      "artist":"Il Giardino Armonico"
    }
  },
  //....................
];
```
可以通过修改代码,把音乐数据保存到数据库或生成json文件等.


## 在web中制作音乐播放器

引入 `dabase.js` `player.js`;

```html
  <script src="./scripts/.database.js"></script>
  <script src="./scripts/player.js"></script>
```

音乐播放器界面千变万化,所以player.js中没有对界面的操作.

player.js封装了一些常用的接口

```javascript
// 构建函数必须接受的两个参数  
// 1. 页面中audio标签的标识  '.audio' '#audio'
// 2. 播放列表   
var  player = new Player('#audio', database);


// 方法:

// 从头或上次离开时的歌曲开始播放列表中的音乐
player.play();

// 暂停当前歌曲播放
player.pause();

// 切换当前歌曲播放暂停状态
player.togglePlay();

// 静音
player.silence();
// 恢复静音之前的音量
player.restoreVolume();
// 静音/复原
player.toggleSilence();

// 设置音量
player.setVolume();

// 获取音量
player.getVolume();

// 根据播放模式播放列表中的上一首
player.next();
// 根据播放模式播放列表中的下一首
player.previous();
// 设置播放模式 顺序 随机 循环 单曲循环
player.setState();

//事件

原生audio事件的封装

```

其他使用详情参见示例;
