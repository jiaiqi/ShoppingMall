<template>
	<view class="back-order-wrap">
		<tab-list :currType='currType' :tabData='tabData' @clickTabs='clickTabs' :rowNumber='4'></tab-list>
		<dabule-list
			ref="dbList"
			:serviceName="listConfig.serviceName"
			:condition="listConfig.condition"
			:pageType="listConfig.pageType"
			:viewTemp="listConfig.viewTemp"
			:listConfig="listConfig.listConfig"
			:searchWords="listConfig.searchVal"
			:botBtn="listConfig.botBtn"
			:rownumber="5"
			:heightStyle="listConfig.heightStyle"
			:fixed="false"
			:rowButtons="listConfig.rowButtons"
			:top="'20'"
			:bottom="'20'"
			@click-list-item="clickItem"
			@list-change="listChange"
			@clickFootBtn="clickFootBtn"
			@loadEnd="loadEnd"
			@clickListItemCont="clickListItemCont"
		></dabule-list>
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green" @tap="shipments">确定</view>
					<view class="action text-blue" @tap="hideModal">取消</view>
				</view>
				<view class="padding-xl">
					<bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="fields"></bxform>
				</view>
			</view>
		</view>
		<view class="cu-modal radio-wrap " :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog radio-list">
				<view class="cu-bar bg-white justify-end">
					<view class="content">输入关闭原因</view>
					<!-- <view class="action">
						<text class="cuIcon-close text-red"></text>
					</view> -->
				</view>
				<view class="padding-df">
					<view class="question">
						<textarea maxlength="-1" @input="textareaAInput" placeholder="输入关闭原因"></textarea>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action action-bot">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="closeOrder">确定</button>				
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import tabList from '@/components/bx-tab-list/bx-tab-list.vue'	
	import dabuleList from '@/components/bx-double-data-list/bx-dabule-data-list.vue'
	import bxform from '@/components/bx-form/bx-form.vue';
	export default {
		name:'backOrderList',
		components:{tabList,dabuleList,bxform},
		data(){
			return {
				currType:{},				
				modalName: null,
				serviceName:'srvshop_ship_record_add',
				shopInfo: uni.getStorageSync("shopInfo"),
				defaultVal:{ 
					"order_no": "", //订单号
					"ship_address": "", //发货地址
					"ship_type": "邮寄", // 发货类型
					"tracking_no":"", // 快递单号
					"tracking":"", // 快递商家
				},				
				condition:[],
				fields: [],
				type: 'add',
				tabData:[{
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
						label:'待发货',
						value:'待发货',
						count:0
					},{
						label:'待收货',
						value:'待收货',
						count:0
					}],
				currentTab:{},
				listConfig:{
					heightStyle:'calc(100vh - 45px)',
					serviceName:"srvshop_order_list",
					condition:[],
					pageType:"list",
					viewTemp:{
						title: 'name',
						tip: 'desc',
						img: 'img',
						price: 'current_price',
						footer: 'shop_name'
					},
					listConfig:null,
					searchVal: '',
					rowButtons:[
						{
							button_name:"取消订单",
							button_type:"_dev",
							button_color:"line-yellow",
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
							button_name:"发货",
							button_type:"_dev",
							button_color:"line-red",
							application:"shop",							
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								{
									colName:"order_state",
									"ruleType": "eq",
									"value": "待发货"
								}
							]
						},
						{
							button_name:"关闭订单",
							button_type:"_dev",
							button_color:"line-grey",
							application:"shop",
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								{
									colName:"order_state",
									"ruleType": "eq",
									"value": "待发货"
								}
							]
						}
					],
					botBtn:[
					{
						state:'待付款',
						btn:[]						
					},{
						state:'待发货',
						btn:[{
							key:'close',
							value:'关闭订单'
						},{
							key:'deliver',
							value:'发货'
						}]
						
					},{
						state:'待收货',
						btn:[]						
					},{
						state:'已付款',
						btn:[]						
					}],
					btnCol:['order_state']
				},
				textareaAValue:'', //输入框的内容
				currClose:{}
			}
		},
		methods:{
			clickTabs(tab){
				console.log(tab)
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
					url:`/pages/specific/placeOrders/placeOrders?order_no=${carNo}&fromPath=merchantOrder`
				})
				console.log("clickItem",e)
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
			textareaAInput(e) {
				this.textareaAValue = e.detail.value
			},
			clickFootBtn(e){
				console.log("clickFootBtn",e)
				let that = this
				if(e.button.button_name === '取消订单'){
					uni.showModal({
						title: '提示',
						content: '确定关闭吗？',
						success: function (res) {
							if (res.confirm) {
								that.cancelOrder(e.row)												
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else if(e.button.button_name === '发货'){
					this.modalName = "bottomModal"
					this.defaultVal.order_no = e.row.order_no
					let option = {
							"type": "add",
							"condition": [
								{
									"colName": "no",
									"ruleType": "in",
									"value": uni.getStorageSync("shopNo")
								}
							],
							"serviceName": "srvshop_ship_record_add",
							"defaultVal": this.shopInfo						
					}
					if (option.hasOwnProperty('loadedType')) {
					  this.loadedType = option.loadedType;
					} else if (option.hasOwnProperty('params')) {
					  this.serviceName = this.params.serviceName;
					  this.type = this.params.type;
					  this.condition = this.params.condition;
					  this.defaultVal = this.params.defaultVal;
					  this.getFieldsV2();
					} else if (option.serviceName && option.type) {
					  this.serviceName = option.serviceName;
					  this.type = option.type;
					  this.getFieldsV2();
					} else {
					  uni.showToast({
					    title: '加载错误'
					  });
					}
				}else if(e.button.button_name === '关闭订单'){
					this.modalName = 'Modal'
					this.currClose = e.row
					// this.closeOrder(e.row)
				}
			},
			/** 关闭订单*/
			async closeOrder(){
				console.log('输入原因：',this.textareaAValue)
				let serviceNames = "srvshop_order_refund"
				let req = [
						{
							"data": [
								{
									"app_no": "APPNO20200107181133", //app编号
									"wx_mch_id": uni.getStorageSync('shopNo'),//商户号
									"order_no":  this.currClose.order_no,//订单号
									"refund_desc": this.textareaAValue //退款原因
								}
							],
							"serviceName": "srvshop_order_refund"
						}
					]
				let res = await this.onRequest('operate',serviceNames,req,'shop')
				if(res.data.resultCode === "SUCCESS"){
					this.modalName = null,
					uni.showToast({
					    title: '关闭成功',
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
			/** 更新及获取tab数字*/
			updateTabNum(){
				let that = this
				let user_no = uni.getStorageSync('login_user_info').user_no
				let cond = []
				let tabData = this.tabData
					this.getClassify("srvshop_order_select","state",cond).then(tabCount=>{
						that.getClassify("srvshop_order_select","order_state").then(tabCountTwo=>{
							let newBtnData = [...tabCount,...tabCountTwo]
							for (let i = 0; i < this.listConfig.btnCol.length; i++) {
								for(let j = 0; j <newBtnData.length;j++){
									if(newBtnData[j][this.listConfig.btnCol[i]]){
										newBtnData[j]['status'] = newBtnData[j][this.listConfig.btnCol[i]]
									}
								}
							}
							console.log('newBtnData==========',newBtnData)
								let allCount = 0
								tabData.forEach(tab=>{
									let hasOnly = false
									if(tab.label === "全部"){
										let cond = [{
											colName:'shop_no',
											ruleType:'eq',
											value:uni.getStorageSync('shopNo')
										}]
										let reqs = {
											"serviceName": "srvshop_order_select",
											"colNames": ["*"],
											"condition": cond,		
										}
										this.onRequest("select","srvshop_order_select",reqs,"shop").then(a=>{
											tab.count = a.data.data.length
										})
									}else{
										newBtnData.forEach(counts=>{							
											if(tab.label === counts.status){
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
			getFieldsV2: async function() {
			  let colVs = await this.getServiceV2(this.serviceName, this.type, this.type);
			  this.colsV2Data = colVs;
			  console.log("colVs----",colVs)
			  switch (this.type) {
			    case 'update':
			      this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.params.defaultVal);
			      break;
			    case 'add':
			      // this.fields = colVs._fieldInfo;
				  if(this.isInvalid(this.defaultVal)){
				  	console.log("isInvalid")
				  	this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.defaultVal);
				  }else{
				  	this.fields = colVs._fieldInfo;
				  }
				            
			      break;
			    case 'detail':
			      this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.params.defaultVal);
			      break;
			    default:
			      break;
			  }
			},
			findCurrent(option){
				let shop_no = uni.getStorageSync('shopNo')
				let user_no = uni.getStorageSync('login_user_info').user_no
				let conditionObj = {}
				let tab = option
				let conditions = [{
					colName:'shop_no',
					ruleType:'eq',
					value:shop_no
				},{
					"colName": "order_state",
					"ruleType": "notnull",
				}]
				conditions = conditions.map((item,index) =>{
					if(item.colName === 'order_state' && this.isInvalid(tab.value) && tab.value !== '全部' ){
						// item.value = tab.status
						item = {
							colName:'order_state',
							ruleType:'eq',
							value:tab.value
						}
					}
					return item
				})
				this.listConfig.condition = conditions
				// let condObj = {}
				// if(tab.label !== '全部' && tab.label === '待付款'){
				// 	condObj = {
				// 		colName:'state_order',
				// 		ruleType:'eq',
				// 		value:tab.label
				// 	}
				// }else if(tab.label !== '全部' && tab.label !== '待付款'){
				// 	condObj = {
				// 		colName:'state_order',
				// 		ruleType:'eq',
				// 		value:tab.label
				// 	}
				// }
				// if(condObj.colName){
				// 	conditions.push(condObj)
				// }
				// this.listConfig.condition = conditions
				// this.$refs.dbList.onRefresh()
			},
			hideModal(e) {
				this.modalName = null
			},
			/** 发货*/
			shipments(){
				uni.showLoading({
					title: '加载中',
					mask:true
				})
				let req = this.$refs.bxForm.getFieldModel();
				let defVal = this.defaultVal
				for (let key in defVal) {
				  defVal[key] = req[key]
				}				
				let datas = []
				datas.push(defVal)
				let serviceName = 'srvshop_order_ship'
				const reqs = [{
					serviceName: serviceName,
					colNames: ['*'],	
					condition: [],
					data:datas
				}]
				this.onRequest('operate',serviceName,reqs,'shop').then(res=>{
					console.log('-----------',res)
					if(res.data.resultCode === 'SUCCESS'){
						uni.hideLoading();
						this.modalName = null
						this.updateTabNum()
						this.$refs.dbList.onRefresh()
					}
				})								
			}
		},
		mounted(){
			this.findCurrent(this.tabData[0])
			// this.findCurrent(this.tabData[0])
			// this.findCurrent(this.tabData[0])
			// this.$refs.dbList.onRefresh()
		},
		onLoad(){
			this.updateTabNum()
			// setTimeout(()=>{
			// 	this.findCurrent(this.tabData[0])
			// },1000)
		}
		
	}
</script>

<style lang="scss">
	.cu-dialog{
		height: 60vh;
	}
	.padding-xl{
		height: calc(60vh - 50px);
		overflow-y: auto;
	}
	.cu-modal.show{
		overflow-y: hidden;
	}
	.radio-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		.radio-list{
			position: relative;
			display: inline-block;
			vertical-align: middle;
			width: 340px;
			max-width: 100%;
			background-color: #f8f8f8;
			border-radius: 5px;
			overflow: hidden;
			height: auto;
		}
		
	}
	.question{
		textarea{
			margin: 16px 0 15px;
			height: 4.6em;
			width: 95%;
			line-height: 1.2em;
			-webkit-box-flex: 1;
			-webkit-flex: 1;
			flex: 1;
			font-size: 14px;
			padding: 0;
			margin: 0 auto;
		}
	}
</style>
