// Adminpackage/companyInfo/companyInfo.js
const { formatTime } = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 照片列表
    imgList: [],
    CompanyData: {
        '_id': '',
        'introduce': '',
        'notice': '',
        'editer': '',
        'phone': '',
        'updatetime': ''
    },
    // 字数
    length: 0
  },
  CompanyInfo(){
    wx.showLoading({
      title: '数据获取中...',
    })
    const db=wx.cloud.database();
    db.collection('CompanyInfo')
    .get({
      success:res=>{
        console.log(res)
        wx.hideLoading();
        if(res.errMsg=='collection.get:ok'){
          if(res.data.length>0){
            let CompanyData=this.data.CompanyData
            Object.assign(CompanyData,res.data[0])
            this.setData({
              CompanyData
            })
          }
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  _handInp(e){
    let key=e.currentTarget.dataset.key
    let CompanyData=this.data.CompanyData
    CompanyData[key]=e.detail.value
    this.setData({
      CompanyData
    })
  },
  _handSave(){
    let {_id,introduce,notice}=this.data.CompanyData;
    let userInfo=wx.getStorageSync('userInfo');
    let name=userInfo.name;
    let phone=userInfo.phone;
    wx.showLoading({
      title: '保存中...',
    })
    wx.cloud.callFunction({
      name:'Manager',
      data:{
        ID: _id,
        type: 'update-company',
        editer: name,
        introduce: introduce,
        notice: notice,
        phone: phone,
        updatetime: formatTime(new Date())
      },
      success:res=>{
        wx.hideLoading()
        if (res.errMsg == "cloud.callFunction:ok") {
          if (res.result.errMsg == 'collection.update:ok' && res.result.stats.updated > 0) {
              // 添加成功
              wx.showToast({
                title: '修改成功',
              })
          } else {
              // 添加失败
              wx.showToast({
                title: '修改失败',
                icon:'none'
              })
          }
      } else {
          // 添加失败
          wx.showToast({
            title: '修改失败',
            icon:'none'
          })
      }
      },
      fail:err=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '修改失败',
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.CompanyInfo()
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