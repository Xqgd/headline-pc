<template>
  <div class="upload_cover" @click="ShowCover">
    <div class="cover_wrap">
      <img ref="cover_image" :src="value">
    </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card" >
        <el-tab-pane label="素材库" name="first">
          <ImageList 
            :is-show-add="false"
            :is-show-action="false"
            :is-show-selected="true" 
            ref="iamge_list"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <div>
            <input 
            type="file"
            ref="file"
            @change="onFileChange"
          >
          </div>
          
          <img ref="preview_image" width="100">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageList from '../../image/components/imageList.vue'
import { uploadImage } from '@/api/image'
export default {
  name: 'uploadCocer',
  components: {
    ImageList
  },
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first',
      imageUrl: ''
    }
  },
  created () {

  },
  methods: {
    ShowCover () {
      this.dialogVisible = true
    },
    onFileChange () {
      const file = this.$refs.file.files[0]
      const bolb = window.URL.createObjectURL(file)
      this.$refs.preview_image.src = bolb
    },
    onCoverConfirm () {
      if (this.activeName === 'second') {
        const  file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        const fd = new FormData()
        fd.append('image',file)
        uploadImage(fd).then(res => {
          this.dialogVisible = false
          this.$refs.cover_image.src = res.data.data.url
          this.$emit('input', res.data.data.url)
        })
      
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式：父组件可以直接访问子组件中的数据
        const imageList = this.$refs.iamge_list
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        this.dialogVisible = false
        this.$emit('input',imageList.imagesList[selected].url)
      }
    }
  }

}
</script>

<style lang="less" scoped>
  .upload_cover{
    .cover_wrap{
      width: 150px;
      height: 120px;
      border: 1px solid #ccc;
      img{
        height: 120px;
        min-width: 100%;
      }
    }
  }

</style>

