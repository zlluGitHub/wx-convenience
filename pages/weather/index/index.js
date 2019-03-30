
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../../utils/bmap-wx.min.js');
import { AK } from "../../../utils/index";
// import psb1 from "../../static/images/psb (1).jpg";
// import psb2 from "../../static/images/psb (2).jpg";
// import psb3 from "../../static/images/psb (3).jpg";
// import psb4 from "../../static/images/psb (4).jpg";
// import psb5 from "../../static/images/psb.jpg";
const innerAudioContext = wx.createInnerAudioContext();
const { globalData, changeLocation } = getApp();
Page({
    data: {
        weatherData: '',
        data: '',
        realTime: '',
        update: '',
        index: [],
        weather_data: [],
        settings: null,
        autoplay: true, //轮播自动播放
        interval: 3500, //暂停时间
        duration: 1000, //移动速度
        circular: true, //衔接滑动
        vertical: true,
        imgUrls: ["https://zhenglinglu.cn/external/images/psb (1).jpg", "https://zhenglinglu.cn/external/images/psb (2).jpg", "https://zhenglinglu.cn/external/images/psb (3).jpg", "https://zhenglinglu.cn/external/images/psb (4).jpg", "https://zhenglinglu.cn/external/images/psb.jpg"],
        greeting: [
            '问候，是一种甜蜜的挂念，愿我们温馨常在。',
            '那一世，我不为修来世，只为途中与你相遇。',
            '喜欢一个人总是藏不住，总会从眼睛里跑出来。',
            '我说着不放弃，却越来越没勇气继续爱你。',
            '没有彩虹的阳光，孤独时也要坚强。',
        ],
        musics: true,
        horn: 'labakai.png'
    },
    playMusic: function () {
        if (this.data.musics) {
            innerAudioContext.stop();
            this.setData({
                musics: !this.data.musics,
                horn: 'labaguan.png'
            });
        } else {
            innerAudioContext.play();
            this.setData({
                musics: !this.data.musics,
                horn: 'labakai.png'
            });
        }
    },
    onLoad: function () {
        this.getData();
    },
   
    getData: function () {
        const that = this;
        // 新建百度地图对象 
        const BMap = new bmap.BMapWX({ ak: AK });
        const fail = data => {
            const datas = {
                lat: 39.92998577808024, lng: 116.39564503787867
            }
            changeLocation(datas);
            that.getData();
        };
        const success = data => {
            const weatherData = data.currentWeather[0];
            const otherWeather = data.originalData;
            otherWeather.results[0].weather_data[0].date = "今天";
            that.setData({
                settings: globalData,
                weatherData: weatherData,
                date: weatherData.date.slice(0, 9),
                realTime: weatherData.date.slice(14, 17).replace(')', ''),
                update: weatherData.date.slice(3, 5) + '/' + weatherData.date.slice(6, 8),
                index: otherWeather.results[0].index,
                weather_data: otherWeather.results[0].weather_data
            });
            innerAudioContext.autoplay = this.data.musics;
            innerAudioContext.src =
                "https://zhenglinglu.cn/external/music/weather.mp3";
        }
        // 发起weather请求 
        BMap.weather({
            fail: fail,
            success: success,
            location: globalData.locations
        });
    },
    search() {
        wx.navigateTo({
            url: '/pages/weather/search/search'
        })
    }

})