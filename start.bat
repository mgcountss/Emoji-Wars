echo --------------------------------------
echo Starting Emoji Wars...
echo --------------------------------------
call npm install
echo --------------------------------------
echo Installing Packages...
echo --------------------------------------
timeout -t 10
node index.js
start "" http://localhost
start "" http://localhost/leaderboard
timeout -t 10
echo All Done!
timeout -t 3