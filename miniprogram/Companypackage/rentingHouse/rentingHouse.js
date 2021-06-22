// Companypackage/newHouse/newHouse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HouseStyleList: [{
      text: '所有户型',
      value: '0'
    }, {
        text: '一居室',
        value: '一居室'
    },
    {
        text: '两居室',
        value: '二居室'
    },
    {
        text: '三居室',
        value: '三居室'
    },
    {
        text: '四居室',
        value: '四居室'
    },
    {
        text: '五居室',
        value: '五居室'
    }
    ],
    HousingPriceList: [
      {
        text: '所有价格',
        value: { 'min': 0, 'max': 0, 'HousePrice': '所有价格' }
      }, {
          text: '0-1000',
          value: { 'min': 0, 'max': 1000}
      },
      {
          text: '1000-2000',
          value: { 'min': 1000, 'max': 2000 }
      },
      {
          text: '2000-3000',
          value: { 'min': 2000, 'max':3000}
      },
      {
          text: '3000以上',
          value: { 'min': 3000, 'max': 100000}
      }
      ],
    // 户型
    RoomStyle: '0',
    // 价格区间
    RoomPrice:{ 'min': 0, 'max': 0, 'HousePrice': '所有价格' },
    HousePrice: '',
    // 查询到的数据
    HouseList: [],
    // 默认数据总数
    total: 0,
    // 默认查询第一页
    page: 0,
    // 显示数据加载结束
    showEnd: false,
    // 搜索类型,默认为query，即搜索全部
    type: 'query'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page=this.data.page;
    let type=this.data.type;
    //获取总数
    this.getTotal();
    //获取房源列表
    this.QueryHose(page, type)
  },
  //获取总数
  getTotal(){
    const db=wx.cloud.database();
    db.collection('RentingHouse').count({
      success:res=>{
        if (res.errMsg == "collection.count:ok") {
          this.setData({
            total:res.total
          })
        }
      },
      fail:err=>{}
    })
  },
  QueryHose(page,type){
    wx.showToast({
      title: '加载中...',
      icon:'none'
    })
    let HouseList = this.data.HouseList
    let min = this.data.RoomPrice['min']
    let max = this.data.RoomPrice['max']
    let RoomStyle = this.data.RoomStyle;
    wx.cloud.callFunction({
      name:'HouseInfo',
      data:{
        type: type,
        key: 'RentingHouse',
        page: page,
        min: min,
        max: max,
        RoomStyle: RoomStyle
      },
      success:res=>{
        console.log(res)
        if(res.errMsg=='cloud.callFunction:ok'){
          if(res.result.list.length>0){
            let data=res.result.list;
            let arrt=[];
            data.forEach(n=>{
              let obj={};
              Object.assign(obj,n.FormData,{EntrustType:'sale',photoPic:n.photoInfo[0],title:n.title,id:n.ID})
              arrt.push(obj);
            })
            console.log(arrt)
            this.setData({
              HouseList:arrt,
              type
            })
          }else{
            this.setData({
              HouseList:[],
              type
            })
          }
        }else{
          this.setData({
            HouseList:[]
          })
        }
      },
      fail:err=>{
        console.log(err)
        this.setData({
          HouseList:[]
        })
      }
    })
  },
  //顶部选择
  _handChange(e){
    let value=e.detail;
    var type=value=='0'?'query':'housetype';
    this.setData({
      page:0,
      RoomStyle:value
    })
    //获取总数
    this.getTotal();
    //获取房源列表
    this.QueryHose(this.data.page, type)
  },
  toUrl(e){
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../rentingHouseDetail/rentingHouseDetail?id='+id,
    })
  },
  //价格变化
  _handchangePrice(e){
    let key=e.detail;
    if (key['min'] == 0 && key['max'] == 0) {
      var type = 'query'
    } else {
        var type = 'houseprice'
    }
    this.setData({
      RoomPrice: key,
      page:0
    })
    this.QueryHose(this.data.page, type)
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
    this.QueryHose(this.data.page, this.data.type)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page++
    })
    this.QueryHose(this.data.page, this.data.type)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})