// --------------------------------------------------------------------------------------------
const dialogueArea = document.createElement('div');
Object.assign(dialogueArea.style, {
    backgroundColor: 'gray',
    width: '300px',
    height: '600px',
    fontSize: '18px',
});
const tabs = document.createElement('div');
Object.assign(tabs.style, {
    display: 'flex',
    height: '110px',
    backgroundColor: 'lightyellow',
});
createbtn('系統通知','system');
createbtn('公開對話','public');
createbtn('對戰對話','battle');
function createbtn(t,i) {
    const tab  = document.createElement('button');
    tab.textContent = t;
    tab.id = i+'-tab';
    tab.addEventListener('mouseover',() => tab.style.backgroundColor = 'green');
    tab.addEventListener('mouseout' ,() => tab.style.backgroundColor = '#4CAF50');
    tab.addEventListener('click'    , ()=> showSelectedTab( i + '-message'));
    Object.assign(tab.style, {
        padding: '10px 20px',
        margin: '0 1px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '20px',
        borderRadius: '10px',
    });
    appendChildren(tabs,[tab]);
}
function showSelectedTab(tabId) {
    const messageLists = document.querySelectorAll('.message-list');
    inputMessage.dataset.target = tabId;
    messageLists.forEach(list => list.style.display = list.id === tabId ? 'block' : 'none');
}
const list = document.createElement('list');
createul('system-message','block');
createul('public-message','none' );
createul('battle-message','none' );
function createul(i,d) {
    const ul = document.createElement('ul');
    ul.id = i;
    ul.className = 'message-list';
    Object.assign(ul.style, {
        listStyleType: 'none',
        margin: '0',
        backgroundColor: 'skyblue',
        padding: '10px',
        overflowY: 'auto',
        maxHeight: '300px',
        border: '1px solid #ccc',
        width: '280px',
        height: '300px',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        display: d,
    });
    appendChildren(list,[ul]);
}
const inputMessage = document.createElement('textarea');
inputMessage.id = 'inputMessage';
inputMessage.rows = '1';
inputMessage.dataset.target = 'system-message';
inputMessage.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        e.preventDefault();
        const currentTab = inputMessage.dataset.target; // 獲取當前對話框屬性
        let message = inputMessage.value.trim();
        if(message !== '') {
            if(message.length > 60) message = message.slice(0, 60) + '...';
            if(currentTab !== 'system-message'|| Game_player1.token > 1)socket.emit('chat message',currentTab, message); // 傳送訊息及當前對話框屬性給伺服器
            inputMessage.value = '';
        }
    }
});
Object.assign(inputMessage.style, {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    resize: 'none',
    overflowY: 'auto',
    width: '280px',
    height: '38Px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
});
appendChildren(dialogueArea,[tabs,list,inputMessage]);
// --------------------------------------------------------------------------------------------
const gameArea = document.createElement('div');
gameArea.id = 'gameArea';
Object.assign(gameArea.style,{
    backgroundColor: '#222222',
    width: '800px',
    height: '600px',
    position: 'relative',
    overflow: 'hidden',
});
// --------------------------------------------------------------------------------------------
const playerInfo   = document.createElement('div');Object.assign(  playerInfo.style, playerInfo_ (true,'10px','10px'));
const playerAvatar = document.createElement('div');Object.assign(playerAvatar.style, Avatar_     (true,'-1px'));
const Avatar       = document.createElement('div');Object.assign(      Avatar.style, Avatar_     (true,''    ));
const playerName   = document.createElement('div');Object.assign(  playerName.style, playerName_ (true,'60px'));
const playertitle  = document.createElement('div');Object.assign( playertitle.style, playertitle_(true,'20px'));
playerInfo.style.border = '3px solid gray';
playerInfo.style.overflow = '';
Avatar.style.cursor = 'pointer';
Avatar.addEventListener('click', () => {
    if (playerAvatar.childElementCount != 1) {
        playerAvatar.innerHTML = '';
        appendChildren(playerAvatar,[Avatar]);
    }
    else {
        const MaxPage = Math.ceil(Facecard.length / 6);
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'absolute',
            transform: 'translate(0px, 60px)',
            width: '200px',
            height: '170px',
            borderRadius: '25px',
            backgroundColor: 'aquamarine',
            textAlign: 'center',
        });
        createItem(1);
        function createItem(page) {
            container.innerHTML = '';
            const outbtn = document.createElement('div');
            Object.assign(outbtn.style, {
                position: 'absolute',
                top: '0px',
                right: '0px',
                transform: 'translate(50%, -50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FF6699',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '22px',
                fontWeight: 'bold',
            });
            outbtn.textContent = 'Ｘ';
            outbtn.addEventListener('mousemove',() => outbtn.style.backgroundColor = '#FF3333');
            outbtn.addEventListener('mouseout', () => outbtn.style.backgroundColor = '#FF6699');
            outbtn.addEventListener('click', () => {
                playerAvatar.innerHTML = '';
                appendChildren(playerAvatar,[Avatar]);
            });
            for (let i = 6; i; i--) {
                const Avatarimage = Facecard[6 * page - i ];
                const element = document.createElement('div');
                Object.assign(element.style, {
                    width: '50px',
                    height: '50px',
                    margin: '10px 5px 0px 5px',
                    borderRadius: '50%',
                    backgroundImage: `url(${Avatarimage})`,
                    backgroundSize: 'cover',
                    display: 'inline-block',
                    cursor: 'pointer',
                });
                element.addEventListener('click', () => {
                    Avatar.style.backgroundImage = `url(${Avatarimage})`;
                    Game_player1.avatar_img = Avatarimage;
                    socket.emit('change player', Game_player1);
                });
                appendChildren(container,[element]);
            }
            const pagetext = document.createElement('div');
            pagetext.textContent = page + '/' + MaxPage;
            Object.assign(pagetext.style, {
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '22px',
            });
            function createButton1(isRightButton) {
                const btn = document.createElement('div');
                Object.assign(btn.style, {
                    position: 'absolute',
                    bottom: '10px',
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    cursor: 'pointer',
                    [isRightButton? 'right': 'left']: '40px',
                    [isRightButton? 'borderLeft': 'borderRight']: '20px solid #B94FFF',
                });
                btn.addEventListener('mousemove',()=>btn.style[isRightButton? 'borderLeft': 'borderRight'] = '20px solid #5555FF');
                btn.addEventListener('mouseout' ,()=>btn.style[isRightButton? 'borderLeft': 'borderRight'] = '20px solid #B94FFF');        
                btn.addEventListener('click'    ,()=>createItem(isRightButton ? (page % MaxPage) + 1 : page - 1 || MaxPage));
                return btn;
            }
            appendChildren(playerAvatar,[container]);
            appendChildren(container,[outbtn,pagetext,createButton1(true),createButton1(false)]);
        }
    }
});
playerName.contentEditable = true;
playerName.setAttribute('spellcheck', 'false');
playerName.addEventListener('keydown', (e) => { if (e.key == 'Enter') e.preventDefault();});
playerName.addEventListener('blur', () => {
    playerName.innerText = playerName.innerText.replace(/\s/g, '') || 'Player';
    while(playerName.clientWidth > 100) playerName.innerText = playerName.innerText.slice(0, -1);
    Game_player1.name = playerName.innerText;
    socket.emit('change player', Game_player1);
});

