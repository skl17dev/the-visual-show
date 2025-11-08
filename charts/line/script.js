//*******************************
//****** INPUTS *****************
//*******************************

// user inputs
let bgColor = '0xf7f7f7';

getFont('heavyFonts', '../../assets/font/Lato-Black.ttf');
getFont('labelFont', '../../assets/font/Lato-Regular.ttf');
getFont('nameFont', '../../assets/font/Lato-Bold.ttf');




interval = 1;
verticalGridGap = 10;

items = [];

c = $('canvas');
cWidth = 1920;
cHeight = 1080;

const canvas = new PIXI.autoDetectRenderer({
  view: c,
  width: cWidth,
  height: cHeight,
  antialias: true
});


// new fps.js count
fpsCounter = new FPSCounter();


// call timer function stopwatch
// timer('#timer');


// stage to render
stage = new PIXI.Container();

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
bgGraphic.drawRect(-2, -2, cWidth + 4, cHeight + 4); // 1 as x offset
bgGraphic.endFill();
bgContainer.addChild(bgGraphic);


// &&&&&&&&&&&&&&&&&&&&&&&&&
// &&& Container
// &&&&&&&&&&&&&&&&&&&&&&&&&

graphContainerX = cWidth / 2 - 25;
graphContainerY = cHeight / 2 + 45;
graphContainerWidth = cWidth - 380;
graphContainerHeight = cHeight / 2 + 250;
// graph container
graphContainer = new PIXI.Container();
stage.addChild(graphContainer);
graphContainer.position.set(graphContainerX, graphContainerY);
graphContainer.width = graphContainerWidth;
graphContainer.height = graphContainerHeight;
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

// graphContainer.addChild(maskShape);
//graphContainer.mask = mask;
// vertical ticks Container
verticalTicksCont = new PIXI.Container();
stage.addChild(verticalTicksCont);
verticalTicksCont.position.set(graphContainerX, graphContainerY);
verticalTicksCont.width = graphContainerWidth;
verticalTicksCont.height = graphContainerHeight;
verticalTicksCont.pivot.x = verticalTicksCont._width / 2;
verticalTicksCont.pivot.y = verticalTicksCont._height / 2;


// vertical ticks Container
horizontalGridsCont = new PIXI.Container();
stage.addChild(horizontalGridsCont);
horizontalGridsCont.position.set(graphContainerX, graphContainerY);
horizontalGridsCont.width = graphContainerWidth;
horizontalGridsCont.height = graphContainerHeight;
horizontalGridsCont.pivot.x = horizontalGridsCont._width / 2;
horizontalGridsCont.pivot.y = horizontalGridsCont._height / 2;

// line Container
lineContainer = new PIXI.Container();
stage.addChild(lineContainer);
lineContainer.position.set(graphContainerX, graphContainerY);
lineContainer.width = graphContainerWidth;
lineContainer.height = graphContainerHeight;
lineContainer.pivot.x = lineContainer._width / 2;
lineContainer.pivot.y = lineContainer._height / 2;



