// miniprogram/pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: null,
    score: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemList: JSON.parse(options._info)
    })

    console.log("【结果信息】", this.data.itemList);

    //计算测试结果
    for (var i = 0; i < this.data.itemList.length; i++) {
      if (this.data.itemList[i]._note == this.data.itemList[i]._type) {

        this.setData({
          score: this.data.score + 10
        })
      }
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