var timerComponentStartTimeWW, TimerComponentEndTimeWW;

function start() {
  timerComponentStartTimeWW = new Date();
};


//returns time in ms
function end(type) {
  TimerComponentEndTimeWW = new Date();
  let timeDiff = TimerComponentEndTimeWW - timerComponentStartTimeWW; //in ms
  

  //convert to seconds
  if(typeof type == "string" && (type.toLowerCase() == "s" || type.toLowerCase() == "seconds"))
  timeDiff /= 1000;
	
  if(typeof type == "string" && (type.toLowerCase() == "m" || type.toLowerCase() == "minutes"))
  timeDiff /= 60000;
  
  return timeDiff;
}


const Timer = {};
Timer.start = start;
Timer.end = end;

export default Timer;