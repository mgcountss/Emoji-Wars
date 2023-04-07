import { Masterchat, stringify } from "masterchat";
import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();
let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/web/index.html');
})

app.get('/leaderboard', (req, res) => {
  res.sendFile(__dirname + '/web/leaderboard.html');
})

app.get('/countup.js', (req, res) => {
  res.sendFile(__dirname + '/web/countup.js');
})

app.get('/default.png', (req, res) => {
  res.sendFile(__dirname + '/web/default.png');
})

app.get('/jquery.js', (req, res) => {
  res.sendFile(__dirname + '/web/jquery.js');
})

app.get('/leaderboard.html', (req, res) => {
  res.sendFile(__dirname + '/web/leaderboard.html');
})

app.get('/reset', (req, res) => {
  for (var ww = 0; ww < data.emojis.length; ww++) {
    data.emojis[ww].value = 0
  }
  data.users = []
  res.send("reset");
  fs.writeFileSync('./data.json', JSON.stringify(data, null, "\t"));
})

app.get('/data', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(data);
})

const mc = await Masterchat.init(fs.readFileSync('./id.txt', 'utf8'));

mc.on("chat", (chat) => {
  console.log(chat.authorName, stringify(chat.message));
});

mc.on("actions", (actions) => {
  const chats = actions.filter((action) => action.type === "addChatItemAction");
  chats.forEach(chat => {
    check(chat)
  })
});

mc.on("error", (err) => {
  let errors = {
    "disabled": "Live chat is disabled",
    "membersOnly": "No permission (members-only)",
    "private": "No permission (private video)",
    "unavailable": "Deleted OR wrong video id",
    "unarchived": "Live stream recording is not available",
    "denied": "Access denied (429)",
    "invalid": "Invalid request"
  }
  console.log(errors[err]);
});

mc.on("end", () => {
  console.log("Live stream has ended");
});

function check(chat) {
  let emojis = []
  let emojiList = []
  chat.rawMessage.forEach(element => {
    if (element.emoji) {
      if (emojis.includes(element.emoji.emojiId)) {
        emojiList[emojis.indexOf(element.emoji.emojiId)].value++
      } else {
        emojis.push(element.emoji.emojiId)
        emojiList.push({
          emoji: element.emoji.emojiId,
          value: 1
        })
      }
    }
  });
  let add = 0;
  for (var i = 0; i < emojiList.length; i++) {
    for (var ii = 0; ii < data.emojis.length; ii++) {
      if (emojiList[i].emoji == data.emojis[ii].emoji) {
        data.emojis[ii].value += emojiList[i].value
        add += emojiList[i].value
      }
    }
  }
  let found = false
  for (var i = 0; i < data.users.length; i++) {
    if (data.users[i].id == chat.authorChannelId) {
      found = true
      data.users[i] = {
        id: chat.authorChannelId,
        name: chat.authorName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        image: chat.authorPhoto,
        value: data.users[i].value + add,
        verified: chat.isVerified,
        moderator: chat.isModerator,
        owner: chat.isOwner,
        membership: chat.membership,
      }
    }
  }
  if (!found) {
    data.users.push({
      id: chat.authorChannelId,
      name: chat.authorName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      image: chat.authorPhoto,
      value: add,
      verified: chat.isVerified,
      moderator: chat.isModerator,
      owner: chat.isOwner,
      membership: chat.membership,
    })
  }
  fs.writeFileSync('./data.json', JSON.stringify(data));
}

mc.listen();

app.listen(3000, () => {
  console.log('http://localhost:3000')
  console.log('http://localhost:3000/leaderboard')
})
