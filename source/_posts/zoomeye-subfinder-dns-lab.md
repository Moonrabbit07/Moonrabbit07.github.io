---
title: "网络空间搜索与子域名收集实践：ZoomEye、Subfinder、dig 和 curl"
date: 2026-10-26 18:20:00
categories:
  - 网络安全学习
tags:
  - ZoomEye
  - Subfinder
  - DNS
  - 子域名收集
  - HTTP
  - 学习记录
permalink: /zoomeye-subfinder-dns-lab/
description: "通过 ZoomEye 搜索、Subfinder 被动收集、dig DNS 查询和 curl HTTP 响应，梳理从发现候选资产到验证网络服务的基本流程。"
---


## 一、本次作业考查点

| 考查点 | 应掌握的内容 | 对应实践 |
| --- | --- | --- |
| 网络空间搜索 | 区分普通网页搜索和公网资产测绘；理解 IP、端口、服务、指纹 | ZoomEye 查询与结果阅读 |
| 搜索平台比较 | 认识 Shodan、Censys、FOFA、Quake、Netlas 的侧重点 | 整理平台清单 |
| 子域名发现 | 区分被动信息收集与 DNS 主动查询 | Subfinder 搜集候选子域名 |
| DNS 基础 | 理解 A、AAAA、CNAME、DNS 响应状态以及 `+short` 的局限 | 使用 `dig` 比较不同查询结果 |
| HTTP 基础 | 区分 200、301、403、404；理解 HTTP HEAD 和重定向 | `curl -I` 查看响应头 |
| 结果判读 | 区分“被收录”“能解析”“能连接”“有 HTTP 响应”四类证据 | 对比不同子域名的表现 |
| 实验复现与规范 | 保留命令、截图、观察结果和未验证的推测；明确授权边界 | 整理本篇学习记录 |

## 二、主要学习收获

这次实验最重要的收获不是找到多少个域名，而是认识到**发现候选资产与验证资产状态是两个不同的阶段**。

1. **Subfinder 有结果 ≠ 子域名现在一定有效。** 被动来源可能包含历史证书、旧 DNS 记录等信息。
2. **`dig +short` 没有输出 ≠ 域名一定不存在。** 还需要查看完整响应中的 `status`、`ANSWER SECTION`，必要时区分 A、AAAA、CNAME 记录。
3. **DNS 能解析 ≠ Web 页面能打开。** DNS 只提供名称与记录的关系；后面还有网络连接、TLS 和 HTTP 服务。
4. **`curl -I` 返回 301 ≠ 访问失败。** 301 本身是有效的 HTTP 响应，意思是资源被永久重定向。
5. **ZoomEye 查不到个人博客 ≠ 博客失效。** 数据索引范围、更新时间、GitHub Pages 共享托管以及代理架构都会影响资产搜索结果。

我的理解逐渐从“执行命令、看有没有输出”，转向了“先提出问题，再判断哪项证据能回答这个问题”。


<!-- more -->

# 第一部分：认识 ZoomEye 网络空间搜索引擎

## 1. ZoomEye 的用途

