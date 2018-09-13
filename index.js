const writeJson = require('writejson');
const loadJson = require('load-json-file');
const formatRouterRule = require("./lib/formatRouterRule");
const routerToOpenApi = require("./lib/router-to-openapi");
const path = require("path");
module.exports = function(routerList){
  const routers = formatRouterRule(routerList);
  var paths = routerToOpenApi(routers);
  /*******处理admin处，将staffs/department_types/departments移到admin下面正确位置*******/
  paths['/admin']['x-paths']['/logout'] = paths['/staffs']['x-paths']['/logout'];
  delete paths['/staffs']['x-paths']['/logout'];
  paths['/admin']['x-paths']['/change_password'] = paths['/staffs']['x-paths']['/change_password'];
  delete paths['/staffs']['x-paths']['/change_password'];
  delete paths['/staffs']['x-paths']['/test'];

  paths['/admin']['x-paths']['/staffs'] = paths['/staffs'];
  delete paths['/staffs'];
  paths['/admin']['x-paths']['/department_types'] = paths['/department_types'];
  delete paths['/department_types'];
  paths['/admin']['x-paths']['/departments'] = paths['/departments'];
  delete paths['/departments'];
  /*******处理admin处，将staffs/department_types/departments移到admin下面正确位置**********/
  var openapi = loadJson.sync(path.join(__dirname+'/public/openapi.json'));
  openapi.paths = paths;
  writeJson(path.join(__dirname, "./files/neweOpenapi.json"),openapi,(err) => {
    if(err) console.log(err.message);
  })
}
