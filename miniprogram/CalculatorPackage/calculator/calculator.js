// miniprogram/CalculatorPackage/calculator/calculator.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calcul:{
      navActive:0,
      calculator:0,
      repayment:0,
      business:{
        year:20,
        price:'',
        lpr:4.9,
        bp:0,
        hl:0
      },
      provident:{
        year:20,
        price:'',
        lpr:3.25,
        bp:0,
        hl:0
      }
      
      
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {lpr,bp}=this.data.calcul;
    this.setData({
      [`calcul.hl`]:(bp*0.01+lpr).toFixed(2)
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
  //选择贷款类别
  _hankType(e){
    this.setData({
      [`calcul.navActive`]:e.currentTarget.dataset.id
    })
  },
  _hankBusinessYear(e){
    this.setData({
      [`calcul.business.year`]:e.detail.value
    })
  },
  _hankBusinessBp(e){
    let lpr=this.data.calcul.business.lpr;
    this.setData({
      [`calcul.business.bp`]:Number(e.detail.value),
      [`calcul.business.hl`]:(Number(e.detail.value)*0.01+lpr).toFixed(2)
    })
  },
  _hankProvidentYear(e){
    this.setData({
      [`calcul.provident.year`]:e.detail.value
    })
  },
  _hankProvidentBp(e){
    let lpr=this.data.calcul.provident.lpr;
    this.setData({
      [`calcul.provident.bp`]:Number(e.detail.value),
      [`calcul.provident.hl`]:(Number(e.detail.value)*0.01+lpr).toFixed(2)
    })
  }
})