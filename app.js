const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const controller = require('./middlewares/controller');
const templating = require('./templating');
const staticFiles = require('./static-files');
const fs = require( 'fs' );
const path = require('path');

//创建文件夹
function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    //console.log(dirname+" exists return")
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

const app = new Koa();
//发起get/post请求时会打印所请求的接口
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
app.use(bodyParser({
  multipart: true,
  formLimit: "10mb",
  jsonLimit: "10mb",
  textLimit: "10mb",
}));
//遍历static目录，使node可以调用该目录下的文件
app.use(staticFiles('/static/', __dirname + '/static'));
//遍历users/upload-files目录，使node可以调用该目录下的文件 在common不存在时可能会报错？
app.use(staticFiles('/users/', __dirname + '/users'));
app.use(staticFiles('/users/upload-files/', __dirname + '/users/upload-files'));
//遍历controllers目录，使node可以调用该目录下的文件
app.use(staticFiles('/controllers/', __dirname + '/controllers'));
//初始化views目录下的html文件（目前只有一个global地球的），这里面的html文件是独立的，不是react
app.use(templating('views', {}));
app.use(controller());
app.use(router.routes());
app.listen(6000);
console.log('app started at port 6000...');