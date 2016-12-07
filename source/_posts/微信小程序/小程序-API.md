---
title:小程序API
---
# 网络API列表：
- `wx.request(OBJECT)`发起的是 HTTPS 请求。**一个微信小程序，同时只能有5个网络请求连接。**

```js
wx.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
     x: '' ,
     y: ''
  },
  header: {
      'content-type': 'application/json'
  },
  success: function(res) {
    console.log(res.data)
  }
})
```

- `wx.uploadFile(OBJECT)`将本地资源上传到开发者服务器。


```js
wx.chooseImage({
  success: function(res) {
    var tempFilePaths = res.tempFilePaths
    wx.uploadFile({
      url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
      filePath: tempFilePaths[0],
      name: 'file',
      formData:{
        'user': 'test'
      },
      success: function(res){
        var data = res.data
        //do something
      }
    })
  }
})
```

- `wx.downloadFile(OBJECT)`下载文件资源到本地。客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。

**注：文件的临时路径，在小程序本次启动期间可以正常使用，如需持久保存，需在主动调用 wx.saveFile，在小程序下次启动时才能访问得到。**

```js
wx.downloadFile({
  url: 'http://example.com/audio/123', //仅为示例，并非真实的资源
  success: function(res) {
    wx.playVoice({
      filePath: res.tempFilePath
    })
  }
})
```

- `wx.connectSocket(OBJECT)`创建一个 WebSocket 连接；一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。

```js
wx.connectSocket({
  url: 'test.php',
  data:{
    x: '',
    y: ''
  },
  header:{
    'content-type': 'application/json'
  },
  method:"GET"
})
```

-  `wx.onSocketOpen(CALLBACK)` 监听WebSocket连接打开事件。

```js
wx.connectSocket({
  url: 'test.php'
})
wx.onSocketOpen(function(res) {
  console.log('WebSocket连接已打开！')
})
```

- `wx.onSocketError(CALLBACK)` 监听WebSocket错误。

```js
wx.connectSocket({
  url: 'test.php'
})
wx.onSocketOpen(function(res){
  console.log('WebSocket连接已打开！')
})
wx.onSocketError(function(res){
  console.log('WebSocket连接打开失败，请检查！')
})
```

-  `wx.sendSocketMessage(OBJECT)` 通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。

```js
var socketOpen = false
var socketMsgQueue = []
wx.connectSocket({
  url: 'test.php'
})

wx.onSocketOpen(function(res) {
  socketOpen = true
  for (var i = 0; i < socketMsgQueue.length; i++){
     sendSocketMessage(socketMsgQueue[i])
  }
  socketMsgQueue = []
})

function sendSocketMessage(msg) {
  if (socketOpen) {
    wx.sendSocketMessage({
      data:msg
    })
  } else {
     socketMsgQueue.push(msg)
  }
}
```

- `wx.onSocketMessage(CALLBACK)`监听WebSocket接受到服务器的消息事件。

```js
wx.connectSocket({
  url: 'test.php'
})

wx.onSocketMessage(function(res) {
  console.log('收到服务器内容：' + res.data)
})
```

- `wx.closeSocket()`关闭WebSocket连接。
- `wx.onSocketClose(CALLBACK)`监听WebSocket关闭。
```js
wx.connectSocket({
  url: 'test.php'
})

//注意这里有时序问题，
//如果 wx.connectSocket 还没回调 wx.onSocketOpen，而先调用 wx.closeSocket，那么就做不到关闭 WebSocket 的目的。
//必须在 WebSocket 打开期间调用 wx.closeSocket 才能关闭。
wx.onSocketOpen(function() {
  wx.closeSocket()
})

wx.onSocketClose(function(res) {
  console.log('WebSocket 已关闭！')
})
```

# 媒体

## 图片

- `wx.chooseImage(OBJECT)`从本地相册选择图片或使用相机拍照。

**注：文件的临时路径，在小程序本次启动期间可以正常使用，如需持久保存，需在主动调用 wx.saveFile，在小程序下次启动时才能访问得到。**

