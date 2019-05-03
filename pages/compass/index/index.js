//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    item: {name: 'check', value: '不再提醒', checked: false},
  },
  //事件处理函数
  jump: function() {
    wx.redirectTo({
      url: '../compass/compass'
    })
  },
  onShow: function () {
    var verson = wx.getStorageSync('verson');
    if (verson == '1.4') {
    } else {
      wx.setStorageSync('verson', '1.4')
      wx.showModal({
        title: 'V1.4 更新说明',
        content: '加入明暗两大主题，白天晚上切换自如，妈妈再也不担心我看不清楚方向啦！',
      })
    }
  },
  checkBox: function (e) {
    if(e.detail.value[0]) {
      wx.setStorageSync('check', 1)
      wx.showModal({
        title: '提示',
        content: '当您发现指南针指向异常，请握紧手机画∞来校准指南针！',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../compass/compass'
            })
          } else {
            console.log(res)
          }
        }
      })
    } else {
      wx.setStorageSync('check', 0)
    }
  },
  onLoad: function () {
    var check = wx.getStorageSync('check')
    if(check == 1) {
      wx.redirectTo({
        url: '../compass/compass'
      })
    }
  }
})
