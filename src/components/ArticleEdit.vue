<script setup>
import { nextTick, ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishSerive,
  artGetDetailSerive,
  artUpdateSerive
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 抽屉的显示与隐藏
const visibileDrawer = ref(false)

// 默认数据
const defaultForm = {
  title: '', //标题
  cate_id: '', //分类id
  cover_img: '', //封面图片 file对象
  content: '', //string 内容
  state: '' //状态
}

// 准备数据
const formModel = ref({
  ...defaultForm
})

// 图片上传相关
const imgUrl = ref('')

const onSelectFile = (UploadFile) => {
  // console.log(UploadFile)
  imgUrl.value = URL.createObjectURL(UploadFile.raw) //预览图片
  // 立刻将图片对象，存入frommodel。value。cover-img将来用于提交
  formModel.value.cover_img = UploadFile.raw
}

// 提交发布文章
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态 存入frommodel
  formModel.value.state = state
  // 当前接口需要formDate对象
  //将普通对象=》 转换成 formDate对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    // console.log('编辑操作')
    await artUpdateSerive(fd)
    ElMessage.success('修改成功')
    visibileDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishSerive(fd)
    ElMessage.success('添加成功')
    visibileDrawer.value = false
    // 通知父组件添加成功了
    emit('success', 'add')
  }
}

// 组件对外暴露一个方法open，基于open传来的参数，区分添加还是编辑
// open({}) =>表单无需渲染，说明是添加
// open({id,...}) 表单需要编辑，说明是编辑
// open调用后弹层打开
const editorRef = ref()
const open = async (row) => {
  // if (!visibileDrawer.value) {
  //   imgUrl.value = ''
  //   editorRef.value.setHTML('')
  // }

  visibileDrawer.value = true //显示抽屉
  // console.log(row)
  if (row.id) {
    // 基于row.id发送请求，获取编辑对应的详细数据，进行回显
    // console.log(row)
    // formModel.value = row
    const res = await artGetDetailSerive(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台的的数据格式是，file对象格式
    // 需要将网络图片地址=》转换成file对象，储存起来（）,将来便于提交
    const file = await imageUrlToFileObject(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    //基于默认数据重置form数据
    formModel.value = { ...defaultForm }
    // 这里重置了表单的数据，但是图片上传img地址和富文本编辑器需要手动重置
    imgUrl.value = ''
    nextTick(() => {
      editorRef.value.setHTML('')
    })
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFileObject(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibileDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传 不需要配置action等参数 
        只需要做前端的本地预览图片即可，无需在提交前上传图标p
        URL.createObjectURL(.......) 创建本地预览
        -->
        <el-upload
          :auto-upload="false"
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
