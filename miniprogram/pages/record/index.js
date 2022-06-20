// miniprogram/pages/record/record.js
// 在页面中定义插屏广告
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentText: null,
    isCanRecord: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currentText: null,
    })

    var that = this;
    wx.authorize({
      scope: "scope.record",
      success: function () {
        that.setData({
          isCanRecord: true,
        })
        console.log("录音授权成功");
      },
      fail: function () {
        console.log("录音授权失败");
        wx.showToast({
          title: '请先授权录音功能',
          icon: "none"
        })
      }
    })
    this.initRecord()
  },

  /**
* 生命周期函数--监听页面初次渲染完成
*/
  onReady: function () {
  },

  initRecord: function () {

    //有新的识别内容返回，则会调用此事件
    // manager.onRecognize = (res) => {
    // let text = res.result

    // this.setData({
    //   currentText: text,
    // })
    // console.log("识别开始", res.result);
    // }

    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      text = text.substr(0, text.length - 1);

      //判断是否有效
      if (text == '') {
        wx.showToast({
          title: '请说出物品名称...',
          mask: true,
          duration: 1500,
          icon: "none",
        })
        return
      }

      this.setData({
        currentText: text,
      })

      //判断文本长度
      if (text.length > 10) {
        wx.showToast({
          title: '名称要简洁，比如(键盘)',
          mask: true,
          duration: 3000,
          icon: "none",
        })
        return
      }

      console.log("识别结束", res.result);

      wx.showLoading({
        title: '查询中...',
      })
      timer = setTimeout(function () {
        wx.hideLoading();
        wx.navigateTo({
          url: '../search/search?_info=' + JSON.stringify(text)
        })
      }, 2000)
    }
  },

  streamRecord: function () {
    if (!this.data.isCanRecord) {
      wx.showToast({
        title: '请先授权录音功能',
        icon: "none"
      })
      return;
    }

    manager.start({
      lang: 'zh_CN',
    })

    this.setData({
      currentText: null,
    })

    wx.showToast({
      title: '录音中...',
      mask: false,
      duration: 60000,
      icon: "none",
    })

    //超时关闭录音
    timer = setTimeout(function () {
      manager.stop()
      wx.hideToast();
    }, 10000)
  },

  endStreamRecord: function () {
    manager.stop()
    wx.hideToast();
    clearTimeout(timer);
  }
})