<template>
	<view class="index">
		<view class="head">
			 <view class="tit">000</view> 
			<view class="jiu">
				<view class="jiu_01" >
					<view><text class='lg text-white cuIcon-scan'></text></view>
					<view>扫码验证</view>
				</view>
				<view class="jiu_01">					
					<navigator url="/pages/edit/yanzheng/yanzheng">
						<view><text class="lg text-white cuIcon-post"></text></view>
						<view>输码验证</view>
					</navigator>
				</view>
				<view class="jiu_01 ">
					<navigator url="/pages/user/mingxi/mingxi"> 
					<view><text class="lg text-white cuIcon-sponsor"></text></view>
					<view>财务结算</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="more">
			<view class='mo'>
				<view class='mo_01'>数据交易</view>
				<navigator url="/pages/user/tongji/tongji"> 
				<!-- <view class='mo_02'>更多 <uni-icon type="arrowright" size="15" color="#D6D6D6"></uni-icon> -->
				<!-- </view> -->
				</navigator>
			</view>
		</view>
		<view class="shuju">
			<view class="shuju_01">
					<view>今日订单/金额</view>
					<view class="shuju_01_s" >15</view>
					<view class="shuju_01_s" >0 / ¥0</view>
			</view>
			<view class="shuju_01 no">
				<view>昨日订单/金额</view> 
				<view class="shuju_01_s" >
				 ¥15</view>
				 <view class="shuju_01_s" >88888</view>
			</view>
			
			<view class="shuju_01">
				<view>总订单数</view>
				<view class="shuju_01_s ">99</view>
			</view>
			<view class="shuju_01 no">
				<view>总销售金额</view>
				<view class="shuju_01_s" >¥ 88</view>
			</view>
		</view>
		<view class="BH"></view>
		<view class="six"  >
			<view class="jiu_01" v-for="i in 6">
				<navigator url="">
					<view><text class="lg text-gray cuIcon-goodsfill"></text></view>
					<view>商品管理</view>
				</navigator>
			</view>
			
		</view>
		<view class="BH"></view>
		<view class="more">
			<view class='mo'>
				<view class='mo_01'>广告直通车 
					 </view>
				<view class='mo_02'></view>
			</view>
		</view>
		<view class="list">
			<view class="list_01">百想商城</view>
		</view>
		<view class="H50">
			</view>
		<!-- 弹窗 -->
		<!-- <view v-if="tancl">
			<Tan @close_add="tan"></Tan>
		</view> -->
		<button type="primary" @click="fenx">分销</button>
	</view>
</template>

<script>
	// import uniBadge from "@/components/uni/uni-badge/uni-badge.vue"
	// import uniIcon from "@/components/uni/uni-icon/uni-icon.vue"
	// import Tan from "@/components/qy/Tan.vue"
	export default {
		data() {
			return {
				tancl: false,
				shop:{},
				itemarr:[
					{img:'',title:'商品管理'},
					{img:'',title:'商品管理'}
				]
			}
		},
		components: {
			// uniIcon,
			// uniBadge,
			// Tan
		},
		onLoad() {  
			// this._load()
		},
		methods: {
			fenx(){
				uni.navigateTo({
					// url:'./reseller'
				})
			},
			//弹窗
			tan() {
				this.tancl = !this.tancl
			},
			//扫码
			shao(){
				// uni.scanCode({
				// 	onlyFromCamera: true,
				// 	success: function (res) {
				// 		uni.navigateTo({
				// 			url:'pages/edit/yanzheng/yanzheng?code='+res.result
				// 		})
				// 	}
				// });
			}
		}
	}
</script>


<style lang="scss">
	.index {
		background:#fff;
		.H50{
			height:50px;
		}
		.head {
			background:  linear-gradient(to bottom, #52c693, #27a26c);
			text-align: center;
			padding: 20px 0 10px;
			color: #fff;
			font-size: 14px;
		}

		.jiu {
			padding: 10px;
			display: flex;
			flex-wrap: wrap;
			color: #fff;
		}

		.jiu_01 {
			width: 33%;
			text-align: center;
			padding: 15px 10px 15px;
			box-sizing: border-box;
			font-size: 12px;
		}

		.jiu_01 img {
			width: 32px;
			height: 32px;
			margin-bottom: 10px;
		}

		.mo {
			padding: 10px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #f0f0f0;
			line-height: 20px;
		}

		.mo_01 {
			padding-left: 10px;
			box-sizing: border-box;
			width: 80%;
			height: 20px;
			overflow: hidden;
			border-left: 3px solid #EC521B;
			font-size: 14px;
			font-weight: bold;
		}

		.mo_01 span {
			color: #8E8E8E;
			font-weight: 100;
			font-size: 12px;
			padding-left: 10px;
		}

		.mo_02 {
			color: #D6D6D6;
		}

		.shuju {
			display: flex;
			flex-wrap: wrap;
		}

		.shuju_01 {
			width: 50%;
			text-align: center;
			padding: 18px 10px;
			box-sizing: border-box;
			font-size: 14px;
			line-height: 25px;
			font-size: 14px;
			border-right: 1px solid #f0f0f0;
			border-bottom: 1px solid #f0f0f0;
		}

		.shuju_01_s {
			color: #EB511B;
			font-weight: 800;
			font-size: 16px;
		}

		.no {
			border-right: none;
		}

		.BH {
			background-color: #F1F1F1;
			height: 5px;
		}

		.six {
			padding: 10px;
			display: flex;
			flex-wrap: wrap;
		}

		.list_01 {
			padding: 15px 10px 8px;
			border-bottom: 1px solid #F4F4F4;
			font-size: 12px;
			text-align: center;
		}
	}
	.lg{
		font-size: 77upx;
	}
</style>
