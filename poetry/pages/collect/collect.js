const app = getApp()
// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:"none",
    display:"none"
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = options.uid;
    var width = wx.getStorageSync('width');
    var height = wx.getStorageSync('height');
    that.setData({
      width: width,
      height: height
    })
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/showcollections',
      data:{
        openid:openid
      },
      success:function(e){
        console.log(e);
        if (e.data.res){
          that.setData({
            poetry: e.data.res,
            num: e.data.res[0].num,
            uid: openid,
            score:e.data.score
          })
        }else{
          that.setData({
            score: e.data.score,
            num: 0,
            uid: openid
          })
        }
      }
    })
  },
  //选择某一首诗词
  choose(e){
    var that = this;
    console.log(e.currentTarget.dataset.index);
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/showpoetry',
      data:{
        pid: e.currentTarget.dataset.index
      },
      success:function(res){
        console.log(res);
        that.setData({
          an_tt: res.data.res.title,
          an_author: res.data.res.author,
          an_content: res.data.res.content,
          an_explain: res.data.res.explain,
          hidden:"",
          display:"inline-block"
        })
      }
    })
  },
  //点击确定
  queding(e){
    console.log(e);
    this.setData({
      display: "none"
    })
  },
  go(e){
    wx.redirectTo({
      url: '/pages/guan/guan?uid=' + e.currentTarget.dataset.id,
    })
  },
  //删除收藏
  shanchu(e){
    wx.request({
      url:app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/delcollect',
      data:{
        pid: e.currentTarget.dataset.id
      },
      success:function(res){
          if(res.data.status==1){
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              mask: true, 
              success: function () {
                setTimeout(function(){
                  wx.redirectTo({
                    url: '/pages/collect/collect?uid='+e.currentTarget.dataset.index,
                  })

                },1000)
               }
            })  

          }
      }
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
    wx.showNavigationBarLoading()
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() 
      wx.stopPullDownRefresh()
    }, 1000);
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
    return {
      title: '诗词猜猜乐',
      path: '/pages/top/top'
    }
  }
})