const j2s = require('../../joi-to-swagger');
const Joi = require('joi');
module.exports = function(routerList){
  var len = routerList.length;
  for(let i = 0;i <= len-1; i++){
    let lists = routerList[i].list;
    let len1 = lists.length;
    for(let j = 0; j <= len1-1; j++){
      //删除handler
      // console.log(lists[j]);
      delete lists[j].handler;
      //将validate中的query、path（params）、queryjoi对象转换为swaggerjson对象
      if(lists[j].validate && lists[j].validate['body']){
        lists[j].validate['body'] = j2s(lists[j].validate['body']).swagger;
      }
      if(lists[j].validate && lists[j].validate['params']){
        lists[j].validate['params'] = j2s(lists[j].validate['params']).swagger;
      }
      if(lists[j].validate && lists[j].validate['query']){
        lists[j].validate['query'] = j2s(lists[j].validate['query']).swagger;
      }
      //output joi转成swagger
      if(lists[j].validate && lists[j].validate['output'] && lists[j].validate['output']['200']){
        lists[j].validate['output']['200'].body = j2s(lists[j].validate['output']['200'].body).swagger;
      }
      //删除_outputValidator
      if(lists[j].validate && lists[j].validate._outputValidator){
        delete lists[j].validate._outputValidator;
      }
    }
  }
  return routerList;
  //将读取到的路由规则整合并将joi对象转成swagger格式并写入项目根目录下routerRule.json文件中
  // writeJson("./routerRule.json",routerList,(err) => {
  //   if(err) console.log(err.message);
  // });
}