// initial phase
currYTopVal = 1;
function init() {

  // items
  for (i = 0; i < data.y.count; i++) {
    item = new Item(dataY(i).value, dataY(i).name, dataY(i).icon, dataY(i).color);
    items.push(item);
  }

  values = [];
  for (i in items) {
    values.push(items[i].value);
  }

  descValues = desc(values);
  currYTopVal = descValues[0];


  // GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
  // GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
  horizontalGrids = [];
  tenthOrder = tenOrder(currYTopVal);
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
  gridGapPer = gridGap;
  for (i = 0; i < 15; i++) {
    grid = new horizonalGrid();
    grid.pos = corY(perY(i * gridGapPer));
    grid.value = i * gridGap;
    grid.update();
    horizontalGrids.push(grid);
  }


  // vertical grids
  // y grids vertical grids , x direction
  verticalGrids = [];
  len = data.x.value.length;
  for (i = 0; i < len; i++) {
    grid = new verticalGrid();
    grid.pos = corX(perX(i * verticalGridGap));
    grid.value = data.x.value[i];
    grid.update();
    verticalGrids.push(grid);
  }



  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~ mask
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // line container mask
  lineContainerMask = new PIXI.Container();
  stage.addChild(lineContainerMask);
  lineContainerMask.position.set(graphContainerX + 245, graphContainerY - 40);
  lineContainerMask.width = graphContainerWidth + 500;
  lineContainerMask.height = graphContainerHeight + 250;
  lineContainerMask.pivot.x = lineContainerMask._width / 2;
  lineContainerMask.pivot.y = lineContainerMask._height / 2;

  maskShape = new PIXI.Graphics();
  maskShape.beginFill(0xDE3249);
  maskShape.drawRect(0, 0, lineContainerMask._width, lineContainerMask._height);
  maskShape.closePath();
  maskShape.endFill();
  maskShape.renderable = true;
  maskShape.cacheAsBitmap = true;

  lineContainerMask.addChild(maskShape);
  lineContainer.mask = maskShape;

  // vertical ticks container

  verticalTicksContMask = new PIXI.Container();
  stage.addChild(verticalTicksContMask);
  verticalTicksContMask.position.set(graphContainerX + 10, graphContainerY - 10);
  verticalTicksContMask.width = graphContainerWidth + 120;
  verticalTicksContMask.height = graphContainerHeight + 200;
  verticalTicksContMask.pivot.x = verticalTicksContMask._width / 2;
  verticalTicksContMask.pivot.y = verticalTicksContMask._height / 2;

  maskShape = new PIXI.Graphics();
  maskShape.beginFill(0xDE3249);
  maskShape.drawRect(0, 0, verticalTicksContMask._width, verticalTicksContMask._height);
  maskShape.closePath();
  maskShape.endFill();
  maskShape.renderable = true;
  maskShape.cacheAsBitmap = true;

  verticalTicksContMask.addChild(maskShape);
  verticalTicksCont.mask = maskShape;

  // horizontal grids & ticks container

  horizontalGridsMask = new PIXI.Container();
  stage.addChild(horizontalGridsMask);
  horizontalGridsMask.position.set(0, 150);
  horizontalGridsMask.width = cWidth;
  horizontalGridsMask.height = cHeight;
  horizontalGridsMask.pivot.x = 0;
  horizontalGridsMask.pivot.y = 0;

  maskShape = new PIXI.Graphics();
  maskShape.beginFill(0xDE3249);
  maskShape.drawRect(0, 0, horizontalGridsMask._width, horizontalGridsMask._height);
  maskShape.closePath();
  maskShape.endFill();
  maskShape.renderable = true;
  maskShape.cacheAsBitmap = true;

  horizontalGridsMask.addChild(maskShape);
  horizontalGridsCont.mask = maskShape;

  // LLLLLLLLLLLLLLLLLLLLLLLLL
  stopLimitX = -((perX(verticalGridGap) * (len - 2)) - 2170);
}


frame = 0;
moveContainerX = 1;


startMonth = data.x.startMonth;
startYear = data.x.startYear;
endDate = data.x.endDate;

firstDate = true;
displayDate = true;
dayRunner = 1;
monthRunnerIndex = startMonth - 1;
yearRunner = startYear;

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
dayMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
dayMonthLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

tempDay = dayRunner;
tempMonth = startMonth;
tempYear = startYear;

dataFrame = 1;


