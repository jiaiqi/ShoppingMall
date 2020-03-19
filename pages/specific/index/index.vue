<template>
<view class="">
	<shopmgt ref="shopmgt" v-if="PageCurRun=='shopmgt' && isShopmgt"></shopmgt>
	<shophome ref="shophome" v-if="PageCurRun=='shophome'"></shophome>
	<shoppingCart @updateCarNum="updateCarNum"  ref="shoppingCart" v-if="PageCurRun=='shoppingCart'"></shoppingCart>
	<mine ref="mine" v-if="PageCurRun=='mine'"></mine>
	<!-- tabBar -->
	<view class="cu-bar tabbar bg-white shadow foot">
		<view class="action" v-if="isShopmgt" @click="NavChange" data-cur="shopmgt">
			<view class='cuIcon-cu-image'>
				<image :src="'/static/tabbar/shopmgt' + [PageCurRun === 'shopmgt'?'_cur':''] + '.png'"></image>
				<view class="cu-tag badge">{{mgtNum < 100 ? mgtNum : "99+"}}</view>
			</view>
			<view :class="PageCurRun=='shopmgt'?'text-green':'text-gray'">店铺管理</view>
		</view>
		<view class="action" @click="NavChange" data-cur="shophome">
			<view class='cuIcon-cu-image'> 
				<image :src="'/static/tabbar/shophome' + [PageCurRun ==='shophome'?'_cur':''] + '.png'"></image>
			</view>
			<view :class="PageCurRun=='shophome'?'text-green':'text-gray'">首页</view>
		</view>
		<view class="action"  @click="NavChange" data-cur="shoppingCart">
			<view class='cuIcon-cu-image'>
				<image :src="'/static/tabbar/shoppingcart' + [PageCurRun === 'shoppingCart'?'_cur':''] + '.png'"></image>
				<view class="cu-tag badge">{{shoppingCart < 100 ? shoppingCart : "99+"}}</view>
			</view>
			<view :class="PageCurRun=='shoppingCart'?'text-green':'text-gray'">购物车</view>
		</view>
		<view class="action" @click="NavChange" data-cur="mine">
			<view class='cuIcon-cu-image'>
				<image :src="'/static/tabbar/mine' + [PageCurRun === 'mine'?'_cur':''] + '.png'"></image>
				<view class="cu-tag badge">{{mineNum < 100 ? mineNum : "99+"}}</view>
			</view>
			<view :class="PageCurRun=='mine'?'text-green':'text-gray'">我的</view>
		</view>
	</view>
	
	</view>
</template>

