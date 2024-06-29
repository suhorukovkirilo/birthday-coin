var token = '7233389409:AAE3tbm5_PAZNiQcel032Tzs1oliEkeO1Rk';
var data = window.Telegram.WebApp.initDataUnsafe;
var user = data.user;
var id = user.id;
var name = user.first_name;
var surname = user.last_name;

document.querySelector(".fullname").innerHTML = name + ' ' + surname;
document.querySelector(".identifier").innerHTML = id;

var login = location.href.split("login=")[1].split("&")[0];
var password = location.href.split("password=")[1].split("#")[0];
var globalQuestion = {};
var correctAnswered = 0;
var products = {};
var july5th = {};
var july7th = {};


fetch("https://liriker.pythonanywhere.com/api/" + login + "/" + password + "/products", {"method": "GET"})
.then(response => response.json())
.then(data => {
    products = data.products;
    var shopItems = document.querySelectorAll(".shop-items .item");
    i = 0;
    while (i < products.main.length) {
        var img = document.createElement('img');
        img.src = products.main[i].img;
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
        img.style.maxWidth = '33vw';
        img.style.maxHeight = '25vw';
        img.style.borderRadius = '16px';
        shopItems[i].appendChild(img);

        if (products.main[i].img == "static/MOBILE.png") {
            img.style.maxHeight = '20vw';
        };

        var name = document.createElement('p');
        name.innerHTML = products.main[i].name;
        name.style.display = 'block';
        name.style.margin = 'auto';
        name.style.textAlign = 'center';
        name.style.height = '10vw';
        shopItems[i].appendChild(name);

        var total = document.createElement('div');
        total.innerHTML = (products.main[i].num - products.main[i].bought[login]).toString() + '/' + products.main[i].num.toString();
        total.style.position = 'absolute';
        total.style.right = '5%';
        total.style.top = '3%';
        shopItems[i].appendChild(total);

        shopItems[i].setAttribute('data-number', i);

        shopItems[i].addEventListener('click', OpenCard);
        i += 1;
    };

    var bought = products["bought-main"][login];

    for (var buy of bought) {
        document.querySelector(".account ul").innerHTML += '<li style="display: flex; align-items: center; margin-bottom: 5%;">' + '<img src="' + buy.img + '" style="max-height: 50px; margin-right: 20px; border-radius: 10px;">' + buy.name + '</li>'
    }
})

fetch("https://liriker.pythonanywhere.com/api/" + login + "/" + password + "/info", {"method": "GET"})
.then(response => response.json())
.then(data => {
    document.querySelector(".balance").setAttribute('balance', data.balance)
    document.querySelector(".balance").innerHTML = "Баланс: "+  document.querySelector(".balance").getAttribute('balance') + " Bcoin";
    document.querySelector(".show-balance").innerHTML = "Баланс: "+  document.querySelector(".balance").getAttribute('balance') + " Bcoin";
    document.querySelector(".counter .hour").innerHTML = data.time.hour;
    document.querySelector(".counter .minute").innerHTML = data.time.minute;
    document.querySelector(".counter .second").innerHTML = data.time.second + 1;
    TimerProccess(document.querySelector(".counter"));
    setInterval(function() {TimerProccess(document.querySelector(".counter"))}, 1000);
    if (data.july7th.day >= 2) {
        document.querySelector(".shop-counter .day").innerHTML = data.july5th.day;
        document.querySelector(".shop-counter .hour").innerHTML = data.july5th.hour;
        document.querySelector(".shop-counter .minute").innerHTML = data.july5th.minute;
        document.querySelector(".shop-counter .second").innerHTML = data.july5th.second + 1;
        TimerProccess(document.querySelector(".shop-counter"));
        setInterval(function() {TimerProccess(document.querySelector(".shop-counter"))}, 1000);  
    } else {
        document.querySelector(".shop-counter .day").innerHTML = data.july7th.day;
        document.querySelector(".shop-counter .hour").innerHTML = data.july7th.hour;
        document.querySelector(".shop-counter .minute").innerHTML = data.july7th.minute;
        document.querySelector(".shop-counter .second").innerHTML = data.july7th.second + 1;
        TimerProccess(document.querySelector(".shop-counter"));
        setInterval(function() {TimerProccess(document.querySelector(".shop-counter"))}, 1000);
    };

    july5th = data.july5th;
    july7th = data.july7th;
});

function RandInt(min, max) {
    return Math.floor(min + Math.random() * (max - min))
};

