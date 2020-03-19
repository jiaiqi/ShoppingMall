<template>
	<view>
		<tree-list :serviceName="serviceName"></tree-list>
	</view>
</template>

<script>
  import treeList from '@/components/bx-tree-list/bx-tree-list.vue'
	export default {
    components:{treeList},
		data() {
			return {
				serviceName:'',
			}
		},
		methods: {
			
		},
    onLoad(option) {
      if(option.serviceName){
        this.serviceName = decodeURIComponent(option.serviceName)
      }
    }
	}
</script>

<style>

</style>
