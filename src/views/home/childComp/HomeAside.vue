<template>
  <div>
    <div class="toggle" @click="toggleClick">|||</div>
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="active">
      <!--    一级菜单-->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="asideIcon[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!--      二级菜单-->
        <el-menu-item :index="'/' + initem.path" v-for="initem in item.children" :key="initem.id">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{initem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'Aside',
    data() {
      return {
        asideIcon: {
          125: 'el-icon-user-solid',
          103: 'el-icon-s-grid',
          101: 'el-icon-s-goods',
          102: 'el-icon-s-order',
          145: 'el-icon-s-platform'
        },
        isCollapse: false
      }
    },
    props: {
      menuList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      toggleClick() {
        this.isCollapse = !this.isCollapse
        this.$emit('asideWidth', this.isCollapse)
      }
    },
    computed: {
      active() {
        return this.$route.path
      }
    }
  }
</script>

<style scoped>
  .el-menu{
    border-right: none;
  }
  .toggle{
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    background-color: #4A5064;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
  }
</style>