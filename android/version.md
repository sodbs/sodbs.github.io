---
outline: deep
---

# 更新日志
::: warning
[![](https://jitpack.io/v/sodbs/esurvey_sdk.svg)](https://jitpack.io/#sodbs/esurvey_sdk)
:::


| 版本名称       | 日期         |        备注 |
| ----------- | ----------- | ----------- |
| 0.1      | 2024-11-01       |   初版    |
| 0.2     | 2024-11-02       |       |
| 0.3     | 2024-11-03       |       |
| 0.4     | 2024-11-05       |  添加手机高精度     |
| 0.5     | 2024-11-06       |  修改天线Vrs相关问题     |
| 0.6     | 2024-11-06       |  修改天线Vrs相关问题     |
| 0.7     | 2024-11-08       |  去除不需要的依赖     |
| 0.9     | 2024-11-14       |  添加激光测距功能     |
| 0.91     | 2024-1118       |  启用授权     |
| 0.95     | 2024-1124       |  解决天线蓝牙连接下，无法进入固定解的问题     |
| 。。。     | 。。。       |  。。。    |
| 0.99     | 2024-12-08       |  支持单北斗设备， 波特率更换为115200    |
| 1.0     | 2024-12-09       |  解决不开蓝牙的情况下，会闪退的bug    |
| 1.1     | 2024-12-09       |  解决蓝牙模式下无法使用激光测距的Bug    |
| 1.2     | 2024-12-13       |  手机高精度默认放根目录    |


## V1.0 更新指南
- 0.95以后，只需要更改版本号即可更新,无需代码改动
- 0.95~0.99 版本可能会有`闪退`的风险，请更新到1.0
- 0.99版本以后波特率更新为115200，手头设备需要同步更新

## V0.95更新指南
### 概述
- 去除了 https://github.com/aicareles/Android-BLE ` 引入了 ` https://github.com/dariuszseweryn/RxAndroidBle 。如果有冲突请及时exclued
### 更新指南
1. 搜索蓝牙, 去除了直接暴露BLE对象, 蓝牙会默认搜索`5`秒
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
```kotlin
instance.stopBluetoothScan()
```

3. 蓝牙连接方法(bluetoothConnect)删除BleDevice的重载，新增BluetoothInfo的重载
