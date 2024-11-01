import { Masterchat, stringify } from "masterchat";
import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import open from 'open';
const app = express();
let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.get('/reset', (req, res) => {
  data.emojis = {};
  data.users = {};
  res.send({ status: "success" });
  fs.writeFileSync('./data.json', JSON.stringify(data, null, "\t"));
})

app.get('/data', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(data);
})

app.get('/*', (req, res) => {
  if (!req.url) {req.url = 'index.html'};
  if (req.url == '/leaderboard') {req.url = 'leaderboard.html'};
  res.sendFile(__dirname + '/web/' + req.url);
});

const mc = await Masterchat.init(fs.readFileSync('./id.txt', 'utf8'));

mc.on("actions", (actions) => {
  const chats = actions.filter((action) => action.type === "addChatItemAction");
  chats.forEach(chat => {
    check(chat);
  });
});

mc.on("error", (err) => {
  let errors = {
    "disabled": "Live chat is disabled.",
    "membersOnly": "No permission (members-only).",
    "private": "No permission (private video).",
    "unavailable": "Deleted OR wrong video id.",
    "unarchived": "Live stream recording is not available.",
    "denied": "Access denied (429).",
    "invalid": "Invalid request."
  }
  console.log(errors[err]);
});

mc.on("end", () => {
  console.log("The live stream has ended.");
});

function check(chat) {
  let add = 0;

  chat.rawMessage.forEach(element => {
    if (element.emoji) {
      const emojiId = element.emoji.emojiId;
      add++;
      if (data.emojis[emojiId]) {
        data.emojis[emojiId].value += 1;
      } else {
        data.emojis[emojiId] = {
          value: 1,
          emoji: element.emoji.emojiId
        };
      }
    };
  });

  if (data.users[chat.authorChannelId]) {
    data.users[chat.authorChannelId] = {
      id: chat.authorChannelId,
      name: chat.authorName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      image: chat.authorPhoto,
      value: data.users[chat.authorChannelId].value + add,
      verified: chat.isVerified,
      moderator: chat.isModerator,
      owner: chat.isOwner,
      membership: chat.membership,
    }
  } else {
    data.users[chat.authorChannelId] = {
      id: chat.authorChannelId,
      name: chat.authorName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      image: chat.authorPhoto,
      value: add,
      verified: chat.isVerified,
      moderator: chat.isModerator,
      owner: chat.isOwner,
      membership: chat.membership,
    }
  }
  fs.writeFileSync('./data.json', JSON.stringify(data));
}

mc.listen();

app.listen(3000, () => {
  open('http://localhost:3000')
  open('http://localhost:3000/leaderboard')
});
