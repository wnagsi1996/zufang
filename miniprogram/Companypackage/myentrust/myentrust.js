// Companypackage/myentrust/myentrust.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.MyEntrust('sale')
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
  onChange(e){
    let index=e.detail.index
    this.setData({
      active:index
    })
    let key=index==0?'sale':'rentout';
    this.MyEntrust(key)
  },
  MyEntrust(key){
    wx.showToast({
      title: '加载中...',
      icon:'none'
    })
    wx.cloud.callFunction({
      name: 'Entrust',
      data: {
          type: 'MyEntrust',
          key: key
      },
      success:res=>{
       
        if (res.errMsg == "cloud.callFunction:ok") {
          let data=res.result.data;
          if(data.length>0){
            console.log(data)
            this.setData({
              list: data
            })
          }else{
            this.setData({
              list: []
            })
          }
        }else{
          this.setData({
            list: []
          })
        }
      },
      fail:err=>{
        this.setData({
          List: []
        })
      }
    })
  },
  Navigate(e){
    let data=e.currentTarget.dataset.data;
    data=JSON.stringify(data);
    wx.navigateTo({
      url: '../steps/steps?id=myentrust&data='+data,
    })
  }
})