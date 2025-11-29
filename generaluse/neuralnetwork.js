const canvas = document.getElementById('canvas');
const data = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
const databar = data.getContext('2d');

window.addEventListener('resize', () => {
    setCanvasSize();   // Recalculate canvas size and scale context
    setDataBar();      // Recalculate data bar size
});
// Neural Network

function setCanvasSize() {
    const dpr = window.devicePixelRatio || 1; // Account for high-DPI screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr); // Scale the context to ensure sharp rendering
    ctx.fillStyle = '#d6ecec';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    dimensions = {'width': canvas.width, 'height':canvas.height, 'dpr': dpr}
    console.log(canvas.width, canvas.height);
    return dimensions;
}


function drawconnection(x1,y1, x2,y2){
    ctx.lineWidth = 0.9 / dimensions.dpr;
    ctx.beginPath();
    ctx.moveTo(x1 / dimensions.dpr,y1 / dimensions.dpr);
    ctx.lineTo(x2/ dimensions.dpr,y2/ dimensions.dpr);
    ctx.stroke();
}
function markercircle(x, y, r, col) {
    // Draw the ball
    ctx.beginPath();
    ctx.arc(x/ dimensions.dpr, y/ dimensions.dpr, r/ dimensions.dpr, 0, 2 * Math.PI);
    ctx.fillStyle = col;
    ctx.fill();
}

function drawcircleseries (x, neuronlayer, dim){
    var height = (dimensions.height - (2 * dim))/ (neuronlayer + 1);
    var h = 0 + dim;
    var column = []
    for (var i = 0; i < neuronlayer; i++){
        h += height;
        markercircle(x, h, dimensions.width/80, "green");
        uniquepos = {'x': x, 'y': h, 'r': dimensions.width / 80}
        column.push(uniquepos)
    }
    return column
}

function drawneurons(layers){
    var allcoords = [];
    var innerlayerswidth = dimensions.width * 0.80;
    var layercount = Object.keys(layers).length
    var widthincrement = innerlayerswidth / (layercount - 1)
    var w = 0 + (dimensions.width * 0.1);
    var neuronsarray = Object.values(layers);
    var layer1 = (dimensions.width / 100) * 3;
    var input = drawcircleseries(layer1, neuronsarray[0], 20);
    allcoords.push(input);

    drawcircleseries()
    for (var i=1 ; i<layercount - 1; i++){
        w += widthincrement;
        var hidden = drawcircleseries(w, neuronsarray[i], 0);
        allcoords.push(hidden);
    }
    var layern = (dimensions.width - layer1);
    var output = drawcircleseries(layern, neuronsarray[layercount - 1], 20);
    allcoords.push(output);
    return allcoords
}

function allconnections(coordarray){
    for (var i=0; i<coordarray.length - 1;i++){
        var startarray = coordarray[i];
        var endarray = coordarray[i + 1];
        for (var j=0; j<startarray.length; j++){
            for (var k=0; k<endarray.length; k++){
                drawconnection(startarray[j].x,startarray[j].y, endarray[k].x, endarray[k].y);
            }
        }
    }
}
function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function randomconnection(coordarray){
    var xyarr = [];
    for (var i=0; i<coordarray.length;i++){
        var currarray = coordarray[i];
        var xy = getRandomItem(currarray)
        xyarr.push(xy);
    }
    return xyarr;
}

function randommatch(arrlist, col){
    for (var i =0; i<arrlist.length; i++){
        const {x, y, r} = arrlist[i];
        markercircle(arrlist[i].x, arrlist[i].y, r, col);
    }
}



// Databar

function setDataBar(){
    const dpr2 = window.devicePixelRatio || 1;
    const rect2 = data.getBoundingClientRect();
    data.width = rect2.width;
    data.height = rect2.height;
    databar.scale(dpr2, dpr2); // Scale the context to ensure sharp rendering
    databar.fillStyle = '#d6ecec';
    databar.fillRect(0,0,data.width, data.height);
    dimensions2 = {'width': data.width, 'height':data.height}
    return dimensions2;
}

function drawbar(x, y, width, height, col){
    databar.fillStyle = col;
    databar.fillRect(x/dimensions.dpr, y/dimensions.dpr, width/dimensions.dpr, height/dimensions.dpr);
}

function loading(training){
    var test = 1 - training;
    var trainingwid = training * dimensions2.width;
    var testingwid = test * dimensions2.width;
    drawbar(0,0,trainingwid, dimensions2.height, 'blue');
    drawbar((0 + trainingwid),0,testingwid, dimensions2.height, 'red');

}



//Prediction lightning

function pred(col3, networkdimensions, coords) {
    
    drawneurons(networkdimensions);
    const final = randomconnection(coords);
    let count2 = 0;
    document.getElementById("status").textContent="and...";
    function drawLightning(x1, y1, x2, y2) {
        const steps = 100; 
        let currentStep = 0;

        function animate() {
            if (currentStep <= steps) {
                const progress = currentStep / steps;
                const currentX = x1 + (x2 - x1) * progress;
                const currentY = y1 + (y2 - y1) * progress;

                ctx.strokeStyle = col3; 
                ctx.lineWidth = 1.5/dimensions.dpr; 
                ctx.beginPath();
                ctx.moveTo(x1/dimensions.dpr, y1/dimensions.dpr);
                ctx.lineTo(currentX/dimensions.dpr, currentY/dimensions.dpr);
                ctx.stroke();

                currentStep++;
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

    function nextStep() {
        if (count2 < final.length - 1) {
            const { x: x1, y: y1 } = final[count2];
            const { x: x2, y: y2 } = final[count2 + 1];
            markercircle(x1, y1, dimensions.width/80, col3);
            drawLightning(x1, y1, x2, y2);
            count2++;
            setTimeout(nextStep, 1500);
            if (count2 == final.length -1){
                document.getElementById("status").textContent="Prediction!";
            }
            markercircle(x2, y2, dimensions.width/80, col3);
        }
    }

    nextStep(); 
}

// Overall

function lightupanimation(col1, col2, col3, networkdimensions, coords, split){
    let count = 0;
    let incrament2 = 0;
    let incrament = dimensions2.width / 40;
    let bound = 40 * split;
    document.getElementById("status").textContent="Training...";
    const intervalID = setInterval(() => {
        
        incrament2 = incrament2 + incrament;
        drawbar(0, 0, incrament2, dimensions2.height, '#d6ecec');
        drawneurons(networkdimensions);
        
        count++;
        if (count >= bound && count <= 39) {
            if (count === bound){
                document.getElementById("status").textContent="Testing...";
            }
            
            randommatch(randomconnection(coords), col1);
        }
        else if (count === 40) {
            clearInterval(intervalID);
            pred(col3, networkdimensions, coords);
        }
        else {
            randommatch(randomconnection(coords), col2);
        }
        }, 200)
}



// General Function

function animatenetwork(networkdimensions, split, col1, col2, col3){
    setCanvasSize();
    setDataBar();
    loading(split);
    var coords = drawneurons(networkdimensions);
    allconnections(coords);
    lightupanimation(col1,col2, col3, networkdimensions, coords, split);
    
}

function drawnetwork(networkdimensions, split, col1, col2, col3){
    setCanvasSize();
    var coords = drawneurons(networkdimensions);
    allconnections(coords);
    drawneurons(networkdimensions);
}
