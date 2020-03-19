<template>
	<view class="wrapGoods">
		<!-- <cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品详情</block>
		</cu-custom> -->
		<!-- <view class="cu-bar bg-blue">
			<view class="action">
				<text class="cuIcon-close"></text> 关闭
			</view>
			<view class="content text-bold">
				海蓝 
			</view>
		</view> -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in swiperList" :key="swiper.id">
					<image :src="swiper.img"></image>
				</swiper-item>
			</swiper>
			<view class="indicator">{{currentSwiper+1}}/{{swiperList.length}}</view>
		</view>
		<view class="boxxy" v-if="discount&&srvGoodsData.current_price">
			<view class="viptitle" :style="{'background-image':'url('+backImg+')'}">
				<!-- #e4393c -->
				<text class="cuIcon-vip lg"></text>
				<text class="vipcontent">
					<text>会员再享</text>
					<text class="bigPrice">{{this.getvipDiscount(discount).split('.')[0]}}</text>
					<text>{{'.'+this.getvipDiscount(discount).split('.')[1]}}折</text>
					<text style="margin-left: 160upx;">仅￥<text class="lineprice">
					{{((srvGoodsData.current_price*(this.getvipDiscount(discount)/10)).toFixed(2).split('.')[0])}}</text>
					<text>{{'.'+((srvGoodsData.current_price*(this.getvipDiscount(discount)/10)).toFixed(2).split('.')[1])}}</text>元</text>
				</text>
			</view>
		</view>
		<!-- 标题 价格 -->
		<view class="info-box goods-info">
			<view class="wrapTitlePrice">
				<view class="price">￥{{srvGoodsData.current_price}} <text class="priceIn">￥{{srvGoodsData.original_price}}</text></view>
				<!-- <view class="buttonPrice" v-if="srvGoodsData.current_price"> -->
					
					<!-- <text>{{this.getvipDiscount(discount)}}折</text> -->
					<!-- </view> -->
				<!-- ((srvGoodsData.current_price/srvGoodsData.original_price).toFixed(2)).substring(2,3) -->
			</view>
			<view class="title" v-if="srvGoodsData.name">
				{{srvGoodsData.name}}
			</view>
			<view class="volume">
				<view class="volumeMar">销量：{{srvGoodsData.sales||messagesText}}</view>
				<view class="volumeMar">库存：{{srvGoodsData.stock_amount||messagesText}}</view>
			</view>
		</view>
	
		
		<!-- 服务-规则选择 -->
		<view class="info-boxshow spec">
			<view class="row  info-line" :class="srvGoodsData.promotion?'vipStyle':''">
				<view class="text textback">促销活动</view>
				<view class="content">
					<view class="serviceitem">{{srvGoodsData.promotion||messagesText}}</view>
				</view>
				<!-- <view class="arrow"><view class="icon xiangyou"></view></view> -->
			</view>
			<view class="row info-line" @tap="showSpec(false)">
				<view class="text">选择规格</view>
				<view class="content">
					<view class="serviceitem">{{srvGoodsData.specification||messagesText}}</view>
				</view>

			</view>

		</view>
		<!-- 规格-模态层弹窗 -->
		<!-- <view class="popup spec " :class="specClass" @touchmove.stop.prevent="discard" @tap="hideSpec">
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="title">选择规格：</view>
					<view class="sp">
						<view v-for="(item,index) in goodsData.spec" :class="[index==selectSpec?'on':'']" @tap="setSelectSpec(index)"
						 :key="index">{{item}}</view>
					</view>
					<view class="length" v-if="selectSpec!=null">
						<view class="text">数量</view>
						<view class="number">
							<view class="sub" @tap.stop="sub">
								<view class="icon cuIcon-move"></view>
							</view>
							<view class="input" @tap.stop="discard">
								<input type="number" v-model="goodsData.number" />
							</view>
							<view class="add" @tap.stop="add">
								<view class="icon cuIcon-add"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="btn">
					<view class="button" @tap="hideSpec">完成</view>
				</view>
			</view>
		</view> -->
		<!-- 详情 -->
		<view class="description">
			<view class="title">———— 图文详情 ————</view>
			<view class="textphoto" v-if="srvGoodsData.desc">
				{{srvGoodsData.desc}}
			</view>
			<view class="content" v-for="(img,index)  in DetailsFig">
				<image :src="img.Detailimg" mode=""></image>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				
				<view class="box" @tap="gohome">
					<view class="icon cuIcon-home"></view>
					<view class="text">首页</view>
				</view>
				<view class="box" v-if="srvGoodsData.state=='上架'">
					<view class="icon  cuIcon-likefill " @tap="share"></view>
					<view class="text">分享</view>
				</view>
				<view class="boxs" v-else>
					<!-- <view class="icon  cuIcon-likefill " @tap="share"></view>
					<view class="text">分享</view> -->
				</view>
				<view class="box placexyz" @tap="gocar">
					<view class="icon cuIcon-cart"></view>
					<view class="text">购物车</view>
				</view>
				<view class="iconNuml  " v-if="iconBoole">
					+1
				</view>
			</view>
			<view class="btn" v-if="srvGoodsData.state=='上架'">
				<view class="joinCart" @tap="joinCart">加入购物车</view>
				<view class="buy" @tap="buy(srvGoodsData.no)">立即购买</view>
			</view>
			<view class="btn" v-else>
				<view class="buy  bg-grey" @tap="">{{srvGoodsData.state?'此商品已下架':'此商品不存在'}}</view>
			</view>
			<view class="iconNuml shopcart" v-if="!iconBoole">{{shopcart}}</view>
		</view>
		<!-- share弹窗 -->
		<view class="share" :class="shareClass" @tap="hideShare">
			<view class="mask"></view>
			<view class="layer">
				<view class="h1">分享</view>
				<view class="list">
					<view class="box" @tap="wxsharebox">
						<image src="../../../static/wx.png"></image>
						<view class="title">
							微信分享
						</view>
					</view>
					<view class="box" @tap="sharePhoto(srvGoodsData)">
						<image class="" style="border-radius: 50%;" src="../../../static/pyq.png"></image>
						<view class="title">
							画报分享
						</view>
					</view>
				</view>
				<view class="btn" @tap="hideShare">
					取消
				</view>
			</view>
		</view>
		<view class="mask" v-if="shareMask">
			<view class="imgshare">
				<image src="../../../static/sharet.png" mode="widthFix"></image>
			</view>
			<image src="../../../static/ino.png" class="inopho" mode="aspectFit" @click="inoBtn"></image>
		</view>
		<view class="" style="height: 50upx;"></view>
	</view>
