const api = require('../../../utils/api.js');
const app = getApp().globalData;
Page({
  data: {
    hotList: [],
    singerList: [],
    result: false
  },
  onLoad: function () {
    this._getHotSearch();
    this._getSingerSearch();
    // this.dealHistroySearch()
  },

  searchAction: function (event) {
    let keyWrod = event.detail.value || event.currentTarget.dataset.txt || event
    if (keyWrod) {
      let url = `https://api.bzqll.com/music/netease/search?key=579621905&s=${keyWrod}&type=song&offset=0`;
      wx.request({
        url,
        method: 'GET',
        success: function (res) {
          if (res.data.result !== 'ERROR') {
            app.songMusicData = { songs: res.data.data, mark: true };
            wx.navigateTo({
              url: '/pages/music/bill-list/bill-list'
            });
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '此内容暂不存在！',
              success: function (res) {
                if(res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        },
        fail: function (res) {
          console.log(res.data);
        }
      });
    }

  },
  _getHotSearch: function () {
    const _this = this;
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&jsonpCallback=hotSearchKeysmod_top_search&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
      method: 'GET',
      success: function (res) {
        if (res.data) {
          let res1 = res.data.replace('hotSearchKeysmod_top_search(', '')
          let res2 = JSON.parse(res1.substring(0, res1.length - 1))
          const hotArr = res2.data.hotkey;
          _this.setData({
            hotList: hotArr.length > 10 ? hotArr.slice(0, 10) : hotArr
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },


  _getSingerSearch: function () {
    const _this = this;
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq&jsonpCallback=callback',
      method: 'GET',
      success: function (res) {
        if (res.data) {
          let res1 = res.data.replace('callback(', '')
          let res2 = JSON.parse(res1.substring(0, res1.length - 1))
          const singerArr = res2.data.list;
          app.singerArr = singerArr;
          _this.setData({
            singerList: singerArr.length > 10 ? singerArr.slice(0, 10) : singerArr
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  selectSinger: function () {
    wx.navigateTo({ url: '/pages/music/singer/singer' });
  },

















  dealData: function (data) {
    if (data) {
      this.setData({
        result: true
      })
      data.singer ? this.setData({
        singers: data.singer.itemlist
      }) : this.setData({
        singers: []
      })
      data.song ? this.setData({
        songs: data.song.itemlist
      }) : this.setData({
        songs: []
      })
    } else {
      this.setData({
        result: false
      })
    }
  },
  dealHistroySearch: function (keyWrod) {
    let histroy
    try {
      let local = wx.getStorageSync('histroySearch')
      if (local) {
        histroy = local
        if (keyWrod && local.indexOf(keyWrod) < 0) {
          local.push(keyWrod)
          wx.setStorage({
            key: "histroySearch",
            data: local
          })
        }
      } else {
        if (keyWrod) {
          histroy = [keyWrod]
          wx.setStorage({
            key: "histroySearch",
            data: [keyWrod]
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
    this.setData({
      histroySearch: histroy.reverse()
    })
  },
  deleteHistroySearch: function (event) {
    const keyWord = event.currentTarget.dataset.txt
    if (keyWord) {
      let local = wx.getStorageSync('histroySearch')
      let index = local.indexOf(keyWord)
      local.splice(index, 1)
      wx.setStorageSync('histroySearch', local)
    } else {
      wx.removeStorageSync('histroySearch')
    }
    this.setData({
      histroySearch: wx.getStorageSync('histroySearch')
    })
  },
  goSinger: function (event) {
    const detail = event.currentTarget.dataset
    app.selectsinger = {}
    app.selectsinger.id = detail.id
    app.selectsinger.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${app.selectsinger.id}.jpg?max_age=2592000`
    app.selectsinger.name = detail.name
    wx.navigateTo({
      url: '/pages/music/singer-detail/singer-detail'
    })
  },
  selectSong: function (event) {
    const mid = event.currentTarget.dataset.mid
    api.getSongDetails(mid).then((res) => {
      var res1 = res.data.replace('getOneSongInfoCallback(', '')
      var res2 = JSON.parse(res1.substring(0, res1.length - 1)).data[0]
      let song = {
        id: res2.id,
        mid: mid,
        singer: songs.filterSinger(res2.singer),
        name: res2.name,
        album: res2.album.name,
        duration: res2.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res2.album.mid}.jpg?max_age=2592000`,
        musicId: res2.id
      }
      app.songlist = [song]
      app.currentIndex = 0
      wx.switchTab({
        url: '/pages/music/player/player'
      })
    }).catch(() => { })
  }
})