<template>
	<view class="bg-white">
		<swiper v-if="swiperType==='screen'" class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<image  :lazy-load="true" :src="item[urlCol]" onerror="this.src='@/static/noneImg.png'" mode="aspectFill"  v-if="item._type=='image'"></image>
				<video :src="item[urlCol]" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item._type=='video'"></video>
			</swiper-item>
		</swiper>
		<!-- #ifndef MP-ALIPAY -->
		<swiper  v-else-if="swiperType==='card'" class="card-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
		 indicator-active-color="#0081ff">
			<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
				<view class="swiper-item">
					<image   :lazy-load="true" :src="item[urlCol]" onerror="this.src='@/static/noneImg.png'" mode="aspectFill" v-if="item._type=='image'"></image>
					<video :src="item[urlCol]" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item._type=='video'"></video>
				</view>
			</swiper-item>
		</swiper>
		<view   v-else-if="swiperType==='tower'" class="tower-swiper" @touchmove="TowerMove" @touchstart="TowerStart" @touchend="TowerEnd">
			<view class="tower-item" :class="item.zIndex==1?'none':''" v-for="(item,index) in swiperList" :key="index" :style="[{'--index': item.zIndex,'--left':item.mLeft}]" :data-direction="direction">
				<view class="swiper-item">
					<image  :lazy-load="true" :src="item[urlCol]" onerror="this.src='@/static/noneImg.png'" mode="aspectFill" v-if="item._type=='image'"></image>
					<video :src="item[urlCol]" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item._type=='video'"></video>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		
		props:{
			isDotStyle:{
				type:String,
				default(){
					return 'round-dot'; // 'square-dot' 'round-dot'
				}
			},
			showDotStyle:{
				type:Boolean,
				default(){
					return false; // 'square-dot' 'round-dot'
				}
			},
			swiperList:{
				type:Array,
				default(){
					return []; 
				}
			},
			swiperType:{
				type:String,
				default(){
					return 'screen'; // 'screen' 'card' 'tower'
				}
			},
			urlCol:{
				type:String,
				default(){
					return 'url'; // 
				}
			}
		},
		data() {
			return {
				cardCur:"",
				dotStyle: this.showDotStyle,
				towerStart: 0,
				direction: ''
			};
		},
		methods:{
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			// towerSwiper
			// 初始化towerSwiper
			TowerSwiper(name) {
				let list = this[name];
				for (let i = 0; i < list.length; i++) {
					list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
					list[i].mLeft = i - parseInt(list.length / 2)
				}
				this.swiperList = list
			},
			
			// towerSwiper触摸开始
			TowerStart(e) {
				this.towerStart = e.touches[0].pageX
			},
			
			// towerSwiper计算方向
			TowerMove(e) {
				this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
			},
			
			// towerSwiper计算滚动
			TowerEnd(e) {
				let direction = this.direction;
				let list = this.swiperList;
				if (direction == 'right') {
					let mLeft = list[0].mLeft;
					let zIndex = list[0].zIndex;
					for (let i = 1; i < this.swiperList.length; i++) {
						this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
						this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
					}
					this.swiperList[list.length - 1].mLeft = mLeft;
					this.swiperList[list.length - 1].zIndex = zIndex;
				} else {
					let mLeft = list[list.length - 1].mLeft;
					let zIndex = list[list.length - 1].zIndex;
					for (let i = this.swiperList.length - 1; i > 0; i--) {
						this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
						this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
					}
					this.swiperList[0].mLeft = mLeft;
					this.swiperList[0].zIndex = zIndex;
				}
				this.direction = ""
				this.swiperList = this.swiperList
			},
		}
	}
</script>

<style lang="less" scoped>
	
	.card-swiper {
	    height: 360rpx !important;
	}

</style>
