let isKickable = false;
let isHomeowner = false;
let Room_ready = false;
const Room_Base_Plate = document.createElement('div');
Object.assign(Room_Base_Plate.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '430px',
    backgroundColor: '#777777',
    border: '1px solid black',
    borderRadius: '20px',
    overflow: 'hidden',
});
// 房間開頭
const Room_Base = document.createElement('div');
const Room_Title = document.createElement('div');
const Room_Text = document.createElement('div');
const Room_Set = document.createElement('div');
Room_Set.addEventListener('click',()=>{
    if(isHomeowner)
        base_background('房間名稱','房間密碼(未設定則公開)','更改設定','取消',(v1,v2)=>socket.emit('change room',v1,v2,TheRoom),true);
    else alert("你不是房主");
});
Object.assign(Room_Base.style, {
    position: 'absolute',
    width: '600px',
    height: '100px',
    backgroundColor: 'darkblue',
    overflow: 'hidden',
});
Object.assign(Room_Title.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    width: '550px',
    height: '50px',
    backgroundColor: '#AAAAAA',
    borderRadius: '30px',
    overflow: 'hidden',
});
Object.assign(Room_Text.style, {
    width: '480px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 10px',
    fontSize: '20px',
    borderRadius: '25px',
    backgroundColor: '#777',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
});
Object.assign(Room_Set.style, {
    position: 'absolute',
    right: '0px',
    top: '0px',
    margin: '10px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundImage: 'url("assets/special/set.png")',
    backgroundSize: 'cover',
    cursor: 'pointer',
});
// 玩家1(房主)
const  Room_playerInfo_1 = document.createElement('div');Object.assign( Room_playerInfo_1.style, playerInfo_ (true,'50px','150px'));
const      Room_Avatar_1 = document.createElement('div');Object.assign(     Room_Avatar_1.style, Avatar_     (true,'-1px'));
const  Room_playerName_1 = document.createElement('div');Object.assign( Room_playerName_1.style, playerName_ (true,'60px'));
const Room_playertitle_1 = document.createElement('div');Object.assign(Room_playertitle_1.style, playertitle_(true,'20px'));
// 玩家2
const  Room_playerInfo_2 = document.createElement('div');Object.assign( Room_playerInfo_2.style, playerInfo_ (false,'50px','50px'));
const      Room_Avatar_2 = document.createElement('div');Object.assign(     Room_Avatar_2.style, Avatar_     (false,'-1px'));
const  Room_playerName_2 = document.createElement('div');Object.assign( Room_playerName_2.style, playerName_ (false,'60px'));
const Room_playertitle_2 = document.createElement('div');Object.assign(Room_playertitle_2.style, playertitle_(false,'20px'));
Room_Avatar_2.addEventListener('mouseover',()=>{if(isKickable)Object.assign(Room_Avatar_2.style,{filter:'brightness(0.5)',boxShadow:'gray'});});
Room_Avatar_2.addEventListener('mouseout' ,()=>{if(isKickable)Object.assign(Room_Avatar_2.style,{filter:'brightness(1)'  ,boxShadow:'none'});});
Room_Avatar_2.addEventListener('click'    ,()=>{if(isKickable)socket.emit('leave room',TheRoom.member[1]);});
// 準備按鈕
const Room_readyBtn = document.createElement('div');
Object.assign(Room_readyBtn.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(0,50px) translate(-50%, -50%) ',
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    backgroundImage: 'linear-gradient(green,lightgreen)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '35px',
    cursor: 'pointer',
});
Room_readyBtn.addEventListener('mousemove',()=>Room_readyBtn.style.backgroundImage = `linear-gradient(${Room_ready?'lightcoral,red':'lightgreen,green'})`);
Room_readyBtn.addEventListener('mouseout' ,()=>Room_readyBtn.style.backgroundImage = `linear-gradient(${Room_ready?'red,lightcoral':'green,lightgreen'})`);
Room_readyBtn.addEventListener('click'    ,()=>socket.emit('ready room'));
// 離開按鈕
const Room_leaveBtn = document.createElement('div');
Room_leaveBtn.textContent = "退出房間";
Object.assign(Room_leaveBtn.style, {
    position: 'absolute',
    left: '10%',
    bottom: '10%',
    width: '180px',
    height: '40px',
    borderRadius: '20px',
    backgroundImage: 'linear-gradient(to right,blueviolet,darkslateblue)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    color: 'white',
    cursor: 'pointer',
});
Room_leaveBtn.addEventListener('mousemove',()=>Room_leaveBtn.style.backgroundImage = 'linear-gradient(to right,darkslateblue,blueviolet)');
Room_leaveBtn.addEventListener('mouseout' ,()=>Room_leaveBtn.style.backgroundImage = 'linear-gradient(to right,blueviolet,darkslateblue)');
Room_leaveBtn.addEventListener('click'    ,()=>{
    if(Room_ready)socket.emit('chat message','system-message','請解除準備狀態');
    else socket.emit('leave room',socket.id);
});
// 合併
appendChildren(Room_Base, [Room_Title]);
appendChildren(Room_Title, [Room_Text, Room_Set]);
appendChildren(Room_playerInfo_1, [Room_Avatar_1, Room_playerName_1, Room_playertitle_1]);
appendChildren(Room_playerInfo_2, [Room_Avatar_2, Room_playerName_2, Room_playertitle_2]);
appendChildren(Room_Base_Plate, [Room_Base, Room_playerInfo_1, Room_playerInfo_2, Room_readyBtn, Room_leaveBtn]);

function goRoom_gameArea(room) {
    gameArea.innerHTML='';
    appendChildren(gameArea, [Room_Base_Plate]);
    changeRoom_gameArea(room);
}
function changeRoom_gameArea(room){
    TheRoom = room;
    isHomeowner = socket.id == TheRoom?.member[0];
    isKickable = (isHomeowner && TheRoom?.member?.length > 1);
    Room_ready = TheRoom?.player[socket.id]?.ready;

    setPlayerInfo(Game_player1=TheRoom.player[TheRoom?.member[0]],Room_playerInfo_1,Room_playerName_1,Room_Avatar_1,Room_playertitle_1,Game_player1?.ready?'green':'red', true);
    setPlayerInfo(Game_player2=TheRoom.player[TheRoom?.member[1]],Room_playerInfo_2,Room_playerName_2,Room_Avatar_2,Room_playertitle_2,Game_player2?.ready?'green':'red',false);
    Room_Text.textContent = "房間名：" + TheRoom.title;
    Room_Avatar_2.style.cursor = isKickable ? 'pointer' : '';
    Room_Avatar_2.title = isKickable ? '點擊後可踢出' : '';
    Room_readyBtn.style.backgroundImage = `linear-gradient(${Room_ready ? 'red,lightcoral' : 'green,lightgreen'})`;
    Room_readyBtn.textContent = Room_ready ? '取消' : '準備';
}