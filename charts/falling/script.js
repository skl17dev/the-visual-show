//*******************************
//****** INPUTS *****************
//*******************************

// user inputs
let bgColor = '0x5b1767';

getFont('heavyFonts', '../../assets/font/Lato-Black.ttf');
getFont('labelFont', '../../assets/font/Lato-Regular.ttf');
getFont('nameFont', '../../assets/font/Lato-Bold.ttf');



barWidth = 90;
barGap = 150;
interval = .5;


items = [];

c = $('canvas');
cWidth = 1920;
cHeight = 1080;
PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
const canvas = new PIXI.Application({
  view: c,
  width: cWidth,
  height: cHeight,
  antialias: false
});


// new fps.js count
fpsCounter = new FPSCounter();


// call timer function stopwatch
timer('#timer');


// stage to render
stage = new PIXI.Container();
canvas.stage.addChild(stage);
// background container
bgContainer = new PIXI.Container();
stage.addChild(bgContainer);
bgContainer.x = 0;
bgContainer.y = 0;
bgContainer.pivot.x = .5;
bgContainer.pivot.y = .5;
bgContainer.width = cWidth;
bgContainer.height = cHeight;


// background image or constant color
bgGraphic = new PIXI.Graphics();
bgGraphic.beginFill(bgColor);
bgGraphic.drawRect(1, 0, cWidth, cHeight); // 1 as x offset
bgGraphic.endFill();
bgContainer.addChild(bgGraphic);


// graph container
graphContainer = new PIXI.Container();
stage.addChild(graphContainer);
graphContainer.x = cWidth / 2;
graphContainer.y = cHeight / 2 + 200;
graphContainer.width = 1600;
graphContainer.height = 1600 * (9 / 16) - 300;
graphContainer.pivot.x = graphContainer._width / 2;
graphContainer.pivot.y = graphContainer._height / 2;

// zeroLine = new PIXI.Graphics();
// graphContainer.addChild(zeroLine);
// zeroLine.beginFill(0xcccccc);
// zeroLine.drawRect(0, 0, 3, graphContainer._height);
// zeroLine.closePath();
// zeroLine.endFill();

// graph wrapper mask
maskShape = new PIXI.Graphics();
maskShape.beginFill(0xDE3249);
maskShape.drawRect(0, 0, graphContainer._width, graphContainer._height);
maskShape.closePath();
maskShape.endFill();
maskShape.renderable = true;
maskShape.cacheAsBitmap = true;

//graphContainer.addChild(maskShape);
//graphContainer.mask = mask;


// Horizontal Container
horizontalContainer = new PIXI.Container();
stage.addChild(horizontalContainer);
horizontalContainer.x = cWidth / 2;
horizontalContainer.y = cHeight / 2 + 200;
horizontalContainer.width = 1600;
horizontalContainer.height = 1600 * (9 / 16) - 300;
horizontalContainer.pivot.x = horizontalContainer._width / 2;
horizontalContainer.pivot.y = horizontalContainer._height / 2;


