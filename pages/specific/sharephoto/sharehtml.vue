<template>
	<view class="content">
		<view class="" v-if="!isDom">
			<div class="wrap" ref="bill" :style="{'background-image':'url('+bgImg[current].bg+')'}">
				<view class="bgpho" >
					<image class="headerImg" style="" :src="wxUser.herdP" mode=""></image>
					<view class="textname">{{wxUser.names}}</view>
					<view class="titleName" :style="{'color':colortitle}">{{item.name}}</view>
					<image class="shopImg" :src="item.photo||shopUser.shopBanner" mode=""></image>
					<view class="price">{{pricenum(item.price)}}</view>
				</view>
				<view class="barcode">
					<image class="codeImg" :src="codephoto" mode=""></image>
					<view class="wxarr" :style="{'color':colortitle}">
						<view class="">打开微信扫一扫</view>
						<view class="">推广赚取千万佣金</view>	
						<view class="">{{shopUser.shopNames||'暂无'}}</view>
					</view>
				</view>
			</div>
		</view>
		<radio-group @change="radioChange" v-if="!isDom" class="check">
                <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in bgImg" :key="index">
                    <view>
                        <radio style="transform:scale(0.8)" :value="item.title" :checked="index === current" />
                    </view>
                    <view class="radiotext">{{item.title}}</view>
                </label>
            </radio-group>
		<view @click="fff" v-if="!isDom" type="" class="btnxy">生成</view>
		<view @click="" v-else type="" class="btnxy">请长按图片保存</view>
		<image v-if="isDom" class="canvasBase" :src="canvasImageUrl" style="height: 80vh;width: 80vw;" mode=""></image>
	<canvas canvas-id="qrcode" style="opacity: 0;z-index: -1;"></canvas>
	</view>
	
</template>

<script>
	import QRCode from '@/components/bx-qrcode/qrcodejs2';
	import html2canvas from '@/components/bx-qrcode/htmlacnvas';
	import bgone from '../../../static/img/0.png'
	import bgtwo from '../../../static/img/minep.jpg'
	import bgthree from '../../../static/img/8.jpg'
	export default{
		data(){
			return{
				colortitle:'#000',
				canvasImageUrl:'', //生成的海报
				isDom:false,
				codephoto:'', //二维码图片base64
				item:{},
				shopUser:{
					shopHerderImg:"",
					shopBanner:'',
					shopNames:this.$store.getters.getShopInfo.name
				},
				bgImg:[{title:'默认',bg:bgone},{title:'暗黑',bg:bgtwo},{title:'火红',bg:bgthree}],
				wxUser:{},
				current:0,
				//默认头像
				headerImg :'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3968417432,4100418615&fm=26&gp=0.jpg'
			}
		},
		onLoad(option) {
			var data = JSON.parse(decodeURIComponent(option.data));
			console.log(data, '0000000000000000000000000')
			this.item=data
			this.make(data.codeurl) //生成二维码
			this.getFilePath(this.$store.getters.getShopInfo.image).then((res)=>{
				console.log(this.$store.getters.getShopInfo,'商家')
				if(res){ //商家头像
					this.shopUser.shopHerderImg=(this.$api.getFilePath+res[0].fileurl) ///商家头像
				}
				this.getinfoUser()
			})
			this.getFilePath(this.$store.getters.getShopInfo.banners).then((res)=>{
				this.shopUser.shopBanner=(this.$api.getFilePath+res[0].fileurl)//商品图第一张
				console.log("商家第一张图",res[0].fileurl)
			})
		},
		methods:{
			radioChange(evt) {
					for (let i = 0; i < this.bgImg.length; i++) {
						if (this.bgImg[i].title === evt.target.value) {
							this.current = i;
						break;
					}
					
				}
				console.log(evt.target.value)
				if(evt.target.value=='暗黑'){
					this.colortitle="#fff"
				}else if(evt.target.value=='默认'){
					this.colortitle="#000"
				}else if(evt.target.value=='火红'){
					this.colortitle="#000"
				}
			},
			htmlToCanvas() {
					
						uni.showLoading({
							title: '海报生成中~'
						})
				
			      html2canvas(this.$refs.bill, {
			        useCORS: true // 解决图片跨域问题
			      }).then((canvas) => {
			        // 将canvas转成base64图片格式
					this.isDom=true
			        let imageUrl = canvas.toDataURL('image/png'); 
			        this.canvasImageUrl = imageUrl;
					setTimeout(()=>{uni.hideLoading()},3000)
			      }).catch((e) => console.log(e),setTimeout(()=>{uni.hideLoading()},3000));
			    },
			async getinfoUser(){  //头像 昵称判断 微信>商家>默认
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
						let wxUser= (res.data.data[0])
						if(wxUser.headimgurl&&wxUser.nickname){ //微信头像 名字
							this.wxUser={herdP:wxUser.headimgurl,names:wxUser.nickname}
						}else if(this.shopUser.shopHerderImg&&this.shopUser.shopNames){
							this.wxUser={herdP:this.shopUser.shopHerderImg,names:this.shopUser.shopNames}
						}else{
							return {herdP:this.headerImg,names:''}
						}
					})
				},
				make(url) { ///生成二维码
					uni.showLoading({
						title: '请稍后~',
						mask: true
					})
					QRCode.make({ ///生成二维码
						canvasId: 'qrcode',
						text: url,
						size:150,
						margin: 1,
						success: res => {
							console.log(res)
							this.codephoto=(res)
						},
						complete: () => {
							uni.hideLoading()
						}
					})
				},
				pricenum(data){
						if(data){
							return "￥"+data
						}else{
							return ' '
						}
					},
			fff(){
				this.$nextTick(() => {
				    // 跳用html转化canvas函数
				   this.htmlToCanvas()
				 })
			}
		},
		mounted() {
			
		}
	}
