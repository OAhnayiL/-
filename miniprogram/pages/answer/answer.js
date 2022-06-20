// miniprogram/pages/answer/answer.js

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: null,
    kinds: null,

    //答题的索引
    answerIndex: 0,
    //错误的数量
    errorCount: 0,
    //正确数量
    rightCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      itemList: null,
      kinds: getApp().globalData.kindList,
      answerIndex: 0,
      errorCount: 0,
      rightCount: 0,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  //点击答案
  clickAnswer(e) {
    var that = this;
    var item = e.currentTarget.dataset.correct;

    //将选择项写入结构
    that.data.itemList[that.data.answerIndex]._note = item;

    //判断是最后一个则跳转结果
    if (that.data.answerIndex + 1 >= 10) {

      wx.showLoading({
        title: '批阅中...',
        mask:true,
      })

      //延时跳转
      setTimeout(function () {
        wx.hideLoading();
        wx.navigateTo({
          url: "../result/result?_info=" + JSON.stringify(that.data.itemList)
        })
      }, 2000);

      return;
    }

    //添加延时
    wx.showLoading({
      title: '下一题...',
      mask:true,
    })
    setTimeout(function () {
      wx.hideLoading();

      //索引加一
      that.setData({
        answerIndex: that.data.answerIndex + 1
      })
    }, 300);
  },

  //点击开始答题
  onclick:function(){
    var that = this;

    //显示加载界面
    wx.showLoading({
      title: '载入题库...',
    });

    wx.cloud.callFunction({
      name: 'getRandomDate',
      success: res => {
        that.setData({
          itemList: res.result.list
        })

        console.log("获取试卷", that.data.itemList);
        wx: wx.hideLoading();
      }
    })
  }
})