// initial phase
function init() {

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  // grids
  grids = [];
  factor = 1;
  tenthOrder = tenOrder(currValue);
  firstChar = tenthOrder[1];
  tenthNum = tenthOrder[0];


  if (firstChar <= 2) {
    division = 20;
  }

  else if (firstChar <= 1) {
    division = 40;
  }

  else if (firstChar <= 5) {
    division = 10;
  }

  else {
    division = 5;
  }

  gridGap = tenthNum / division;
  gridGapPer = (100 * gridGap) / currValue;
  for (i = 0; i < 15; i++) {
    grid = new Grid();
    grid.pos = corY(perY(i * gridGapPer));
    grid.value = i * gridGap * factor;
    grid.update();
    grids.push(grid);
  }

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  // bar init
  for (i = 0; i < dataLength; i++) {
    item = new Item(data[i]['name'], data[i]['value'], data[i]['color'], data[i]['img'], i);
    items.push(item);
  }


  // horizontal mask container
  horizontalMaskCont = new PIXI.Container();
  stage.addChild(horizontalMaskCont);
  horizontalMaskCont.x = 180;
  horizontalMaskCont.y = 0
  horizontalMaskCont.width = 1650;
  horizontalMaskCont.height = cHeight;

  maskShape = new PIXI.Graphics();
  maskShape.beginFill(0xDE3249);
  maskShape.drawRect(0, 0, horizontalMaskCont._width, horizontalMaskCont._height);
  maskShape.closePath();
  maskShape.endFill();
  maskShape.renderable = true;
  maskShape.cacheAsBitmap = true;

  horizontalMaskCont.addChild(maskShape);
  horizontalContainer.mask = maskShape;

  // grid mask container
  gridMaskCont = new PIXI.Container();
  stage.addChild(gridMaskCont);
  gridMaskCont.x = 0;
  gridMaskCont.y = 250;
  gridMaskCont.width = cWidth;
  gridMaskCont.height = cHeight;

  maskShape = new PIXI.Graphics();
  maskShape.beginFill(0xDE3249);
  maskShape.drawRect(0, 0, gridMaskCont._width, gridMaskCont._height);
  maskShape.closePath();
  maskShape.endFill();
  maskShape.renderable = true;
  maskShape.cacheAsBitmap = true;

  gridMaskCont.addChild(maskShape);
  graphContainer.mask = maskShape;

}


// before init variable assign

data = JSON.parse(data);
dataLength = Object.keys(data).length;

minYGrid = 300000000;
minYGridOld = minYGrid;
originalVals = [];
for (i = 0; i < dataLength; i++) {
  originalVals.push(data[i].value);
}

for (i = 0; i < dataLength; i++) {
  data[i].value = originalVals[i] - minYGrid;
  // items[i].value = originalVals[i] - minYGrid;
}


currValue = data[0]['value'];
currIndex = 0;

frame = 0;
frameInterval = 0;
pastValue = data[currIndex]['value'];
futureValue = data[currIndex + 1]['value'];
diff = futureValue - pastValue;
distDiff = barWidth + barGap;
iniBars = cWidth / 2 + graphContainer._width - barWidth;

function update() {
  //console.log(pastValue, currValue, futureValue);
  displayCurrValue();
  displayName();
  displayImg();
  displaySubtitle();
  currValue = pastValue + (diff * (frameInterval / (60 * interval)));

  horizontalContainer.x = iniBars - distDiff * (frame / (60 * interval));
  for (i in items) {
    items[i].update();
  }



  if (currValue == futureValue) {
    //console.log('###############');

    currIndex++;
    if (currIndex == dataLength - 1) {
      iAnime = 0;
    } else {
      frameInterval = 0;
      pastValue = data[currIndex]['value'];
      futureValue = data[currIndex + 1]['value'];
      diff = futureValue - pastValue;
    }
  }


  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



  tenthOrder = tenOrder(Math.round(currValue));
  firstChar = tenthOrder[1];
  tenthNum = tenthOrder[0];


  if (firstChar <= 2) {
    division = 20;
  }

  else if (firstChar <= 1) {
    division = 40;
  }

  else if (firstChar <= 5) {
    division = 10;
  }

  else {
    division = 5;
  }

  gridGap = tenthNum / division;
  gridGapPer = (100 * gridGap) / (currValue);

  for (i = 0; i < 15; i++) {
    grids[i].destroy();
  }

  grids = [];

  for (i = 0; i < 15; i++) {
    grid = new Grid();
    grid.pos = corY(perY(i * gridGapPer));
    grid.value = i * gridGap;
    grid.update();
    grids.push(grid);
  }



  if (currIndex > 7) {

    tenthNum = tenOrder(Math.round(items[currIndex - 7].value + minYGrid));
    orderNum = tenthNum[0] / 10;
    firstChar = tenthNum[1];

    if (firstChar == 1) { minYGrid = orderNum * .95 }
    if (firstChar == 2) { minYGrid = orderNum * 2 }
    if (firstChar == 3) { minYGrid = orderNum * 3 }
    if (firstChar == 4) { minYGrid = orderNum * 4 }
    if (firstChar == 5) { minYGrid = orderNum * 5 }
    if (firstChar == 6) { minYGrid = orderNum * 6 }
    if (firstChar == 7) { minYGrid = orderNum * 7 }
    if (firstChar == 8) { minYGrid = orderNum * 8 }
    if (firstChar == 9) { minYGrid = orderNum * 9 }

    for (i = 0; i < dataLength; i++) {
      data[i].value = originalVals[i] - minYGrid;
      items[i].value = data[i].value;
    }

    if (minYGridOld !== minYGrid) {
      pastValue = data[currIndex]['value'];
      futureValue = data[currIndex + 1]['value'];
      diff = futureValue - pastValue;
      minYGridOld = minYGrid;
    }
    // for(i = 0; i < dataLength; i++) {
    // 	data[i].value = originalVals[i] - minYGrid;
    // }

  }


  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&




  frame++;
  frameInterval++;

}

