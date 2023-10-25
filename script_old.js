// Complete project details: https://randomnerdtutorials.com/esp8266-nodemcu-web-server-websocket-sliders/

var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
window.addEventListener('load', onload);
document.getElementById("sliderValue1").innerHTML = 0;
document.getElementById("sliderValue2").innerHTML = 0;

function onload(event) {
    initWebSocket();
}

function getValues(){
    websocket.send("getValues");
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
    getValues();
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

function updateSliderPWM(element) {
    var sliderNumber = element.id.charAt(element.id.length-1);
    var sliderValue = document.getElementById(element.id).value;
    document.getElementById("sliderValue"+sliderNumber).innerHTML = sliderValue;
    // websocket.send("1s"+sliderValue.toString());
    // websocket.send("2s"+sliderValue.toString());
    run()
}

function updateSliderPWMdir(element) {
    var sliderNumber = element.id.charAt(element.id.length-1);
    var sliderValue = document.getElementById(element.id).value;
    document.getElementById("sliderValue"+sliderNumber).innerHTML = sliderValue;
    // websocket.send("1s"+sliderValue.toString());
    // websocket.send("2s"+sliderValue.toString());
    run()
}

function onMessage(event) {
    console.log(event.data);
    var myObj = JSON.parse(event.data);
    var keys = Object.keys(myObj);
    console.log(myObj)

    // for (var i = 0; i < keys.length; i++){
    //     var key = keys[i];
    //     document.getElementById(key).innerHTML = myObj[key];
    //     document.getElementById("slider"+ (i+1).toString()).value = myObj[key];
    // }
}

function stopMotors(sliderNumber){
    document.getElementById("slider"+sliderNumber).value = 0;
    document.getElementById("sliderValue"+sliderNumber).innerHTML = 0;
    var sliderValue = document.getElementById("slider"+sliderNumber).value;
    // websocket.send(sliderNumber+"s"+sliderValue.toString());
    run()

}

function run(){
    var speed = parseInt(document.getElementById("slider1").value);
    var direction = parseInt(document.getElementById("slider2").value);
    var roda1
    var roda2
    if(speed == 0){
        roda1 = direction
        roda2 = direction*-1
    } else{
        if(direction < 0){
            roda1 = (speed - speed/(100/(-1*direction/2)))
            roda2 = speed
            // direction = direction * -1
            // roda1 = -1 * (speed * ((100 - direction) / 100))
            // roda2 = speed * (direction / 100)
        } else if(direction > 0){
            roda2 = (speed - speed/(100/(direction/2)))
            roda1 = speed
            // roda2 = -1 * (speed * ((100 - direction) / 100))
            // roda1 = speed * (direction / 100)
        } else{
            roda1 = speed
            roda2 = speed
        }
    }
    console.log("roda1 = "+roda1+", roda2 = "+roda2)
    websocket.send("1s"+roda1.toString());
    websocket.send("2s"+roda2.toString());
}

function stopcar(){
    document.getElementById("slider1").value = 0;
    document.getElementById("sliderValue1").innerHTML = 0;
    var sliderValue = document.getElementById("slider1").value;
    websocket.send("1s"+sliderValue.toString());
    document.getElementById("slider2").value = 0;
    document.getElementById("sliderValue2").innerHTML = 0;
    var sliderValue = document.getElementById("slider2").value;
    websocket.send("2s"+sliderValue.toString());
}