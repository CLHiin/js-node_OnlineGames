Object.assign(web.style,{
    backgroundColor: 'plum',
    fontFamily: 'Roboto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
});
// 略過登入
web.innerHTML = '';
web.appendChild(fullScreen);
socket.emit('get room');
//*/
socket.on('login', (token) => {  // 登陸
    if (token > 0){ // 成功
        alert('登入成功');
        web.innerHTML = '';
        web.appendChild(fullScreen);
        socket.emit('get room');
        socket.emit('chat message','system-message','歡迎【' + ["路人","玩家","管理員","作者"][token] + '】加入');
    }
    else if (token == 0)alert('登入失敗，該帳戶正在被登錄中。');
    else                alert('登入失敗，請檢查你的輸入。');
});
socket.on('Synchronize', (player) => Game_player1 = player);

socket.on(     'get room',gohome_gameArea    ); // 刷新房間
socket.on(    'join room',goRoom_gameArea    ); // 進入房間
socket.on(  'change room',changeRoom_gameArea); // 更新房間
socket.on(   'start game',start_Game         ); // 開始遊戲
socket.on('refresh board',changeGame_gameArea); // 刷新棋盤
socket.on(    'game over',game_over          ); // 玩家勝利

// 通訊區---------------------------------------------------------------------------------------------------
socket.on('chat message', (type, msg) => {  // 接收訊息
    const messagesList = document.getElementById(`${type}`);
    const messageItem = document.createElement('li');
    messageItem.textContent = msg;
    Object.assign(messageItem.style,{
        padding: '5px 10px',
        marginBottom: '5px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
    });
    messagesList.appendChild(messageItem);
    messagesList.scrollTop = messagesList.scrollHeight;
    while (messagesList.children.length > 30) messagesList.removeChild(messagesList.firstChild);

    const pureButtonType = type.slice(0, -8);
    if ( inputMessage.dataset.target !== type && ['system','public','battle'].includes(pureButtonType)) {
        const button = document.getElementById(pureButtonType + '-tab');
        let count = 0;
        const flashing = setInterval(() => {
            button.style.backgroundColor = count % 2 ? 'red' : '#4CAF50';
            if (count++ > 5*2 ||inputMessage.dataset.target == type) {
                button.style.backgroundColor = '#4CAF50';
                clearInterval(flashing);
            }
        }, 500);
    }
});