// horizontal grids (0% ~ 100%)
function Grid() {
  this.type = 'x';
  this.color = '0xcccccc';
  this.pos = 100;
  this.grid = new PIXI.Graphics();
  this.width = 3;
  this.gridAlpha = .3;

  this.tickAlpha = 1;
  this.value = 100;
  this.fontFamily = 'labelFont';
  this.fontSize = 32;
  this.fontFill = 'grey';
  this.TextAlign = 'left';
  this.letterSpacing = 1;
  this.tickPad = 20;

  this.tick = new PIXI.Text();

  this.draw = () => {
    this.grid.clear();
    this.grid.lineStyle(this.width, this.color, this.gridAlpha);
    this.grid.moveTo(0, this.pos);
    this.grid.lineTo(graphContainer._width, this.pos);

    // ticks
    this.tick.text = toViews(this.value + minYGrid, 1);
    this.tick.fontFamily = this.fontFamily;
    this.tick.font = this.fontFamily;
    this.tick.style._fontFamily = this.fontFamily;
    this.tick.fontSize = this.fontSize;
    this.tick.style.fontSize = this.fontSize
    this.tick.fill = this.fontFill;
    this.tick._style.fill = this.fontFill;
    this.tick.align = this.TextAlign;
    this.tick.letterSpacing = this.letterSpacing;
    this.tick.anchor.set(1, .5);
    this.tick.position.set(-this.tickPad + 0, this.pos);
  }

  this.update = () => {
    this.draw();
  }

  this.destroy = () => {
    this.tick.destroy();
    this.grid.destroy();
  }

  this.update();
  graphContainer.addChild(this.grid);
  graphContainer.addChild(this.tick);

}



