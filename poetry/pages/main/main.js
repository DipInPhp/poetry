
var i = 1;   
const app = getApp()
// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    display1:'none',
    display2:'none',
    display5:"none",
    text: '',
    width: "0"
  },
  //yinyue
  start(e){
    wx.pauseBackgroundAudio();
    wx.setStorageSync('yinyue_status', 1);
    this.setData({
      yinyue_status: 1
    })
  },
  stop(e){
    wx.playBackgroundAudio({
      //播放地址  
      dataUrl: 'https://heji.g2u7.cn/thinkphp/yinyue.MP3'
    })
    wx.setStorageSync('yinyue_status', 2);
    this.setData({
      yinyue_status: 2
    })
  },
  select(e){
    var that = this;
    var openid = e.currentTarget.dataset.uid;
    var answer = e.currentTarget.dataset.id;
    var contentid = e.currentTarget.dataset.index;
    var questionid = e.currentTarget.dataset.qid;
    var score1 = e.currentTarget.dataset.score;
    var tab = e.currentTarget.dataset.tab;
    var correct = e.currentTarget.dataset.correc;
    var question = e.currentTarget.dataset.question;
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/checkanswer',
      data:{
        openid:openid,
        answer:answer,//回答
        contentid:contentid,//题目
        questionid: questionid,
        correct: correct,
        question: question
      },
      success:function(res){
        if (res.data.reply == 'ok') {
          that.setData({
            dui: correct,
            width: "100%"
          })
          setTimeout(function(){
            that.setData({
              an_tt: res.data.res.title,
              an_author: res.data.res.author,
              an_content: res.data.res.content,
              an_explain: res.data.res.explain,
              hidden: '',
              display1: 'inline-block',
              score: parseInt(score1) + 5,
              width: "0"
            })
          },100)
            
          //答对判断是否弹出
         

        } else if (res.data.reply == 'no'){

          if (res.data.status == 1) {
            //答错
                  var score2 = parseInt(score1) + parseInt(res.data.delscore);
                  if (score2 >= 0) {
                    var score = score2;
                  } else {
                    var score = 0;
                  }
                  that.setData({
                    score: score,
                    index: tab,
                    display2: 'inline-block',
                    score2: parseInt(res.data.delscore)
                  })
                  setTimeout(function(){
                    that.setData({
                      display2: 'none'
                    })
                  },1000)

               
          } else if(res.data.status == 0) {
            wx.showModal({
              title: '温馨提示',
              content: '元宝不足',
              success: function (res) {
              }
            })
          } else if (res.data.status == 2){
            wx.showModal({
              title: '温馨提示',
              content: '已排除三个选项，请选择正确答案',
              success: function (res) {
              }
            })
            }
        } 
    
      }
    })
  },
  confirmclose(e) {
    var openid = wx.getStorageSync('openid');
    var that = this;
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/changeConfirmStatus',
      data: {
        openid: openid
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            display5: "none"
          })
          setTimeout(function(){
              wx.redirectTo({
                url: '/pages/guan/guan?uid=' + openid,
              })
          },100)

        }

      }
    })
  },
  
  getNickname: function(){
    var that = this;
    var unionid = wx.getStorageSync('unionid');
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/findnickname',
      data: {
        // openid: options.uid,
        unionid: unionid
      },
      success: function (dd) {
        that.setData({
          rank: dd.data.rank,
          display5: dd.data.confirm_status_a == 1 ? "" : "none",
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var op = options.openid;
    var unionid = wx.getStorageSync('unionid');
    var width = wx.getStorageSync('width');
    var height = wx.getStorageSync('height');
    that.setData({
      width1: width,
      height1: height
    })
    that.getNickname();
    wx.request({ 
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/poetry',
      data:{
        openid:options.uid
      },
      success:function(e){
        wx.setStorageSync('shangxia', e.data.status);
        wx.setStorageSync('guan',e.data.guan);
        wx.request({
          url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/pomadeng',
          data:{
            openid: options.uid,
            guan: e.data.guan
          },
          success:function(kk){
            wx.setStorageSync('score', e.data.score);
            if(kk.data.status == 1){
              var images = kk.data.img ? kk.data.img : "/pages/image/yuanbao.png"
            } else if (kk.data.status == 0){
              var images = ""
            }
                that.setData({
                  guan: e.data.guan,
                  question: e.data.question,
                  status: e.data.status,
                  answer1: e.data.answer[0],
                  answer2: e.data.answer[1],
                  answer3: e.data.answer[2],
                  answer4: e.data.answer[3],
                  openid: options.uid,
                  contentid: e.data.contentid,
                  questionid: e.data.questionid,
                  score: e.data.score,
                  correct_content: e.data.correct_content,
                  text: kk.data.status == 1? '我猜的答案是:' + kk.data.answer:"",
                  img: images,
                  display3: e.data.question ? "none" : "inline-block",
                  gohome:1
                })
            
          }
        })
      }
    })
  },
  //弹窗确认
  confirm(e){
    var openid = wx.getStorageSync('openid');
    this.setData({
      hidden: true,
      display1:'none'
    })
    wx.redirectTo({
      url: '/pages/main/main?uid=' + openid,
    })
  },
  gohome(e){
    wx.redirectTo({
      url: '/pages/top/top',
    })
  },
  //弹窗取消，收藏
  cancel(e){
    //提示收藏成功并调到下一题
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/collectpoetry',
      data:{
        openid:e.currentTarget.dataset.openid,
        poetryid: e.currentTarget.dataset.poetry
      },
      success:function(res){
        if(res.data.status == 1){
          //收藏成功
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
           
            duration: 2000,
            mask: true
           
          })  
        }else{
          //已收藏
          wx.showToast({
            title: '已收藏',
            icon: 'success',
         
            duration: 2000,
            mask: true
          })  

        }
      }
    })
  },
  //跳过

  //提示
  tishi(e){
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/tishi',
      data:{
        question:e.currentTarget.dataset.question,
        openid:openid
      },
      success:function(res){
        if(res.data.status == 1){//扣款成功
          wx.showToast({
            title: '提示-'+res.data.score1,  //标题  
            icon: 'success',  //图标，支持"success"、"loading"  
            image: '/pages/image/yuan.png', 
            duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
            mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
            success: function () { 
             
              that.setData({
                score: res.data.score,
                mixtishi:res.data.tishi
              })

            }
          })  

        } else if (res.data.status == 0){//余额不足
          wx.showModal({
            title: '元宝不足',
            content: '这是一个模态弹窗',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })

        }else{
          wx.showToast({
            title: '最多提示三次',
            icon: 'success',
            image: '/pages/image/yuan.png', 
            duration: 2000,
            mask: true 
           
          }) 
        }
      }
    })
  },
  onUnload: function () {//监听页面销毁 
    
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
    // 页面显示
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
  //表单提交触发
  formSubmit: function (e) {
    var openid = wx.getStorageSync('openid');
    var formId = e.detail.formId;
    var guan = wx.getStorageSync('guan');
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/saveformid',
      data:{
        formid:formId,
        openid:openid,
        guan:guan
      },
      success:function(res){
      }
    })
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
  onShareAppMessage: function (e) {
    var that = this;
    var shangxia = wx.getStorageSync('shangxia');
    var score1 = wx.getStorageSync('score');
    var openid = wx.getStorageSync('openid');
    var guan = wx.getStorageSync('guan');
    var id = e.target.dataset.id;
    if (id == 1){//分享  
      return {
        title: '我很喜欢这句诗，你呢？',
        path: '/pages/top/top',
        success: function (res) {
          // 转发成功
          wx.request({
            url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/shareaddcoin',
            data:{
              openid:openid,
              status:0
            },
            success:function(k){
              that.setData({
                score: parseInt(score1) + 5
              })
            }
          })

        },
        fail: function (res) {
          // 转发失败
        }
      }
    
    } else if (id == 2){//求助
      return {
        title: '求助！请问这句诗词的' + shangxia+'是什么？',
        path: '/pages/help/help?uid=' + openid + '&guan=' + guan + '&openid=' + openid,   
        success: function (res) {
          // 转发成功
          //加元宝
          wx.request({
            url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/shareaddcoin',
            data:{
              openid: openid,
              status:1
            },
            success:function(kk){
              that.setData({
                score: parseInt(score1) + 10
              })
            }
          })

        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }
})