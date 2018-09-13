module.exports = function(routerList){
  var len = routerList.length;
  var paths = {}; //所有路由
  for(let i = 0; i <= len-1; i++){
    let mPath = routerList[i].path;
    let before = routerList[i].before;
    let list = routerList[i].list;
    let listLen = list.length;
    let singleRouter = {
      "x-before":before,
      "x-paths":{}
    };
    for(let j = 0; j <= listLen-1; j++){
      let path = list[j].path;
      let method = list[j].method;
      let tmp = {
          parameters:[],
          requestBody:{},
          "x-handler":[],
          responses:{}
      }
      //处理response
      if(list[j].validate && list[j].validate.output && list[j].validate.output["200"]){
        tmp['responses'] = {"200":{schema:list[j].validate.output["200"].body}}
      }
      //处理parameters和requestBody
      let params = [];
      if(list[j].validate){
        params = getParams(list[j].validate);
      }
      tmp['parameters'] = params.parameters;
      tmp['requestBody'] = params.requestBody;

      if(typeof method === "object"){
        method = method.join(",");
      }
      if(!singleRouter['x-paths'][path]){
        singleRouter['x-paths'][path] = {};
      }
      singleRouter['x-paths'][path][method] = tmp;

    }
    paths[mPath] = singleRouter;
  }
  return paths;
}
//获取请求参数
function getParams(validate){
  /*参数有多属性：
   * body  post请求 名为body，schema
   * params 对应path get请求
   * query  get请求
   */
   var params = {
     parameters:[],
     requestBody:{}
   }
   if(validate['body']){
     params.requestBody = {
       required:true,
       content:{
         "application/json":{
           schema:validate['body']
         }
       }
     };
   }
   if(validate['params']){
     let properties = validate['params']['properties']
     for(let k in properties){
       var tmp = {
         name:k,
         in:"path",
         required:false,
         schema:properties[k]
       }
       if(validate['params'].required){
         let index = validate['params'].required.indexOf(k);
         if(index >= 0){
           tmp.required = true;
         }
       }
       params.parameters.push(tmp);
     }
   }
   if(validate['query']){
     let properties = validate['query']['properties']
     for(let k in properties){
       var tmp = {
         name:k,
         in:"query",
         required:false,
         schema:properties[k]
       }
       if(validate['query'].required){
         let index = validate['query'].required.indexOf(k);
         if(index >= 0){
           tmp.required = true;
         }
       }
       params.parameters.push(tmp);
     }
   }
   return params;
}
