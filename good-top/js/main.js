var c = 1;
var lol = []

for (var l = 01; l <= 01; l++) {
  var htmlrow = `<div class="row_${l} row"></div>`;
  $('.counters').append(htmlrow);
    for (var t = 01; t <= 10; t++) {
      let number;
      if(c.toString().length == 1) {
          number = `<div class="cnb">0${c}</div>`
      } else {
            number = `<div class="cnb">${c}</div>`
      }
      var htmlcard = `<div class="channel_${c} card" id="card_thing_${c}">
      ${number}
      <img src="https://mgcounts.com/assets/img/Old-YT.png" alt="" class="cimg">
      <div class="chnam">Loading</div>
      <div class="subscriberCount" id="subcount_${c}">0</div>
      </div>`;
      $('.row_'+l).append(htmlcard);
      c += 1;
    }
}var options = {
  useEasing : true, 
  useGrouping : true, 
  separator : ',', 
  decimal : '.', 
  prefix: '',
  suffix: ''
};
var lol = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
function random(min, max){
  return Math.floor(Math.random()* (max-min) + min);
}

function updateData(q, data) {
  setTimeout(function () { 
    var cnb = q+1;


    $(".channel_"+cnb+" .chnam").html(data[q].name);
    $(".channel_"+cnb+" .cimg").attr("src",data[q].image);
    var demo = new CountUp("subcount_"+cnb+"", lol[q], data[q].messages, 0, 8, options);
    demo.start()
lol[q] = data[q].messages
    }, 1000);
}

function update(){
    $.getJSON("http://localhost/stats",(data)=>{

        data.sort(function(a,b){return b.messages - a.messages});

        for (var q = 0; q < 10; q++) {
          updateData(q, data)
        }
    });
}


update();
setInterval(update,5000);
$('.counters').fadeIn(1000),1000