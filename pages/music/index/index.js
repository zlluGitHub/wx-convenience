
//index.js
//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js");
Page({
  data: {
    slider: [
      { picUrl: 'https://zhenglinglu.cn/external/musicimg/1.jpg' },
      { picUrl: 'https://zhenglinglu.cn/external/musicimg/2.jpg' },
      { picUrl: 'https://zhenglinglu.cn/external/musicimg/3.jpg' }
    ],
    //精品歌单列表
    qualityList: null,
    //最新歌单列表
    newList: null,
    //最新歌单列表
    hotList: null,
  },
  // 添加
  onLoad: function () {
    /* 获取歌单分类 */
    api.getEssenceMusicData('全部', 100);
    api.getHotMusicData('全部', 100, 'new');
    // api.getSongSlider();
  },
  onShow: function () {
    app.globalData.songMusicData.mark = false;
    let essenceTime = setInterval(() => {
      if (app.globalData.essenceMusicData) {
        this.updateData('essence');
        clearInterval(essenceTime);
      }
    }, 10);

    // let slider = setInterval(() => {
    //   if (app.globalData.songSliderData) {
    //     this.updateData('slider');
    //     clearInterval(slider);
    //   }
    // }, 10);

    let newTime = setInterval(() => {
      if (app.globalData.newMusicData) {
        this.updateData('new');
        clearInterval(newTime);
      }
    }, 10);
  },
  updateData: function (key) {
    switch (key) {
      case 'essence':
        this.setData({
          qualityList: app.globalData.essenceMusicData.slice(0, 12),
        });
        break;
      case 'hot':
        this.setData({
          hotList: app.globalData.hotMusicData.slice(0, 12)
        });
        break;
      case 'new':
        this.setData({
          newList: app.globalData.newMusicData.slice(0, 12)
        });
        break;
      // case 'slider':
      //   let slider = app.globalData.songSliderData.slider
      //   this.setData({ slider });
      //   break;
      default:
        break;
    }
  },


  //选择歌单ID
  _selectItemId: function (event) {
    const data = event.currentTarget.dataset.data;
    app.globalData.songSheetData = data;
    wx.navigateTo({
      url: '/pages/music/bill-list/bill-list'
    })
  },
  _selectSongSheet: function (event) {
    let mark = event.currentTarget.dataset.mark, url = '';
    if (mark === 'new') {
      url = '/pages/music/newSongSheet/newSongSheet';
    } else if (mark === 'hot') {
      url = '/pages/music/hotSongSheet/hotSongSheet';
    } else if (mark === 'culle') {
      url = '/pages/music/culleSongSheet/culleSongSheet';
    } else if (mark === 'all') {
      url = '/pages/music/allSongSheet/allSongSheet';
    };
    wx.navigateTo({ url });
  },
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'lu-Music'
    }
  }
})
