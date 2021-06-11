// Adminpackage/PublishedDetail/PublishedDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let id=options.id
    this.setData({
      id
    })
    this.EntrustDetail(id)
  },
  EntrustDetail(id){
    wx.showLoading({
      title: '查询中...',
    })
    wx.cloud.callFunction({
      name:'Entrust',
      data:{
        type:'EntrustDetail',
        id
      },
      success:res=>{
        console.log(res)
        wx.hideLoading()
        if(res.result.data.length>0){
          this.setData({
            detailData:res.result.data[0]
          })
        }else{
          wx.navigateBack()
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  //修改
  _handChangePublish(){
    wx.showModal({
      title:'修改提示',
      content:'修改房源信息将会把已经发布和推荐到首页的房源撤下来,需要重新审核发布才能使客户搜索到,是否确定进行修改?',
      confirmText: '确定修改',
      cancelText: '取消',
      mask: true,
      success:res=>{
        if (res.confirm) {
          this.DoChange()
      }
      }
    })
  },
  DoChange(){
    wx.showLoading({
      title: '正在撤销发布...',
      mask: true
    })
    let id=this.data.id;
    let publishPlate=this.data.detailData.publishPlate;
    console.log(publishPlate)
    console.log(id)
    wx.cloud.callFunction({
      name:'PublishEntrust',
      data:{
        type:'changeEntrust',
        ID:id,
        publishPlate,
      },
        success:res=>{
          console.log(res)
          if (res.errMsg == "cloud.callFunction:ok") {
            wx.hideLoading()
            if (res.result.errMsg == 'collection.update:ok' && res.result.stats.updated > 0) {
              wx.showModal({
                title:'提示',
                content: '成功把该已审核发布的房源撤下来,是否马上对该房源的信息进行修改?',
                confirmText: '马上修改',
                cancelText: '取消',
                mask: true,
                success:res=>{
                  if (res.confirm) {
                    wx.navigateTo({
                        url: `../../Adminpackage/EntrustDetail/EntrustDetail?id=${id}`,
                    })
                  } else {
                      // 返回委托列表
                      wx.navigateBack()
                  }
                },
                fail:err=>{}
              })
            }
          }else{
            wx.hideLoading();
            wx.showToast({
              title: '撤销失败',
            })
          }
        },fail:err=>{
          console.log(err)
          wx.hideLoading();
          wx.showToast({
            title: '撤销失败',
          })
        }
      }
    )
  },
  _handDel(){
    wx.showModal({
      title: '删除提示',
      content: '房源信息一旦删除,与之有关的所有信息都会被删除,并且不能恢复,是否确定继续删除?',
      confirmText: '确定删除',
      confirmColor: '#ff0080',
      cancelText: '取消',
      mask: true,
      success:res=>{
        if (res.confirm) {
          // 删除照片
          this.DeleteImages()
        }
      }
    })
  },
  DeleteImages(){
    wx.showLoading({
      title: '删除关联照片...',
      mask: true
    })
    let images=this.data.detailData.photoInfo;
    wx.cloud.deleteFile({
      fileList:images,
      success:res=>{
        wx.hideLoading();
        console.log(res)
        // 图片删除成功
        if (res.errMsg == "cloud.deleteFile:ok") {
          // 删除该房源
          this.DoDeleteHouse()
      } else {
          wx.showToast({
              title: '图片删除失败,房源删除失败',
              mask: true,
              icon: 'none'
          })
      }
      }
    })
  },
  DoDeleteHouse(){
    wx.showLoading({
      title: '删除相关信息...',
      mask: true
    })
    let id=this.data.id;
    let publishPlate=this.data.detailData.publishPlate;
    wx.cloud.callFunction({
      name:'PublishEntrust',
      data:{
        type:'deleteEntrust',
        ID:id,
        publishPlate,
      },
        success:res=>{
          wx.hideLoading()
          console.log(res)
          if (res.errMsg == "cloud.callFunction:ok") {
            if (res.result.stats.removed > 0 && res.result.errMsg == 'collection.remove:ok') {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack()
            }else{
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                mask: true
              })
            }
          }else{
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              mask: true
            })
          }
        },
        fail:err=>{
          wx.hideLoading()
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            mask: true
          })
        }
      }
    )
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