<template>
  <div class="article-container">
    <el-card class="filter-card">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      </el-breadcrumb>

       <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null" >全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option 
              v-for="item in channels"
              :key="item.id"
              :label="item.name" 
              :value="item.id"
            ></el-option>
            
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"  
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="loading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
     <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{total_count}}条结果：
      </div>
      <!-- 数据列表 -->
      <el-table
        v-loading="loading"
        :data="articles"
        stripe
        style="width: 100%"
        class="list-table"
        size="mini"
      >
        <el-table-column
          prop="date"
          label="封面"
        >
          <template slot-scope="scope">
            <!-- <img v-if="scope.row.cover.images[0]"
             class="article_cover" :src="scope.row.cover.images[0]" alt="">
             <img v-else class="article_cover" src="./no-cover.jpg" alt=""> -->
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.cover.images[0]"
                fit="cover"
              ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="small" 
              icon="el-icon-edit" 
              circle
              type="primary"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDelete(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->

      <!-- 列表分页 -->
      <el-pagination
        :disabled="loading"
        layout="prev, pager, next"
        background
        :total="total_count"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onCurrentChange">
      </el-pagination>
      <!-- /列表分页 -->
    </el-card>
  </div>
</template>

<script>
import { getArticles , getArticlesChannel ,delArticles } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {},
      articles: [],
      total_count: 0,
      pageSize: 10,
      status: null,
      channels: [],
      channelId: null,
      rangeDate: [],
      loading: false,
      page: 1 //当前页面
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
    this.loadChannel()
  },
  mounted () {},
  methods: {
    async loadArticle (page = 1) {
      this.loading = true
      
      const {data:res} = await getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      })
      this.articles = res.data.results
      this.total_count = res.data.total_count
      this.loading = false
      
    },
    onSubmit (){
      this.loadArticle()
    },
    onCurrentChange(page){
      this.loadArticle(page)
    },
    async loadChannel () {
      const {data:res} = await getArticlesChannel()
      this.channels = res.data.channels
    },
    onDelete(articleId){
      
       this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
         delArticles(articleId).then( ()=>{
           
          this.loadArticle(this.page)
         })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}
.article_cover{
  width: 100px;
  height: 70px;
  background-size: cover;
}
</style>