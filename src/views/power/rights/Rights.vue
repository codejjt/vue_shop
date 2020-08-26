<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片-->
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="slot">
            <el-tag v-if="slot.row.level == 0">一级</el-tag>
            <el-tag v-else-if="slot.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="slot.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {request} from "@/network/request";

  export default {
    name: 'Rights',
    data() {
      return {
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      getRightsList() {
        request({
          method: 'get',
          url: 'rights/list'
        }).then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.rightsList = res.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>