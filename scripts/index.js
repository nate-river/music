function $(selector){
  return document.querySelector(selector);
}

beo = new MusicPlayer('#audio', database);

$('.play').addEventListener('click',function () {
  beo.togglePlay();
});
$('.silence').addEventListener('click',function () {
  beo.toggleVolume();
});
$('.next').addEventListener('click',function () {
  beo.next();
});
$('.previous').addEventListener('click',function () {
  beo.previous();
});
