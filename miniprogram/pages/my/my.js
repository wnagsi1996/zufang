// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    let userInfo=wx.getStorageSync('userInfo');
    let isphone=wx.getStorageSync('isphone');
    if(userInfo && isphone){
      this.setData({
        userInfo
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
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
  //点击获取用户信息
  bindgetuserinfo(e){
    console.log(e)
    if(e.detail.userInfo){
      let userInfo=e.detail.userInfo;
      this.setData({
        userInfo:e.detail.userInfo
      })
      wx.setStorageSync('userInfo', userInfo)
    }
  }
})