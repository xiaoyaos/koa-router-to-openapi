const writeJson = require('writejson');
const loadJson = require('load-json-file');
const formatRouterRule = require("./lib/formatRouterRule");
const routerToOpenApi = require("./lib/router-to-openapi");
const path = require("path");
module.exports = function(routerList){
  const routers = formatRouterRule(routerList);
  var paths = routerToOpenApi(routers);
  var openapi = loadJson.sync(path.join(__dirname+'/public/openapi.json'));
  console.log(openapi);
  openapi.paths = paths;
  writeJson("./openapi.json",openapi,(err) => {
    if(err) console.log(err.message);
  })
}
