// 开启http服务器 引入http模块
let http = require('http');
//生成路径path
let path = require("path");
// 引入文件系统
let fs = require("fs");
// 引入mime
let mime = require("mime");
// 引入querystring模块
let querystring = require("querystring");
// 配置网站的跟目录
let rootPath = path.join(__dirname, "www");
//开启服务
http
    .createServer((request, response) => {
        // console.log('请求来了');
        // 如果带过了的是跟目录  读取目录的文件  显示文件列表
        // 根据请求的url 生成静态资源服务器中的绝对路径
        // 解析url编码引入querystring模块
        let filePath = path.join(rootPath, querystring.unescape(request.url));
        console.log(filePath);
        // 判断访问的目录是否存在
        let isExist = fs.existsSync(filePath);
        if (isExist) {
            //文件存在
            // 生成文件列表 读取一个目录的内容
            fs.readdir(filePath, (err, files) => {
                // 不是目录抛出异常进里面
                if (err) {
                    // console.log(err);
                    // console.log("不是文件夹");
                    // 如果进到这里读取文件
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            response.writeHead(200, {
                                "content-type": mime.getType(filePath)
                            })
                            response.end(data);
                        }
                    })
                } //是文件夹
                else {
                    // 判断有首页就直接进入首页(数组)
                    if (files.indexOf("index.html") != -1) {
                        // 是首页
                        fs.readFile(path.join(filePath, "index.html"), (err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                response.end(data);
                            }
                        })
                    } else {
                        // console.log(files);
                        // 生成列表 
                        let backData = "";
                        for (let i = 0; i < files.length; i++) {
                            backData += `<h2><a href="${request.url=="/"?"":request.url}/${files[i]}">${files[i]}</a></h2>`;
                        }
                        // 设置类型
                        response.writeHead(200, {
                            "content-type": "text/html;charset=utf-8"
                        })
                        response.end(backData);
                    }
                }
            })
            // response.end(" found");
        } else {
            //不存在
            fs.readFile(path.join(rootPath, "404.html"), (err, data) => {
                response.writeHead(404, {
                    "content-type": "text/html;charset=utf-8"
                })
                response.end(data);
            })
        }

        // response.end('you come');
    })
    .listen(80, '127.0.0.1', () => {
        console.log('listen 127.0.0.1 success');
    })