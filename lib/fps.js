function FPSCounter () {
    this.frameCount = 0;
    this.lastUpdate = null;
    this.value = "";
};

FPSCounter.prototype.nextFrame = function () {
    var now = new Date();

    this.frameCount++;

    if (this.lastUpdate !== null) {
        if ((now - this.lastUpdate) > 200) {
            this.value = (((200 * this.frameCount) / (now - this.lastUpdate)) * 5).toFixed(1);
            this.frameCount = 0;
            this.lastUpdate = now;
        }
    } else {
        this.lastUpdate = now;
    }
};

const DELTA = 1;

let time = 0;
// let _time = 0;
function timer(el) {
    curr = 0;
    t = setInterval(()=>{
        time = (curr/10).toFixed(1);
        $(el).innerHTML = `TIME: ${time}`;
        curr++;
        if(curr > 10000) {clearInterval(t)};
    }, 100 * DELTA);

    // _curr = 0;
    // _t = setInterval(()=>{
    //     _time = (_curr/10).toFixed(1);
    //     _curr++;
    //     if(_curr > 10000) {clearInterval(_t)};
    // }, 100);
}