appendChildren(playerAvatar,[Avatar]);
appendChildren(playerInfo,[playerAvatar,playerName,playertitle]);
const roomList = document.createElement('div');
Object.assign(roomList.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '430px',
    backgroundColor: '#555555',
    border: '5px solid black',
    borderRadius: '20px',
    overflow: 'hidden',
});
function createRoomItem(page=1) {
    roomList.innerHTML = '';
    const MaxPage = Math.ceil(AllRoom.length / 5);
    const container = document.createElement('div');
    Object.assign(container.style,{
        position: 'absolute',
        left: '50%',
        bottom: '0px',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '70px',
        backgroundColor: '#0044BB',
    });
    const pagetext = document.createElement('div');
    pagetext.textContent = page + '/' + MaxPage;
    const refresh = document.createElement('div');
    Object.assign(refresh.style,{
        position: 'absolute',
        left: '20%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '40px',
        backgroundImage: 'url("assets/special/refresh.png")',
        backgroundSize: 'cover',
        cursor: 'pointer',
    });
    refresh.addEventListener('mousemove',()=>refresh.style.filter = 'invert(100%)');
    refresh.addEventListener('mouseout' ,()=>refresh.style.filter = 'invert(  0%)');
    refresh.addEventListener('click',()=>socket.emit('get room'));
    Object.assign(pagetext.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '32px',
    });
    for (let i = 5 ; i && AllRoom[ 5 * page - i ]; i--) {
        const RoomItem = AllRoom[ 5 * page - i ];
        const room = document.createElement('div');
        Object.assign(room.style, {
            position: 'relative',
            display: 'block',
            margin: '10px auto',
            width: '550px',
            height: '50px',
            backgroundColor: '#AAAAAA',
            border: '5px solid blue',
            borderRadius: '30px',
            overflow: 'hidden',
        });
        const roomName = document.createElement('div');
        roomName.textContent = RoomItem.title;
        Object.assign(roomName.style, {
            width: '480px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            padding: '0px 10px',
            fontSize: '20px',
            borderRadius: '25px',
            backgroundColor: RoomItem.member.length < 2 ? '#AA44BB':'#444444',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        });
        const roomPublic = document.createElement('div');
        Object.assign(roomPublic.style, {
            position: 'absolute',
            right: '0px',
            top: '0px',
            margin: '10px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: RoomItem.public == '' ? '#00FF00' : '#FF0000',
            cursor: 'pointer',
        });
        roomPublic.addEventListener('mousemove',()=>roomPublic.style.backgroundColor = RoomItem.public == '' ? '#009900' : '#990000');
        roomPublic.addEventListener('mouseout' ,()=>roomPublic.style.backgroundColor = RoomItem.public == '' ? '#00FF00' : '#FF0000');
        roomPublic.addEventListener('click',()=>{
            if(RoomItem.public == '')socket.emit('join room',RoomItem.id,'');
            else base_background(null,'輸入密碼','進入','取消',(v1,v2)=>socket.emit('join room',RoomItem.id, v2));
        });
        appendChildren(roomList,[room]);
        appendChildren(room,[roomName]);
        if(RoomItem.member.length < 2)appendChildren(room,[roomPublic]);
    }
    function createButton1(isRightButton) {
        const btn = document.createElement('div');
        Object.assign(btn.style, {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            borderTop: '20px solid transparent',
            borderBottom: '20px solid transparent',
            cursor: 'pointer',
            [isRightButton? 'right': 'left']: '180px',
            [isRightButton? 'borderLeft': 'borderRight']: '30px solid #FF8800',
        });
        btn.addEventListener('mousemove',()=>btn.style[isRightButton? 'borderLeft': 'borderRight'] = '30px solid #BBFF66');
        btn.addEventListener('mouseout' ,()=>btn.style[isRightButton? 'borderLeft': 'borderRight'] = '30px solid #FF8800');
        btn.addEventListener('click'    ,()=>createRoomItem(isRightButton ? (page % MaxPage) + 1 : page - 1 || MaxPage));
        return btn;
    }
    appendChildren(roomList,[container]);
    appendChildren(container,[pagetext,refresh,createButton1(true),createButton1(false)]);
}
const createRoom = document.createElement('div');
createRoom.textContent = '創建房間';
Object.assign(createRoom.style,{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    bottom: '10px',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '50px',
    backgroundColor: 'lightblue',
    border: '5px solid #0044BB',
    borderRadius: '25px',
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'red',
});
createRoom.addEventListener('mouseout' ,() => createRoom.style.backgroundColor = 'lightblue');
createRoom.addEventListener('mousemove',() => createRoom.style.backgroundColor = '#0066FF');
createRoom.addEventListener('click',()=>{
    base_background('房間名稱','房間密碼(未設定則公開)','創建','取消',(v1,v2)=>socket.emit('creat room',v1,v2),false);
});
// --------------------------------------------------------------------------------------------
const InformationArea = document.createElement('div');
Object.assign(InformationArea.style, {
    backgroundColor: 'gray',
    width: '280px',
    height: '600px',
    fontSize: '16px',
    padding: '0px 10px 0px 10px',
    color: 'white',
    lineHeight: '1.5'
});
InformationArea.innerText = `
　　　　介紹：
　　主畫面中可以更改玩家名稱，並加入或創建房間，當房間雙方都準備好後便會開始遊戲。
　　此為２人遊戲，名為【步步為營（Quoridor）】。

　　遊戲由棋盤、兩位角色、各十個障礙物組成，玩家必須將自己的角色走到對方的最後一排。玩家輪流行動，行動時可以選擇【移動角色】或【放置障礙物】。
　　角色可以上下左右移動，不能穿過障礙物，如果與其他角色相鄰時，可以直接越過他。如果無法越過他的後方時，可以向其左右兩側移動。
　　障礙物可以放置，但不能重疊、交錯，並且雙方都受影響。放置時也不能讓雙方無法抵達終點。

　　總之，角色移動、放置障礙物，想辦法取得勝利吧。
　　左方有對話區可以對話喔！
`;
// --------------------------------------------------------------------------------------------
const fullScreen = document.createElement('div');
Object.assign(fullScreen.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '1400px',
    height: '600px',
});
appendChildren(fullScreen,[dialogueArea,gameArea,InformationArea]);
// dialogueArea     //左邊的對話區
// gameArea         //中間的遊戲區
// InformationArea  //右邊的資訊區
// --------------------------------------------------------------------------------------------

function gohome_gameArea(room) {
    AllRoom = room;
    gameArea.innerHTML='';
    appendChildren(gameArea,[playerInfo,roomList,createRoom]);
    playerName.textContent = Game_player1.name || "單純的路人";
    Avatar.style.backgroundImage = `url(${Game_player1.avatar_img||'assets/face/facedust1.png'})`;
    playertitle.textContent = Game_player1.title || "路人";
    
    createRoomItem();
}
// --------------------------------------------------------------------------------------------