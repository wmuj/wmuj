<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import PageContainer from '@/components/PageContainer.vue' //components里的组件默认导出可以不写
import { Plus, Upload } from '@element-plus/icons-vue'
import { userUpImgSerice } from '@/api/user'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
const onSelectFile = (updateImg) => {
  // 基于FileReader 读取图片做预览
  // imgUrl.value = URL.createObjectURL(updateImg.raw)  存的格式是文件格式
  const reader = new FileReader()
  reader.readAsDataURL(updateImg.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
    // 存的格式是base64格式
  }
}
const onUpAvatar = async () => {
  // 发送请求更新头像
  await userUpImgSerice(imgUrl.value)
  await userStore.getUser()
  ElMessage.success('头像更新成功')
}
</script>
<template>
  <PageContainer title="更换头像">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br />
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button
      type="success"
      :icon="Upload"
      size="large"
      style="margin-left: 30px"
      @click="onUpAvatar"
      >上传头像</el-button
    >
  </PageContainer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
