<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品列表</block>
		</cu-custom>
		<bxTreeSelector
		  ref="bxTreeSelector"
		  :isMultiple="false"
		  :defaultValue="defaultValue"
		  :options="optionlistv2"
		  :layout="'horizontal'"
		  :treeForeignKey="treeForeignKey"
		  @on-tree-change="onTreeSelector"
		></bxTreeSelector>
		<bxTabFilter
			:filter-options="filterOptions"
			@bx-filter-change="onFilter"
		>
		</bxTabFilter>
		<bx-list
		  ref="bxList"
		  :serviceName="listConfig.serviceName"
		  :condition="listConfig.condition"
		  :pageType="listConfig.pageType"
		  :viewTemp="listConfig.viewTemp"
		  :listConfig="listConfig.listConfig"
		  :searchWords="listConfig.searchVal"
		  :searchColumn="'name'"
		  :detailList="listConfig.detailList"
		  :rownumber="5"
		  :fixed="false"
		  :heightStyle="'calc(100vh - 100px)'"
		  :order="listConfig.order"
		  @click-list-item="clickItem"
		  @list-change="listChange"
		  @clickFootBtn="clickFootBtn"
		  @loadEnd="loadEnd"
		></bx-list>
	</view>
</template>

<script>
	
	import bxTreeSelector from '@/components/bx-tree-selector/bx-tree-selector.vue';
	import bxTabFilter from '@/components/bx-tab-filter/bx-tab-filter.vue';
	export default {
		components:{bxTreeSelector,bxTabFilter},
		data() {
			return {
				filterOptions:{
					colSort:[{
						colName:"current_price",
						default:"", // asc 升序 desc 降序 
						label:"价格",
						options:[{
							label:"升序",
							value:"asc"
						},{
							label:"降序",
							value:"desc"
						}]
					},{
						colName:"stock_amount",
						default:"", // asc 升序 desc 降序
						label:"销量",
						options:[{
							label:"升序",
							value:"asc"
						},{
							label:"降序",
							value:"desc"
						}]
					}],
					filterTab:[]
				},
				category:null,
				defaultValue:"",
				serviceName:"srvshop_goods_category_select",
				optionlistv2:{
					conditions:[{
						colName:"shop_no",
						ruleType:"eq",
						value:uni.getStorageSync("shopNo")
					}],
					is_tree:true,
					key_disp_col:"name",
					refed_col:"no",
					serviceName:"srvshop_goods_category_select"
				},
				treeForeignKey:{
					parentNoColName:"parent_no",
					colKeyName:"no"
				},
				listConfig:{
					serviceName:"srvshop_goods_select",
					detailList:true,
					condition:[{
							colName: "is_recommend",
							ruleType: "in",
							value: "是",
						},{
							colName: "state",
							ruleType: "in",
							value: "上架",
						},{
							colName: "path",
							ruleType: "like",
							value: this.defaultValue,
						},
					],
					order:[],
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
			};
		},
		computed:{
			
		},
		onLoad(e) {
			console.log(e,e.category)
			if(e.hasOwnProperty("category")){
				this.category = JSON.parse(e.category)
				this.defaultValue = this.category.no
				this.listConfig.condition = this.listConfig.condition.map((item,index) =>{
					if(item.colName === "path"){
						item.value = this.category.no
					}
					return item
				})
				this.loadCategory()
			}
		},
		created() {
			// this.loadCategory()
		},
		methods:{
			onTreeSelector:function(e){
				console.log(e)
				this.defaultValue = e
				this.listConfig.condition = this.listConfig.condition.map((item,index) =>{
					if(item.colName === 'path'){
						item.value = e
					}
					return item
				})
				this.$refs.bxList.onRefresh();
			},
			onFilter(e){
				console.log("on filter",e)
				// this.$api
				this.listConfig.order = []
				if(e.type == 'all'){
					
				}else{
					let order = {
						colName:e.colName,
						orderType:e.default
					}
					this.listConfig.order.push(order)
				}
				
				this.$refs.bxList.onRefresh();
			},
			loadCategory:async function(){
				let colV2 = await this.getServiceV2(this.serviceName,"list","list","shop") //(srv, srvType, pageType, app)
				console.log("loadCategory",colV2)
				
			},
			// 列表相关方法
			listChange(e){
				console.log(e)
			},
			clickItem(e){
				console.log("clickItem",e)
				uni.navigateTo({
					url:"/pages/specific/goodsDetail/goodsDetail?no=" + e.no
				})
			},
			loadEnd(e){
				console.log(e)
			},
			clickFootBtn(e){
				this.onButtonToUrl(e).then(res => {
				  console.log('footBTN :', res);
				  if (e.button && e.button.button_type === 'delete') {
				    if (res.state === 'SUCCESS') {
				      this.$refs.bxList.onRefresh();
				    }
				  }
				});
				console.log('clickFootBtn:', e);
				
			},
		}
	}
</script>

<style lang="less">

</style>
