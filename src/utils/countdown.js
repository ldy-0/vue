var interval = null;
// v.countdown = { day: '1', hour: '02', minute: '10', second: '11', dayStr: '1天', timeStr: '02:10:11', };

const MINUTE = 60,
      HOUR = 3600,
      DAY = 24 * HOUR;

function Countdown(target, key) {
  console.log(target. key);
  if(!key) [target, key] = [key, target];

  this.target = target; 
  this.key = key;

  // if(!this.lazy) this.start();

  return this;
}

Countdown.prototype.start = function() {
  if(interval) return ;

  interval = setInterval(() => {
    var time, o;

    console.log(this.target.length - 1);
    for(var i = this.target.length - 1; i >= 0; i--){
      o = {}; 
      time = new Date(this.target[i].key).getTime() - Date.now(); 
      console.log(time);

      // o.day = time / DAY;
      // time %= DAY;

      // console.log(i, time, o);
    }

  }, 1000);
}

Countdown.prototype.reset = function() {
  clearInterval(interval);
}

export default Countdown;