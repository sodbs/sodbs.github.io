---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "易测"
  text: "Esurvey"
  tagline: 易测宝是基于HNCORS和全省FM台站系统的一款低成本、便捷式北斗高精度定位终端，通过配合易测APP即插即用，提供全省覆盖、全天候、低时延、免流量的实时厘米级定位服务。
  image:
    src: /logo.svg
    alt: Esurvey
  actions:
    - theme: brand
      text: 快速开始
      link: /overview
    - theme: alt
      text: Android Examples
      link: /android/readme

features:
  - icon: 📏
    title: 高精度
    details: 多星座双频GNSS模块，基于HNCORS高精度数据处理算法，实现稳定可靠实时厘米级定位精度
  - icon: 🌐
    title: 全覆盖
    details: 基于FM台站系统播发差分信息，实现全省范围（含深山区/湖区/低空等移动通讯盲区）服务全面覆盖
  - icon: 📉
    title: 低成本
    details: 即插即用，无需配置，终身免通讯流量费和差分数据服务费，无后期使用成本。
  - icon: 🛡️
    title: 高安全
    details: 基于FM单向广播，涉密数据和隐私信息无法对外通过互联网传输，确保地理信息安全。
---

<style>
/* :root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
} */

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>