const inputStyle = {
    color: 'white',
    margin: '40px auto',
    display: 'block',
    fontSize: '30px',
    borderRadius: '20px',
    padding: '10px',
    background: 'none',
    border: '2px solid skyblue',
    width: '220px',
    transition: '0.5s',
    outline: 'none',
};
const focusStyle = {
    borderColor: 'lightcoral',
    width: '250px',
};
const login = document.createElement('div');
login.textContent = '登入介面';
Object.assign(login.style, {
    backgroundColor: '#0b132b',
    boxShadow: '10px 10px 10px black',
    color: 'red',
    width: '400px',
    borderRadius: '20px',
    fontSize: '70px',
    textAlign: 'center',
    padding: '40px',
});
const input1 = document.createElement('input');
const input2 = document.createElement('input');
input1.type = 'text';
input2.type = 'password';
input1.placeholder = '輸入帳號';
input2.placeholder = '輸入密碼';
input1.addEventListener('focus',() => Object.assign(input1.style, focusStyle));
input2.addEventListener('focus',() => Object.assign(input2.style, focusStyle));
input1.addEventListener('blur' ,() => Object.assign(input1.style, inputStyle));
input2.addEventListener('blur' ,() => Object.assign(input2.style, inputStyle));
Object.assign(input1.style, inputStyle);
Object.assign(input2.style, inputStyle);
const loginBtn = document.createElement('input');
loginBtn.type = 'submit';
loginBtn.value = '登入';
loginBtn.addEventListener('mouseover',() => loginBtn.style.backgroundColor = 'lightgreen');
loginBtn.addEventListener('mouseout' ,() => loginBtn.style.background = 'none');
loginBtn.addEventListener('click'    ,() => socket.emit('login', input1.value, input2.value));
Object.assign(loginBtn.style, {
    border: '2px solid green',
    color: 'gray',
    width: '150px',
    cursor: 'pointer',
    transition: '0.5s',
    margin: '40px auto',
    display: 'block',
    fontSize: '30px',
    borderRadius: '20px',
    padding: '10px',
    background: 'none',
});
login.appendChild(input1);
login.appendChild(input2);
login.appendChild(loginBtn);