function update() {

  xin = verticalGridGap * (frame / (60 * interval));
  itemCurrXPos = corX(perX(xin));
  m = 0;
  if (frame > (350 * interval * 2)) {
    m = frame - (350 * interval * 2);
  }

  xinTemp = verticalGridGap * (m / (60 * interval));
  for (i in items) {
    items[i].setValue(xin);
    items[i].clear(xinTemp);
  }

  for (k = m; k <= frame; k++) {
    xinTemp = verticalGridGap * (k / (60 * interval));
    for (i in items) {
      items[i].draw(xinTemp);
    }
  }


  // move container
  if (itemCurrXPos >= 1078 && moveContainerX == 1) {
    lineContainer.x -= corX(perX(verticalGridGap)) / (60 * interval);
    verticalTicksCont.x -= corX(perX(verticalGridGap)) / (60 * interval);
    // graphWrapperYGrids.x -= corX(perX(verticalGridGap)) / (60 * interval);
    // startPointContainer.x -= corX(perX(verticalGridGap)) / (60 * interval);

    if (stopLimitX >= lineContainer.x) {
      moveContainerX = 0;
    }
    // if(Math.abs(lineContainer.x) >= stopLimitX ) {
    // 	moveContainerX = 0;
    // }
  }


  /// ccurrent top value
  values = [];
  for (i in items) {
    values.push(items[i].value);
  }

  descValues = desc(values);
  tempTop = descValues[0];
  if (tempTop > currYTopVal) {
    currYTopVal = tempTop;
  }


  // """"""""""""""""""""""""""""""""""""""""""
  // """"""""""""""""""""""""""""""""""""""""""
  itemsValsDes = descValues;
  descItemIndex = [];
  for (d in itemsValsDes) {
    for (i in items) {
      if (items[i].value == itemsValsDes[d]) {
        descItemIndex.push(i);
      }
    }
  }
  desIndex = descItemIndex;
  showItemTop(descItemIndex[0]);
  showDesItems(desIndex);
  // """"""""""""""""""""""""""""""""""""""""""
  // """"""""""""""""""""""""""""""""""""""""""

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  tenthOrder = tenOrder(Math.round(currYTopVal));
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
  gridGapPer = gridGap;

  for (i = 0; i < 15; i++) {
    horizontalGrids[i].destroy();
  }

  horizontalGrids = [];

  for (i = 0; i < 15; i++) {
    grid = new horizonalGrid();
    grid.pos = corY(perY(i * gridGapPer));
    grid.value = i * gridGap;
    grid.update();
    horizontalGrids.push(grid);
  }


  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // display running date
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  tempYear = yearRunner;
  if ((tempYear % 4) != 0) {
    dayMonthVals = dayMonth;
  } else {
    dayMonthVals = dayMonthLeap;
  }

  if (monthRunnerIndex > 11) {
    monthRunnerIndex = 0;
    yearRunner++;
    tempYear = yearRunner;
  }

  tempMonth = months[monthRunnerIndex];

  if (dayRunner >= dayMonthVals[monthRunnerIndex]) {
    dayRunner = 1;
    monthRunnerIndex++;
    tempMonth = months[monthRunnerIndex];
  }

  if (dataFrame > 60 * interval) {
    dataFrame = 1;
  }

  dayRunner = dayMonthVals[monthRunnerIndex] * (dataFrame / (60 * interval));

  dataFrame++;
  tempDay = Math.ceil(dayRunner);

  if (isNaN(tempDay)) {
    tempDay = 31;
    tempMonth = 'Dec';
  }
  tempDate = `${pad(tempDay)} ${tempMonth} ${tempYear}`;
  // console.log(tempDate);
  if (tempDate != endDate && displayDate == true) {
    displayDateFun(tempDate);
  } else {
    if (displayDate == true) {
      displayDateFun(tempDate);
    }
    displayDate = false;
    iAnime = 0;
  }



  frame++;
}


// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

function horizonalGrid() {
  this.type = 'x';
  this.color = '0xcccccc';
  this.pos = 100;
  this.grid = new PIXI.Graphics();
  this.width = 3;
  this.gridAlpha = .7;

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
    this.tick.text = toViews(this.value, 1);
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
  horizontalGridsCont.addChild(this.grid);
  horizontalGridsCont.addChild(this.tick);

}



// vertical grids date (Jan, Feb...)
function verticalGrid() {
  this.type = 'y';
  this.color = '0xcccccc';
  this.pos = 100;
  this.grid = new PIXI.Graphics();
  this.width = 3;
  this.gridAlpha = 0;

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
    this.grid.moveTo(this.pos, 0);
    this.grid.lineTo(this.pos, graphContainer._height);

    // ticks
    this.tick.text = this.value;
    this.tick.fontFamily = this.fontFamily;
    this.tick.font = this.fontFamily;
    this.tick.style._fontFamily = this.fontFamily;
    this.tick.fontSize = this.fontSize;
    this.tick.style.fontSize = this.fontSize;
    this.tick.fill = this.fontFill;
    this.tick._style.fill = this.fontFill;
    this.tick.align = this.TextAlign;
    this.tick.letterSpacing = this.letterSpacing;
    this.tick.anchor.set(.5, 0);
    this.tick.position.set(this.pos, graphContainer._height + this.tickPad);
  }

  this.update = () => {
    this.draw();
  }

  this.update();
  lineContainer.addChild(this.grid);
  verticalTicksCont.addChild(this.tick);
}

