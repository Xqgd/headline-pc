<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="publish_form" :rules="fromRules" :model="article" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap 
            v-model="article.content"
            :extensions="extensions"
            height="350"
            placeholder="请输入文章内容"
          ></el-tiptap>
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <UploadCover 
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              v-model="article.cover.images[index]"  
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option 
              v-for="item in channels"
              :key="item.id"
              :label="item.name" 
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">
            {{this.$route.query.id ? '修改':'发布'}}
          </el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>  
  </div>
</template>

<script>
import UploadCover from './component/UploadCover.vue'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor
} from 'element-tiptap'
import { uploadImage } from '@/api/image'
import { getArticlesChannel, addArticle, getArticle, updateArticle } from '@/api/article'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
      article: {
        title: '',
        content: '',
        cover: {//文章封面
          type: 0,//封面类型 -1自动 0 无图 1一张 3 三张
          images: []
        },
        channel_id: null,
      },
      channels:[],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image',file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })

          }
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor()
      ],
      fromRules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
          ],
          content: [
            // { required: true, message: '请输入文章内容', trigger: 'change' }
            {
              validator (rule, value, callback) {
                console.log('content validator')
                if (value === '<p></p>') {
                  // 验证失败
                  callback(new Error('请输入文章内容'))
                } else {
                  // 验证通过
                  callback()
                }
              }
            },
            { required: true, message: '请输入文章内容', trigger: 'blur' }
          ],
          channel_id: [
            { required: true, message: '请选择文章频道' }
          ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannel()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    async loadChannel () {
      const {data:res} = await getArticlesChannel()
      this.channels = res.data.channels
    }, 
    onPublish (draft = false ) {
      this.$refs.publish_form.validate(valid => {
        if (!valid) {
          return
        }
        const articleId = this.$route.query.id
        if (articleId) {
          updateArticle(articleId, this.article, draft).
          then( res => {
              console.log(res);
              if (draft){
              this.$message.success("存入草稿成功")
              }else{
                this.$message.success("修改成功")
              }
            }
          )
        }else {
          addArticle(this.article, draft).then(() => {
            if (draft){
              this.$message.success("存入草稿成功")
            }else{
              this.$message.success("发布成功")
            }
            this.$router.push('/article')
          })
        }
      })
     
    },
    async loadArticle(){
      const {data:res} = await getArticle(this.$route.query.id)
      this.article = res.data
    }
  }
}
</script>

<style>

</style>