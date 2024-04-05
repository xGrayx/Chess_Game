chess_storage= window.localStorage;
let answer;
let user_time;
let user_name;

function redirect(){
    window.location.href = 'chess.html'
}

function validate_user(){
    let messageArea= document.getElementById('message_box');
    let username= document.getElementById("username").value;
    let password= document.getElementById("password").value;
    let login = "userName="+ username + "&password=" + password;

    let credRequest = new XMLHttpRequest();
    credRequest.open("POST", "http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php", true);
    credRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    credRequest.onreadystatechange= function () {
        if (credRequest.readyState === 4 && credRequest.status === 200) {
            let answerData= JSON.parse(credRequest.responseText);
            answer= answerData.result;
            if(answer==='valid'){
                messageArea.style.color= "green";
                messageArea.innerHTML= "<br>Logging in...";
                user_time= answerData.timestamp;
                user_name= answerData.userName;

                let stored_info= user_name + " " + user_time;
                localStorage.setItem("cs2550timestamp", stored_info)
                redirect();
            }else{
                messageArea.innerHTML= "<br>The Credentials You Entered were Incorrect"
            }
        }
    }
    credRequest.send(login);
}
