<template>
	<view class="mingxi">
		<view style="display: flex;justify-content: flex-end;margin-bottom: 10px;">
			<view class="head_btn cu-btn round sm line-red text-red cuIcon-_dev" @click="jump_cash">去提现</view>
		</view>
		<view class="ticheng">
			<block>
				<li class="tc" @click="jump()" v-for="(item,index) in list">
					<view class="tc_l">
						<span style="color: #000;font-weight: 600;">来自&nbsp;[<text style="color: #2f8aec;margin: 0 3px;">{{name(item.order_user_no)}}</text>]&nbsp;的订单佣金:</span><br />{{item.create_time}}
					</view>
					<view class="tc_2">
						+{{item.amount+'(已提现'+item.withdraw_amount+'元)'}}<br />
						<span class="state" v-if="num==0">{{item.state}}</span>
					</view>
				</li>
			</block>
		</view>
	</view>
</template>

<script>
	// import uniIcon from "@/components/uni/uni-icon/uni-icon.vue"
	export default {
		data() {
			return {
				list: [],
				num: 0,
			};
		},
		onLoad() {
			this.getrocord()
		},
		methods: {
			name(name){
				if(name.length<=5){
					return name
				}else{
					return  name.substring(0,4)+'*'
				}
			},
			jump_cash() {
				uni.navigateTo({
					url: '/pages/specific/commissionRecord/cash'
				})
			},
			getrocord() {
				let optionType = "select"
				let srv = "srvvip_comm_record_select"
				let app = 'vip'
				let req = {
					"serviceName": "srvvip_comm_record_select",
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
				})
			},
			change(e) {
				this.num = e
			}
		}
	}
</script>

<style lang="less">
	.mingxi {
		.head {
			display: flex;
			margin: 10px 0;
		}

		.head_l {
			display: flex;
			width: 85%;
			justify-content: space-around;
		}

		.head_r {
			width: 15%;
			text-align: center;
		}

		.head_l_1 {
			border: 1px solid #F2F2F2;
			padding: 0px 15px;
			line-height: 25px;
		}

		.head_btn {
			margin: 10px 20px 0;
			border: 1px solid #F2F2F2;
			padding: 0px 15px;
			line-height: 25px;
		}

		.ling {
			color: #E1461D;
			border: 1px solid #E1461D;
			padding: 0px 15px;
			line-height: 25px;
		}

		.shouyi {
			border-top: 1px solid #EBEBEB;
			border-bottom: 1px solid #EBEBEB;
			background-color: #FAFAFA;
			display: flex;
			height: 30px;
			line-height: 30px;
			padding: 3px 10px;
			margin-top: 15px;
		}

		.sy_l {
			width: 50%;
		}

		.sy_l span {
			font-weight: bold;
		}

		.ticheng li:nth-of-type(odd) {
			background-color: #EEEEEE;
		}

		.ticheng li:nth-of-type(even) {
			background-color: #fff;
		}

		.tc {
			display: flex;
			justify-content: space-between;
			padding: 10px;
			line-height: 25px;
			font-size: 14px;
		}

		.tc_l {
			color: #9A9A9A;
		}

		.tc_l text {
			font-size: 14px;
			font-weight: bold;
			color: #000;
		}

		.tc_2 {
			color: #E1461D;
		}

		.tc_2 span {
			color: #9A9A9A;
		}
	}
	.state{
		float: right;
	}
</style>
