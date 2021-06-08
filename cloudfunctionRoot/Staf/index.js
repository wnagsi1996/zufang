// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((reslove,reject)=>{
    let {page,size}=event;
    db.collection('ContactList')
    .orderBy('updatetime', 'desc')
    .skip(page)
    .limit(size)
    .get({
      success:res=>{
        console.log(res);
        return reslove(res)
      },
      fail:err=>{
        console.log(err);
        return reject(err)
      }
    })
  })
  
}