itemIndex = 0;
function Item(arrY, name, icon, color) {
  this.arrY = arrY;
  this.name = name;
  this.color = color;
  this.value = arrY[0];
  this.itemIndex = itemIndex;
  itemIndex++;

  this.arrX = []; // dates array (0, 20, 40, 60)
  this.arrXCount = data.x.value.length;
  for (k = 0; k < this.arrXCount; k++) { this.arrX.push(k * verticalGridGap) }

  // mono cubic interpolation 
  this.monoCubicFunction = createInterpolant(this.arrX, this.arrY); // in percent
  this.monoCubic = (x) => {
    return this.monoCubicFunction(x);
  }

  // line style
  this.line = new PIXI.Graphics();
  this.width = 10;
  // this.width = 6;
  this.color = this.color;
  this.lineAlpha = .75;
  this.line.lineStyle(this.width, this.color, this.lineAlpha);
  lineContainer.addChild(this.line);

  this.xOld = 0;
  this.yOld = corY(perY(this.arrY[0]));

  // cricle style
  this.cricleRadius = 50;
  // this.cricleRadius =  20;
  this.imageCricle = new PIXI.Graphics();
  this.imageCricle.beginFill(this.color);
  this.imageCricle.drawCircle(0, 0, this.cricleRadius);
  this.imageCricle.endFill();
  lineContainer.addChild(this.imageCricle);
  lineContainer.setChildIndex(this.imageCricle, this.itemIndex);


  // // arc
  this.arc = new PIXI.Graphics();
  this.arc.lineStyle(3, this.color, 1);
  this.arc.arc(0, 0, this.cricleRadius + 10, 0, Math.PI * 2);
  lineContainer.addChild(this.arc);
  lineContainer.setChildIndex(this.arc, this.itemIndex);

  // icon styles
  this.icon = PIXI.Texture.from(icon);
  this.icon = new PIXI.Sprite(this.icon);
  lineContainer.addChild(this.icon);
  lineContainer.setChildIndex(this.icon, this.itemIndex + 2);
  this.icon.width = this.cricleRadius * 1.7;
  this.icon.height = this.cricleRadius * 1.7;
  this.icon.anchor.set(.5, .5);


  // name of item
  this.nameText = new PIXI.Text();
  this.nameText.fontFamily = 'nameFont';
  this.nameText.style._fontFamily = 'nameFont';
  this.nameText.font = 'nameFont';
  this.nameText.fontSize = 32;
  this.nameText.style.fontSize = 32;
  this.nameText.fill = this.color;
  this.nameText._style.fill = this.color;
  this.nameText.align = 'left';
  this.nameText.letterSpacing = 1;
  this.nameText.anchor.set(0, 1);
  this.nameText.text = this.name;
  lineContainer.addChild(this.nameText);
  lineContainer.setChildIndex(this.nameText, this.itemIndex);

  // this value text
  this.valueNumber = new PIXI.Text();
  this.valueNumber.fontFamily = 'labelFont';
  this.valueNumber.style._fontFamily = 'labelFont';
  this.valueNumber.font = 'labelFont';
  this.valueNumber.fontSize = 28;
  this.valueNumber.style.fontSize = 28;
  this.valueNumber.fill = this.color;
  this.valueNumber._style.fill = this.color;
  this.valueNumber.align = 'left';
  this.valueNumber.letterSpacing = 1;
  this.valueNumber.anchor.set(0, 1);
  this.valueNumber.text = numWithCommas(this.value);
  lineContainer.addChild(this.valueNumber);
  lineContainer.setChildIndex(this.valueNumber, this.itemIndex);


  this.draw = (x) => {
    this.line.moveTo(this.xOld, this.yOld);
    xPix = corX(perX(x));
    yPer = this.monoCubic(x);
    yPix = corY(perY(yPer));
    this.xOld = xPix;
    this.yOld = yPix;
    this.line.lineTo(xPix, yPix);
  }

  this.setValue = (x) => {
    yPer = this.monoCubic(x);
    this.value = yPer;

    xPix = corX(perX(x));
    yPix = corY(perY(yPer));

    this.drawIcon(xPix, yPix);
    this.drawNameValue(xPix, yPix);
  }

  this.clear = (x) => {
    this.line.clear();
    this.line.destroy();

    this.line = new PIXI.Graphics();
    this.width = 10;
    // this.width = 6;
    this.color = this.color;
    this.line.lineStyle(this.width, this.color, this.lineAlpha);
    lineContainer.addChild(this.line);
    lineContainer.setChildIndex(this.line, this.itemIndex);

    xPix = corX(perX(x));
    yPer = this.monoCubic(x);
    yPix = corY(perY(yPer));
    this.xOld = xPix;
    this.yOld = yPix;
  }


  this.drawIcon = (x, y) => {
    this.imageCricle.position.set(x, y);
    this.arc.position.set(x, y);
    this.icon.position.set(x, y);
  }


  this.drawNameValue = (x, y) => {
    this.nameText.position.set(x + this.cricleRadius + 26, y - 8);
    this.valueNumber.text = numWithCommas(Math.round(this.value));
    this.valueNumber.position.set(x + this.cricleRadius + 26, y + 28);
  }


}




