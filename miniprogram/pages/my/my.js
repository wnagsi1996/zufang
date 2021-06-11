// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    admin:false
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
    if(userInfo.name){
      this.setData({
        userInfo
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
  },
  toUrl(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  _handAdmin(){
    wx.cloud.callFunction({
      name:'InitInfo',
      data:{
        type:'ADMIN'
      },
      success:res=>{
        console.log(res)
        if(res.result.total>0){
          this.setData({
            admin:true
          })
          wx.navigateTo({
            url: '../../Adminpackage/Home/Home',
          })
        }else{
          this.setData({
            admin:false
          })
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  clearUser(){
    this.setData({
      userInfo:false,
      admin:false
    })
    wx.removeStorageSync('userInfo');
    wx.showToast({
      title: '清除成功',
    })
  }
})