function SetAvatarUrl(token, id) {
    fetch("https://api.telegram.org/bot" + token + "/getUserProfilePhotos?user_id=" + id + "&limit=1")
    .then(response => response.json())
    .then(data => data["result"]["photos"][0][2]["file_id"])
    .then(file_id => fetch("https://api.telegram.org/bot" + token + "/getFile?file_id=" + file_id))
    .then(response => response.json())
    .then(data => data["result"]["file_path"])
    .then(file_path => {
        document.querySelector(".avatar").src = "https://api.telegram.org/file/bot7233389409:AAE3tbm5_PAZNiQcel032Tzs1oliEkeO1Rk/" + file_path;
        document.querySelector(".account-avatar").src = "https://api.telegram.org/file/bot7233389409:AAE3tbm5_PAZNiQcel032Tzs1oliEkeO1Rk/" + file_path
    });
};

function TimerProccess(counter) {
    if (counter.querySelector(".day") !== null) {
        var day = parseInt(counter.querySelector(".day").innerHTML);
    } else {
        var day = 'NaN';
    };
    var hour = parseInt(counter.querySelector(".hour").innerHTML);
    var minute = parseInt(counter.querySelector(".minute").innerHTML);
    var second = parseInt(counter.querySelector(".second").innerHTML);

    second -= 1;

    if (second < 0) {
        second = 59;
        minute -= 1;
        if (minute < 0) {
            minute = 59;
            hour -= 1;
            if (hour < 0 && day === 'NaN') {
                second = 0;
                minute = 0;
                hour = 0;
                document.querySelector(".start").disabled = false;
                document.querySelector(".start").classList.remove("disabled");
            } else if (hour < 0 && day !== 'NaN') {
                hour = 23;
                day -= 1
                if (day < 0) {
                    second = 0;
                    minute = 0;
                    hour = 0;
                    day = 0;
                };
            };
        };
    };

    second = second.toString();
    minute = minute.toString();
    hour = hour.toString();
    if (second.length < 2) {
        second = "0" + second;
    };
    if (minute.length < 2) {
        minute = "0" + minute;
    };
    if (hour.length < 2) {
        hour = "0" + hour;
    };

    counter.querySelector(".hour").innerHTML = hour;
    counter.querySelector(".minute").innerHTML = minute;
    counter.querySelector(".second").innerHTML = second;

    if (counter.querySelector(".day") !== null) {
        day = day.toString();
        if (day.length < 2) {
            day = "0" + day;
        };

        counter.querySelector(".day").innerHTML = day;
    };

};

function OpenShop() {
    for (var el of document.querySelectorAll(".counter, .main-pic, .balance, .start, .item-card, .prequiz, .quiz, .after-quiz, .info, .account")) {
        el.classList.add("hide")
    };

    for (var el of document.querySelectorAll(".shop-items")) {
        el.classList.remove("hide")
    };
}

function PreQuiz() {
    for (var el of document.querySelectorAll(".counter, .main-pic, .balance, .start, .shop-items, .item-card, .quiz, .after-quiz, .info, .account")) {
        el.classList.add("hide")
    };

    for (var el of document.querySelectorAll(".prequiz")) {
        el.classList.remove("hide")
    };
};

function Quiz() {
    if(parseInt(document.querySelector(".quiz h4").innerHTML.split(" / 5")[0]) >= 5) {
        return afterQuiz();
    };
    document.querySelector("footer").style.visibility = 'hidden';
    document.querySelector(".quiz .send-btn").innerHTML = "Перевірити";
    document.querySelector(".quiz .send-btn").classList.add("disabled");
    document.querySelector(".quiz .send-btn").disabled = true;
    document.querySelector(".quiz .send-btn").onclick = function() {};
    for(var el of document.querySelectorAll(".quiz .answer")) {
        el.classList.remove("correct");
        el.classList.remove("incorrect");
    };
    fetch("https://liriker.pythonanywhere.com/api/" + login + "/" + password + "/is-ready", {"method": "GET"})
    .then(response => response.json())
    .then(data => {
        if (data["is-ready"]) {
            for (var el of document.querySelectorAll(".counter, .main-pic, .balance, .start, .shop-items, .item-card, .prequiz, .after-quiz, .info, .account")) {
                el.classList.add("hide")
            };
        
            for (var el of document.querySelectorAll(".quiz")) {
                el.classList.remove("hide")
            };

            fetch("https://liriker.pythonanywhere.com/api/" + login + "/" + password + "/random")
            .then(response => response.json())
            .then(data => {
                globalQuestion = data.random;
                var question = data.random.question;
                var answers = data.random.answers;
                var answerButtons = document.querySelectorAll(".quiz .answer");
                for (var i of [0, 1, 2, 3]) {
                    answerButtons[i].innerHTML = answers[i];
                    answerButtons[i].onclick = SendAnswer;
                };
                document.querySelector(".quiz h2").innerHTML = question;
            });
        };
    });
};

