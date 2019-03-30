let _sentenceId, lenSun = 0;

const storage = require('./wishes');

// const _getRandom = (n) => {
//   return Math.floor(Math.random() * parseInt(n))
// }

let changeOne = (relation, sex) => {
  let len = storage.classify[relation][sex].length;
  if (lenSun < len) {
    lenSun = lenSun + 1;
  } else {
    lenSun = 0;
  };

  let sentenceId = storage.classify[relation][sex][lenSun]
  if (sentenceId === _sentenceId) {
    this.changeOne();
  } else {
    _sentenceId = sentenceId;
    return storage.sentence[sentenceId];
  }
}


const today = () => {
  let year, month, day;
  let date = new Date();
  year = date.getFullYear();
  month = formatNumber(date.getMonth() + 1);
  day = formatNumber(date.getDate());
  return `${year}年${month}月${day}日`;
}
const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime1(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour,minute];

 // return [ month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


function halfHour(){
  let timeArr = [];
  for (let i =0; i<=48; i++){
    if(i % 2==0){
      timeArr.push(formatNumber(i/2) +':00');
    }else{
      timeArr.push(formatNumber(Math.floor(i/2))+":30")
    }
  }
  return timeArr;
}
let timeArr = halfHour();

function setTimeHalf(){
  var thisDate = new Date(), thisTime = formatTime(thisDate),lastTimeArr = [],index = 0;
  
 timeArr.map(function(t,i){
    let tArr = t.split(":");
    if (thisTime[0] >= Number(tArr[0])){
      index = thisTime[1]<=30?i:i+1;
    }
 })
 lastTimeArr = timeArr.slice(index);
 if (thisTime[1] !== 0 && thisTime[1]!==30){
    lastTimeArr.unshift(thisTime[0]+":"+thisTime[1]);
  }
  return lastTimeArr;
}


module.exports = {
  changeOne,
  today,
  formatTime1,
  formatTime: formatTime,
  setTimeHalf:setTimeHalf
}
