
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.toname = res.userInfo.nickName
              this.globalData.sendname = res.userInfo.nickName
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    toname: null,
    sendname:null,
    sentence: null,
    today: null,
    state: '0',
// 天气
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 800,
    locations: "",//音乐
    userInfo: null,
    // 歌曲数据全局变量
    backgroundAudioManager:null,
    essenceMusicData: null,
    categoryMusicData: null,
    hotMusicData: null,
    newMusicData: null,
    detailsMusicData: null,
    searchMusicData: null,
    songMusicData: {mark:false},
    songSheetData: null,
    songData:null,
    currentIndex:null,
    singerArr:null
  },
changeLocation: function(e) {
    this.globalData.locations = `${e.lng},${e.lat}`;
},
changeIndicatorDots: function(e) {

    this.globalData.indicatorDots = e;
},
changeVertical: function(e) {
    this.globalData.vertical = e;
},
changeAutoplay: function(e) {
    this.globalData.autoplay = e;
},
intervalChange: function(e) {
    this.globalData.interval = e;
},
isCircular: function(e) {
    this.globalData.circular = e;
},
durationChange: function(e) {
    this.globalData.duration = e;
}
})