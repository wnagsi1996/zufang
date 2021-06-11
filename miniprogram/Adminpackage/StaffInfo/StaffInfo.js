// Adminpackage/StaffInfo/StaffInfo.js
const {formatTime} =require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否显示添加编辑
    showEdit:false,
    //用户列表
    userList:[],
    //默认总数
    total:0,
    //页码
    page:0,
    //表单
    form:{
      name:'',
      phone:'',
      _id:'',
      updatetime:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let page = this.data.page
    this.DocCount()
    this.StaffList(page)
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
    let page=0;
    this.setData({
      page:0
    })
    this.StaffList(page)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page=this.data.page;
    let userList=this.data.userList;
    let total=this.data.total;
    if(total>userList.length){
      page++
      this.setData({
        page:page
      })
      this.StaffList(page)
    }
  },

  DocCount(){
    const db=wx.cloud.database();
    db.collection('ContactList')
    .count({
      success:res=>{
        if (res.errMsg == "collection.count:ok") {
          this.setData({
            total:res.total
          })
        }else{}
      },
      fail:err=>{}
    })
  },
  StaffList(page){
    wx.showLoading({
      title: '加载员工信息...',
    })
    const db=wx.cloud.database();
    db.collection('ContactList')
    .orderBy('updatetime', 'desc')
    .skip(page)
    .limit(10)
    .get({
      success:res=>{
        wx.hideLoading()
        console.log(res)
        if(res.errMsg=='collection.get:ok'){
          let data=res.data
          if(res.data.length>0){
            this.setData({
              userList:[...this.data.userList,...data]
            })
          }
        }
      },
      fail:err=>{
        console.log(err)
        wx.hideLoading()
      }
    })
  },
  //删除
  _handClose(e){
    let id=e.detail.name;
    let position=e.detail.position;
    let instance=e.detail.instance;
    let userList=this.data.userList;
    let user=userList.find(n=>n._id==id);
    if(position=='right'){
      wx.showModal({
        title: "删除提示",
        content:`您确定删除${user.name}员工的信息吗？删除后不可恢复`,
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
              name:'Manager',
              data:{
                type: 'delete-staff',
                ID: id,
                name: user.name,
                phone: user.phone
              },
              success:res=>{
                wx.hideLoading();
                if (res.errMsg == "cloud.callFunction:ok") {
                  if(res.result.stats.removed>0){
                    wx.showToast({
                      title: '删除成功',
                      icon:'none'
                    })
                    this.setData({
                      userList:userList.filter(n=>n._id!=id),
                      total:this.data.total-1
                    })
                  }else{
                    wx.showToast({
                      title: '删除失败',
                      icon:'none'
                    })
                    
                  }
                }else{
                  nstance.close();
                  wx.showToast({
                    title: '删除失败',
                    icon:'none'
                  })
                }
               
              },
              fail:err=>{
                wx.hideLoading();
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
  InputData(e){
    let key=e.currentTarget.dataset.key;
    let form=this.data.form;
    form[key]=e.detail.value;
    this.setData({
      form
    })
  },
  _handShowAdd(){
    this.setData({
      showEdit:true
    })
  },
  _handCancel(){
    let form=this.data.form;
    Object.keys(form).forEach(item=>{
      form[item]='';
    })
    this.setData({
      showEdit:false,
      form
    })
  },
  _handEdit(e){
    let item=e.currentTarget.dataset.item
    let form=Object.assign(this.data.form,item);
    this.setData({
      showEdit:true,
      form
    })
  },
  _handSave(){
    let {name,phone,updatetime,_id}=this.data.form
    if(name==''){
      wx.showToast({
        title: '姓名不能为空',
      })
      return
    }
    if(phone==''){
      wx.showToast({
        title: '手机号码',
      })
      return
    }
    let txt='';
    if(_id==''){
      var type='add-staff';
      txt="添加"
    }else{
      var type='edit-staff'
      txt="编辑"
    }
    wx.showLoading({
      title: `${txt}中...`,
    })

    wx.cloud.callFunction({
      name:'Manager',
      data:{
        ID:_id,
        type,
        name,
        phone,
        updatetime: formatTime(new Date())
      },
      success:res=>{
        console.log(res)
        wx.hideLoading()
        if (res.errMsg == "cloud.callFunction:ok") {
          if(_id==''){
            if (res.result.errMsg == 'collection.add:ok') {
              wx.showToast({
                title: `${txt}成功`,
              })
              this.setData({
                total:0,
                page:0,
                userList:[],
                showEdit:false
              })
              this.DocCount();
              this.StaffList(0)
            }else{
              wx.showToast({
                title: `${txt}失败`,
              })
            }
          }else{
            if (res.result.errMsg == 'collection.update:ok' && res.result.stats.updated==1) {
              wx.showToast({
                title: `${txt}成功`,
              })
              this.setData({
                total:0,
                page:0,
                userList:[],
                showEdit:false
              })
              this.DocCount();
              this.StaffList(0)
            }else{
              wx.showToast({
                title: `${txt}失败`,
              })
            }
          }
          
        }else{
          wx.showToast({
            title: `${txt}失败`,
          })
        }
      },
      fail:err=>{
        wx.showToast({
          title: `${txt}失败`,
        })
      }
    })
  }
})