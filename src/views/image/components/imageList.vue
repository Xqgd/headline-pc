<template>
  <div>
    <div class="action_nav">
        <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          v-if="isShowAdd" 
          size="mini" 
          type="success"
          @click="dialogVisible = true"
        >上传素材</el-button>
      </div>
       <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col :xs="12" :sm="6" :md="6" :lg="4"
          v-for="(item,index ) in imagesList"
          :key="index"
          class="image-item"
          @click.native="selected = index"
        >
          <el-image
            style="height: 100px"
            :src="item.url"
            fit="cover"
          ></el-image>
          <div
            class="selected"
            v-if="isShowSelected && selected === index"
          ></div>
          <div v-if="isShowAction" class="image-action" >
            <i :class="item.is_collected ? 'el-icon-star-on':'el-icon-star-off'"
              @click="onCollect(item)"
            ></i>
            <i class="el-icon-delete" @click="onDelete(item)"></i>
          </div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total_count"
        :current-page.sync="page"
        @current-change="onCurrentChange">
      </el-pagination>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="30%"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadssuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import { getImage, collectImages, deletImages} from '@/api/image'
export default {
  name: 'ImageList',
  props: {
    isShowAdd: {
      tyep: Boolean,
      default: true
    },
    isShowAction: {
      tyep: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      imagesList: [],
      dialogVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      total_count: 0,
      pageSize: 20,
      page: 1,
      selected: null 
    }
  },
  created () {
    this.loadImages(1)
  },
  methods: {
    async loadImages (page = 1) {
      // 重置高亮页码，防止数据和页码不对应
      this.page = page
      const {data:res} = await getImage({
        collect: this.collect,
        page,
        per_page: this.pageSize
      })
      this.total_count = res.data.total_count
      this.imagesList = res.data.results
    },
    onCollectChange () {
      this.loadImages(1)
    },
    onUploadssuccess () {
      this.dialogVisible = false
      this.loadImages(this.page)
    },
    onCurrentChange(page) {
      this.loadImages(page)
    },
    onCollect (img) {
      collectImages(img.id, !img.is_collected).then(() =>{
        img.is_collected = !img.is_collected
      })
    },
    onDelete (img) {
      deletImages(img.id).then(() =>{
        this.loadImages(this.page)
      })
    }
  }
}


</script>
<style lang="less" scoped>
  .action_nav{
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
  .image-item{
    position: relative;
  }
  .image-action {
    height: 40px;
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
    background-color: rgba(204, 204, 204, .3);
    font-size: 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .selected {
    background: url(./selected.png) no-repeat;
    background-size: cover;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
