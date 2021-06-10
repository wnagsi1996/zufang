// Adminpackage/EntrustDetail/EntrustDetail.js
const {formatTime} = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:[],
    show:false,
    title:'',  //标题
    async beforeClose(action) {
           if (action === 'confirm') {
             //能用this.data获取data中的数据，这样是获取不到数据的
            	//可以通过微信小程序——getCurrentPages（获取当前页面栈）来获取data
            const pages = getCurrentPages()
            let page = pages[pages.length-1]
            let publishPlateList=['NewHouse', 'SecondHouse', 'RentingHouse'];  //publishPlate
            let itemList= ['新房', '二手房', '租房'];  //plate
            let detailData=page.data.detailData;
            if(detailData.FormData.HouseType=='新房子'){
              var publishPlate=publishPlateList[0]
              var plate=itemList[0]
            }else if(detailData.FormData.HouseType=='二手房'){
              var publishPlate=publishPlateList[1]
              var plate=itemList[1]
            }else{
              var publishPlate=publishPlateList[2]
              var plate=itemList[2]
            }
            let userInfo=wx.getStorageSync('userInfo');
            let {name,phone}=detailData.charge;
            if(name=='' && phone==''){
              detailData.charge={
                name:userInfo.name,
                phone:userInfo.phone
              }
            }
            let bool=false;
            wx.cloud.callFunction({
              name:'PublishEntrust',
              data:{
                type: 'add',
                plate: plate,
                publishPlate: publishPlate,
                checkedBy: userInfo.name,
                title: page.data.title,
                ID: detailData._id,
                charge: detailData.charge,  //负责人
                checkedTime: formatTime(new Date()),
                publishTime: formatTime(new Date()),
                updateTime: formatTime(new Date())
              },
              success:res=>{
                console.log(res)
                wx.showToast({
                  title: '发布成功',
                  icon: 'success',
                  duration: 2000
               })
             setTimeout(() => {
              wx.navigateBack()
             }, 1000);
               bool= true
              },
              fail:err=>{
                console.log(err)
                wx.showToast({
                  title: '发布失败',
                  icon: 'error',
                  duration: 2000
                 })
                 bool= true
              }
            })
            return bool;
           } else {
            return true
             // 拦截取消操作
           }
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    this.EntrustDetail(id)
  },
  EntrustDetail(id){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'Entrust',
      data:{
        type:'EntrustDetail',
        id
      },
      success:res=>{
        wx.hideLoading()
        console.log(res)
        if(res.result.data.length>0){
          this.setData({
            detailData:res.result.data[0]
          })
        }else{
          wx.navigateBack()
        }
      },
      fail:err=>{
        wx.hideLoading();
        wx.navigateBack()
        console.log(err)
      }
    })
  },
  //审核
  _handReview(){
    this.setData({
      show:true
    })
  },
  titleInp(e){
    this.setData({
      title:e.detail
    })
  },
  submit(action){
        let publishPlateList=['NewHouse', 'SecondHouse', 'RentingHouse'];  //publishPlate
        let itemList= ['新房', '二手房', '租房'];  //plate
        let detailData=this.data.detailData;
        if(detailData.FormData.HouseType=='新房子'){
          var publishPlate=publishPlateList[0]
          var plate=itemList[0]
        }else if(detailData.FormData.HouseType=='二手房'){
          var publishPlate=publishPlateList[1]
          var plate=itemList[1]
        }else{
          var publishPlate=publishPlateList[2]
          var plate=itemList[2]
        }
        let userInfo=wx.getStorageSync('userInfo');
        let {name,phone}=detailData.charge;
        if(name=='' && phone==''){
          detailData.charge={
            name:userInfo.name,
            phone:userInfo.phone
          }
        }
    
        wx.cloud.callFunction({
          name:'PublishEntrust',
          data:{
            type: 'add',
            plate: plate,
            publishPlate: publishPlate,
            checkedBy: userInfo.name,
            title: this.data.title,
            ID: detailData._id,
            charge: detailData.charge,  //负责人
            checkedTime: formatTime(new Date()),
            publishTime: formatTime(new Date()),
            updateTime: formatTime(new Date())
          },
          success:res=>{
            console.log(res)
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