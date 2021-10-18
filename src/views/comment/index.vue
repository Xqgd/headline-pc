<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数" width="180">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"> </el-table-column>
        <el-table-column prop="address" label="评论状态">
         <template slot-scope="scope">
           {{scope.row.comment_status ? '正常': '关闭'}}
         </template>
        </el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
            <!-- 开关组件绑定的数据是一个布尔值，它会根据布尔值的真假来决定开关状态 -->
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30,50]"
        :page-size.sync="pageSize"
        :total="total_count"
        :current-page.sync="page"
        @current-change="onCurrentChange"
        @size-change="handleSizeChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, upDateComment} from '@/api/article'
export default {
  name: "CommentIndex",
  components: {},
  props: {},
  data() {
    return {
      articles: [],
      pageSize: 10,
      page: 1,
      total_count: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles()
  },
  methods: {
    async loadArticles (page = 1) {
      this.page = page
      const {data:res} = await getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      })
      this.total_count = res.data.total_count
      const {results} =  res.data
      results.forEach(article => {
        article.statusDisabled = false
      })
      this.articles = results
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    handleSizeChange () {
      this.loadArticles(1)
    },
    onStatusChange (article) {
      article.statusDisabled = true
      const articleId = article.id.toString()
      upDateComment(articleId, article.comment_status).then(() =>{
        article.statusDisabled = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>