</script>


<style  lang="scss" scoped>
	.wrap{
		width: 80vw;
		height: 78vh;
		margin:  80upx;
		margin-top: 40upx;
		border-radius: 10px;
		
		background-size:100% 100% ;
	 }
		.content{
			background: #383535;
			height: 100vh !important;
			overflow: hidden;
		}
		.bgpho{
			border-radius: 10px;
			height: 52vh;
			position: relative;
	
			overflow: hidden;
		}
		.headerImg{
			position: absolute;
			top: 80rpx;
			left: calc(50% - 45rpx);
			width: 90rpx;height: 90rpx; border-radius: 50%;
		}
		.textname{
			text-align: center;
			font-size: 30rpx;
			font-weight: 600;
			color: #9d5b28;
			margin-top: 180rpx;
		}
		.titleName{
			text-align: center;
			font-size: 30rpx;
			color: #000;
			font-weight: 600;
			padding: 0 46rpx;
			margin-top: 36upx;
		}
		.shopImg{
			width: 58vw; 
			height: 22vh;
			margin-top: 30rpx;
			margin-left: calc(50% - 29vw);
			border-radius: 5px !important;
			border: 5upx solid #FFFFFF;
		}
		.price{
			text-align: center;
			color: red;
			line-height: 80upx;
			font-size: 32rpx;
			font-weight: 600;
		}
		.barcode{
			padding: 0 30upx;
			display: flex;
		}
		.codeImg{
			height: 190upx;
			width: 190upx;
			margin-top: 20upx;
			margin-left: 40upx;
			border: 20upx solid #FFFFFF;
			border-radius: 10upx;
		}
		.wxarr{
			font-size: 30upx;
			font-weight: 600;
			line-height: 60upx;
			margin-top: 20upx;
			margin-left: 50upx;
		}
		.btnxy{
			height: 70upx;
			width: 88%;
			letter-spacing: 20upx;
			font-weight: 600;
			font-size: 30upx;
			border-radius: 10upx;
			text-align: center;
			line-height: 70upx;
			background: white;
			position: fixed;
			bottom: 30upx;
			margin-left: 6%;
		}
		.canvasBase{
			width: 80vw;
			height: 78vh;
			margin:  80upx;
			margin-top: 40upx;
			border-radius: 10px;
		}
		.uni-list-cell-pd{
			display: flex;
		}
		.radiotext{
			line-height: 80upx;
			color: #fff;
		}
		.check{
			position: absolute;
			bottom: 110upx;
			left: 166upx;
		}
		uni-radio::before{
			right:18upx !important;
		}
</style>
