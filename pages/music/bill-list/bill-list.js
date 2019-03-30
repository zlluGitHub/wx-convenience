const app = getApp().globalData;
const api = require('../../../utils/api.js')
Page({
  data: {
    //精品歌单列表
    songs: [],
    songListPic: "https://p2.music.126.net/GhhuF6Ep5Tq9IEvLsyCN7w==/18708190348409091.jpg?param=400y400"
  },
  onShow: function () {
    if (!app.songMusicData.mark) {
      let id = app.songSheetData.id;
      this._getSongMusicData(id);
      console.log(id);
      
    } else {
      this.setData({
        songs: app.songMusicData.songs
      });
    }
  },
  /* 获取歌单数据 */
  _getSongMusicData: function (id) {
    const url = `https://api.bzqll.com/music/netease/songList?key=579621905&id=${id}&limit=10&offset=0`, _this = this;
    wx.request({
      url: url,
      method: 'GET',
      success: function (res) {
        if (res.data && res.data.code === 200) {
          _this.setData({
            songs: res.data.data.songs,
            songListPic: res.data.data.songListPic,
          });
          app.songMusicData = { mark: false, ...res.data.data };
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /* 全部播放 */
  playall: function () {
    app.currentIndex = 1;
    wx.redirectTo({
      url: '/pages/music/player/player'
    })
  },
  /* 播放音乐 */
  _PlayMusic: function (event) {
    app.songData = event.currentTarget.dataset.data;
    app.currentIndex = event.currentTarget.dataset.index;
    console.log('dscsd');
    
    wx.redirectTo({
      url: '/pages/music/player/player'
    })
  },
})