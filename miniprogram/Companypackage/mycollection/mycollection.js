// Companypackage/mycollection/mycollection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo');
    let openid=userInfo.openid;
    this.setData({
      openid
    })
    this.getCollection(openid)
  },
  getCollection(openid){
    wx.showLoading()
    const db=wx.cloud.database();
    db.collection('Collections').where({
      _openid:openid
    }).orderBy('updateTime', 'desc')
    .get({
      success:res=>{
        wx.hideLoading();
        console.log(res)
        if (res.errMsg == "collection.get:ok") {
          this.setData({
            list:res.data
          })
        }
      },fail:err=>{
        wx.hideLoading()
        wx.showToast({
          title: '数据加载出错',
        })
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