function SendAnswer() {
    for (var el of document.querySelectorAll(".quiz .answer")) {
        el.classList.remove("selected");
    };
    this.classList.add("selected");
    globalQuestion.userAnswer = this.innerHTML;
    document.querySelector(".quiz .send-btn").classList.remove("disabled");
    document.querySelector(".quiz .send-btn").disabled = false;
    document.querySelector(".quiz .send-btn").onclick = CheckAnswer;
};

function CheckAnswer() {
    for (var el of document.querySelectorAll(".quiz .answer")) {
        el.classList.remove("selected");
    };
    var answerButtons = document.querySelectorAll(".quiz .answer");
    for (var i of [0, 1, 2, 3]) {
        if (answerButtons[i].innerHTML === globalQuestion.correct) {
            answerButtons[i].classList.add("correct");
        };

        if (answerButtons[i].innerHTML === globalQuestion.userAnswer) {
            answerButtons[i].classList.add("incorrect");
        };

        answerButtons[i].onclick = function() {};
    };

    if (globalQuestion.userAnswer === globalQuestion.correct) {
        correctAnswered += 1;
    };

    var information = document.querySelector(".quiz h4").innerHTML;

    var q = (1 + parseInt(information.split(" / 5")[0])).toString();

    var convert = {0: 0, 1: 500, 2: 1000, 3: 1500, 4: 1600, 5: 1600}

    var additional = convert[correctAnswered];

    document.querySelector(".quiz h4").innerHTML = q + " / 5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+" + additional + " BCoin";

    document.querySelector(".quiz .send-btn").onclick = Quiz;
    document.querySelector(".quiz .send-btn").innerHTML = "Далі";
    globalQuestion = {};
};

function afterQuiz() {
    for (var el of document.querySelectorAll(".counter, .main-pic, .balance, .start, .shop-items, .item-card, .prequiz, .quiz, .info, .account")) {
        el.classList.add("hide")
    };

    for (var el of document.querySelectorAll(".after-quiz")) {
        el.classList.remove("hide")
    };

    document.querySelector(".after-quiz h1").innerHTML = document.querySelector(".after-quiz h1").innerHTML
    .replace("x", document.querySelector(".quiz h4").innerHTML.replace("5 / 5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+", "").replace(" BCoin", ""))
    fetch("https://liriker.pythonanywhere.com/api/" + login + "/" + password + "/reset+" + correctAnswered.toString(), {"method": "POST"});
};

function GenerateSnowflake() {
    var snowflake = document.createElement("img");
    var size = RandInt(5, 30);
    var x = RandInt(1, 900) / 10;
    var y = RandInt(1, 800) / 10;
    snowflake.src = "static/snowflake.png";
    snowflake.style.zIndex = '-100';
    snowflake.style.width = size.toString() + 'px';
    snowflake.style.height = size.toString() + 'px'; 
    snowflake.style.position = 'absolute';
    snowflake.style.left = 'calc(' + x.toString() + '% - ' + size.toString() + 'px)';
    snowflake.style.top =  y.toString() + '%';
    snowflake.style.opacity = '0.15';
    document.body.appendChild(snowflake)
    setInterval(function() {
        snowflake.style.top = (parseFloat(snowflake.style.top.replace("%", "")) + 0.1).toString() + '%';
        if (snowflake.style.top === "90%") {
            snowflake.style.top = '0%';
            var x = RandInt(1, 950) / 10;
            snowflake.style.left = x.toString() + '%';
        };
    }, RandInt(50, 200));
};

function Launch() {
    document.body.removeChild(document.querySelector(".loader"));
    document.querySelector("header").removeAttribute("class");
    document.querySelector("main").removeAttribute("class");
    document.querySelector("footer").removeAttribute("class");
}

function OpenInfo() {
    for (var el of document.querySelectorAll(".counter, .main-pic, .balance, .start, .shop-items, .item-card, .prequiz, .quiz, .after-quiz, .account")) {
        el.classList.add("hide")
    };

    for (var el of document.querySelectorAll(".info")) {
        el.classList.remove("hide")
    };
};

function NextInfoCard() {
    var currentNum = parseInt(document.querySelector(".info h4").innerHTML.split("/")[0]);
    var totalNum = document.querySelector(".info h4").innerHTML.split("/")[1]
    if (currentNum !== parseInt(totalNum)) {
        for (var el of document.querySelectorAll(".info .card")) {
            el.style.left = (parseFloat(el.style.left.replace('%', '')) - 100).toString() + '%';
        };

        document.querySelector(".info h4").innerHTML = (currentNum + 1).toString() + '/' + totalNum;
        document.querySelector(".info button.previous").disabled = false;
        document.querySelector(".info button.previous").classList.remove("disabled");

        if (currentNum + 1 === parseInt(totalNum)) {
            document.querySelector(".info button.next").disabled = true;
            document.querySelector(".info button.next").classList.add("disabled");
        };
    };
};

