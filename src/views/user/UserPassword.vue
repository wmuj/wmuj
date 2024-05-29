<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { userChangePasswordSerice } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const router = useRouter()
const useStore = useUserStore()
const pwdFormRef = ref()
// 自定义验证函数
const validateNewPwd = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

const validateConfirmPwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: validateConfirmPwd, trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = async () => {
  await pwdFormRef.value.validate()
  await userChangePasswordSerice(pwdForm.value)
  ElMessage.success('修改成功')
  // 密码修改成功，退出重新登录
  // 1.清除本地token
  useStore.setToken()
  useStore.setUser({})
  // 拦截到登录页
  router.push('/login')
}

// 重置表单
const resetForm = () => {
  pwdFormRef.value.resetFields()
}
</script>

<template>
  <PageContainer title="重置密码">
    <el-form
      :rules="rules"
      :model="pwdForm"
      ref="pwdFormRef"
      label-width="80px"
    >
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          style="width: 40%"
          v-model="pwdForm.old_pwd"
          placeholder="请输入原密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          style="width: 40%"
          v-model="pwdForm.new_pwd"
          placeholder="请输入新密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          style="width: 40%"
          v-model="pwdForm.re_pwd"
          placeholder="请再次输入新密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