</template>

<script>
	import defaultPhotp from '../../../static/defaultPhotp.jpg'
	import backImg from '../../../static/backg.png'
	var wx = require('jweixin-module');
	export default {
		components: {
			defaultPhotp,
			backImg
		},
		data() {
			return {
				iconBoole: false,
				shareMask: false,
				goodsNo: "",
				backImg:backImg,
				messagesText: '暂无',
				//轮播图数据
				swiperList: [],
				//轮播图下标
				currentSwiper: 0,
				shopcart:0,
				specClass: ' ', //规格弹窗css类，控制开关动画
				shareClass: '', //分享弹窗css类，控制开关动画
				goodsData: {
					id: 1,
					name: "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
					price: "127.00",
					number: 1,
					service: [{
							name: "正品保证",
							description: "此商品官方保证为正品"
						},
						{
							name: "极速退款",
							description: "此商品享受退货极速退款服务"
						},
						{
							name: "7天退换",
							description: "此商品享受7天无理由退换服务"
						}
					],
					spec: ["XS", "S", "M", "L", "XL", "XXL"]

				},
				srvGoodsData: [],
				selectSpec: null, //选中规格
				DetailsFig: [],
				discount:''
			};
		},
		onLoad(option) {
			console.log('\n\n\n\n\n\n\n',this.$store.getters.getVipInfo.discount,uni.getStorageSync('vipInfo').discount)
			if(this.$store.getters.getVipInfo.discount){
				this.discount = this.$store.getters.getVipInfo.discount
			}else{
				console.log("0000")
				this.discount =uni.getStorageSync('vipInfo').discount
				console.log(this.discount)
			}
			
			if (option.hasOwnProperty("no")) {
				this.goodsNo = option.no
				this.getGoodsDetail(this.goodsNo)
				this.getSignature()
				this.shopcartNum()
				
			} else {
				uni.showModal({
					cancelText: "无效页面",
					success(e) {
						if (e) {

						}
					}
				})
			}
		},
		created() {
			// this.discount = this.$store.getters.getVipInfo.discount
		},
		methods: {
			getGoodsDetail(e) {
				let optionType = "select"
				let srv = "srvshop_goods_select"
				let req = {
					"serviceName": "srvshop_goods_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "no",
						"ruleType": "in",
						"value": this.goodsNo
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 10
					},
					"order": []
				}
				this.onRequest(optionType, srv, req).then((res) => {
					this.srvGoodsData = res.data.data[0]
					this.slideshow(res.data.data[0].img)
					this.DetailsFigs(res.data.data[0].details_img)
				})
			},
			//轮播
			slideshow(img) {
				this.getFilePath(img).then((res) => {
					if (res.length == 0) {
						this.swiperList = {
							img: defaultPhotp
						}
					} else {
						let swiperPhoto = []
						for (let i in res) {
							swiperPhoto.push({
								img: this.$api.getFilePath + res[i].fileurl + '&thumbnailType=fwsu_100'
							})
						}
						this.swiperList = swiperPhoto
					}

				})
			},
			// 分享
			wxsharebox() {
				this.hideShare()
				this.inoBtn()
			},
			//购物车数量
			shopcartNum(){
				this.getCarGoodsNum().then((res)=>{
					this.shopcart=res
				})
			},
			share() {
				this.shareClass = 'show';
			},
			inoBtn() {
				this.shareMask = !this.shareMask
			},
			hideShare() {
				this.shareClass = 'hide';
				setTimeout(() => {
					this.shareClass = 'none';
				}, 150);
			},
			//轮播图下标数字
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			setSelectSpec(index) {
				this.selectSpec = index;
			},
			//规格弹窗
			showSpec(fun) {
				console.log('show');
				this.specClass = 'show';
				this.specCallback = fun;
			},
			specCallback() {
				return;
			},
			// 加入购物车
			joinCart() {
					uni.showLoading({
						title: '',
						mask:true
					});
					let that = this
					let optionType = "add"
					let srv = "srvshop_car_add"
					let req = [{
						"data": [{
							"goods_no": that.srvGoodsData.no, //商品编号
							"goods_name": that.srvGoodsData.name, //商品名称
							"num": 1, //数量
							"shop_no": that.srvGoodsData.shop_no, //商铺编号
							"shop_name": that.srvGoodsData.shop_name, //商铺名称
						}],
						"serviceName": "srvshop_car_add"
					}]
					that.onRequest(optionType, srv, req).then((res) => {
						if (res.data.resultCode == "SUCCESS" && res.data.state == "SUCCESS") {
							this.iconBoole = !this.iconBoole
							setTimeout(() => {
								this.iconBoole = !this.iconBoole
							}, 1000)
							uni.hideLoading();
							uni.showToast({
								duration: 1000,
								icon: 'success',
							});
							this.shopcartNum()
						} else {
							uni.setStorageSync('backUrl',window.location.href)
							uni.showToast({
								title: '添加失败',
								duration: 2000,
								image: '../../../static/gantanhao.png'
							});
						}
					})
					
					
			},
			//微信分享
			// wxShare(){
			// 	this.shareClass = 'hide';
			// },
			//立即购买
			buy(no) {
				uni.navigateTo({
					url: `/pages/specific/placeOrders/placeOrders?goods_no=${no}&fromPath=goodsDetail`
				})
			},
			DetailsFigs(img) {
				this.getFilePath(img).then((res) => {
					let DetailsFig = []
					for (let j in res) {
						DetailsFig.push({
							Detailimg: this.$api.getFilePath + res[j].fileurl
						})
					}
					this.DetailsFig = DetailsFig
				})
			},
			sharePhoto(item) { ///画报
			console.log(item)
				let data = {
					name: item.name,
					price: item.current_price,
					photo: this.swiperList[0].img,
					codeurl: window.location.href,
					type:'commodity',
					// no:item.no
				}
				let user =uni.getStorageSync('login_user_info')
				let userNo =(user.user_no)
				// uni.navigateTo({
				// 	url:"/pages/specific/sharephoto/sharephoto?data="+encodeURIComponent(JSON.stringify(data))
				// })up_user=wangyh
				if(userNo){
					uni.navigateTo({
						url:`/pages/specific/sharephoto/sharehtml?data=`+encodeURIComponent(JSON.stringify(data))
					})
				}else{
					uni.showToast({
					    title: '分享失败',
					    duration: 2000
					});
				}
				
			},
			//减少数量
			sub() {
				if (this.goodsData.number <= 1) {
					return;
				}
				this.goodsData.number--;
			},
			//增加数量
			add() {
				this.goodsData.number++;
			},
			gohome() { //回首页
				// uni.navigateTo({
				// 	url: "/pages/specific/index/index?pageName=shophome"
				// })
				uni.redirectTo({
					url: "/pages/specific/index/index?pageName=shophome"
				})
			},
			gocar() {
				// uni.navigateTo({
				// 	url: "/pages/specific/index/index?pageName=shoppingCart"
				// })
				uni.redirectTo({
					url: "/pages/specific/index/index?pageName=shoppingCart"
				})
			},
			//选择规格
			setSelectSpec(index) {
				this.selectSpec = index;
			},

			getSignature(formData) {
				let self = this;
				let linkurl = window.location.href.split('#')[0];
				let req = {
					serviceName: 'srvwx_app_signature_select',
					colNames: ['*'],
					condition: [{
							colName: 'app_no',
							ruleType: 'eq',
							value: this.$api.appNo.wxh5
						},
						{
							colName: 'page_url',
							ruleType: 'eq',
							// value: linkurl
							value: uni.getStorageSync('linkUrl') ? uni.getStorageSync('linkUrl') : window.location.href.split('#')[0]
						}
					]
				};
				// alert('linkUrl' + uni.getStorageSync('linkUrl'));
				if (uni.getStorageSync('linkUrl')) {

					console.log('linkUrl', uni.getStorageSync('linkUrl'));
					// alert('linkUrl' + uni.getStorageSync('linkUrl'));
				}
				uni.setStorageSync('linkUrl', null);
				self.$http.post(self.$api.getSignature, req).then(res => {
					// console.log("eeeeeeeeeeeeeeeeeeeeeeee",res)

					if (res.data.state === 'SUCCESS') {
						let resData = res.data.data[0];
						console.log('getSignature', resData);
						uni.setStorageSync('signatureInfo', resData);
						wx.config({
							debug: false, // 调试阶段建议开启
							appId: resData.appId, // APPID
							timestamp: resData.timestamp, // 时间戳timestamp
							nonceStr: resData.noncestr, // 随机数nonceStr
							signature: resData.signature, // 签名signature
							// 需要调用的方法接口
							jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline',
								'onMenuShareAppMessage'
							]
						});

						wx.ready(() => {
							// console.log('wx.ready()', self.wxUserInfo);
							// let user =uni.getStorageSync('login_user_info')
							// let userNo =(user.user_no)
							// linkurl = linkurl+'&up_user='+userNo
							wx.updateAppMessageShareData({
								//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
								imgUrl: self.swiperList[0].img ||
									'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=677930244,4128014797&fm=26&gp=0.jpg', // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
								desc: self.srvGoodsData.desc, // 摘要,如果分享到朋友圈的话，不显示摘要。
								title: self.srvGoodsData.name, // 分享卡片标题
								link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
								success: function() {

								},
								cancel: function() {

								}
							}); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
							wx.updateTimelineShareData({
								imgUrl: self.swiperList[0].img ||
									'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=677930244,4128014797&fm=26&gp=0.jpg', // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
								desc: self.srvGoodsData.desc, // 摘要,如果分享到朋友圈的话，不显示摘要。
								title: self.srvGoodsData.name, // 分享卡片标题
								link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
								success: function() {

								},
								cancel: function() {

								}
							});
						});
						wx.error(function(res) {
							// alert(JSON.stringify(res));
							console.log(res);
						});
					} else {}
				});
			},


		}
	}