function Item(name, value, color, img, index) {
  this.nameText = name;
  this.value = value;
  this.color = color;
  this.img = img;
  this.imgMain = img;
  this.index = index;
  this.original = this.value + minYGrid;
  this.height = (this.value * 100) / currValue; // in percentage

  // create bar reactangle
  this.rect = new PIXI.Graphics();
  horizontalContainer.addChild(this.rect);

  // create cricle
  this.border = 12;
  this.yPad = 30;
  this.radius = (barWidth / 2) + this.border;
  this.cricle = new PIXI.Graphics();
  horizontalContainer.addChild(this.cricle);

  // create image
  this.img = PIXI.Texture.from(img);
  this.img = new PIXI.Sprite(this.img);
  horizontalContainer.addChild(this.img);
  this.img.width = barWidth + 5;
  this.img.height = barWidth + 5;
  this.img.anchor.set(.5, .5);

  // name text
  this.name = new PIXI.Text();
  this.name.fontFamily = 'nameFont';
  this.name.style._fontFamily = 'nameFont';
  this.name.font = 'nameFont';
  this.name.fontSize = 28;
  this.name.style.fontSize = 28;
  this.name.fill = this.color;
  this.name._style.fill = this.color;
  this.name.align = 'center';
  this.name.letterSpacing = 1;
  this.name.anchor.set(.5, .5);
  this.name.text = this.nameText;
  horizontalContainer.addChild(this.name);

  // value text
  this.valueText = new PIXI.Text();
  this.valueText.fontFamily = 'labelFont';
  this.valueText.style._fontFamily = 'labelFont';
  this.valueText.font = 'labelFont';
  this.valueText.fontSize = 28;
  this.valueText.style.fontSize = 28;
  this.valueText.fill = this.color;
  this.valueText._style.fill = this.color;
  this.valueText.align = 'center';
  this.valueText.letterSpacing = 1;
  this.valueText.anchor.set(.5, .5);
  this.valueText.text = numWithCommas(this.value + minYGrid);
  horizontalContainer.addChild(this.valueText);

  this.draw = () => {
    xPix = ((barGap + barWidth) * this.index)
    yPix = corY(perY(this.height));
    this.rect.clear();
    this.rect.beginFill(this.color);
    this.rect.drawRect(xPix, corY(perY(this.height)), barWidth, graphContainer._height - yPix);
    this.rect.closePath();
    this.rect.endFill();

    // set cricle position
    this.cricle.clear();
    this.cricle.beginFill(this.color);
    this.cricle.drawCircle(xPix + this.radius - this.border, yPix - this.radius - this.border - this.yPad, this.radius, 1);
    this.cricle.endFill();

    // set image position
    this.img.position.set(xPix + this.radius - this.border, yPix - this.radius - this.border - this.yPad);

    // set name position
    this.name.position.set(xPix + this.radius - this.border, yPix - this.radius + this.border + 24);

    // set value position
    this.valueText.position.set(xPix + this.radius - this.border, yPix - this.radius - this.border - this.yPad - 90);
  }

  this.update = () => {
    this.height = (this.value * 100) / (currValue);
    this.draw();
  }
}

firstCurrValue = true;
function displayCurrValue() {
  if (firstCurrValue == true) {
    // this value text
    runningValue = new PIXI.Text();
    runningValue.fontFamily = 'heavyFonts';
    runningValue.font = 'heavyFonts';
    runningValue.style._fontFamily = 'heavyFonts';
    runningValue.fontSize = 80;
    runningValue.style.fontSize = 80;
    runningValue.fill = '0xffffff';
    runningValue._style.fill = '0xffffff';
    runningValue.align = 'left';
    runningValue.letterSpacing = 1;
    runningValue.anchor.set(0, 1);
    runningValue.position.set(65, 150);
    stage.addChild(runningValue);
    firstCurrValue = false;
  }

  runningValue.text = abbreviateNumber(Math.round(currValue + minYGrid));
}


subTitles = true;
function displaySubtitle() {
  if (subTitles == true) {
    // this value text
    subValues = new PIXI.Text();
    subValues.fontFamily = 'labelFont';
    subValues.font = 'labelFont';
    subValues.style._fontFamily = 'labelFont';
    subValues.fontSize = 30;
    subValues.style.fontSize = 30;
    subValues.fill = '0xffffff';
    subValues._style.fill = '0xffffff';
    subValues.align = 'left';
    subValues.letterSpacing = 1;
    subValues.anchor.set(0, 1);
    subValues.position.set(640, 190);
    stage.addChild(subValues);
    subTitles = false;
  }

  subValues.text = '~ ' + toViews(items[currIndex].original) + ' | ' + countries[dataLength - currIndex - 1];
}


firstName = true;
function displayName() {
  if (firstName == true) {
    // this value text
    runningName = new PIXI.Text();
    runningName.fontFamily = 'heavyFonts';
    runningName.font = 'heavyFonts';
    runningName.style._fontFamily = 'heavyFonts';
    runningName.fontSize = 80;
    runningName.style.fontSize = 80;
    runningName.align = 'left';
    runningName.letterSpacing = 1;
    runningName.anchor.set(0, 1);
    runningName.position.set(640, 150);
    stage.addChild(runningName);
    firstName = false;
  }

  runningName.text = items[currIndex].nameText;
  runningName.fill = items[currIndex].color;
  runningName._style.fill = items[currIndex].color;
}

