<template>
  <view class="content">
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="backText" @tap="gateback">返回</block>
      <block slot="content">{{ addAdress }}</block>
    </cu-custom>
    <view class="box">
      <view class="box_left">收货人:</view>
      <view class="box_right"><input type="text" v-model="user.recipient" placeholder="为确保收货请使用真名" /></view>
    </view>
    <view class="box">
      <view class="box_left">手机号:</view>
      <view class="box_right"><input type="number" maxlength="11" v-model="user.phone" placeholder="请确保收货电话真实有效" /></view>
    </view>
    <view class="box">
      <view class="box_left">地区:</view>
      <view class="box_right">
        <view class="citybtn" @click="showMulLinkageThreePicker">{{ pickerText }}</view>
        <!-- <view><image src="../../static/xiala.png" mode=""></image></view> -->
      </view>
    </view>
    <!-- <view class="box">
			<view class="box_left">村镇/区:</view>
			<view class="box_right"><input type="text" v-model="user.town" placeholder="为确保收货请使用真实地址" /></view>
		</view> -->
    <!-- 	<view class="box">
			<view class="box_left">地址定位:</view>
			<view class="box_right_right" @click="openMap()">
				<input type="text" value="" v-model="mapAddressName" placeholder="在地图上搜索并选择地址" disabled="true" />
				<!-- <text>{{ mapAddressName }}</text> -->
    <!-- <image src="/static/location.png" mode=""></image> -->
    <!-- </view> -->
    <!-- </view> -->
    <view class="box">
      <view class="box_left">详细地址:</view>
      <view class="box_right_right"><input type="text" value="" v-model="user.addres" placeholder="街道门牌,楼层房间号等信息" /></view>
    </view>

    <!-- <view class="box">
			<view class="box_left">
				身份证号
			</view>
			<view class="box_right">
				<input type="text" value="" v-model="IDcard" placeholder="身份证号码" />
			</view>
		</view> -->
    <view class="box" v-if="false">
      <view class="box_left_two">设为默认收件地址:</view>
      <view class="box_right_two"><switch :checked="user.is_default == '是'" style="transform:scale(0.8)" @change="switchBtn" /></view>
    </view>
    <button class="btn" @click="submit">提交</button>
    <!-- <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker> -->
    <!-- <cascader :areaList="areaList"></cascader> -->

    <view class=" popupOne" :style="{ bottom: bottom }">
      <cascader-selector v-if="pouph" @getCascaderValue="getCascaderValue" :srvInfo="srvInfo" :defaultLineVal="defaultLineVal"></cascader-selector>
    </view>
    <view class="mask" v-if="pouph" @click="maskpop"></view>
  </view>
</template>