</script>

<style lang="less">
	.info-box {
		width: 100%;
		padding: 16upx 4%;
		background-color: #fff;
		margin-bottom: 20upx;
	}

	.goods-info {
		.price {
			font-size: 46upx;
			font-weight: 600;
			color: #f91818;
		}

		.title {
			font-size: 30upx;
		}
	}

	.info-boxshow {
		width: 100%;
		// padding: 16upx 4%;
		background-color: #fff;
		margin-bottom: 20upx;
	}

	.wrapGoods {
		background: #f8f8f8;
	}

	.wrapTitlePrice {
		display: flex;
	}

	.priceIn {
		font-size: 15px;
		color: #8a8989;
		text-decoration: line-through;
		font-weight: 100;
		margin: 0 18upx;
	}

	.buttonPrice {
		background: #E95D30;
		// width: 80upx;
		padding: 0 15upx;
		height: 40upx;
		border-radius: 13upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 40upx;
		margin-top: 10upx;
	}

	.content image {
		width: 100%;
		height: 800upx;
	}

	.swiper-box {
		position: relative;
		width: 100%;
		height: 80vw;

		swiper {
			width: 100%;
			height: 80vw;

			swiper-item {
				image {
					width: 100%;
					height: 80vw;
				}
			}
		}

		.indicator {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 25upx;
			height: 40upx;
			border-radius: 40upx;
			font-size: 22upx;
			position: absolute;
			bottom: 20upx;
			right: 20upx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.spec {
		.row {
			width: 100%;
			display: flex;
			align-items: center;
			// margin: 0 0 30upx 0;

			.text {
				font-size: 26upx;
				color: #a2a2a2;
				margin-right: 20upx;
				padding: 0 8upx;
			}

			.content {
				font-size: 28upx;
				display: flex;
				flex-wrap: wrap;

				.serviceitem {
					margin-right: 10upx;
					font-size: 26upx;
				}

				.sp {
					width: 100%;
					display: flex;

					view {
						background-color: #f6f6f6;
						padding: 5upx 10upx;
						color: #999;
						margin-right: 10upx;
						font-size: 20upx;
						border-radius: 5upx;

						&.on {
							border: solid 1upx #f47952;
							padding: 4upx 8upx;
						}
					}
				}
			}

			.arrow {
				position: absolute;
				right: 4%;

				.icon {
					color: #ccc;
				}
			}
		}
	}


	.popup {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		display: none;

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 21;
			background-color: rgba(0, 0, 0, 0.6);
		}

		.layer {
			position: fixed;
			z-index: 22;
			bottom: 0%;
			width: 100%;
			padding: 0 4%;
			height: 40%;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;

			.content {
				width: 100%;
				padding: 20upx 0;
			}

			.btn {
				width: 100%;
				height: 100upx;

				.button {
					width: 100%;
					height: 80upx;
					border-radius: 40upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f47952;
					font-size: 28upx;
				}
			}
		}

		&.show {
			display: block;

			.mask {
				animation: showPopup 5s linear both;
			}

			.layer {
				animation: showLayer 5s linear both;
			}
		}

		&.hide {
			display: block;

			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		&.service {
			.row {
				margin: 30upx 0;

				.title {
					font-size: 30upx;
					margin: 10upx 0;
				}

				.description {
					font-size: 28upx;
					color: #999;
				}
			}
		}

		&.spec {
			.title {
				font-size: 30upx;
				margin: 30upx 0;
			}

			.sp {
				display: flex;

				view {
					font-size: 28upx;
					padding: 5upx 20upx;
					border-radius: 8upx;
					margin: 0 30upx 20upx 0;
					background-color: #f6f6f6;

					&.on {
						padding: 3upx 18upx;
						border: solid 1upx #f47925;
					}
				}
			}

			.length {
				margin-top: 30upx;
				border-top: solid 1upx #aaa;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 20upx;

				.text {
					font-size: 30upx;
				}

				.number {
					display: flex;
					justify-content: center;
					align-items: center;

					.input {
						width: 80upx;
						height: 60upx;
						margin: 0 10upx;
						background-color: #f3f3f3;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;

						input {
							width: 80upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;
							text-align: center;
							font-size: 26upx;
						}
					}

					.sub,
					.add {
						width: 60upx;
						height: 60upx;
						background-color: #f3f3f3;
						border-radius: 5upx;

						.icon {
							font-size: 30upx;
							width: 60upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;

						}
					}
				}
			}

		}
	}

	.description {
		.title {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #999;
		}
	}

	.footer {
		position: fixed;
		bottom: 0upx;
		width: 100%;
		padding: 0 4%;
		height: 99upx;
		border-top: solid 1upx #eee;
		background-color: #fff;
		z-index: 2;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.icons {
			display: flex;
			height: 80upx;
			margin-left: -4%;

			.box {
				width: 80upx;
				height: 80upx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				margin-left: 5upx;
				margin-right: 5upx;
				.icon {
					font-size: 40upx;
					color: #828282;
				}

				.text {
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 22upx;
					color: #666;
				}
			}
		}

		.btn {
			height: 80upx;
			border-radius: 40upx;
			overflow: hidden;
			display: flex;
			margin-right: -2%;

			.joinCart,
			.buy {
				height: 80upx;
				padding: 0 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				font-size: 28upx;
			}

			.joinCart {
				background-color: #f0b46c;
			}

			.buy {
				background-color: #f06c7a;
			}
		}
	}

	.share {
		display: none;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.15s linear both;
			}

			.layer {
				animation: showLayer 0.15s linear both;
			}
		}

		&.hide {
			display: block;

			.mask {
				animation: hidePopup 0.15s linear both;
			}

			.layer {
				animation: hideLayer 0.15s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			background-color: rgba(0, 0, 0, .5);
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: 11;
		}

		.layer {
			width: 100%;
			position: fixed;
			z-index: 12;
			padding: 0 4%;
			bottom: 0;
			background-color: rgba(255, 255, 255, 0.9);

			.list {
				width: 100%;
				display: flex;
				padding: 10upx 0 30upx 0;

				.box {
					width: 25%;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;

					image {
						width: 13.8vw;
						height: 13.8vw;
					}

					.title {
						margin-top: 10upx;
						display: flex;
						justify-content: center;
						width: 100%;
						font-size: 26upx;
					}
				}
			}
			.btn {
				width: 100%;
				height: 100upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28upx;
				border-top: solid 1upx #666666;
			}

			.h1 {
				width: 100%;
				height: 80upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 34upx;
			}
		}
	}

	.textphoto {
		line-height: 28px;
		padding: 10px;
		background: #fff;
		color: #051B28;
		text-align: center;
		font-size: 15px;
		font-weight: 400;
		margin-bottom: 20upx;
	}

	.volume {
		margin-top: 18upx;
		display: flex;
	}

	.volume view {
		font-size: 14px;
		color: #ababab;
		width: 50vw;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1024;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);

	}

	.imgshare {
		float: right;
		text-align: center;
	}

	.inopho {
		height: 100upx;
		margin-top: 150upx;
		margin-left: 8%;

	}
