<template>
	<view class="vip-classify-wrap">
		<bx-list
		  ref="bxList"
		  :serviceName="listConfig.serviceName"
		  :condition="listConfig.condition"
		  :pageType="listConfig.pageType"
		  :viewTemp="listConfig.viewTemp"
		  :listConfig="listConfig.listConfig"
		  :searchWords="listConfig.searchVal"
		  :rowButtons="listConfig.rowButtons"
		  :searchColumn="''"
		  :srvApp="listConfig.srvApp"
		  :rownumber="10"
		  :heightStyle="listConfig.heightStyle"
		  :fixed="false"
		  @click-list-item="clickItem"
		  @list-change="listChange"
		  @clickFootBtn="clickFootBtn"
		  @loadEnd="loadEnd"
		></bx-list>
		<view class="cu-bar tabbar bg-white shadow foot padding-xl flex justify-center">
			<button class="cu-btn bg-blue margin-right-xs lg" @click="toAddVip"><text class="cuIcon-add"></text>新增会员分类</button>
		</view>
		<view class="cu-modal bottom-modal up-wrap" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog ">
				<view class="cu-bar bg-white">
					<view class="action text-green" @tap="shipments">确定</view>
					<view class="action text-blue" @tap="hideModal">取消</view>
				</view>
				<view class="padding-xl">
					<bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="main_fields"></bxform>
					<bxform ref="child_bxForm" :pageType="type" :BxformType="type" :fields="child_fields"></bxform>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import bxform from '@/components/bx-form/bx-form.vue';
	export default {
		name:'vipClassify',
		components:{
			bxform
		},
		data(){
			return {
				tabData:[],
				modalName: null,
				listConfig:{
					heightStyle:"calc(100vh - 45px)",
					serviceName:"srvvip_category_benefits_select",
					condition:[{
						"colName": "shop_no", 
						"ruleType": "eq",
						"value": uni.getStorageSync("shopNo")
					}
					],
					srvApp:'vip',
					detailList:true,
					pageType:"list",
					viewTemp:{
						title: 'name',
						tip: 'desc',
						img: 'img',
						price: 'current_price',
						footer: 'state'
					},
					listConfig:null,
					searchVal: '',
					rowButtons:[{
							button_name:"修改",
							button_type:"_dev",
							application:"vip",
							is_public:false,
							permission:true,
							button_params:[],
							isShow:[
								// {
								// 	colName:"category_no",
								// 	"ruleType": "eq",
								// 	"value": "common_member"
								// }
							]
						}]
				},
				defaultVal:{					
				},
				child_defaultVal:{},	
				main_fields: [],
				child_fields:[],
				type: 'update',
				main_serviceName:'srvvip_category_update',
				main_type:'update',
				child_serviceName:'srvvip_benefits_update',
			}
		},
		methods:{
			// 列表相关方法
			listChange(e){
				// console.log(e)
			},
			clickItem(e){
				let items = encodeURIComponent(JSON.stringify(e))
				console.log("------------",items)
				uni.navigateTo({
					url:"/pages/specific/vipClassify/vipDetail?params=" +  items
				})
			},
			loadEnd(e){
			},
			getCol(type,e){
				let main_option = {}
				let child_option = {}
				if(type === 'update'){
					 main_option = {
							"type": type,
							"condition": [
								{
									"colName": "no",
									"ruleType": "eq",
									"value":e.row.no
								}
							],
							"serviceName": this.main_serviceName,			
					}
					 child_option = {
							"type": type,
							"condition": [
								{
									"colName": "category_no",
									"ruleType": "eq",
									"value":e.row.no
								}
							],
							"serviceName": this.child_serviceName,				
					}
				}else if(type === 'add'){
					main_option = {
							"type": type,
							"serviceName": this.main_serviceName,			
					}
					 child_option = {
							"type": type,
							"serviceName": this.child_serviceName,				
					}
				}
				
				if (main_option.hasOwnProperty('loadedType')) {
				  this.loadedType = option.loadedType;
				} else if (main_option.hasOwnProperty('params')) {
				  this.serviceName = this.params.serviceName;
				  this.type = this.params.type;
				  this.condition = this.params.condition;
				  this.defaultVal = this.params.defaultVal;
				  this.getFieldsV2();
				} else if (main_option.serviceName && main_option.type) {
				  this.main_serviceName = main_option.serviceName;
				  this.child_serviceName = child_option.serviceName;
				  this.type = main_option.type;
				  this.getFieldsV2();
				} else {
				  uni.showToast({
				    title: '加载错误'
				  });
				}
			},
			clickFootBtn(e){
				console.log(e)
				this.modalName = 'bottomModal'
				this.defaultVal = e.row
				this.getUpdateChildData(e.row.no).then(childres=>{
					this.child_defaultVal = childres.data.data[0]
					this.main_serviceName = 'srvvip_category_update'
					this.child_serviceName = 'srvvip_benefits_update'
					this.getCol('update',e)
				})
				
				
			},
			
			/** 获取修改子表默认数据*/
			async getUpdateChildData(e){
				let req = {
					"serviceName": "srvvip_benefits_select",
					"colNames": [
						"*"
					],
					"condition": [
						{
							"colName": "category_no",
							"ruleType": "eq",
							"value": e
						}
					],
					"page": {
						"pageNo": 1,
						"rownumber": 5
					},
					"order": []
				}
				let res = await this.onRequest("select","srvvip_benefits_select",req,'vip')
				return res
				
				// this.onRequest("select","srvvip_category_benefits_select",req,'vip').then((res)=>{
				// 	let resData = res.data.data
				// 	if(resData.length>0){
				// 		this.tabData = resData
				// 		console.log('=====',resData)
				// 	}											
				// })
			},
			/** 添加分类*/
			toAddVip(){
				this.type = 'add'
				this.modalName = 'bottomModal'
				this.main_serviceName = 'srvvip_category_add',
				this.child_serviceName = 'srvvip_benefits_add',
				this.defaultVal =  {
					"shop_no": uni.getStorageSync("shopNo"),
				}
				this.child_defaultVal = {'shop_no':uni.getStorageSync("shopNo")}
				this.getCol('add')
			},
			getFieldsV2: async function() {
				let self = this
			  let main_colVs = await this.getServiceV2(this.main_serviceName, this.type, this.type,'vip');
			  let child_colVs = await this.getServiceV2(this.child_serviceName, this.type, this.type,'vip');
			  // this.colsV2Data = main_colVs;
			  switch (this.type) {
			    case 'update':
					// 处理是否url是否传默认值
					if(this.isInvalid(this.defaultVal)){
						console.log("isInvalid")
						self.main_fields = self.setFieldsDefaultVal(main_colVs._fieldInfo, this.defaultVal);
						self.child_fields = self.setFieldsDefaultVal(child_colVs._fieldInfo, this.child_defaultVal);
					}else{
						console.log("no isInvalid")
						let reqs = {
							"colNames": ["*"],
							"condition": this.condition,
							"serviceName": self.colsV2Data.select_service_name,
						}
						let values  = null
						  self.onRequest("select", self.colsV2Data.select_service_name, reqs, "shop").then((res) =>{
							  if(res.data.state === "SUCCESS" && res.data.data.length > 0){
								  values = res.data.data[0]
								  console.log("onRequest")
								  self.fields = self.setFieldsDefaultVal(colVs._fieldInfo, values);
								 
							  }
						  })
					}
			      break;
			    case 'add':
					if(this.isInvalid(this.defaultVal)){
						console.log("isInvalid")
						// self.fields = self.setFieldsDefaultVal(main_colVs._fieldInfo, this.defaultVal);
						self.main_fields = self.setFieldsDefaultVal(main_colVs._fieldInfo, this.defaultVal);
						self.child_fields = self.setFieldsDefaultVal(child_colVs._fieldInfo, this.child_defaultVal);
					}else{
						self.main_fields = main_colVs._fieldInfo;
						self.child_fields = main_colVs._fieldInfo;
					}
			      
			      break;
			    case 'detail':
			      this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.params.defaultVal);
			      break;
			    default:
			      break;
			  }
			  uni.hideLoading()
			},
			getVipInfo(){
				let req = {
					"serviceName": "srvvip_category_benefits_select",
					"colNames": [
						"*"
					],
					"condition": [
						{
							"colName": "shop_no",
							"ruleType": "eq",
							"value": uni.getStorageSync("shopNo")
						}
					],
					"order": []
				}
				this.onRequest("select","srvvip_category_benefits_select",req,'vip').then((res)=>{
					let resData = res.data.data
					if(resData.length>0){
						this.tabData = resData
						console.log('=====',resData)
					}											
				})
			},
			hideModal(e) {
				this.modalName = null
			},
			shipments(){
				let req = this.$refs.bxForm.getFieldModel();
				let child_req = this.$refs.child_bxForm.getFieldModel();
				console.log(req,child_req)
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask:true
				// })
				let defVal = this.defaultVal
				// let serviceName = this.main_serviceName
				let datas = [{
					"name": req.name,
					"level": req.level,
					"shop_no": req.shop_no,
					"shop_name":req.shop_name,
					child_data_list:[]
				}]
				let childData = []
				childData.push(child_req)
				const reqs = {
					serviceName: this.child_serviceName,
					condition: [{
				                "colName": "category_no",
				                "ruleType": "eq",
				                "value": defVal.no
				            }],
					data:childData
				}
				
				datas[0].child_data_list.push(reqs)
				let main_reqs = [{
					serviceName: this.main_serviceName,
					condition: [{
					            "colName": "no",
					            "ruleType": "eq",
					            "value": defVal.no
					        }],
					data:datas
				}]
				if(this.type === 'add'){
					reqs.depend_keys = [
						{
							"type": "column",
							"depend_key": "no",
							"add_col": "category_no"
						}
					]
					datas[0].child_data_list[0].condition = []
					main_reqs[0].condition = []
				}
				console.log('main_reqsmain_reqs==========>',main_reqs)
				let srv = 'update'
				if(this.type === 'add'){
					srv = 'add'
				}
				// this.onRequest(srv,this.main_serviceName,main_reqs,'vip').then(res=>{
				// 	console.log('-----------',res)
				// 	// if(res.data.resultCode === 'SUCCESS'){
				// 		// uni.hideLoading();
				// 		this.modalName = null
				// 		this.$refs.bxList.onRefresh()
				// 	// }
				// })
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask:true
				// })
				// let req = this.$refs.bxForm.getFieldModel();
				// let defVal = this.defaultVal
				// for (let key in defVal) {
				//   defVal[key] = req[key]
				// }				
				// let datas = []
				// datas.push(defVal)
				// let serviceName = 'srvshop_order_ship'
				// const reqs = [{
				// 	serviceName: serviceName,
				// 	colNames: ['*'],	
				// 	condition: [],
				// 	data:datas
				// }]
				// this.onRequest('operate',serviceName,reqs,'shop').then(res=>{
				// 	console.log('-----------',res)
				// 	if(res.data.resultCode === 'SUCCESS'){
				// 		uni.hideLoading();
						// this.modalName = null
				// 		this.updateTabNum()
				// 		this.$refs.dbList.onRefresh()
				// 	}
				// })								
			}
			
		},
		created(){
			this.getVipInfo()
		}
	}
</script>

<style lang="scss">
	.vip-classify-wrap{
		height: 100vh;
		display: flex;
		width: 100%;
		.vip-classify{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			width: 4rem;
			background: white;
			height: 100%;
			.classify-item{
				width: 100%;
				height: 100%;
				display: flex;
				
				align-items: center;
				justify-content: center;
				padding: 10px 0;
				
			}
		}
		.vip-info{
			.vip-leave{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-top: 1rem;
				.vip-leave-top{
					color: red;
					font-size: 80upx;
				}
			}
			.six {
			   padding: 10px;
			   display: flex;
			   flex-wrap: wrap;
			   .jiu_01 {
			      width: 33%;
			      text-align: center;
			      padding: 15px 10px 15px;
			      box-sizing: border-box;
			      font-size: 12px;
			     }
			  }
		}
	}
	.up-wrap{
		height: 100%		;
		overflow: hidden!important;
		.cu-dialog{
			.padding-xl{
				overflow-y: scroll;
				height: calc(100% - 100upx);
			}
		}
	}
	
</style>
