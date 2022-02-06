const express = require("express");
const app = express();
var fs = require("fs");
var global = require('./data.json');
var global2 = require('./active.json');
var fetch = require("node-fetch")
var lasttime = 0;
app.use(express.static(__dirname + '/public'));
var names = []

app.get('/good-top/css/style.css', function (req, res) {
  res.sendFile('/good-top/css/style.css', { root: __dirname });
});
app.get('/good-top/css/odometer-theme-default.css', function (req, res) {
  res.sendFile('/good-top/css/odometer-theme-default.css', { root: __dirname });
});
app.get('/good-top-50/css/style.css', function (req, res) {
  res.sendFile('/good-top-50/css/style.css', { root: __dirname });
});
app.get('/good-top-50/css/odometer-theme-default.css', function (req, res) {
  res.sendFile('/good-top-50/css/odometer-theme-default.css', { root: __dirname });
});
app.get('/good-top-50/js/main.js', function (req, res) {
  res.sendFile('/good-top-50/js/main.js', { root: __dirname });
});
app.get('/good-top/js/main.js', function (req, res) {
  res.sendFile('/good-top/js/main.js', { root: __dirname });
});
app.get('/good-top-50/js/odometer.min.js', function (req, res) {
  res.sendFile('/good-top-50/js/odometer.min.js', { root: __dirname });
});
app.get('/good-top/js/odometer.min.js', function (req, res) {
  res.sendFile('/good-top-50/js/odometer.min.js', { root: __dirname });
});
app.get('/good-top-50/index.html', function (req, res) {
  res.sendFile('/good-top-50/index.html', { root: __dirname });
});
app.get('/good-top/index.html', function (req, res) {
  res.sendFile('/good-top/index.html', { root: __dirname });
});
app.get('/new.html', function (req, res) {
  res.sendFile('/new.html', { root: __dirname });
});
app.get('/back.png', function (req, res) {
  res.sendFile('/back.png', { root: __dirname });
});





app.get('/', (req, res) => {
    global.sort((p, z) => parseFloat(z.emoji.length) - parseFloat(z.emoji.length)
    )
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(global);
})

app.get('/all', (req, res) => {
  var all = 0
  for (var ww = 0; ww < global.length; ww++) {
    all = all += parseFloat(global[ww].value)
      }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(''+all);
})

app.get('/stats', (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(global2);
})

var cidlol = "lol"
async function getDataFromAPI() {
  let response = await fetch('https://www.googleapis.com/youtube/v3/liveChat/messages?key= api key &liveChatId= active chat ID &part=snippet',{
headers: {
}
  }).then(res => res.json()).then(data => {
data.items = data.items.reverse()
var input = data.items[0].snippet.displayMessage
cidlol = data.items[0].snippet.authorChannelId
getFrequency(input)
function getFrequency(string) {
  var freq = {};
  var freq2 = 0;
  for (character of string) {
    if (character.length === 1) continue;
    if (freq[character]) {
      freq[character]++;
      freq2++
    } else {
      freq[character] = 1;
      freq2 = 1;
    }
  }
  for (var r = 0; r < global.length; r++) {
    if (character == global[r].emoji) {
        if (data.items[0].snippet.publishedAt != lasttime) {
          global[r].value
        global[r].value += parseFloat(freq2)
        global[r].value
        lasttime = data.items[0].snippet.publishedAt;
        
        for (var ww = 0; ww < global2.length; ww++) {
          names[ww] = global2[ww].userid
            }
        if (names.includes(cidlol)) {
          for (var p = 0; p < global2.length; p++) {
            if (data.items[0].snippet.authorChannelId == global2[p].userid) {
          global2[p].messages += parseFloat(freq2)
            }
          }
      } else {

        fetch('https://api.mgcounts.com/youtube/user/'+cidlol+'')
    .then(res => res.json())
    .then(json => {

      global2.push({   
        "userid": json.id,
        "name": json.title,
        "image": json.image,
        "messages": 0
        })  
    });   

          }
        
      } 
    }
  }
  
 };
    })
  }

getDataFromAPI()
setInterval(getDataFromAPI,10000)

setInterval(function () {
  let stringifieddata = JSON.stringify(global);
  fs.writeFileSync('data.json', stringifieddata);
}, 2000);
  
setInterval(function () {
  let stringifieddata = JSON.stringify(global2);
  fs.writeFileSync('active.json', stringifieddata);
}, 2000);
console.log("active")

app.listen(80)
