<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="always">
<!--      搜索与添加-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="50%"
          @closed="addFormClosed">

          <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button><el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
<!--       用户列表-->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="slot">
            <el-switch v-model="slot.row.mg_state" @change="userState(slot.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="slot">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slot.row.id)"></el-button>

            <el-dialog title="修改用户信息" :visible.sync="editDialog" width="50%" @closed="editFormClosed">

              <el-form :model="editForm" :rules="addFormRules" ref="editForm" label-width="70px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>

              <span slot="footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
              </span>
            </el-dialog>

            <el-button style="margin-left: 10px" type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(slot.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button @click="userRole(slot.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>

            <el-dialog
              title="分配角色"
              :visible.sync="roleDialogVisible"
              width="50%"
              @close="setRoleDialog">
              <div>
                <span>当前用户：{{userRowInfo.username}}</span>
              </div>
              <div>
                <span>当前角色：{{userRowInfo.role_name}}</span>
              </div>
              <div>
                <span>
                  分配角色：
                  <el-select v-model="selectRoleId" placeholder="请选择">
                    <el-option
                      v-for="item in rolesList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </span>
              </div>
              <span slot="footer" class="dialog-footer">
              <el-button @click="roleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
            </el-dialog>

          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import {request} from '@/network/request'
  export default {
    name: 'Users',
    data() {
      //自定义验证邮箱规则
      let checkEmail = (rule, value, callback) => {
        const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入正确的邮箱'))
      }

      let checkMobile = (rule, value, callback) => {
        const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
        if (regMobile.test(value)) {
          return callback()
        }
        return callback(new Error('请输入正确手机号'))
      }

      return {
        userInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        userRowInfo: {},
        rolesList: [],
        selectRoleId: '',

        dialogVisible: false,
        editDialog: false,
        roleDialogVisible: false,

        addForm: {
          username: '',
          password: '',
          mobile: '',
          email: ''
        },
        editForm: {

        },
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur'}
          ],

        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        request({method: 'get', url: 'users', params: this.userInfo}).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('获取数据失败')
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
      },
      //监听 页码值 改变的事件
      handleCurrentChange(page) {
        this.userInfo.pagenum = page
        this.getUserList()
      },
      //监听 pagesize 改变的事件
      handleSizeChange(size) {
        this.userInfo.pagesize = size
        this.getUserList()
      },
      userState(userInfo) {
        console.log(userInfo);
        request({
          method: 'put',
          url: `users/${userInfo.id}/state/${userInfo.mg_state}`
        }).then(res => {
          if (res.data.meta.status !== 200){
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error('更新用户状态失败')
          }
          this.$message.success('更新用户状态成功')
        })
      },
      addFormClosed() {
        this.$refs.addForm.resetFields()
      },
      addUser() {
        this.$refs.addForm.validate(valid => {
          if (!valid) return
          request({method: 'post', url: 'users', data: this.addForm}).then(res => {
            console.log(res);
            if (res.data.meta.status !== 201) return this.$message.error('添加失败')
            this.$message.success('添加成功')
            this.getUserList()
            this.dialogVisible = false
          })
        })
      },
      showEditDialog(id) {
        request({
          method: 'get',
          url: `users/${id}`
        }).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('查询用户失败')
          this.editForm = res.data.data

          this.editDialog = true
        })
      },
      editFormClosed() {
        this.$refs.editForm.resetFields()
      },
      //修改用户信息提交
      editUserInfo() {
        this.$refs.editForm.validate(valid => {
          if (valid){
            request({
              method: 'put',
              url: 'users/' + this.editForm.id,
              data: {
                email: this.editForm.email,
                mobile: this.editForm.mobile
              }
            }).then(res => {
              if (res.data.meta.status !== 200) return this.$message.error('更新失败')
              this.editDialog = false
              this.getUserList()
              this.$message.success('更新成功')
            })
          }
        })
      },
      //删除用户信息
      removeUserById(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          // console.log(res);
          request({
            method: 'delete',
            url: 'users/' + id
          }).then(result => {
            console.log(result);
            if (result.data.meta.status !== 200) return this.$message.error('删除失败')
            this.getUserList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })

        }).catch(err => {
          // console.log(err)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      userRole(userInfo) {
        request({
          url: 'roles',
          method: 'get'
        }).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('获取角色列表失败')
          this.rolesList = res.data.data
        })

        this.roleDialogVisible = true
        this.userRowInfo = userInfo
      },
      saveRoleInfo() {
        request({
          url: `users/${this.userRowInfo.id}/role`,
          method: 'put',
          data: {
            rid: this.selectRoleId
          }
        }).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('分配角色失败')
          this.$message.success('分配角色成功')
          this.getUserList()
          this.roleDialogVisible = false
        })
      },
      setRoleDialog() {
        this.selectRoleId = ''
        this.userRowInfo = {}
      },
    }
  }
</script>

<style scoped>

</style>