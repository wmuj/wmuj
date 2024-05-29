<script setup>
import { artAddChannelsSerive, artEditChanelsSerive } from '@/api/article'
import { ref } from 'vue'
const emit = defineEmits(['success'])
const dialogVisible = ref(false)
const formRef = ref()
// 组件对外暴露一个方法open，基于open传来的参数，区分添加还是编辑
// open({}) =>表单无需渲染，说明是添加
// open({id,cate_name,...}) 表单需要编辑，说明是编辑
// open调用后弹层打开
const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  fromModel.value = { ...row } //添加》重置  编辑》存储回显数据
}
const fromModel = ref({
  cate_name: '',
  cate_alias: ''
})

const rules = {
  cate_name: [
    {
      required: true,
      message: '请输入分类名称',
      trigger: 'blur'
    },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10 位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    {
      required: true,
      message: '请输入分类别名',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类名必须是1-15 位的字母或数字',
      trigger: 'blur'
    }
  ]
}

const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = fromModel.value.id
  if (isEdit) {
    await artEditChanelsSerive(fromModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelsSerive(fromModel.value)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false //关弹层
  // 回显数据 告诉老爹要更新数据 子传父
  emit('success')
}
// 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="fromModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      label-width="100"
      style="padding-right: 30px"
      :rules="rules"
      :model="fromModel"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="fromModel.cate_name"
          minlength="1"
          maxlength="10"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          minlength="1"
          maxlength="15"
          v-model="fromModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
