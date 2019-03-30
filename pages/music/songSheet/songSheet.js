
//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js");
Page({
  data: {
    slider:[
      {picUrl:'https://zhenglinglu.cn/external/musicimg/1.jpg'},
      {picUrl:'https://zhenglinglu.cn/external/musicimg/2.jpg'},
      {picUrl:'https://zhenglinglu.cn/external/musicimg/3.jpg'}
    ],
    //歌单列表
    subList: null,
    //最新歌单列表
    categories: null
  },
  // 添加
  onLoad: function () {
    /* 获取歌单分类 */
    api.getCategoryMusicData();
  },
  onShow: function () {
    let sheet = setInterval(() => {
      if (app.globalData.categoryMusicData) {
        this.setData({
          subList:app.globalData.categoryMusicData.sub,
          categories:app.globalData.categoryMusicData.categories,
        })
        clearInterval(sheet);
      }
    }, 10);
  }
})
