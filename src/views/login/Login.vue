<template>
  <div class="login">
    <div class="login-box">
      <div class="login-head-img">
        <img src="~@/assets/logo.png" alt="">
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="0px" class="login-from">
<!--        账号-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
<!--        按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {request} from '@/network/request'

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      reset() {
        this.$refs.loginForm.resetFields()
      },
      login() {
        this.$refs.loginForm.validate((res) => {
          if (!res) return
          request({
            method: 'post',
            url: 'login',
            data: this.loginForm
          }).then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('登陆失败')
            this.$message.success('登录成功')
            console.log(res);
            window.sessionStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login{
    background-color: #2b4b6b;
    width: 100vw;
    height: 100vh;

    .login-box{
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .login-head-img{
        width: 120px;
        height: 120px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
  }
  .login-from{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;

    .btns{
      display: flex;
      justify-content: flex-end;
    }
  }

</style>