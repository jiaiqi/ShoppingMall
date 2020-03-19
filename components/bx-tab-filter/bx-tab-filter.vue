<template>
	<view class="flex bx-filter shadow shadow-lg shadow-blur bg-white">
		<view class="flex-sub bx-filter-item bg-white padding-xs margin-xs radius" v-for="(item,index) in colSort" :key="index" @click="onFilterItem(item)">
			<view :class="item.active ? 'text-orange' :''">{{item.label}}</view>
			<view class="text-item-icon">
				<text v-if="item.default === 'asc'" class="lg text-orange cuIcon-triangleupfill"></text>
				<text v-if="item.default === 'desc'" class="lg text-orange cuIcon-triangledownfill"></text>
			</view>
		</view>
		<view class="flex-sub bx-filter-item bg-white padding-xs margin-xs radius" v-for="(item,index) in bxFilters" :key="index" @click="onFilterItem(item)">
			{{item.label}}
		</view>
		<!-- <view class="flex-sub bx-filter-item bx-filter-item-more bg-white padding-sm margin-xs radius" @click="onFilterItem(item)">
			<text  class="lg text-gray cuIcon-circle"></text>
		</view> -->
	</view>
</template>

<script>
	export default {
		props:{
			"filterOptions": { // 分类信息
				type: Object,
				default: function() {
					return {
						colSort:[],
						filterTab:[]
					};
				}
			},
		},
		methods:{
			onFilterItem(e){
				if(e.type === 'bxSort' || e.type === 'all'){
					
					this.colSort = this.colSort.map((item,index) =>{
						if(e.colName === item.colName){
							if(item.options && item.options.length > 0){
								item.default = item.default === item.options[0].value ? item.options[1].value : item.options[0].value
							}
							item['active'] = true
						}else{
							item.default = ""
							item['active'] = false
						}
						return item
					})
				}
				this.$emit("bx-filter-change",e)
			}
		},
		data() {
			return {
				bxFilters:this.filterOptions.filterTab,
				colSort:this.filterOptions.colSort
			};
		},
		created() {
			if(this.filterOptions.filterTab.length > 0){
				this.bxFilters = this.filterOptions.filterTab.map((item) => {
					item.type = 'bxFilter'
					return item
				})
			}
			if(this.filterOptions.colSort.length > 0){
				this.colSort = this.filterOptions.colSort.map((item) => {
					item.type = 'bxSort'
					return item
				})
				this.colSort.splice(0, 0, {
					colName:"_all",
					type:"all",
					label:"全部",
					active:true
				});
				
			}
		}
	}
</script>

<style lang="less" scoped>
.bx-filter{
	height:88rpx;
	border-top: 1rpx solid #f2f2f2;
	border-bottom: 1rpx solid #f2f2f2;
	.bx-filter-item{
		box-sizing: border-box;
		// height:88rpx;
		line-height: 64rpx;
		font-size: 32rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		flex:1;
		justify-content: center;
		border-right: 1rpx solid #f2f2f2;
		.text-item-icon{
			width: 40rpx;
			display: flex;
			flex-direction: column;
		}
	}
	.bx-filter-item:last-child{
		border-right-width: 0;
	}
	.bx-filter-item-more{
		flex: unset;
		width: 88rpx!important;
	}
}
</style>
