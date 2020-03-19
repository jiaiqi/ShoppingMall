<template>
	<view class="reseller">
		<view class="top">
			<view class="num" style="margin-left: 30px;">
				<view>昨日收益</view>
				<view class="txc">{{money.yesterdayEarnings}}</view>
			</view>
			<view class="num1" style="">
				<view>当前佣金</view>
				<view style="font-size: 40px;">{{money.atPresentComm}}</view>
			</view>
			<view class="num" style="margin-right: 30px;">
				<view>累计已提</view>
				<view>{{money.totalExtract}}</view>
			</view>
			<view class="tixian" @click="jump_cash">
				<view class="btn" style="font-size: 16px;">立即提现</view>
			</view>
			<!-- <view class="jilu">
				<navigator url="/pages/user/record/record"><view class="jl">提现记录 ></view></navigator>
			</view> -->
		</view>

		<view class="icon">
			<view class="ico" v-for="item of list"><navigator :url="item.url">
				<view class="tubiao">
					<text class="lg text-gray " :class="item.img"></text>
				</view>
				<view class="tt">
					<view class="text">{{item.title}}</view>
				</view></navigator>
			</view>
			
		</view>
		<view class="kong"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						title: '提现记录',
						img: 'cuIcon-refund',
						url:"/pages/specific/commissionRecord/record"
					},
					{
						title: '推广人统计',
						img: 'cuIcon-friend',
						url:"/pages/specific/commissionRecord/agent"
					},
					{
						title: '佣金明细',
						img: ' cuIcon-moneybag',
						url:"/pages/specific/commissionRecord/mingxi"
					}
				],
				money:{'yesterdayEarnings':'-','atPresentComm':'-','totalExtract':'-'}
			}
		},
		onLoad() {
			this.getinfoUser()
		},
		components: {},
		
		methods:{
			jump_cash(){
				uni.navigateTo({
					url: '/pages/specific/commissionRecord/cash',
				});
			},
			getinfoUser(){
				let optionType = "operate"
				let srv = "srvvip_comm_statistics"
				let app ='vip'
				let req = [
							{
								"serviceName": "srvvip_comm_statistics",
								"data":[]  //不用传参，查询的是当前登陆用户
							}
						]
				this.onRequest(optionType, srv, req,app).then((res) => {
					// let item = (res.data.data[0])
					this.money=(res.data.response[0].response)
				})
			},
		
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F5F5F5;
	}
	.lg{
		font-size: 66upx;
		color: #3DB57F;
	}
	.reseller {
		background-color: #F5F5F5;min-height:100vh;font-size:14px;

		.top {
			color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			position: relative;
			width: 100%;
			height: 250px;
			background-color: #DD524D;
			background: linear-gradient(top, #4EC28E, #1C9C63);

			.title {
				background-color: #FFFFFF
			}

			.num {
				font-size: 15px;line-height: 25px;
				text-align: center;
				margin-top: 33%;width: 33%;
				
			}
			.num1{
				margin-top: 10%; text-align: center;width: 33%;
			}
			
		}

		.jilu {
			font-size: 15px;
			position: absolute;
			left: 78%;
			top: 20%;
		}

		.tixian {
			display: flex;
			justify-content: center;
			background-color: #F5F5F5;
			width: 55%;
			height: 60px;
			border-radius: 60px;
			position: absolute;
			bottom: -30px;
			left: 23%;

			.btn {
				margin-top: 7%;
				text-align: center;
				width: 85%;
				background-color: #1C9C63;
				height: 40px;
				border: none;
				border-radius: 50px;
				line-height: 40px;
				color: #FFFFFF;
			}


		}

		.icon {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			margin-left: 3%;
			margin-right: 3%;
			margin-top: 10%;

			.ico {
				border-radius: 10px;
				border: 1px solid #C0C0C0;
				width: 49%;
				height: 100px;
				margin-top: 10px;
				display: flex;
				border: none;
				font-size: 15px;
				flex-direction: column;
				background-color: #FFFFFF;

				.img {
					width: 32px;
					height: 32px;
				}

				.tubiao {
					margin-top: 20px;
					text-align: center;
				}

				.text {
					color: #8F8F94;padding-top: 5px;
					text-align: center;
					
				}
			}
		}
		
		.kong {
			height: 100px;
		}
	}
</style>
