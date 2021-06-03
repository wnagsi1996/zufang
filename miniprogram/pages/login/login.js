// miniprogram/pages/login/login.js
const UTIl=require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    mobile:'',
    isReigShow:false,
    disabled:false
  },
  getUserInfo(e){
    let userInfo=e.detail.userInfo;
    let nickName = userInfo.nickName
    let avatarUrl = userInfo.avatarUrl
    let gender = userInfo.gender //性别 0：未知、1：男、2：女
    let province = userInfo.province
    let city = userInfo.city
    let country = userInfo.country
    let userData = {
      userInfo,
      nickName,
      avatarUrl,
      gender,
      province,
      city,
     country
    }
    wx.cloud.callFunction({
      name:'InitInfo',
      data:{
        type:'INIT'
      },
      success:res=>{
        console.log(res);
        let result=res.result.data;
        if(result.length>0){
          userData['openid'] = result[0]._openid
          userData['name'] = result[0].name
          userData['phone'] = result[0].phone
          userData['address'] = result[0].address
          this.setData({
            userInfo:userData
          })
          wx.setStorageSync('userInfo', userData);
          wx.setStorageSync('isphone', true);
          wx.navigateBack();
        }else{
          wx.showToast({
            title: '请完善您的信息',
          })
          this.setData({
            userInfo:userData,
            isReigShow:true
          })
          wx.setStorageSync('isphone', false);
          wx.setStorageSync('userInfo', userData);
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  _hankuserName(e){
    this.setData({
      userName:e.detail
    })
  },
  _hankMobile(e){
    this.setData({
      mobile:e.detail
    })
  },
  login(){
    let userName=this.data.userName;
    let mobile=this.data.mobile;
    if(userName==''){
      wx.showToast({
        title: '用户名不能为空',
        icon:'none'
      })
      return;
    }
    if(mobile==''){
      wx.showToast({
        title: '手机号码不能为空',
        icon:'none'
      })
      return;
    }else if(!UTIl.mobie.test(mobile)){
      wx.showToast({
        title: '手机号码格式错误',
        icon:'none'
      })
      return ;
    }
    wx.showLoading();
    
    let userInfo=this.data.userInfo;console.log(userInfo)
    const db=wx.cloud.database();
    db.collection('UserList').add({
      data:{
        name: userName,
        phone: mobile,
        address: '',
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        mamager: false
      }
    }).then(res=>{
      wx.hideLoading()
      if (res.errMsg == "collection.add:ok") {
        wx.showToast({
          title: '恭喜,注册成功！',
          duration: 1000
        })
        userInfo.name=userName;
        userInfo.phone=mobile;
        // 保存成功，更新本地缓存
        wx.setStorageSync('userInfo', userInfo);
        wx.setStorageSync('isphone', true);
        //后退
        wx.navigateBack();
      }else{
        // 提示网络错误
        wx.showToast({
          title: '网络错误，注册失败，请检查网络后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '网络错误，注册失败，请检查网络后重试！',
        icon: 'none',
        duration: 2000
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo');
    let isphone=wx.getStorageSync('isphone');
    //是否获取过用户信息
    if(userInfo){
      //是否已经完善用户信息
      if(isphone){
        wx.navigateBack()
      }else{
        this.setData({
          isReigShow:true,
          userInfo:userInfo
        })
        wx.showToast({
          title: '请完善您的信息',
        })
      }
    }
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