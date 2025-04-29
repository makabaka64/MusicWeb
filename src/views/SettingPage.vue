<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import {
  userUpdateInfoService,
  userUploadAvatarService,
  userUpdatePassService
} from '@/api/user'
const userStore = useUserStore()
const tabPosition = ref('left')
const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()
const userInfo = ref({ username, nickname, email, id })
const formRef = ref()

const SignUpRules = {
  // username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}
const goBack = (step) => {
  window.history.go(step)
}
// 修改资料
const submitForm = async () => {
  try {
    await formRef.value.validate()
    const response = await userUpdateInfoService(userInfo.value)
    getUser()
    if (response.data.status !== 0) {
      throw new Error(response.data.message)
    }
    ElMessage.success('修改成功')
  } catch (error) {
    console.error('Update failed:', error)
    ElMessage.error(error.message || '信息保存失败')
  }
}

// 修改密码
const form = ref({
  oldPwd: '',
  newPwd: '',
  confirmPassword: ''
})
const Ref = ref()
const router = useRouter()
const rules = {
  oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.newPwd) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const clearData = () => {
  form.value.oldPwd = ''
  form.value.newPwd = ''
  form.value.confirmPassword = ''
}

const onSubmit = async () => {
  const valid = await Ref.value.validate()
  if (valid) {
    try {
      const res = await userUpdatePassService(form.value)
      if (res.data.status !== 0) {
        throw new Error(res.data.message)
      }
      ElMessage.success('密码已修改')
      userStore.setToken('')
      userStore.setUser({})
      router.push('/login')
    } catch (error) {
      ElMessage.error(error.message || '请确认旧密码')
    }
  }
}

// 头像上传
const uploadRef = ref()
const imgUrl = ref(userStore.user.user_pic)
// const imgUrl = ref('')
// 头像base64字符串
const onUploadFile = (file) => {
  // 基于 FileReader 实现图片预览
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
    // console.log('Base64 URL:', imgUrl.value) // 确保 Base64 生成正确
  }
}
const onUpdateAvatar = async () => {
  if (!imgUrl.value) {
    ElMessage.error('请选择头像后再上传')
    return
  }

  try {
    const response = await userUploadAvatarService(imgUrl.value)
    await userStore.getUser()
    console.log('Upload Response:', response) // 确保服务端有返回
    // await userGetInfoService()

    ElMessage({ type: 'success', message: '更换头像成功' })
  } catch (error) {
    console.error('Upload Error:', error)
    ElMessage.error(error.message || '上传头像失败')
  }
}
// 监听页面宽度变化
const updateTabPosition = () => {
  tabPosition.value = window.innerWidth < 768 ? 'top' : 'left'
}

onMounted(() => {
  updateTabPosition()
  window.addEventListener('resize', updateTabPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTabPosition)
})
</script>
<template>
  <div class="setting">
    <h1>设置</h1>
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="个人资料" class="content">
        <el-row>
          <el-col :span="12">
            <el-form
              ref="formRef"
              label-width="100px"
              :model="userInfo"
              :rules="SignUpRules"
              size="large"
            >
              <el-form-item prop="username" label="用户名">
                <el-input
                  v-model="userInfo.username"
                  placeholder="用户名"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item prop="nickname" label="昵称">
                <el-input
                  v-model="userInfo.nickname"
                  placeholder="昵称"
                ></el-input>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input
                  v-model="userInfo.email"
                  placeholder="邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="goBack(-1)">取消</el-button>
                <el-button type="primary" @click="submitForm()">保存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="更换头像" class="content">
        <page-container title="更换头像">
          <el-row>
            <el-col :span="12">
              <el-upload
                ref="uploadRef"
                class="avatar-uploader"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="onUploadFile"
              >
                <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                <img v-else src="@/assets/avatar.png" width="278" />
              </el-upload>
              <br />
              <el-button
                type="primary"
                :icon="Plus"
                size="large"
                @click="uploadRef.$el.querySelector('input').click()"
              >
                选择图片
              </el-button>
              <el-button
                type="success"
                :icon="Upload"
                size="large"
                @click="onUpdateAvatar()"
              >
                上传头像
              </el-button>
            </el-col>
          </el-row>
        </page-container>
      </el-tab-pane>
      <el-tab-pane label="更改密码" class="content">
        <el-row>
          <el-col :span="10"
            ><el-form
              ref="Ref"
              label-width="100px"
              :model="form"
              :rules="rules"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" v-model="form.oldPwd" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPwd" />
              </el-form-item>
              <el-form-item label="密码确认" prop="confirmPassword">
                <el-input type="password" v-model="form.confirmPassword" />
              </el-form-item>
              <el-form-item>
                <el-button @click="clearData()">重置</el-button>
                <el-button type="primary" @click="onSubmit()"
                  >确认修改</el-button
                >
              </el-form-item>
            </el-form></el-col
          >
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.setting {
  padding-top: 30px;
  margin: auto;
  width: 80%;
  h1 {
    border-bottom: 1px solid grey;
  }

  .content {
    padding-top: 20px;
    text-align: center;
  }
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 278px;
        height: 278px;
        display: block;
      }
      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
      }
      .el-upload:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 278px;
        height: 278px;
        text-align: center;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .form-item-btns {
    display: flex !important;
    gap: 10px;

    .el-button {
      flex: 1;
      margin-left: 0 !important;
    }
  }

  /* 头像按钮特殊处理 */
  .avatar-btns {
    width: 100%;
    display: flex;
    gap: 10px;

    .el-button {
      flex: 1;
      white-space: nowrap;
    }
  }

  /* 调整Element UI默认样式 */
  :deep(.el-form-item__content) {
    justify-content: space-between;
  }

  .el-button + .el-button {
    margin-left: 0 !important;
  }
  .el-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .avatar-uploader :deep() .avatar {
    width: 100%;
    height: auto;
  }

  .el-upload {
    width: 50% !important;
  }

  .el-button {
    width: 45%;
    margin-bottom: 10px;
  }

  .content {
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
