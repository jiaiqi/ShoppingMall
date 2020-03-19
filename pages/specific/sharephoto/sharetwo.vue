<template>
	<view  style="">
		<!-- background: #f19b9b; -->
		<view class="" v-if="saveimgs">
			<canvas canvas-id="zwyPoster" :style="{width:cansWidth,height:cansHeight}" class="canvasFz" ></canvas>
			<view class="bg" @click="close"></view>
			<canvas canvas-id="qrcode" style="opacity: 0;"></canvas>
		</view>
		<view class="imgcanvas" v-if="!saveimgs">
			<view class="" style="height: 100px;"> </view>
			<image  :src="canvsimg" ></image>
		</view>
		 <button v-if="saveimgs" class="cu-btn block bg-blue margin-tb-sm lg btncanvas" style="z-index: 999999;" @click="saveImg">保存</button>
	<button v-else class="cu-btn block bg-blue margin-tb-sm lg btncanvas" style="z-index: 999999;" @click="">请长按图片保存</button>
	</view>
</template>

<script>
	import QRCode from '@/components/bx-qrcode/qrcodejs2';
	import bgphoto from "../../../static/img/0.png"
	export default {
		data() {
			return {
				saveimgs:true,
				cansWidth: 270, //海报宽度
				cansHeight: 480, //海报高度
				bgPhoto: 'http://img3.imgtn.bdimg.com/it/u=1683487836,489450705&fm=26&gp=0.jpg', //海报
				shopPhoto: '', //商品图
				price: '555', //价格
				shopName: '', //商品名
				codePhoto:'' ,//二维码地址
				refresh:false,
				newDataJson:{},
				codeurl:'',
				data:{},
				bgcolorQ:true ,//遮罩
				wxUser:{},
				shopUserName:'',
				shopUserPhoto:'',
				textarr:[],
				canvsimg:'',
				shopMimg:'',//商品图第一张
				//海报默认头像
				headerImg :'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3968417432,4100418615&fm=26&gp=0.jpg'
			};
		},
	
		onLoad(option) {
			this.getinfoUser()
			var data = JSON.parse(decodeURIComponent(option.data));
			console.log(data, '0000000000000000000000000')
			this.data=data
			this.codePhoto = data.codeurl
			console.log(this.$store.getters.getShopInfo)
			this.shopUserName=(this.$store.getters.getShopInfo.name) //商家名称"20200311143641080100"
			this.textarr= ['请打开微信扫一扫', '推广赚钱千万佣金', this.$store.getters.getShopInfo.name],
			this.make()
			this.getFilePath(this.$store.getters.getShopInfo.image).then((res)=>{
				console.log(this.$store.getters.getShopInfo,'商家')
				if(res){
					this.shopUserPhoto=(this.$api.getFilePath+res[0].fileurl) ///商家头像
				}
			})
			this.getFilePath(this.$store.getters.getShopInfo.banners).then((res)=>{
				this.shopMimg=(this.$api.getFilePath+res[0].fileurl)//商品图第一张
			})
		},
		computed: {
			
		},
		mounted() {
			this.make()
		},
		methods: {
		async	getcode(){
				let wx =this.wxUser
				var data = this.data
				// this.codePhoto = this.newDataJson.codeurl
				this.ctx = uni.createCanvasContext('zwyPoster', this);
				//绘制背景矩形  //不能重叠
				this.drawBaseBg('white').then(() => {   //单位  vh  vw    可用uni.upx2px(130)
				///绘制背景图
				this.drawBg({url: this.bgPhoto,sLeft: 0,sTop: 0,sWidth: 1,sHeight: 0.75})	
				}).then(() => {	
					//二维码
					this.drawBg({url:this.codeurl,sLeft: .05,sTop: 0.81,sWidth: .31,sHeight: 0.17})
				}).then(() => {		
				// 头像
				this.judge().then((res)=>{
						console.log(res,"返回头像/名称 信息")
						this.circleImg(res.herdP,.44, .065, 16)
						this.drawText({text: res.names,sLeft: 'center', sTop: 0.17,fontSize: 12,color: '#5A390F'})
					})
				//不能绘制矩形  与头像重叠后  无圆形边框
					//昵称
				}).then(() => {
					console.log("这是商品图64",data.photo)
					this.drawBg({url: data.photo||this.shopMimg,sLeft: .14,sTop: 0.28,sWidth: .70,sHeight: 0.3})
					}).then(() => {
						// this.drawText({text:'相逢',sLeft:.48,sTop:0.265,fontSize:12,color:'#5A390F'})
						// canvas.drawImage(that.commodict, uni.upx2px(130), uni.upx2px(700), uni.upx2px(500), uni.upx2px(300));
						//内容  xy距离   
						this.pricenum(data.price).then((res)=>{
							console.log(res,'-----------------------')
							this.drawText({
								text: res,
								sLeft: 'center',
								sTop: 0.63,
								fontSize: 15,
								color: 'red',
								bold: true  //加粗
							})
						})
						//价格
					
						this.drawText({
							text: this.textarr,
							sLeft: .45,
							sTop: 0.85,
							fontSize: 12,
							color: '#000',
							lineHeight: 22,
							// bold: true
						})
						// 绘制多行文本
						this.drawText({
							text: data.name,
							sLeft: 'center',
							sTop: 0.23,
							fontSize: 13,
							color: '#000',
							bold: true
						})
					})
			},
		async	judge(){
				if(this.wxUser.headimgurl&&this.wxUser.nickname){ //微信头像 名字
					return {herdP:this.wxUser.headimgurl,names:this.wxUser.nickname}
				}else if(this.shopUserName&&this.shopUserPhoto){
					return {herdP:this.shopUserPhoto,names:this.shopUserName}
				}else{
					return {herdP:this.headerImg,names:''}
				}
			},
			make() { ///生成二维码
				uni.showLoading({
					title: '海报生成中',
					mask: true
				})
				QRCode.make({ ///生成二维码
					canvasId: 'qrcode',
					text: this.codePhoto,
					size:150,
					margin: 1,
					success: res => {
						this.codeurl=res
						setTimeout(()=>{
							this.getcode().then(()=>{
								uni.hideLoading()
							})
						},2000)
					},
					complete: () => {
					}
				})
			},
			saveImg(){
				uni.showLoading({
					title:'保存ing...',
					mask:true
				})
				let that = this
				setTimeout(function(){
					
					uni.canvasToTempFilePath({
					  x: -50,
					  y: -20,
					  width: 375,
					  height: uni.upx2px(1020),
					  destWidth: 375,
					  destHeight: uni.upx2px(1020),
					  canvasId:'zwyPoster',
					  success: function(res) {
						uni.hideLoading()
						console.log(that)
						that.saveimgs=false
						that.canvsimg=res.tempFilePath
						console.log(that.canvsimg,'[[[[[[[[[[[[[[]]]]]]]]]]]]]]')
					  },
					  fail(res) {
						  uni.hideLoading()
					  }
					},this)
				},1000)
				console.log(this.cansWidth,this.cansHeight)
				
			},
		async	pricenum(data){
				if(data){
					return "￥"+data
				}else{
					return ' '
				}
			},
			drawBaseBg(bgColor) {  ///绘制矩形
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						// anvas.fillRect(15,uni.upx2px(470),width-30, height-200);
						// 清楚所选范围内容
						this.ctx.rect(0, 100, this.cansWidth, 400)
						this.ctx.setFillStyle(bgColor)
						this.ctx.fill()
						this.ctx.draw()
						resolve()
					}, 200)
				})
			},
			circleImg(img, x, y, r) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({  //获取图片信息
						src: img
					}).then((image) => {
						// console.log(image[1].path)
						x = Math.ceil(this.cansWidth * x)
						y = Math.ceil(this.cansHeight * y)
						this.ctx.save();  //保存当前的状态
						var d = 2 * r;
						var cx = x + r;
						var cy = y + r;
						this.ctx.arc(cx, cy, r, 0, 2 * Math.PI); // 画一个圆
						this.ctx.clip();  //dui 所选图
						this.ctx.drawImage(image[1].path, x, y, d, d); //头像
						this.ctx.restore();
						//还原状态
						this.ctx.draw(true);
					})
				})
			},
			close() {
				let that = this
				uni.showModal({
				    title: '提示',
				    content: '记得保存后再退出`',
				    success: function (res) {
				        if (res.confirm) {
								uni.navigateBack({
								    delta: 1
								});
				        } else if (res.cancel) {
				            console.log('取消------------------');
				        }
				    }
				})
			},
			drawBg(item) {
				console.log(item)
				return new Promise((resolve, reject) => {
					uni.getImageInfo({ //获取图片信息
						src: item.url
					}).then((image) => {
						// console.log(image)
						if (item.sLeft == 'center') {
							this.ctx.drawImage(image[1].path, this.cansWidth * (.5 - item.sWidth / 2), this.cansHeight * item.sTop, this
								.cansWidth * item.sWidth, this.cansHeight * item.sHeight);
						} else {
							this.ctx.drawImage(image[1].path, this.cansWidth * item.sLeft, this.cansHeight * item.sTop, this.cansWidth *
								item.sWidth, this.cansHeight * item.sHeight);
						}
						this.ctx.draw(true);
						resolve()
					})
				})
			},
			getinfoUser(){
				let optionType = "select"
				let srv = "srvwx_basic_user_info_select"
				let app ='wx'
				let req = {
					"serviceName": "srvwx_basic_user_info_select",
					"colNames": [
						"*"
					],
					"condition": [
						{
							"colName": "app_no",
							"ruleType": "eq",
							"value": "APPNO20200107181133"
						}
					]
				}
				this.onRequest(optionType, srv, req,app).then((res) => {
					this.wxUser= (res.data.data[0])
					//用户信息
					// this.userinfo={
					// 	face:item.headimgurl||'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3968417432,4100418615&fm=26&gp=0.jpg',
					// 	username:item.nickname||'无',
					// 	integral:"1435"
					// }
				})
			},
			drawText(item) {
				setTimeout(() => {
					var isLeft
					if (item.sLeft == 'center') {
						isLeft = this.cansWidth * .5 - (item.fontSize * item.text.length) / 2
					} else {
						isLeft = item.sLeft * this.cansWidth
					}
					this.ctx.save()
					if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
					this.ctx.setGlobalAlpha(1) //不透明
					this.ctx.setFillStyle(item.color)
					this.ctx.setFontSize(item.fontSize)
					if (item.text instanceof Array) {
						if (!item.lineHeight) item.lineHeight = item.fontSize + 2
						// console.log('我是数组', item.text)
						for (var i = 0; i < item.text.length; i++) {
							this.ctx.fillText(item.text[i], isLeft, item.sTop * this.cansHeight + item.lineHeight * i)
						}
					} else {
						// console.log('我是字符串', item.text)
						this.ctx.fillText(item.text, isLeft, item.sTop * this.cansHeight)
					}
					this.ctx.draw(true)
					this.ctx.restore()
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100vh;
		background: #f19b9b !important;
	}
	.bg {
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 998;
		background-color: #f19b9b;
	}
	.canvasFz {
		border: 6px solid white;
		border-radius: 10px;
		position: fixed;
		left: 0;
		z-index: 999;
		width: 270px;
		height: 480px;
		right: 0;
		bottom: 130upx;
		margin: 0 auto;
		background-size: 100%;
	}
	.btncanvas{
		width: 88%;
		position: fixed;
		bottom: 2px;
		margin-left: 6%;
	}
	.imgcanvas image {
		z-index: 9999999!important;
		width: 375px;height: 510px;
	}
</style>