function PreviousInfoCard() {
    var currentNum = parseInt(document.querySelector(".info h4").innerHTML.split("/")[0]);
    var totalNum = document.querySelector(".info h4").innerHTML.split("/")[1]
    if (currentNum !== 1) {
        for (var el of document.querySelectorAll(".info .card")) {
            el.style.left = (parseFloat(el.style.left.replace('%', '')) + 100).toString() + '%';
        };

        document.querySelector(".info h4").innerHTML = (currentNum - 1).toString() + '/' + totalNum;
        document.querySelector(".info button.next").disabled = false;
        document.querySelector(".info button.next").classList.remove("disabled");

        if (currentNum === 2) {
            document.querySelector(".info button.previous").disabled = true;
            document.querySelector(".info button.previous").classList.add("disabled");
        };
    };
}

function OpenCard() {
    if (july5th.day + july5th.hour + july5th.minute + july5th.second === 0) {
        var card = document.querySelectorAll(".shop-items .item")[this.getAttribute('data-number')];

        var itemCard = document.querySelector('.item-card');
        itemCard.classList.remove('hide');
        itemCard.querySelector('img.card-main-pic').src = card.querySelector('img').src;
        itemCard.querySelector('h2').innerHTML = card.querySelector('p').innerHTML;
        for (var product of products.main) {
            if (product["name"] == card.querySelector('p').innerHTML) {
                itemCard.querySelector('h3').innerHTML = product.cost.toString() + ' BCoin';
            };
        };
        if (parseInt(card.querySelector('div').innerHTML.split("/")[0]) !== 0 && july7th.day + july7th.hour + july7th.minute + july7th.second === 0) {
            itemCard.querySelector('button').innerHTML = 'отримати';
            itemCard.querySelector('button').classList.add('moveable');
            itemCard.querySelector("button").addEventListener('click', function() {
                fetch("https://liriker.pythonanywhere.com/api/" + login + "/" + password + "/buy+" + card.querySelector('p').innerHTML, {"method": "POST"})
                .then(response => response.json())
                .then(data => {
                    if (data.buy === "ok") {
                        alert("Товар був успішно придбаний");
                    } else {
                        alert("Щось пішло не так під час покупки. Оновіть сторінку та спробуйте ще")
                    };
                    location.reload();
                })
            });
        } else {
            itemCard.querySelector('button').innerHTML = 'недоступно';
            itemCard.querySelector('button').style.backgroundColor = 'red';
            itemCard.querySelector('button').style.borderBottom = '4px solid darkred';
            itemCard.querySelector('button').classList.remove('moveable');
        };
    };
};

function CloseCard() {
    document.querySelector(".item-card").classList.add('hide');
};

function OpenAccount() {
    for (var el of document.querySelectorAll(".counter, .main-pic, .balance, .start, .shop-items, .item-card, .prequiz, .quiz, .after-quiz, .info")) {
        el.classList.add("hide")
    };

    for (var el of document.querySelectorAll(".account")) {
        el.classList.remove("hide")
    };
};

function OpenMain() {
    for (var el of document.querySelectorAll(".shop-items, .item-card, .prequiz, .quiz, .after-quiz, .info, .account")) {
        el.classList.add("hide")
    };

    for (var el of document.querySelectorAll(".counter, .main-pic, .balance, .start")) {
        el.classList.remove("hide")
    };
};

for(let i = 0; i < 15; i++){
    GenerateSnowflake();
};

var left = 50;

for (var card of document.querySelectorAll(".info .card")) {
    card.style.left = left.toString() + '%';
    left += 100;
};

SetAvatarUrl(token, id);

document.querySelector("footer button").addEventListener('click', OpenMain);
document.querySelectorAll("footer button")[1].addEventListener('click', OpenShop);
document.querySelector(".start").addEventListener('click', PreQuiz);
document.querySelector(".prequiz .cancel-btn").addEventListener('click', OpenMain);
document.querySelector(".prequiz .ok-btn").addEventListener('click', Quiz);
document.querySelector(".after-quiz button").addEventListener('click', function() {location.reload();});
document.querySelectorAll("footer button")[2].addEventListener('click', OpenInfo);
document.querySelector(".info button.next").addEventListener('click', NextInfoCard);
document.querySelector(".info button.previous").addEventListener('click', PreviousInfoCard);
document.querySelector(".item-card img:not(.card-main-pic)").addEventListener('click', CloseCard);
document.querySelector(".info-redirect").addEventListener('click', OpenInfo);
document.querySelectorAll("footer button")[3].addEventListener('click', OpenAccount);

setTimeout(Launch, 3 * 1000 * RandInt(1, 4));