function displayDateFun(date) {
  if (firstDate == true) {
    // this value text
    runningDate = new PIXI.Text();
    runningDate.fontFamily = 'heavyFonts';
    runningDate.font = 'heavyFonts';
    runningDate.style._fontFamily = 'heavyFonts';
    runningDate.fontSize = 65;
    runningDate.style.fontSize = 65;
    runningDate.fill = '0x222222';
    runningDate._style.fill = '0x222222';
    runningDate.align = 'left';
    runningDate.letterSpacing = 1;
    runningDate.anchor.set(0, 1);
    runningDate.position.set(80, 100);
    stage.addChild(runningDate);
    firstDate = false;
  }

  runningDate.text = date;
}




showDesItemsBool = true;
descCricles = [];
function showDesItems(desIndex) {
  if (showDesItemsBool == true) {
    cricleY = 10;
    for (i in items) {
      // cricles labels
      descCricle = new PIXI.Graphics();
      descCricles.push(descCricle);
      descCricle.beginFill(items[desIndex[i]].color);
      descCricle.drawCircle(cWidth - 50, cricleY, 16);
      descCricle.endFill();
      stage.addChild(descCricle);
      cricleY += 50;
    }

    showDesItemsBool = false;
  }
  n = 0;
  cricleY = 95;
  for (n in items) {
    // descCricles[n].fill.color = items[desIndex[n]].color;
    // descCricles[n]._fillStyle.color = items[desIndex[n]].color;
    descCricles[n].clear();
    descCricles[n].beginFill(items[desIndex[n]].color);
    descCricles[n].drawCircle(cWidth - 50, cricleY, 16);
    descCricles[n].pivot.set(10);
    descCricles[n].endFill();
    cricleY += 50;
  }


}



showItemTopBool = true;
function showItemTop(index) {
  if (showItemTopBool == true) {
    firstItemText = new PIXI.Text();
    firstItemText.fontFamily = 'heavyFonts';
    firstItemText.font = 'heavyFonts';
    firstItemText.style._fontFamily = 'heavyFonts';
    firstItemText.fontSize = 65;
    firstItemText.style.fontSize = 65;
    firstItemText.align = 'left';
    firstItemText.letterSpacing = 1;
    firstItemText.anchor.set(0.5, 1);
    firstItemText.position.set(cWidth / 2, 100);
    stage.addChild(firstItemText);
    showItemTopBool = false;
  }

  value = items[index].value;
  color = items[index].color;
  name = items[index].name;
  firstItemText.fill = color;
  firstItemText._style.fill = color;
  firstItemText.style.fill = color;
  // firstItemText.style._fill = color;
  firstItemText.text = `#1 ${name}: ${numWithCommas(Math.round(value))}`;
  // console.log(index);
}


// (((((((((((((((((((((()))))))))))))))))))))
// (((((((((((((((( ANIMATION ))))))))))))))))
// (((((((((((((((((((((()))))))))))))))))))))


let capturer = new CCapture({
  framerate: 60,
  quality: 100,
  format: 'webm'
});


