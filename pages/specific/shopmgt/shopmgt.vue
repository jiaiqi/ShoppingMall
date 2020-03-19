<template>
	<view class="">
		<view class="cu-card case" :class="'no-card'">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<image v-if="shopInfo !== null && shopInfo._thumbnail && shopInfo._thumbnail.length > 0" class="cu-avatar round lg"
						 :src="shopInfo._thumbnail[0]._url + '&thumbnailType=fwsu_100'"></image>
						<view v-if="shopInfo !== null" class="content flex-sub">
							<view class="text-green text-xl text-bold flex justify-between">
								{{shopInfo.name ? shopInfo.name : "--"}}
								<text class="cu-tag" :class="shopInfo.state ? (shopInfo.state === '启用' ? 'bg-green' : 'bg-gray') :' bg-gray'">{{shopInfo.state ? shopInfo.state === "启用" ? "营业中" : "停业" : "--"}}
								</text>
								<view class="action">
									
									<text class="cu-tag round bg-blue light" @click="toUpdateShopInfo">店铺设置</text>
								</view>
							</view>
							<view class="text-gray text-sm flex justify-between">
								开店时间：{{shopInfo.create_time ? shopInfo.create_time : "--"}}
								<view class="action">
									<text class="cu-tag round bg-blue light" @click="toShare">分享店铺</text>
								</view>
							</view>
							
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class='mo'>
			<view class='mo_01'>数据交易</view>
			<view class='' @click="alldate(orderfrom)" style="font-size: 28upx;
    font-weight: bold;">查看全部</view>
		</view>
		<view class="shuju">
			<view class="shuju_01" v-for=" (item,index) in orderfrom">
				<view>{{item.title}}</view>
				<view class="shuju_01_s">{{item.indent}}</view>
				<view class="shuju_01_s">{{item.sum?'￥'+item.sum:''}}</view>
			</view>
		</view>

		<bxClassify
			v-if="bxclassConfig.data.length > 0"
			:gridData='bxclassConfig.data'
			:columnNum="bxclassConfig.gridCol"
			:errTips='bxclassConfig.errTips'
			:serviceName="bxclassConfig.serviceName"
			:loadType="bxclassConfig.loadType"
			:options="bxclassConfig.options"
			:condition="bxclassConfig.condition"
			:IsMoreButton="bxclassConfig.IsMoreButton"
			:rowNum="bxclassConfig.rowNum"
			@on-grid-item="onGridItem"
			>
		</bxClassify> 
	</view>
</template>

