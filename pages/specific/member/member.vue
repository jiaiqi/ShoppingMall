<template>
	<view class="member">
		<tab-list :currType='currType' :tabData='tabData' @clickTabs='clickTabs' :rowNumber='number'></tab-list>
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
		<view class="cu-modal radio-wrap" :class="modalName=='RadioModal'?'show':''">
			<view class="cu-dialog radio-list" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in vipClassify" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{item.name}}</view>
								<radio class="round radio-item" :class="radio==item.no?'checked':''" :checked="item.no == radio?true:false"
								 :value="item.no"></radio>
							</label>
						</view>
					</view>
				</radio-group>
				<view class="cu-bar bg-white justify-end">
					<view class="action action-bot">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="updateVip">确定</button>				
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tabList from '@/components/bx-tab-list/bx-tab-list.vue'	
	import bxList from '@/components/bx-list/bx-list.vue'
	export default {
		name:'member',
		components:{tabList,bxList},
		data(){
			return {
				currType:{},
				tabData:[],
				listConfig:{
					heightStyle:"calc(100vh - 45px)",
					serviceName:"srvvip_member_select",
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
						footer: 'create_time'
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
				number:0,
				modalName: null,
				radio: '',
				vipClassify:[], //存储修改时的分类数据
				currItem:{}, //选择会员类型的数据
				beforItem:[] //点击按钮时的数据
			}
		},
		onLoad(){
			this.getMemClassify()
			this.getTabNum()
		},
		methods:{			
			clickTabs(e){
				this.findCurrent(e)
				console.log(e)
			},
			
			// 列表相关方法
			listChange(e){
				// console.log(e)
			},
			clickItem(e){
			},
			loadEnd(e){
			},
			clickFootBtn(e){
				this.modalName = 'RadioModal'
				this.radio = e.row.category_no
				this.beforItem = e.row
				// this.currItem = e.row
				console.log('----------',e)
				
			},
			hideModal(){
				this.modalName = null
				
			},
			RadioChange(e) {
				console.log("选中单选",e)
				this.radio = e.detail.value
				this.vipClassify.forEach(item=>{
					if(item.no === e.detail.value){
						this.currItem = item
					}
				})
			},
			/** 修改VIP*/
			async updateVip(){
				let currVip = this.currItem
				let currRadio = this.radio
				console.log(currVip,currRadio)
				if(this.beforItem.category_no !== currRadio){
					let serviceNames = "srvvip_member_category_update"
					let req = [
						{
							data:[{
								"name": this.beforItem.name,
								"category_no": currVip.no,
								"category_name": currVip.name
							}],
							condition:[
								{
									"colName": "user_no",
									"ruleType": "eq",
									"value": this.beforItem.user_no
								}
							],
							serviceName: serviceNames
						}
					]
					let res = await this.onRequest('operate',serviceNames,req,'vip')
					if(res.data.resultCode === "SUCCESS"){
						
						this.getTabNum()
						this.$refs.bxList.onRefresh()
						this.modalName = null
						uni.showToast({
						    title: '修改成功',
						    duration: 1000
						})
					}
				}
			},
			/** 查询会员分类*/
			getMemClassify(){
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
					this.vipClassify = resData
					let tabData = [{						
							label:'全部',
							value:'全部'	,
							count:0						
						}]
					if(resData.length>0){
						if(resData.length > 0 && resData.length <4){
								this.number = resData.length + 1
							}else{
								this.number = 4
							}
						resData.forEach(item=>{
							let tabDataObj = {}
							tabDataObj = {
								label:item.name,
								value:item.no,
								count:0	
							}
							tabData.push(tabDataObj)
						})
						this.tabData = tabData
						this.getTabNum()
					}											
				})
			},
			/** 获取分类数目*/
			getTabNum(){
				let cond = [{
					colName:'shop_no',
					ruleType:'eq',
					value:uni.getStorageSync('shopNo')
				}]
				this.getClassify('srvvip_member_select','category_no',cond,"vip").then(resData=>{
					let tabData = this.tabData
					let allCount = 0
					resData.forEach(res=>{
						 allCount = allCount + res.id
						tabData.forEach(item=>{
							if(item.value === '全部'){
								item.count = allCount
							}else if(res.category_no === item.value){
								item.count = res.id
							}
						})
					})					
				})
			},
			/** 点击tab改变condition*/
			findCurrent(curr){
				let conditions = []
				if(curr.value !== '全部'){
					 conditions = [{
						"colName": "shop_no", //店铺编号
						"ruleType": "eq",
						"value": "1485038452"					
					},{
						"colName": "category_no", //店铺编号
						"ruleType": "eq",
						"value": curr.value
					}]
				}else{
					conditions = [{
						"colName": "shop_no", //店铺编号
						"ruleType": "eq",
						"value": "1485038452"			
					}]
				}
				this.listConfig.condition = conditions
				this.$refs.bxList.onRefresh();
				
			}
		}
		
	}
</script>

<style lang="scss">
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
	.radio-item::before{
		right: 18upx;
	}
	.action-bot{
		display: flex;
		width: 100%;
	}
</style>
