<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <ImageList />
    </el-card>
  </div>
</template>

<script>
import ImageList from './components/imageList.vue'
export default {
  name: 'ImageIndex',
  components: {
    ImageList
  },
  data () {
    return {

    }
  },
  created () {
 
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>

