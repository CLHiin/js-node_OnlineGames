const socket = io();

const Attributes = ['dust','water','fire','wind'];
const Special = ['attack','effect','defense','front_cover', 'cardback'];

const Facecard = [];
for(const i of Attributes)for(const j of [1, 2, 3])Facecard.push('assets/face/face' + i + j + '.png');

let AllRoom = [];
let TheRoom = {};
let Game_player1,Game_player2;
/*
房間物件範例{
    id: 17,
    title: "1223",
    public: "",
    member: ["aFZY4xOgn1GOPYdoAAAb",],
    player: {"aFZY4xOgn1GOPYdoAAAb": {玩家物件},},
    data:[
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ...
    ],
};
玩家物件範例{
    this.id = id;
    this.account = account.account_Name;
    this.name = account.name;
    this.title = account.title;
    this.token = token;
    this.avatar_img = 'assets/face/facedust1.png';
    this.ready: false;
};
*/
let focus_cell = null;
const cell_size = 35;
const board_margin = 7;
const cellObject_size = 17;
const useObject1 = Array(10).fill(null);
const useObject2 = Array(10).fill(null);
const cellObject = Array.from({ length: cellObject_size }, () => Array(cellObject_size).fill(null));

const appendChildren = (parent, children)=>{
    children.forEach(child => parent.appendChild(child));
}
const playerInfo_ = (is1,v1,v2)=>{
    return {
        position: 'absolute',
        width: '200px',
        height: '50px',
        borderRadius: '30px',
        border: '3px solid red',
        backgroundColor: 'white',
        overflow: 'hidden',
        zIndex: 1,
        [is1? 'left': 'right']:v1,
        [is1? 'top': 'bottom']:v2,
    }
};
const Avatar_ = (is1,v1)=>{
    return {
        position: 'absolute',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundSize: 'cover',
        [is1? 'left': 'right']:v1,
    }
};
const playerName_ = (is1,v1)=>{
    return{
        position: 'absolute',
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'black',
        top: '10%',
        [is1? 'left': 'right']:v1,
    }
}
const playertitle_ = (is1,v1)=>{
    return{
        position: 'absolute',
        top: '55%',
        fontSize: '15px',
        fontWeight: 'bold',
        color: 'blue',
        [is1? 'right': 'left']:v1,
    }
}
const base_background = (input_1,input_2,btn_1,btn_2,function_,haveValue)=>{
    const background = document.createElement('div');
    Object.assign(background.style,{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        width: '800px',
        height: '600px',
        zIndex: 2,
        position: 'fixed',
    });
    const bottom = document.createElement('div');
    Object.assign(bottom.style,{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#00AAAA',
        width: '500px',
        borderRadius: '50px',
    });
    const btn1 = createButton(btn_1, 'right', '20%', '0%', () => {background.remove();function_(input1.value, input2.value);});
    const btn2 = createButton(btn_2, 'left' , '20%', '0%', () => background.remove());
    const input1 = createInput('text', haveValue?TheRoom.title:'', input_1);
    const input2 = createInput('password', haveValue?TheRoom.public:'', input_2);
    input2.addEventListener('input', () => input2.value = input2.value.replace(/[^a-zA-Z0-9]/g, ''));
    const toggleBtn = document.createElement('div');
    Object.assign(toggleBtn.style, {
        position: 'absolute',
        bottom: '130px',
        right: '95px',
        width: '35px',
        height: '35px',
        cursor: 'pointer',
        backgroundImage: 'url("assets/special/password_display.png")',
        backgroundSize: 'cover',
        backgroundPosition: '35px',
    });
    let showPassword = false;
    toggleBtn.addEventListener('click', () => {
        showPassword = !showPassword;
        input2.type = showPassword ? 'text' : 'password';
        toggleBtn.style.backgroundPosition = showPassword ? '0' : '35px';
    });
    appendChildren(gameArea, [background]);
    appendChildren(background, [bottom]);
    appendChildren(bottom, [input1, input2, toggleBtn, btn1, btn2]);
    if (!input_1) input1.remove();
}
const createButton = (text, float_, marginLR, marginTB, clickHandler) => {
    const btn = document.createElement('div');
    Object.assign(btn.style,{
        display: 'block',
        padding: '10px 20px',
        marginBottom: '30px',
        backgroundColor: '#4CAF50',
        fontSize: '26px',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        float: float_,
        [float_== 'left'?'marginLeft':'marginRight']: marginLR,
        marginTop: marginTB,
    });
    btn.textContent = text;
    btn.addEventListener('mousemove', () => btn.style.backgroundColor = '#00AA00');
    btn.addEventListener('mouseout', () => btn.style.backgroundColor = '#4CAF50');
    btn.addEventListener('click', clickHandler);
    return btn;
};
const createInput = (type, value, placeholder, pattern) => {
    const input = document.createElement('input');
    Object.assign(input.style, {            
        display: 'block',
        background: 'none',
        borderRadius: '50px',
        border: '2px solid skyblue',
        outline: 'none',
        width: '320px',
        fontSize: '26px',
        margin: '40px auto',
        padding: '5px 10px',
    });
    input.type = type;
    input.value = value || '';
    input.placeholder = placeholder;
    input.maxLength = 10;
    if (pattern) input.pattern = pattern;
    return input;
};
const setPlayerInfo = (player, playerInfo, playerName, avatar, playerTitle, border, isHost)=>{
    playerInfo.style.border = '3px solid ' + border;
    playerName.textContent = player?.name || "(尚未加入)";
    avatar.style.backgroundImage = `url(${player?.avatar_img || 'assets/face/facedust1.png'})`;
    playerTitle.textContent = `${player?.title || "???"}${isHost ? "(房主)" : ""}`;
};
const setInstructAvatar = (Image,color)=>{
    return {
        position: 'absolute',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundSize: 'cover',            
        backgroundImage: Image,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 3px 5px ${color}, 0 -2px 3px inset`,
    }
}