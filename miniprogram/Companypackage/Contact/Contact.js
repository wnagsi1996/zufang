// Companypackage/Contact/Contact.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户列表
    UserList: [],
    // 默认数据总数
    total: 0,
    // 默认查询第一页
    page: 0,
    size:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList()
  },
  getUserList(){
    const db=wx.cloud.database();
    db.collection('ContactList')
    .orderBy('updatetime', 'desc')
    .skip(this.data.page)
    .limit(this.data.size)
    .get({
      success:res=>{
        console.log(res);
        if(res.data.length>0){
          this.setData({
            UserList:[...this.data.UserList,...res.data]
          })
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
    // wx.cloud.callFunction({
    //   name:'Staf',
    //   data:{
    //     page:0,
    //     size:10
    //   },
    //   success:res=>{
    //     console.log(res);
    //   },
    //   fail:err=>{
    //     console.log(err)
    //   }
    // })
  },
  //打电话
  _handPhone(e){
    let phone=e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success:()=>{},
      fail:()=>{}
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
      page:0,
      UserList:[]
    })
    this.getUserList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page++
    })
    this.getUserList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})