```js
wx.chooseImage({
  count: 1, // 默认9
  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  success: function (res) {
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePaths = res.tempFilePaths
  }
})
```

- `wx.previewImage(OBJECT)` 预览图片。

```js
wx.previewImage({
  current: '', // 当前显示图片的http链接
  urls: [] // 需要预览的图片http链接列表
})
```

- `wx.getImageInfo(OBJECT)`获取图片信息

```js
wx.getImageInfo({
  src: 'images/a.jpg',
  success: function (res) {
    console.log(res.width)
    console.log(res.height)
  }
})

wx.chooseImage({
  success: function (res) {
    wx.getImageInfo({
      src: res.tempFilePaths[0],
      success: function (res) {
        console.log(res.width)
        console.log(res.height)
      }
    })
  }
})
```

## 录音

- `wx.startRecord(OBJECT)`开始录音。当主动调用wx.stopRecord，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。

**注：文件的临时路径，在小程序本次启动期间可以正常使用，如需持久保存，需在主动调用wx.saveFile，在小程序下次启动时才能访问得到。**

- `wx.stopRecord()` 主动调用停止录音。

```js
wx.startRecord({
  success: function(res) {
    var tempFilePath = res.tempFilePath
  },
  fail: function(res) {
     //录音失败
  }
})
setTimeout(function() {
  //结束录音
  wx.stopRecord()
}, 10000)
```

## 音频播放控制

- `wx.playVoice(OBJECT)`开始播放语音，同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。

```js
wx.startRecord({
  success: function(res) {
    var tempFilePath = res.tempFilePath
    wx.playVoice({
      filePath: tempFilePath,
      complete: function(){
      }
    })
  }
})
```

- `wx.pauseVoice()` 暂停正在播放的语音。再次调用wx.playVoice播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 wx.stopVoice。

```js
wx.startRecord({
  success: function(res) {
    var tempFilePath = res.tempFilePath
      wx.playVoice({
      filePath: tempFilePath
    })

    setTimeout(function() {
        //暂停播放
      wx.pauseVoice()
    }, 5000)
  }
})
```

- `wx.stopVoice()` 结束播放语音。

```js
wx.startRecord({
  success: function(res) {
    var tempFilePath = res.tempFilePath
    wx.playVoice({
      filePath:tempFilePath
    })

    setTimeout(function(){
      wx.stopVoice()
    }, 5000)
  }
})
```

## 音乐播放控制

- `wx.getBackgroundAudioPlayerState(OBJECT)`获取音乐播放状态。

```js
wx.getBackgroundAudioPlayerState({
    success: function(res) {
        var status = res.status
        var dataUrl = res.dataUrl
        var currentPosition = res.currentPosition
        var duration = res.duration
        var downloadPercent = res.downloadPercent
    }
})
```

- `wx.playBackgroundAudio(OBJECT)` 播放音乐，同时只能有一首音乐正在播放。

```js
wx.playBackgroundAudio({
    dataUrl: '',
    title: '',
    coverImgUrl: ''
})
```

- `wx.pauseBackgroundAudio()` 暂停播放音乐。

```js
wx.pauseBackgroundAudio()
```

- `wx.seekBackgroundAudio(OBJECT)` 控制音乐播放进度。

```js
wx.seekBackgroundAudio({
    position: 30
})
```

- `wx.stopBackgroundAudio()` 停止播放音乐。

- `wx.onBackgroundAudioPlay(CALLBACK)`监听音乐播放。

- `wx.onBackgroundAudioPause(CALLBACK)`监听音乐暂停。

- `wx.onBackgroundAudioStop(CALLBACK)`监听音乐停止。

## 文件

- `wx.saveFile(OBJECT)` 保存文件到本地。

```js
wx.startRecord({
  success: function(res) {
    var tempFilePath = res.tempFilePath
    wx.saveFile({
      tempFilePath: tempFilePath,
      success: function(res) {
        var savedFilePath = res.savedFilePath
      }
    })
  }
})
```

