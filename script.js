// Function flags
var exitStatus = 0, //0 - when in menu; 1 - when in submenu
    menuStatus = 0, //0 - when not logged in; 1 - when in menu, 2-when in submenu
    digitStatus = 0, //0 - when card not inserted; 1 - when typing PIN, 2-when typing amount of cash to deposit/withdraw
    allowDigitType = false, //false - turn off keyboard; true - turn on keyboard
    digitLength = 0,
    divLength = 0,
    maxDigitLength = 0,
    accountStatus = 1000,
    money = "";

// Site start
function start()
{
    onScreen = document.getElementById('screen');
    onScreen.innerHTML = "Wloz karte do czytnika &nbsp; (kliknij - card)";
   // console.log("inner length " + onScreen.innerHTML.length);
    pinCount = 0;
}

//After card button is pressed
var cardInserted = function()
{
    onScreen.innerHTML = "Wpisz kod PIN: ";
    divLength = onScreen.innerHTML.length;
    digitLength = 0;
    maxDigitLength = 4;
    digitStatus = 1;
    allowDigitType = true;
};


//After submit key is pressed
var submitKey = function()
{
    if (digitStatus == 1)
    {
        pinCount++;
        var correctPIN = 1234;
        if(pinCount <= 3)
        {
            if (onScreen.innerHTML.slice(divLength, divLength + maxDigitLength) == correctPIN)
            {
                setTimeout(accountMenu, 100);
            }
            else
            {
                if (pinCount < 3) onScreen.innerHTML += "<br> Bledny kod PIN! Wpisz PIN ponownie. <br> Pozostalo prob: " + (3-pinCount);
                allowDigitType = false;
                setTimeout(cardInserted, 250);
                if (pinCount == 3 && (onScreen.innerHTML.slice(divLength, maxDigitLength) != correctPIN))
                {
                    onScreen.innerHTML += "<br>Przekroczono limit prob - blokada";
                    allowDigitType = false;
                    setTimeout(exit, 250);
                }
            }

        }
    }
    if (digitStatus == 2)
    {
        menuStatus = 1;
        var currentMoney = parseInt(onScreen.innerHTML.slice(divLength, divLength + digitLength));
        if (money === "up") { 
        accountStatus += currentMoney;
        onScreen.innerHTML += "Wplacono!";
                            }
        else if (money === "down")
        {
            if (currentMoney > accountStatus)
            {
                onScreen.innerHTML += "<br>Nie masz wystarczajacej ilosci srodkow na koncie! <br>Wpisz mniejsza kwote.";
                //console.log("Nie masz wystarczającej ilości środków na koncie! Wpisz mniejszą kwotę.");
                document.getElementById("moneySlot").innerHTML = String("Odrzucono");    
                setTimeout((new checkAccountStatus()).withdrawMoney(), 250);
            }
            if (currentMoney < accountStatus) { 
            accountStatus -= currentMoney;
            document.getElementById("moneySlot").innerHTML = String(currentMoney);
        }
        }
      //  console.log("accountStatus " + accountStatus);
    }
};


// Main menu after PIN is accepted
var accountMenu = function()
{
    //var menuElements = document.getElementsByClassName("menu");
    //for (var i=0; i < menuElements.length; i++)
    //{
    //    menuElements[i].style.display = 'block';
    //}
    exitStatus = 0;
    menuStatus = 1;
    allowDigitType = false;
    digitLength = 0;

    onScreen.innerHTML = "Witamy w banku! <br> <-Wplac || &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp;  &nbsp;|| Sprawdz stan konta-> <br><br><br> " +
                            "<-Wyplac || &nbsp;  &nbsp;  &nbsp; &nbsp;  &nbsp; ||  &nbsp; &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; || Wyjscie->";
 
};

var checkAccountStatus = function ()
{
    exitStatus = 1;
    menuStatus = 2;
    allowDigitType = false;
    maxDigitLength = accountStatus.toString().length;
  //  console.log("accountStatus "+accountStatus);
    onScreen.innerHTML = "Twoj stan konta wynosi: " + accountStatus + "PLN";

    this.depositMoney = function()
    {
        exitStatus = 1;
        menuStatus = 2;
        digitStatus = 2;
        allowDigitType = true;
        onScreen.innerHTML = "Kwota do wplaty: ";
        divLength = onScreen.innerHTML.length;
        //var maxDigitLength = maxDigitLength;
       // amount = onScreen.innerHTML.slice(divLength, maxDigitLength);
        money = "up";
      //  console.log("maxDigitLength " + maxDigitLength);
    };
    this.withdrawMoney = function()
    {
        exitStatus = 1;
        menuStatus = 2;
        digitStatus = 2;
        allowDigitType = true;
        onScreen.innerHTML = "Kwota do wyplaty: ";
        divLength = onScreen.innerHTML.length;
        // var maxDigitLength = maxDigitLength;
        //amount = onScreen.innerHTML.slice(divLength, maxDigitLength);
        //accountStatus -= amount;
        money = "down";
      //  console.log("maxDigitLength " + maxDigitLength);
    };
};





// Function which handles machine buttons
function actionListener(actionName)
{
    switch (actionName)
    {
        case 'deposit': if (menuStatus === 1) (new checkAccountStatus()).depositMoney();
            break;
        case 'withdraw': if (menuStatus === 1) (new checkAccountStatus()).withdrawMoney();
            break;
        case 'accountStatus': if (menuStatus === 1) checkAccountStatus();
            break;
        case 'insertCard': if (menuStatus === 0) cardInserted();
            break;
        case 'keyOk': /*if (menuStatus === 0)*/ submitKey();
            break;
        case 'exit': exit();
            break;
    }
}


// Function which handles num keyboard; checks which (sub)menu is now active and maintain appropriate add and delete of digits
function digitListener(value)
{
    if (allowDigitType === false) return;

    function delDigit()
    {
        if (onScreen.innerHTML.length > divLength)
        {
            onScreen.innerHTML = document.getElementById("screen").innerHTML.slice(0, -1);
            digitLength--;
        }
    }

    if (value === 'delete') delDigit();
    else if (value !== 'delete')
    {
       // console.log("string length " + divLength);
        if (divLength + digitLength < divLength + maxDigitLength)
        {
            document.getElementById("screen").innerHTML += parseInt(value);
            digitLength++;
        }
    }
}

// When "wyjdź" pressed
var exit = function()
{
    switch (exitStatus)
    {
        case 0: location.reload(true);
            break;
        case 1: accountMenu();
            break;
    }
    exitStatus = 0;
};
var ALERT_TITLE = "Uwaga";
var ALERT_BUTTON_TEXT = "Ok";


if(document.getElementById) {
    window.alert = function(txt) {
        createCustomAlert(txt);
    }
}

function createCustomAlert(txt) {
    d = document;

    if(d.getElementById("modalContainer")) return;

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";
    
    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";

    h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode(ALERT_TITLE));

    msg = alertObj.appendChild(d.createElement("p"));
    //msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert();return false; }

    alertObj.style.display = "block";
    
}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}
function ful(){
alert('Alert this pages');
}
var video = document.querySelector("#videoElement");
 
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
if (navigator.getUserMedia) {       
    navigator.getUserMedia({video: true}, handleVideo, videoError);
}
 
function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}
 
function videoError(e) {
    // do something
}
  $( function() {
    $( "#selectable" ).selectable({
      stop: function() {
        var result = $( "#select-result" ).empty();
        $( ".ui-selected", this ).each(function() {
          var index = $( "#selectable li" ).index( this );
          result.append( " #" + ( index + 1 ) );
        });
      }
    });
  } );
  