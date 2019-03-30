const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
const app = getApp();
function Singer(name, id) {
  this.id = id
  this.name = name
  this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
}

Page({
  onLoad: function () {
    this.getSingerList()
  },
  onHide: function () {
    app.globalData.fromSinger = true
  },
  getSingerList: function () {
    const _this = this
    this.setData({
      singerlist: _this._normallizeSinger(app.globalData.singerArr)
    })
  },
  /*组装成需要的歌手列表数据*/
  _normallizeSinger:function(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item,index)=>{
      if(index < HOT_SINGER_LEN) {
        map.hot.items.push(new Singer(item.Fsinger_name, item.Fsinger_mid))
      }
      const key = item.Findex
      if(!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new Singer(item.Fsinger_name, item.Fsinger_mid))
    })
    // 为了得到有序列表,对map做进一步处理
    let hot = []
    let ret = []
    for (let key in map) {
      var val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if(val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    // 按a-z排序
    ret.sort((a, b)=>{
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }
})