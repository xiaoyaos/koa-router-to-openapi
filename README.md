# koa-router-to-openapi
koa router config to openapi

#### 介绍
使用此功能需要使用到到两个修改源码的包
地址1：https://github.com/xiaoyaos/joi-router
地址2：https://github.com/xiaoyaos/router
使用joi-router，调用getRouterList方法返回路由规则，
本程序会解析并生成openapi文档并写入到项目根目录下的openapi.json文件，文档规范在public目录下，可以自行修改

#### 使用案例
//路由文件
const routers = require('./router');
const krto = require('koa-router-to-openapi');
//获取路由规则
const routerRule = routers.getRouterList();
krto(routerRule);
