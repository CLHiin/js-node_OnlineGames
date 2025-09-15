// 上方玩家
const  Game_playerInfo_1 = document.createElement('div');Object.assign( Game_playerInfo_1.style, playerInfo_ (true,'0px','50px'));
const      Game_Avatar_1 = document.createElement('div');Object.assign(     Game_Avatar_1.style, Avatar_     (true,'-1px'));
const  Game_playerName_1 = document.createElement('div');Object.assign( Game_playerName_1.style, playerName_ (true,'60px'));
const Game_playertitle_1 = document.createElement('div');Object.assign(Game_playertitle_1.style, playertitle_(true,'20px'));
// 下方玩家
const  Game_playerInfo_2 = document.createElement('div');Object.assign( Game_playerInfo_2.style, playerInfo_ (false,'0px','50px'));
const      Game_Avatar_2 = document.createElement('div');Object.assign(     Game_Avatar_2.style, Avatar_     (false,'-1px'));
const  Game_playerName_2 = document.createElement('div');Object.assign( Game_playerName_2.style, playerName_ (false,'60px'));
const Game_playertitle_2 = document.createElement('div');Object.assign(Game_playertitle_2.style, playertitle_(false,'20px'));
const boardContainer = document.createElement('div');
Object.assign(boardContainer.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: 'center',
    border: '5px solid red',
    width: cell_size * 9 + board_margin * 8 + 'px',
    height: cell_size * 9 + board_margin * 8 + 'px',
});
const Instruct_Avatar_U = document.createElement('div');
const Instruct_Avatar_D = document.createElement('div');
const setInstruct = document.createElement('div');
Object.assign(setInstruct.style, {
    position: 'absolute',
    right: '50px',
    top: '50%',
    border: '5px solid yellow',
    backgroundColor: 'lightyellow',
    borderRadius: '50%',
    width: '100px',
    height: '100px',
});
const indicator = document.createElement('div');
Object.assign(indicator.style,{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'orange',
    cursor: 'pointer',
});
const giveupBtn = createButton('放棄遊戲', 'left' , '20px', '50%', ()=>socket.emit('leave room',socket.id));
Object.assign(giveupBtn.style,{
    position: 'absolute',
    zIndex: 3,
});

const waitingBackground = document.createElement('div');
Object.assign(waitingBackground.style,{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '600px',
    zIndex: 2,
});
const waitingSign = document.createElement('div');
Object.assign(waitingSign.style,{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',        
    width: '800px',
    height: '100px',
    background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
});
waitingSign.textContent = '請等待對方行動...';
appendChildren(waitingBackground,[waitingSign]);

