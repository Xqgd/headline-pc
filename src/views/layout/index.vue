<template> 
    <el-container class="layout-container">
    <el-aside
      class="aside"
      :width="isCollapse ? '64px' : '200px'"
    >
      <Aside class="aside-mebu" :isCollapse="isCollapse"></Aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <Header 
          :user="user"
          @onShow="isCollapse = ! isCollapse"
          :isCollapse="isCollapse"
          @logout="onlogout"
        ></Header>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from './components/Aside.vue'
import Header from './components/header.vue'
import {getUserProfile} from '@/api/user'
import golbalBus from '@/utils/global-bus'
export default {
  name: 'LayoutIndex',
  components: {
    Aside,
    Header
  },
  props: {},
  data () {
    return {
      user:{},
      isCollapse:false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
     golbalBus.$on('update-user',(data) => {
      console.log(data);
      this.user = data
    })
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      const {data:res} =await getUserProfile()
      this.user = res.data
    },
    onlogout(){
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')

        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
  })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;
  .aside-mebu{
    height: 100%;
  }
}

.header {
  // background-color: #b3c0d1;
  border-bottom: 1px solid #ccc;
}

.main {
  background-color: #e9eef3;
}
</style>