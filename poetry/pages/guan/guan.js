const app = getApp()
// pages/guan/guan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      var that = this;
      var openid = options.uid;
      var width = wx.getStorageSync('width');
      var height = wx.getStorageSync('height');
      that.setData({
        width1: width,
        height1: height
      })
      wx.setStorageSync('uid',openid);
      //根据用户id查询该用户的级别以及下一个级别
      wx.request({
        url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/findrank',
        data: {
          openid:openid
        },
        success: function(res) {
          console.log(res)
          that.setData({
            rank1:res.data.rank,
            color1: res.data.color,
            rank2:res.data.rank2,
            color2: res.data.color2,
            score:res.data.score,
            rankcode:res.data.juli,
            rank3: res.data.rank3,
            color3: res.data.color3,
            arr:res.data.arr,
            colorarr: res.data.colorarr,
            toView: 'current'
          })
        }
      })
  },
  go(e){
    var openid = wx.getStorageSync('uid');
    wx.redirectTo({
      url: '/pages/main/main?uid='+openid,
    })
  },
  //yinyue
  start(e) {
    wx.pauseBackgroundAudio();

    wx.setStorageSync('yinyue_status', 1);
    this.setData({
      yinyue_status: 1
    })
  },
  stop(e) {
    console.log(e)
    wx.playBackgroundAudio({
      //播放地址  
      dataUrl: 'https://heji.g2u7.cn/thinkphp/yinyue.MP3'

    })
    wx.setStorageSync('yinyue_status', 2);
    this.setData({
      yinyue_status: 2
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (wx.getStorageSync('yinyue_status')) {
      this.setData({
        yinyue_status: wx.getStorageSync('yinyue_status')
      })
    } else {
      wx.setStorageSync('yinyue_status', 2);
      this.setData({
        yinyue_status: 2
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})