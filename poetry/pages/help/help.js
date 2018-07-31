let util = require('../../utils/util.js');
var i = 1;
const app = getApp()
// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    width: "0",
    disable:'true'
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
    console.log(options);
    var that = this;
    var openid1 = options.uid;
    var guan = options.guan;
    var op = options.openid;
    wx.playBackgroundAudio({
      //播放地址  
      dataUrl: 'https://heji.g2u7.cn/thinkphp/yinyue.MP3'

    })
    var str = wx.getStorageSync('str');
    var session_key = wx.getStorageSync('session_key');
    var openid = wx.getStorageSync('openid');
    wx.checkSession({
      success: function () {
        if (session_key && openid){
          wx.getUserInfo({
            success: function (result) {

              wx.request({
                url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/decode',
                data: {
                  iv: result.iv,
                  encryptedData: result.encryptedData,
                  session_key: session_key,
                  ava: result.userInfo.avatarUrl,
                  nickname: result.userInfo.nickName,
                  openid: openid
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (e1) {
                  console.log(e1);
                  wx.setStorageSync('openid', openid);//当前用户id
                  var guan = e1.data.res.guan;
                  if (e1.data.qd == 1) {
                    wx.showToast({
                      title: '登录签到+10金币',
                      icon: 'success',
                      image: '/pages/image/yuan.png',
                      duration: 2000,
                      mask: true
                    })
                  }
                  wx.setStorageSync('openid1', openid1);
                  wx.request({
                    url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/helppoetry',
                    data: {
                      openid: openid1
                    },
                    success: function (e) {
                      if (op) {
                        //存分享者id和被分享者id
                        wx.request({
                          url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/saveshare1',
                          data: {
                            openid1: op,
                            openid2: openid

                          },
                          success: function (q) {
                            console.log(q);
                            console.log('gg');
                          }
                        })
                      }
                      wx.setStorageSync('guan', options.guan);
                      wx.setStorageSync('poetryid', e.data.questionid);
                      that.setData({
                        guan: options.guan,
                        question: e.data.question,
                        status: e.data.status,
                        answer1: e.data.answer[0],
                        answer2: e.data.answer[1],
                        answer3: e.data.answer[2],
                        answer4: e.data.answer[3],
                        contentid: e.data.questionid,
                        disable: false,
                        openid1: openid1,
                        score: e.data.score,
                        correct_content: e.data.correct_content,
                        text: '答案是:' + e.data.correct_content,
                        img: e.data.img ? e.data.img : '/pages/image/star.png',
                        text1: e.data.correct_content,
                        img1: result.userInfo.avatarUrl,
                        nickname1: result.userInfo.nickName,
                        openid: e1.data.res.openid,
                      })
                    }
                  })


                }
              })
            }

          })
        }else{
          wx.login({
            success: function (res) {
              wx.request({
                url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/login',
                data: {
                  code: res.code
                },
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (k) {
                  wx.setStorageSync('str', k.data.data);
                  wx.setStorageSync('session_key', k.data.data.session_key);
                  wx.setStorageSync('openid', openid);

                  var str = k.data.data;
                  var session_key = k.data.data.session_key;
                  var openid = k.data.data.openid;

                  wx.getUserInfo({
                    success: function (result) {

                      wx.request({
                        url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/decode',
                        data: {
                          iv: result.iv,
                          encryptedData: result.encryptedData,
                          session_key: session_key,
                          ava: result.userInfo.avatarUrl,
                          nickname: result.userInfo.nickName,
                          openid: openid
                        },
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (e1) {
                          console.log(e1);
                          wx.setStorageSync('openid', openid);//当前用户id
                          var guan = e1.data.res.guan;
                          if (e1.data.qd == 1) {
                            wx.showToast({
                              title: '登录签到+10金币',
                              icon: 'success',
                              image: '/pages/image/yuan.png',
                              duration: 2000, 
                              mask: true
                            })
                          }


                          wx.setStorageSync('openid1', openid1);
                          wx.request({
                            url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/helppoetry',
                            data: {
                              openid: openid1
                            },
                            success: function (e) {
                              if (op) {
                                //存分享者id和被分享者id
                                wx.request({
                                  url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/saveshare1',
                                  data: {
                                    openid1: op,
                                    openid2: openid

                                  },
                                  success: function (q) {
                                    console.log(q);
                                    console.log('gg');
                                  }
                                })
                              }
                              wx.setStorageSync('guan', options.guan);
                              wx.setStorageSync('poetryid', e.data.questionid);
                              that.setData({
                                guan: options.guan,
                                question: e.data.question,
                                status: e.data.status,
                                answer1: e.data.answer[0],
                                answer2: e.data.answer[1],
                                answer3: e.data.answer[2],
                                answer4: e.data.answer[3],
                                contentid: e.data.questionid,
                                disable: false,
                                openid1: openid1,
                                score: e.data.score,
                                correct_content: e.data.correct_content,
                                text: '答案是:' + e.data.correct_content,
                                img: e.data.img ? e.data.img : '/pages/image/star.png',
                                text1: e.data.correct_content,
                                img1: result.userInfo.avatarUrl,
                                nickname1: result.userInfo.nickName,
                                openid: e1.data.res.openid,
                              })
                            }
                          })


                        }
                      })
                    }

                  })
                }
              })

            }
          })
        }

      },
      fail: function () {
        wx.login({
          success: function (res) {
            wx.request({
              url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/login',
              data: {
                code: res.code
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (k) {
                wx.setStorageSync('str', k.data.data);
                wx.setStorageSync('session_key', k.data.data.session_key);
                wx.setStorageSync('openid', openid);
                var str = k.data.data;
                var session_key = k.data.data.session_key;
                var openid = k.data.data.openid;
                wx.getUserInfo({
                  success: function (result) {

                    wx.request({
                      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/decode',
                      data: {
                        iv: result.iv,
                        encryptedData: result.encryptedData,
                        session_key: session_key,
                        ava: result.userInfo.avatarUrl,
                        nickname: result.userInfo.nickName,
                        openid: openid
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      success: function (e1) {
                        console.log(e1);
                        wx.setStorageSync('openid', openid);//当前用户id
                        var guan = e1.data.res.guan;
                        if (e1.data.qd == 1) {
                          wx.showToast({
                            title: '登录签到+10金币',
                            icon: 'success',
                            image: '/pages/image/yuan.png',
                            duration: 2000,
                            mask: true
                          })
                        }
                        wx.setStorageSync('openid1', openid1);
                        wx.request({
                          url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/helppoetry',
                          data: {
                            openid: openid1
                          },
                          success: function (e) {
                            if (op) {

                              //存分享者id和被分享者id
                              wx.request({
                                url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/saveshare1',
                                data: {
                                  openid1: op,
                                  openid2: openid

                                },
                                success: function (q) {
                                  console.log(q);
                                  console.log('gg');
                                }
                              })
                            }


                            console.log(e);
                            wx.setStorageSync('guan', options.guan);
                            wx.setStorageSync('poetryid', e.data.questionid);
                            that.setData({
                              guan: options.guan,
                              question: e.data.question,
                              status: e.data.status,
                              answer1: e.data.answer[0],
                              answer2: e.data.answer[1],
                              answer3: e.data.answer[2],
                              answer4: e.data.answer[3],
                              contentid: e.data.questionid,
                              disable: false,
                              openid1: openid1,
                              score: e.data.score,
                              correct_content: e.data.correct_content,
                              text: '答案是:' + e.data.correct_content,
                              img: e.data.img ? e.data.img : '/pages/image/star.png',
                              text1: e.data.correct_content,
                              img1: result.userInfo.avatarUrl,
                              nickname1: result.userInfo.nickName,
                              openid: e1.data.res.openid,
                            })
                          }
                        })


                      }
                    })
                  }

                })
              }
            })

          }
        })

      }
    })
   
    
   
  },


  //弹窗确认
  confirm(e) {
    var openid = wx.getStorageSync('openid');
    this.setData({
      hidden: true
    })
    wx.redirectTo({
      url: '/pages/top/top'
    })
  },

  //弹窗取消，收藏
  cancel(e) {
    console.log(e);
    //提示收藏成功并调到下一题
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/collectpoetry',
      data: {
        openid: wx.getStorageSync('openid'),
        poetryid: wx.getStorageSync('poetryid')
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          //收藏成功
          wx.showToast({
            title: '收藏成功',
            icon: 'success', 
            image: '/pages/image/yuan.png', 
            duration: 2000, 
            mask: true
          })
        } else {
          //已收藏
          wx.showToast({
            title: '已收藏',
            icon: 'success',  
            image: '/pages/image/yuan.png', 
            duration: 2000,
            mask: true
          })

        }
      }
    })
  },
  //提示
  tishi(e) {
    var that = this;
    var score = e.currentTarget.dataset.score;
    var openid = e.currentTarget.dataset.openid;
    console.log(e.currentTarget.dataset);
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/sharetishi',
      data: {
        question: e.currentTarget.dataset.question,
        openid:openid
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {//扣款成功
          wx.showToast({
            title: '提示-' + res.data.score,  //标题  
            icon: 'success',  //图标，支持"success"、"loading"  
            image: '/pages/image/yuan.png', 
            duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
            mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
            success: function () {
              var score1 = parseInt(score) - parseInt(res.data.score)
              that.setData({
                score: score1,
                mixtishi: res.data.tishi
              })

            }, //接口调用成功的回调函数  
            fail: function () { },  //接口调用失败的回调函数  
            complete: function () { } //接口调用结束的回调函数  
          })

        } else if (res.data.status == 0) {//余额不足
          wx.showModal({
            title: '金币不足',
            content: '这是一个模态弹窗',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })

        } else {
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
  gohome(e){
    wx.redirectTo({
      url: '/pages/top/top',
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
  //表单提交触发
  formSubmit: function (e) {
    console.log(e.detail.formId);
    var openid1 = wx.getStorageSync('openid1');//求助者openid
    var formId = e.detail.formId;//推送码搞定
    var guan = wx.getStorageSync('guan');
    console.log(e.detail.value.answer);
    var openid = wx.getStorageSync('openid');
    console.log(e.currentTarget.dataset);
    var answer = e.detail.value.answer;
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/sharecheckanswer',
      data: {
        openid1: openid1,//求助
        answer: answer,//回答
        guan: guan,
        openid:openid//当前
      },
      success: function (res) {
        console.log(res)
        //答对
       
        wx.request({
          url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/tuisong',
          data: {
            openid: openid,
            formId: formId,
            openid1: openid1,
            guan: guan
          },
          success: function (res) {
            console.log(res);
            that.setData({
              hidden: '',
            })
          }
        })
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
    console.log(e);
    var that = this;
    var score = e.target.dataset.score;
    var status = wx.getStorageSync('status');
    var openid = wx.getStorageSync('openid');
    if (status == 1) {//分享  
      return {
        title: '自定义转发标题',
        path: '/pages/top/top',
        desc: '描述',
        success: function (res) {
          // 转发成功
          wx.request({
            url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/shareaddcoin',
            data: {
              openid: openid
            },
            success: function (k) {
              that.setData({
                score: parseInt(score) + 5
              })

            }
          })

        },
        fail: function (res) {
          // 转发失败
        }
      }

    } else if (status == 2) {//求助
      return {
        title: '自定义转发标题',
        path: '/pages/help/help?uid=' + openid + '&guan=' + guan,
        desc: '描述',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }
})