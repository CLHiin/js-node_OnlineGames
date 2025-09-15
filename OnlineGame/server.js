// 導入所需模組
const express = require('express');
// const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { user_data } = require('./User_list.js');

// 建立 Express 應用程式
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'game')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/game/game.html')); // 將 game.html 發送到瀏覽器
});

// 資料區
const Facecard = ['facedust','facewater','facefire','facewind'];
class Player {
    constructor(id, account = {Permissions : 0, account_Name:'無', name: '單純的路人', title: '路人',}) {
        this.id = id;
        this.account = account.account_Name;
        this.name = account.name;
        this.title = account.title;
        this.token = account.Permissions;
        this.avatar_img = 'assets/face/facedust1.png';
        this.ready = false;
    };
}
const players = {};
let AllRoom = [
    {
        id: 1,
        title:"你好呀你好呀你好呀你好呀你好呀你好呀（只是充版面數的）",
        public: 'su3osjkf',
        member: ['sss'],
        player: {
            sss:{
                id: 'sss',
                account: 'XX',
                name: 'NPC',
                title: '玩家',
                token: 1,
                avatar_img: 'assets/face/facedust3.png',
            },
        },
    },
    {
        id: 2,
        title:"11私人房間唷（只是充版面數的）",
        public: '112541',
        member: ['sss'],
        player: {
            sss:{
                id: 'sss',
                account: 'XX',
                name: 'NPC',
                title: '玩家',
                token: 1,
                avatar_img: 'assets/face/facefire2.png',
            },
        },
    },
    {
        id: 3,
        title:"私人房間唷 呵呵呵呵呵呵呵..???XXXXXXXXXXXXX　　　ＳＳＳ（只是充版面數的）",
        public: '33475228573',
        member: ['sss'],
        player: {
            sss:{
                id: 'sss',
                account: 'XX',
                name: 'NPC',
                title: '玩家',
                token: 1,
                avatar_img: 'assets/face/facedwater2.png',
            },
        },
    },   
];
var AllRoomList = AllRoom.length;