function start_Game(){
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(0px, 50px) translate(-50%, -50%)',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundImage: Room_readyBtn.style.backgroundImage,
        zIndex: 9999,
        transition: 'all 1s ease-in-out',
    });
    appendChildren(gameArea, [overlay]);
    overlay.offsetHeight; // 强制重绘以确保过渡效果生效，访问 offsetHeight 以触发浏览器的重绘
    overlay.style.width = overlay.style.height = '1600px';  // 放大
    setTimeout(() => {
        Room_Base_Plate.remove();
        Object.assign(overlay.style,{transition:'opacity 2s ease-in-out',opacity:'0'}); // 渐变透明并消失
        setTimeout(()=>overlay.remove(), 2000);

        appendChildren(Game_playerInfo_1, [Game_Avatar_1, Game_playerName_1, Game_playertitle_1]);
        appendChildren(Game_playerInfo_2, [Game_Avatar_2, Game_playerName_2, Game_playertitle_2]);

        setPlayerInfo(isHomeowner?Game_player2:Game_player1,Game_playerInfo_1,Game_playerName_1,Game_Avatar_1,Game_playertitle_1,isHomeowner?'blue' :'green',!isHomeowner);
        setPlayerInfo(isHomeowner?Game_player1:Game_player2,Game_playerInfo_2,Game_playerName_2,Game_Avatar_2,Game_playertitle_2,isHomeowner?'green': 'blue', isHomeowner);
        
        Object.assign(Instruct_Avatar_U.style,setInstructAvatar(Game_Avatar_1.style.backgroundImage,isHomeowner?'blue' :'green'));
        Object.assign(Instruct_Avatar_D.style,setInstructAvatar(Game_Avatar_2.style.backgroundImage,isHomeowner?'green': 'blue'));

        socket.emit('refresh board');
    }, 1050);
}
function changeGame_gameArea(room) {
    TheRoom = room;
    gameArea.innerHTML = boardContainer.innerHTML = setInstruct.innerHTML = '';
    appendChildren(gameArea, [Game_playerInfo_1, Game_playerInfo_2,boardContainer,setInstruct,giveupBtn]);
    createwall_cell(false);
    createwall_cell(true);
    createBoard_cell();
    if (TheRoom.round_turn^!isHomeowner) appendChildren(gameArea,[waitingBackground]);
    if(TheRoom.member<2) socket.emit('get room');

    function createBoard_cell() {
        board = TheRoom.board;
        boardContainer.style.transform = 'translate(-50%, -50%) ' + (isHomeowner ? '' : 'scaleY(-1)');
        for (let i = 0; i < board.length; i++) 
        for (let j = 0; j < board[i].length; j++) {
            const cell = document.createElement('div');
            Object.assign(cell.style, {
                position: 'absolute',
                width:  (j % 2 ? board_margin : cell_size) + 'px',
                height: (i % 2 ? board_margin : cell_size) + 'px',
                left: Math.floor(j / 2) * (cell_size + board_margin) + (j % 2) * cell_size + 'px',
                top:  Math.floor(i / 2) * (cell_size + board_margin) + (i % 2) * cell_size + 'px',
                backgroundColor: (i % 2 ^ j % 2) ? 'gray' : 'white',
            });
            if (board[i][j] == -1)cell.style.backgroundColor = 'green';
            if (board[i][j] == -2)cell.style.backgroundColor = 'blue';

            if ( i % 2 && j % 2) handleNodeCell  (cell, i, j);
            if (board[i][j] > 0) handlePlayerCell(cell, i, j);
            boardContainer.appendChild(cell);
            cellObject[i][j] = cell;
        }
    }
    function createwall_cell(isD){
        for (let i = 0; i < 10 ; i++){
            const wall_cell = document.createElement('div');
            Object.assign(wall_cell.style, {
                position: 'absolute',
                backgroundColor: isD ? 'green' : 'blue',
                borderRadius: '5px',
                width: board_margin + 'px',
                height: cell_size * 2 + 'px',
                left: (cell_size + board_margin) * i - board_margin + 'px',
                [isD? 'bottom': 'top']: cell_size * -2 + 'px',
                cursor: !isD^isHomeowner?'pointer':'',
                transition: 'box-shadow 0.3s ease',
            });
            if(!isD^isHomeowner){
                if(focus_cell == i)wall_cell.style.boxShadow = '0 0 10px 5px white';
                wall_cell.addEventListener('mousemove',()=>wall_cell.style.boxShadow = '0 0 10px 5px white');
                wall_cell.addEventListener('mouseout' ,()=>{if(focus_cell != i)wall_cell.style.boxShadow = 'none';});
                wall_cell.addEventListener('click'    ,()=>{
                    focus_cell = i;
                    changeGame_gameArea(room);
                    wall_cell.style.boxShadow = '0 0 10px 5px white';
                    const InstructObject = wall_cell.cloneNode(true);
                    InstructObject.id = 'wall_cell';
                    Object.assign(InstructObject.style, {
                        backgroundColor: 'red',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                    });
                    InstructObject.addEventListener('click',()=>{
                        const Style_text = 'translate(-50%, -50%)';
                        if(InstructObject.style.transform == Style_text)InstructObject.style.transform+='rotate(90deg)';
                        else InstructObject.style.transform = Style_text;
                    });
                    setInstruct.innerHTML = '';
                    appendChildren(setInstruct,[InstructObject]);
                });
            }
            if ((isD ? TheRoom.player1_board:TheRoom.player2_board)[i]) boardContainer.appendChild(wall_cell);
            (isD ? useObject1:useObject2)[i] = wall_cell;
        }
    }
    function handleNodeCell(cell, i, j) {   // 節點
        if (board[i][j]) return ;
        cell.style.borderRadius = '50%';
        if (focus_cell == null) return cell.style.backgroundColor = 'lightslategray';

        cell.style.cursor = 'pointer';
        cell.addEventListener('mousemove', () => cell.style.backgroundColor = isHomeowner ? 'lightgreen' : 'lightblue');
        cell.addEventListener('mouseout' , () => cell.style.backgroundColor = 'white');
        cell.addEventListener('click'    , () => {
            const InstructObject = setInstruct.children[0];
            const isRotated = InstructObject?.style.transform.includes('rotate(90deg)');
            if(InstructObject.id == 'wall_cell')socket.emit('put wall',i,j,focus_cell,isRotated);
            focus_cell = null;
        });
    }
    function handlePlayerCell(cell, i, j) { // 玩家
        const directions = [{ di: -1, dj: 0 }, { di: 1, dj: 0 }, { di: 0, dj: -1 }, { di: 0, dj: 1 }];
        const isSelf = (board[i][j] === 2) ^ isHomeowner;
        const boardAvatar = (isSelf ? Instruct_Avatar_D : Instruct_Avatar_U).cloneNode(true);
        boardAvatar.style.transform += isHomeowner ? '' : 'scaleY(-1)';
        appendChildren(cell, [boardAvatar]);
        if (isSelf) {
            boardAvatar.style.cursor = 'pointer';
            boardAvatar.addEventListener('click', () => {
                focus_cell = null;
                changeGame_gameArea(room);
                const AvatarInstruct = boardAvatar.cloneNode(true);
                AvatarInstruct.style.transform = 'translate(-50%, -50%)';
                AvatarInstruct.style.cursor = setInstruct.innerHTML = '';
                appendChildren(setInstruct, [AvatarInstruct]);
                directions.forEach(({ di, dj }) => addMoveIndicators(i, j, i, j, di, dj, () => socket.emit('avatar move', { here: { i, j }, move: { di, dj } })));
            });
        }
    }
    function addMoveIndicators(i,j,oi,oj,di,dj,function_){  // 移動判斷
        // o起始位置、d移動方向、n判斷位置、t目標位置
        const move1 = { di, dj };
        const alternativeMoves = di ? [{ di: 0, dj: -1 }, { di: 0, dj: 1 }] : [{ di: -1, dj: 0 }, { di: 1, dj: 0 }];
        const ni = oi + di;
        const nj = oj + dj;
        const ti = ni + di;
        const tj = nj + dj;
        if (!can_move(ni,nj))return;
        if (board[ti][tj]) {
            if (can_move(ti + di, tj + dj))        addMoveIndicators(i, j, ti, tj,       di,       dj, () => socket.emit('avatar move2', { here: { i, j }, move1, move2: move1 }));
            else alternativeMoves.forEach(move2 => addMoveIndicators(i, j, ti, tj, move2.di, move2.dj, () => socket.emit('avatar move2', { here: { i, j }, move1, move2 })));
        }
        else {
            const moveIndicator = indicator.cloneNode(true);
            appendChildren(cellObject[ti][tj], [moveIndicator]);
            moveIndicator.addEventListener('click', function_);
        }
    }
    function can_move(i,j){
        return i >= 0 && i < cellObject_size && j >= 0 && j < cellObject_size && board[i][j] === 0;
    }
}
function game_over(winer){
    const isplayer1 = winer == 1;
    const player = isplayer1 ? Game_player1 : Game_player2;

    const background = document.createElement('div');
    Object.assign(background.style,{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        width: '800px',
        height: '600px',
        zIndex: 2,
        position: 'fixed',
    });
    const returnRoom = createButton('返回房間', 'left' , '20%', '50%', ()=>{background.remove();socket.emit('return room');});
    const leaveRoom  = createButton('離開房間', 'right', '20%', '50%', ()=>{background.remove();socket.emit('leave room',socket.id);});
    const winerISign = waitingSign.cloneNode(true);
    winerISign.textContent = `恭喜${player?.name}【${player.title}】獲勝`;
    winerISign.style.backgroundColor = isplayer1 ? 'lightgreen' : 'lightblue';

    appendChildren(background, [winerISign,returnRoom,leaveRoom]);
    appendChildren(gameArea, [background]);
}