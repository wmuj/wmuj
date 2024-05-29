<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from '@/components/ChannelSelect.vue'
import { artGetListSerive } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from '@/components/ArticleEdit.vue'
const articleList = ref([]) //文章列表
const loading = ref(false) //loading状态

const params = ref({
  pagenum: 1, //当前页
  pagesize: 5, //当前生效的每页数
  cate_id: '',
  state: ''
})
const getAticleList = async () => {
  loading.value = true
  const res = await artGetListSerive(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  // console.log(articleList.value)
  loading.value = false
}
getAticleList()

const articleEditRef = ref()
// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
  // console.log(row)
}
// 删除逻辑
const onDelArticle = (row) => {
  console.log(row)
}
// 添加或者编辑成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数
    params.value.pagenum = lastPage
  }
  // 如果是编辑，渲染当前页
  getAticleList()
}
const total = ref(0) //默认总条数
// 定义请求参数对象

// 处理分页逻辑
const onSizeChange = (size) => {
  // console.log('当前每页条数', size)
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不打了，数据已经不在那一页
  params.value.pagenum = 1
  params.value.pagesize = size
  getAticleList()
  // 基于最新的当前页 和每页条数 渲染数据
}
const onCurrentChange = (page) => {
  // console.log('页码变化了', page)
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前当前页，渲染数据
  getAticleList()
}

// 搜索逻辑  按照最新的条件，重新检索，从第1页开始展示
const onSearch = () => {
  params.value.pagenum = 1 //重置页码
  getAticleList()
}
// 重置逻辑 筛选条件清空 重新检索 回到第一页
const onReset = () => {
  params.value.pagenum = 1 //重置页码
  ;(params.value.state = ''), (params.value.cate_id = '')
  getAticleList()
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- label展示给用户看的,vakue 收集起来提交给后台的 -->
        <!-- vue2 v-model  :value 和@input -->
        <!-- vue3 v-model  :modelValue 和@update：modelValye-->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item v-model="params.state" label="发布状态:">
        <el-select v-model="params.state" style="width: 208px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column label="文章标题" prop="title" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽row可以获取当前行的数据 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区-->
    <el-pagination
      style="margin-top: 20px; justify-content: flex-end"
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total,sizes, prev, pager, next, "
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
    <!-- 添加编辑的抽屉 -->
    <ArticleEdit @success="onSuccess" ref="articleEditRef"></ArticleEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
