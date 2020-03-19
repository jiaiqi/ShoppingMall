<template>
<view class="shophome cu-card">
	<!-- <cu-custom bgColor="bg-gradual-green" :isBack="false">
		<block slot="content">{{shopInfoRun.name}}
			<text class="cuIcon-roundright text-white" @click="toShopInfo"></text>
		</block>
		
	</cu-custom> -->
	<view class="cu-bar bg-gradual-green search">
		<image class="cu-avatar round" onerror="this.src='@/static/noneImg.png'" v-if="shopInfoRun !== null && shopInfoRun._thumbnail && shopInfoRun._thumbnail.length > 0" :src="shopInfoRun._thumbnail[0]._url + '&thumbnailType=fwsu_100'"></image>
		<view class="content">
			{{shopInfoRun.name}}
		</view>
		<view class="action">
			<text class="cuIcon-roundright text-white" @click.stop="toShopInfo"></text>
		</view>
	</view>
	<bxSwiper
	v-if="swiperListRun.length > 0"
		:swiperList="swiperListRun"
		:swiperType="'card'"
		:urlCol="'_url'"
		>
	</bxSwiper> 
	<view class="cu-item shadow-blur margin-xs bg-blue  radius shadow  shadow-lg" style="margin:10upx;border-radius: 10upx;overflow: hidden;">
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
			:moreLink="'/pages/specific/goodsList/goodsList'"
			:rowNum="bxclassConfig.rowNum"
			@on-grid-item="onGridItem"
			>
		</bxClassify> 
	</view>
	<bx-list
	  ref="bxList"
	  :serviceName="listConfig.serviceName"
	  :condition="listConfig.condition"
	  :pageType="listConfig.pageType"
	  :viewTemp="listConfig.viewTemp"
	  :listConfig="listConfig.listConfig"
	  :searchWords="listConfig.searchVal"
	  :searchColumn="'name'"
	  :rownumber="5"
	  :heightStyle="listConfig.heightStyle"
	  :fixed="false"
	  :detailList="listConfig.detailList"
	  @click-list-item="clickItem"
	  @list-change="listChange"
	  @clickFootBtn="clickFootBtn"
	  @loadEnd="loadEnd"
	></bx-list>
	<view class="cu-modal drawer-modal justify-end" :class="showShopInfo?'show':''" @tap="hideModal">
		<view class="cu-dialog basis-lg bg-gradual-green" @tap.stop="" >
			<view class="cu-list menu text-left">
				<view class="cu-card">
					<view class="cu-item shadow">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<image class="cu-avatar round lg" :src="shopInfoRun._thumbnail[0]._url + '&thumbnailType=fwsu_100'"></image>
								<view class="content flex-sub">
									<view>{{shopInfoRun.name}}</view>
									<view class="text-gray text-sm flex justify-between">
										{{shopInfoRun.create_time}}
									</view>
								</view>
							</view>
						</view>
						<view class="text-content line-green padding-xs">
							{{shopInfoRun.describe}}
						</view>
						<view class="cu-list padding-xs">
							<view class="cu-item bg-white">
								<text class="text-bold">地址：</text>{{shopInfoRun.address}}
							</view>
							<view class="cu-item bg-white">
								<text class="text-bold">电话：</text>
								{{shopInfoRun.telephone}}
							</view>
							<view class="cu-item">
								
								<view class="grid flex-sub" :class="'col-1'" v-if="cswechatNo.length > 0">
									<image mode="aspectFit" class="bg-img" :key="index" :src="item._url" v-for="(item,index) in cswechatNo">
									</image>
									
									<view class="cu-tag line-green">
										服务微信
									</view>
								</view>
							</view>
						</view>
					</view>
					
					
					
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import bxSwiper from '@/components/bx-swiper/bx-swiper.vue';
	import bxClassify from '@/components/bx-classify/bx-classify.vue';
	import bxList from '@/components/bx-list/bx-list.vue'
	export default {
		components: {
			bxSwiper,
			bxClassify,
			bxList
		},
		data() {
			return {
				swiperList:[],
				bxclassConfig:{
					"serviceName":"srvshop_goods_select",
					"condition": [],
					"options":{
						"key_disp_col":"name",
						"no_col":"no",
						"parent_no_col":"parent_no",
						"is_tree": true,
						"images":"category_img"
					},
					IsMoreButton:true,
					moreLink:"",
					data:[],
					gridCol:5,  //列数
					rowNum:1,
					errTips:'打不开',
					loadType:'gridData',
				},
				listConfig:{
					heightStyle:"calc(100vh - 300px)",
					serviceName:"srvshop_goods_select",
					condition:[{
							colName: "is_recommend",
							ruleType: "in",
							value: "是",
						},{
							colName: "state",
							ruleType: "in",
							value: "上架",
						},
					],
					detailList:true,
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
				},
				shopInfo:this.$store.getters.getShopInfo,
				showShopInfo:false,
				cswechatNo:[]
			}
		},
		computed:{
			shopInfoRun:{
				get:function(){
					let self = this
					self.shopInfo = this.$store.getters.getShopInfo
					return self.shopInfo
				},
				set:function(v){
					this.shopInfo = v
				}
			},
			swiperListRun:{
				get:function(){
					let self = this
					let shop = self.shopInfoRun
					self.swiperList = shop._banners
					return self.swiperList
				},
				set:function(v){
					this.swiperList = v
				}
			}
		},
		methods: {
			cswechatNoRun: async function(){
				let url = []
				let self = this
				await self.getFilePath(this.shopInfoRun.cswechat_no).then((res)=>{
					// console.log(res)
					this.cswechatNo = res.map((item,index) =>{
						item._url = this.$api.downloadFilePath + item.fileurl
						item._type = "image"
						return item
					})
				})
				
			},
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},
			onGridItem(e){
				// console.log("on Grid Item",e)
				uni.navigateTo({
					url:"/pages/specific/goodsList/goodsList?category=" + JSON.stringify(e) 
				})
			},
			getmenu() {
				// let url = this.getServiceUrl('shop', 'srvshop_goods_category_select', 'select');
				let reqs = {
					"serviceName": "srvshop_goods_category_select",
					"colNames": ["*"],
					"condition": this.bxclassConfig.condition,
					"order": []
				}
				
				this.onRequest("select","srvshop_goods_category_select",reqs).then((res)=>{
					// console.log("srvshop_goods_category_select",res.data.data)
					this.bxclassConfig.data = res.data.data
				})
				// this.$http.post(url, reqs).then(res => {
				// 	console.error(res.data.data)
				// 	this.cuIswiper = (res.data.data)
				// })
			},
			// 列表相关方法
			listChange(e){
				// console.log(e)
			},
			clickItem(e){
				// console.log("clickItem",e)
				let user =uni.getStorageSync('login_user_info')
				let userNo =(user.user_no)
				uni.navigateTo({
					url:"/pages/specific/goodsDetail/goodsDetail?up_user=" + userNo+'&no='+e.no
				})
			},
			loadEnd(e){
				// console.log(e)
			},
			clickFootBtn(e){
				this.onButtonToUrl(e).then(res => {
				  // console.log('footBTN :', res);
				  if (e.button && e.button.button_type === 'delete') {
				    if (res.state === 'SUCCESS') {
				      this.$refs.bxList.onRefresh();
				    }
				  }
				});
				// console.log('clickFootBtn:', e);
				
			},
			getListV2:async function(){
				let self = this
				let colVs = await self.getServiceV2(self.listConfig.serviceName, 'list', 'list');
				colVs.srv_cols = colVs.srv_cols.filter(item => item.in_list === 1);
				// console.log('shop home colVs', colVs);
				self.listConfig.listConfig = colVs;
			},
			toShopInfo(){
				console.log("显示商家信息")
				this.showShopInfo = true
			},
			hideModal(){
				this.showShopInfo = false
			}
		},
		onShow(){
			// console.log('onShow shop home');
			// this.getListV2()
			// this.getmenu()
		},
		created() {
			
			this.getListV2()
			this.getmenu()
			this.cswechatNoRun()
		},
		onLoad() {
			// console.log('onLoad shop home');
			this.getmenu()
		},
		watch:{
			"shopInfoRun":{
				hanlder:function(nVal,oVal){
					console.log("shopInfoRun",nVal)
					this.cswechatNoRun()
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.cu-dialog{
		position: relative;
		    display: inline-block;
		    vertical-align: middle;
		    margin-left: auto;
		    margin-right: auto;
		    width: 340px;
		    max-width: 100%;
		    background-color: #f8f8f8;
		    border-radius: 5px;
		    overflow: hidden;
	}
</style>
