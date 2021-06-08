// Companypackage/qualification/qualification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 文案更新时间
    updatetime: '',
    // 默认介绍
    introduce: '邦房团结南路店成立于2017年3月份，至今已运营两年，获得无数业主及客户的认可，我们公司的核心价值观：诚信，利他，高效，专业，励志成为您身边的房产专家。'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.CompanyInfo()
  },
  CompanyInfo(){
    wx.showToast({
      title: '数据加载中...',
    })
    const db=wx.cloud.database();
    db.collection('CompanyInfo')
    .field({
      introduce: true,
      updatetime: true
    }).get({
      success:res=>{
        wx.hideToast();
        if (res.errMsg == "collection.get:ok") {
          if(res.data.length>0){
            this.setData({
                introduce: res.data[0].introduce,
                updatetime: res.data[0].updatetime
            })
          }
        }
      },
      fail:err=>{
        wx.hideLoading()
      }
    })
  }
})