// miniprogram/Companypackage/saleEntrust/saleEntrust.js
import { formatTime} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏标题
    NavigationBarTitle: '发布委托',
    // 渲染输入框
    InputList: [{
        'id': 'detailLocation',
        'title': '房源地址:',
        'placeholder': '请填写房源详细地址',
        'type': 'text',
        'maxlength': 50
    },
    {
        'id': 'location',
        'title': '所属小区:',
        'placeholder': '如:莲湖区 梨园路',
        'type': 'text',
        'maxlength': 50
    },
    {
        'id': 'furniture',
        'title': '装修配置:',
        'placeholder': '如:有空调、有热水等',
        'type': 'text',
        'maxlength': 50
    },
    {
        'id': 'area',
        'title': '产权面积(单位:㎡):',
        'placeholder': '请填写房子的产权面积',
        'type': 'digit',
        'maxlength': 20
    },
    {
        'id': 'totalPrice',
        'title': '外标价位(单位:万元):',
        'placeholder': '请填写房子的外标价位',
        'type': 'digit',
        'maxlength': 20
    },
    {
        'id': 'name',
        'title': '您的称呼:',
        'placeholder': '请问如何称呼您',
        'type': 'text',
        'maxlength': 8
    },
    {
        'id': 'phonenumber',
        'title': '联系电话:',
        'placeholder': '请输入您的联系电话',
        'type': 'number',
        'maxlength': 11
    }
    ],

    // 渲染选择器
    PickerList: [{
        'id': 'HouseType',
        'title': '房子类型',
        "point":"请选择",
        'pickerlist': ['新房子', '二手房', '其他']
    }, {
        'id': 'LookUpStyle',
        'title': '看房方式',
        "point":"请选择",
        'pickerlist': ['随时看房', '电话预约', '其他']
    }, {
        'id': 'Invoice',
        "point":"请选择",
        'title': '契税发票时间是否满两年',
        'pickerlist': ["是", "否"]
    }, {
        'id': 'Signing',
        "point":"请选择",
        'title': '网签是否满三年',
        'pickerlist': ["是", "否"]
    }],

    // 房型选择列表
    HouseStyleList: [
        {
          values:['0室', '1室', '2室', '3室', '4室', '5室'],
          classNmae:'column1'
        },
        {
          values:['0厅', '1厅', '2厅', '3厅'],
          classNmae:'column2'
        },
        {
          values: ['0卫', '1卫', '2卫', '3卫'],
          classNmae:'column3'
        }
    ],
    // 房型选择结果
    HouseStyleSelected: [0, 0, 0],
    // 委托类型
    EntrustType: '',
    // 表单数据
    FormData: {
        // 详细地址
        'detailLocation': '',
        // 所在小区
        'location': '',
        //装修配置
        'furniture': '',
        // 房子面积
        'area': '',
        // 总价
        'totalPrice': '',
        // 均价
        'averagePrice': '',
        // 委托人姓名
        'name': '',
        // 委托人电话
        'phonenumber': '',
        // 房子标签
        'Tags': [],
        // 房子类型，新房，旧房
        'HouseType': '',
        // 房间类型，如：一室一厅
        'roomStyle': '',
        // 居室类型，如：一居室
        'houseStyle': '',
        // 看房方式
        'LookUpStyle': '',
        // 契税发票时间是否满两年
        'Invoice': '',
        // 网签是否满三年
        'Signing': ''
    },
    // 照片列表
    imgList: [],
    modalName: null,
    // 标签选择
    checkbox: [{
        value: 0,
        name: '近学校',
        checked: false
    }, {
        value: 1,
        name: '近地铁',
        checked: false
    }, {
        value: 2,
        name: '房子新',
        checked: false
    }, {
        value: 3,
        name: '有阳台',
        checked: false
    }, {
        value: 4,
        name: '独立厨房',
        checked: false
    }, {
        value: 5,
        name: '租房保障',
        checked: false
    }, {
        value: 6,
        name: '月租',
        checked: false
    }, {
        value: 7,
        name: '拎包入住',
        checked: false
    }, {
        value: 8,
        name: '精装',
        checked: false
    }, {
        value: 9,
        name: '随时看房',
        checked: false
    }, {
        value: 10,
        name: '押一付一',
        checked: false
    }, {
        value: 11,
        name: '有阳台',
        checked: false
    }],
    // 临时变量
    templeCheckbox: '请选择',
    templeTags: '请选择',
    //弹窗显示隐藏
    popupShow:false,
    //弹窗数据
    columns:[],
    //标签选择器弹窗
    tagShow:false,
    // 多列选择器
    popupDuoShow:false
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //输入数据
  onChange(e){
    let name=e.currentTarget.dataset.name
    let value=e.detail;
    let FormData=this.data.FormData
    FormData[name]=value;
    this.setData({
      FormData
    })
  },
  //显示弹窗
  onPicker(e){
    console.log(e)
    let PickerList=this.data.PickerList;
    let name=e.currentTarget.dataset.name;
    this.setData({
      popupShow:true,
      columns:PickerList.find(n=>n.id==name)
    })
  },
  //关闭弹窗
  onClose(){
    this.setData({
      popupShow:false,
      tagShow:false,
      popupDuoShow:false
    })
  },
  _hankTag(e){
      
      let id=e.currentTarget.dataset.id;
      let checkbox=this.data.checkbox
      let check=checkbox.find(n=>n.value==id);
      let FormData=this.data.FormData;
      if(check.checked){
        check.checked=false;
        FormData.Tags=FormData.Tags.filter(n=>n.value!=id)
      }else{
        if(FormData.Tags.length<4){
          check.checked=true;
          FormData.Tags.push(check)
        }
      }
      Object.assign(checkbox,check);
      let templeTags='';
      if(FormData.Tags.length>0){
        FormData.Tags.forEach(n=>{
          templeTags+=n.name+','
        })
      }

      this.setData({
        templeTags:templeTags!=''?templeTags.substring(0,templeTags.length-1):'请选择',
        checkbox,
        FormData
      })
  },
  //单列确认弹窗
  onConfirm(e){
    let detail=e.detail;
    let {id,point}=this.data.columns;
    let PickerList=this.data.PickerList;
    let FormData=this.data.FormData;
    FormData[id]=detail.value;
    PickerList.forEach(n=>{
      if(n.id==id){
        n.point=detail.value
      }
    })
    this.setData({
      FormData,
      PickerList,
      popupShow:false
    })
  },
  //单击房子优势
  onTagPicker(){
    this.setData({
      tagShow:true
    })
  },
  // 居室
  onHouseStyleListConfirm(e){
    let value=e.detail.value  //roomStyle
    let str='';
    let roomStyle='';
    value.forEach((n,i)=>{
      if(i==0){
        if(n.includes(0) || n.includes(1)){
          roomStyle='1居室'
        }else{
          roomStyle=`${Number.parseInt(n.value)}居室`
        }
      }
      str+=n.includes(0)?'':n
    })
    let FormData=this.data.FormData;
    FormData.houseStyle=str
    FormData.roomStyle=roomStyle
    this.setData({
      templeCheckbox:str==''?'请选择':str,
      FormData,
      popupDuoShow:false
    })
    
  },
  onJsPicker(){
    this.setData({
      popupDuoShow:true
    })
  },
  //图片上传
  afterRead(e){
    const { file } = e.detail;
    let imgList=this.data.imgList;
    imgList.push({url:file.url,name:file.size});
    this.setData({
      imgList
    })
  },
  //删除图片
  delImage(e){
    let file=e.detail.file;
    let imgList=this.data.imgList;
    imgList=imgList.filter(n=> n.name!=file.name);
    this.setData({
      imgList
    })
  },
  submitSend(){
    let FormData=this.data.FormData;console.log(FormData)
    // 计算平均价格
    let averagePrice = (FormData['totalPrice'] * 10000 / FormData['area']).toFixed(2);
    FormData['averagePrice']=averagePrice;
    let imgList=this.data.imgList;
    for(let key in FormData){
      if(FormData[key]==''){
        console.log(FormData[key])
        console.log(key)
        wx.showToast({
          title: '请完善您的信息',
          icon:'none'
        })
        return;
      }
    }
    let tags=FormData.Tags.map(n=> n.name)
    FormData.Tags=tags;
    if(imgList.length==0){
      wx.showToast({
        title: '请上传图片',
        icon:'none'
      });
      return;
    }
    imgList=imgList.map(n=>n.url);
    this.setData({
      newimgList:imgList,
      newFormData:FormData
    })
    this.uploadImage()
  },
  uploadImage(){
    wx.showLoading({
      title: '保存图片...',
      mask: true
    })
    let imglist=this.data.newimgList;
    let imgPathList = []
    for(let i=0;i<imglist.length;i++){
      let fileName = imglist[i];
      let dotPosition = fileName.lastIndexOf('.');
      let extension = fileName.slice(dotPosition);
      let cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${extension}`;
      wx.cloud.uploadFile({
        cloudPath,
        filePath: fileName,
        success:(res)=>{
          wx.hideLoading();
          imgPathList.push(res.fileID)
          if(imgPathList.length==imglist.length){
            // 保存信息
            this.SubmitEntrust(imgPathList)
          }
        },
        fail:(err)=>{
          wx.hideToast();
          wx.showToast({
            title: '图片保存失败',
            icon:'none'
          })
        }
      })
    }
  },
  SubmitEntrust(photoInfo){
    wx.showLoading({
      title: '提交委托...',
      mask: true
    });
    let FormData=this.data.newFormData;
    console.log(FormData)
    console.log(photoInfo)
    console.log(formatTime(new Date()))
    wx.cloud.callFunction({
      name:'Entrust',
      data:{
        type: 'add',
        EntrustType: 'sale',
        FormData: FormData,
        photoInfo: photoInfo,
        updateTime: formatTime(new Date())
      },
      success:(res)=>{
        console.log(1)
        wx.hideLoading();
        wx.showToast({
          title: '委托提交成功',
        })
        wx.navigateTo({
          url: '../../pages/index/index',
        })
      },
      fail:(err)=>{
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: '委托提交失败'
        })
        // 把已经上传的图片删除
        wx.cloud.deleteFile({
          fileList: photoInfo,
          success: res => {
              console.log('delimages', res.fileList)
          },
          fail: console.error
      })
      }
    })
  }
})