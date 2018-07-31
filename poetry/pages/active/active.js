// pages/active/active.js
const app = getApp()
var interval = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display1: 'none',
    autofocus: false,
    time:"获取验证码",
    fun_id: 2,
    currentTime: 61,
    disabled:false,
    display6:'inline-block'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var unionid = wx.getStorageSync('unionid'); 
    //活动内容后台配置
    that.getActive();
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/checkbonus',
      data: {
        unionid: unionid
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (k) {
        console.log(k);
        if (k.data.money.length > 0) {
          that.setData({
            display1: 'inline-block',
            autofocus: true,
            money: k.data.money[0]
          })

        }
      }
    })
  },
  getActive: function () {
    var that = this;
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Active/active',
      success: function (e) {
        console.log(e.data);
        that.setData({
          title: e.data.data.title,
          active1: e.data.data.active1,
          active2: e.data.data.active2,
          active3: e.data.data.active3,
          active4: e.data.data.active4,
          tip: e.data.data.tip,
          status: e.data.status
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log(e);
    var mobile = e.detail.value.mobile;
    var money = e.detail.value.money;
    var yzm = e.detail.value.yzm;
    var that = this;
    var unionid = wx.getStorageSync('unionid');
    console.log(e.detail.value.mobile.length);
    console.log(e.detail.value.mobile.length);
    if(e.detail.target.dataset.id == 2){
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (e.detail.value.mobile.length == 11 && myreg.test(e.detail.value.mobile)){
        wx.request({
          url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/sms',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            mobile: mobile,
            unionid: unionid
          },
          success: function (e) {
            console.log(e);
          }
        })
        var that = this;
        var currentTime = that.data.currentTime;
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: currentTime + '秒',
            disabled: true
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              time: '重新发送',
              currentTime: 61,
              disabled: false
            })
          }
        }, 1000)
      }else{
        this.setData({
          tishi: "请您输入手机号",
          col: "#0f0"
        })
      }
     
      

    } else if (e.detail.target.dataset.id == 1){
    //判断验证码是否正确
      wx.request({
        url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/checkmsg',
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data:{
          yzm: yzm,
          unionid: unionid
        },
        success:function(k){
          if(k.data.status == 1){
            wx.request({
              url: app.globalData.request_url + 'thinkphp/index.php/Home/Payphone/run',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                mobile: mobile,
                money: money,
                orderid: unionid
              },
              success: function (res) {
                console.log(res);
                if (res.data.status == 1) {
                  wx.showToast({
                    title: '领取成功',  //标题  
                    image: '/pages/image/yuan.png',  //自定义图标的本地路径，image 的优先级高于 icon  
                    duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
                    mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
                    success: function () {
                      that.setData({
                        display1: 'none',
                        money:0,
                        tishi: ""

                      })
                    }, //接口调用成功的回调函数  
                    fail: function () { },  //接口调用失败的回调函数  
                    complete: function () { } //接口调用结束的回调函数  
                  })
                } else if (res.data.status == 0) {
                  wx.showToast({
                    title: '您已领过奖励',  //标题  
                    icon: 'success',  //自定义图标的本地路径，image 的优先级高于 icon  
                    duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
                    mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
                    success: function () {
                      that.setData({
                        display1: 'none'
                      })
                    }, //接口调用成功的回调函数  
                    fail: function () { },  //接口调用失败的回调函数  
                    complete: function () { } //接口调用结束的回调函数  
                  })
                }
              }

            })
          }else{
            that.setData({
              err:"验证码错误"
            })
          }

        }
      })
    }
  },
  foucus(e){
    console.log(e);
    this.setData({
      tishi:"请输入11位有效手机号",
      col: "#0f0"
    })
  },
  input(e){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;  
    console.log(e);
    if (e.detail.value.length!=11){
      this.setData({
        tishi: "手机号长度有误",
        col:"#f00"
      })
    } else if (!myreg.test(e.detail.value)){
      this.setData({
        tishi: "手机号不存在",
        col: "#f00"
      })
    }else{
      this.setData({
        tishi: "手机号正确",
        col: "#0f0"
      })
    }
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