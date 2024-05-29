<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpDateService } from '@/api/user'

// 是在适用仓库中的数据初始值，（无需响应式）
const {
  user: { email, nickname, id, username },
  getUser
} = useUserStore()

const formRef = ref()
const form = ref({
  username, // 示例值，实际情况可能是从接口获取
  nickname,
  email,
  id
})

// 验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}/,
      message: '昵称长度应为2-10位非空字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      message: '邮箱格式不正确',
      trigger: 'blur'
    }
  ]
}

// 提交表单
const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  await userUpDateService(form.value)
  // 通知user模块，进行数据更新
  getUser()
  // 提示用户，修改成功
  ElMessage.success('修改成功')
}

// 重置表单
// const resetForm = () => {
//   formRef.value.resetFields()
// }
</script>
<template>
  <PageContainer title="基本资料">
    <!-- 表单 -->
    <el-form :rules="rules" ref="formRef" :model="form" label-width="80px">
      <el-form-item label="登录名称">
        <el-input
          v-model="form.username"
          disabled
          style="width: 30%"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="nickname">
        <el-input style="width: 30%" v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input style="width: 30%" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
