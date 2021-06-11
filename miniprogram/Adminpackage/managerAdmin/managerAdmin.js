// Adminpackage/managerAdmin/managerAdmin.js
const {formatTime} =require('../../utils/util')
import QR from '../weapp-qrcode/qrcode'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showlist: true,
    showCode: false,
    //权限是否够
    IsAuthor: false,
    // 管理员列表
    UserList: [],
    // 二维码内容
    qrcodeURL: "",
    // 显示失效
    QrcodeStats:false
  },
  //检查管理员权限
  AdminInfo(){
    wx.showLoading({
      title: '校验管理员权限',
    })
    let userInfo=wx.getStorageSync('userInfo');
    let name=userInfo.name;
    wx.cloud.callFunction({
      name:'AdminManage',
      data:{
        type:'adminInfo'
      },
      success:res=>{
        wx.hideLoading()
        if (res.errMsg == 'cloud.callFunction:ok') {
          if (res.result.data.length > 0) {
              if (res.result.data[0].level === 0 && res.result.data[0].name === name) {
                  this.setData({
                      IsAuthor: true
                  })
                  // 获取管理员列表
                  this.AdminList()
              }
          }
      }
      },
      fail:err=>{
        wx.hideLoading()
      }
    })
  },
  //获取管理员列表
  AdminList(){
    wx.showLoading({
      title: '获取管理员列表',
    })
    wx.cloud.callFunction({
      name:'AdminManage',
      data:{
        type:'AdminList'
      },
      success:res=>{
        wx.hideLoading()
        console.log(res)
        if(res.errMsg=='cloud.callFunction:ok'){
          if (res.result.data.length) {
            console.log(res.result.data)
            this.setData({
                UserList: res.result.data
            })
          }
        }
      },
      fail:err=>{
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  _handClose(e){
    let id=e.detail.name._id;
    let openid=e.detail.name._openid;
    let position=e.detail.position;
    let instance=e.detail.instance;
    let userList=this.data.UserList;
    let user=userList.find(n=>n._id==id);
    if(position=='right'){
      wx.showModal({
        title: "删除提示",
        content:`您确定删除${user.name}管理员的信息吗？删除后不可恢复`,
        confirmText: '确定删除',
        confirmColor: '#FA805C',
        cancelText: '取消',
        cancelColor: '#7CCD7D',
        success:res=>{
          
          if (res.confirm) {
            wx.showLoading({
              title: '删除中...',
            })
            wx.cloud.callFunction({
              name:'AdminManage',
              data:{
                type: 'delete-admin',
                ID: id,
                openid: openid,
                name: user.name,
                phone: user.phone
              },
              success:res=>{
                wx.hideLoading();
                if (res.errMsg == "cloud.callFunction:ok") {
                  if (res.result.errMsg == 'collection.remove:ok') {
                      if (res.result.stats === -999) {
                          // 不能删除自己
                          wx.showToast({
                            title: '不能删除自己',
                            icon:'none'
                          })
                      }
                      if (res.result.stats === -100) {
                          // 权限不足
                          wx.showToast({
                            title: '权限不足',
                            icon:'none'
                          })
                      }

                      if (res.result.stats > 0) {
                          // 删除成功
                          wx.showToast({
                            title: '删除成功',
                            icon:'none'
                          })
                          // 初始化列表
                          this.setData({
                              AdminList: []
                          })
                          // 刷新列表
                          this.AdminList()
                      }

                  } else {
                      // 删除失败
                      wx.showToast({
                        title: '删除成功',
                        icon:'none'
                      })
                  }
              } else {
                  // 删除失败
                  wx.showToast({
                    title: '删除成功',
                    icon:'none'
                  })
              }
              },
              fail:err=>{
                wx.hideLoading();
                wx.showToast({
                  title: '删除成功',
                  icon:'none'
                })
              }
            })
          }
        },fail:err=>{
        }
      })
      instance.close();
    }else{
      instance.close();
    }
  },
  qrcode(value){
    var imgData = QR.drawImg(value, {
      typeNumber: 3, //码点大小 1-40，数字越大，码点越小，二维码会显得越密集
      errorCorrectLevel: 'H', //纠错等级 H等级最高(30%) 简单来说，就是二维码被覆盖了多少仍然能被识别出来 详见qrcode.js
      size: 500
    })
    this.setData({
        qrcodeURL: imgData
    })
  },
  _handShowAdd(){
    wx.showLoading({
      title: '获取二维码...',
      mask: true
    })
    wx.cloud.callFunction({
      name:'AdminManage',
      data:{
        type:'qrcode',
        updatetime: formatTime(new Date())
      },
      success:res=>{
        wx.hideLoading()
        console.log('res', res)
        if (res.errMsg == "cloud.callFunction:ok") {
          let data = res.result.data;
          if (data.id && !data.stats && data.code) {
            this.qrcode(JSON.stringify(data))
              // 设置二维码的值并显示
              this.setData({
                  QrcodeStats: true,
                  showCode: true
              })
              // 开始监听二维码状态
              // that.QrcodeStats(data.id)
          } else {
            wx.showToast({
              title: '网络错误,获取失败',
            })
            
          }
      } else {
        wx.showToast({
          title: '网络错误,获取失败',
        })
      }
      },
      fail:err=>{
        console.log(err)
        wx.showToast({
          title: '网络错误,获取失败',
        })
      }
    })
  },
  _handBack(){
    this.setData({
      showCode:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.AdminInfo()
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