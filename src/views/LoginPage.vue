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
// 整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const userStore = useUserStore()
const router = useRouter()
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  // 切换到登录
  isRegister.value = false
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
    <el-col :span="12" class="bg">
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
    <el-col :span="6" :offset="3" class="form">
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
  height: 600px;
  margin: auto;
  // background-image: url('../assets/login.jpg');
  .bg {
    color: #0f0e0e;
    margin: auto;
    padding: 0px 0px 0px 180px;
    .title {
      // padding: 0px 0px 0px 80px;
      white-space: nowrap;
    }
    .page {
      // padding: 3px 0px 0px 170px;
      white-space: nowrap;
    }
    // .page2 {
    //   // padding: 0px 0px 0px 170px;
    // }
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
</style>