<script>
// import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
import cascaderSelector from '@/components/cascader/cascaderSelector.vue';
export default {
  data() {
    return {
      bottom: '-500px',
      defaultLineVal: '',
      pouph: false,
      srvInfo: {
        serviceName: 'srvconfig_area_adj_select',
        appNo: 'config'
      },
      cityPickerValueDefault: [0, 0, 1],
      themeColor: '#007AFF',
      pickerText: '选择省/市/区/街道',
      mode: '',
      deepLength: 1,
      pickerValueDefault: [0],
      pickerValueArray: [],
      user: {
        recipient: '', // [str] [必填] [收货人] recipient
        phone: '', //phone
        country: '中国', //国家
        province: '', //[str] [必填] [省]  province
        city: '', //        [str] [必填] [市] city
        county: '', //    [str] [必填] [区/ 县] county
        town: '', //村镇
        addres: '', //     [str] [必填] [详址] addres
        is_default: '否' //     [int] [可选] [默认地址。1是0否]  "is_default":"否"
      },
      id: '',
      typeState: '',
      addressNo: '',
      addAllEdi: '添加',
      paramsData: {},
      mapAddressName: '',
      addAdress: '新增地址',
      areaList: [],
      fromPath: ''
    };
  },
  components: {
    cascaderSelector
  },
  onLoad(option) {
    if (option.data !== 'undefined') {
      let optionsData = JSON.parse(decodeURIComponent(option.data));
      this.addressNo = optionsData.addres_no;
      this.typeState = option.type;
    }
    if (option.default == 'true') {
      this.user.is_default = '是';
    }
    if (option.fromPath) {
      this.fromPath = decodeURIComponent(option.fromPath);
    }
    // let title = '新增收货地址';
    var that = this;
    if (option.type === 'edit') {
      this.addAdress = '编辑地址';
      this.user = JSON.parse(option.data);
      console.log('user', this.user);
      var province = this.user.province;
      var city = this.user.city;
      var county = this.user.county;
      that.pickerText = province + '-' + city + '-' + county;
    }
  },
  methods: {
    getCascaderValue(val, btnType) {
      console.log('val', val, btnType);
      if (btnType === 'sure') {
        this.pouph = false;
      }
      if (val) {
        var labelArr = val.path_name.split('/');
        this.user.province = labelArr[1];
        this.user.city = labelArr[2];
        this.user.county = labelArr[3];
        this.user.town = labelArr[4];
        console.log(labelArr);
        this.pickerText = this.user.province + '-' + this.user.city + '-' + this.user.county + '-' + this.user.town;
      }
    },
    // 三级联动选择
    showMulLinkageThreePicker() {
      this.pouph = true;
      this.bottom = '0px';
    },
    gateback() {
      uni.navigateBack({
        delta: 1
      });
    },
    maskpop() {
      this.pouph = false;
    },
    onConfirm(e) {
      console.log(e);
      var label = e.label;
      this.pickerText = label;
      var labelArr = label.split('-');
      this.user.province = labelArr[0];
      this.user.city = labelArr[1];
      this.user.county = labelArr[2];
    },
    updateAdress() {
      //修改
      let optionType = 'operate';
      let app = 'vip';
      let req = [
        {
          serviceName: 'srvvip_shipping_address_update',
          condition: [
            {
              colName: 'addres_no', //收获地址编号
              ruleType: 'eq',
              value: this.addressNo
            }
          ],
          data: [this.paramsData]
        }
      ];
      let srv = 'srvvip_shipping_address_update';
      this.onRequest(optionType, srv, req, app).then(res => {
        uni.hideLoading();
        this.judge(res);
      });
    },
    async submit() {
      //提交 /修改
      let params;
      var info = this.user,
        _this = this;
      if (info.recipient == '' || info.phone == '' || info.addres == '') {
        uni.showToast({
          title: '请将信息填写完整',
          icon: 'none'
        });
        return;
      }
      var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!reg.test(info.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      uni.showLoading({
        title: '请稍等...'
      });
      let optionType = 'add';
      let app = 'vip';
      let req = [
        {
          data: [
            {
              recipient: info.recipient,
              phone: info.phone,
              country: info.country,
              province: info.province,
              city: info.city,
              county: info.county,
              town: info.town,
              addres: info.addres,
              is_default: info.is_default
            }
          ],
          serviceName: 'srvvip_shipping_address_add'
        }
      ];
      let srv = 'srvvip_shipping_address_add';
      // console.log(_this.typeState)
      let paramsData = {
        recipient: info.recipient,
        phone: info.phone,
        country: info.country,
        province: info.province,
        city: info.city,
        county: info.county,
        town: info.town,
        addres: info.addres,
        is_default: info.is_default
      };
      this.paramsData = paramsData;
      if (_this.typeState == 'edit') {
        _this.addAllEdi = '修改';
        // if(paramsData.is_default=='是'){

        // }
        _this.updateAdress();
      } else {
        this.onRequest(optionType, srv, req, app).then(res => {
          uni.hideLoading();
          _this.judge(res);
        });
      }
    },
    judge(res) {
      let _this = this;
      if (res.data.resultCode == 'SUCCESS' && res.data.state == 'SUCCESS') {
        uni.showToast({
          duration: 2000,
          title: `${_this.addAllEdi}成功`,
          success: function(res) {
            setTimeout(function() {
              uni.navigateTo({
                url: './address?fromPath=' + _this.fromPath
              });
            }, 1000);
          }
        });
      } else {
        uni.showToast({
          title: `${this.addAllEdi}失败`,
          duration: 2000,
          image: '../../../static/gantanhao.png'
        });
      }
    },
    switchBtn: function(e) {
      var that = this;
      console.log('switch1 发生 change 事件，携带值为', e.target.value);
      if (e.target.value == true) {
        that.user.is_default = '是';
      } else {
        that.user.is_default = '否';
      }
      console.log(that.user.is_default);
    }
  }
};
</script>

<style>
page {
  background: $page-color-base;
  padding-top: 16upx;
}
.content {
  width: 100%;
  font-size: 28upx;
  /* padding-top: 40upx; */
  color: #676769;
}
.box {
  width: 100%;
  padding: 0 20upx;
  height: 100upx;
  display: flex;
  align-items: center;
  /* margin-bottom: 20upx; */
  border-bottom: 1upx solid #eeeeee;
}
.box_left {
  width: 20%;
  display: flex;
  align-items: center;
}
.box_left_two {
  width: 550upx;
}
.box_right {
  width: 70%;
  display: flex;
}
.box_right_right {
  width: 85%;
  height: 80upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 3%;
}
.box_right_right input {
  width: 87%;
  height: 70upx;
  line-height: 70upx;
}
.box_right_right image {
  width: 40upx;
  height: 40upx;
}
.box_right image {
  width: 40upx;
  height: 40upx;
  margin-top: 20upx;
  margin-left: 30upx;
}
.box_right_two {
  width: 150upx;
}

.box_right input {
  width: 97%;
  height: 80upx;
  padding-left: 3%;
  background-color: #ffffff;
}
.btn {
  width: 690upx;
  height: 90upx;
  line-height: 90upx;
  background: #67b637;
  /* background-color: rgba(242 155 135); */
  color: #ffffff;
  font-size: 32upx;
  margin-top: 120upx;
}
.citybtn {
  width: 80%;
  height: 80upx;
  line-height: 80upx;
  overflow: hidden;
}
.popupOne {
  width: 100vw;
  position: fixed;
  /* animation: ; */
  z-index: 100;
}
.mask {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 21;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
