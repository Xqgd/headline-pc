<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="粉丝列表" name="first">
             <div class="fans_contain">
              <div class="fans_item"
                v-for="(item,index) in followers"
                :key="index"
              >
                <el-image
                  class="fans_photo"
                  style="height: 100px"
                  :src="item.photo"
                  fit="cover"
                ></el-image>
                <div class="fans_name">
                  <span>{{item.name}}</span>
                </div>
                <el-button
                  class="fans_btn"
                  type="primary"
                  size="mini" 
                  plain
                >+关注</el-button>
              </div>
            </div>
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="total_count"
              :current-page.sync="page"
              @current-change="onCurrentChange">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="粉丝画像" name="second">配置管理</el-tab-pane>
        </el-tabs>
      </div>
     
      
    </el-card>
  </div>
</template>

<script>
import { getFollowers } from '@/api/followers'
export default {
  name: 'FansIndex',
  data(){
    return {
      activeName: 'first',
      followers: [],
      total_count: 0,
      pageSize: 10,
      page: 1
    }
  },
  created() {
    this.loadFollowers()
  },
  methods: {
    async loadFollowers (page=1) {
      this.page = page
      const {data:res} = await getFollowers()
      this.followers = res.data.results
      this.total_count = res.data.total_count
    },
    onCurrentChange(page) {
      this.loadImages(page)
    },
    handleClick(){

    }
  }
  
}
</script>

<style lang="less" scoped>
.fans_contain{
  display: flex;
  
  .fans_item{
    margin: 10px 30px 20px 0;
    border: 1px solid #ccc;
    .fans_photo{
      margin: 10px;
      border-radius: 50%;
      overflow: hidden;
      width: 100px;
      height: 100px;
    }
    .fans_name{
      font-size: 14px;
      line-height: 20px;
      text-align: center;
    }
    .fans_btn{
      margin: 10px 20px 10px 30px;
    }
  }
}
</style>

