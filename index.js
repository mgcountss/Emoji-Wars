const express = require("express");
const app = express();
let fs = require("fs");
let global = require('./data/data.json');
let global2 = require('./data/active.json');
var archive = require('./data/archive.json');
var todo = require('./data/todo.json');
let fetch = require("node-fetch")
const open = require('open');
let lasttime = 0;
let chatID = "" //ignore
app.use(express.static(__dirname + '/public'));
let names = []

let apikey = "" // api key here
let videoID = "" // video id here
let fetchTimer = 5 //how often you fetch in seconds, 10,000 fetches per day

app.get('/', function (req, res) {
  res.sendFile('/html/index.html', { root: __dirname });
});
app.get('/odometer.css', function (req, res) {
  res.sendFile('/css/odometer.css', { root: __dirname });
});
app.get('/odometer.js', function (req, res) {
  res.sendFile('/js/odometer.js', { root: __dirname });
});
app.get('/countup.js', function (req, res) {
  res.sendFile('/js/countup.js', { root: __dirname });
});
app.get('/jquery.js', function (req, res) {
  res.sendFile('/js/jquery.js', { root: __dirname });
});
app.get('/leaderboard', function (req, res) {
  res.sendFile('/html/leaderboard.html', { root: __dirname });
});

app.get('/reset', (req, res) => {
  for (var ww = 0; ww < global.length; ww++) {
    global[ww].value = 0
  }
  res.send("reset");
  fs.writeFileSync('./data/data.json', JSON.stringify(global, null, "\t"));
})

app.get('/data', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(global);
})

app.get('/all', (req, res) => {
  let all = 0
  for (let ww = 0; ww < global.length; ww++) {
    all = all += parseFloat(global[ww].value)
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send('' + all);
})

app.get('/stats', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(global2);
})

async function getDataFromAPI() {
  let response = await fetch('https://www.googleapis.com/youtube/v3/liveChat/messages?key=' + apikey + '&liveChatId=' + chatID + '&part=snippet,authorDetails', {
    headers: {
    }
  }).then(res => res.json()).then(data => {
    data = data.items
    for (let q = 0; q < data.length; q++) {
      var current = false
      for (let e = 0; e < archive.length; e++) {
        if (data[q].snippet.publishedAt == archive[e].snippet.publishedAt && data[q].snippet.displayMessage == archive[e].snippet.displayMessage) {
          current = true
        }
      }
      if (current == false) {
        todo.push(data[q])
      }
    }
    archive = data
    if (todo.length > 0) {
      update()
    }
  })
}

function update() {
  let input = todo[0].snippet.displayMessage
  const emojiRegex = /\p{Emoji}/u;
  let string = [];
  let total = 0;
  if (emojiRegex.test(input) == true) {
    string = getFrequency(input)
  }
  console.log(string)
  for (var r = 0; r < global.length; r++) {
    for (var rr = 0; rr < string.length; rr++) {
      if (string[rr][0] == global[r].emoji) {
        if (todo[0].createdAt != lasttime) {
          global[r].value += parseFloat(string[rr][1])
          total += parseFloat(string[rr][1])
        }
      }
    }
  }

  for (var ww = 0; ww < global2.length; ww++) {
    names[ww] = global2[ww].userid
  }
  if (names.includes(todo[0].authorDetails.channelId)) {
    for (var p = 0; p < global2.length; p++) {
      if (todo[0].authorDetails.channelId == global2[p].userid) {
        global2[p].messages += parseFloat(total)
      }
    }
  } else {
    global2.push({
      "userid": todo[0].authorDetails.channelId,
      "name": todo[0].authorDetails.displayName,
      "image": todo[0].authorDetails.profileImageUrl,
      "messages": total
    })
  }

  todo.splice(0, 1);
  if (todo.length > 0) {
    update()
  }

}


function load() {
  fetch('https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=' + videoID + '&key=' + apikey + '')
    .then(response => response.json())
    .then(data => {
      if (!data.items[0].liveStreamingDetails) {
        console.log("Error: Video not live!")
        process.exit()
      } else {
        chatID = data.items[0].liveStreamingDetails.activeLiveChatId
        getDataFromAPI()
        setInterval(getDataFromAPI, (fetchTimer * 1000))
        console.log("Emoji Wars has started up!")
        open('http://localhost/');
        open('http://localhost/leaderboard');
      }
    });
}

if (apikey !== "" && videoID !== "") {
  load()
} else {
  console.log("Make sure the API Key and Video ID are NOT blank!")
  process.exit()
}

function getFrequency(string) {
  let freq = {};
  let freq2 = 0;
  let result = []
  for (character of string) {
    if (character.length !== 1) {
      if (freq[character]) {
        freq[character]++;
        freq2++
      } else {
        freq[character] = 1;
        freq2 = 1;
      }
    }
  }
  for (var i in freq) {
    result.push([i, freq[i]]);
  }
  return result
}

setInterval(function () {
  fs.writeFileSync('./data/data.json', JSON.stringify(global));
  fs.writeFileSync('./data/active.json', JSON.stringify(global2));
  fs.writeFileSync('./data/archive.json', JSON.stringify(archive, null, "\t"));
  fs.writeFileSync('./data/todo.json', JSON.stringify(todo, null, "\t"));
}, 30000)
app.listen(80)
