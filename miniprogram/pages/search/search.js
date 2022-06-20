// miniprogram/pages/search/search.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索总次数
    searchTotalCount: 0,
    //输入的内容
    inputTxt: null,
    //热门搜索
    hotSearchItems: [],
    //搜索到的所有项目
    searchItmes: null,
    //是否隐藏详细信息弹框
    isHiddenInfoModal: true,
    //选择搜索到的项目
    selectItem: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;

    //获取传递的参数
    if (options._info) {
      that.setData({
        inputTxt: JSON.parse(options._info)
      })

      //点击搜索
      that.doClick();
    }

    //显示加载弹窗
    if (!options._info) {
      wx.showLoading({
        title: '加载中...',
      });
    }

    //获取热门搜索
    wx.cloud.callFunction({
      name: 'getHotItems',
      data: {
        _count: 20,
      },

      success: res => {
        console.log("热门项目=》", res)
        that.setData({
          hotSearchItems: res.result.data
        })
      },
      complete: res => {
        if (!options._info) {
          wx.hideLoading();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //点击搜索按钮
  doClick: function () {
    var that = this;
    //判断输入的内容是否有效
    if (that.data.inputTxt == null) {
      wx.showToast({
        title: '请输入有效内容！！',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }

    //清空历史搜索项
    that.setData({
      searchItmes: null
    })

    //显示加载界面
    wx.showLoading({
      title: '加载中...',
    });

    that.searchFunction().then((res) => {
      //隐藏加载界面
      wx.hideLoading();

      if (res.result.data.length == 0) {
        wx.showToast({
          title: '怀疑外星物品,数据将马上更新哦！！',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    })
  },

  //搜索动作
  searchFunction: function () {
    var that = this;
    console.log("【开始搜索】", this.data.inputTxt)

    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'search',
        data: {
          _txt: that.data.inputTxt
        },
        success: res => {
          that.setData({
            searchItmes: res.result.data
          })
          resolve(res);
        },
        fail: reject
      })
    })
  },

  //获取输入的搜索内容
  getInput: function (e) {
    this.setData({
      searchItmes: null
    })

    if (e.detail.value == "") {
      this.setData({
        inputTxt: null
      })
    } else {
      this.setData({
        inputTxt: e.detail.value
      })
    }
  },

  //获取热门搜索
  getHotItems: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getHotItems',
        success: res => {
          console.log("热门项目=》", res)
          that.setData({
            hotSearchItems: res.result.data
          })
          resolve(res);
        },
        fail: reject
      })
    })
  },

  //点击热门搜索
  doClickHotItem: function (event) {
    console.log("【点击热门搜索】", event)

    this.setData({
      inputTxt: event.currentTarget.dataset.name
    })

    //开始搜索
    this.doClick(null);
  },

  //选择搜索到的项目
  doClickItem: function (event) {
    console.log("【选择的项目】", event)
    var _type = event.currentTarget.dataset.type;
    var _name = event.currentTarget.dataset.name;
    var _id = event.currentTarget.id;

    console.log("【选择的ID】", _id)

    //增加搜索数目
    wx.cloud.callFunction({
      name: 'inc',
      data: {
        id: _id
      },
      success: function (res) {
        console.log("【增加热搜次数】", res)
      }
    })

    var kinds = getApp().globalData.kindList;
    console.log(kinds)
    for (var i = 0; i < kinds.length; i++) {
      if (kinds[i].text == _type) {
        //显示详细信息
        var itemInfo = {
          _txt: _name,
          _type: kinds[i]
        }

        this.setData({
          selectItem: itemInfo,
          isHiddenInfoModal: false
        })

        console.log("【详细】", this.data.selectItem)
        return;
      }
    }
  },

  //点击关闭弹窗详细信息
  modal_hidden: function () {
    this.setData({
      isHiddenInfoModal: true,
    })
  },

})