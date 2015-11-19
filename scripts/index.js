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
  var currentMusic = database[currentIndex];
  var currentList = null;
  audio.src = currentMusic.src;

  //----------------------------------------------
  var createlist = function(){
    for(var i = 0; i<database.length; i++){
      var el = document.createElement('li');
      el.setAttribute('src',database[i].src);
      el.setAttribute('index',i);
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
  };

  divsonglist.onclick  = function(e){
    if(e.target == this) return;
    var el = e.target.nodeName=='LI'?e.target:e.target.parentElement;

    if(currentList)
      currentList.setAttribute('class','');
    el.setAttribute('class','play_current');
    currentList = el;

    audio.src = el.getAttribute('src');
    currentIndex = el.getAttribute('index');
    currentMusic = database[currentIndex];

    music_name.innerHTML = currentMusic.name;
    singer_name.innerHTML = currentMusic.artisan;
    ptime.innerHTML = currentMusic.duration;

    audio.play();
    btnplay.setAttribute('class','pause_bt');
  };

  var playpause = function(){
    if(audio.paused){
      audio.play();  this.setAttribute('class','pause_bt');
    }else{
      audio.pause(); this.setAttribute('class','play_bt');
    }
  };

  var nextsong = function(){
    if(currentList)
      currentList.setAttribute('class','');
    var next = currentList.nextElementSibling;
    next = next?next:currentList.parentElement.firstElementChild;
    next.setAttribute('class','play_current');
    currentList = next;

    currentIndex ++;
    currentIndex = (currentIndex==database.length)?0:currentIndex;
    currentMusic = database[currentIndex];
    music_name.innerHTML = currentMusic.name;
    singer_name.innerHTML = currentMusic.artisan;
    ptime.innerHTML = currentMusic.duration;

    audio.src =  currentMusic.src;
    audio.play();
    btnplay.setAttribute('class','pause_bt');
  };

  var prevsong = function(){
    if(currentList)
      currentList.setAttribute('class','');
    var prev = currentList.previousElementSibling;
    prev = prev?prev:currentList.parentElement.lastElementChild;
    prev.setAttribute('class','play_current');
    currentList = prev;

    currentIndex --;
    currentIndex = (currentIndex==-1)?database.length - 1:currentIndex;
    currentMusic = database[currentIndex];

    music_name.innerHTML = currentMusic.name;
    singer_name.innerHTML = currentMusic.artisan;
    ptime.innerHTML = currentMusic.duration;

    audio.src =  currentMusic.src;
    audio.play();
    btnplay.setAttribute('class','pause_bt');
  };

  var setvolume = function(e){
    var pc = e.layerX/this.offsetWidth;
    audio.volume = pc;
    var w  = (pc*100).toFixed(2) + '%';
    spanvolumebar.style.width = w;
    spanvolumeop.style.left = w;
  };

  var setcurrenttime =  function(e){
    var pc = e.layerX/this.offsetWidth;
    var pc2 = (e.layerX-3)/this.offsetWidth;
    var w  = (pc*100).toFixed(2) + '%';
    var w2 = (pc2*100).toFixed(2) + '%';
    spanplaybar.style.width = w;
    spanprogress_op.style.left = w2;
    audio.currentTime = audio.duration*pc;
  };
  var timeupdatehandler = function(){
    var pc = audio.currentTime/audio.duration;
    var w  = (pc*100).toFixed(2) + '%';
    spanplaybar.style.width = w;
    spanprogress_op.style.left = w;
    if(audio.ended){
      nextsong();
    }
  };

  spanmute.onclick = (function(){
    var prevstate = {};
    return function(){
      if( this.className.indexOf('icon') != -1 ){
        this.className = 'volume_mute';
        prevstate.v = audio.volume;
        prevstate.w = spanvolumebar.style.width;
        prevstate.l = spanvolumeop.style.left;
        audio.volume = 0;
        spanvolumebar.style.width = '0%';
        spanvolumeop.style.left = '0%';
      }else{
        this.className = 'volume_icon';
        audio.volume = prevstate.v;
        spanvolumebar.style.width = prevstate.w;
        spanvolumeop.style.left = prevstate.l;
      }
    };
  })();

  spansongnum1.onclick = createlist;
  btnplay.onclick = playpause;
  nextbt.onclick  = nextsong;
  prevbt.onclick  = prevsong;
  spanvolume.onclick = setvolume;
  spanplayer_bgbar.parentElement.onclick = setcurrenttime;
  audio.ontimeupdate = timeupdatehandler;

  // spanvolume.onmousedown = function(e){
  //   console.log('down');
  //   e.stopPropagation();
  //   var that = this;
  //   document.onmousemove = function(e){
  //     that.parentElement.className = 'volume adjust_volume';
  //     var pc = (e.clientX - that.getBoundingClientRect().left);
  //     pc = Math.max(0,pc);
  //     pc = Math.min(that.offsetWidth,pc);
  //     var w = ((pc/that.offsetWidth)*100).toFixed(2) + '%';
  //     // console.log(w);
  //     spanvolumebar.style.width = w;
  //     spanvolumeop.style.left = w;
  //   };
  // };
  // spanvolume.onmouseup = function(e){
  //   console.log('up');
  //   e.stopPropagation();
  //   document.onmousemove  = null;
  // };
  // document.onmouseup = function(e){
  //   console.log('d_up');
  //   document.onmousemove  = null;
  // };

};
