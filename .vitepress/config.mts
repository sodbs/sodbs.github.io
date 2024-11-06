import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "易测",
  description: "易测",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    footer: {
      message: '湖南测绘科技研究所版权所有',
      copyright: 'Copyright © 2019-present'
    },
    sidebar: [
      {
        text: '操作手册',
        items: sidebarGuide()
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sodbs/esurvey_sdk' }
    ]
  }
})

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    { text: '概述', link: 'overview' },
    {
      text: 'AndroidSDK',
      collapsed: false,
      items: [
        { text: '接入前必读', link: 'android/readme' },
        { text: '安装', link: 'android/install' },
        { text: '使用（天线）', link: 'android/use' },
        { text: '使用（手机高精度）', link: 'android/mobile' },
        { text: '更新日志', link: 'android/version' },
        // { text: '测试', link: 'markdown-examples' },
      ]
    },
    {
      text: '小程序SDK',
      collapsed: true,
      items: [
        { text: '敬请期待', link: 'joker' },
      ]
    },
    {
      text: 'JSSDK',
      collapsed: true,
      items: [
        { text: '敬请期待', link: 'joker' },
      ]
    },

  ]
}
