class MusicPlayer{
  constructor(selector, playlist){
    this.el = document.querySelector(selector);
    this.playlist = playlist||[];
    var index = localStorage['index.beo.com'];
    if( index ){
      this.index = Number(index);
    }else{
      this.index = 0;
    }
    this.init();
  }

  init(){
    this.el.addEventListener('loadstart',function(){
      console.log('song change, start load');
    })
    this.el.addEventListener('progress', function(){
      console.log('loading');
      if(this.buffered.length == 0){
        return;
      }
      if(this.buffered.length > 0 && this.buffered){
        var percentage = this.buffered.end(this.buffered.length - 1) / this.duration * 100;
        console.log(percentage);
      }
    })
    this.el.addEventListener('canplay', function () {
      console.log('now this song can play');
      this.play();
    });
  }

  addSong(song){
    this.playlist.push(song);
  }
  removeSong(index){
    this.playlist = this.playlist.slice(0,index).join( this.playlist.slice(index + 1 ) );
  }
  getSong(index){
    return this.playlist[index];
  }

  play(){
    this.el.src = this.playlist[this.index].filename;
    localStorage['index.beo.com'] = this.index;
  }
  pause(){
    this.el.pause();
  }
  togglePlay(){
    if( this.el.paused ){
      this.el.play();
    }else{
      this.el.pause();
    }
  }

  getVolume(){
    return this.el.volume;
  }
  setVolume(volume){
    return this.el.volume = volume;
  }
  silence(){
    localStorage['previousVolume.beo.com'] = this.getVolume();
    this.el.volume = 0;
  }
  restoreVolume(){
    this.el.volume = localStorage['previousVolume.beo.com'];
  }

  next(){
    this.index += 1;
    if( this.index >= this.playlist.length ){
      this.index = 0;
    }
    this.play();
  }
  previous(){
    this.index -= 1;
    if( this.index < 0 ){
      this.index = this.playlist.length - 1;
    }
    this.play();
  }

  onplay(callback){
    this.el.addEventListener('play', callback);
  }
  onpause(callback){
    this.el.addEventListener('pause', callback);
  }
  onvolumechange(callback){
    this.el.addEventListener('volumechange', callback);
  }
  onended(callback){
    this.el.addEventListener('ended', callback );
  }
  onseek(callback){
    this.el.addEventListener('seek', callback);
  }
  ontimeupdate(callback){
    this.el.addEventListener('timeupdate', callback );
  }
  onprogress(callback){
    this.el.addEventListener('progress',callback);
  }

}

var beo = new MusicPlayer('#audio', database);

/* 调用例子 */
function $(selector){
  return document.querySelector(selector);
}
$('.play').addEventListener('click',beo.play.bind(beo));
$('.silence').addEventListener('click',beo.silence.bind(beo));
$('.next').addEventListener('click',beo.next.bind(beo));
$('.previous').addEventListener('click',beo.previous.bind(beo));
