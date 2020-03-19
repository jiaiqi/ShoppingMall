<template>
  <view class="content b-t">
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">收货地址</block>
    </cu-custom>
    <view class="list b-b" v-for="(item, index) in addressList" :key="index">
      <view class="wrapper" v-if="addressList.length > 0" @click="checkAddress(item)">
        <view class="u-box">
          <text class="name">{{ item.recipient }}</text>
          <text class="mobile">{{ item.phone }}</text>
        </view>
        <view class="address-box">
          <text v-if="item.is_default == '是'" class="tag">默认</text>
          <text class="address">{{ item.province }}-{{ item.city }}-{{ item.county }}-{{ item.town }}-{{ item.addres }}</text>
        </view>
      </view>
      <view class="" style="display: flex;flex-direction: row;width: 100%;justify-content: flex-end;">
        <view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="addAddress('edit', item)">
          <text class="yticon icon-bianji"></text>
          <text style="" class="cu-btn round sm text-blue line-blue cuIcon-_dev">编辑</text>
        </view>
        <view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="delAddress(item)">
          <text class="yticon icon-iconfontshanchu1"></text>
          <text style="" class="cu-btn round sm text-blue line-blue cuIcon-_dev">删除</text>
        </view>
        <view class="" v-if="item.is_default == '否'" @click="defaAdress(item)" style="width: 20%;display: flex;align-items: center;justify-content: center;">
          <text class="yticon icon-iconfontshanchu1"></text>
          <text style="" class=" cu-btn round sm line-red text-red cuIcon-_dev">设为默认</text>
        </view>
      </view>
    </view>
    <!--<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
		</text>-->

    <button class="add-btn" @click="addAddress('add')">新增地址</button>
    <view class="barmo" v-if="firstAdressNum">你还没有收货地址哦，请添加~</view>
  </view>
</template>

