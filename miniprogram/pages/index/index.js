// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    pageNum:0,  //推荐请求第几页，默认0
    listdata:[],  //推荐数据
    company:'',  //公告
  },
 
  onLoad() {
    this.getQueryHose()
    this.getCompanyInfo()
  },
  //前往计算页面
  goCalculator(){
    wx.navigateTo({
      url: '../../CalculatorPackage/calculator/calculator',
    })
  },
  //获取公告数据
  getCompanyInfo(){
    const db=wx.cloud.database();
    db.collection('CompanyInfo')
    .field({
      notice:true
    })
    .get()
    .then(res=>{
      console.log(res)
      if(res.errMsg=='collection.get:ok'){
        if(res.data.length>0){
          this.setData({
            company:res.data[0].notice
          })
        }
      }
    })
    .catch(err=>{
      console.log(err)
    })
  },
  //获取房源列表
  getQueryHose(){
    const db=wx.cloud.database();
    db.collection('Entrust').where({
      publish:true,
    })
    .skip(this.data.pageNum)
    .limit(10)
    .field({
      _id: true,
      title:true,
      EntrustType:true,
      photoInfo:true,
      'FormData.area': true,
      'FormData.Tags': true,
      'FormData.roomStyle': true,
      'FormData.location': true,
      'FormData.totalPrice': true,
      'FormData.averagePrice': true
    })
    .get()
    .then(res=>{
      
      if(res.data.length>0){
        let data=res.data;
        
        let arrt=[];
        data.forEach(n=>{
          let obj={};
          Object.assign(obj,n.FormData,{EntrustType:n.EntrustType,photoPic:n.photoInfo[0],title:n.title,id:n._id})
          arrt.push(obj);
        })
        console.log(arrt)
        this.setData({
          list:arrt
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  toUrl(e){
    let id=e.currentTarget.dataset.id;
    let url=e.currentTarget.dataset.url;
    let entrusttype=e.currentTarget.dataset.entrusttype;
    if(id){
      if(entrusttype=='rentout'){
        wx.navigateTo({
          url: '../../Companypackage/rentingHouseDetail/rentingHouseDetail?id='+id
        })
      }else{
        wx.navigateTo({
          url: '../../Companypackage/houseDetail/houseDetail?id='+id,
        })
      }
      
    }else{
      wx.navigateTo({
        url
      })
    }
   
  }
})
