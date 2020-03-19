<template>
	<view style="shop-car-wrap ">
		<view class="car_wrap">			
			<s-pull-scroll
			ref="pullScroll" 
			:pullDown="pullDown" 
			:pullUp="loadData"
			:top="'-100'"
			:bottom="'170'"
			:fixed="false"
			:heightStyle="heightStyle"
			finishText="我是有底线的...">
			<view v-if="shopInfo.length>0" class="shop-car">							
				<view v-for="(item,index) in shopInfo" class="list-item-wrap   bg-white">
					<view @tap="checks(item)" class="list-item-check">
						<image v-show="!item.check" src="../../../static/notpitch_on.png" mode=""></image>
						<image v-show="item.check" src="../../../static/pitch_on.png" mode=""></image>
					</view>
					<view @tap="toGoodsDetail(item)" class="list-item">
						<imgLazy class="main-image" v-if="item.img" :item="item" :imgColName="'img'"></imgLazy>
						<!-- <image :src="item.img" mode="" class="main-image"></image> -->
						<view class="content-box">
							<view class="title" :class="item.state==='无效'?'lose':''">{{item.goods_name}}</view>
							<!-- <view class="title-tip">商品规格</view> -->
							<view class="content">
								<view class="numbers">
									<text class="unit">￥</text>
									{{item.current_price}}
								</view>
								<view v-if="item.state ==='有效'" class="tags">
									<view @tap.stop="changeCount(item,'sub')" class="subtract">
										-
									</view>
									<view class="count">
										{{item.num}}
									</view>
									<view @tap.stop="changeCount(item,'add')" class="add">
										+
									</view>
								</view>
								<view v-else class="lose_hint">
									<text class="lost_alone">已失效</text>
									<text @tap="clear(item)" data-target="DialogModal1" class="foot-button">
										请删除
									</text>
								</view>
							</view>
							<!-- <view class="footer">
								<view class="foot-name">
								</view>
								<view @tap="clear(item)" data-target="DialogModal1" class="foot-button">
									移除
								</view>
							</view> -->
						</view>
					</view>
				</view>		
			</view>
			</s-pull-scroll>
			</view>
			<view v-if="shopInfo.length ===0" class="no_data">
				购物车暂无商品
			</view>
			<view class="payment">
				<view @tap="checkalls" class="checks">
					<image v-if="!checkAll" src="../../../static/notpitch_on.png" mode=""></image>
					<image v-else src="../../../static/pitch_on.png" mode=""></image>
					<text>全选</text>
				</view>
				<view class="payment_left">
					<view>
						实付款
					</view>
					<view class="price">
						<!-- ￥{{allMoney<1?allMoney:allMoney.toFixed(2)}} -->
						￥{{allMoney.toFixed(2)}}
					</view>
				</view>
				<view class="bot_rig">
					<view @tap="clearAll" class="del">
						清除所选
					</view>
					<view @tap="toOrder" class="payment_right" :class="checkGoods.length>0?'':'no-check'">
						结算({{checkNum}})
					</view>
				</view>				
			</view>
	</view>
</template>

