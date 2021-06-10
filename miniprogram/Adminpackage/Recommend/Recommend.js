// Adminpackage/Recommend/Recommend.js
const { formatTime } = require("../../utils/util.js")
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 查询到的数据
    HouseList: [],
    // 默认数据总数
    total: 0,
    // 默认查询第一页
    page: 0,
    // 显示列表
    showlist: false,
    // 推荐指数，默认为1
    weight: 1,
    // 显示模态窗
    showModal: false,
    id:'',//选中ID
    // 默认表单数据
    formdata: {
        'ID': '',
        'Isrecommend': false,
        'updateTime': '',
        'weight': '',
        'recommender': ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.DocCount()
    this.GetHouseList()
  },
   // 查询数据总数
   DocCount() {
    const db=wx.cloud.database();
    db.collection('Entrust').where({
      publish:true
    }).count({
      success:res=>{
        if (res.errMsg == "collection.count:ok") {
          that.setData({
              total: res.total
          })
       } else { }
      },
      fail:err=>{}
    })
   },
   //查询列表
   GetHouseList(){
    const db=wx.cloud.database();
    db.collection('Entrust')
    .orderBy('recommendData.weight', 'desc')
    .where({
      publish:true
    })
    .skip(this.data.page)
    .limit(10)
    .field({
      _id: true,
      photoInfo: true,
      title: true,
      recommendData: true,
      'FormData.area': true,
      'FormData.roomStyle': true,
      'FormData.houseStyle': true,
      'FormData.location': true
    })
    .get({
      success:res=>{
        console.log(res)
        if(res.errMsg=='collection.get:ok'){
          if(res.data.length>0){
            this.setData({
              HouseList:res.data
            })
          }
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
   },
   //推荐点击
   _handTj(e){
    let id=e.currentTarget.dataset.id;
    let HouseList=this.data.HouseList;
    let House=HouseList.find(n=>n._id==id);
    let HouseIndex=HouseList.findIndex(n=>n._id==id);
    if(House.recommendData.Isrecommend){
      Dialog.confirm({
        title: '撤销推荐提示',
        message: '确认撤销该房源首页推荐?',
      })
        .then(() => {
          wx.showLoading({
            title: '正在撤销推荐...',
          })
         wx.cloud.callFunction({
           name:'PublishEntrust',
           data:{
            type: 'recommend',
            ID:id,
            updateTime:'',
            weight:0,
            recommender:'',
            Isrecommend:false
           },
           success:res=>{
            wx.hideLoading()
             console.log(res)
             if(res.result.stats.updated==1){
              HouseList[HouseIndex].recommendData={
                Isrecommend:false,
                recommender:'',
                updatetime:'',
                weight:0
              }
              this.setData({
                HouseList
              })
             }else{
               wx.showToast({
                 title: '取消失败!',
               })
             }
              
           },
           fail:err=>{
            wx.hideLoading()
            console.log(err)
            
           }
         })
        })
        .catch(() => {
          // on cancel
        });
    }else{
      Dialog.confirm({
        title: '设置推荐提示',
        message: '确认设置该房源首页推荐?',
      }).then(() => {
        this.setData({
          id,
          showModal:true
        })
      }).catch(()=>{

      })
    }
   },
   _handNum(e){
    this.setData({
      weight: e.currentTarget.dataset.id
    })
   },
   _handSubmit(){
    let id=this.data.id;
    let weight=this.data.weight;
    let HouseList=this.data.HouseList;
    let House=HouseList.find(n=>n._id==id);
    let HouseIndex=HouseList.findIndex(n=>n._id==id);
    wx.showLoading({
      title: '推荐提交中...',
    })
    let time=formatTime(new Date());
    let name=wx.getStorageSync('userInfo').name
    wx.cloud.callFunction({
      name:'PublishEntrust',
      data:{
        type: 'recommend',
        ID:id,
        updateTime:formatTime(new Date()),
        weight:weight,
        recommender:name,
        Isrecommend:true
       },
       success:res=>{
         console.log(res)
         wx.hideLoading()
         if(res.result.stats.updated==1){
          HouseList[HouseIndex].recommendData={
            Isrecommend:true,
            recommender:name,
            updatetime:time,
            weight:weight
          }
          this.setData({
            HouseList
          })
         }else{
           wx.showToast({
             title: '推荐成功!',
           })
         }

       },
       fail:err=>{
        wx.hideLoading()
        wx.showToast({
          title: '推荐失败!',
          icon:'none'
        })
         console.log(err)
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
    this.setData({
      page:0
    })
    this.GetHouseList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page++
    })
    this.GetHouseList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})