// miniprogram/pages/look/look.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scItem: null,
    paper: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this


    db.collection('paper').doc(options._id).get().then(res => {
      console.log('sdfs', res)
      that.setData({
        paper: res.data
      })

      db.collection('shoucang').where({
        _paperid: that.data.paper._id,
        _openid: getApp().globalData.user._openid,
      }).get().then(res => {
        console.log('dsd', res)
        if (res.data.length > 0) {
          that.setData({
            scItem: res.data[0]
          })
        }
      })
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

  },

  clickSC: function () {
    var that = this
    if (this.data.scItem) {
      db.collection('shoucang').doc(that.data.scItem._id).remove().then(res => {
        console.log(res)
        if (res.stats.removed == 1) {
          that.setData({
            scItem: null
          })
          wx.showToast({
            title: '取消收藏！',
          })
        }
      })
    } else {
      db.collection('shoucang').add({
        data: {
          _paperid: that.data.paper._id,
          title: that.data.paper.title,
          time: that.data.paper.time,
        }
      }).then(res => {
        console.log(res);
        if (res._id) {
          that.setData({
            scItem: res
          })
          wx.showToast({
            title: '收藏成功！',
          })
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