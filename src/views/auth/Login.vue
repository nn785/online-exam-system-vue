<template>
  <el-container :style="{ background: `url(${require('@/assets/imgs/' + (VUE_APP_BACKGROUND_IMAGE || 'bg.jpg'))})`,backgroundSize: '100% 100%' }">
    <el-main>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="card-header">
          <p>{{VUE_APP_TITLE || '在线考试系统'}}</p>
        </div>

        <div>
          <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm" :status-icon="true" label-width="100px">
            <el-form-item prop="username">
              <el-input prefix-icon="el-icon-user" v-model="loginForm.username" placeholder="账号"></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" placeholder="密码"
                        show-password></el-input>
            </el-form-item>

            <el-form-item prop="code" v-if="!isGitHubPages">
              <el-input class="code" prefix-icon="el-icon-chat-line-round" v-model="loginForm.code"
                        placeholder="验证码"></el-input>
              <img @click="changeCode" id="code"
                   style="float: right;margin-top: 4px;cursor: pointer" title="看不清,点击刷新"
                   alt="验证码"/>
            </el-form-item>

            <el-alert
              v-if="isGitHubPages"
              title="GitHub Pages演示环境"
              type="warning"
              description="当前为GitHub Pages演示环境，无需验证码，点击登录即可体验系统功能。"
              show-icon
              :closable="false">
            </el-alert>

            <el-form-item align="center">
              <el-button type="warning" @click="$router.push('/register')" icon="el-icon el-icon-s-promotion">去注册
              </el-button>
              <el-button type="primary" @click="login($refs['loginForm'])" icon="el-icon el-icon-s-promotion">登录
              </el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import utils from "../../utils/utils";
import auth from "../../api/auth";
import router from "../../router";

export default {
  name: 'Login',
  data() {
    return {
      VUE_APP_TITLE: process.env.VUE_APP_TITLE,
      VUE_APP_BACKGROUND_IMAGE: process.env.VUE_APP_BACKGROUND_IMAGE || 'bg.jpg',
      // 判断是否在GitHub Pages环境
      isGitHubPages: window.location.hostname.includes('github.io'),
      // 登录表单数据信息
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      captchaUrl: process.env.VUE_APP_CAPTCHA_URL,
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            message: '密码不能小于5个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          {
            validator: this.validateCode,
            trigger: 'blur'
          }
        ],
      },
      codeId:null,
      code:null
    }
  },
  methods:{
    // 自定义验证码校验规则
    validateCode(rule, value, callback){
      // GitHub Pages环境下跳过验证
      if (this.isGitHubPages) {
        callback();
        return;
      }
      
      // 验证码不区分大小写
      if (value.toString().toLocaleLowerCase() !== this.code.toString().toLocaleLowerCase()) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    },
    login(formEl){
      // GitHub Pages环境下直接登录
      if (this.isGitHubPages) {
        localStorage.setItem('authorization', 'github-pages-demo-token');
        this.$notify({
          title: 'Tips',
          message: '演示环境登录成功^_^',
          type: 'success',
          duration: 2000
        });
        router.push('/index');
        return;
      }
      
      utils.validFormAndInvoke(formEl, () => {
        auth.login(this.loginForm).then(resp => {
          if (resp.code === 200) {
            localStorage.setItem('authorization', resp.data)
            this.$notify({
              title: 'Tips',
              message: '登陆成功^_^',
              type: 'success',
              duration: 2000
            })
            router.push('/index')
          }
        })
      },'')
    },
    getCode(){
      auth.getCode(this.codeId).then(resp => {
        this.code = resp.data
      })
    },
    // 点击图片刷新验证码
    changeCode(){
      // GitHub Pages环境下跳过验证码
      if (this.isGitHubPages) return;
      
      const codeImg = document.querySelector('#code')
      this.codeId = utils.getRandomId();
      codeImg.src = `${process.env.VUE_APP_CAPTCHA_URL || ''}/util/getCodeImg?id=` + this.codeId
      codeImg.onload = () => this.getCode()
    }
  },
  created() {
    // 检验用户是否存在token,存在直接跳转主页
    if (localStorage.getItem('authorization') !== null) {
      // GitHub Pages环境下直接跳转
      if (this.isGitHubPages) {
        router.push('/index');
        return;
      }
      
      auth.checkToken()
        .then(resp => {
          if (resp.code === 200) {
            router.push('/index')
          }
        })
        .catch(error => {
          localStorage.removeItem('authorization')
        })
    }
  },
  mounted() {
    if (!this.isGitHubPages) {
      this.changeCode()
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/auth/login";
</style>
