<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :rules="fromRules" :model="user" label-width="80px">
        <el-form-item label="用户头像">
          <label for="file">
            <el-avatar 
              shape="square"
              :size="150" 
              fit="cover" 
              :src="user.photo"
            ></el-avatar>
            <input id="file" type="file" ref="file" hidden @change="onFileChange">
          </label>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          {{user.mobile}}
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="个人介绍" prop="intro">
          <el-input type="textarea" v-model="user.intro"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item> 
        <el-form-item>
          <el-button 
            type="primary" 
            @click="onUpdateUser"
            :loading="updataProfileLoading"  
          >保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      width="40%"
      @opened="onDialogOpen"
      @closed="onDialogClosed"
    >
      <div>
        <img ref="preview_image" class="preview_image" :src="previewImage" alt="">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button 
          type="primary"
          @click="onUpdatePhoto"
          :loading="updataPhotoLoading"  
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updataUserPhoto, updataUser} from '@/api/user'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import golbalBus from '@/utils/global-bus'
export default {
  name: "AccountIndex",
    components: {},
    props: {},
    data() {
      return {
        user: {
          email: '', // 邮箱
          intro: '', // 简介
          mobile: '', // 手机号
          name: '', // 昵称
          photo: '' // 头像
        },
        dialogVisible: false,
        previewImage: {},
        cropper: null,
        updataPhotoLoading: false,
        updataProfileLoading: false,
        fromRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          intro: [
            { required: true, message: '请介绍一下自己', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { 
              validator(rule, value, cb) {
                const regEmail = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/
                if (regEmail.test(value)) {
                  // 合法的邮箱
                  cb()
                }else{
                  cb(new Error('请输入合法的邮箱'))
                }
              } 
            }
            
          ]
        }
      }
    },
    computed: {},
    watch: {},
    created() {
      this.loadUserProfile()
    },
    methods: {
      async loadUserProfile () {
        const {data:res} = await getUserProfile()
        this.user = res.data
      },
      onFileChange () {
        const file = this.$refs.file
        const blob = window.URL.createObjectURL(file.files[0]) 
        this.previewImage = blob

        this.dialogVisible = true

        // 解决选择相同文件 不触发 change 事件问题
        this.$refs.file.value = ''
      },
      onDialogOpen () {
        const image = this.$refs.preview_image
        if (this.cropper) {
          this.cropper.replace(this.previewImage)
          return
        }
        this.cropper = new Cropper(image, {
          viewMode: 1,
          dragMode: 'move',
          aspectRatio: 1,
          cropBoxMovable: false,
          cropBoxResizable: false,
          background: false,
          movable: true
          // crop(event) {
          //   console.log(event.detail.x);
          //   console.log(event.detail.y);
          //   console.log(event.detail.width);
          //   console.log(event.detail.height);
          //   console.log(event.detail.rotate);
          //   console.log(event.detail.scaleX);
          //   console.log(event.detail.scaleY);
          // }
        })
      },
      onDialogClosed () {
        // this.cropper.destroy()
      },
      onUpdatePhoto () {
        this.updataPhotoLoading = true
        this.cropper.getCroppedCanvas().toBlob(file => {
          const fd = new FormData()
          fd.append('photo',file)
          updataUserPhoto(fd).then(() => {
            // console.log(res);
            this.dialogVisible = false
            this.user.photo = window.URL.createObjectURL(file)
            this.updataPhotoLoading = false
            this.$message.success('更新头像成功')
            golbalBus.$emit('update-user',this.user)
          })
        })
      },
      onUpdateUser() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          this.updataProfileLoading = true
          const { name, intro, email } = this.user
          updataUser({
            name,
            intro,
            email
          }).then(() => {
            this.$message.success('保存成功')
            this.updataProfileLoading = false
           
          })
          
        }) 
      },
      
    }
}
</script>

<style lang="less" scoped>
  .preview_image{
    display: block;
    max-width: 100%;
    height: 200px;
  }
</style>
  
