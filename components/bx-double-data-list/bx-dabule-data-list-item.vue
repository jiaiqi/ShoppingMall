<template>
	<view @tap="listItemClick" class="list-item-wrap">
		<view class="shop-top">
			<view class="shop-top-left">
				{{itemData.create_time}}
			</view>
			<view class="shop-top-right">
				{{itemData.order_state}}
			</view>
		</view>
		<view @tap.stop="listItemContClick(shop)" v-for="(shop,i) in itemData.order_goods" class="list-item" v-if="viewType === 'normal'">
			<!-- <image :src="shop.imgUrl" onerror="this.src='@/static/noneImg.png'" mode="" class="main-image"></image> -->
			<imgLazy class="main-image" v-if="itemData" :item="shop" :imgColName="'imgUrl'"></imgLazy>
			<view class="content-box">
				<view class="title">{{ shop.goods_name }}</view>
				<view class="title-tip">{{ shop.tip }}</view>
				<view class="content">
					<view class="numbers">
						<text class="unit" v-if="!isNaN(Number(shop.unit_price))">￥</text>
						{{ shop.unit_price }}
					</view>
					<view class="tags"></view>
				</view>
				<view class="footer">
					<view class="foot-name">共{{shop.num}}件</view>
					<view class="foot-button">
							<view class="count-left">
								总计:
							</view>
							<view class="count-money">
								￥{{shop.amount}}
							</view>
						</view>
						<!-- <text class="lg text-blue" :class="'cuIcon-' + item.button_type" v-for="item in rowButton" :key="item.id" @click="footBtnClick(item)"></text> -->
						<!-- <text class="lg text-blue cuIcon-delete"></text> -->
					</view>
				</view>
			</view>
			<view class="shop-bot">
				<!-- <view v-for="(btn,t) in botBtn" class="btn">
					<view v-if="btn.state === itemData.btnShow" class="btns">
						<view @click="footBtnClick(btv)" v-for="(btv,b) in btn.btn" class="shop-bot-btn">
							{{btv.value}}
						</view>
					</view>					
				</view> -->
				<text
				  v-if="deRowButDisplay(itemData, item)"
				  class="cu-btn round sm text-blue line-blue fotbtn"
				  :class="'cuIcon-' + item.button_type"
				  v-for="item in rowButtons"
				  :key="item.id"
				  @tap.stop="footBtnClick(item)"
				>
				  {{ item.button_name }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import imgLazy from "@/components/bx-lazy-img/bx-lazy-img.vue"
export default {
	name: 'ListItem',
	components:{imgLazy},
	data() {
		return {
			picUrl: '',
			goodsData: {
				title: '',
				tip: '',
				img: '',
				price: '',
				footer: ''
			}
		};
	},
	methods: {
		listItemClick() {
			this.$emit('click-list-item', this.itemData);
		},
		footBtnClick(btn) {
			this.$emit('click-foot-btn', { button: btn, row: this.itemData });
		},
		listItemContClick(items){
			this.$emit('click-list-item-cont',items);
		},
		async getPicture(file_no) {
			const serviceName = 'srvfile_attachment_select';
			const url = this.getServiceUrl('file', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
			};
			if (file_no !== null && file_no !== '' && file_no !== undefined) {
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					const data = res.data.data[0];
					if (data) {
						const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl + "&thumbnailType=" + this.$api.imgThumbnailType;
						return fileurl;
					}
				}
			}
		},
		deRowButDisplay:function(item,button){
			if(item && button.hasOwnProperty("isShow") && button["isShow"].length > 0){
				let isShow = []
				for(let key  in button["isShow"]){
					switch (button["isShow"][key].ruleType){
						case "eq":
							if(item[button["isShow"][key].colName] === button["isShow"][key].value){
								isShow.push(true)
							}
							break;
						case "nq":
							if(item[button["isShow"][key].colName] !== button["isShow"][key].value){
								isShow.push(true)
							}
							break;
						default:
							break;
					}
				}
				if(isShow.length === button["isShow"].length){
					return true
				}else{
					return false
				}
			}else{
				return true
			}
		}
	},
	created(){
		console.log('tab-change',this.botBtn)
	},
	props: {
		viewType: {
			type: String,
			default: 'normal'
		},
		rowButtons:{
			type: Array,
			default: () => {
				[];
			}
		},
		viewTemp: {
			type: Object,
			default: () => {}
		},
		imageNum: {
			type: Number,
			default: 1
		},
		gridRowNum: {
			type: Number,
			default: 2
		},
		rowKey: {
			type: String,
			default: 'id'
		},
		serviceName: {
			type: String,
			default: ''
		},
		condition: {
			type: Array,
			default: () => {
				[];
			}
		},
		botBtn:{
			type: Array,
			default: () => {
				[];
			}	
		},
		rownumber: {
			type: Number,
			default: 10
		},
		order: {
			type: Array,
			default: () => {
				[];
			}
		},
		showSearchBar: {
			type: Boolean,
			default: false
		},
		rowButton: {
			type: Array,
			default: () => {
				[];
			}
		},
		srv_cols: {
			type: Array,
			default: () => {
				[];
			}
		},
		itemData: {
			type: Object,
			default: () => {}
		},
		
	},
	watch: {
		srv_cols: {
			handler(newVal) {
				let arr = Object.values(this.viewTemp);
				console.log(this.srv_cols);
				// Object.values
				if (arr.length === 0 && this.srv_cols && this.srv_cols.length > 0) {
					let arr2 = this.srv_cols.map(item => item.columns);
					Object.keys(this.goodsData).forEach((item, index) => {
						this.goodsData[item] = this.itemData[arr2[index]];
					});
					this.goodsData['img'] = '';
				}
			}
		},
		itemData: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {				
				newValue.order_goods.forEach(imgs=>{
					if(imgs[this.viewTemp.img]){
						this.getFilePath(imgs[this.viewTemp.img]).then(url => {
							// this.$set(imgs,'imgUrl',url)
							let urls = this.$api.getFilePath + url[0].fileurl + "&thumbnailType=" + this.$api.imgThumbnailType
							// console.log("imgUrl:",url,urls)
							this.$set(imgs,'imgUrl',urls)
						});
					}
				})
								
				// if (newValue[this.viewTemp.img]) {
				// 	this.getPicture(newValue[this.viewTemp.img]).then(url => {
				// 		this.goodsData.img = url;
				// 	});
				// }
				if (newValue[this.viewTemp.title]) {
					this.goodsData.title = newValue[this.viewTemp.title];
				}
				if (newValue[this.viewTemp.tip]) {
					this.goodsData.tip = newValue[this.viewTemp.tip];
				}
				if (newValue[this.viewTemp.price]) {
					this.goodsData.price = newValue[this.viewTemp.price];
				}
				if (newValue[this.viewTemp.footer]) {
					this.goodsData.footer = newValue[this.viewTemp.footer];
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.list-item-wrap {
	margin: 20upx;
	border-radius: 5px;
	background: white;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	.shop-top{
		display: flex;
		justify-content: space-between;
		margin: 0px 10px;
		padding-bottom: 5px;
		border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
		padding-top: 8px;
		.shop-top-right{
			color: #fb7635;
		}
	}
	.list-item {
		width: calc(100% - 40upx);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20upx;
		box-sizing: border-box;
		.main-image {
			width: 160upx;
			height: 160upx;
			border-radius: 5upx;
			margin-right: 20upx;
			display: flex;
			align-items: center;
			justify-content: center
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
			}
			.title-tip {
				font-size: 24upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.content {
				.numbers {
					color: #e93b3d;
					line-height: 40upx;
					font-size: 24upx;
				}
				.unit {
					font-size: 30upx;
				}
			}
			.footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.foot-name {
					color: #333;
					position: relative;
					display: inline-block;
					padding-right: 28upx;
					line-height: 44upx;
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
				.foot-button {
					display: flex;
					.count-left{
						font-size: 12px;
						padding-top: 4px;
						color: #333;
					}
					.count-money{
						color: red;
						font-size: 16px;
					}
				}
			}
		}
	}
	.shop-bot{
		display: flex;
		justify-content: flex-end;
		padding-bottom: 8px;
		.shop-bot-btn{
			margin-right: 10px;
			border: 1px solid #999;
			padding: 2px 8px;
			font-size: 12px;
			border-radius: 10px;
		}
	}
	.btns{
		display: flex;
	}
	.fotbtn{
		margin-right: 10upx;
	}
}
</style>