io.on('connection', (socket) => {
    let userId = socket.id;
    let TheR = null;
    let allReady = false;
    players[userId] = new Player(userId);
    io.to(userId).emit('Synchronize',players[userId]);

    socket.on('login', (accountName, gameCode) => {
        let foundAccount = user_data.find(account => account.account_Name === accountName && account.code === gameCode);
        let playerAlreadyExists = Object.values(players).some(player =>  player.account === accountName);
        let token = playerAlreadyExists ? 0 : -1;
        if (foundAccount && token) {
            token = foundAccount.Permissions;
            players[userId] = new Player(userId, foundAccount, token);   // 創建角色
            console.log(`${userId} 帳號： ${accountName} 加入了遊戲 (${foundAccount.name})`);
        }
        io.to(userId).emit('login', token);
        io.to(userId).emit('Synchronize',players[userId]);
    });
    socket.on('change player', (player) => io.to(userId).emit('Synchronize',players[userId] = player) );
    socket.on('get room', () => {
        AllRoom = AllRoom.filter(room => room.member.length > 0);
        AllRoom.sort((a, b) => a.member.length - b.member.length || a.id - b.id);
        io.to(userId).emit('get room',AllRoom);
    });
    socket.on('join room', (roomid, code) => {
        room = AllRoom.find(item => item.id == roomid);
        if(room && room.member.length == 1 && room.public == code){
            room.member.push(userId);
            room.player[userId] = players[userId];
            io.to(room.member).emit('join room',TheR = room);
        }
        else {
            AllRoom = AllRoom.filter(room => room.member.length > 0);
            AllRoom.sort((a, b) => a.member.length - b.member.length || a.id - b.id);    
            io.to(userId).emit('get room',AllRoom);
            io.to(userId).emit('chat message','system-message', '系統通知：無法加入房間（可能是房間已消失）');
        }
    });
    socket.on('creat room',(name,code)=>{
        TheR = {
            id: ++AllRoomList,
            title: name,
            public: code,
            member: [userId],
            player: {
                [userId]:players[userId],
            },
        }
        AllRoom.push(TheR);
        io.to(TheR.member).emit('join room',TheR);
    });
    socket.on('change room',(name,code)=>{
        if (TheR) {
            TheR.title = name;
            TheR.public = code;
            io.to(TheR.member).emit('change room', TheR);
        }
    });
    socket.on('ready room', () => {
        if (players[userId] && TheR) {
            players[userId].ready = !players[userId].ready;
            io.to(TheR.member).emit('change room', TheR);
            allReady = TheR.member.length > 1 && TheR.member.every(memberId => TheR.player[memberId].ready);
            if (allReady){
                initialization_room(TheR);
                TheR.member.forEach(memberId => TheR.player[memberId].ready = false);
                allReady = false;
                io.to(TheR.member).emit('start game');
            }
        }
    });
    socket.on('leave room', (id) => {
        if(!allReady)leave_room(id);
    });
    socket.on('return room', () => {
        if (TheR) io.to(userId).emit('join room',TheR);
    });
    
    socket.on('refresh board', () => io.to(userId).emit('refresh board',TheR));
    socket.on('avatar move' ,({here, move        })=>avatar_move(here, move));
    socket.on('avatar move2',({here, move1, move2})=>avatar_move(here, move1, move2));
    socket.on('put wall',(i, j, sequence,isRotated)=>put_wall(i, j, sequence,isRotated));

    socket.on('chat message', (type, msg) => {
        const messageHandlers = {
            'system-message':()=>io.to(userId)      .emit('chat message',type, '系統通知：'+ msg  ),
            'public-message':()=>io                 .emit('chat message',type, players[userId].name + '：' + msg),
            'battle-message':()=>io.to(TheR.member).emit('chat message',type, players[userId].name + '：' + msg),
        }
        if(messageHandlers[type])messageHandlers[type]();
    });
    socket.on('disconnect', () => {
        leave_room(userId);
        if (players[userId]) {
            const playerName = players[userId].name;
            console.log(userId + ' ', playerName, '離開了遊戲');
            delete players[userId];
        }
    });

    function initialization_room(room){
        Object.assign(room,{
            board: Array.from({ length: 17 }, () => Array(17).fill(0)),
            player1_board: new Array(10).fill(1),
            player2_board: new Array(10).fill(1),
            round_turn: Math.random() < 0.5,
        });
        room.board[16][8] = 1;
        room.board[ 0][8] = 2;
    }
    function leave_room(id){
        if (TheR) {
            TheR.member = TheR.member.filter(memberId => memberId !== id);
            io.to(id).emit('get room',AllRoom);
            if (TheR.member.length){
                io.to(TheR.member).emit('chat message', 'system-message', '系統通知：' + players[id].name + '已離開房間');
                io.to(TheR.member).emit('join room', TheR);
            }
        }
    }
    function avatar_move(here, move, move2 = null) {
        if (TheR.round_turn ^ userId == TheR.member[1]) return notifyInvalidMove('現在不是你的回合');
        let ni = here.i + move.di;
        let nj = here.j + move.dj;
        if (!isValidMove(move, ni, nj)) return notifyInvalidMove('移動不正確');
        if ( move2 != null ) {
            ni += move.di + move2.di;
            nj += move.dj + move2.dj;
            move = move2;
            if (!isValidMove(move, ni, nj)) return notifyInvalidMove('移動不正確');
        }
        ni += move.di;
        nj += move.dj;

        if (movePiece(here, ni, nj)) {
            TheR.round_turn = !TheR.round_turn;
            io.to(TheR.member).emit('refresh board', TheR);
            if( (ni == 0  && TheR.board[ni][nj] == 1) || (ni == 16 && TheR.board[ni][nj] == 2)) 
                io.to(TheR.member).emit('game over',TheR.board[ni][nj]);
        }
        else io.to(userId).emit('chat message', 'system-message', '系統通知：移動有誤'); 
    }
    function put_wall(i, j, sequence,isRotated){
        if (TheR.round_turn ^ userId == TheR.member[1]) return notifyInvalidMove('現在不是你的回合');
        const directions = isRotated ? [{ di: 0, dj: -1 }, { di: 0, dj: 1 }] : [{ di: -1, dj: 0 }, { di: 1, dj: 0 }];
        const playerId = TheR.round_turn ? 2 : 1; // 獲取當前回合的玩家ID
        if (directions.every(dir => TheR.board[i + dir.di][j + dir.dj] === 0)) {
            set_wall_value(i, j, directions, -playerId);
            if (!bfsCanReachGoal(1) || !bfsCanReachGoal(2)) {
                notifyInvalidMove('無法放置牆壁，因為某玩家無法到達整排終點位置');
                set_wall_value(i, j, directions, 0);
                return io.to(TheR.member).emit('refresh board', TheR);
            }
            (TheR.round_turn ? TheR.player2_board : TheR.player1_board)[sequence] = 0;
            TheR.round_turn = !TheR.round_turn;
            return io.to(TheR.member).emit('refresh board', TheR);
        }
        return notifyInvalidMove('該位置無法放置');
    }
    function notifyInvalidMove(text){
        return io.to(userId).emit('chat message', 'system-message', '系統通知：' + text);
    }
    function movePiece(from, i, j) {
        if (TheR.board[i][j]) return false;
        TheR.board[i][j] = TheR.board[from.i][from.j];
        TheR.board[from.i][from.j] = 0;
        return true;
    }
    function isValidMove(move, i, j) {
        const validDirections = [{ di: -1, dj: 0 }, { di: 1, dj: 0 }, { di: 0, dj: -1 }, { di: 0, dj: 1 }];
        return validDirections.some(dir => dir.di === move.di && dir.dj === move.dj) &&
               i >= 0 && i < 17 && j >= 0 && j < 17 &&
               TheR.board[i][j] === 0;
    }
    function set_wall_value(i,j,directions,value){
        TheR.board[i][j] = value;
        directions.forEach(dir => TheR.board[i + dir.di][j + dir.dj] = value);
    }
    function bfsCanReachGoal(playerId) {
        const playerPosition = getPlayerPosition(playerId);
        const goalRow = playerId === 1 ? 0 : 16;
        const queue = [playerPosition];
        const visited = new Set();
        visited.add(`${playerPosition.i},${playerPosition.j}`);

        while (queue.length > 0) {
            const current = queue.shift();
            if (current.i === goalRow) return true;

            for (const dir of [{ di: -1, dj: 0 }, { di: 1, dj: 0 }, { di: 0, dj: -1 }, { di: 0, dj: 1 }]) {
                const ti = current.i + dir.di * 2;
                const tj = current.j + dir.dj * 2;
                const key = `${ti},${tj}`;
                if (!visited.has(key) && isValidMove(dir,current.i + dir.di,current.j + dir.dj)) {
                    queue.push({ i: ti, j: tj});
                    visited.add(key);
                }
            }
        }
        return false;
    }
    function getPlayerPosition(playerId) {
        const playerSymbol = playerId === 1 ? 1 : 2;
        for (let i = 0; i < 17; i++) 
            for (let j = 0; j < 17; j++) 
                if (TheR.board[i][j] === playerSymbol) 
                    return { i, j };
        return null;
    }
});
server.listen(PORT, () => console.log(`已開啟服務器端口： ${PORT}`) );