<template>
  <div class="header-container">
    <div>
      <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" 
        @click="onShow"></i>
      <span>头条管理系统</span>
    </div>
    <el-dropdown>
      <div class="avatar-wrap">
        <img class="avatar" :src="user.photo" alt="">
        <span>{{user.name}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <el-dropdown-item @click.native="$emit('logout')">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>

export default {
  name: 'AppHeader',
  components: {},
  props: {
    user:{
      type: Object   
    },
    isCollapse:{
      type: Boolean
    }
  },
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  created () {
   
  },
  mounted () {},
  methods: {
    onShow () {
      this.$emit('onShow')
    }
  }
}
</script>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>