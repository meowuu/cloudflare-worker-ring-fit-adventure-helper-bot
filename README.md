# cloudflare-worker-ring-fit-adventure-helper-bot

![Deploy](https://github.com/meowuu/cloudflare-worker-ring-fit-adventure-helper-bot/workflows/Deploy/badge.svg?branch=master)

一个用来查找健身环大冒险素材位置的助手，由[Cloudflare Worker](https://workers.cloudflare.com) 强力驱动。

## 如何使用

Worker 所在网址：`https://cloudflare-worker-ring-fit-adventure-helper-bot.meoww.workers.dev`  
素材位置端点：`/ingredient/`

目前只有查找素材位置的接口，其他接口未来可能会添加（咕咕咕~）

- 通过 HTTP/HTTPS 直接请求
在接口地址后面添加你想要查找的素材，比如直接访问: https://cloudflare-worker-ring-fit-adventure-helper-bot.meoww.workers.dev/ingredient/白芝麻
你会得到如下响应：
```
你想找的材料 白芝麻 可以在以下关卡找到: 
世界: 4 ,关卡: 4-1 ,建议人物等级: 23;
世界: 4 ,关卡: 4-3 ,建议人物等级: 18;
世界: 4 ,关卡: 4-5 ,建议人物等级: 20;
世界: 5 ,关卡: 5-3 ,建议人物等级: 28;
世界: 5 ,关卡: 5-6 ,建议人物等级: 32;
```

- 通过 Siri 调用 Shortcuts  
必要需求：iPhone/iPad  
点击下方按钮，添加 Shortcuts  
[![siri](https://support.apple.com/library/content/dam/edam/applecare/images/en_US/il/ios12-siri-shortcuts-add-to-siri-inline-icon.png)](https://www.icloud.com/shortcuts/374f99fcbafb449a8307ab703d33433c)

## 部署你自己的 Cloudflare Worker

假设宁已经注册了 Cloudflare 账号，并且拥有一个域名（自行注册或者 Cloudflare 分配的 workers.dev 子域名）。

1. fork 本项目
2. 在 Cloudflare 面板，账号设置，申请一个 API TOKEN
3. 在仓库设置中，配置一个 Secret，名字是 `CF_API_TOKEN`，值为 TOKEN 值
4. 修改仓库根目录下 `wrangler.toml` 文件中 `name` 和 `account_id`。前者是子域名的名字，后者是宁的 Cloudflare 账号id，可以在 worker 面板的右方查看到。请放心，`account_id` 不会泄漏你的账号

## 数据来源

[Google docs](https://docs.google.com/spreadsheets/d/1Sflmz3tb1EqdjL3bGvilU-yMCOdQ8t7YbdoIOR_f2uM/edit#gid=1834127969)
