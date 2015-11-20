window.onload = function(){
  var database = [
    {name:'战斗1',artisan:'网易',duration:'01:14',src:'./midea/1.mp3'},
    {name:'战斗2',artisan:'网易',duration:'01:28',src:'./midea/2.mp3'},
    {name:'战斗3',artisan:'网易',duration:'01:34',src:'./midea/3.mp3'},
    {name:'战斗4',artisan:'网易',duration:'01:25',src:'./midea/4.mp3'},
    {name:'战斗5',artisan:'网易',duration:'01:03',src:'./midea/5.mp3'},
    {name:'战斗6',artisan:'网易',duration:'01:17',src:'./midea/6.mp3'},
    {name:'战斗7',artisan:'网易',duration:'01:34',src:'./midea/7.mp3'},
    {name:'战斗8',artisan:'网易',duration:'02:03',src:'./midea/8.mp3'},
    {name:'战斗9',artisan:'网易',duration:'00:58',src:'./midea/9.mp3'},
    {name:'战斗10',artisan:'网易',duration:'01:29',src:'./midea/10.mp3'},
    {name:'战斗11',artisan:'网易',duration:'01:48',src:'./midea/11.mp3'},
    {name:'战斗12',artisan:'网易',duration:'02:26',src:'./midea/12.mp3'}
  ];
  //----------------------------------------------
  var currentIndex = 0;
  var playlists;
  var currentMusic = null;
  var currentList = null;
  //----------------------------------------------
  audio.oncanplay = function(){
    audio.play();
  };
  audio.onplay = function(){
    btnplay.setAttribute('class','pause_bt');
  };
  audio.onpause = function(){
    btnplay.setAttribute('class','play_bt');
  };
  audio.onvolumechange = function(){
    spanvolumebar.style.width = (this.volume*100).toFixed(2) + '%';
    spanvolumeop.style.left   = (this.volume*100).toFixed(2) + '%';
  };
  audio.onended = function(){
    nextsong();
  };

  //播放进度处理
  var handleprogress  = function(){
    var w  = this.currentTime/this.duration;
    var progress = (w*100).toFixed(2) + '%';
    spanprogress_op.style.left = progress;
    spanplaybar.style.width = progress;
  };
  audio.onseeked = handleprogress;
  audio.ontimeupdate = handleprogress;

  //歌曲改变处理
  var handlesongchange = function(index){
    if(currentList){
      currentList.setAttribute('class','li');
    }
    playlists[index].setAttribute('class','li play_current');
    currentList = playlists[index];
    currentMusic = database[index];
    music_name.innerHTML  = currentMusic.name;
    singer_name.innerHTML = currentMusic.artisan;
    ptime.innerHTML       = currentMusic.duration;
    audio.src             =  currentMusic.src;
  };
  // audio.onload

  //列表点击
  divsonglist.onclick  = function(e){
    if(e.target == this) return;
    var el = e.target.nodeName=='LI'?e.target:e.target.parentElement;
    currentIndex = Number(el.getAttribute('index'));
    handlesongchange(currentIndex);
  };

  //播放暂停
  var playpause = function(){
    var src  = audio.getAttribute('src');
    if(!src){
      handlesongchange(0);
    }
    if(audio.paused){audio.play();}else{audio.pause();}
  };
  btnplay.onclick = playpause;

  //下一首
  var nextsong = function(){
    currentIndex  += 1;
    currentIndex   = (currentIndex == database.length)?0:currentIndex;
    handlesongchange(currentIndex);
  };
  nextbt.onclick  = nextsong;

  //上一首
  var prevsong = function(){
    currentIndex  -= 1;
    currentIndex   = (currentIndex == -1)?database.length-1:currentIndex;
    handlesongchange(currentIndex);
  };
  prevbt.onclick  = prevsong;

  //点击设置音量
  var setvolume = function(e){
    console.log(e.layerX);
    var pc = e.layerX/this.offsetWidth;
    audio.volume = pc;
  };

  spanvolume.onclick = setvolume;
  spanvolumeop.onclick = function(e){e.stopPropagation();};
  spanprogress_op.onclick = function(e){e.stopPropagation();};

  spanmute.onclick = (function(){
    var prevolume;
    return function(){
      if( this.className.indexOf('icon') != -1 ){
        this.className = 'volume_mute';
        prevolume = audio.volume; audio.volume = 0;
      }else{
        this.className = 'volume_icon'; audio.volume = prevolume;
      }
    };
  })();

  //点击设置播放时间
  var setcurrenttime =  function(e){
    var pc = e.layerX/this.offsetWidth;
    audio.currentTime = audio.duration*pc;
  };
  spanplayer_bgbar.parentElement.onclick  = setcurrenttime;

  //创建列表
  var createlist = function(){
    for(var i = 0; i<database.length; i++){
      var el = document.createElement('li');
      el.setAttribute('src',database[i].src);
      el.setAttribute('index',i);
      el.className = 'li';
      divsonglist.firstElementChild.appendChild(el);
      el.innerHTML = '<strong class="music_name" title="'+database[i].name+'">'+database[i].name+'</strong> ' +
        ' <strong class="singer_name" title="'+database[i].artisan+'">'+database[i].artisan+'</strong>' +
        ' <strong class="play_time">'+database[i].duration+'</strong> ' +
        ' <div class="list_cp"> ' +
        ' <strong class="btn_like" title="喜欢" name="" mid="004fQTu016b9W4">'+
        '   <span>我喜欢</span> ' +
        '  </strong> ' +
        '  <strong class="btn_share" title="分享"> <span>分享</span> </strong>' +
        '  <strong class="btn_fav" title="收藏到歌单"> <span>收藏</span> </strong>' +
        '  <strong class="btn_del" title="从列表中删除"> <span>删除</span> </strong> ' +
        '  </div> ';
    }
    playlists = document.getElementsByClassName('li');
  };
  createlist();
};