- `wx.getSavedFileList(OBJECT)` 获取本地已保存的文件列表

```js
wx.getSavedFileList({
  success: function(res) {
    console.log(res.fileList)
  }
})
```

- `wx.getSavedFileInfo(OBJECT)` 获取本地文件的文件信息

```js
wx.getSavedFileInfo({
  filePath: 'wxfile://somefile', //仅做示例用，非真正的文件路径
  success: function(res) {
    console.log(res.size)
    console.log(res.createTime)
  }
})
```

- `wx.removeSavedFile(OBJECT)` 删除本地存储的文件

```js
wx.getSavedFileList({
  success: function(res) {
    if (res.fileList.length > 0){
      wx.removeSavedFile({
        filePath: res.fileList[0].filePath,
        complete: function(res) {
          console.log(res)
        }
      })
    }
  }
})
```

- `wx.openDocument(OBJECT)` 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx

```js
wx.downloadFile({
  url: 'http://example.com/somefile.pdf',
  success: function (res) {
    var filePath = res.tempFilePath
    wx.openDocument({
      filePath: filePath,
      success: function (res) {
        console.log('打开文档成功')
      }
    })
  }
})
```

## 视频

- `wx.chooseVideo(OBJECT)` 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。

**注：文件的临时路径，在小程序本次启动期间可以正常使用，如需持久保存，需在主动调用 wx.saveFile，在小程序下次启动时才能访问得到。**

```js
<view class="container">
    <video src="{{src}}"></video>
    <button bindtap="bindButtonTap">获取视频</button>
</view>
Page({
    bindButtonTap: function() {
        var that = this
        wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: ['front','back'],
            success: function(res) {
                that.setData({
                    src: res.tempFilePath
                })
            }
        })
    }
})
```

## 音频组件控制
- `wx.createAudioContext(audioId)` 创建并返回 audio 上下文 audioContext 对象

```js
<!-- audio.wxml -->
<audio  src="{{src}}" id="myAudio" ></audio>

<button type="primary" bindtap="audioPlay">播放</button>
<button type="primary" bindtap="audioPause">暂停</button>
<button type="primary" bindtap="audio14">设置当前播放时间为14秒</button>
<button type="primary" bindtap="audioStart">回到开头</button>
// audio.js
Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  }
})
```

## 视频组件控制
- `wx.createVideoContext(videoId)`创建并返回 video 上下文 videoContext 对象

```html
<view class="section tc">
  <video id="myVideo" src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"   enable-danmu danmu-btn controls></video>
  <view class="btn-area">
    <input bindblur="bindInputBlur"/>
    <button bindtap="bindSendDanmu">发送弹幕</button>
  </view>
</view>
```

```js
function getRandomColor () {
  let rgb = []
  for (let i = 0 ; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  inputValue: '',
  bindInputBlur: function(e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  }
})
```

# 数据
每个微信小程序都可以有自己的本地缓存，可以通过 wx.setStorage（wx.setStorageSync）、wx.getStorage（wx.getStorageSync）、wx.clearStorage（wx.clearStorageSync）可以对本地缓存进行设置、获取和清理。本地缓存最大为10MB。

**注意： localStorage 是永久存储的，但是我们不建议将关键信息全部存在 localStorage，以防用户换设备的情况。**

`wx.setStorage(OBJECT)`

将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。

```js
wx.setStorage({
  key:"key"
  data:"value"
})
```

`wx.setStorageSync(KEY,DATA)`

将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。

```js
try {
    wx.setStorageSync('key', 'value')
} catch (e) {
}
```

`wx.getStorage(OBJECT)`

从本地缓存中异步获取指定 key 对应的内容。

```js
wx.getStorage({
  key: 'key',
  success: function(res) {
      console.log(res.data)
  }
})
```

`wx.getStorageSync(KEY)`
从本地缓存中同步获取指定 key 对应的内容。

```js
try {
  var value = wx.getStorageSync('key')
  if (value) {
      // Do something with return value
  }
} catch (e) {
  // Do something when catch error
}
```

