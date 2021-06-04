// app.js
const AUTO=require('./utils/auto')
App({
  onLaunch() {
     // 初始化云开发环境
     if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
          env: 'test-tn54w',
          traceUser: true,
      })
    }
    AUTO.autoLogin()
  },
  globalData: {
    userInfo: null
  }
})