<script>
	import bwSwiper from '@/components/bw-swiper/bw-swiper.vue';
	import cgSwiper from '@/components/cg-swiper/cg-swiper.vue';
	
	import shopmgt from '@/pages/specific/shopmgt/shopmgt.vue';
	import shophome from '@/pages/specific/shophome/shophome.vue';
	import shoppingCart from '@/pages/specific/shoppingCart/shoppingCart.vue';
	import mine from '@/pages/specific/mine/mine.vue';
	
	export default {
		components: {
			shopmgt,
			shophome,
			shoppingCart,
			mine,
			cgSwiper
		},
		data() {
			return {
				PageCur: 'shopmgt',
				isShopmgt:false,
				userRoles:uni.getStorageSync("roles"),
				mineNum:null,
				shoppingCart:null,
				mgtNum:null,
			}
		},
		computed:{
			PageCurRun:{
				set:function(v){
					this.PageCur = v
				},
				get:function(){
					return this.PageCur
				}
			}
		},
		methods: {
			updateCarNum(){
				this.getCarGoodsNum().then((res)=>{
					this.shoppingCart = res
				})
			},
			NavChange: function(e) {
				// console.log(e)
				this.PageCurRun = e.currentTarget.dataset.cur
				// this.PageCur = e.currentTarget.dataset.cur
				
			},
			getmenu() {
				let url = this.getServiceUrl('shop', 'srvshop_goods_category_select', 'select');
				let reqs = {
					"serviceName": "srvshop_goods_category_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "parent_no",
						"ruleType": "isnull"
					}],
					"order": []
				}
				this.$http.post(url, reqs).then(res => {
					// this.swipertitle = (res.data.data)
				})
			},
			
			updateOrderListNum(){
				// let user_no = uni.getStorageSync('login_user_info').user_no
				let cond = [{
					"colName": "order_state",
					"ruleType": "in",
					"value": "待付款,待收货"
				}]
				this.getClassify("srvshop_order_select","state",cond).then((res)=>{
					console.log("getClassify----",res)
					if(res.length > 0){
						this.mineNum = 0
						res.map((item)=>{
							this.mineNum +=  item.id 
						})
					}
					
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
		created(e) {
			let self = this
			uni.showLoading({
				title:"加载中"
			})
			console.log("index created ",e)
			self.getShopInfo().then((res) =>{
				if(res.data.state ==="SUCCESS"){
					let shopInfo = res.data.data[0]
					self.getFilePath(shopInfo.image).then((res)=>{
						// console.log(res)
						return shopInfo._thumbnail = res.map((item,index) =>{
							item._url = self.$api.downloadFilePath + item.fileurl
							item._type = "image"
							return item
						})
					}).then((res) =>{
						self.getFilePath(shopInfo.banners).then((res)=>{
							// console.log(res)
							shopInfo._banners = res.map((item,index) =>{
								item._url = self.$api.downloadFilePath + item.fileurl
								item._type = "image"
								return item
							})
							uni.setStorageSync("shopInfo",shopInfo)
							self.$store.commit("setShopInfo",shopInfo)
						})
					})
					
					
				}
			})
			self.getVipInfo(uni.getStorageSync("login_user_info").user_no).then((res) =>{
				let self = this
				// console.log("res",res)
				if(res.data.state === "SUCCESS" && res.data.data.length >0){
					// console.log("res2",res.data.data[0])
					uni.setStorageSync("vipInfo",res.data.data[0])
					self.$store.commit("setVipInfo",res.data.data[0])
				}
			})
			
			
			// let user_no = uni.getStorageSync('login_user_info').user_no
			// let cond = [{
			// 	"colName": "user_no",
			// 	"ruleType": "eq",
			// 	"value": user_no
			// },{
			// 	"colName": "order_state",
			// 	"ruleType": "in",
			// 	"value": "待付款,待收货"
			// }]
			// this.getClassify("srvshop_order_select","state",cond).then((res)=>{
			// 	console.log("getClassify----",res)
			// 	if(res.length > 0){
			// 		this.mineNum = 0
			// 		res.map((item)=>{
			// 			this.mineNum +=  item.id 
			// 		})
			// 	}
				
			// })
			this.updateOrderListNum()
			// this.getCarGoodsNum().then((res)=>{
			// 	// console.log(res)
			// 	this.shoppingCart = res
			// })
			this.mgtOrderListNum()
			this.updateCarNum()
			uni.hideLoading()
		},
		onShow() {
			console.log("index on show")
			this.updateOrderListNum()
			this.updateCarNum()
			  if(this.PageCurRun=='mine' && this.$refs.mine){
				this.$refs.mine.updateTabNum()
			  }else if(this.PageCur == 'shoppingCart' && this.$refs.shoppingCart){
				  this.$refs.shoppingCart.refresh()
				  
			  }
		},
		onLoad(option) {
			if(option.hasOwnProperty("pageName")){
				this.PageCurRun = option.pageName
				if(this.userRoles.length > 0){
					
					let roles =this.userRoles? this.userRoles.join('-'):''
					if(roles.indexOf("shop_operator") !== -1 ){
						this.isShopmgt = true
					}else{
						this.isShopmgt = false
						this.PageCurRun = "shophome"
						// 如果不是管理员时，默认显示商城首页
					}
				}
			}else{
				if(this.userRoles.length > 0){
					
					let roles =this.userRoles? this.userRoles.join('-'):''
					if(roles.indexOf("shop_operator") !== -1 ){
						this.isShopmgt = true
					}else{
						this.isShopmgt = false
						this.PageCurRun = "shophome"
						// 如果不是管理员时，默认显示商城首页
					}
				}
			}
			console.log("option",option)
			this.getmenu() 
		},
		watch:{
			"PageCurRun":function(nVal,oVal){
				console.log("PageCur",nVal)
				switch (nVal){
					case 'shopmgt':
						uni.setNavigationBarTitle({
							title:  uni.getStorageSync("shopInfo").name ? uni.getStorageSync("shopInfo").name + '店铺管理' : '店铺管理'
						});
						break;
					case 'shophome':
						uni.setNavigationBarTitle({
							title:  uni.getStorageSync("shopInfo").name ? uni.getStorageSync("shopInfo").name + '首页' : '首页'
						});
						break;
					case 'shoppingCart':
						uni.setNavigationBarTitle({
							title: '购物车'
						});
						break;
					case 'mine':
						uni.setNavigationBarTitle({
							title: '我的'
						});
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style>
	.header_content {
		height: 260upx;
		overflow: hidden;
	}

</style>
