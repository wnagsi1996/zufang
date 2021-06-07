// Companypackage/mycollection/mycollection.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
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
  _hankDel(event){
    console.log(event)
    const { position, instance } = event.detail;
    const {id}=event.currentTarget.dataset;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          context:this,
          message: '确定删除吗？',
        }).then(() => {
          const db=wx.cloud.database();
          db.collection('Collections').where({
            _id:id
          }).remove({
            success:res=>{
              if (res.errMsg == 'collection.remove:ok') {
                if (res.stats.removed > 0) {
                  let openid = this.data.openid;
                  this.getCollection(openid);
                }else{
                  wx.showToast({
                    title: '删除失败',
                    icon:'none'
                  })
                }
              }else{
                wx.showToast({
                  title: '网络错误,请返回重新打开',
                  mask: true,
                  icon: 'none'
               })
              }
            },
            fail:err=>{
              wx.showToast({
                title: '网络错误,请返回重新打开',
                mask: true,
                icon: 'none'
              })
            }
          })
          instance.close();
        }).catch(()=>{
          instance.close();
        })
        break;
    }
  },
  toUrl(e){
    const id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../houseDetail/houseDetail?id='+id,
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