`wx.getStorageInfo(OBJECT)`

异步获取当前storage的相关信息

```js
wx.getStorageInfo({
  success: function(res) {
    console.log(res.keys)
    console.log(res.currentSize)
    console.log(res.limitSize)
  }
})
```

`wx.getStorageInfoSync`

同步获取当前storage的相关信息

```js
try {
  var res = wx.getStorageInfoSync()
  console.log(res.keys)
  console.log(res.currentSize)
  console.log(res.limitSize)
} catch (e) {
  // Do something when catch error
}
```

`wx.removeStorage(OBJECT)`

从本地缓存中异步移除指定 key 。

```js
wx.removeStorage({
  key: 'key',
  success: function(res) {
    console.log(res.data)
  }
})
```

`wx.removeStorageSync(KEY)`

从本地缓存中同步移除指定 key 。

```js
try {
  wx.removeStorageSync('key')
} catch (e) {
  // Do something when catch error
}
```

`wx.clearStorage()`

清理本地数据缓存。

```js
wx.clearStorage()
```

`wx.clearStorageSync()`

同步清理本地数据缓存

```js
try {
    wx.clearStorageSync()
} catch(e) {
  // Do something when catch error
}
```

# 位置

`wx.getLocation(OBJECT)`获取当前的地理位置、速度。

```js
wx.getLocation({
  type: 'wgs84',
  success: function(res) {
    var latitude = res.latitude
    var longitude = res.longitude
    var speed = res.speed
    var accuracy = res.accuracy
  }
})
```

`wx.chooseLocation(OBJECT)` 打开地图选择位置

`wx.openLocation(OBJECT)` 使用微信内置地图查看位置
```js
wx.getLocation({
  type: 'gcj02', //返回可以用于wx.openLocation的经纬度
  success: function(res) {
    var latitude = res.latitude
    var longitude = res.longitude
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  }
})
```

# 设备

`wx.getNetworkType(OBJECT)` 获取网络类型。

```js
wx.getNetworkType({
  success: function(res) {
    var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
  }
})
```

`wx.getSystemInfo(OBJECT)`获取系统信息。

```js
wx.getSystemInfo({
  success: function(res) {
    console.log(res.model)
    console.log(res.pixelRatio)
    console.log(res.windowWidth)
    console.log(res.windowHeight)
    console.log(res.language)
    console.log(res.version)
  }
})
```

`wx.getSystemInfoSync()`获取系统信息同步接口

```js
try {
  var res = wx.getSystemInfoSync()
  console.log(res.model)
  console.log(res.pixelRatio)
  console.log(res.windowWidth)
  console.log(res.windowHeight)
  console.log(res.language)
  console.log(res.version)
} catch (e) {
  // Do something when catch error
}
```

`wx.onAccelerometerChange(CALLBACK)`监听重力感应数据，频率：5次/秒

```js
wx.onAccelerometerChange(function(res) {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

`wx.onCompassChange(CALLBACK)`监听罗盘数据，频率：5次/秒

```js
wx.onCompassChange(function (res) {
  console.log(res.direction)
})
```

`wx.makePhoneCall(OBJECT)`

```js
wx.makePhoneCall({
  phoneNumber: '1340000' //仅为示例，并非真实的电话号码
})
```

# 界面

## 交互反馈

`wx.showToast(OBJECT)`显示消息提示框

```js
wx.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
```

`wx.hideToast()`隐藏消息提示框

```js
wx.showToast({
  title: '加载中',
  icon: 'loading',
  duration: 10000
})

