<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
// import { userUploadAvatarService } from '@/api/user'
const userStore = useUserStore()

const uploadRef = ref()
const imgUrl = ref(userStore.user.user_pic)
// 头像base64字符串
const onUploadFile = (file) => {
  // 基于 FileReader 实现图片预览
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}
const onUpdateAvatar = async () => {
  //   await userUploadAvatarService(imgUrl.value)
  await userStore.getUser()
  ElMessage({ type: 'success', message: '更换头像成功' })
}
// 数据定义
const registerForm = ref({
  username: '',
  sex: 0,
  birth: '',
  introduction: '',
  location: '',
  phoneNum: '',
  email: ''
})

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 规则定义
const SignUpRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birth: [{ required: true, message: '请选择生日', trigger: 'change' }],
  phoneNum: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}

const rules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.newPassword) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法定义
const goBack = (step) => {
  window.history.go(step)
}

const saveMsg = () => {
  // 处理保存操作
  ElMessage.success('信息已保存')
}

const clearData = () => {
  form.value.oldPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}

const confirm = () => {
  // 执行密码修改操作
  ElMessage.success('密码已修改')
}

// const cancelAccount = () => {
//   // 执行注销账号操作
//   ElMessage.warning('账号已注销')
// }
</script>
<template>
  <div class="setting">
    <h1>设置</h1>
    <el-tabs tab-position="left">
      <el-tab-pane label="个人资料" class="content">
        <el-row>
          <el-col :span="12">
            <el-form
              ref="updateForm"
              label-width="100px"
              :model="registerForm"
              :rules="SignUpRules"
              size="large"
            >
              <el-form-item prop="username" label="用户名">
                <el-input
                  v-model="registerForm.username"
                  placeholder="用户名"
                ></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="registerForm.sex">
                  <el-radio :label="0">女</el-radio>
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">保密</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="birth" label="生日">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="registerForm.birth"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="introduction" label="签名">
                <el-input
                  type="textarea"
                  placeholder="签名"
                  v-model="registerForm.introduction"
                ></el-input>
              </el-form-item>
              <el-form-item prop="phoneNum" label="手机">
                <el-input
                  placeholder="手机"
                  v-model="registerForm.phoneNum"
                ></el-input>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input
                  v-model="registerForm.email"
                  placeholder="邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="goBack(-1)">取消</el-button>
                <el-button type="primary" @click="saveMsg()">保存</el-button>
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
                @click="onUpdateAvatar"
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
              ref="passwordForm"
              label-width="100px"
              :model="form"
              :rules="rules"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" v-model="form.oldPassword" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPassword" />
              </el-form-item>
              <el-form-item label="密码确认" prop="confirmPassword">
                <el-input type="password" v-model="form.confirmPassword" />
              </el-form-item>
              <el-form-item>
                <el-button @click="clearData()">重置</el-button>
                <el-button type="primary" @click="confirm()"
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

  @media screen and (min-width: 768px) {
    .setting {
      margin: 30px 10%;
      margin-top: 0;
      padding: 20px;
      min-height: 60vh;
    }
  }

  @media screen and (max-width: 1024px) {
    .setting {
      padding: 20px;
    }
  }
}
</style>
