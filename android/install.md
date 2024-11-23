---
outline: deep
---

# 通过Gradle集成SDK
## 在工程级别的settings.gradle 添加 JitPack 仓库
- project/settings.gradle 
- 老版本在 project/build.gradle 下添加
```Groovy{3,18}
pluginManagement {
    repositories {
        maven { url  = uri("https://jitpack.io" )}
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven { url  = uri("https://jitpack.io" )}
        google()
        mavenCentral()
    }
}

rootProject.name = "esurvey_sdk_demo"
include ':app'

```

## 在项目级别build file 添加易测SDK依赖
[![](https://jitpack.io/v/sodbs/esurvey_sdk.svg)](https://jitpack.io/#sodbs/esurvey_sdk)
```Groovy
// 版本号看上方图标后面写的多少 jitpack:版本号 如 0.95
implementation 'com.github.sodbs:esurvey_sdk:TAG'  // 版本号看上方图标后面写的多少 jitpack:版本号 如 0.95
```
## 在AndroidManifest.xml中添加权限（需要添加运行时权限）
```xml
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```
## 将下方deivece_file.xml文件复制到 app/src/main/res/xml文件夹下
[点击查看device_file.xml文件](https://github.com/sodbs/esurvey_sdk/blob/main/app/src/main/res/xml/device_filter.xml)

## 在AndroidManifest.xml 中 application/activity标签下面添加usb action 和 maer-data
- [AndroidManifest.xml](https://github.com/sodbs/esurvey_sdk/blob/main/app/src/main/AndroidManifest.xml)
```xml{13-18}
    <application
        ...>
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.Esurvey_sdk_demo">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <intent-filter>
                <action android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED" />
            </intent-filter>
            <meta-data
                android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED"
                android:resource="@xml/device_filter" />
        </activity>
    <application/>
```

## 在AndroidManifest.xml 中 application标签下添加 receiver
```xml{7-13}
 <application
        ...>
        <activity
            ...>
             ...
        </activity>
        <receiver android:name="com.esurvey.sdk.out.service.UsbAntennaReceiver"                 android:exported="true">
            <intent-filter>
                <action android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED"/>
                <action android:name="android.hardware.usb.action.USB_DEVICE_DETACHED"/>
            </intent-filter>
        </receiver>
    </application>
```