displayImgBool = true;
function displayImg() {
  if (displayImgBool != true) {
    // this value text
    // displayCricle.clear();
    displayCricle.destroy();

    // displayImage.clear();
    displayImage.destroy();
  }

  // cricle
  displayCricle = new PIXI.Graphics();
  rradius = 65;
  stage.addChild(displayCricle);
  displayCricle.beginFill(items[currIndex].color);
  displayCricle.drawCircle(550, 170 - rradius, rradius, 1);
  displayCricle.endFill();

  // image
  displayImage = PIXI.Texture.from(items[currIndex].imgMain);
  displayImage = new PIXI.Sprite(displayImage);
  stage.addChild(displayImage);
  displayImage.width = rradius * 2 - 4;
  displayImage.height = rradius * 2 - 4;
  displayImage.anchor.set(.5, .5);
  displayImage.position.set(550, 170 - rradius);

  displayImgBool = false;
}




// (((((((((((((((((((((()))))))))))))))))))))
// (((((((((((((((( ANIMATION ))))))))))))))))
// (((((((((((((((((((((()))))))))))))))))))))




// let capturer = new CCapture( {
// 	framerate: 60,
// 	quality: 100,
// 	format: 'webm'
// } );





iAnime = 1;
function animate() {
  if (iAnime == 1) { requestAnimationFrame(animate); }
  // else {capturer.stop(); capturer.save();}
  fpsCounter.nextFrame();
  $('#fps').innerHTML = "FPS: " + fpsCounter.value;

  update();
  // canvas.render(stage);

  // if(frame > 200) {
  // 	iAnime = 0;
  // }

  // capturer.capture(canvas.view);
}
setTimeout(() => {
  init();
  update();
  // canvas.render(stage);
  animate();
  // capturer.start();
}, 2000);








// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%% COMMON FUNCTIONS %%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%










function corX(x) {
  return x;
}

function corY(y) {
  return graphContainer._height - y;
}

function perX(perx) {
  return (graphContainer._width) * perx / 100;
}

function perY(pery) {
  return (graphContainer._height) * pery / 100;
}


function asce(arr) {
  return arr.sort(function (a, b) { return a - b });
}

function desc(arr) {
  return arr.sort(function (a, b) { return b - a });
}


function numWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function toViews(n1, d1 = 1) {
  let un = ['K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'],
    dcm;
  for (let i = un.length - 1; i >= 0; i--) {
    dcm = Math.pow(1000, i + 1);
    if (n1 <= -dcm || n1 >= dcm) {
      return +(n1 / dcm).toFixed(d1) + un[i];
    }
  }
  return n1;
}

function $(el) {
  return document.querySelector(el);
}

function $a(el) {
  return document.querySelectorAll(el);
}

function bind(el, ev, fun) {
  return $(el).addEventListener(ev, fun);
}

function getFont(name, url) {
  var font = new FontFace(name, `url(${url})`);
  font.load().then(function (loadedFace) {
    document.fonts.add(loadedFace);
    fontId = name;
    $('#fontContainer').style.position = 'absolute';
    $('#fontContainer').style.transform = 'translate(-99999px)';
    $('#fontContainer').innerHTML += `<div id="${fontId}">${fontId}</div>`;
    $(`#${fontId}`).style.fontFamily = "'" + name + "'";
  }).catch(function (error) {
    // error occurred
  });
}

function pad(d) {
  return (d < 10) ? '0' + d.toString() : d.toString();
}


function tenOrder(num) {
  num = num.toString();
  firstChar = Number(num.charAt(0));
  tenth = '1';
  for (tt = 0; tt < num.length; tt++) {
    tenth += '0';
  }
  tenth = Number(tenth);
  return [tenth, firstChar];
}



var SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];

function abbreviateNumber(number) {

  // what tier? (determines SI symbol)
  var tier = Math.log10(number) / 3 | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return number;

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(2) + suffix;
}