const app = getApp()
let util = require('../../utils/util.js');
// pages/top/top.js
Page({
    
  /**
   * 页面的初始数据
   */
  data: {
    disable:true,
    display:"none",
    display5:"none",
    go:'',
    share:'',
    animationData: {},
    animationData1:{},
    // date: util.formatDateToMb(),
   
  },
  //音乐
  //yinyue
  start(e) {
    wx.pauseBackgroundAudio();
    wx.setStorageSync('yinyue_status', 1);
    this.setData({
      yinyue_status: 1
    })
  },
  rank1(e){
    this.setData({
      display5:"inline-block"
    })
  },
  closerank1(e){
    this.setData({
      display5: "none"
    })
  },
  stop(e) {
    wx.playBackgroundAudio({
      //播放地址  
      dataUrl: 'https://heji.g2u7.cn/thinkphp/yinyue.MP3'

    })
    wx.setStorageSync('yinyue_status', 2);
    this.setData({
      yinyue_status: 2
    })
  },
  go(e){
    wx.navigateTo({
      url: '/pages/guan/guan?uid='+e.currentTarget.dataset.id,
    })
  },
  collect(e){
    wx.navigateTo({
      url: '/pages/collect/collect?uid=' + e.currentTarget.dataset.id,
    })
  },
  getSize: function(){
    var that = this;
    var width = wx.getStorageSync('width');
    var height = wx.getStorageSync('height');
    if (width && height) {
      that.setData({
        width: width,
        height: height
      })
    } else {
      wx.getSystemInfo({
        success: function (res1) {
          wx.setStorageSync('width', res1.windowWidth);
          wx.setStorageSync('height', res1.windowHeight);
          that.setData({
            width: res1.windowWidth,
            height: res1.windowHeight
          })
        },
      })
    }
  },
  getMp3: function(){
    var player = wx.getStorageSync('yinyue_status');
    if (player == 2 && player) {
      wx.playBackgroundAudio({
        //播放地址  
        dataUrl: 'https://heji.g2u7.cn/thinkphp/yinyue.MP3'
      })
    } else if (player == 1 && player) {

    } else if (!player) {
      wx.playBackgroundAudio({
        //播放地址  
        dataUrl: 'https://heji.g2u7.cn/thinkphp/yinyue.MP3'
      })
    }
  },

  getShare(){
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，分享功能可能受限，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid1 = options.openid;
    var unionid1 = options.unionid;
    that.getMp3();
    that.getSize();
    //红包活动开关
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/version',
      data: {
        ver: 0.05
      },
      success: function (a) {
        console.log(a)
        that.setData({
          version: a.data.status
        })
      }
    })
    //允许分享到群并获取群id
    that.getShare();
  
    wx.checkSession({
      success: function () {
        var session_key = wx.getStorageSync('session_key');
        var openid = wx.getStorageSync('openid');
        var unionid = wx.getStorageSync('unionid');
        if (session_key && unionid) {
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
                  openid: openid,
                  unionid: unionid
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (e) {
                  wx.setStorageSync('unionid', e.data.res.unionid);
                  wx.setStorageSync('openid', openid);
                  var guan = e.data.res.guan;
                  wx.setStorageSync('guan', guan);
                  if (e.data.qd == 1) {
                    wx.showToast({
                      title: '每日签到+10元宝',  //标题  
                      icon: 'success',  //图标，支持"success"、"loading"
                      image: '/pages/image/yuan.png',
                      duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
                      mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
                      success: function () { }, //接口调用成功的回调函数  
                      fail: function () { },  //接口调用失败的回调函数  
                      complete: function () { } //接口调用结束的回调函数  
                    })
                  }
                  wx.request({
                    url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/findnickname',
                    data: {
                      unionid: unionid
                    },
                    success: function (dd) {
                      wx.setStorageSync('nickname', dd.data.nickname);
                      if (openid1) {
                        //存分享者id和被分享者id
                        wx.request({
                          url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/saveshare',
                          data: {
                            openid1: openid1,
                            openid2: e.data.res.openid
                          },
                          success: function (q) {
                          
                          }
                        })
                      }
                      that.setData({
                        img: result.userInfo.avatarUrl,
                        nickname: result.userInfo.nickName,
                        guan: guan ? guan : 0,
                        score: e.data.res.score,
                        rank: e.data.res.rank,
                        openid: e.data.res.openid,
                        disable: false,
                        go: 'go',
                        share: 'share',
                        display: dd.data.confirm_status_a == 1 ? "" : "none",
                        arr: dd.data.arr,
                        showpic: dd.data.bonus_status
                      })

                    }
                  })


                }
              })
            }

          })

        } else {
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
                  var session_key = k.data.data.session_key;
                  var openid = k.data.data.openid;


                  wx.setStorageSync('session_key', k.data.data.session_key);
                  wx.setStorageSync('openid', openid);


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
                        success: function (e) {
                          wx.setStorageSync('unionid', e.data.res.unionid);
                          wx.setStorageSync('openid', openid);
                          var guan = e.data.res.guan;
                          wx.setStorageSync('guan', guan);
                          if (e.data.qd == 1) {
                            wx.showToast({
                              title: '登录签到+10元宝',  //标题  
                              icon: 'success',  //图标，支持"success"、"loading"
                              image: '/pages/image/yuan.png',
                              duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
                              mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
                              success: function () { }, //接口调用成功的回调函数  
                              fail: function () { },  //接口调用失败的回调函数  
                              complete: function () { } //接口调用结束的回调函数  
                            })
                          }
                          wx.request({
                            url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/findnickname',
                            data: {
                              // openid: openid,
                              unionid: e.data.res.unionid
                            },
                            success: function (dd) {
                              wx.setStorageSync('nickname', dd.data.nickname);

                              if (openid1) {
                                //存分享者id和被分享者id
                                wx.request({
                                  url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/saveshare',
                                  data: {
                                    openid1: openid1,
                                    openid2: e.data.res.openid
                                  },
                                  success: function (q) {

                                  }
                                })
                              }
                              that.setData({
                                img: result.userInfo.avatarUrl,
                                nickname: result.userInfo.nickName,
                                guan: guan ? guan : 0,
                                score: e.data.res.score,
                                rank: e.data.res.rank,
                                openid: e.data.res.openid,
                                disable: false,
                                go: 'go',
                                share: 'share',
                                display: dd.data.confirm_status_a == 1 ? "" : "none",
                                arr: dd.data.arr,
                                showpic: dd.data.bonus_status
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
                var session_key = k.data.data.session_key;
                var openid = k.data.data.openid;


                wx.setStorageSync('session_key', k.data.data.session_key);
                wx.setStorageSync('openid', openid);

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
                      success: function (e) {
                        wx.setStorageSync('unionid', e.data.res.unionid);
                        wx.setStorageSync('openid', openid);
                        var guan = e.data.res.guan;
                        wx.setStorageSync('guan', guan);
                        if (e.data.qd == 1) {
                          wx.showToast({
                            title: '每日签到+10元宝',  //标题  
                            icon: 'success',  //图标，支持"success"、"loading"
                            image: '/pages/image/yuan.png',
                            duration: 2000, //提示的延迟时间，单位毫秒，默认：1500  
                            mask: true,  //是否显示透明蒙层，防止触摸穿透，默认：false  
                            success: function () { }, //接口调用成功的回调函数  
                            fail: function () { },  //接口调用失败的回调函数  
                            complete: function () { } //接口调用结束的回调函数  
                          })
                        }
                        wx.request({
                          url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/findnickname',
                          data: {
                            // openid: openid,
                            unionid: e.data.res.unionid
                          },
                          success: function (dd) {
                            wx.setStorageSync('nickname', dd.data.nickname);
                            console.log(dd);
                            if (openid1) {
                              //存分享者id和被分享者id
                              wx.request({
                                url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/saveshare',
                                data: {
                                  openid1: openid1,
                                  openid2: e.data.res.openid
                                },
                                success: function (q) {

                                }
                              })
                            }
                            that.setData({
                              img: result.userInfo.avatarUrl,
                              nickname: result.userInfo.nickName,
                              guan: guan ? guan : 0,
                              score: e.data.res.score,
                              rank: e.data.res.rank,
                              openid: e.data.res.openid,
                              disable: false,
                              go: 'go',
                              share: 'share',
                              display: dd.data.confirm_status_a == 1 ? "" : "none",
                              arr: dd.data.arr,
                              showpic: dd.data.bonus_status
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

  //关闭弹窗
  confirmclose(e){
    var openid = wx.getStorageSync('openid');
    var unionid = wx.getStorageSync('unionid');
    var that = this;
    wx.request({
      url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/changeConfirmStatus',
      data:{
        openid:openid,
        unionid:unionid
      },
      success:function(res){
        if(res.data.status == 1){
          that.setData({
            display: "none"
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
    // var openid = wx.getStorageSync('openid');
    var unionid = wx.getStorageSync('unionid');
    var that = this;
   
    if (wx.getStorageSync('yinyue_status')) {
      that.setData({
        yinyue_status: wx.getStorageSync('yinyue_status')
      })
    } else {
      wx.setStorageSync('yinyue_status',2);
      that.setData({
      yinyue_status: 2
      })
    }
//根据openid获取称呼和关数
    if (unionid){
      wx.request({
        url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/findguan',
        data: {
          // openid: openid,
          unionid: unionid
        },
        success: function (e) {
          var guan = e.data.res.guan;
          wx.request({
            url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/findnickname',
            data: {
              // openid: openid
              unionid: unionid
            },
            success:function(dd){
              that.setData({
                guan: guan,
                rank: e.data.rank,
                img: e.data.res.img,
                nickname: e.data.res.nickname,
                score: e.data.res.score,
                arr:dd.data.arr,
                showpic: dd.data.bonus_status
              })
            }
          })
         
        }
      })
    }
  },

  clickbonus(e){
    var that = this;
    var unionid = wx.getStorageSync('unionid');
    var click = wx.getStorageSync('clickbonus');
    if (click == 1){
        wx.navigateTo({
          url: '/pages/active/active'
        })
    } else{
            wx.request({
              url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/changebonus',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              data: {
                unionid: unionid
              },
              success: function (res) {
                if (res.data.status == 1) {
                  wx.setStorageSync('clickbonus', 1);
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/active/active'
                    })
                  }, 1000)
                }
              }
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
  onPageScroll: function (e) {
    if(e.scrollTop>10){
      this.setData({
        opacity: 0
      })
    }else{
      this.setData({
        opacity: 1
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1300);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var unionid = wx.getStorageSync('unionid');
    var nickname = wx.getStorageSync('nickname');
    var guan = wx.getStorageSync('guan');
    return {
      title: '我在诗词猜猜乐闯过了' + guan+'关,你可以吗？',
      path: '/pages/top/top?openid=' + openid,
      desc: '我在唐诗宋词猜猜乐，你也来玩吧！',
      imageUrl: '/pages/image/share.png',
      success: function (res1) {
        if (res1.shareTickets[0] && res1.shareTickets.length > 0){
          wx.getShareInfo({
            shareTicket: res1.shareTickets[0],
            success(result) {  
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
                      var session_key = k.data.data.session_key;
                      wx.request({
                        url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/decode2',
                        data: {
                          iv: result.iv,
                          encryptedData: result.encryptedData,
                          session_key: session_key
                        },
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        fail: function(e){
                          wx.showToast({
                            title: '本次转发失败',
                            icon: 'loading',
                            duration: 2000,
                            mask: true
                          })
                        },
                        success: function (e) {//分享到群
                          if (e.data.status == 0){
                            wx.showToast({
                              title: '本次转发失败',
                              icon: 'loading',
                              duration: 2000,
                              mask: true 
                            })
                          } else if (e.data.status == 1){
                            var gid = e.data.gid.openGId;
                            wx.request({
                              url: app.globalData.request_url + 'thinkphp/index.php/Home/Poetrybak/addcoin',
                              data: {
                                unionid: unionid,
                                gid: gid
                              },
                              success: function (l) {
                                if (l.data.status == 1) {
                                  wx.showToast({
                                    title: '炫耀成功+10元宝',
                                    icon: 'success',
                                    image: '/pages/image/yuan.png',
                                    duration: 2000,
                                    mask: true,
                                    success: function () {
                                      that.setData({
                                        score: l.data.score
                                      })
                                    }
                                   
                                  })

                                } else {
                                  wx.showToast({
                                    title: '炫耀成功', 
                                    icon: 'success',
                                    image: '/pages/image/yuan.png',
                                    duration: 2000,
                                    mask: true,
                                    success: function () {

                                    }, //接口调用成功的回调函数  
                                    
                                  })

                                }

                              }
                            })
                          }
                        
                        },
                        fail: function (k) {
                          wx.showToast({
                            title: '本次转发失败',
                            icon: 'loading',
                            duration: 2000,
                            mask: true
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
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '本次转发失败',
          icon: 'loading', 
          duration: 2000, 
          mask: true
        })

      }
    }
  }

})