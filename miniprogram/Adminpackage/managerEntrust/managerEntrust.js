// Adminpackage/managerEntrust/managerEntrust.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 待审核
    CheckingEntrustList: [],
    // 已发布
    publishedEntrustList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(false)
  },
  getList(type){
    wx.showLoading({
      title: '查询中...',
    })
    wx.cloud.callFunction({
      name:'Entrust',
      data:{
        type: 'AllEntrust',
        IsPublish: type
      },
      success:res=>{
        wx.hideLoading()
        console.log(res);
        if(res.errMsg=='cloud.callFunction:ok'){
          let data=res.result.data
          if(res.result.data.length>0){
            this.setData({
              CheckingEntrustList:data
            })
          }
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})