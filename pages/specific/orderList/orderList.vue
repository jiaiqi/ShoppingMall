<template>
	<view class="order-list-wrap">
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的订单</block>
		</cu-custom>
		<view class="order_top">
			<tab-item :currType='currType' :tabData='tabData' :showSearch='true' @clickTabs='clickTabs' :rowNumber='3'></tab-item>
		</view>
		<!-- <view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<input type="text" placeholder="搜索cuIcon" confirm-type="search" @input="searchIcon"></input>
				<text @tap="search" class="cuIcon-search"></text>
			</view>
		</view> -->
		<bx-dab-list
		  ref="dbList"
		  :serviceName="listConfig.serviceName"
		  :condition="listConfig.condition"
		  :pageType="listConfig.pageType"
		  :viewTemp="listConfig.viewTemp"
		  :listConfig="listConfig.listConfig"
		  :searchWords="listConfig.searchVal"
		  :botBtn="listConfig.botBtn"
		  :rowButtons="listConfig.rowButtons"
		  :searchColumn="'goods_name'"
		  :rownumber="5"
		  :fixed="false"
		  :heightStyle="listConfig.heightStyle"
		  :top="'-50'"
		  :bottom="'20'"
		  @click-list-item="clickItem"
		  @list-change="listChange"
		  @clickFootBtn="clickFootBtn"
		  @loadEnd="loadEnd"
		  @clickListItemCont="clickListItemCont"
		></bx-dab-list>
	</view>
</template>

