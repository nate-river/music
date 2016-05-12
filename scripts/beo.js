class Beo{
  constructor(selector, playlist){
    this.el = document.querySelector(selector);
    this.playlist = playlist;
    var index = localStorage['index.beo.com'];
    if( index ){
      this.index = Number(index);
    }else{
      this.index = 0;
    }
  }
  play(){
    this.el.src = this.playlist[this.index].filename;
    this.el.play();
    localStorage['index.beo.com'] = this.index;
  }
  silence(){
    this.el.pause();
  }
  next(){
    this.index += 1;
    if( this.index >= this.playlist.length ){
      this.index = 0;
    }
    this.el.src = this.playlist[this.index].filename;
    this.play();
  }
  previous(){
    this.index -= 1;
    if( this.index < 0 ){
      this.index = this.playlist.length - 1;
    }
    this.el.src = this.playlist[this.index].filename;
    this.play();
  }
}

var beo = new Beo('#audio', database);

/* 调用例子 */
function $(selector){
  return document.querySelector(selector);
}
$('.play').addEventListener('click',beo.play.bind(beo));
$('.silence').addEventListener('click',beo.silence.bind(beo));
$('.next').addEventListener('click',beo.next.bind(beo));
$('.previous').addEventListener('click',beo.previous.bind(beo));