[ZoomEye](https://www.zoomeye.ai/) 是网络空间搜索引擎。普通搜索引擎主要帮助查找网页内容，而 ZoomEye 侧重索引互联网上已发现的主机、端口、服务及相关技术信息。

| 方向 | 能帮助解决的问题 | 关联知识 |
| --- | --- | --- |
| 网络资产发现 | 哪些公网资产已进入平台索引？ | 域名、IP、DNS |
| 网络服务识别 | 某条索引记录对应什么服务？ | 端口、TCP/IP |
| 技术指纹识别 | 响应中出现哪些软件或协议特征？ | Banner、HTTP Header |
| 攻击面管理 | 自有组织有哪些可公开访问的服务？ | 资产清单、访问控制 |
| 漏洞影响筛选 | 哪些资产可能需要进一步核查？ | 软件版本、CVE |

需要区分：**平台的“资产记录”不等于当前在线状态，识别到软件名称也不等于发现漏洞。**

## 2. ZoomEye 页面观察

我使用 ZoomEye 的筛选功能，观察网页对网络资产信息的展示方式，例如 IP、端口、服务等字段。

![图1：ZoomEye 网络资产搜索结果](/images/zoomeye-subfinder-dns-lab/01-zoomeye-results.png)

*图 1：ZoomEye 搜索结果截图。重点观察资产字段，而不是只看结果数量。*

## 3. 为什么搜索自己的博客没有结果？

我尝试搜索个人博客：

```text
domain="moonrabbit07.github.io"
```

结果没有返回匹配记录。

![图2：ZoomEye 对个人博客域名未返回匹配记录](/images/zoomeye-subfinder-dns-lab/02-zoomeye-blog-no-results.png)

*图 2：该次搜索未得到匹配记录。*

我使用的是 **GitHub Pages**，网站由共享托管和边缘服务提供访问。可能的影响因素包括：平台未建立与此完整域名对应的索引、采集覆盖不足、更新时间不同以及共享 IP 与域名关联的限制。

这里的严谨结论只能是：**本次 ZoomEye 查询没有匹配记录，不能据此判断我的博客不存在，也不能单凭此结果证明“被 CDN 隐藏”。**

我之前另外使用过 `dig` 和 `curl -I` 检查博客，DNS 能返回 GitHub Pages 的公共 IP，并且站点 HTTP 状态为 `200`。这说明网站可正常响应，与 ZoomEye 是否收录是两回事。

# 第二部分：类似 ZoomEye 的平台

| 工具 | 较突出的学习用途 | 官网 |
| --- | --- | --- |
| Shodan | 设备、端口、Banner 与互联网服务 | [shodan.io](https://www.shodan.io/) |
| Censys | 主机、证书、网络服务与资产关联 | [search.censys.io](https://search.censys.io/) |
| FOFA | 通过 HTTP 特征、IP、域名等搜索资产 | [fofa.info](https://fofa.info/) |
| 360 Quake | 网络空间测绘、服务及资产查询 | [quake.360.net](https://quake.360.net/) |
| Netlas | DNS、网络扫描数据、证书及相关记录 | [netlas.io](https://netlas.io/) |

这些平台都是信息收集的入口，但数据覆盖、字段格式、查询语法、权限和更新周期不完全一致。同一个网站在不同平台中结果不同，并不奇怪。

这部分原稿主要是了解工具，**还没有实际开展跨平台同条件对比**。未来可以在自己的站点上比较各平台是否有收录、最后发现时间、端口和服务字段等。

# 第三部分：子域名是如何发现的？

## 1. 子域名与 DNS 枚举

例如：

```text
example.com
├── www.example.com
├── api.example.com
├── blog.example.com
└── dev.example.com
```

这是示例命名，不意味着真实服务必然存在。

`dig` 可查询**已知域名**的 DNS 记录，但 DNS 默认并没有“列出某域名全部子域名”的通用查询接口。因此，枚举通常需要来自搜索引擎、公开证书、被动 DNS、字典候选等信息。

对于自己管理或获授权的域名，可以检查已知名称：

```bash
dig www.example.com A
dig api.example.com A
dig blog.example.com CNAME
```

这里的 `A` 表示 IPv4 地址记录，`CNAME` 表示别名记录。还可以用 `AAAA` 查询 IPv6 地址。

## 2. `dig +short` 返回 IP 的实验

我在实验中使用：

```bash
dig baidu.com +short
```

终端得到四个 IPv4 地址（这是当时的一次查询结果，不代表它们以后不变）：

```text
111.63.65.103
111.63.65.247
124.237.177.164
110.242.74.102
```

其中，**同一个域名对应多个 IP** 并不奇怪，可能与负载分担、地域调度和服务架构有关。

但是 `+short` 只打印简化答案，不能准确区分所有解析失败原因。

# 第四部分：使用 Subfinder 进行被动子域名收集

## 1. 工作原理

[Subfinder](https://github.com/projectdiscovery/subfinder) 主要通过公开及授权的数据源寻找候选子域名；默认工作方式与主动扫描端口的工具不同。收集结果可能来自证书透明度日志、被动 DNS 和其他公开资产信息服务。

```text
公开数据源
   ↓
Subfinder 收集候选名称
   ↓
去重后的子域名列表
   ↓
dig / DNS 验证
   ↓
在自有或明确授权资产上进行 HTTP 验证
```

## 2. 常用命令

```bash
# 查看帮助
subfinder -h

# 被动收集单个域名
subfinder -d example.com

# 安静模式，只输出域名
subfinder -d example.com -silent

# 结果写入文件
subfinder -d example.com -silent -o subdomains.txt

# 查看当前版本支持的数据源
subfinder -ls

# 筛选通过 DNS 解析验证的候选域名
subfinder -d example.com -nW
```

**命令纠错：** 原稿的 `subfind -h` 是笔误，应该写成 `subfinder -h`；`-nW`（`-active`）用于筛选 DNS 层面可解析的候选域名，**不是**验证 HTTP 页面是否正常。

更多参数参见 [Subfinder 官方使用文档](https://docs.projectdiscovery.io/opensource/subfinder/usage)。

## 3. 我实际做的 Subfinder 实验

我执行了以下命令，观察平台能够找到什么：

```bash
subfinder -d baidu.com -silent
```

终端输出了较多候选子域名，例如：

```text
azure.jiankang.baidu.com
ytsj.baidu.com
cdn.gamedelivery.baidu.com
tieba.baidu.com
...
```

![图3：Subfinder 输出候选子域名](/images/zoomeye-subfinder-dns-lab/03-subfinder-baidu.png)

*图 3：Subfinder 被动收集结果的一部分。*

**分析：** Subfinder 列出一个子域名，只能说明某个信息源提供过该名称。它可能已经停用，也可能只有特定类型的 DNS 记录；单凭截图不能证明这些域名目前全部在线。

## 4. 用 dig 检查发现的名称

我又尝试对收集到的部分名称进行查询，发现有的 `dig +short` 没有结果，有的可以返回 IP 或 CNAME。

![图4：dig 查询不同域名的结果](/images/zoomeye-subfinder-dns-lab/04-dig-lookup.png)

*图 4：截图中有空输出，也有 `baidu.com` 的多个 A 记录，以及 CNAME 链。*

一个值得注意的结果是：

```bash
dig jiangwenjuan.baijia.baidu.com +short
```

当时返回：

```text
orp5.n.shifen.com.
180.97.107.16
```

第一行是 DNS 别名，第二行是进一步解析得到的 IPv4 地址。因此需要区分**主机名本身、CNAME 目标和最终 IP**。

至于没有输出的例子，例如：

```bash
dig azure.jiankang.baidu.com +short
```

我当时只记录了空输出。它**尚不能证明该域名不存在**。之后如果针对自己管理的域名遇到同类问题，可以去掉 `+short`：

```bash
dig host.example.com A
```

重点看 `status` 和 `ANSWER SECTION`：

| 状态或现象 | 含义 |
| --- | --- |
| `NOERROR` 且有 A 记录 | DNS 返回了所请求的 IPv4 地址 |
| `NOERROR` 但无 A 记录 | 本次查询没有返回 A 记录，不能直接说域名不存在 |
| `NXDOMAIN` | 解析器报告所查询的名称不存在 |
| `SERVFAIL` | DNS 查询未能正常完成 |
| 超时 | 未在规定时间内收到 DNS 响应 |

在具体环境里仍应结合查询类型、解析器以及缓存来判断。

## 5. 使用 curl 检查 HTTP 响应

我继续检查一个具有 DNS 解析结果的名称：

```bash
curl -I jiangwenjuan.baijia.baidu.com
```

![图5：curl -I 返回 301 重定向](/images/zoomeye-subfinder-dns-lab/05-curl-301-response.png)

*图 5：服务器返回了 HTTP/1.1 301 响应。*

截图中的关键响应信息是：

```http
HTTP/1.1 301 Moved Permanently
Location: https://baijia.baidu.com/domain?domain=jiangwenjuan
Server: Apache
```

这表明本次 HTTP 请求收到了**永久重定向**的响应，说明服务确实有回应，但不能说明原地址直接返回了一个独立页面，也不能据此判断是否存在漏洞。

我这次命令未显式输入 `https://`，因此首先尝试的是 HTTP；`Location` 才将客户端引向 HTTPS 地址。`-I` 通常发送 HEAD 请求，只获取响应头，有些服务可能对 HEAD 和普通 GET 采用不同处理方式。

# 第五部分：实验结果与反思

## 1. 为什么有的子域名没有 IP，也打不开？

可能的解释包括：

- Subfinder 获取的是历史数据或尚未更新的索引记录。
- 子域名当前没有 A 记录，或者只有其他 DNS 记录。
- DNS 查询发生失败、超时或受解析环境影响。
- 即使取得 IP，目标也不一定运行 Web 服务。
- 对 `curl` 而言，连接失败、TLS 错误、HEAD 请求不被支持、HTTP 重定向等需要分别判断。

**本次材料能证明的是“不同名称在查询阶段表现不同”，而不是这些域名都已被关闭。**

## 2. 从实验中形成的分析方法

| 阶段 | 想回答的问题 | 合适的工具 | 典型证据 |
| --- | --- | --- | --- |
| 发现 | 公开数据源出现过这个名称吗？ | Subfinder、证书记录、搜索平台 | 候选域名 |
| 解析 | 目前查询到哪些 DNS 记录？ | dig、dnsx | A、AAAA、CNAME、DNS 状态 |
| 网络连接 | 对应主机上的目标服务是否能建立连接？ | curl 详细日志、授权网络诊断 | 连接成功/超时/拒绝 |
| 应用响应 | Web 服务返回什么？ | curl | 200、301、403、404、响应头 |


**总结：** 这次作业让我认识到，安全信息收集不是“工具显示什么就相信什么”，而是不断区分观察事实、合理解释和未经证实的猜测。

---

## 参考资料

- [ZoomEye 官网](https://www.zoomeye.ai/)
- [Subfinder GitHub 项目](https://github.com/projectdiscovery/subfinder)
- [ProjectDiscovery：Subfinder Usage](https://docs.projectdiscovery.io/opensource/subfinder/usage)
- [ProjectDiscovery：Subfinder Running](https://docs.projectdiscovery.io/opensource/subfinder/running)
- [Hexo：资源文件夹](https://hexo.io/zh-cn/docs/asset-folders)