<script>
	import sPullScroll from '@/components/s-pull-scroll';
	import imgLazy from "@/components/bx-lazy-img/bx-lazy-img.vue"
  // import meSelect from '@/pages/specific/shoppingCart/me-select.vue'
	export default {
		components:{sPullScroll,imgLazy},
    name:'shoppingCart',
		data() {
			return {
				shopInfo:[
				],
				pageInfo: {
					total: 0,
					rownumber: 10,
					pageNo: 1
				},
				checkAll:false,
				checkNum:0, //选择的数量
				allMoney:0,//总价
				checkGoods:[], //存放选中的商品
				heightStyle:"100vh",
				
			};
		},
		props:{
			top: {
			  type: [Number, Array, String],
			  default () {
			    return 0;
			  }
			},
			// 距底部(rpx)
			bottom: {
			  type: [Number, Array, String],
			  default () {
			    return 0;
			  }
			},
			
			// 是否通过fixed固定高度, 默认true
			fixed: {
			  type: Boolean,
			  default: true
			},
		},
		/**
		 * 未完成：
		 * 删除
		 * 批量删除
		 * 修改接口
		 * 查询接口
		 * 
		 * */
    methods:{
		refresh () {
		      this.$nextTick(() => {
		        this.$refs.pullScroll.refresh();
		      });
		    },
		pullDown(pullScroll) {			
			let page = this.pageInfo;
			this.pageInfo.pageNo = 1;
			setTimeout(() => {
				this.getGoodsCarData().then(res => {
				});
			}, 200);
		},
		loadData(pullScroll) {
			// let page = this.pageInfo;
			this.pageInfo.pageNo = this.pageInfo.pageNo + 1;
			
			let page = this.pageInfo;
			// this.pageInfo.pageNo = pullScroll.page + 1;
			console.log(pullScroll);
				this.getGoodsCarData().then(res => {
				}); 
		},
		checks(e){
			e.check = !e.check
			let copyShopInfo = this.shopInfo
			let isCheckAll = true
			let checkGoods = this.checkGoods
			copyShopInfo.forEach(i=>{
				if(!i.check){
					isCheckAll = false
				}				
			})
			this.checkAll = isCheckAll
			if(e.check){
				checkGoods.push(e)
				this.calculate(e.current_price,e.num,'add','check')
			}else{
				this.calculate(e.current_price,e.num,'sub','check')
				checkGoods.forEach((has,dex)=>{
					if(has.car_no === e.car_no){
						checkGoods.splice(dex,1)
					}
				})
			}
			this.checkNum = checkGoods.length
		},			
		checkalls(){
			if(this.shopInfo.length>0){
				let copyShopInfo = this.shopInfo
				this.checkAll = !this.checkAll
				if(this.checkAll){
					copyShopInfo.forEach(only=>{
						only.check = true
						this.calculate(only.current_price,only.num,'add','check')
						this.checkGoods.push(only)
					})				
					this.checkNum = copyShopInfo.length
				}else{
					copyShopInfo.forEach(only=>{
						only.check = false						
						// this.calculate(only.current_price,only.num,'sub','check')
					})
					this.allMoney = 0
					this.checkGoods = []
					this.checkNum = 0
				}	
			}
					
		},
		/** 计算价格*/
		calculate(price,num,sign,type){
			if(sign === 'sub'){
				if(type === 'check'){
					this.allMoney = this.allMoney - price * num
				}else{
					this.allMoney = this.allMoney - price
				}
			}else if(sign === 'add'){
				
				if(type === 'check'){
					this.allMoney = this.allMoney + price * num
				}else{
					this.allMoney = this.allMoney + price
				}
			}
		},
		
		/** 更改数量*/
		changeCount(shop,type){
			let nums = 0
			uni.showLoading({
				title: '加载中',
				mask:true
			})
			if(type === 'add'){
				nums = shop.num + 1				
				this.updateShopCount(shop,nums).then(reqs=>{
					if(reqs.data.resultCode === 'SUCCESS'){
						shop.num = shop.num + 1
						uni.hideLoading();
					}
				})
			}else if(type === 'sub'){
				if(shop.num !== 1){
					nums = shop.num - 1
					this.updateShopCount(shop,nums).then(reqs=>{
						if(reqs.data.resultCode === 'SUCCESS'){
							shop.num = shop.num - 1
							uni.hideLoading();
						}
					})
				}				
			}
			
			if(shop.check && shop.num !== 0){
				this.calculate(shop.current_price,shop.num,type,'change')
			}
		},
		/** 跳转详情*/
		toGoodsDetail(goods){
			if(goods.state !== '无效'){
				uni.navigateTo({
					url:`/pages/specific/goodsDetail/goodsDetail?no=${goods.goods_no}`
				})
			}			
		},
		async getGoodsCarData(type){
			uni.showLoading({
				mask: true
			});
			this.allMoney=0
			this.checkAll=false
			this.checkNum = 0
			this.checkGoods = []
			let that = this
			let serviceName = 'srvshop_car_goods_select'
			let imgUrl = null
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [],
				page: this.pageInfo,
				order:[{
					colName: "create_time",
					orderType: "asc"
				}]
			}
			let res = await this.onRequest('select',serviceName,req,'shop')
			uni.hideLoading();
			let page = this.pageInfo;
			let resData = res.data.data
			if (res.data.state === 'SUCCESS') {
				if (this.pageInfo.pageNo === 1) {
					this.shopInfo = [];
				}
				console.log("-------------",res)
				this.pageInfo.total = res.data.page.total;
				if(type !== 'del'){
					this.pageInfo.pageNo = res.data.page.pageNo;
				}
				console.log("---res----------",this.pageInfo)
				if (page.rownumber * page.pageNo >= page.total) {
					// finish(boolean:是否显示finishText,默认显示)
					// if(resData.length > 0){
						// this.$refs.pullScroll.success();
					// }else{
						that.$refs.pullScroll.finish();
					// }
					// this.$refs.pullScroll.finish();
				} else {
					that.$refs.pullScroll.success();
				}
				if(resData){
					resData.forEach(i=>{
						
						that.getFilePath(i.img).then(a=>{
							let urls = that.$api.getFilePath + a[0].fileurl + "&thumbnailType=" + that.$api.imgThumbnailType
							i.img = urls
						})
						i['check'] = false
					})
				}
				console.log(resData)
				if(type === 'del'){					
					this.shopInfo = resData
					console.log(this.shopInfo)
				}else{
					this.shopInfo = this.shopInfo.concat(resData);
				}
				
				// this.shopInfo = resData			
			}
			
		},
		/**获取商品图片*/
		async getPhoto(file_no){	
			let serviceName = 'srvfile_attachment_select'
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
			}
			let resImg = await this.onRequest('select',serviceName,req,'file')
			return this.$api.srvHost +
          "/file/download?filePath=" +
          resImg.data.data[0].fileurl
		},
		/** 单个删除*/
		async clear(curr){		
			let that = this
			uni.showModal({
				title: '提示',
				content: '确定删除吗？',
				success: function (res) {
					if (res.confirm) {
						
						let serviceName = 'srvshop_car_delete'
							const req = [{
								serviceName: serviceName,
								colNames: ['*'],
								condition: [{ colName: 'car_no', value: curr.car_no, ruleType: 'in' }]
							}]
							that.onRequest('operate',serviceName,req,'shop').then(a=>{
								if(a.data.resultCode === 'SUCCESS'){
									that.pageInfo.pageNo = 1
									that.refresh()		
									that.$emit('updateCarNum')
								}
							})								
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		/** 批量删除*/
	 async clearAll(){
		 if(this.shopInfo.length > 0){
			 let that = this
			if(this.checkGoods){
				uni.showModal({
					title: '提示',
					content: '确定删除所选商品吗？',
					success: function (res) {
						if (res.confirm) {
							let delCondData = []
						that.checkGoods.forEach(del=>{
							delCondData.push(del.car_no)
							})
							let condStr = delCondData.toString()
							if(condStr){
								let serviceName = 'srvshop_car_delete'
									const req = [{
										serviceName: serviceName,
										colNames: ['*'],
										condition: [{ colName: 'car_no', value: condStr, ruleType: 'in' }]
									}]
									that.onRequest('operate',serviceName,req,'shop').then(dels=>{
										if(dels.data.resultCode === 'SUCCESS'){
											that.pageInfo.pageNo = 1
											// that.getGoodsCarData('del')
											that.refresh()											
											that.$emit('updateCarNum')
										}
									})
							}		
																
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		 }
		 
		},
		
		/** 修改商品数量*/
		async updateShopCount(curr,nums){
			let serviceName = 'srvshop_car_update'
				const req = [{
					serviceName: serviceName,
					colNames: ['*'],	
					condition: [{ colName: 'car_no', value: curr.car_no, ruleType: 'in' }],
					data:[{
						num:nums
					}]
				}]
				let res = await this.onRequest('operate',serviceName,req,'shop')		
				return res
		},
		toOrder(){
			if(this.checkGoods.length>0){
				let endStrData = []
				let endData = this.checkGoods
				let notHasLose = true
				endData.forEach(i=>{					
					endStrData.push(i.car_no)
					if(i.state === '无效'){
						notHasLose = false
					}
				})
				let endStr = endStrData.toString()
				if(notHasLose){
					uni.navigateTo({
					    url: `../placeOrders/placeOrders?car_no=${endStr}&fromPath=cart`
					});
				}else{
					uni.showToast({
					    title: '含有无效商品',
					    duration: 2000
					});
				}
				
			}			
		}
	},
	watch:{
		checkAll: {
			handler(newVal) {
				console.log(newVal)
			}
		},
	},
	mounted(){
		this.$nextTick(()=>{
			this.getGoodsCarData()
		})
	},
	onShow(){
		console.log("shopCar --------- on show")
		// this.refresh()				
	}
}
</script>

<style lang="scss" scoped>
	.shop-car-wrap{
		min-height: 100vh;
	}
		.no_data{
			min-height: calc(100vh - 100px);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
		}
	.shop-car{
		// margin-bottom: 90upx;
		.list-item-wrap {
			width: 100%;
			margin: 2rpx 0;
				display: flex;
				align-items: center;
				.list-item-check{
					margin-left: 30upx;
					image{
						width: 36upx;
						height: 36upx;
					}
				}
			.list-item {
				width: calc(100% - 40upx);
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10upx;
				box-sizing: border-box;
				.main-image {
					width: 130upx;
					height: 130upx;
					border-radius: 5upx;
					margin-right: 20upx;
				}
				.content-box {
					transition: all 1s ease-out;
					box-sizing: border-box;
					max-width: calc(100% - 20upx);
					flex: 1;
					// padding-right: 10px;
					color: #999;
					.title {
						line-height: 40upx;
						color: #333;
						font-size: 24upx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						margin-top: 0upx;
					}
					.lose{
						color: #8f8f8f;
					}
					.title-tip {
						font-size: 24upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.content {
							display: flex;
							justify-content: space-between;
							align-items: center;
						.numbers {
							color: #e93b3d;
							line-height: 40upx;
							margin-top: 20upx;
							font-size: 36upx;
						}
							.tags{
								display: flex;
								margin-top: 20upx;
								    width: 80px;
								    border: 1px solid;
								    display: flex;
								    justify-content: space-between;
								    border-radius: 5px;
								    margin-right: 10px;
								.subtract{
									    width: 20px;
									    text-align: center;
									    border-right: 1px solid #999999;
									    line-height: 15px
								}
								.add{
									    width: 20px;
									    text-align: center;
									    border-left: 1px solid #999999;
								}
							}
							.lose_hint{
								display: flex;
								margin-top: 20upx;
								border: 1px solid;
								color: white;
								display: flex;
								justify-content: space-between;
								border-radius: 5px;
								margin-right: 10px;
								padding: 0 8upx;
								.lost_alone{
									background-color: #dad8d8;
									margin-right: 20upx;
									padding: 0 8upx;
									border-radius:10upx;
								}
								.foot-button {
									    color: #8f8f8f;
								}
							}
						.unit {
							font-size: 30upx;
						}
					}
					.footer {
						display: flex;
						justify-content: space-between;
						height: 80upx;
						align-items: center;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						.foot-name {
							position: relative;
							display: inline-block;
							padding-right: 28upx;
							line-height: 44upx;
								display: flex;
							// &::after {
							// 	content: '';
							// 	display: block;
							// 	width: 8px;
							// 	height: 8px;
							// 	border-top: 1px solid #999;
							// 	border-left: 1px solid #999;
							// 	transform-origin: 50%;
							// 	transform: rotate(135deg);
							// 	position: absolute;
							// 	width: 6px;
							// 	height: 6px;
							// 	right: 5px;
							// 	top: 50%;
							// 	margin-top: -3px;
							// }
						}
						
					}
				}
			}
		}
	}
	 
	 .payment{
	 	width: 100%;
	 	background-color: white;
	 	display: flex;
	 	height: 100upx;
	 	justify-content: space-between;
	 	align-items: center;
	 	position: fixed;
	 	bottom: 100upx;
		border-top: 1px solid #e0e0e0;
		z-index: 5;
		.checks{
			    display: flex;
			    align-items: center;
			    margin-left: 10px;
			image{
				width: 36upx;
				height: 36upx;
				margin-right: 6upx;
			}
		}
	 	.payment_left{
	 		display: flex;		
	 		font-size: 28upx;
	 		.price{
	 			color: red;
	 			font-weight: 700;
	 			margin-left:10upx ;
	 		}
	 	}
		.bot_rig{
			display: flex;
			align-items: center;
			.del{
				margin-right: 60upx;
			}
			.payment_right{
				background-color: #f2270c;
				margin-right: 50upx;
				height: 60upx;
				display: flex;
				align-items: center;
				padding: 10upx 15upx;
				color: white;
				border-radius: 30upx;
				box-shadow: 0 6px 12px 0 rgba(255,65,66,.2);
				background-image: linear-gradient(135deg,#f2270c,#f2270c 70%,#f24d0c);
			}
			.no-check{
				background-color: #8799a3; 
				box-shadow: none;
				background-image: none;
			}
			
		}
	 	
	 }
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
