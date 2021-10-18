import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'

import "nprogress/nprogress.css";

// 加载 element 组件库
import ElementUI from 'element-ui'

// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import { ElementTiptapPlugin } from 'element-tiptap';
// import element-tiptap 样式
import 'element-tiptap/lib/index.css';

// 安装 element-tiptap 插件
Vue.use(ElementTiptapPlugin, { /* 插件配置项 */ lang: 'zh' })

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
