const util = require('../../../utils/util');
const app = getApp();

let o;

Page({
  data: {
    toname: '',
    relation: 1,
    sex: 1,
    today: '',
    sentday: '',
    sentence: '',
    wishesId: '',
    state: '0', //0 换一个, 1 制作我的祝福话
    showOverlay: false
  },
  onLoad(options) {
    console.log('options', options)
    o = options;
  },
  onShow() {
    if (o.state === '0') {
      // 初始化数据
      let sentence = util.changeOne(o.relation, o.sex);
      let today = util.today();
      this.setData({
        state: o.state,
        toname: app.globalData.toname,
        userInfo: app.globalData.userInfo,
        sentence: sentence,
        today: today
      });
      app.globalData.sentence = sentence;
      app.globalData.today = today;
    }

    // if (o.state === '1') {
    //   console.log('接收贺卡')
    //   this.setData({
    //     state: o.state,
    //     toname: o.toname,
    //     sentday: o.sentday,
    //     sentence: o.sentence
    //   })
    // }

    // //判断是否需要展示 点击跳转至自定义页面的提示
    let preview_custom_hint = wx.getStorageSync('preview-custom-hint') || false;
    this.setData({
      showCustomHint: preview_custom_hint
    })
  },
  changeOne(e) {
    // 点击事件，强制拉去数据
    let sentence = util.changeOne(o.relation, o.sex);
    this.setData({
      sentence: sentence
    })
    app.globalData.sentence = sentence;
  },
  finishCard() {
    this.setData({
      state: '1'
    })
  },

  shareTips() {
    let that = this;
    this.setData({
      showOverlay: true
    })
    setTimeout(function () {
      that.hideOverlay()
    }, 1500);
  },
  hideOverlay() {
    this.setData({
      showOverlay: false
    })
  },
  // 调整到制作页面
  customCard() {
    wx.navigateTo({
      url: `/pages/blessing/create/create`
    })
  },
  //跳转到自定义页面
  bindViewTap() {
    if (this.data.state === '0') {
      wx.navigateTo({
        url: `/pages/blessing/custom/custom?sentence=${this.data.sentence}&toname=${this.data.toname}`
      })
    }
  },

  onShareAppMessage() {
    this.hideOverlay()
    return {
      title: `${this.data.userInfo.nickName}给您发来祝福`,
      desc: "你也可以制作祝福话送给TA哟！",
      path: '/pages/blessing/preview/preview?&state=1&fromavatar=' + this.data.userInfo.avatarUrl + '&toname=' + this.data.toname + '&fromname=' + this.data.userInfo.nickName + '&sentday=' + this.data.today + '&sentence=' + this.data.sentence
    }
  },
  confirmCustomHint: function () {
    wx.setStorageSync('preview-custom-hint', true);
    this.setData({
      showCustomHint: true
    })
  }
})
