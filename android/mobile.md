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

# 安装
- 如需使用手机高精度，需添加额外的依赖
## settings.gradle 添加 本地 libs文件夹
```Groovy{5,14}
pluginManagement {
    repositories {
        xxx
        flatDir {
            dirs("libs")
        }
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        xxx
        flatDir {
            dirs("libs")
        }
    }
}
```

## 拷贝Demo中 libs下的aar
- [Demo地址](https://github.com/sodbs/esurvey_sdk)

## gradle 文件中添加依赖
```Groovy
implementation 'joda-time:joda-time:2.10.6'
implementation 'com.blankj:utilcodex:1.31.1'
implementation(name: 'rtk-debug', ext: 'aar')
```

## AndroidManifest.xml 中添加广播
```xml{3-11}
<application>
    ...
    <receiver android:name="com.esurvey.sdk.out.service.MobileHighLocationReceiver"
        android:exported="true">
        <intent-filter>
            <action android:name="cn.programmer.CUSTOM_INTENT" />
            <action android:name="cn.programmer.CUSTOM_INTENT_1" />

            <action android:name="cn.programmer.CUSTOM_INTENT_LOCATION" />
        </intent-filter>
    </receiver>
</application>
```

# 使用手机高精度
- 示例：[MainActivity](https://github.com/sodbs/esurvey_sdk/blob/main/app/src/main/java/com/esurvey/esurvey_sdk_demo/MainActivity.kt)

## 实例化ESurvey对象
```kotlin{2}
class MainActivity : ComponentActivity() {
    val instance = ESurvey.getInstance()
    ...
}
```

## 设置Key
- 全局设置一次即可, 请在App初始化中传入，可在Application或者主Activity中Oncreate方法传入。Key值请向问北位置平台申请, 使用SDK前必须传入Key
```kotlin
ESurvey.getInstance().setKey(Api.key)
```

## 运行时权限请求 （外部存储权限，所有文件访问权限）
- Xml配置
```xml
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE"
        tools:ignore="ScopedStorage" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```
- Api29+ 需要  `requestLegacyExternalStorage`
```xml{3}
<application
    ...
    android:requestLegacyExternalStorage="true">
    ....
</application>
```
- 运行时权限
```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    if (Environment.isExternalStorageManager()) {
        start()
    } else {
        // 无权限，打开权限设置界面
        XPopup.Builder(this@MainActivity)
            .asConfirm("请先授予文件权限", "请先授予文件权限", "", "确定", {
                try {
                    val intent = Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION)
                    ActivityUtils.getTopActivity().startActivity(intent)
                } catch (e: Exception) {
                    val intent = Intent(Settings.ACTION_SETTINGS)
                    this@MainActivity.startActivity(intent)
                }
            }, {}, true)
            .show()
    }
    } else {
    PermissionUtils.permission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, android.Manifest.permission.READ_EXTERNAL_STORAGE)
        .callback(object : PermissionUtils.SimpleCallback {
            override fun onGranted() {
                start()
            }

            override fun onDenied() {
                XPopup.Builder(this@MainActivity)
                    .asConfirm("请先授予文件权限", "请找到本App,并且打开文件权限", "", "确定", {
                        PermissionUtils.launchAppDetailsSettings()
                    }, {}, true)
                    .show()
            }
        }).request()
}
```

## 添加位置信息监听器（与天线版本是同一个）
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
| height   | 高层        |        |
| yInaccuracies   | 高层误差        |        |
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


## 添加手机高精度状态监听器
- 其中 onPlaySounds 回调中可播放声音，请在Demo中复制声音文件
- onChange回调中，如果status 等于 Constant.MOBILE_HIGH_CLOSE 表示高精度`被迫`关闭（如无法结算等）
```kotlin
instance.setOnMobileHighStatusChangeListener(object : ESMobileHighStatusListener {
    override fun onChange(status: Int) {
        // 
        if (status == Constant.MOBILE_HIGH_OPEN) {
            // 高精度启动
            mobileHighIsStart = true
        } else {
            // 高精度被迫结束
            mobileHighIsStart = false
        }
    }

    override fun onPlaySounds(soundType: Int) {
        TipsSoundsService.getInstance().playJtSounds(soundType)
    }
})
```


## 启动高精度定位
- 在V1.5版本有不兼容更新
- context
- hostAppUserId: 用户在贵司平台的UserId(宿主App的UserId)
- sdkToken: 先获取AppToken，再由AppToken获取SDkTOken  [AppToken获取方法](https://open.sobds.com/234680651e0) [SDKToken获取方法](https://open.sobds.com/234680651e0)
```kotlin
val hostAppUserId = "" 用户在贵司平台的UserId
val sdkToken = ""  [SDKToken获取方法](https://open.sobds.com/234680651e0)
instance.startMobileHighLocation(this@MainActivity, hostAppUserId, sdkToken)
```

## 结束高精度定位
- 不使用时请调用此方法结束，`否则可能内存泄漏`
```kotlin
    instance.stopMobileHighLocation()

```


