const app = getApp().globalData;
const SEQUENCE_MODE = 1
const RANDOM_MOD = 2
const SINGLE_CYCLE_MOD = 3

Page({
  data: {
    currentLyric: null,
    name: '',
    singer: '',
    image: 'https://zhenglinglu.cn/external/musicimg/3.jpg',
    currentTime: '0:00',
    duration: '0:00',
    playurl: '',
    playIcon: 'icon-play',
    cdCls: 'pause',
    translateCls: '',
    songslist: [],
    currentIndex: null,

    currentLineNum: 0,
    toLineNum: -1,
    dotsArray: new Array(2),
    currentDot: 0,
    playMod: SEQUENCE_MODE
  },
  // onLoad: function () {

  // },
  onShow: function () {
    this._init();
  },
  _init: function () {
    if (app.currentIndex === 1) {
      app.songData = app.songMusicData.songs[1];
    }
    this._getLyric(app.songData.lrc);
    this._createAudio(app.songData.url);
    this.setData({
      songslist: app.songMusicData.songs,
    });
  },

  // 获取歌词
  _getLyric: function (lrc) {
    const _this = this;
    wx.request({
      url: lrc,
      method: 'GET',
      success: function (res) {
        if (res.data) {
          _this._getLyricAction(res.data);
          _this.setData({
            name: app.songData.name,
            image: app.songData.pic,
            singer: app.songData.singer
          });
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  // 获取处理歌词
  _getLyricAction: function (lrc) {
    // 用换行符拆分获取到的歌词
    let medises = this._normalizeLyric(lrc).split("\n");
    let medisArray = [];
    medises.forEach(item => {
      //获取歌词里的时间
      let time = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
      medisArray.push({
        time: (time.split(":")[0] * 60 + parseFloat(time.split(":")[1])).toFixed(3),
        txt: item.substring(item.indexOf("]") + 1, item.length)
      });
    });
    this.setData({
      currentLyric: medisArray
    });
  },
  // 去掉歌词中的转义字符
  _normalizeLyric: function (lyric) {
    return lyric.replace(/&#58;/g, ':').replace(/&#10;/g, '\n').replace(/&#46;/g, '.').replace(/&#32;/g, ' ').replace(/&#45;/g, '-').replace(/&#40;/g, '(').replace(/&#41;/g, ')')
  },

  // 歌词滚动回调函数
  handleLyric: function (currentTime) {
    let lineNum, lyric = this.data.currentLyric;
    for (let i = 0; i < lyric.length; i++) {
      if (i < lyric.length - 1) {
        let time1 = lyric[i].time * 1, time2 = lyric[i + 1].time * 1;
        if (currentTime > time1 && currentTime < time2) {
          lineNum = i - 1
          break;
        }
      } else {
        lineNum = lyric.length - 2
      }
    }
    this.setData({
      currentLineNum: lineNum + 1,
      currentText: lyric[lineNum + 1] && lyric[lineNum + 1].txt
    })

    let toLineNum = lineNum - 3
    if (lineNum > 3 && toLineNum != this.data.toLineNum) {
      this.setData({
        toLineNum: toLineNum
      })
    }
  },

  // 创建播放器
  _createAudio: function (dataUrl) {
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    app.backgroundAudioManager = backgroundAudioManager;
    backgroundAudioManager.title = app.songData.name;
    backgroundAudioManager.epname = app.songSheetData ? app.songSheetData.title : '';
    backgroundAudioManager.singer = app.songData.singer;
    backgroundAudioManager.coverImgUrl = app.songData.pic;
    backgroundAudioManager.src = dataUrl;
    // 监听音乐播放。
    backgroundAudioManager.onPlay(() => {
      this.setData({
        playIcon: 'icon-pause',
        cdCls: 'play'
      })

    })
    // 监听音乐暂停。
    backgroundAudioManager.onPause(() => {
      this.setData({
        playIcon: 'icon-play',
        cdCls: 'pause'
      })
    })
    // 监听音乐停止。
    backgroundAudioManager.onStop(() => {
      if (this.data.playMod === SINGLE_CYCLE_MOD) {
        return
      }
    })
    // 监听播放拿取播放进度
    backgroundAudioManager.onTimeUpdate(() => {
      const currentTime = backgroundAudioManager.currentTime;
      const duration = backgroundAudioManager.duration;
      this.setData({
        currentTime: this._formatTime(currentTime),
        percent: currentTime / duration
      });
      if (currentTime === duration) {
        if (this.data.playMod === 1) {
          this.next();
        } else if (this.data.playMod === 2) {
          const math = app.songMusicData.songs.length;
          app.currentIndex === Math.floor(Math.random() * (math + 1));
          app.songData = app.songMusicData.songs[app.currentIndex];
          this.setData({
            currentIndex: app.currentIndex
          });
          this._init();
        } else if (this.data.playMod === 3) {
          this._init();
        };
      };
      this.handleLyric(currentTime * 1);
      this.setData({
        //总时长
        duration: this._formatTime(backgroundAudioManager.duration)
      });
    });
  },

  // 播放/暂停
  togglePlaying: function () {
    const instance = app.backgroundAudioManager;
    if (instance.paused) {
      instance.play();
    } else {
      instance.pause();
    }
  },


  _formatTime: function (interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },

  /*秒前边加0*/
  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },

  changeMod: function () {
    let playMod = this.data.playMod + 1
    if (playMod > SINGLE_CYCLE_MOD) {
      playMod = SEQUENCE_MODE
    }
    this.setData({ playMod });
  },
  prev: function () {
    app.backgroundAudioManager.stop();
    app.songData = app.songMusicData.songs[app.currentIndex - 1];
    app.currentIndex = app.currentIndex - 1;
    this.setData({
      currentIndex: app.currentIndex
    })
    this._init();
  },
  next: function () {
    if (app.currentIndex < app.songMusicData.songs.length) {
      app.backgroundAudioManager.stop();
      app.songData = app.songMusicData.songs[app.currentIndex + 1];
      app.currentIndex = app.currentIndex + 1;
      this.setData({
        currentIndex: app.currentIndex
      })
      this._init()
    } else {
      wx.showModal({
        title: '提示',
        content: '这是第一首歌哦٩(๑❛ᴗ❛๑)۶',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }

  },

  openList: function () {
    if (!this.data.songslist.length) {
      return
    }
    this.setData({
      translateCls: 'uptranslate'
    })
  },
  close: function () {
    this.setData({
      translateCls: 'downtranslate'
    })
  },
  playthis: function (e) {
    const index = e.currentTarget.dataset.index;
    app.backgroundAudioManager.stop();
    app.songData = app.songMusicData.songs[index];
    app.currentIndex = index;
    this.setData({
      currentIndex: index
    })
    this._init();
    this.close();
  },
  changeDot: function (e) {
    this.setData({
      currentDot: e.detail.current
    })
  }
})