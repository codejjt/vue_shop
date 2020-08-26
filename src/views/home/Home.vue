<template>
  <el-container class="home-container">
<!--    头部区域-->
    <el-header>
      <div>
        <img src="@/assets/logo.png" alt="">
        <span>后台电商管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
<!--    页面主题-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <home-aside @asideWidth="asideWidth" :menu-list="menuList"></home-aside>
      </el-aside>
<!--      右侧内容主题-->
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  import HomeAside from "./childComp/HomeAside";

  import {request} from '@/network/request'
  export default {
    name: "Home",
    data() {
      return{
        menuList: [],
        isCollapse: false
      }
    },
    components: {
      HomeAside,
    },
    methods: {
      out() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      asideWidth(data) {
        this.isCollapse = data
      },

      async getMenuList() {
        const {data: res} = await request({method: 'get', url: 'menus',})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
        // console.log(res);
      }
    },
    created() {
      this.getMenuList()
    },
  }
</script>

<style lang="less" scoped>
  .home-container{
    height: 100vh;
  }
  .el-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373D41;
    > div{
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #ffffff;

      span{
        margin-left: 15px;
      }
    }
    img{
      width: 50px;
      background-color: #ffffff;
      border-radius: 50%;
    }
  }
  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #EAEDF1;
  }
</style>