setTimeout(function(){
  wx.hideToast()
},2000)
```

`wx.showModal(OBJECT)`​显示模态弹窗

```js
wx.showModal({
  title: '提示',
  content: '这是一个模态弹窗',
  success: function(res) {
    if (res.confirm) {
      console.log('用户点击确定')
    }
  }
})
```

`wx.showActionSheet(OBJECT)` ​显示操作菜单

```js
wx.showActionSheet({
  itemList: ['A', 'B', 'C'],
  success: function(res) {
    if (!res.cancel) {
      console.log(res.tapIndex)
    }
  }
})
```

## 设置导航条

`wx.setNavigationBarTitle(OBJECT)`动态设置当前页面的标题。

```js
wx.setNavigationBarTitle({
  title: '当前页面'
})
```

`wx.showNavigationBarLoading()`在当前页面显示导航条加载动画。

`wx.hideNavigationBarLoading()`隐藏导航条加载动画。

## 导航

`wx.navigateTo(OBJECT)`保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。

```js
wx.navigateTo({
  url: 'test?id=1'
})
//test.js
Page({
  onLoad: function(option){
    console.log(option.query)
  }
})
```

**注意：为了不让用户在使用小程序时造成困扰，我们规定页面路径只能是五层，请尽量避免多层级的交互方式。**

`wx.redirectTo(OBJECT)`关闭当前页面，跳转到应用内的某个页面。

```js
wx.redirectTo({
  url: 'test?id=1'
})
```

`wx.navigateBack(OBJECT)`关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。

## 动画

`wx.createAnimation(OBJECT)`创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法导出动画数据传递给组件的animation属性。

**注意: export 方法每次调用后会清掉之前的动画操作**

```js
var animation = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})
```

`animation`动画实例可以调用以下方法来描述动画，调用结束后会返回自身，支持链式调用的写法。

`动画队列`调用动画操作方法后要调用 step() 来表示一组动画完成，可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。step 可以传入一个跟 wx.createAnimation() 一样的配置参数用于指定当前组动画的配置。

```js
Page({
  data: {
    animationData: {}
  },
  onShow: function(){
    var animation = wx.createAnimation({
      duration: 1000,
        timingFunction: 'ease',
    })

    this.animation = animation

    animation.scale(2,2).rotate(45).step()

    this.setData({
      animationData:animation.export()
    })

    setTimeout(function() {
      animation.translate(30).step()
      this.setData({
        animationData:animation.export()
      })
    }.bind(this), 1000)
  },
  rotateAndScale: function () {
    // 旋转同时放大
    this.animation.rotate(45).scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateThenScale: function () {
    // 先旋转后放大
    this.animation.rotate(45).step()
    this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScaleThenTranslate: function () {
    // 先旋转同时放大，然后平移
    this.animation.rotate(45).scale(2, 2).step()
    this.animation.translate(100, 100).step({ duration: 1000 })
    this.setData({
      animationData: this.animation.export()
    })
  }
})
```

## 绘图

`wx.createContext()`创建并返回绘图上下文context对象。

context只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟`<canvas/>`不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个`<canvas/>`。

```js
// 假设页面上有3个画布
var canvas1Id = 3001
var canvas2Id = 3002
var canvas3Id = 3003

var context = wx.createContext();

[canvas1Id, canvas2Id, canvas3Id].forEach(function (id) {
  context.clearActions()
  // 在context上调用方法
  wx.drawCanvas({
    canvasId: id,
    actions: context.getActions()
  })
})
```

## 其他

`wx.hideKeyboard()`收起键盘

`wx.stopPullDownRefresh()`停止当前页面下拉刷新。

# 开发接口

## 登录
`wx.login(OBJECT)`调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）。用户数据的加解密通讯需要依赖会话密钥完成。

```js
//app.js
App({
  onLaunch: function() {
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
})
```

### code 换取 session_key

 这是一个 HTTP 接口，开发者服务器使用登录凭证 code 获取 session_key 和 openid。其中 session_key 是对用户数据进行加密签名的密钥。为了自身应用安全，session_key 不应该在网络上传输。

**接口地址：**

 https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

```js
//正常返回的JSON数据包
{
      "openid": "OPENID",
      "session_key": "SESSIONKEY"
      "expires_in": 2592000
}
//错误时返回JSON数据包(示例为Code无效)
{
    "errcode": 40029,
    "errmsg": "invalid code"
}
```
