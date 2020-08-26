<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRolesDialog = true">添加角色</el-button>

      <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialog"
        width="50%"
        @closed="addFormClosed">
        <el-form :model="addForm" ref="addRoles" label-width="80px" :rules="addRolesRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addRolesDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <el-table :data="rolesList" stripe border>
<!--        展开列-->
        <el-table-column type="expand">
          <template v-slot="slot">
            <el-row v-for="(item, index) in slot.row.children" :key="item.id" :class="['borderBottom', index === 0 ? 'borderTop' : '', 'vcenter']">
              <el-col :span="5">
                <el-tag @close="removeRolesById(slot.row, item.id)" closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>7
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, index2) in item.children" :key="item2.id" :class="[index2 == 0 ? '' : 'borderTop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag @close="removeRolesById(slot.row, item2.id)" closable type="sussess">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRolesById(slot.row, item3.id)" closable type="warning" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
<!--        索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column width="300px">
          <template v-slot="slot">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoles(slot.row.id)">编辑</el-button>

            <el-dialog
              title="编辑角色"
              :visible.sync="editRolesDialog"
              width="50%"
              @closed="addFormClosed">
              <el-form :model="editForm" ref="addRoles" label-width="80px" :rules="addRolesRules">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer">
                <el-button @click="editRolesDialog = false">取 消</el-button>
                <el-button type="primary" @click="editRolesForm">确 定</el-button>
              </span>
            </el-dialog>

            <el-button size="mini" type="danger" icon="el-icon-delete" style="margin-left: 10px" @click="removeRole(slot.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightsList(slot.row)">分配权限</el-button>

            <el-dialog
              title="分配权限"
              :visible.sync="branchRightsDialog"
              width="50%">

              <el-tree :data="rightsList"
                       :props="treeProps"
                       show-checkbox
                       node-key="id"
                       :default-checked-keys="defkeys"
                       ref="tree"
                       default-expand-all>
              </el-tree>

              <span slot="footer" class="dialog-footer">
                <el-button @click="branchRightsDialog = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
              </span>
            </el-dialog>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {request} from "@/network/request";

  export default {
    name: 'Roles',
    data() {
      return {
        rolesList: [],
        rightsList:[],
        addRolesDialog: false,
        editRolesDialog: false,
        branchRightsDialog:false,
        addForm: {
          roleName: '',
          roleDesc: ''
        },
        editForm: {},
        addRolesRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
        },
        treeProps: {
          children: 'children',
          label: 'authName'
        },
        defkeys: [],
        roleId: '',
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      addFormClosed() {
        this.$refs.addRoles.resetFields()
      },
      addRoles() {
        request({
          method: 'post',
          url: 'roles',
          data: this.addForm
        }).then(res => {
          if (res.data.meta.status !== 201) return this.$message.error('创建失败')
          this.getRolesList()
          this.$message.success('创建成功')
          this.addRolesDialog = false
        })
      },

      editRoles(id) {
        request({
          method: 'get',
          url: 'roles/' + id
        }).then(res => {
          this.editForm = res.data.data
          this.editRolesDialog = true
        })
      },

      editRolesForm() {
        request({
          method: 'put',
          url: 'roles/' + this.editForm.roleId,
          data: {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        }).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('编辑失败')
          this.getRolesList()
          this.$message.success('编辑成功')
          this.editRolesDialog = false
        })
      },

      //删除角色
      removeRole(id) {
        request({
          method: 'delete',
          url: 'roles/' + id,
        }).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('删除失败')
          this.getRolesList()
          this.$message.success('删除成功')
        })
      },

      getRolesList() {
        request({
          method: 'get',
          url: 'roles'
        }).then(res => {
          // console.log(res);
          if (res.data.meta.status === 200) {
            this.rolesList = res.data.data

            // console.log(this.rolesList);
          }
        })
      },
      removeRolesById(roleId, rightId) {
        this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          request({
            method: 'delete',
            url: `roles/${roleId.id}/rights/${rightId}`
          }).then(res => {
            if (res.data.meta.status === 200){
              roleId.children = res.data.data
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      showRightsList(role) {
        this.roleId = role.id
        request({
          url: 'rights/tree',
          method: 'get'
        }).then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('获取权限列表信息失败')
          this.rightsList = res.data.data
          // console.log(role);
          this.defkeys = []
          this.getdefkeys(role, this.defkeys)

          this.branchRightsDialog = true
        })
      },
      getdefkeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getdefkeys(item,arr))
      },
      allotRights() {
        const keys = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
        const strId = keys.join(',')
        request({
          url: `roles/${this.roleId}/rights`,
          method: 'post',
          data: {
            rids: strId
          }
        }).then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) return this.$message.error('分配权限失败')

          this.getRolesList()
          this.$message.success('分配权限成功')
          this.branchRightsDialog = false
        })


      }
    }
  }
</script>

<style scoped>
  .borderTop{
    border-top: 1px solid #eee;
  }
  .borderBottom{
    border-bottom: 1px solid #eee;
  }
  .el-tag{
    margin: 7px;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>