<script>
// import Api from '@/common/api';
var wx = require('jweixin-module');
export default {
  data() {
    return {
      source: 0,
      addressList: [
        // {'userName':"候敏华1",'telNumber':'18700963685',
        // 'provinceName':'陕西','cityName':'西安','countyName':'雁塔区',
        // 'detailInfo':'科技五路泰祥花园','defaultStatus':1,'id':1},
        // {'userName':"候敏华2",'telNumber':'18700963685',
        // 'provinceName':'陕西','cityName':'西安','countyName':'雁塔区',
        // 'detailInfo':'科技五路泰祥花园','defaultStatus':10,'id':2},
      ],
      addAllEdi: '删除',
      firstAdressNum: false,
      fromPath: '',
      order_no: '',
      goods_no: '',
	  listboole:false
    };
  },
  onLoad(option) {
    // this.source = option.source;
    // this.getListAddress()
    uni.setStorageSync('addressData', null);
    const that = this;
    uni.setNavigationBarTitle({
      title: '收货地址'
    });
    if (option.fromPath) {
      this.fromPath = decodeURIComponent(option.fromPath);
    }
    if (option.order_no) {
      this.order_no = decodeURIComponent(option.order_no);
    }
    if (option.car_no) {
      this.car_no = decodeURIComponent(option.car_no);
    }
    if (option.goods_no) {
      this.goods_no = decodeURIComponent(option.goods_no);
    }
  },
  async onShow() {
	  uni.showLoading({
	  	title:'加载中'
	  })
    this.getSignature('select', 'vip', 'srvvip_shipping_address_auth_select', 'addres_no', 'eq').then(()=>{
		setTimeout(()=>{
			uni.hideLoading()
		},500)
	})
  },
  mounted() {
    // this.getSignature('select', 'vip', 'srvvip_shipping_address_auth_select', 'addres_no', 'eq');
	// this.getvipDiscount('0.01')
  },
  methods: {
    async getListAddress() {
      let params = {};
      // this.addressList = await Api.apiCall('get', Api.goods.listAddress, params);
    },
    // updateAdress() {
    // 	let optionType = 'operate'
    // 	let app = 'vip'
    // 	let req =[
    // 		{
    // 			"serviceName": "srvvip_shipping_address_update",
    // 			"condition": [
    // 				{
    // 					"colName": "addres_no",	//收获地址编号
    // 					"ruleType": "eq",
    // 					"value": this.firstAdressNum
    // 				}
    // 			],
    // 			"data": [
    // 				{'is_default':'是'}
    // 			]
    // 		}
    // 	]
    // 	let srv = 'srvvip_shipping_address_update'
    // 	this.onRequest(optionType, srv, req,app).then((res)=>{
    // 		// this.getSignature('select','vip','srvvip_shipping_address_auth_select','addres_no','eq')
    // 	})

    // },
    //设为默认
    defaAdress(item) {
      let that = this;
      uni.showModal({
        title: '提示',
        content: '设为默认收货地址?',
        success: function(res) {
          if (res.confirm) {
            var req = [
              {
                serviceName: 'srvvip_shipping_address_update',
                condition: [
                  {
                    colName: 'addres_no', //收获地址编号
                    ruleType: 'eq',
                    value: item.addres_no
                  }
                ],
                data: [{ is_default: '是' }]
              }
            ];
            var dataItem = that.addressList;
            for (let i in dataItem) {
              if (dataItem[i].addres_no !== item.addres_no) {
                req.push({
                  serviceName: 'srvvip_shipping_address_update',
                  condition: [
                    {
                      colName: 'addres_no', //收获地址编号
                      ruleType: 'eq',
                      value: dataItem[i].addres_no
                    }
                  ],
                  data: [{ is_default: '否' }]
                });
              }
            }
            console.log(req, '______');
            let optionType = 'operate';
            let app = 'vip';

            let srv = 'srvvip_shipping_address_update';
            that.onRequest(optionType, srv, req, app).then(res => {
              that.addAllEdi = '设置';
              that.judge(res);
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
      // console.log(item)
    },
    //选择地址
    checkAddress(item) {
      let fromPath = this.fromPath;
      uni.setStorageSync('addressData', item);
      console.log('2',item)
      let str = this.goods_no ? `&goods_no=${this.goods_no}` : this.order_no ? `&order_no=${this.order_no}` : this.car_no ? `&car_no=${this.car_no}` : '';
      if (fromPath) {
        uni.redirectTo({
          url: `/pages/specific/placeOrders/placeOrders?addres_no=${item.addres_no}&fromPath=${this.fromPath}${str}`
        });
      }
    },
    addAddress(type, item) {
      console.log('1',type, item)
      let str = this.goods_no ? `&goods_no=${this.goods_no}` : this.order_no ? `&order_no=${this.order_no}` : this.car_no ? `&car_no=${this.car_no}` : '';
      uni.navigateTo({
        url: `/pages/specific/address/addressManage?type=${type}&default=${this.firstAdressNum}&data=${JSON.stringify(item)}&fromPath=${this.fromPath}${str}`
      });
    },
    //添加或修改成功之后回调
    refreshList(data, type) {
      //添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
      // this.addressList.unshift(data);

      console.log(data, type);
    },
    // 删除地址
    async delAddress(item) {
      console.log(item);
      let that = this;
      uni.showModal({
        title: '提示',
        content: '确定删除',
        success: function(res) {
          if (res.confirm) {
            let numData = item.addres_no;
            that.getSignature('operate', 'vip', 'srvvip_shipping_address_delete', 'addres_no', 'in', numData);
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    async judge(res) {
      this.getSignature('select', 'vip', 'srvvip_shipping_address_auth_select', 'addres_no', 'eq');
      if (res.data.resultCode == 'SUCCESS' && res.data.state == 'SUCCESS') {
        uni.showToast({ duration: 2000, title: `${this.addAllEdi}成功` });
      } else {
        uni.showToast({
          title: `${this.addAllEdi}失败`,
          duration: 2000,
          image: '../../../static/gantanhao.png'
        });
      }
    },
    /// 地址
   async getSignature(optionTypes, apps, serviceNames, colNamesc, ruleTypes, numData) {
      let optionType = optionTypes;
      let app = apps;
      let req;
      if (optionTypes == 'select') {
        req = {
          serviceName: serviceNames,
          colNames: ['*'],
          condition: [],
          page: {}
        };
      } else {
        req = [
          {
            serviceName: serviceNames,
            condition: [
              {
                colName: 'addres_no', //收获地址编号
                ruleType: 'in',
                value: numData
              }
            ]
          }
        ];
      }
      let srv = serviceNames;
      this.onRequest(optionType, srv, req, app).then(res => {
        if (optionType == 'select') {
			
			
          let dataitems = res.data.data;
		  if(dataitems.length=='0'){
		  }
          if (dataitems.length == 0) {
            // console.log(dataitems[0].addres_no,"---------")
            this.firstAdressNum = true;
            // this.updateAdress()
          }
          for (let j in dataitems) {
            if (dataitems[j].is_default == '是') {
              var unshone = dataitems[j];
              dataitems.splice(j, 1);
            }
          }
          if (unshone) {
            dataitems.unshift(unshone);
          }
          this.addressList = dataitems;
          console.log(this.addressList);
        } else {
          this.judge(res);
        }
      });
    }
  }
};
</script>

<style lang="scss">
page {
  padding-bottom: 120upx;
}
.content {
  position: relative;
}
.list {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20upx;
  background: #fff;
  position: relative;
  border-bottom: 1upx solid #e7ebed;
}
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.address-box {
  display: flex;
  align-items: center;
  margin: 10upx 0;
  overflow: hidden;
  
  .tag {
    font-size: 24upx;
    color: #fa436a;
    margin-right: 10upx;
    background: #fffafb;
    border: 1px solid #ffb4c7;
    border-radius: 4upx;
    padding: 4upx 10upx;
    line-height: 1;
    height: 28upx;
    width: 58upx;
  }
  .address {
    font-size: 28upx;
    color: #909399;
	width: 90%;
  }
}
.u-box {
  font-size: 32upx;
  color: #000000;
  // margin-top: 16upx;
  .name {
    margin-right: 30upx;
  }
}
.icon-bianji {
  // display: flex;
  // align-items: center;
  // height: 80upx;
  font-size: 36upx;
  color: #909399;
  // padding-left: 30upx;
}

.add-btn {
  position: fixed;
  left: 30upx;
  right: 30upx;
  bottom: 16upx;
  z-index: 95;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 690upx;
  height: 80upx;
  font-size: 32upx;
  color: #fff;
  background-color: #67b637;
  border-radius: 10upx;
  box-shadow: 1px 2px 5px rgba(63, 219, 83, 0.4);
}
.barmo {
  height: 80px;
  text-align: center;
  line-height: 80px;
  color: #848181;
}
</style>
