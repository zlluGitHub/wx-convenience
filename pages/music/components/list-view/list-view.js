const app = getApp().globalData;
Component({
  data: {
    toView: 0,
    currentIndex: 0
  },
  properties: {
    singerlist: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        let shortcutList = []
        newVal.forEach(function (item) {
          shortcutList.push(item.title.substring(0, 1))
        })
        this.setData({
          shortcutList: shortcutList
        })
        this.getHeight()
      }
    }
  },
  methods: {
    toSingerDetail: function (event) {
      let singer = event.currentTarget.dataset.singer.name;
      if (singer) {
        let url = `https://api.bzqll.com/music/netease/search?key=579621905&s=${singer}&type=song&offset=0`;
        wx.request({
          url,
          method: 'GET',
          success: function (res) {
            if (res.data.result !== 'ERROR') {
              app.songMusicData = { songs: res.data.data, mark: true };
              wx.navigateTo({
                url: '/pages/music/bill-list/bill-list'
              });
            }else {
              wx.showModal({
                title: '温馨提示',
                content: '暂无找到此歌手信息！',
                success: function (res) {
                  if(res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }
    },
    scroll: function (event) {
      const newY = event.detail.scrollTop
      const listHeight = this.data.listHeight
      // 滚动到顶部
      if (newY < 0) {
        this.setData({
          currentIndex: 0
        })
        return
      }
      // 滚到中间部分
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (newY >= height1 && newY < height2) {
          this.setData({ currentIndex: i })
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.setData({
        currentIndex: listHeight.length - 2
      })
    },
    shortcutListTap: function (event) {
      this.setData({
        toView: event.target.dataset.index,
        currentIndex: event.target.dataset.index
      })
    },
    getHeight: function () {
      const _that = this
      setTimeout(() => {
        wx.createSelectorQuery().in(this).selectAll('.list-group').fields({ size: true }, function (res) {
          res.height
        }).exec(function (e) {
          let listHeight = []
          let height = 0
          listHeight.push(height)
          e[0].forEach((item, index) => {
            height += item.height
            listHeight.push(height)
          })
          _that.setData({
            listHeight: listHeight
          })
        })
      }, 20)
    }
  }
})