.bigPrice{
	font-size: 36upx;
	margin-left: 8upx;
}

	.iconNuml {
		position: absolute;
		left: 225upx;
		background: red;
		height: 35upx;
		border-radius: 50%;
		width: 35upx;
		color: white;
		font-size: 12px;
		line-height: 35upx;
		text-align: center;
	}
	.shopcart{
		top:2px;
	}
	.vipStyle {
		background: #FBEEF6;
		.text {
			color: white !important;
			padding: 0 8upx;
			background:#ff3639e0;
			text-align: center;
		}

		.serviceitem {
			color: red !important;
		}

	}
.lineprice{
	font-size: 36upx;
}
	.info-line {
		// line-height: 50upx !important;
		padding: 22upx 4%;
	}
	.bg-grey{
		position: absolute;
		right: 60upx;
		border-radius: 40upx;
		min-width: 200upx;
	}
	.boxs{
		width:60upx ;
	}
	.cuIcon-likefill{
		color: red !important;
	}
	.viptitle{
		width: 100vw;
		height: 80upx;
		// background:url(https://s10.mogucdn.com/mlcdn/c45406/190911_665f5f24hb0k2egfhlfcjlfcfb4j0_1500x200.png);
		background-size: cover;
		line-height: 80upx;
		color: white;
		position: relative;
		padding: 0 4%;
		letter-spacing:2rpx;
		font-size:28rpx;
	}
	.textback{
		// color: white !important;
	}
	.cuIcon-vip{
		font-size: 46rpx;
		position: absolute;
		right:4%;
		
	}
	.vipcontent{
		// line-height: 70upx;
	}
	.boxxy{
		// position: fixed;
		// top: 530rpx;
	}
</style>
