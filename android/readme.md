---
outline: deep
---

# 完整Demo地址
- https://github.com/sodbs/esurvey_sdk
# 请勿直接使用aar文件本地引入
- 请使用Gradle方式引入
# SDK依赖项目
- SDK开发过程中，使用了如下依赖，如果宿主APP使用了同一个依赖，会有冲突，请使用`exclude`方法排除
- V0.95去掉了AndroidBLE依赖，引入了RxAndroidBle
```Groovy
implementation 'com.github.mik3y:usb-serial-for-android:3.2.0'
implementation 'io.reactivex.rxjava2:rxandroid:2.0.1'
implementation 'io.reactivex.rxjava2:rxjava:2.2.17'
implementation 'com.polidea.rxandroidble2:rxandroidble:1.19.0'

```
# SDK常量定义如下
```java
public class Constant {

    public static String TAG =  "ESSDK";

    /**
     * 定位来源 1: 天线 2:手机自带RTK
     */
    public static int LOCATION_SOURCE_ANTENNA =  1;
    public static int LOCATION_SOURCE_MOBILE =  2;

    /**
     * 天线数据来源 1: Type-c 2: 蓝牙
     */
    public static int ANTENNA_SOURCE_USB =  1;
    public static int ANTENNA_SOURCE_BLUETOOTH =  2;



}
```
