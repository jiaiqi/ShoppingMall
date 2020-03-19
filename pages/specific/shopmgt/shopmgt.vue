<template>
	<view class="">
		<view class="cu-card case" :class="'no-card'">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<image v-if="shopInfo !== null && shopInfo._thumbnail && shopInfo._thumbnail.length > 0" class="cu-avatar round lg" :src="shopInfo._thumbnail[0]._url + '&thumbnailType=fwsu_100'"></image>
						<view v-if="shopInfo !== null" class="content flex-sub">
							<view class="text-green text-xl text-bold cf">
							{{shopInfo.name ? shopInfo.name : "--"}}
								<view class="fr cu-tag" :class="shopInfo.state ? (shopInfo.state === '启用' ? 'bg-green' : 'bg-gray') :' bg-gray'">{{shopInfo.state ? shopInfo.state === "启用" ? "营业中" : "停业" : "--"}} </view>
							
							</view>
							<view class="text-gray text-sm flex justify-between">
								开店时间：{{shopInfo.create_time ? shopInfo.create_time : "--"}}
								<!-- <view class="text-gray text-sm">
									<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
									<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
									<text class="cuIcon-messagefill margin-lr-xs"></text> 30
								</view> -->
								<view  class="action">
									<view  class="cu-tag round bg-blue light" @click="toShare">分享店铺</view>
									<view  class="cu-tag round bg-blue light" @click="toUpdateShopInfo">店铺设置</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				
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
		components: {bxClassify},
		data() {
			return {
				bxclassConfig:{
					"serviceName":"srvsys_user_menu_select",
					"condition": [],
					"options":{
						"key_disp_col":"menu_name",
						"no_col":"menu_no",
						"parent_no_col":"parent_no",
						"is_tree": true,
						"images":"app_icon"
					},
					IsMoreButton:true,
					moreLink:"",
					data:[],
					gridCol:4,  //列数
					rowNum:2,
					errTips:'打不开',
					loadType:'gridData',
				},
				menuData:[]
			}
		},
		computed:{
			shopInfo:function(){
				let self = this
				return  self.$store.getters.getShopInfo
			}
		},
		methods: {
			NavChange: function(e) {
				console.log(e)
				this.PageCur = e.currentTarget.dataset.cur
			},
			getUsermenu() {
				let self = this
				let reqs = {
					"serviceName": "srvsys_user_menu_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "client_type",
						"ruleType": "like",
						"value":"APP"
					}],
					"order": [{
						colName: "seq",
						orderType: "asc"
					}]
				}
				this.onRequest("select","srvsys_user_menu_select",reqs,"shop").then((res)=>{
					// this.menuData = (res.data.data)
					this.bxclassConfig.data =  (res.data.data)
					this.bxclassConfig.data = this.bxclassConfig.data.filter((item,index) =>{
						if(item.is_leaf === "是") { return item}
					})
					self.onRequest("select","srvsys_user_menu_select",reqs,"vip").then((requests)=>{
						let menus = requests.data.data
						
						menus = menus.filter((items,index) =>{
							if(items.is_leaf === "是") { 
								self.bxclassConfig.data.push(items)
								return items
							}
						})
						// self.bxclassConfig.data = self.bxclassConfig.data.concat(menus)
					})
				})
			},
			onGridItem(e){
				switch (e.service_name){
					case 'srvshop_goods_category_select':
						uni.navigateTo({
							url:"/pages/specific/classify/classify?serviceName=" + e.service_name
						})
						
						break;
					case 'srvshop_order_select':
						uni.navigateTo({
							url:"/pages/specific/backOrderList/backOrderList"
						})
						
						break;
					case 'srvshop_goods_select':
					let tabData = [{
							count:0,
							label:"上架",
							value:"上架"
						},
						{
							count:0,
							label:"下架",
							value:"下架"
						}]
						uni.navigateTo({
							url:"/pages/specific/goodsmgt/goodsmgt?serviceName=" + e.service_name + "&tabData=" + JSON.stringify(tabData)
						})
						break;
					case 'srvvip_member_select':
						uni.navigateTo({
							url:"/pages/specific/member/member?serviceName=" + e.service_name
						})
						break;	
					case 'srvvip_category_select':
						uni.navigateTo({
							url:"/pages/specific/vipClassify/vipClassify?serviceName=" + e.service_name
						})
						break;
					default:
						break;
				}
			},
			toUpdateShopInfo(){
				let params = {
					"type": "update",
					"condition": [
						{
							"colName": "no",
							"ruleType": "in",
							"value": uni.getStorageSync("shopNo")
						}
					],
					"serviceName": "srvshop_reg_update",
					"defaultVal": null
				}
				uni.navigateTo({
					url:"/pages/public/formPage/formPage?params=" +  JSON.stringify(params) 
				})
			},
			toShare(){
				let data = {
				     name: "",
				     price: "",
				     photo: this.shopInfo._thumbnail[0]._url,
				     codeurl: window.location.origin  + this.$api.homePath + "?up_user=_shopmall",
				     type:'shopmall',
				     // no:item.no
				}
				uni.navigateTo({
					url:"/pages/specific/sharephoto/sharehtml?data=" + JSON.stringify(data)
				})
			}
		},
		onLoad() {
			this.getUsermenu()
			console.log(self.$store.getters.getShopInfo())
		},
		async created() {
			this.getUsermenu()
		}
	}
</script>

<style>
	.header_content {
		height: 260upx;
		overflow: hidden;
	}

</style>
