var c = 1;
var lol = []

for (var l = 01; l <= 05; l++) {
  var htmlrow = `<div class="row_${l} row"></div>`;
  $('.counters').append(htmlrow);
    for (var t = 01; t <= 12; t++) {
      let number;
      if(c.toString().length == 1) {
          number = `<div class="cnb">0${c}</div>`
      } else {
            number = `<div class="cnb">${c}</div>`
      }
      var htmlcard = `<div class="channel_${c} card" id="card_thing_${c}">
      ${number}
      <div class="chnam"></div>
      <div class="subscriberCount" id="subcount_${c}"></div>
      </div>`;
      $('.row_'+l).append(htmlcard);
      c += 1;
    }
}

function random(min, max){
  return Math.floor(Math.random()* (max-min) + min);
}
var lol = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var options = {
  useEasing : true, 
  useGrouping : true, 
  separator : ',', 
  decimal : '.', 
  prefix: '',
  suffix: ''
};
function updateData(q, data) {
  setTimeout(function () { 
    var cnb = q+1;


    $(".channel_"+cnb+" .chnam").html(data[q].emoji);
    var demo = new CountUp("subcount_"+cnb+"", lol[q], data[q].value, 0, 8, options);
demo.start()
lol[q] = data[q].value
    }, 3000);
}

function update(){
    $.getJSON("http://localhost/",(data)=>{

        data.sort(function(a,b){return b.value - a.value});

        for (var q = 0; q < 60; q++) {
          updateData(q, data)
        }
    });
}
update();
setInterval(update,2000);
$('.counters').fadeIn(1000),1000