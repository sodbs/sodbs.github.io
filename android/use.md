---
outline: deep
---

# 请向问北平台申请Key和secret
- 使用SDK需要获取SDKToken, 文档如下  [AppToken获取方法](https://open.sobds.com/234680651e0) [SDKToken获取方法](https://open.sobds.com/234680651e0)
- secret 不应该放在客户端，应该放在服务端
- 如有问题，请查看Demo

# Demo
- 示例：[MainActivity](https://github.com/sodbs/esurvey_sdk/blob/main/app/src/main/java/com/esurvey/esurvey_sdk_demo/MainActivity.kt)
- 本地运行Demo需要在 com.esurvey.esurvey_sdk.utils.Api 里面 填写自己申请的Key 和 secret


## 实例化ESurvey对象
```kotlin{2}
class MainActivity : ComponentActivity() {
    val instance = ESurvey.getInstance()
    ...
}
```

## 设置Key (v1.5新增)
- 全局设置一次即可, 请在App初始化中传入，可在Application或者主Activity中Oncreate方法传入。Key值请向问北位置平台申请, 使用SDK前必须传入Key
```kotlin
ESurvey.getInstance().setKey(Api.key)
```

## 运行时权限请求
```kotlin
val permissions: MutableList<String> = ArrayList()
permissions.add(android.Manifest.permission.ACCESS_COARSE_LOCATION)
permissions.add(android.Manifest.permission.ACCESS_FINE_LOCATION)

if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
    permissions.add(android.Manifest.permission.BLUETOOTH_SCAN)
    permissions.add(android.Manifest.permission.BLUETOOTH_ADVERTISE)
    permissions.add(android.Manifest.permission.BLUETOOTH_CONNECT)
}

PermissionUtils.permission(
    *permissions.toTypedArray()
)
.callback(object : PermissionUtils.FullCallback {
    override fun onGranted(granted: MutableList<String>) {
        permissionFlag = true
    }

    override fun onDenied(
        deniedForever: MutableList<String>,
        denied: MutableList<String>
    ) {
        permissionFlag = false
    }

})
.request()
```

## 添加授权监听器
- isAuthentication 认证是否通过，如果为false, 请提示用户认证失败，在失败的情况下，天线将`不会`吐定位数据
```kotlin
instance.setOnAntennaAuthListener(object: ESAntennaAuthListener {
    override fun onAuthentication(
        isAuthentication: Boolean,
        message: String
    ) {
        if (!isAuthentication) {
            ToastUtils.showLong("认证失败: ${message}")
        }
    }

})
```


## 添加位置改变监听器
```kotlin
instance.setOnLocationStateChangeListener(object : ESLocationChangeListener {
    override fun onChange(locationStateParam: LocationState) {
        // locationStateParam 位置信息
    }
})
```
### LocationState对象解析
| 参数名       | 解析         |        备注 |
| ----------- | ----------- | ----------- |
| lon      | 经度       |       |
| lat   | 纬度        |        |
| height   | 高程        |        |
| yInaccuracies   | 高程误差        |        |
| xInaccuracies   | 水平误差        |        |
| locationShow   | 格式化后的经纬度显示，保留7位小数后拼在了一起        |   String.format("%.7f", lat) + " , " + String.format("%.7f", lon)     |
| pdop   | pdop        |        |
| satelliteNum   | 解算卫星数量        |        |
| locationStatus   | 定位状态        |  1: 单点解 2: 伪距差分 4: 固定解 5: 浮点解 6:组合定位      |
| locationStatusShow   | 解析后的定位状态，返回中文        |  如：固定解  |
| source   | 数据来源        |  1: 外接天线 2: 手机自带Rtk  |
| antennaDataSource   | 天线数据来源        |  1: Type-c 2: 蓝牙  |
| isNetworkDiffSync   |  网络查分数据是否参与了解算        |  true: 参与了解算 false: 未参与解算-数据仅来源FM  |
| gga   | gga        |  gga原始数据  |
| nrtk014   | 天线原始数据        |  天线原始数据  |


## 添加天线启动/断开监听器
### 连接启动
- source 消息据来源 1: Type-c 2: 蓝牙 `比如如果source=Constant.ANTENNA_SOURCE_BLUETOOTH(2)表示是蓝牙连接/启动成功或失败`
- isConnectSuccess 是否连接成功
- isStartSuccess  是否启动成功
- message 提示信息
```kotlin
instance.setOnAntennaConnectListener(object : ESAntennaConnectListener {
    override fun onChange(
        source: Int, //消息据来源 1: Type-c 2: 蓝牙
        isConnectSuccess: Boolean, // 是否连接成功
        isStartSuccess: Boolean, // 是否启动成功
        message: String // 提示信息
    ) {
        ...
    }
})
```
### 断联
- disConnectSource 表示是哪种方式断联
```kotlin
instance.setOnAntennaDisConnectListener(object : ESAntennaDisConnectListener {
    override fun onDisConnect(disConnectSource: Int) {
        if (!instance.blueToothStatus && !instance.usbConnectStatus) {
            locationSource = -1
            isStartSuccessState = false
            messageState = "设备已断开链接"
            isConnectSuccessState = false
            locationState = null

        }
        if (disConnectSource == Constant.ANTENNA_SOURCE_BLUETOOTH) {
            bluetoothFlag = false
            if (instance.usbConnectStatus) {
                locationSource = Constant.ANTENNA_SOURCE_USB
                ToastUtils.showLong("已自动切换到USB方式")
                messageState = "已自动切换到USB方式"
            }
        } else {
            usbFlag = false
            ToastUtils.showLong("USB已断开")
            if (instance.blueToothStatus) {
                locationSource = Constant.ANTENNA_SOURCE_BLUETOOTH
                ToastUtils.showLong("已自动切换到蓝牙方式")
                messageState = "已自动切换到蓝牙方式"

            }
        }
    }
})
```


## TypeC 方式
### 添加 usb 挂载监听器
isAttach： 是否监听到Type-C挂载
```kotlin
instance.setOnUsbAttachChangeListener(object : ESUsbAttachChangeListener {
    override fun onChange(isAttach: Boolean) {
        // isAttach 是否挂载成功
    }
})
```


### 连接启动天线 (V1.5版本有更新，新增了两个参数)
- context
- lon 经度
- lat 纬度
- autoBluetoothFlag 是否自动连接蓝牙 `如果传true, SDK将在Usb模式启动完成后自动连接蓝牙`
- hostAppUserId: 用户在贵司平台的UserId(宿主App的UserId)
- sdkToken: 先获取AppToken，再由AppToken获取SDkTOken  [AppToken获取方法](https://open.sobds.com/234680651e0) [SDKToken获取方法](https://open.sobds.com/234680651e0)
```kotlin
instance.usbConnect(context, lon, lat, autoBluetoothFlag, hostAppUserId, sdkToken)
```


## 蓝牙方式
- 注： 蓝牙使用 [RxBLE库](https://github.com/dariuszseweryn/RxAndroidBle) 不再使用AndroidBLE依赖 (0.95版本修改)
- 使用蓝牙前，需要先提示用户打开蓝牙
```kotlin
val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
if (bluetoothAdapter == null) {
    // 设备不支持蓝牙
    Toaster.show("设备不支持蓝牙")
} else if (!bluetoothAdapter.isEnabled()) {
    // 蓝牙未启用
    Toaster.show("请先开启蓝牙")
    return
}
```
### 自动连接
- usb方式启动时候，autoBluetoothFlag 为 true 可自动连接蓝牙
### 主动连接 
1. 搜索蓝牙, 将搜索到的设备保存起来，用于显示 蓝牙会默认搜索`5`秒
- BluetoothInfo-> name: 蓝牙名称, address: 地址
- 建议展示蓝牙列表前先用名称过滤

```kotlin
instance.startBluetoothScan(this@MainActivity,
    object : ESBluetoothScanResultListener {
        override fun onChange(info: BluetoothInfo) {
            if (bluetoothDeviceList.find { it -> it.name == info.name } == null) {
                bluetoothDeviceList.add(info)
            }
        }
})
```
2. 主动停止蓝牙搜索
```
instance.stopBluetoothScan()
```
3. 蓝牙连接 (V1.5版本有更新，新增了两个参数)
- context
- bluetoothInfo: 搜索到的蓝牙设备
- lon
- lat
- hostAppUserId: 用户在贵司平台的UserId(宿主App的UserId)
- sdkToken: 先获取AppToken，再由AppToken获取SDkTOken  [AppToken获取方法](https://open.sobds.com/234680651e0) [SDKToken获取方法](https://open.sobds.com/234680651e0)
```kotlin
instance.bluetoothConnect(context, bluetoothInfo, lon, lat, hostAppUserId, sdkToken)
```
4. 也可以使用蓝牙名称进行连接
- bluetoothName 蓝牙名称
```kotlin
instance.bluetoothConnect(context, bluetoothName, lon, lat, hostAppUserId, sdkToken)

```
5. 在`天线启动/断开监听器`中查看连接状态



## 激光测距
### 测距使能
- 必须使能成功后才可使用测距功能
```kotlin
instance.enableMeasure(object: ESAntennaMeasureEnableListener {
    override fun onStart() {
        measureFlag = true
        ToastUtils.showLong("激光测距已可用")
    }
})
```
### 测距
- isSuccess 测量是否成功
- distance  测量值，单位毫米
```kotlin
   instance.measure(object: ESAntennaMeasureListener {
    override fun onMeasure(
        isSuccess: Boolean,
        distance: String
    ) {
        if (isSuccess) {
            ToastUtils.showLong("距离${distance}毫米")
            messageState = "距离${distance}毫米"
        } else {
            ToastUtils.showLong("测量失败")
        }
    }
})
```

### 停止测距
- 退出测距功能时，需要调用此方法，否则天线会耗电很快
```kotlin
instance.disableMeasure()
```