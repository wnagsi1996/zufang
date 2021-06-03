// miniprogram/Companypackage/saleEntrust/saleEntrust.js
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
        ['0室', '1室', '2室', '3室', '4室', '5室'],
        ['0厅', '1厅', '2厅', '3厅'],
        ['0卫', '1卫', '2卫', '3卫']
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
    templeCheckbox: [],
    templeTags: [],
    //弹窗显示隐藏
    popupShow:false,
    //弹窗数据
    columns:[],
    //标签选择器弹窗
    tagShow:true
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
      columns:PickerList.find(n=>n.id==name).pickerlist
    })
  },
  //关闭弹窗
  onClose(){
    this.setData({
      popupShow:false
    })
  },
  _hankTag(e){
    let templeTags=this.data.templeTags;
    
      let id=e.currentTarget.dataset.id;
      let checkbox=this.data.checkbox
      let check=checkbox.find(n=>n.value==id);
      
      if(check.checked){
        check.checked=false;
        templeTags=templeTags.filter(n=>n.value!=id)
      }else{
        if(templeTags.length<4){
          check.checked=true;
          templeTags.push(check)
        }
      }
      Object.assign(checkbox,check);
      this.setData({
        templeTags,
        checkbox
      })
  }
})