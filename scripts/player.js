class MusicPlayer{

  constructor(selector, playlist){

    this.audio = document.querySelector(selector);

    this.playlist = playlist || [];

    // ordered unordered  cycle_single  cycle
    this.state =  'ordered';

    var index = localStorage['music_player_index'];

    if( index ){
      this.index = Number(index);
    }else{
      this.index = 0;
    }

    this.init();
  }

  init(){
    var self = this;
    self.play();
    this.oncanplay(function () {
      self.audio.play();
    });
    this.onended(function () {
      if( self.state === 'cycle_single' ){
        self.play();
      }else{
        self.next();
      }
    });
  }

  // 对歌曲列表操作
  addSong(song){
    this.playlist.push(song);
    return this;
  }
  removeSong(index){
    this.playlist = this.playlist.slice(0, index).concat(this.playlist.slice(index + 1 ));
    return this;
  }
  getSong(index){
    return this.playlist[index];
  }


  // 对播放器音量的操作
  getVolume(){
    return this.audio.volume;
  }
  setVolume(volume){
    return this.audio.volume = volume;
  }
  silence(){
    localStorage['music_player_previous_volume'] = this.getVolume();
    this.audio.volume = 0;
  }
  restoreVolume(){
    this.audio.volume = localStorage['music_player_previous_volume'];
  }
  toggleVolume(){
    if( this.audio.volume === 0 ){
      this.restoreVolume();
    }else{
      this.silence()
    }
  }

  // 播放控制 和 播放模式设置

  play(){
    this.audio.src = this.playlist[this.index].filename;
    localStorage['music_player_index'] = this.index;
  }

  pause(){
    this.audio.pause();
  }

  togglePlay(){
    if( this.audio.paused ){
      this.audio.play();
    }else{
      this.audio.pause();
    }
  }

  next(){
    if(this.state === 'ordered'){
      this.index += 1;
      if( this.index >= this.playlist.length ){
        this.index = this.playlist.length - 1;
      }
    }else if(this.state === 'unordered'){

      this.index = Math.floor( Math.random()*this.playlist.length );

    }else if(this.state === 'cycle' || this.state === 'cycle_single'){
      this.index += 1;
      if( this.index >= this.playlist.length ){
        this.index = 0;
      }
    }
    this.play();
  }
  previous(){
    if(this.state === 'ordered'){
      this.index -= 1;
      if( this.index < 0 ){
        this.index = 0;
      }
    }else if(this.state === 'unordered'){

      this.index = Math.floor( Math.random()*this.playlist.length );

    }else if(this.state === 'cycle' || this.state === 'cycle_single'){
      this.index -= 1;
      if( this.index < 0 ){
        this.index = this.playlist.length - 1;
      }
    }
    this.play();
  }

  playSong(index){
    this.index = index;
    this.play();
  }
  setState(state){
    this.state =  state;
  }


  ///对audio 原生事件的包装  方便解决兼容性问题

  onloadstart(callback){
    this.audio.addEventListener('loadstart', callback);
  }
  oncanplay(callback){
    this.audio.addEventListener('canplay', callback);
  }
  onplay(callback){
    this.audio.addEventListener('play', callback);
  }
  onpause(callback){
    this.audio.addEventListener('pause', callback);
  }
  onvolumechange(callback){
    this.audio.addEventListener('volumechange', callback);
  }
  onended(callback){
    this.audio.addEventListener('ended', callback );
  }
  onseek(callback){
    this.audio.addEventListener('seek', callback);
  }

  // 特别关照事件
  ontimeupdate(callback){
    this.audio.addEventListener('timeupdate', function (e){
      var percentage  = this.currentTime/this.duration;
      callback.call(this, percentage, e);
    });
  }
  onprogress(callback){
    this.audio.addEventListener('progress',function (e) {
      if(this.buffered.length == 0){
        return;
      }
      if(this.buffered.length > 0 && this.buffered){
        var percentage = this.buffered.end(this.buffered.length - 1) / this.duration;
        callback.call(this, percentage, e);
      }
    });
  }
}
