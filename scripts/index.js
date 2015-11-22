window.onload = function(){
  var database = [
    {name:'战斗1',artisan:'网易',duration:'01:14',src:'./midea/1.MP3'},
    {name:'战斗2',artisan:'网易',duration:'01:28',src:'./midea/2.MP3'},
    {name:'战斗3',artisan:'网易',duration:'01:34',src:'./midea/3.MP3'},
    {name:'战斗4',artisan:'网易',duration:'01:25',src:'./midea/4.MP3'},
    {name:'战斗5',artisan:'网易',duration:'01:03',src:'./midea/5.MP3'},
    {name:'战斗6',artisan:'网易',duration:'01:17',src:'./midea/6.MP3'},
    {name:'战斗7',artisan:'网易',duration:'01:34',src:'./midea/7.MP3'},
    {name:'战斗8',artisan:'网易',duration:'02:03',src:'./midea/8.MP3'},
    {name:'战斗9',artisan:'网易',duration:'00:58',src:'./midea/9.MP3'},
    {name:'战斗10',artisan:'网易',duration:'01:29',src:'./midea/10.MP3'},
    {name:'战斗11',artisan:'网易',duration:'01:48',src:'./midea/11.MP3'},
    {name:'战斗12',artisan:'网易',duration:'02:26',src:'./midea/12.MP3'}
  ];
  //----------------------------------------------
  var currentIndex = 0;
  var playbt = 'cycle_bt';
  //----------------------------------------------
  // audio.onload = function(e){
  //   console.log(this.buffered,'load');
  // };
  // audio.ondurationchange = function(e){
  //   console.log(this.buffered,'durationchange');
  // };
  // audio.onloadedmetadata = function(e){
  //   console.log(this.buffered,'loadedmetadata');
  // };
  // audio.onloadeddata = function(e){
  //   console.log(this.buffered,'loadeddata');
  // };
  // audio.oncanplaythrough = function(e){
  //   //console.log(this.buffered,'canplaythrough');
  // };
  audio.onloadstart = function(e){
    downloadbar.style.width = '0%';
    spanprogress_op.style.left = '0%';
    spanplaybar.style.width = '0%';
  };
  audio.onprogress = function(){
    if(this.buffered.length == 0){
      downloadbar.style.width = '100%';
      return;
    }
    if(this.buffered.length>0 && this.buffered){
      var width = this.buffered.end(this.buffered.length-1)/this.duration*100 + '%';
      downloadbar.style.width = width;
    }
  };
  audio.oncanplay = function(){
    audio.play();
  };
  audio.onplay = function(){
    btnplay.setAttribute('class','pause_bt');
    musicop.style.display = 'block';
  };
  audio.onpause = function(){
    btnplay.setAttribute('class','play_bt');
  };
  audio.onvolumechange = function(){
    spanvolumebar.style.width = this.volume*100 + '%';
    spanvolumeop.style.left   = this.volume*100 + '%';
    if(this.volume == 0){
      spanmute.className = 'volume_mute';
    }else{
      spanmute.className = 'volume_icon';
    }
  };
  audio.onended = function(){
    if( playbt == 'cycle_bt'){
      nextsong();
    }else if(playbt == 'cycle_single_bt'){
      handlesongchange(currentIndex);
    }else if(playbt == 'ordered_bt'){
      if(currentIndex != database.length-1){
        nextsong();
      }
    }else if(playbt == 'unordered_bt'){
      var rd = Math.floor( Math.random()*database.length );
      handlesongchange(rd);
    }
  };
  //播放进度处理
  var handleprogress  = function(){
    var w  = (this.currentTime/this.duration)*100 + '%';
    spanplaybar.style.width = w;
    var w2 = spanplayer_bgbar.offsetWidth*(this.currentTime/this.duration) - 3 + 'px';
    spanprogress_op.style.left = w2;

  };
  audio.onseeked = handleprogress;
  audio.ontimeupdate = handleprogress;
  //歌曲改变处理
  var handlesongchange = (function(){
    var currentList = null;
    return function(index){
      if(currentList){currentList.setAttribute('class','li');}
      playlists[index].setAttribute('class','li play_current');
      currentList = playlists[index];
      music_name.innerHTML  = database[index].name;
      singer_name.innerHTML = database[index].artisan;
      ptime.innerHTML       = database[index].duration;
      audio.src             = database[index].src;
    };
  })();
  //播放暂停
  var playpause = function(){
    var src  = audio.getAttribute('src');
    if(!src){handlesongchange(0); return;}
    if(audio.paused){audio.play();}else{audio.pause();}
  };
  btnplay.onclick = playpause;
  //点击设置音量
  var setvolume = function(e){
    audio.volume = e.layerX/this.offsetWidth;
  };
  spanvolume.onclick = setvolume;
  spanvolumeop.onclick = function(e){e.stopPropagation();};
  spanprogress_op.onclick = function(e){e.stopPropagation();};
  spanmute.onclick = (function(){
    var prevolume;
    return function(){
      if( this.className.indexOf('icon') != -1 ){
        prevolume = audio.volume; audio.volume = 0;
      }else{audio.volume = prevolume;}
    };
  })();
  //点击设置播放时间
  var setcurrenttime =  function(e){
    audio.currentTime = audio.duration*e.layerX/this.offsetWidth;
  };
  spanplayer_bgbar.parentElement.onclick  = setcurrenttime;
  //列表点击播放
  divsonglist.onclick  = function(e){
    if(e.target == this) return;
    var el = e.target.nodeName=='LI'?e.target:e.target.parentElement;
    currentIndex = Number(el.getAttribute('index'));
    handlesongchange(currentIndex);
  };
  //下一首
  var nextsong = function(){
    if(playbt == 'unordered_bt'){
      var rd = Math.floor( Math.random()*database.length );
      handlesongchange(rd);
      return;
    }
    currentIndex  += 1;
    currentIndex   = (currentIndex == database.length)?0:currentIndex;
    handlesongchange(currentIndex);
  };
  nextbt.onclick  = nextsong;
  //上一首
  var prevsong = function(){
    if(playbt == 'unordered_bt'){
      var rd = Math.floor( Math.random()*database.length );
      handlesongchange(rd);
      return;
    }
    currentIndex  -= 1;
    currentIndex   = (currentIndex == -1)?database.length-1:currentIndex;
    handlesongchange(currentIndex);
  };
  prevbt.onclick  = prevsong;
  //创建列表
  var playlists = (function(){
    for(var i = 0; i<database.length; i++){
      var el = document.createElement('li');
      el.setAttribute('index',i);
      el.className = 'li';
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
      divsonglist.firstElementChild.appendChild(el);
    }
    spansongnum1.firstElementChild.innerHTML = database.length;
    playlists = document.getElementsByClassName('li');
    return playlists;
  })();
  for(var i = 0; i<divselect.children.length; i++){
    divselect.children[i].onclick = function(){
      this.parentElement.style.display  = 'none';
      btnPlayway.className = this.className;
      playbt = this.className;
    };
  }

  /////////////////////////////处理界面效果部分
  btnPlayway.onclick = function(){
    divselect.style.display = 'block';
  };
  spansongnum1.onclick  = function(){
    if(divplayframe.style.display == 'block'){
      $('#divplayframe').animate({opacity:0},200,function(){
        divplayframe.style.display = 'none';
      });
    }else{
      divplayframe.style.display = 'block';
      $('#divplayframe').animate({opacity:1},200);
    }
  };
  btnclose.onclick = function(){
    $('#divplayframe').animate({opacity:0},200,function(){
      divplayframe.style.display = 'none';
    });
  };
  var kaiguan = true;
  btnfold.onclick = function(){
    divplayframe.style.display = 'none';
    if(kaiguan){
      $('#divplayer').animate({left:'-540px'},200); kaiguan = false;
      divplayer.className = 'm_player m_player_folded';
    }else{
      $('#divplayer').animate({left:'0px'},200); kaiguan = true;
      divplayer.className = 'm_player';
    }
  };



  //自定义滚动条
  var onheightchange = function(){
    var pc =  divlistmain.offsetHeight / (24*database.length);
    if(pc>1){
      spanbar.parentElement.style.display = 'none';
    }else{
      spanbar.parentElement.style.display = 'block';
      spanbar.style.height = spanbar.parentElement.offsetHeight*pc + 'px';
    }
  };
  // var spanbartop = 0;
  // var playlisttop = 0;
  // divlistmain.onmousewheel  = function(e){
  //   console.log(e.wheelDelta);
  //   if(e.wheelDelta > 0){
  //     //向下滚动
  //     spanbartop += 5;
  //     spanbartop = Math.min(spanbartop,spanbar.parentElement.offsetHeight-spanbar.offsetHeight);

  //     spanbar.style.top  = spanbartop + 'px';
  //     playlisttop -= 5;
  //     playlisttop = Math.max(playlisttop,divlistmain.offsetHeight - 24*database.length);
  //     console.log(playlisttop,divlistmain.offsetHeight - 24*database.length);
  //     divplaylist.style.top = playlisttop + 'px';
  //   }else{
  //     //向上滚动
  //   }
  // };
  onheightchange();
};
