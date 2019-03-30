
//index.js
//获取应用实例
const app = getApp().globalData;
const api = require("../../../utils/api.js");
Page({
  data: {
    qualityList: null,
  },
  // 添加
  onLoad: function () {
    const qualityList= app.essenceMusicData;
    this.setData({qualityList});
  },
  //选择歌单ID
  _selectItemId: function (event) {
    const data = event.currentTarget.dataset.data;
    app.songSheetData = data;
    wx.navigateTo({
      url: '/pages/music/bill-list/bill-list'
    })
  },
})
