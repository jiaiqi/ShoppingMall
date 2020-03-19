<template>
	<view class="wrap-center   bg-white">
		<view class="header" v-bind:class="{'status':isH5Plus}">
			<view class="userinfo" v-if="userinfo">
				<view class="face"><image :src="userinfo.face"></image></view>
				<view class="info">
					<view class="" style="display: flex;">
						<view class="username">{{userinfo.username}}</view>
						<view class="integral backinte" >{{vipUser.category_name}}</view>
					</view>
					<view class="" style="display: flex;justify-content: space-between;">
						<view class="integral " style="margin-right: 10upx;">优惠折扣:{{this.getvipDiscount(vipUser.discount)+'折'}}</view>
						<view class="integral " >佣金率:{{(this.getvipDiscount(vipUser.algorithm)+'%')}}</view>
					</view>
				</view>
			</view>
			<!-- <view class="setting"><image src="../../../static/icon/setting.png"></image></view> -->
		</view>
		<view class="orders">
			<view class="box">
				<view class="label" v-for="(row,index) in orderTypeLise" :key="row.name" hover-class="hover"  @tap="toOrderType(row)">
					<view class="icon">
						<view class="badge" v-if="row.badge>0">{{row.badge}}</view>
							<text :class="row.icon" class="lg text-green light" ></text>
						<view v-if="row.value !== '全部'" class="count-num" :class="row.count>99?'more':''">
							{{row.count>99?'99+':row.count}}
						</view>
					</view>
					<view class="namewidth">
						{{row.name}}
					</view>
				</view>
			</view>
			
		</view> 
		<view class="list" v-for="(list,list_i) in severList" :key="list_i">
			<view class="li" v-for="(li,li_i) in list" @tap="toPage(list_i,li_i)" v-bind:class="{'noborder':li_i==list.length-1}"  hover-class="hover" :key="li.name" >
				<view class="icon"><text :class="li.icon" class="suicon  text-green"></text></view>
				<view class="text">{{li.name}}</view>
				<!-- <image class="to" src="../../../static/icon/to.png"></image> -->
			</view>
		</view>
	</view>
</template>
<script>
	import headerimg from '../../../static/img/headerimg.jpg'
	export default {
		data() {
			return {
				//#ifdef APP-PLUS
				isH5Plus:true,
				//#endif
				//#ifndef APP-PLUS
				isH5Plus:false,
				//#endif
				userinfo:{
					
				}		,
				vipUser:{
					
				},
				orderTypeLise:[
					//name-标题 icon-图标 badge-角标
					{name:'全部订单',value:'全部',icon:'cuIcon-edit',color:'#00b8ff',count:0},
					{name:'待付款',value:'待付款',icon:'cuIcon-sponsor',color:'#e8706ade',count:0},
					{name:'待收货',value:'待收货',icon:' cuIcon-deliver',color:'#00b8ff',count:0},
				],
				severList:[
					[
						// {name:'积分明细',icon:'mingxi.png'},
						{name:'收货地址',icon:'cuIcon-location',color:'#1cbbb4'},
						{name:'分享',icon:'cuIcon-share',color:'#1cbbb4'},
						{name:'分佣管理',icon:'cuIcon-link',color:'#1cbbb4'}
						// {name:'银行卡',icon:'bank.png'},
						// {name:'安全中心',icon:'security.png'},
						// {name:'在线客服',icon:'kefu.png'}
					]
				],
				listConfig:{
					btnCol:['order_state']
				}
			};
		},
		onShow(){
			console.log("onShow")
		},
		onLoad(){
			console.log("onLoad")
		},
		created() {
			//加载
			if(this.$store.getters.getVipInfo.category_name){
				console.log(this.$store.getters.getVipInfo.category_name)
				this.vipUser=this.$store.getters.getVipInfo
			}else{
				this.vipUser={
					category_name:'暂无',
					discount:'0',
					algorithm:'0'
				}
			}
			
			this.getinfoUser();
			this.updateTabNum()
			// this.getVipUser()
		},
	
		methods: {
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
					let item = (res.data.data[0])
					//用户信息
					this.userinfo={
						face:item.headimgurl||headerimg,
						username:item.nickname||'无',
						integral:"1435"
					}
				})
			},
			//用户点击订单类型
			toOrderType(index){
				uni.navigateTo({
					url:`../orderList/orderList?value=${index.value}`
				})
			},
			//用户点击列表项
			toPage(list_i,li_i){
				let user = uni.getStorageSync('login_user_info')
				let user_no =user.user_no
				console.log(list_i,li_i)
				if(li_i==0){
					uni.navigateTo({
						url:'../address/address'
					})
				}else if(li_i==1){
					let data = {
						name: '个人名片',
						price: '',
						photo: '',
						codeurl: window.location.href+'?up_user='+user_no+'&type='+'invite',
						type:'mine'
					}
					uni.navigateTo({
						url:'../sharephoto/sharehtml?data='+encodeURIComponent(JSON.stringify(data))
					})
				}else {
					uni.navigateTo({
						url:'../commissionRecord/reseller'
					})
				}
				// uni.showToast({title: this.severList[list_i][li_i].name});
			},

			/** 获取分类数量*/
			updateTabNum(){
				// let user_no = uni.getStorageSync('login_user_info').user_no
				// let cond = [{
				// 	"colName": "user_no",
				// 	"ruleType": "eq",
				// 	"value": user_no
				// },{
				// 	"colName": "order_state",
				// 	"ruleType": "eq",
				// 	"value": "正常"
				// }]
				// let tabData = this.orderTypeLise
				// let allCount = 0
				// 	this.getClassify("srvshop_order_select","state",cond).then(tabCount=>{
				// 		tabCount.forEach(counts=>{
				// 			allCount = allCount + counts.id
				// 			tabData.forEach(tab=>{
				// 				if(tab.value === "全部"){
				// 					tab.count = 0
				// 				}
				// 				if(counts.state === tab.value){
				// 					tab.count = counts.id
				// 				}
				// 			})
				// 		})					
				// 	})
				let that = this
				let user_no = uni.getStorageSync('login_user_info').user_no
				let cond = [{
					"colName": "user_no",
					"ruleType": "eq",
					"value": user_no
				}]
				let tabData = this.orderTypeLise
					this.getClassify("srvshop_order_select","state",cond).then(tabCount=>{
						that.getClassify("srvshop_order_select","order_state",cond).then(tabCountTwo=>{
							let newBtnData = [...tabCount,...tabCountTwo]
							for (let i = 0; i < this.listConfig.btnCol.length; i++) {
								for(let j = 0; j <newBtnData.length;j++){
									if(newBtnData[j][this.listConfig.btnCol[i]]){
										newBtnData[j]['status'] = newBtnData[j][this.listConfig.btnCol[i]]
									}
								}
							}
								let allCount = 0
								tabData.forEach(tab=>{
									let hasOnly = false
									if(tab.value === "全部"){
										let conds = [{
											"colName": "user_no",
											"ruleType": "eq",
											"value": user_no
										}]
										let reqs = {
											"serviceName": "srvshop_order_select",
											"colNames": ["*"],
											"condition": conds,		
										}
										this.onRequest("select","srvshop_order_select",reqs,"shop").then(a=>{
											tab.count = a.data.data.length
											console.log('newBtnData==========',newBtnData)
										})
									}else{
										newBtnData.forEach(counts=>{
											if(counts.status === '待付款' || counts.status === '待收货'){
												if(tab.value === counts.status){
													tab.count = counts.id
													hasOnly = true
												}
												
											}
											// }else if(tab.value === counts.status){
											// 	tab.count = counts.id
											// 	hasOnly = true
											// }										
										})
										if(!hasOnly){
											tab.count = 0
										}
									}
										
								})					
							})
						})
			}
		}
	}
