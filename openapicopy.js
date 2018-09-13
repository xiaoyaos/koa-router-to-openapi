const SwaggerParser = require('swagger-parser');
const utilJson = require('util-json');
const writeJson = require('write-json-file');

SwaggerParser.validate('files/oldOpenapi.json', function(err,oldApi){
  if(!err){
    //获取路由配置，解析并加载
    SwaggerParser.validate('files/newOpenapi.json', function(err,newApi){
      if(!err){
        //获取路由配置，解析并加载
        var oldPaths = oldApi.paths;
        var newPaths = newApi.paths;
        function copy(oldPaths,newPaths,k){
            if(newPaths[k]['x-paths'] && oldPaths[k]['x-paths']){
              for(let j in newPaths[k]['x-paths']){
                if(oldPaths[k]['x-paths'][j]){
                  if(oldPaths[k]['x-paths'][j]['x-paths']){
                    copy(oldPaths[k]['x-paths'],newPaths[k]['x-paths'],j);
                  }else{
                    for(let i in newPaths[k]['x-paths'][j]){
                      if(oldPaths[k]['x-paths'][j][i]){
                        newPaths[k]['x-paths'][j][i]['x-handler'] = oldPaths[k]['x-paths'][j][i]['x-handler'];
                      }
                    }
                  }
                }
              }
            }
        }
        for(let k in newPaths){
          if(oldPaths[k]){  //检测原来json该路径是否也存在
            copy(oldPaths,newPaths,k);
          }
        }
        newApi.paths = newPaths;
        writeJson('./files/new.json',newApi,(err) => {
          if(err) console.log(err.message);
        })
      }else{
        console.log(err);
      }
    });
  }else{
    console.log(err);
  }
});
