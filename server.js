// 服务端秘钥：ecd7d52b6ea0e7a7bcbe8004f17dcf96
// 要实现的api
// {
//     "get_game_info_path":"/v1/api/query_game_info",
//     "get_user_currency_path":"/v1/api/get_user_currency",
//     "exchange_user_currency":"/v1/api/exchange_user_currency",
//     "get_user_order_path":"/v1/api/get_user_order",
//     "start_game_path":"/v1/api/start_game",
// }

const { log } = require('console');
const express = require('express');
const winston = require('winston');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const baseCurrency = 0;


// 启用HTTPS到HTTP的重定向
// app.use(redirect({
//   from: 'http://',
//   to: 'https://',
//   permanent: true // 设置为true以在浏览器中产生301永久重定向
// }));


// app.use(cors({
//     origin: "*",
//     methods: ["GET","POST", "OPTION"]
// }),(req, res, next) => {
//         res.set('X-Content-Type-Options', 'nosniff');
//         res.set('Cache-Control', 'no-store');
//         res.set('X-XSS-Protection', '1; mode=block');
//         res.set('Strict-Transport-Security', '3600');
//         res.set('Content-Security-Policy','upgrade-insecure-requests);
//         next();
//     }
app.use( ( request , response , next ) => {
    response.header( 'Access-Control-Allow-Origin' , '*') // 跨域最重要的一步 设置响应头
	response.header('Content-Security-Policy','upgrade-insecure-requests');
    next(); // 执行next函数执行后续代码
})

app.use(morgan('combined'));

app.use(express.json());

const userDatabase = {};

// 创建logger实例
const logger = winston.createLogger({
    level: 'info', // 日志级别
    format: winston.format.combine(
        winston.format.timestamp(), // 添加时间戳
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) // 格式化日志信息
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs.log',
            format: winston.format.combine(
                winston.format.timestamp(), // 添加时间戳
                winston.format.printf(info => `[${info.timestamp}][${info.level}][${process.pid}] ${info.message}`) // 格式化日志信息
            )
        }) // 指定日志文件
    ]
});

function updateUserInfo(user_id, updatedInfo) {
    
    console.log(userDatabase)

    // 更新用户信息
    console.log("updated", user_id, updatedInfo)
    userDatabase[user_id] = { ...userDatabase[user_id], ...updatedInfo };
    return true

}

function getUserInfo(user_id) {
    console.log(userDatabase)
    // 检查用户是否存在
    if (userDatabase.hasOwnProperty(user_id)) {
        return userDatabase[user_id]
    } else {
        return null
    }
}

// 查询游戏
app.post('/v1/api/query_game_info', (req, res) => {
    const {
        app_channel,
        game_id,
        game_list_type,
        os_type,
        app_id,
        signature_nonce,
        signature,
        timestamp
    } = req.body;

    logger.info(`query_game_info, app_channel: ${app_channel}, game_id: ${game_id}, game_list_type: ${game_list_type}, os_type: ${os_type}, app_id: ${app_id}, signature: ${signature}, signature_nonce: ${signature_nonce}, timestamp: ${timestamp}`);

    return_obj = {
        "code": 0,
        "msg": "success",
        "data": {
            "game_id": 1,
            "name": "zg捕鱼",
            "preview_url": "https://xx.aliyuncs.com/admin_game/af295d878c9360322729dff2a3708297.png",
            // 缩略图地址，现需提前给zego配置
            "game_version": "1.0.0", //游戏版本
            "download_url": "https://xx.com/Game/index.html?ts=1675740304057950404",// 游戏加载地址
            "local_game_resource": {
                "local_file_url": "https://oss-cn-shanghai.aliyuncs.com/mini-game/....",
                "local_file_version": "1.1.16",
            },
            "spin": [
                100,
                200,
                1000,
                5000
            ],//底注
            "player": [
                2,
                6,
                9
            ],// 可选玩家数量
            "game_mode": [
                1
            ], // 1.直播间游戏 2.秀场游戏 3.全屏游戏
            "game_orientation": 1, //1.竖屏 2.横屏
            "design_width": 750, // 分辨率宽
            "design_height": 1334, // 分辨率高
            "safe_height": 1334, //游戏的安全高
            "venue_level": [1, 2], // 1,2,3 场馆
            "spin_multiple": 2 //底注倍数
        }
    }

    res.json(return_obj);
});

function get_user_currency(user_id){
    return 12344556;
}

// 查询用户金币
app.post('/v1/api/get_user_currency', (req, res) => {
    // {
    //     "app_channel": "zego",
    //     "app_id": 797904613,
    //     "game_id":101,
    //     "user_id": "ba7c5f34d0710525"
    // }
	logger.info('get_user_currency begin')
    const {
        app_channel,
        game_id,
        app_id,
        user_id
    } = req.body;

    const unique_id = Date.now().toString();
    currency_balance = get_user_currency(user_id)
    // 

    logger.info(`get_user_currency: app_channel:${app_channel}, game_id: ${game_id}, app_id: ${app_id}, user_id: ${user_id}, unique_id: ${unique_id}, currency_balance: ${currency_balance}`)

    return_obj = {
        "code": 0,
        "message": "succeed",
        "unique_id": unique_id,
        "data": {
            "currency_balance": currency_balance,
        }
    }

    res.json(return_obj);
});

// 兑换金币
app.post('/v1/api/exchange_user_currency', (req, res) => {
    const {
        order_id,
        currency_diff,
        user_id,
        game_id,
        app_id,
        signature_nonce,
        timestamp,
        signature
    } = req.body;

    const unique_id = Date.now().toString();

    const cp_order_id = order_id;

    user_info = getUserInfo(user_id)

    currency_balance = 0

    // if (user_info != null) {
    //     currency_balance = user_info['currency']
    // } else {
    //     logger.info('user_info is null')
    // }
	// baseCurrency = baseCurrency + req.body['currency_diff'];

    logger.info(`currency_balance: ${currency_balance}`)

    logger.info(`exchange_user_currency: order_id: ${order_id}, currency_diff: ${currency_diff}, user_id: ${user_id}, game_id: ${game_id}, app_id: ${app_id}, signature_nonce: ${signature_nonce}, timestamp: ${timestamp}, signature: ${signature}, unique_id: ${unique_id}, currency_balance: ${currency_balance}`)

    // currency_balance = currency_balance + currency_diff
	// currency_balance = baseCurrency;

    logger.info(`currency_balance: ${currency_balance}`)
    // 更新当前用户金币
    updateUserInfo(user_id, { "currency": currency_balance })

    return_obj = {
        "code": 0,
        "message": "succeed",
        "unique_id": unique_id,
        "data": {
            "order_id": order_id,
            "cp_order_id": cp_order_id,
            "currency_balance": 100
        }
    }

    res.json(return_obj);
});


const port = 5050;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// http://8.134.211.11:5050