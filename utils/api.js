
/***************网易云音乐API*****************/

//获取应用实例
const app = getApp()

/* 获取歌单数据 */
const getSongMusicData = function (id) {
  const url = `https://api.bzqll.com/music/netease/songList?key=579621905&id=${id}&limit=10&offset=0`;
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      if (res.data && res.data.code === 200) {
        app.globalData.songMusicData = res.data.data;
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
};
/* 获取精品歌单 */
const getEssenceMusicData = (cat, limit) => {
  const url = `https://api.bzqll.com/music/netease/hotSongList?key=579621905&cat=${cat}&limit=${limit}&offset=0`;
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      if (res.data && res.data.code === 200) {
        app.globalData.essenceMusicData = res.data.data;
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
};

/* 获取歌单分类 */
const getCategoryMusicData = () => {
  const url = `https://api.bzqll.com/music/netease/songListCategory?key=579621905`;
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      if (res.data) {
        app.globalData.categoryMusicData = res.data;
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
};

/* 获取热门歌单 */
const getHotMusicData = (cat, limit, order) => {
  const url = `https://api.bzqll.com/music/netease/hotSongList?key=579621905&cat=${cat}&limit=${limit}&offset=0&order=${order}`;
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      if (res.data) {
        if (order === 'new') {
          app.globalData.newMusicData = res.data.data;
        } else if (order === 'hot') {
          app.globalData.hotMusicData = res.data.data;
        }
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
};

/* 获取音乐详情 */
const getDetailsMusicData = (id) => {
  const url = `https://api.bzqll.com/music/netease/song?key=579621905&id=${id}`;
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      if (res.data) {
        app.globalData.detailsMusicData = res.data;
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
};

module.exports = {
  getEssenceMusicData,
  getCategoryMusicData,
  getHotMusicData,
  getDetailsMusicData,
  getSongMusicData
};