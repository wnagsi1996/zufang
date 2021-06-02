//检测是否登录
const isLogin=()=>{
  let userInfo=wx.getStorageSync('userInfo');
  if(!userInfo){
    wx.removeStorageSync('userInfo')
  }
}

//获取是否权限设置
const isGetting=(info)=>{
  wx.getSetting().then(res=>{
    if(res.authSetting(info)){
      if(info=='userInfo'){
        this.getUserInfo()
      }else if(info='userLocation'){
        //定位
      }
    }else{
      
    }
  })
}

//获取用户信息
const getUserInfo=()=>{
  wx.getUserInfo().then(res=>{
    var userInfo = res.userInfo
    wx.setStorageSync('userInfo', userInfo)
    // var nickName = userInfo.nickName
    // var avatarUrl = userInfo.avatarUrl
    // var gender = userInfo.gender //性别 0：未知、1：男、2：女
    // var province = userInfo.province
    // var city = userInfo.city
    // var country = userInfo.country
  })
}


//自动登录
const autoLogin=()=>{

}