</script>

<style lang="scss">
page{background-color:#fff}
.header{
	&.status{padding-top:var(--status-bar-height);}
	background-color:#67B637;width:100%;height:30vw;padding:0 4%;display:flex;align-items:center;
	.userinfo{
		width:90%;display:flex;
		.face{flex-shrink:0;width:15vw;height:15vw;
			image{width:100%;height:100%;border-radius:100%}
		}
		.info{
			padding-left:30upx;
			.username{color:#fff;font-size:40upx;margin-bottom: 16upx;margin-right: 20upx;}
			.integral{display:flex;align-items:center;padding:0 20upx;height:40upx;color:#fff;background-color:rgba(0,0,0,0.1);border-radius:20upx;font-size:24upx}
		}
	}
	.setting{
		flex-shrink:0;width:6vw;height:6vw;
		image{width:100%;height:100%}
	}
}
.hover{background-color:#eee}
.orders{
	background-color:#67B637;width:100%;height:11vw;padding:0 4%;margin-bottom:calc(11vw + 40upx);display:flex;align-items:flex-start;border-radius:0 0 100% 100%;
	.box{
		width:98%;padding:0 1%;height:22vw;background-color:#fefefe;border-radius:24upx;box-shadow:0 0 20upx rgba(0,0,0,0.15);margin-bottom:40upx;display:flex;align-items:center;justify-content:center;
		.label{
			display:flex;align-items:center;justify-content:center;flex-flow:wrap;width:100%;height:16vw;color:#666666;font-size:26upx;
			.icon{
				position:relative;width:7vw;height:7vw;margin:0 1vw;
				.badge{position:absolute;width:4vw;height:4vw;background-color:#ec6d2c;top:-1vw;right:-1vw;border-radius:100%;font-size:20upx;color:#fff;display:flex;align-items:center;justify-content:center;z-index: 10;}
				image{width:7vw;height:7vw;z-index: 9;}
				.count-num{
					border-radius: 100px;
					position: absolute;
					top: -6px;
					right: -8px;
					font-size: 10px;
					padding: 0px 5px;
					height: 14px;
					color: #ffffff;
					z-index: 10;
					background-color: #dd514c;
				}
				.more{
					top: -16upx;
					right: -40upx;
				}
			}
		}
	}
}
.list{
	width:100%;
	.li{
		width:100%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
	&.noborder{border-bottom:0}
		.icon{
			flex-shrink:0;width:50upx;height:50upx;
			image{width:50upx;height:50upx}
		}
		.text{padding-left:20upx;width:100%;color:#666}
		.to{flex-shrink:0;width:40upx;height:40upx}
	}
}
.wrap-center{
	width: 100% !important;
}
.backinte{
	background: #ffc007fa !important;
	margin:0  8upx;
	margin-top: 8upx;
}
.namewidth{
	min-width: 160upx;
	text-align: center;
}

.lg{
	font-size: 30px;
}
.suicon{
	font-size: 25px;
}
</style>
