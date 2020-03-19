<template>
	<view class="agent">
		<view class="head">
			共 <span>{{list.length}}</span> 人
		</view>
		<view class="" v-if="list.length>0">
			<view class="t_tou">
				<view class="tou_1">头像</view>
				<view class="tou_1">昵称</view>
				<view class="tou_1">会员类型</view>
			</view>
			<view class="t">
			  <block v-for="(item,index) of list" :key="index">
				<li class="t_01">
					<view class="t_01_1"> <img :src="item.headimgurl||headerimgs"></img> </view>
					<view class="t_01_1">{{item.name}}</view>
					<view class="t_01_1">{{item.category_name}}</view>
				</li>
			  </block>
			</view>
		</view>
		<view v-else class="Peoplenormal">
			暂无推广人
		</view>
		
	</view>
</template>

<script>
	import headerimgs from '../../../static/img/headerimg.jpg'
	export default {
		data() {
			return {
				list:[],
				headerimgs:headerimgs
			};
		},
		onLoad() {
			this.getinfoUser()
		},
		methods:{
			getinfoUser(){
				let optionType = "select"
				let srv = "srvvip_member_benefits_select"
				let app ='vip'
				let user =uni.getStorageSync('login_user_info')
				let userNo =(user.user_no) 
				let shopInfo =uni.getStorageSync('shopInfo')
				let shopNo =(shopInfo.no) 
				let req = {
					"serviceName": "srvvip_member_benefits_select",
					"colNames": [
						"*"
					],
					"condition": [
						{
							"colName": "up_user_no",
							"ruleType": "eq",
							"value": userNo
						},
						 {
							"colName": "shop_no",
							"ruleType": "eq",
							"value": shopNo
						}
					],
					"page": {
						"pageNo": 1,
						"rownumber": 10
					}
				}
				this.onRequest(optionType, srv, req,app).then((res) => {
					// let item = (res.data.data[0])
					this.list=(res.data.data)
				})
			},
		}
	}
</script>

<style lang="less">
.agent{
	.head{background:-webkit-linear-gradient(top, #4EC28E, #1C9C63);color: #fff;text-align: center;padding: 40px 10px 30px;}
	.head span{font-size: 30px;padding: 0 5px;}
	.t_tou{display: flex;padding: 10px;height: 30px;line-height: 30px;margin-bottom: 10px;}
	.tou_1{width: 34%;text-align: center;}
	.t_01{display: flex;height: 45px;line-height: 45px;}
	.t_01_1{width: 34%;text-align: center;}
	.t_01_1 img{width: 30px;height: 30px;border-radius: 30px;margin-top: 7.5px;}
	.t li:nth-of-type(odd){ background-color: #EEEEEE;} 
	.t li:nth-of-type(even){background-color: #fff;} 
	.Peoplenormal{
		text-align: center;
		line-height: 50px;
		color: #888484;
	}
}
</style>
