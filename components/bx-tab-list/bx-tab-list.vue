<template>
	<view class="tab-item-wrap shadow shadow-lg">
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view :style="'width:' + width +'%'" class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in tabData" :key="index" @tap="tabSelect($event,item)" :data-id="index">
				{{item.label}}({{item.count}})
			</view>
		</scroll-view>
		<!-- <view v-if="showSearch" class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<input type="text" placeholder="搜索cuIcon" confirm-type="search" @input="searchIcon"></input>
				<text @tap="search" class="cuIcon-search"></text>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		name:"bx-list-tab-item",
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,								
				searchValue:''
			}
		},		
		computed:{
			width(){
				switch(this.rowNumber) {
				 case 2:
				 return 50;
					break;
				 case 3:
				 return 33;
				break;
					case 4:
					return 25;
				break;
				default:
				return 25;
				}
			}
		},
		methods: {
			tabSelect(e,item) {
				let a = document.getElementsByClassName('cu-item')[0].clientWidth
				console.log(a)
				this.TabCur = Number(e.currentTarget.dataset.id);
				this.scrollLeft = (Number(e.currentTarget.dataset.id) - 1) * a
				this.$emit('clickTabs',item)
			},		
		},
		created(){
			let tabData = this.tabData
			let currType = this.currType
			tabData.forEach((it,i)=>{
				if(it.value === this.currType.value){
					this.TabCur = i
					// this.$emit('clickTabs',tabData[0])
				}
			})
			console.log('tab-lisy-----------',this.currType)
		},
		props:{
			tabData:{
				type:Array,
				default: () => {
					[];
				}
			},
			currType:{
				type:Object,
				default: () => {
					{};
				}
			},
			// listCondition:{
			// 	type:Array,
			// 	default:()=>{
			// 		[];
			// 	}
			// }
			rowNumber:{
				type:Number,
				default:2
			}
		}
	}
	
</script>

<style lang="scss">
	.nav {
		white-space: nowrap;
	}
	
	::-webkit-scrollbar {
		display: none;
	}
	
	.nav .cu-item {
		height: 90upx;
		display: inline-block;
		line-height: 90upx;
		margin: 0upx;
		padding: 0upx;
		text-align: center;
	}
	
	.nav .cu-item.cur {
		border-bottom: 4upx solid;
	}
	.cu-bar .search-form {
		background-color: #f5f5f5;
		line-height: 64upx;
		height: 64upx;
		font-size: 24upx;
		color: #333333;
		flex: 1;
		display: flex;
		align-items: center;
		margin: 0 30upx;
	}
	
	.cu-bar .search-form+.action {
		margin-right: 30upx;
	}
	
	.cu-bar .search-form input {
		
		flex: 1;
		padding-left: 30upx;
		height: 64upx;
		line-height: 64upx;
		font-size: 26upx;
		background-color: transparent;
	}
	
	.cu-bar .search-form [class*="cuIcon-"] {
		padding: 0 1.5em 0 0.8em;
	}
	
	.cu-bar .search-form [class*="cuIcon-"]::before {
		top: 0upx;
	}
	.cu-bar.fixed,
	.nav.fixed {
		position: relative;
		width: 100%;
		top: 0!important;
		z-index: 1024;
		box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
	}
</style>
