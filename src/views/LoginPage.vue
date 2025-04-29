<script setup>
import { userRegisterService, userLoginService } from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const form = ref()
const isRegister = ref(true)
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const userStore = useUserStore()
const router = useRouter()
const register = async () => {
  try {
    await form.value.validate()
    const res = await userRegisterService(formModel.value)
    if (res.data.status === 0) {
      ElMessage.success(res.data.message || '注册成功')
      isRegister.value = false // 切换到登录
    } else {
      ElMessage.error(res.data.message || '注册失败')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '注册失败')
  }
}

const login = async () => {
  try {
    await form.value.validate()
    const res = await userLoginService(formModel.value)

    if (res.data.token) {
      userStore.setToken(res.data.token)
      ElMessage.success('登录成功')
      router.push('/mymusic')
    } else {
      ElMessage.error('登录失败，请检查账号密码')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败')
  }
}
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>
<template>
  <el-row class="login-page">
    <el-col :span="12" :xs="0" class="bg">
      <div class="title"><h1>Welcome!</h1></div>
      <div class="page">
        <h3>🎵 加入我们，开启您的音乐之旅 🎵</h3>
        <ul>
          <li>畅享各种音乐，发现新歌</li>
          <li>结识志同道合的朋友</li>
          <li>让音乐成为您生活的一部分</li>
        </ul>
      </div>
    </el-col>
    <el-col :span="6" :offset="3" :xs="24" class="form">
      <el-form
        :rules="rules"
        ref="form"
        :model="formModel"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 登录
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :rules="rules"
        :model="formModel"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.login-page {
  width: 80%;
  margin-top: 100px;
  .bg {
    color: #0f0e0e;
    margin: auto;
    padding: 0px 0px 0px 180px;
    .title {
      white-space: nowrap;
    }
    .page {
      white-space: nowrap;
    }
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    // height: auto;
    // min-height: 100vh;
    padding: 20px;

    .form {
      padding: 0;
      margin: 0;

      .el-form {
        width: 100%;
        padding: 0 15px;

        h1 {
          font-size: 24px !important;
        }

        .el-form-item {
          margin-bottom: 18px;
        }

        .el-input {
          font-size: 14px;
        }

        .el-button {
          font-size: 14px;
          padding: 12px 0;
        }
      }
    }
  }
}

.form {
  color: #2b2828;
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  // padding: 90px 60px;
  margin: auto;
  .title {
    margin: 0 auto;
  }
  .button {
    width: 100%;
  }
  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
.form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
