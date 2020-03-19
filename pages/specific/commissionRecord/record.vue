<template>
	<view class="record">
		<view class="head">
			<view class="head_l">
				<view class="head_l_1">余额（元）</view>
				<view class="head_l_2">{{ money}}</view>
			</view>
			<view class="head_r" @click="jump_cash">提现</view>
		</view>
		<block v-for="(item,index) of list" :key="index">
			<view class="list">
				<view class="list_01">
					<view class="list_01_l">提现</view>
					<view class="list_01_r">-{{item.withdraw_amount}}</view>
				</view>
				<view class="list_02">
					<view class="list_01_l">{{item.withdraw_time}}</view>
					<!-- <view class="list_01_r" >处理中</view> -->
					<view class="" >交易成功</view>
				</view>
			</view>
		</block>
		<view class="Peoplenormal" v-if="listboole">
			暂无提现记录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				listboole:false,
				money:''
			};
		},
		onLoad() {
			this.getinfoUser()
			uni.showLoading({
				title:'请稍后'
			})
			this.getmessage().then(()=>{
				setTimeout(()=>{
					uni.hideLoading()
				},500)
			})
		},
		methods: {
			jump_cash() {
				uni.navigateTo({
					url: '/pages/specific/commissionRecord/cash',
				});
			},
		async	getmessage() {
				// https://srvms.100xsys.cn/vip/select/srvvip_comm_drawings_record_select?srvvip_comm_drawings_record_select
				let optionType = "select"
				let srv = "srvvip_comm_drawings_record_select"
				let app = 'vip'
				let req = {
					"serviceName": "srvvip_comm_drawings_record_select",
					"colNames": ["*"],
					"condition": [],
					"page": {
						"pageNo": 1,
						"rownumber": 10
					},
					"order": []
				}
				this.onRequest(optionType, srv, req, app).then((res) => {
					this.list=(res.data.data)
					if(res.data.data.length=='0'){
						this.listboole=true
					}
				})
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
					this.money=(res.data.response[0].response.atPresentComm)
				})
			},
		}
	}
</script>

<style lang="scss">
	.Peoplenormal{
		text-align: center;
		line-height: 80px;
		color: #888484;
		font-size: 32upx;
	}
	.record {
		font-size: 14px;

		.head {
			background: -webkit-linear-gradient(top, #4EC28E, #1C9C63);
			padding: 20px 10px;
			display: flex;
			justify-content: space-between;

			.head_l {
				color: #fff;

				.head_l_2 {
					font-size: 22px;
					padding-top: 10px;
				}
			}

			.head_r {
				background-color: #fff;
				color: #FD6766;
				height: 30px;
				line-height: 30px;
				width: 90px;
				text-align: center;
				border-radius: 20px;
				margin-top: 15px;
			}
		}

		.list {
			margin: 15px 10px;
			box-shadow: 0px 0px 10px #EDEDED;
			border-radius: 5px;
			padding: 15px 10px;

			.list_01 {
				display: flex;
				justify-content: space-between;
				font-size: 16px;
				font-weight: 600;
				padding-bottom: 10px;
			}

			.list_02 {
				display: flex;
				justify-content: space-between;
				color: #9A9A9A;

				.list_01_r {
					color: #FC4F50;
				}
			}
		}
	}
</style>