iAnime = 1;
function animate() {
  if (iAnime == 1) { requestAnimationFrame(animate); }
  else { capturer.stop(); capturer.save(); }
  fpsCounter.nextFrame();
  $('#fps').innerHTML = "FPS: " + fpsCounter.value;

  update();
  canvas.render(stage);

  // if(frame > 200) {
  // 	iAnime = 0;
  // }

  capturer.capture(canvas.view);
}
setTimeout(() => {
  init();
  update();
  canvas.render(stage);
  animate();
  capturer.start();
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
  return (graphContainer._height) * (pery / (currYTopVal));
}


function asce(arr) {
  return arr.sort(function (a, b) { return a - b });
}

function desc(arr) {
  return arr.sort(function (a, b) { return b - a });
}


function dataY(i) {
  return data.y['y' + i];
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
  num = Math.round(num);
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
  return scaled.toFixed(1) + suffix;
}

/* Monotone cubic spline interpolation
   Usage example:
  var f = createInterpolant([0, 1, 2, 3, 4], [0, 1, 4, 9, 16]);
  var message = '';
  for (var x = 0; x <= 4; x += 0.5) {
    var xSquared = f(x);
    message += x + ' squared is about ' + xSquared + '\n';
  }
  alert(message);
*/
var createInterpolant = function (xs, ys) {
  var i, length = xs.length;

  // Deal with length issues
  if (length != ys.length) { throw 'Need an equal count of xs and ys.'; }
  if (length === 0) { return function (x) { return 0; }; }
  if (length === 1) {
    // Impl: Precomputing the result prevents problems if ys is mutated later and allows garbage collection of ys
    // Impl: Unary plus properly converts values to numbers
    var result = +ys[0];
    return function (x) { return result; };
  }

  // Rearrange xs and ys so that xs is sorted
  var indexes = [];
  for (i = 0; i < length; i++) { indexes.push(i); }
  indexes.sort(function (a, b) { return xs[a] < xs[b] ? -1 : 1; });
  var oldXs = xs, oldYs = ys;
  // Impl: Creating new arrays also prevents problems if the input arrays are mutated later
  xs = []; ys = [];
  // Impl: Unary plus properly converts values to numbers
  for (i = 0; i < length; i++) { xs.push(+oldXs[indexes[i]]); ys.push(+oldYs[indexes[i]]); }

  // Get consecutive differences and slopes
  var dys = [], dxs = [], ms = [];
  for (i = 0; i < length - 1; i++) {
    var dx = xs[i + 1] - xs[i], dy = ys[i + 1] - ys[i];
    dxs.push(dx); dys.push(dy); ms.push(dy / dx);
  }

  // Get degree-1 coefficients
  var c1s = [ms[0]];
  for (i = 0; i < dxs.length - 1; i++) {
    var m = ms[i], mNext = ms[i + 1];
    if (m * mNext <= 0) {
      c1s.push(0);
    } else {
      var dx_ = dxs[i], dxNext = dxs[i + 1], common = dx_ + dxNext;
      c1s.push(3 * common / ((common + dxNext) / m + (common + dx_) / mNext));
    }
  }
  c1s.push(ms[ms.length - 1]);

  // Get degree-2 and degree-3 coefficients
  var c2s = [], c3s = [];
  for (i = 0; i < c1s.length - 1; i++) {
    var c1 = c1s[i], m_ = ms[i], invDx = 1 / dxs[i], common_ = c1 + c1s[i + 1] - m_ - m_;
    c2s.push((m_ - c1 - common_) * invDx); c3s.push(common_ * invDx * invDx);
  }

  // Return interpolant function
  return function (x) {
    // The rightmost point in the dataset should give an exact result
    var i = xs.length - 1;
    if (x == xs[i]) { return ys[i]; }

    // Search for the interval x is in, returning the corresponding y if x is one of the original xs
    var low = 0, mid, high = c3s.length - 1;
    while (low <= high) {
      mid = Math.floor(0.5 * (low + high));
      var xHere = xs[mid];
      if (xHere < x) { low = mid + 1; }
      else if (xHere > x) { high = mid - 1; }
      else { return ys[mid]; }
    }
    i = Math.max(0, high);

    // Interpolate
    var diff = x - xs[i], diffSq = diff * diff;
    return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
  };
};
