// miniprogram/pages/paper/paper.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    papers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    db.collection('paper').where({}).get().then(res => {
      console.log(res.data)
      that.setData({
        papers: res.data
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
    var that = this
  },

  clickItem: function (e) {
    console.log(e)
    var _id = e.currentTarget.dataset._id
    console.log(_id)
    wx.navigateTo({
      url: '../look/look?_id='+_id
    })
  },
})