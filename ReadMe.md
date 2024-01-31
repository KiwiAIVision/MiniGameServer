需求描述:

提供一个简单的游戏服务器，

1. 能够通过后台API兑入金币。
2. 游戏启动时，能查询到指定用户的金币信息。
3. 游戏结束后，能更新金币到游戏服务器。
4. 退出游戏，能把游戏内的金币进行兑出。


1. 提供游戏信息

    game_id
        int
        小游戏在cp侧的序号，zego以此序号查询游戏信息等。
    game_name
        string
        各个国家语言版本的游戏名称，最少需提供中文名和英文名
    game_orientation
        int
        游戏屏幕朝向：
        1. 竖屏
        2. 横屏
    game_mode

        int[]

        游戏模式：
        1. 全屏指定匹配/直播间游戏
        2. 半屏随机匹配/秀场游戏
        3. 全屏随机匹配

    thumbnail
        png
        游戏图标：
        - 图片格式：png
        - 分辨率：116*116


2. 实现查询游戏信息API，不做鉴权，提供给小游戏平台使用。

{
    "app_channel": "zego" ,
    "game_id": 1001 ,
    "game_list_type": 2 ,
    "os_type": "ios",  // web ios android（小写）
    "app_id":1212121,
    "signature": "18060cacb0170db9d6bc6ce55981ff0f" ,
    "signature_nonce": "814ddfa6c0eac48c" ,
    "timestamp": 1675740303
}


{
    "code": 0,
    "msg": "success",
    "data": {
        "game_id": 1001,
        "name": "德州扑克",
        "preview_url": "https://xx.aliyuncs.com/admin_game/af295d878c9360322729dff2a3708297.png",
        // 缩略图地址，现需提前给zego配置
        "game_version": "1.1.5", //游戏版本
        "download_url": "https://xx.com/Game/index.html?ts=1675740304057950404",// 游戏加载地址
        "local_game_resource": {
            "local_file_url": "https://oss-cn-shanghai.aliyuncs.com/mini-game/....",
            "local_file_version": "1.1.16",
        } //本地资源，暂时不用
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
        "venue_level": [1,2], // 1,2,3 场馆
        "spin_multiple":2 //底注倍数
    }
}


3. 实现兑入/兑出金币API，先不做鉴权校验，只保存用户id和金币信息。

https://zegocloud.feishu.cn/wiki/JQNlweGFUiHkVFkE1J0ce4n9n3e?disposable_login_token=eyJ1c2VyX2lkIjoiNzE3MzkxNTc2NjM2NTM1NjAzNCIsImRldmljZV9sb2dpbl9pZCI6IjcyNjg4NzMzMzc3OTgwNDk3OTMiLCJ0aW1lc3RhbXAiOjE3MDYxNjQ3MDUsInVuaXQiOiJldV9uYyIsInB3ZF9sZXNzX2xvZ2luX2F1dGgiOiIxIiwidmVyc2lvbiI6InYzIiwidGVuYW50X2JyYW5kIjoiZmVpc2h1IiwicGtnX2JyYW5kIjoi6aOe5LmmIn0=.f836be1b7d02b84f3a8ab931b8a3c33c56f992f8c14f0bfa5202103c2fed5da7



4. 实现金币查询，给游戏使用，也不做鉴权，只查询。

5. 实现金币更新，给游戏使用，不做鉴权，游戏结束后，更新游戏服务器的金币。


简易流程实现:

1. 调用平台API兑入金币，游戏服务器存储用户金币信息。
2. 示例Demo加载游戏，游戏通过调用游戏服务器的获取金币接口并显示初始金币信息。
3. 玩游戏客户端自己维护游戏的金币情况，游戏结束，上报一个金币结果。