<script>
	// import tabList from '@/components/bx-tab-list/bx-tab-list'
	import bxDabList from '@/components/bx-double-data-list/bx-dabule-data-list.vue'
	import tabItem from '@/components/bx-tab-list/bx-tab-list'
	export default {
		name:'orderlist',
		components:{tabItem,bxDabList},
		data(){
			return {			
				listConfig:{
					serviceName:"srvshop_order_list",
					condition:[
						// {
						// 	"colName": "user_no",
						// 	"ruleType": "eq",
						// 	"value": uni.getStorageSync('login_user_info').user_no
						// }
					],
					pageType:"list",
					viewTemp:{
						title: 'name',
						tip: 'desc',
						img: 'img',
						price: 'current_price',
						footer: 'shop_name'
					},
					heightStyle:"calc(100vh - 100px)",
					listConfig:null,
					searchVal: '',
					botBtn:[{
						state:'待付款',
						btn:[{
							key:'cancel',
							value:'取消订单'
						},{
							key:'gopay',
							value:'去支付'
						}]
						
					},{
						state:'待收货',
						btn:[{
							key:'del',
							value:'收货'
						}]
						
					}],
					rowButtons:[
						{
							button_name:"取消订单",
							button_type:"_dev",
							application:"shop",
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								{
									colName:"order_state",
									"ruleType": "eq",
									"value": "待付款"
								}
							]
						},
						{
							button_name:"去支付",
							button_type:"_dev",
							application:"shop",
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								{
									colName:"order_state",
									"ruleType": "eq",
									"value": "待付款"
								}
							]
						},
						{
							button_name:"收货",
							button_type:"_dev",
							application:"shop",
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								{
									colName:"order_state",
									"ruleType": "eq",
									"value": "待收货"
								}
							]
						}
					],
					btnCol:['order_state']
				},
				tabData:[
					{
						label:'全部',
						value:'全部'	,
						count:0
					},
					{
						label:'待付款',
						value:'待付款',
						count:0
					},
					{
						label:'待收货',
						value:'待收货',
						count:0
					}	
				],
				shopInfo:[],
				currType:null,
				currentTab:null,
			}
		},
		methods:{
			/** tab组件获取点击当前数据*/
			clickTabs(tab){
				this.currentTab = tab
				this.findCurrent(tab)
				this.$refs.dbList.onRefresh()
			},
		
			listChange(e){
				console.log(e)
			},
			clickItem(e){
				let a = e.order_no.toString()
				let carNo = encodeURIComponent(a)
				uni.navigateTo({
					url:`/pages/specific/placeOrders/placeOrders?order_no=${carNo}&fromPath=orderList`
				})
				console.log("clickItem外部",e)
			},
			loadEnd(e){
				console.log(e)
			},
			clickListItemCont(e){
				uni.navigateTo({
					url:`/pages/specific/goodsDetail/goodsDetail?no=${e.goods_no}`
				})
				console.log("中间部分",e)
			},
			clickFootBtn(e){
				console.log("e-----",e)
				let that = this
				if(e.button.button_name === '取消订单'){
					uni.showModal({
						title: '提示',
						content: '确定取消吗？',
						success: function (res) {
							if (res.confirm) {
								that.cancelOrder(e.row)												
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else if(e.button.button_name === '去支付'){
					let carGoods = e.row.order_goods
					let carGoodsNo = []
					carGoodsNo = carGoods.map((item,index)=>{
						return item.card_no
					})
					let a = e.row.order_no.toString()
					let carNo = encodeURIComponent(a)
					uni.navigateTo({
					    url: `/pages/specific/placeOrders/placeOrders?order_no=${carNo}&fromPath=payOrder`				
					});
				}else if(e.button.button_name === '收货'){					
					this.updateTabNum()					
					this.reap(e.row.order_no)
				}
			},
			searchIcon(e){
				this.listConfig.searchVal = e.detail.value
			},
			search(){
				// this.listConfig.searchVal = e.detail.value
				// co
				// let keywords = this.searchVal;
				this.$refs.dbList.toSearch();
			},
			/** 收货*/
			async reap(order_no){
				let serviceNames = "srvshop_order_take"
				let req = [
							{
								"serviceName": "srvshop_order_take",
								"data": [
									{
										"order_no": order_no
									}
								]
							}
						]
				let res = await this.onRequest('operate',serviceNames,req,'shop')
				if(res.data.resultCode === "SUCCESS"){
					uni.showToast({
					    title: '收货成功',
					    duration: 1000
					})
					this.$refs.dbList.onRefresh()
					this.updateTabNum()
				}
			},
			/** 取消订单*/
			async cancelOrder(row){
				let serviceNames = "srvshop_order_cancel"
				let req = [
					{
						data:[{
							"app_no": "APPNO20200107181133",
							"shop_no": row.shop_no,
							"order_no": row.order_no
						}],
						serviceName: serviceNames,
					}
				]
				let res = await this.onRequest('operate',serviceNames,req,'shop')
				if(res.data.resultCode === "SUCCESS"){
					uni.showToast({
					    title: '取消成功',
					    duration: 1000
					})
					this.$refs.dbList.onRefresh()
					this.updateTabNum()
				}
				console.log("------",res)
			},
			/** 组装所需要的condition*/
			findCurrent(option){
				let user_no = uni.getStorageSync('login_user_info').user_no
				let conditionObj = {}
				let conditions = [{
					"colName": "user_no",
					"ruleType": "eq",
					"value": user_no
				},{
					"colName": "state",
					"ruleType": "notnull",
				}]
				let tab = option
				conditions = conditions.map((item,index) =>{
					if(item.colName === 'state' && this.isInvalid(tab.value) && tab.value !== '全部' ){
						// item.value = tab.status
						item = {
							colName:'order_state',
							ruleType:'eq',
							value:tab.value
						}
					}
					// if(item.colName === 'state' && this.isInvalid(tab.value) && tab.value === '待收货'){
					// 	item = {
					// 		colName:'order_state',
					// 		ruleType:'eq',
					// 		value:'待收货'
					// 	}
					// }
					return item
				})
				this.listConfig.condition = conditions
				// this.$refs.dbList.onRefresh()
			},
			updateTabNum(){
				// let user_no = uni.getStorageSync('login_user_info').user_no
				// let cond = [{
				// 	"colName": "user_no",
				// 	"ruleType": "eq",
				// 	"value": user_no
				// },{
				// 	"colName": "order_state",
				// 	"ruleType": "eq",
				// 	"value": "正常"
				// }]
				// let tabData = this.tabData
				// let allCount = 0
				// 	this.getClassify("srvshop_order_select","state",cond).then(tabCount=>{
				// 		tabCount.forEach(counts=>{
				// 			allCount = allCount + counts.id
				// 			tabData.forEach(tab=>{
				// 				if(tab.label === "全部"){
				// 					tab.count = allCount
				// 				}
				// 					if(counts.state === tab.label){
				// 						tab.count = counts.id
				// 					}
				// 				})
				// 		})					
				// 	})
				let that = this
				let user_no = uni.getStorageSync('login_user_info').user_no
				let cond = [{
					"colName": "user_no",
					"ruleType": "eq",
					"value": user_no
				}]
				let tabData = this.tabData
					this.getClassify("srvshop_order_select","state",cond).then(tabCount=>{
						that.getClassify("srvshop_order_select","order_state",cond).then(tabCountTwo=>{
							let newBtnData = [...tabCount,...tabCountTwo]
							for (let i = 0; i < this.listConfig.btnCol.length; i++) {
								for(let j = 0; j <newBtnData.length;j++){
									if(newBtnData[j][this.listConfig.btnCol[i]]){
										newBtnData[j]['status'] = newBtnData[j][this.listConfig.btnCol[i]]
									}
								}
							}
								let allCount = 0
								tabData.forEach(tab=>{
									let hasOnly = false
									if(tab.label === "全部"){
										let conds = [{
											"colName": "user_no",
											"ruleType": "eq",
											"value": user_no
										}]
										let reqs = {
											"serviceName": "srvshop_order_select",
											"colNames": ["*"],
											"condition": conds,		
										}
										this.onRequest("select","srvshop_order_select",reqs,"shop").then(a=>{
											tab.count = a.data.data.length
											console.log('newBtnData==========',newBtnData)
										})
									}else{
										newBtnData.forEach(counts=>{
											if(tab.label === '待收货' && counts.status === '已发货'){
												tab.count = counts.id
												hasOnly = true
											}else if(tab.label === counts.status){
												tab.count = counts.id
												hasOnly = true
											}										
										})
										if(!hasOnly){
											tab.count = 0
										}
									}
										
								})					
							})
						})
			},
		},
		mounted(){		
			this.$refs.dbList.onRefresh()			
		},
		onLoad(option){		
			this.currType = option
			this.updateTabNum()
			this.findCurrent(this.currType)
			// if(option.status === '全部'){
			// 	let conditions = [{
			// 		"colName": "user_no",
			// 		"ruleType": "eq",
			// 		"value": user_no
			// 	},{
			// 		"colName": "state",
			// 		"ruleType": "notnull",
			// 	}]
			// 	this.listConfig.condition = conditions
			// }
		}
		
	}
</script>

<style lang="scss">
	.order-list-wrap{
		min-height: 100vh;
		background-color: #f2f2f2;
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
	.order_list{
		flex: 1;
		.goods{
			background-color: white;
			border-radius: 15upx;
			margin: 15upx;			
			.goods_shop{
				display: flex;
				border-bottom: 1px solid #f4f4f4;
				margin: 10upx;
				padding: 10upx 0;
				image{
					width: 40upx;
					height: 40upx;
					margin-right:10upx;
				}
			}
			.goods_list{
				display: flex;
				flex-direction: column;
				.shop{
					display: flex;
					border-bottom: 1px solid #f4f4f4;
					margin: 10upx;
					.goods_list_left{
						image{
							width: 200upx;
							height: 200upx;
						}
					}
					.goods_list_rig{
						display: flex;
						flex-direction: column;
						.goods_top{
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.goods_cen{
							display: flex;
							margin-top: 10px;
							color: #666;
							.spec_left{
								display: flex;
								align-items: center;
								// background: #f7f7f7;
								padding: 8upx ;
								.spec{
									margin-right: 8upx;
								}
							}
						}
						.goods_bot{
							display: flex;
							align-items: center;
							.spec_num{
								display: flex;
								margin-left: 10upx;
							}
							
						}
					}
				}
				.shop_figure{
					.shop_figure_con{
						display: flex;
						justify-content: space-around;
						padding: 10upx 0;
						border-bottom: 1px solid #f7f7f7;
					}
				}
			}
		}
	}
</style>
