// Companypackage/houseDetail/houseDetail.js
import {formatTime} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseImages: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 1500,
    duration: 500,
    // 房子信息
    // 渲染详细列表
    DetialList: [
        {
            'id': 'area',
            'title': '产权面积(单位:㎡)',
            'value': ''
        },
        {
            'id': 'totalPrice',
            'title': '外标价位(单位:万元)',
            'value': ''
        },
        {
            'id': 'location',
            'title': '所属小区',
            'value': ''
        },
        {
            'id': 'detailLocation',
            'title': '房源地址',
            'value': ''
        },
        {
            'id': 'HouseType',
            'title': '房子状况',
            'value': ''
        },
        {
            'id': 'houseStyle',
            'title': '房子类型',
            'value': ''
        },
        {
            'id': 'furniture',
            'title': '装修配置',
            'value': ''
        },
        {
            'id': 'Tags',
            'title': '房子优势',
            'value': ''
        },
        {
            'id': 'LookUpStyle',
            'title': '看房方式',
            'value': ''
        },
        {
            'id': 'Invoice',
            'title': '契税发票时间是否满两年',
            'value': ''
        },
        {
            'id': 'Signing',
            'title': '网签是否满三年',
            'value': ''
        },
        {
            'id': 'updateTime',
            'title': '最近发布',
            'value': ''
        }
    ],
    // 是否已收藏，默认为否
    HasCollection: false,
    show:false,
    actions:[
      {name:'联系经纪人'},
      {name:'联系在线客服'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;console.log(id)
    let userInfo=wx.getStorageSync('userInfo');
    let openid=userInfo.openid;
    this.setData({
      id,
      openid
    })
    this.HoseDettail(id);
    this.HasCollection(openid,id)
  },
  HoseDettail(id){
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    const db=wx.cloud.database();
    db.collection('Entrust').where({
      _id:id
    }).field({
      _id: false,
      _openid: false,
      EntrustType: false,
      checkedBy: false,
      checkedTime: false,
      publish: false,
      publishTime: false,
      'FormData.name': false,
      'FormData.phonenumber': false
    }).get({
      success:res=>{
        wx.hideLoading();
        if (res.errMsg == "collection.get:ok") {
          if (res.data.length > 0) {
            //处理数据
            this.setlistData(res.data[0])
          }else{
            wx.showToast({
              title: '数据加载出错,返回重新打开',
              icon:'none'
            })
            wx.navigateBack()
          }
        }else{
          wx.showToast({
            title: '数据加载出错,返回重新打开',
            icon:'none'
          })
          wx.navigateBack()
        }
      },
      fail:err=>{
        wx.showToast({
          title: '数据加载出错,返回重新打开',
          icon:'none'
        })
        wx.navigateBack()
      }
    })
  },
  //处理数据
  setlistData(data){
    
    let {FormData,charge,photoInfo,updateTime,title}=data;
    let {totalPrice,averagePrice,houseStyle,location,Tags}=FormData;
    let DetialList=this.data.DetialList;
    for(let key in FormData){
      
      for(let i=0;i<DetialList.length;i++){
        if(DetialList[i].id==key){
          DetialList[i].value=FormData[key]
        }
        if(DetialList[DetialList.length-1].id=='updateTime'){
          DetialList[DetialList.length - 1].value = updateTime
        }
      }
    }
    let phone=charge.phone.replace(charge.phone.substring(3,7),"****");
    this.setData({
      title: title,
      houseImages: photoInfo,
      charge: charge,
      totalPrice: totalPrice,
      averagePrice: averagePrice,
      houseStyle: houseStyle,
      location: location,
      Tags: Tags,
      displayPhone: phone,
      DetialList: DetialList,
    })
  },
  //是否收藏
  HasCollection(openid,id){
    const db=wx.cloud.database();
    db.collection('Collections').where({
      _openid: openid,
      ID: id
    }).count().then(res=>{
      console.log(res)
      if(res.errMsg=='collection.count:ok'){
        this.setData({
          HasCollection:res.total==0?false:true
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  //点击收藏
  _handCollection(){
    const db=wx.cloud.database();
    if(this.data.HasCollection){
      db.collection('Collections').where({
        ID:this.data.id,
        _openid:this.data.openid
      }).remove().then(res=>{
        console.log(res)
        if(res.errMsg=='collection.remove:ok'){
          if(res.stats.removed==1){
            this.setData({HasCollection:false})
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    }else{
      
      db.collection('Collections').add({
        data:{
          ID:this.data.id,
          title:this.data.title,
          houseStyle:this.data.houseStyle,
          location:this.data.location,
          houseImages:this.data.houseImages,
          type: 'sale',
          updateTime:formatTime(new Date())
        },
        success:(res)=>{
          console.log(res)
          if(res._id){
            wx.showToast({
              title: '已收藏',
            })
            this.setData({HasCollection:true})
          }
        },
        fail:(err)=>{
          console.log(err)
        }
      })
    }
  },
  //拨打电话
  _handPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.charge.phone,
      success:()=>{ },
        fail:()=>{}
    })
  },
  _handYY(){
    this.setData({ show: true });
  },
  onSelect(e){
    if(e.detail.name=='联系经纪人'){
      wx.makePhoneCall({
        phoneNumber: this.data.charge.phone,
        success:()=>{ },
        fail:()=>{}
      })
    }else{
      wx.showToast({
        title: '提示:请直接点击 “个人中心” 页面的客服按钮,即可连通在线客服',
        icon:'none'
      })
    }
  },
  onClose(){
    this.setData({ show: false });
  }

})