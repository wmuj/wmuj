<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
</script>
<template>
  <el-select
    :modelValue="modelValue"
    style="width: 208px"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      :key="channelList.id"
      v-for="channelList in channelList"
      :label="channelList.cate_name"
      :value="channelList.id"
    ></el-option>
  </el-select>
</template>
