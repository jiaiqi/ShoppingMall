<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品管理</block>
		</cu-custom>
		<tab-item :currType='currType' :tabData='tabData' @clickTabs='clickTabs' :rowNumber='2'></tab-item>
		<bx-list
		  ref="bxList"
		  :serviceName="listConfig.serviceName"
		  :condition="listConfig.condition"
		  :pageType="listConfig.pageType"
		  :viewTemp="listConfig.viewTemp"
		  :listConfig="listConfig.listConfig"
		  :searchWords="listConfig.searchVal"
		  :searchColumn=" 'name'"
		  :rowButtons="listConfig.rowButtons"
		  :rownumber="10"
		  :fixed="false"
		  :heightStyle="'calc(100vh - 140px)'"
		  @click-list-item="clickItem"
		  @list-change="listChange"
		  @clickFootBtn="clickFootBtn"
		  @loadEnd="loadEnd"
		></bx-list>
		<view class="cu-bar tabbar bg-white shadow foot padding-xl flex justify-center">
			<button class="cu-btn bg-blue margin-right-xs lg" @click="toAddGoods"><text class="cuIcon-add"></text>新增商品</button>
		</view>
		
	</view>
</template>

<script>
	import tabItem from '@/components/bx-tab-list/bx-tab-list'
	import bxList from '@/components/bx-list/bx-list.vue'
	export default {
		components:{tabItem,bxList},
		data() {
			return {
				urloption:null,
				tabData:[{
					count:0,
					label:"上架",
					value:"上架"
				},
				{
					count:0,
					label:"下架",
					value:"上架"
				}],
				conts:[{
					state: "上架",
					id: 0
				},{
					state: "下架",
					id: 0
				}],
				serviceName:null,
				bxcurrType:null,
				listConfig:{
					serviceName:"srvshop_goods_select",
					condition:[{
							colName: "shop_no",
							ruleType: "in",
							value: uni.getStorageSync('shopNo'),
						},{
							colName: "state",
							ruleType: "eq",
							// value:(this.currType !== null ? this.currType.value : ""),
						},
					],
					rowButtons:[
						{
							button_name:"上架",
							button_type:"_dev",
							application:"shop",
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								{
									colName:"state",
									"ruleType": "eq",
									"value": "下架"
								}
							]
						},
						{
							button_name:"下架",
							button_type:"_dev",
							application:"shop",
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								{
									colName:"state",
									"ruleType": "eq",
									"value": "上架"
								}
							]
						},
						{
							button_name:"编辑",
							button_type:"edit",
							application:"shop",
							is_public:true,
							service_name:"srvshop_goods_update",
							service_view_name:"商品表修改",
							permission:true,
							button_params:[],
							isShow:[]
						}
					],
					pageType:"list",
					viewTemp:{
						title: 'name',
						tip: 'state',
						img: 'img',
						price: 'sales',
						footer: 'create_time'
					},
					listConfig:null,
					searchVal: '',
				},
			}
		},
		computed:{
			currType:function(){
				return  this.bxcurrType
			}
		},
		onLoad(option) {
			this.urloption = option
		},
		created() {
			if(this.urloption.hasOwnProperty("tabData") && this.iObject(this.urloption.tabData)){
				this.tabData = this.urloption.tabData
				this.bxcurrType = this.tabData[0]
			}else{
				this.tabData = JSON.parse(this.urloption.tabData)
				this.bxcurrType = this.tabData[0]
			}
			this.listConfig.serviceName = this.urloption.serviceName
			this.refreshList()
		},
		methods: {
			clickTabs(e){
				console.log("clickTabs",e)
				this.bxcurrType = e
			},
			getTabList(e){
				
			},
			toAddGoods(){
				let params = {
					"type": "add",
					"condition": [
					],
					"serviceName": "srvshop_goods_add",
					"defaultVal": {
						"shop_no": uni.getStorageSync("shopNo")
					}
				}
				uni.navigateTo({
					url:"/pages/public/formPage/formPage?params=" +  JSON.stringify(params)
				})
			},
			// 列表相关方法
			listChange(e){
				console.log(e)
			},
			clickItem(e){
				console.log("clickItem",e)
				uni.navigateTo({
					url:"/pages/specific/goodsDetail/goodsDetail?no=" + e.no
				})
			},
			loadEnd(e){
				console.log(e)
			},
			clickFootBtn(e){
				let self = this
				if(e.button.button_type === "_dev" && e.button.button_name){
					switch (e.button.button_name){
						case '下架':
							if(e.row && e.row.id){
								let reqs = [{
									"serviceName": "srvshop_goods_up_or_down",
									"condition": [{
										colName:"goods_nos",
										ruleType:"in",
										value:e.row.no
									}],
									"data":[{
										"state":"下架"
									}]
								}]
								uni.showModal({
								    title: '提示',
								    content: '确定下架商品，下架后该商品用户无法浏览，无法进行购买？',
									cancelText: "不用了",  
									confirmText: "是", 
								    success: function (res) {
								        if (res.confirm) {
								           self.onRequest("operate","srvshop_goods_up_or_down",reqs,"shop").then((bxres)=>{
								           	// console.log("srvshop_goods_category_select",res.data.data)
												// if(bxres.data.s)
												console.log("bxres",bxres)
												self.refreshList()
								           })
								        }
								    }
								});
							}
							
							break;
						case '上架':
							if(e.row && e.row.id){
								let reqs = [{
									"serviceName": "srvshop_goods_up_or_down",
									"condition": [{
										colName:"goods_nos",
										ruleType:"in",
										value:e.row.no
									}],
									"data":[{
										"state":"上架"
									}]
								}]
								uni.showModal({
								    title: '提示',
								    content: '确定上架商品，上架后用户可购买该商品？',
									cancelText: "不用了",  
									confirmText: "是", 
								    success: function (res) {
								        if (res.confirm) {
								           self.onRequest("operate","srvshop_goods_up_or_down",reqs,"shop").then((bxres)=>{
								           	// console.log("srvshop_goods_category_select",res.data.data)
												console.log("bxres",bxres)
												self.refreshList()
								           })
								        }
								    }
								});
							}
							break;
						case '编辑':
							if(e.row && e.row.id){
								this.onButtonToUrl(e).then(res => {
								  // console.log('footBTN :', res);
								  if (e.button && e.button.button_type === 'delete') {
								    if (res.state === 'SUCCESS') {
								      this.$refs.bxList.onRefresh();
								    }
								  }
								});
							}
							break;
						default:
							break;
					}
				}else if(e.button.is_public){
					switch (e.button.button_type){
						case 'edit':
							console.log("e.button.button_type",e.button.button_type)
							if(e.row && e.row.id){
								self.onButtonToUrl(e).then(res => {
								  // console.log('footBTN :', res);
								  if (e.button && e.button.button_type === 'delete') {
								    if (res.state === 'SUCCESS') {
								      this.$refs.bxList.onRefresh();
								    }
								  }
								});
							}
							break;
						default:
							break;
					}
				}
				
				console.log('clickFootBtn:', e);
				
			},
			refreshList(){
				let shopNo = uni.getStorageSync('shopNo')
				let cond = [{
					"colName": "shop_no",
					"ruleType": "eq",
					"value": shopNo
				},{
					"colName": "state",
					"ruleType": "ne",
					"value": ""
				}]
				this.getClassify(this.listConfig.serviceName,"state").then((res)=>{
					console.log("getClassify",res)
					this.tabData = this.tabData.map((item,index)=>{
						for(let key in res){
							if(res[key].state === item.label){
								item.count = res[key].id
							}
						}
						return item
					})
					
					this.$refs.bxList.onRefresh()
				})
				
			}
		},
		watch:{
			"bxcurrType":{
				handler:function(nVal,oVal){
					console.log("bxcurrType",nVal)
					this.listConfig.condition = this.listConfig.condition.map((item,index) =>{
						if(item.colName === "state"){
							item.value = nVal.value
							return item
						}else{
							return item
						}
					})
					this.refreshList()
					
				},
				deep:true
			}
		}
	}
</script>

<style>

</style>
