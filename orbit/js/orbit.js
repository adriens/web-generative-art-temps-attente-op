let data;
//let url = "http://localhost:8081/agences/";
let url = "http://localhost:8081/agences?commune=noumea";
let fps = 0;
let fpsHistory = [];

let slider;

let agences = [];
let waitingTimeArray = [];

let dayProgression;
let nightProgression;

function preload(){
    p5.disableFriendlyErrors = true;
    loadJSON(url, gotData);
}

function gotData(json){
    data = json;
}

function setup(){
    frameRate(120);
    createCanvas(windowWidth, windowHeight);

    for(let i = 0; i < Object.keys(data).length; i++) {
        waitingTimeArray.push(data[i].realMaxWaitingTimeMs);;
    }

    waitingTimeArray.sort();
    let maxWaitingTime = waitingTimeArray[waitingTimeArray.length-1];

    for(let i = 0; i < Object.keys(data).length; i++) {
        agences.push(new Agence(i,
            data[i].idAgence,
            data[i].designation,
            data[i].realMaxWaitingTimeMs,
            maxWaitingTime));
    }

    setInterval(updateAllAgencies, 300000)
    setInterval(refreshFPS, 1000);

    slider = createSlider(1, 200, 20);
    slider.position(120, height-250);
    slider.style("width","300px");
}

function draw(){
    clear();
    showAllAgencies();
    showDate();
    showSlider();
    showDayProgressionCircle();
    showDayProgressionText();
    showLegend();
    showFpsHistory();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function showAllAgencies(){
    for(let i = agences.length-1; i >= 0; i--){
        if(dayProgression === 0 || dayProgression === 100){
            agences[i].renderNight(slider.value());
        } else {
            agences[i].renderDay(slider.value());
        }
    }
}

function updateAllAgencies(){
    loadJSON(url, gotData);
    for(let i = 0; i < Object.keys(data).length; i++) {
        waitingTimeArray.push(data[i].realMaxWaitingTimeMs);;
    }
    waitingTimeArray.sort();

    for(let i = 0; i < Object.keys(data).length; i++) {
        agences[i].updateDatas(data[i].realMaxWaitingTimeMs, waitingTimeArray[waitingTimeArray.length-1]);
    }
}

function showDate(){
    push();

    translate(width/2, height/2);

    fill(255);
    stroke(255);
    moment.locale("fr");

    let date = moment().format("dddd").charAt(0).toUpperCase() + moment().format("dddd").slice(1);
    date += " " + moment().format("Do") + " " + moment().format("MMMM");
    //date += moment().format("MMMM").charAt(0).toUpperCase() + moment().format("MMMM").slice(1);
    textSize(32);
    text(date, -width/2.25+5, -height/3-80);

    textSize(64);
    let time = moment().format("HH:mm:ss");
    text(time, -width/2.25, -height/3);
    textSize(24);
    text("FPS: " + fps, -width/2.25+5, -height/3+50);

    pop();
}

function showDayProgressionCircle(){
    push();

    let globalProgression = getDayProgression();

    dayProgression = map(globalProgression, 31.25, 66.67, 0, 100, true);
    nightProgression = 0;
    if(globalProgression > 66.67 || globalProgression < 31.25){
        if(globalProgression > 0 && globalProgression < 31.25){
            nightProgression = 50 + map(globalProgression, 0, 31.25, 0, 50);
        } else {
            nightProgression = map(globalProgression, 66.7, 100, 0, 50, true);
        }
    }

    let morningProgression = map(globalProgression, 31.25, 50, 0, 100, true);
    let breakProgression = map(globalProgression, 50, 56.2, 0, 100, true);
    let noonProgression = map(globalProgression, 56.2, 66.7, 0, 100, true);
    if(nightProgression > 0){
        morningProgression = breakProgression = noonProgression = 100;
    }

    let percentToRad = PI/50;

    noFill();
    strokeWeight(12);
    stroke(120,120,250);
    arc(width-100,height-100,100,100,-PI/2,morningProgression*percentToRad-(PI/2));

    stroke(100,120,210);
    arc(width-100,height-100,80,80,-PI/2,breakProgression*percentToRad-(PI/2));

    stroke(80,120,180);
    arc(width-100,height-100,60,60,-PI/2,noonProgression*percentToRad-(PI/2));

    fill(80,120,150);
    noStroke();
    arc(width-100,height-100,50,50,-PI/2,nightProgression*percentToRad-(PI/2));

    pop();
}

function showDayProgressionText(){
    push();
    noStroke();
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text("Progression",width-100, height-160);
    text("Jour: " + dayProgression.toFixed(2)+"%", width-100, height-25);
    text("Nuit: " + nightProgression.toFixed(2)+"%", width-100, height-5);
    pop();
}

function getDayProgression(){
    let start = moment("000000", "HHmmss").valueOf();
    let end = moment("235959", "HHmmss").valueOf();

    return map(moment().valueOf(), start, end, 0, 100, true);
}

function showSlider(){
    push();
    fill(255);
    textSize(16);
    text("Taille des trainées: " + slider.value() + " points", 120, height-265);
    pop();
}

function mouseInArea(x1, y1, x2, y2){
    //print(mouseX, mouseY, x1, y1, x2, y2);
    return x2 > mouseX && mouseX > x1 && y2 > mouseY && mouseY > y1;
}

function showLegend(){
    let size = 300;
    let xStart = 120;
    let xEnd = xStart+size;

    push();
    noStroke();
    fill(255);
    textSize(16);
    text("Temps d'attente", xStart-1, height-130);

    textSize(12);
    text("Rapide", xStart-1, height-110);
    text("Long", xEnd-30, height-110);

    noFill();
    stroke(255);
    strokeWeight(2);
    rect(xStart-1, height-101, size+1, 52);
    pop();
    for(let i = xStart; i < xEnd; i++){
        push();
        stroke(map(i, xStart, xEnd, 150, 255, true), 0, 255);
        line(i, height-100, i, height-50);
        pop();
    }
}

function refreshFPS(){
    if(fpsHistory.length > 17){
        fpsHistory.splice(0,1);
    }

    fps = parseInt(frameRate());
    fpsHistory.push(fps);
}

function showFpsHistory(){
    push();
    noFill();
    stroke(255);
    rect(110, 250, 330, 100);
    for(let i = fpsHistory.length-1; i > 1; i--){
        let x = 65+i*(440/20);
        let y = map(fpsHistory[i], 0, 120, 350, 250, true);

        let prevX = 65+(i+1)*(440/20);
        let prevY = map(fpsHistory[i+1], 0, 120, 350, 250, true);

        line(x, y, prevX, prevY);
    }

    text("Histogramme des FPS", 310, 245);
    text("120", 110, 245);
    text("0", 110, 365);
    pop();
}