<script>
	import bxClassify from '@/components/bx-classify/bx-classify.vue';
	export default {
		components: {
			bxClassify
		},
		data() {
			return {
				bxclassConfig: {
					"serviceName": "srvsys_user_menu_select",
					"condition": [],
					"options": {
						"key_disp_col": "menu_name",
						"no_col": "menu_no",
						"parent_no_col": "parent_no",
						"is_tree": true,
						"images": "app_icon"
					},
					IsMoreButton: true,
					moreLink: "",
					data: [],
					gridCol: 4, //列数
					rowNum: 2,
					errTips: '打不开',
					loadType: 'gridData',
				},
				orderfrom: [{
						title: '今日订单/金额',
						indent: '-',
						sum: '-'
					},
					{
						title: '昨日订单/金额',
						indent: '-',
						sum: '-'
					},
					{
						title: '总订单数',
						indent: '-'
						
					},
					{
						title: '总销售金额',
						sum: '-'
					},
				],
				menuData: [],
				today:{},
				yesday:{},
				allnum:{},
				mgtNum:null
			}
		},
		computed: {
			shopInfo: function() {
				let self = this
				return self.$store.getters.getShopInfo
			}
		},
		methods: {
			NavChange: function(e) {
				console.log(e)
				this.PageCur = e.currentTarget.dataset.cur
			},
			alldate(item){
				uni.navigateTo({
					url:'/pages/specific/commissionRecord/businessData?item='+ encodeURIComponent(JSON.stringify(item))
				})
			},
		async getorderForm(time,date) {  //今日
				let optionType = "select"
				let srv = "srvshop_order_select"
				let app = 'shop'
				 
				let req = {
					"serviceName": "srvshop_order_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "state",
						"value": "已付款",
						"ruleType": "in"
					}
					],
					"page": {
						// "pageNo": 1,
						// "rownumber": 10
					},
					"order": [],
					"group": [{
							"colName": "order_money",
							"type": "sum"
						},
						{
							"colName": "addres_no",
							"type": "count_all"
						}
						
					]
				}
				if(time){
					req.condition.push({
						"colName": "order_time",
						"value": time,
						"ruleType": "like"
					})
					req.group.push({
							"colName": "order_time",
							"type": "by_date"
						},)
				}
				this.onRequest(optionType, srv, req, app).then((res) => {
					let item =(res.data.data[0])
				
					if(date=='today'){
						if(item){
							this.orderfrom[0].indent=item.addres_no?item.addres_no:0
							this.orderfrom[0].sum=item.order_money?item.order_money:0
						}
						console.log(item,'=============')
					}else if(date=='yesday'){
						this.orderfrom[1].indent=item.addres_no
						this.orderfrom[1].sum=item.order_money
					}else{
						this.orderfrom[2].indent=item.addres_no
						this.orderfrom[3].sum=item.order_money
					}
						
					console.log(item,'-------------')
	
				})
			},
			getUsermenu() {
				let self = this
				let reqs = {
					"serviceName": "srvsys_user_menu_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "client_type",
						"ruleType": "like",
						"value": "APP"
					}],
					"order": [{
						colName: "seq",
						orderType: "asc"
					}]
				}
				this.onRequest("select", "srvsys_user_menu_select", reqs, "shop").then((res) => {
					// this.menuData = (res.data.data)
					this.bxclassConfig.data = (res.data.data)
					this.bxclassConfig.data = this.bxclassConfig.data.filter((item, index) => {
						if (item.is_leaf === "是" && (item.service_name === 'srvvip_category_select' || 
							item.menu_no === 'bxvip_member' || 
							item.menu_no === 'bxshop_goods_category' ||
							item.menu_no === 'bxshop_goods' || 
							item.menu_no === 'bxshop_order')) {
							if(item.menu_no === 'bxshop_order'){
								item["badge"] = this.mgtNum
								// 订单显示待办订单提示数量。
							}
							return item
						}
					})
					self.onRequest("select", "srvsys_user_menu_select", reqs, "vip").then((requests) => {
						let menus = requests.data.data

						menus = menus.filter((items, index) => {
							if (items.is_leaf === "是" && (items.service_name === 'srvvip_category_select' || 
							items.menu_no === 'bxvip_member' || 
							items.menu_no === 'bxshop_goods_category' ||
							items.menu_no === 'bxshop_goods' || 
							items.menu_no === 'bxshop_order')) {
								self.bxclassConfig.data.push(items)
								return items
							}
						})
						// self.bxclassConfig.data = self.bxclassConfig.data.concat(menus)
					})
				})
			},
			onGridItem(e) {
				switch (e.service_name) {
					case 'srvshop_goods_category_select':
						uni.navigateTo({
							url: "/pages/specific/classify/classify?serviceName=" + e.service_name
						})

						break;
					case 'srvshop_order_select':
						uni.navigateTo({
							url: "/pages/specific/backOrderList/backOrderList"
						})

						break;
					case 'srvshop_goods_select':
						let tabData = [{
								count: 0,
								label: "上架",
								value: "上架"
							},
							{
								count: 0,
								label: "下架",
								value: "下架"
							}
						]
						uni.navigateTo({
							url: "/pages/specific/goodsmgt/goodsmgt?serviceName=" + e.service_name + "&tabData=" + JSON.stringify(tabData)
						})
						break;
					case 'srvvip_member_select':
						uni.navigateTo({
							url: "/pages/specific/member/member?serviceName=" + e.service_name
						})
						break;
					case 'srvvip_category_select':
						uni.navigateTo({
							url: "/pages/specific/vipClassify/vipClassify?serviceName=" + e.service_name
						})
						break;
					default:
						break;
				}
			},
			toUpdateShopInfo() {
				let params = {
					"type": "update",
					"condition": [{
						"colName": "no",
						"ruleType": "in",
						"value": uni.getStorageSync("shopNo")
					}],
					"serviceName": "srvshop_reg_update",
					"defaultVal": null
				}
				uni.navigateTo({
					url: "/pages/public/formPage/formPage?params=" + JSON.stringify(params)
				})
			},
			toShare() {
				let data = {
					name: "",
					price: "",
					photo: this.shopInfo._thumbnail[0]._url,
					codeurl: window.location.origin +'/mallshop'+ this.$api.homePath + "?up_user=_shopmall",
					type: 'shopmall',
				}
				uni.navigateTo({
					url: "/pages/specific/sharephoto/sharehtml?data=" + JSON.stringify(data)
				})
			},
			mgtOrderListNum(){
				// let user_no = uni.getStorageSync('login_user_info').user_no
				let cond = [{
					"colName": "order_state",
					"ruleType": "in",
					"value": "待付款,待发货"
				}]
				this.getClassify("srvshop_order_select","state",cond).then((res)=>{
					console.log("getClassify----",res)
					if(res.length > 0){
						this.mgtNum = 0
						res.map((item)=>{
							this.mgtNum +=  item.id 
						})
					}
					
				})
			}
		},
		onLoad() {
			this.getUsermenu()
			console.log(self.$store.getters.getShopInfo())
		},
		async created() {
			let currentDate = (new Date()).toISOString().slice(0,10)
			let preDate = (new Date(new Date(currentDate).getTime()-24*60*60*1000)).toISOString().slice(0,10)
			
			this.mgtOrderListNum()
			this.getUsermenu()
			this.getorderForm(currentDate,'today')
			this.getorderForm(preDate,'yesday')
			this.getorderForm()
		}
	}
</script>

<style>
	.header_content {
		height: 260upx;
		overflow: hidden;
	}

	.shuju {
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
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
</style>
