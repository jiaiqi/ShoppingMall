<template>
	<view class="vip-wrap">
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-orange"></text> 会员详情
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">会员类别：</text>
					<text class="text-grey">{{vipDef.name}}</text>
				</view>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">会员折扣：</text>
					<text class="text-grey">{{vipDef.discount}}</text>
				</view>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">佣金折扣率：</text>
					<text class="text-grey">{{vipDef.algorithm}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'vipDetail',
		components:{},
		data(){
			return {
				menuBorder: false,
				menuArrow: false,
				vipDef:{}
			}
		},
		onLoad(option){
			let vips = JSON.parse(decodeURIComponent(option.params))
			this.vipDef = vips
			
		}
	}
</script>

<style lang="scss">
</style>
