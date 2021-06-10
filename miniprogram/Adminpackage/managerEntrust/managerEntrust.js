// Adminpackage/managerEntrust/managerEntrust.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 待审核
    CheckingEntrustList: [],
    // 已发布
    publishedEntrustList: [],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow:function(){
    this.getList(false)
  },
  onChange(e){
    let index=e.detail.index;
    if(index==0){
      this.getList(false)
    }else{
      this.getList(true)
    }
    this.setData({
      index
    })
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
            if(this.data.index==0){
              this.setData({
                CheckingEntrustList:data
              })
            }else{
              this.setData({
                publishedEntrustList:data
              })
            }
          }else{
            this.setData({
              CheckingEntrustList:[],
              publishedEntrustList:[],
            })
          }
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  _handNavigate(e){
    let id=e.currentTarget.dataset.id;
    let type=e.currentTarget.dataset.type;
    let url=type=='unpublished'?'../EntrustDetail/EntrustDetail':'../PublishedDetail/PublishedDetail'
    wx.navigateTo({
      url: `${url}?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})