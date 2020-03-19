<template>
  <view class="orders_wrap">
    <view class="order-status  bg-gradual-green" v-if="orderData.order_no">
      <view class="order-status-item">
        <text class="status" v-if="orderData.order_state">{{ orderState }}</text>
      </view>
      <view class="order-status-item" v-if="orderData.order_state">
        订单金额:￥
        <text class="money">{{ orderData.order_money }}</text>
      </view>
      <view class="order-status-item" v-if="orderData.order_state === '已取消'"><text class="status">订单已取消</text></view>
    </view>
    <view class="order_address" @click="toChangeAddress" v-if="showAddress">
      <view class="location">
        <text
          class="lg text-white  bg-gradual-green cuIcon-locationfill"
          style="border-radius: 50%; text-align: center; width: 30px; height: 30px; line-height: 30px;margin: 0 10upx;"
        ></text>
      </view>
      <view class="add_cen">
        <view class="address-box">
          <view class="padding-xs" v-if="defaultAddress.is_default === '是'"><text class="cu-tag  bg-gradual-green sm">默认</text></view>
          <view class="address">
            {{ defaultAddress.country ? defaultAddress.country : '' }}{{ defaultAddress.province ? defaultAddress.province : '' }}
            {{ defaultAddress.city ? defaultAddress.city : '' }} {{ defaultAddress.county ? defaultAddress.county : '' }}{{ defaultAddress.town ? defaultAddress.town : '' }}
          </view>
        </view>
        <text class="detail-address">{{ defaultAddress.addres }}</text>
        <view class="contact">
          <text class="name">{{ defaultAddress.recipient }}</text>
          <text class="phone">{{ defaultAddress.phone }}</text>
        </view>
      </view>
      <view class="arrows"><text class="lg text-gray cuIcon-right"></text></view>
    </view>
    <view class="add_address" v-if="!showAddress && !orderData.order_no"><text class="lg text-gray cuIcon-add" @click="toChangeAddress">添加地址</text></view>
    <view class="goods_wrap" v-if="goodsList.length > 0">
      <view class="goods_shop">
        <text class="lg text-green cuIcon-shop"></text>
        <text class="shop_name" v-if="goodsList.length > 0">{{ goodsList[0].shop_name }}</text>
      </view>
      <view class="goods_list">
        <view v-for="(goods, n) in goodsList" class="shop" :key="n" @click="clickGoodsItem(goods)">
          <view class="goods_list_left"><image :src="goods.imgUrl" mode="" class="goods-img"></image></view>
          <view class="goods_list_rig">
            <view class="goods_top">{{ goods.goods_name ? goods.goods_name : goods.name ? goods.name : '' }}</view>
            <view class="goods_cen">
              <view class="spec_left">
                <view v-for="spe in goods.goodsSpec" class="spec" :key="spe">{{ spe }}</view>
              </view>
            </view>
            <view class="goods_bot">
              <view class="spec_sprice">
                ￥
                <text class="price">{{ goods.current_price ? goods.current_price : goods.unit_price ? goods.unit_price : '' }}</text>
              </view>
              <view class="spec_num">
                <view>x</view>
                <view>{{ goods.num }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="shop_figure">
          <view class="shop_figure_con">
            <view>商品金额总计</view>
            <view>
              <text class="price">￥{{ totalPrice }}</text>
            </view>
          </view>
          <view class="shop_figure_con">
            <view>会员优惠金额</view>
            <view class="price">￥ {{ discountAmount }}</view>
          </view>
          <view class="shop_figure_con">
            <view>运费</view>
            <view>{{ orderData.freight ? orderData.freight : 0 }}</view>
          </view>

          <view class="shop_figure_con">
            <view class=""></view>
            <view>
              共
              <span class="amount">{{ goodsList.length }}</span>
              件
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="payment" v-if="!isPayment && orderData.order_state !== '已取消' && orderData.order_state !== '已关闭'">
      <view class="payment_left">
        <view>合计</view>
        <view class="price">￥{{ actualPayment }}</view>
      </view>
      <view class="button-box">
        <view class="payment_right  bg-gradual-green" @click="placeOrder" v-if="button.placeOrder">提交订单</view>
        <view class="payment_right gray" @click="confirmGetGoods" v-if="button.confirmGetGoods">确认收货</view>
        <!-- <view class="payment_right gray" @click="modalName = 'bottomModal'" v-if="button.shipping">发货</view> -->
        <!-- <view class="payment_right gray" @click="shippingGoods" v-if="button.shipping">发货</view> -->
        <view class="payment_right gray" @click="cancelOrder" v-if="button.cancelOrder && orderData.order_state !== '已取消'">取消订单</view>
        <view class="payment_right gray" @click="closeOrder" v-if="button.closeOrder && orderData.order_state !== '已取消'">关闭订单</view>
        <view class="payment_right  bg-gradual-green" @click="payOrder" v-if="button.payOrder && orderData.order_state !== '已取消'">去支付</view>
      </view>
    </view>
    <view class="order-info" v-if="orderData.order_no">
      <view class="title"><text>订单信息</text></view>
      <view class="info-list">
        <view class="label">订单编号:</view>
        <view class="value">{{ orderData.order_no }}</view>
      </view>
      <view class="info-list">
        <view class="label">创建时间:</view>
        <view class="value">{{ orderData.order_time }}</view>
      </view>
      <view class="info-list">
        <view class="label">支付状态:</view>
        <view class="value">{{ orderData.state }}</view>
      </view>
      <view class="info-list" v-if="orderData.order_state === '正常'">
        <view class="label">订单状态:</view>
        <view class="value">{{ orderData.state }}</view>
      </view>
    </view>
    <view class="cu-modal bottom-modal" :class="modalName == 'bottomModal' ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white">
          <view class="action text-green" @tap="shippingGoods">确定</view>
          <view class="action text-blue" @tap="hideModal">取消</view>
        </view>
        <view class="padding-xl"><bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="fields"></bxform></view>
      </view>
    </view>
  </view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
export default {
  components: { bxform },
  data() {
    return {
      modalName: '',
      defaultAddress: {}, // 默认地址
      goodsList: [], //商品列表
      optionData: {}, //url参数
      orderData: {}, //订单信息
      isPayment: false,
      showAddress: false, //是否显示地址
      button: {
        payOrder: false, //支付订单
        placeOrder: false, //提交订单
        shippingGoods: false, //发货
        confirmGetGoods: false, //确认收货
        cancelOrder: false, //取消订单
        closeOrder: false //关闭订单
      },
      fromPath: '', //从哪个页面进入
      vipUserInfo: {},
      discount: 1,
      fields: [],
      type: 'add'
      // discountAmount:0,
    };
  },
  watch: {
    orderState: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log('orderState', newVal);
        return newVal;
      }
    },
    vipUserInfo: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log('computed-vipInfo', newVal);
        if (newVal.discount) {
          this.discount = newVal.discount;
          // this.getDiscountAmount(newVal.discount)
        }
        return newVal;
      }
    }
  },
  computed: {
    // vipUserInfo() {
    //   // 会员信息
    //   return this.$store.getters.getVipInfo;
    // },
    orderState() {
      console.log(this.orderData.state, this.orderData.receive_deliver_state, this.orderData.order_state);
      let orderState =
        this.orderData.state === '已付款' && this.orderData.order_state === '待发货'
          ? '待发货'
          : this.orderData.order_state === '待付款'
          ? '待付款'
          : this.orderData.order_state === '待收货'
          ? '待收货'
          : this.orderData.receive_deliver_state === '已收货'
          ? '已收货'
          : this.orderData.state === '退款中'
          ? '退款中'
          : this.orderData.state === '已退款'
          ? '已退款'
          : this.orderData.order_state === '已关闭'
          ? '已关闭'
          : '';
      return orderState;
    },
    discountAmount() {
      //优惠金额
      let discountAmount = 0;
      if (this.orderData.order_no) {
        discountAmount = parseFloat(this.orderData.goods_money - this.orderData.order_money).toFixed(2);
      } else {
        discountAmount = Number(this.totalPrice - this.discount * this.totalPrice).toFixed(2);
      }
      console.log(discountAmount, this.totalPrice, this.discount);
      return discountAmount.toString() === 'NaN' ? 0 : discountAmount;
    },
    totalPrice() {
      // 商品总金额
      let goodsList = this.goodsList;
      let price = 0;
      if (this.orderData.order_no) {
        price = this.orderData.goods_money;
      } else {
        goodsList.forEach(item => {
          if (!item.num) {
            item.num = 1;
          }
          if (item.current_price) {
            price += item.current_price * item.num;
          }
          // else if (item.discount_price) {
          //   price += item.discount_price * item.num;
          // }
        });
      }

      return parseFloat(price).toFixed(2);
    },
    actualPayment() {
      return this.orderData.order_money ? parseFloat(this.orderData.order_money).toFixed(2) : parseFloat(this.totalPrice - this.discountAmount).toFixed(2);
    }
  },
  methods: {
    hideModal(e) {
      this.modalName = null;
    },
    getDiscountAmount(discount) {
      let discountAmount = Number(this.totalPrice - discount * this.totalPrice).toFixed(2);
      console.log(discount, discountAmount, this.totalPrice);
      this.discountAmount = discountAmount;
    },
    clickGoodsItem(e) {
      uni.navigateTo({
        url: `/pages/specific/goodsDetail/goodsDetail?no=${e.goods_no}`
      });
      console.log('clickItem外部', e);
    },
    async getSignature(orderData) {
      // 获取调起微信支付所需签名
      if (orderData.prepay_id) {
        let url = this.getServiceUrl('wx', 'srvwx_app_pay_sign_select', 'select');
        let req = {
          serviceName: 'srvwx_app_pay_sign_select',
          colNames: ['*'],
          condition: [
            {
              colName: 'app_no',
              ruleType: 'eq',
              value: this.$api.appNo.wxh5
            },
            {
              colName: 'prepay_id',
              ruleType: 'eq',
              value: orderData.prepay_id
            }
          ]
        };
        let res = await this.$http.post(url, req);
        console.log(res);
        if (res.data.state === 'SUCCESS') {
          let data = res.data.data[0];
          return data;
        }
      }
    },
    async getGoodsInfo(goodsInfo) {
      uni.showLoading({
        title: '数据加载中...',
        mask: true
      });
      //购物车信息查询接口
      let self = this;
      let url = this.getServiceUrl('shop', 'srvshop_car_goods_select', 'select');
      let req = {
        serviceName: 'srvshop_car_goods_select',
        colNames: ['*']
      };
      let car_no = goodsInfo.car_no ? goodsInfo.car_no : '';
      if (car_no) {
        //从购物车跳转
        req.condition = [
          {
            colName: 'car_no',
            ruleType: 'in',
            value: car_no
          }
        ];
      }
      if (goodsInfo.goods_no) {
        //从商品详情跳转
        url = this.getServiceUrl('shop', 'srvshop_goods_select', 'select');
        req.serviceName = 'srvshop_goods_select';
        req.condition = [
          {
            colName: 'no',
            ruleType: 'eq',
            value: goodsInfo.goods_no
          }
        ];
      }
      if (goodsInfo.order_no || this.orderData.order_no) {
        //从订单列表跳转或提交订单后
        let orderData = goodsInfo.order_no ? goodsInfo : this.optionData.order_no ? this.optionData : this.orderData.order_no ? this.orderData : '';
        req.condition = [
          {
            colName: 'order_no',
            ruleType: 'eq',
            value: goodsInfo.order_no ? goodsInfo.order_no : this.optionData.order_no ? this.optionData.order_no : this.orderData.order_no ? this.orderData.order_no : ''
          }
        ];
        req.serviceName = 'srvshop_order_list';
        url = this.getServiceUrl('shop', 'srvshop_order_list', 'select');
      }

      let res = await this.$http.post(url, req);
      uni.hideLoading();
      if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
        this.goodsList = res.data.data;
        if (goodsInfo.order_no || this.orderData.order_no) {
          //从订单列表进来 调查询订单接口
          this.goodsList = res.data.data[0].order_goods;
          this.orderData = res.data.data[0];
          if (this.orderData.state === '已支付' || this.orderData.state === '已付款') {
            this.button.payOrder = false;
            this.button.cancelOrder = false;
          }
          if (this.orderData.state === '待付款') {
            this.button.payOrder = true;
            this.button.cancelOrder = true;
          }
          if (this.orderData.order_state === '待收货') {
            this.button.payOrder = false;
            this.button.cancelOrder = false;
            this.button.confirmGetGoods = true;
          }
          if (this.orderData.order_state === '已完成') {
            this.button.payOrder = false;
            this.button.cancelOrder = false;
            this.button.confirmGetGoods = false;
          }
          if (this.orderData.order_state === '已关闭') {
            this.button.payOrder = false;
            this.button.cancelOrder = false;
          }
        }
        this.goodsList.forEach((item, index) => {
          if (item.img) {
            self.getPictureUrl(item.img).then(url => {
              if (url) {
                item['imgUrl'] = url;
                self.$set(self.goodsList, index, item);
              }
            });
          }
        });
        return res.data.data.length === 1 ? res.data.data[0] : res.data.data;
      }
    },
    async getDefaultAddress(cond) {
      // 无cond参数时查找默认地址 有cond参数时condition值为cond
      uni.showLoading({
        mask: true
      });
      let url = this.getServiceUrl('vip', 'srvvip_shipping_address_auth_select', 'select');
      let req = {
        serviceName: 'srvvip_shipping_address_auth_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'is_default',
            ruleType: 'eq',
            value: '是'
          }
        ]
      };
      if (cond) {
        req.condition = cond;
      }
      let res = await this.$http.post(url, req);
      uni.hideLoading();
      if (res.data.state === 'SUCCESS') {
        console.log(res.data.data);
        if (res.data.data.length > 0) {
          this.defaultAddress = res.data.data[0];
          this.showAddress = true;
          return res.data.data[0];
        } else {
          //如果没有查到默认地址 则不显示地址 显示添加地址
          this.showAddress = false;
          return false;
        }
      } else {
        uni.showToast({
          title: res.data.resultMessage,
          icon: 'none'
        });
      }
    },
    payOrder() {
      // 拿到订单信息 调起微信支付
      console.log('正在调起支付接口');
      let orderData = this.orderData;
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
      } else {
        this.getSignature(orderData).then(datas => {
          this.onBridgeReady(datas);
        });
      }
    },
    async placeOrder() {
      // 提交(创建)订单
      if (!this.showAddress) {
        uni.showToast({
          title: '请选择或添加收货地址',
          icon: 'none'
        });
      } else {
        uni.showLoading({
          title: '订单提交中',
          mask: true
        });
        let order_goods = [];
        if (this.goodsList.length > 0) {
          order_goods = this.goodsList.map(item => {
            if (!item.goods_no && item.no) {
              return {
                car_no: item.car_no,
                goods_no: item.no,
                num: item.num
              };
            } else {
              return {
                car_no: item.car_no,
                goods_no: item.goods_no,
                num: item.num
              };
            }
          });
        }
        let url = this.getServiceUrl('shop', 'srvshop_order_add', 'add');
        url = this.getServiceUrl('shop', 'srvshop_order_create', 'add');
        let req = [
          {
            data: [
              {
                order_goods: order_goods,
                app_no: this.$api.appNo.wxh5,
                shop_no: this.goodsList[0].shop_no,
                remark: '请小心',
                addres_no: this.defaultAddress.addres_no
              }
            ],
            // serviceName: 'srvshop_order_add'
            serviceName: 'srvshop_order_create'
          }
        ];
        let res = await this.$http.post(url, req);
        uni.hideLoading();
        if (res.data.state === 'SUCCESS') {
          console.log(res.data);
          this.button.placeOrder = false;
          this.button.payOrder = true;
          let data = res.data.response.length > 0 ? res.data.response[0].response : null;
          if (data) {
            this.orderData = data;
            this.getGoodsInfo({ order_no: data.order_no }); //提交订单成功后 查找订单信息
            this.payOrder();
          } else {
            uni.showToast({
              title: '订单提交失败',
              icon: 'none'
            });
          }
        } else {
          uni.showToast({
            title: res.data.resultMessage
          });
        }
      }
    },
    async confirmGetGoods() {
      //确认收货 用户从订单列表进来由此权限
      console.log(this.orderData.order_no, this.orderData.state === '已付款', this.orderData.order_state === '待收货');
      if (this.orderData.order_no && this.orderData.state === '已付款' && this.orderData.order_state === '待收货') {
        uni.showLoading({
          mask: true
        });
        let url = this.getServiceUrl('shop', 'srvshop_order_take', 'operate');
        let req = [
          {
            serviceName: 'srvshop_order_take',
            data: [
              {
                order_no: this.orderData.order_no
              }
            ]
          }
        ];
        let res = await this.$http.post(url, req);
        if (res.data.state === 'success') {
          uni.showToast({
            title: '操作成功'
          });
          this.button.confirmGetGoods = false;
          this.getGoodsInfo(this.orderData);
        } else {
          uni.showToast({
            title: res.data.resultMessage,
            icon: 'none'
          });
        }
        uni.hideLoading();
      }
    },
    shippingGoods() {
      // 发货 只有商家从商家订单列表进入才有此权限
    },
    async getPictureUrl(file_no) {
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
            const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl + '&thumbnailType=' + this.$api.imgThumbnailType;
            return fileurl;
          }
        }
      }
    },
    async cancelOrder() {
      // 取消订单 用户从订单列表进来由此权限
      uni.showLoading({
        title: '正在取消订单...',
        mask: true
      });
      let orderData = this.orderData;
      let serviceNames = 'srvshop_order_cancel';
      let req = [
        {
          data: [
            {
              app_no: this.$api.appNo.wxh5,
              shop_no: orderData.shop_no,
              order_no: orderData.order_no
            }
          ],
          serviceName: serviceNames
        }
      ];
      let res = await this.onRequest('operate', serviceNames, req, 'shop');
      uni.hideLoading();
      if (res.data.resultCode === 'SUCCESS') {
        // this.getGoodsInfo()
        uni.showToast({
          title: '取消成功',
          duration: 1000
        });
      }
      this.getGoodsInfo(this.orderData);
      console.log('取消订单:', res);
    },
    async closeOrder() {
      // 关闭订单 只有商家从商家订单列表进入才有此权限
      // console.log('输入原因：',this.textareaAValue)
      uni.showLoading({
        title: '正在关闭订单',
        mask: true
      });
      let serviceNames = 'srvshop_order_refund';
      let req = [
        {
          data: [
            {
              app_no: 'APPNO20200107181133', //app编号
              wx_mch_id: uni.getStorageSync('shopNo'), //商户号
              order_no: this.orderData.order_no, //订单号
              refund_desc: '' //退款原因
            }
          ],
          serviceName: 'srvshop_order_refund'
        }
      ];
      let res = await this.onRequest('operate', serviceNames, req, 'shop');
      uni.hideLoading();
      if (res.data.resultCode === 'SUCCESS') {
        uni.showToast({
          title: '关闭成功',
          duration: 1000
        });
      } else {
        uni.showToast({
          title: res.data.resultMessage,
          icon: 'none'
        });
      }
      this.getGoodsInfo(this.orderData);
    },
    toChangeAddress() {
      // 修改地址
      if (this.optionData.order_no) {
        // 如果有订单编号(从订单列表进此页面),则不能修改地址
      } else {
        let str = '';
        console.log(this.optionData.goods_no);
        if (this.optionData.order_no) {
          str = '&order_no=' + this.optionData.order_no;
        } else if (this.optionData.goods_no) {
          str = '&goods_no=' + this.optionData.goods_no;
        } else if (this.optionData.car_no) {
          str = '&car_no=' + this.optionData.car_no;
        }
        uni.navigateTo({
          url: '/pages/specific/address/address?fromPath=' + this.fromPath + str
        });
      }
    },
    changeOrderState() {
      //提交订单后 修改订单状态

      let url = this.getServiceUrl('shop', 'srvshop_order_update_state', 'operate');
      let req = [
        {
          data: [
            {
              // app_no: this.$api.appNo.wxh5,
              shop_no: this.goodsList.length > 0 ? this.goodsList[0].shop_no : '1485038452', //店铺编号
              order_no: this.orderData.order_no
            }
          ],
          serviceName: 'srvshop_order_update_state'
        }
      ];
      this.$http.post(url, req).then(res => {
        console.log('订单状态', res.data.data);
        // uni.showModal({
        //   title: '订单状态',
        //   content: JSON.stringify(res.data),
        //   success() {}
        // });
      });
    },
    onBridgeReady(signData) {
      // 微信内H5调起支付
      let _this = this;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: signData.appId, //公众号名称，由商户传入
          timeStamp: signData.timeStamp.toString(), //时间戳，自1970年以来的秒数
          nonceStr: signData.nonceStr, //随机串
          package: 'prepay_id=' + _this.orderData.prepay_id,
          signType: signData.signType, //微信签名方式：
          paySign: signData.paySign //微信签名
        },
        function(res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            _this.isPayment = true;
            _this.getGoodsInfo({ order_no: _this.orderData.order_no }); //支付成功 查询订单信息
            _this.changeOrderState();
            uni.showToast({
              title: '支付成功',
              icon: 'none'
            });
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            // 支付过程中用户取消
            uni.showToast({
              title: '用户取消支付',
              icon: 'none'
            });
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            // 支付失败
            uni.showToast({
              title: '支付失败',
              icon: 'none'
            });
          } else {
            alert(JSON.stringify(res));
            console.error(res.err_msg);
          }
        }
      );
    }
  },
  onShow() {
    // let addressData = uni.getStorageSync('addressData');
    // if (addressData && addressData.addres) {
    //   this.defaultAddress = addressData;
    //   this.showAddress = true;
    // } else {
    //   this.showAddress = false;
    //   this.getDefaultAddress();
    // }
    this.vipUserInfo = this.$store.getters.getVipInfo;
  },
  onLoad(option) {
    this.vipUserInfo = this.$store.getters.getVipInfo;
    let optionData = {};
    if (option.fromPath) {
      this.fromPath = option.fromPath;
      optionData.fromPath = option.fromPath;
    }
    if (option.addres_no) {
      //从地址选择页面进来
      let cond = [
        {
          colName: 'addres_no',
          ruleType: 'in',
          value: option.addres_no
        }
      ];
      this.getDefaultAddress(cond);
    } else if (option.fromPath === 'goodsDetail' || option.fromPath === 'cart') {
      //从购物车或商品详情进入此页面 地址为默认地址
      this.getDefaultAddress();
    }
    if (option.goods_no && option.fromPath === 'goodsDetail') {
      // 从商品详情进来 提交订单页面 显示提交订单按钮 提交订单成功后调起微信支付 支付成功后隐藏提交订单按钮 显示确认收货按钮
      optionData['goods_no'] = decodeURIComponent(option.goods_no);
      this.button.placeOrder = true;
      this.getGoodsInfo(optionData);
    } else if (option.order_no && option.fromPath === 'payOrder') {
      // 从订单列表点击去支付进来 显示订单详情页面 并直接调起微信支付 显示支付按钮
      optionData['order_no'] = decodeURIComponent(option.order_no);
      this.button.payOrder = true;
      this.getGoodsInfo({ order_no: option.order_no }).then(data => {
        //查找订单信息
        console.log(data);
        let cond = [
          {
            colName: 'addres_no',
            ruleType: 'in',
            value: data.addres_no
          }
        ];
        this.getDefaultAddress(cond).then(() => {
          this.payOrder(); //调起微信支付
        });
      });
    } else if (option.order_no && option.fromPath === 'orderList') {
      // 从订单列表点击订单item进来 显示订单详情页面 显示取消订单按钮和支付按钮 待用户手动点击支付按钮调起微信支付
      optionData['order_no'] = decodeURIComponent(option.order_no);
      this.button.payOrder = true;
      this.button.cancelOrder = true;
      // this.getGoodsInfo(optionData);
      this.getGoodsInfo({ order_no: option.order_no }).then(data => {
        console.log(data);
        let cond = [
          {
            colName: 'addres_no',
            ruleType: 'in',
            value: data.addres_no
          }
        ];
        this.getDefaultAddress(cond).then(() => {
          // this.payOrder(); //调起微信支付
        });
      });
    } else if (option.car_no && option.fromPath === 'cart') {
      // 从购物车进来 提交订单页面 显示提交订单按钮 提交订单成功后调起微信支付 支付成功后隐藏提交订单按钮 显示确认收货按钮
      optionData['car_no'] = decodeURIComponent(option.car_no);
      this.button.placeOrder = true;
      this.getGoodsInfo(optionData);
    } else if (option.order_no && option.fromPath === 'merchantOrder') {
      // 从商家订单管理进来 显示取消订单按钮(待付款)||关闭订单按钮(支付成功待发货)和发货按钮
      optionData['order_no'] = decodeURIComponent(option.order_no);
      // this.button.placeOrder = true;
      this.getGoodsInfo({ order_no: option.order_no }).then(data => {
        console.log(data);
        let cond = [
          {
            colName: 'addres_no',
            ruleType: 'in',
            value: data.addres_no
          }
        ];
        if (data.state === '待付款') {
          this.button.cancelOrder = true;
        } else if (data.state === '已付款' && data.receive_deliver_state === '待发货') {
          // this.button.shipping = true;
          this.button.closeOrder = true;
        } else if (data.receive_deliver_state === '已发货') {
          // this.button.closeOrder = true;
        }
        this.getDefaultAddress(cond).then(() => {
          // this.payOrder(); //调起微信支付
        });
      });
      // this.getGoodsInfo(optionData);
    } else {
      return;
    }
    this.optionData = optionData;
    // this.getGoodsInfo(goodsInfo);
  }
};
</script>

<style lang="scss" scoped>
.orders_wrap {
  background-color: #f4f4f4;
  min-height: 100vh;
  margin-bottom: 100upx;
  padding: 1upx;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  position: relative;
  .order-status {
    width: 100%;
    height: 300upx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .order-status-item {
      line-height: 60upx;
      .status {
        font-size: 40upx;
        font-weight: 600;
      }
      .money {
        font-size: 40upx;
        font-weight: 600;
        // color: #ff0000;
      }
    }
  }
  .add_address {
    height: 100upx;
    line-height: 100upx;
    text-align: center;
    font-size: 36upx;
    color: #333;
    margin: 15upx 0;
    border-radius: 15upx;
    background-color: #fff;
  }
  .order_address {
    display: flex;
    font-size: 14upx;
    background-color: white;
    border-radius: 15upx;
    margin: 15upx 0;
    justify-content: space-between;
    .location {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 40upx;
    }
    .add_cen {
      display: flex;
      flex-direction: column;
      width: 75%;
      padding: 10upx 0;
      font-size: 28upx;
      text {
        margin: 5upx 0;
      }
      .address-box {
        display: flex;
        align-items: center;
        .address {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .detail-address {
        font-weight: 600;
        padding: 0 10upx;
        font-size: 32upx;
        // font-family: '微软雅黑';
      }
      .contact {
        padding-left: 10upx;
        text {
          padding-right: 10upx;
          &:last-child {
            color: #888;
          }
        }
      }
    }
    .arrows {
      display: flex;
      width: 10%;
      justify-content: center;
      align-items: center;
    }
  }
  .goods_wrap {
    background-color: #fff;
    padding-bottom: 20upx;
    color: #000;
    border-radius: 15upx;
    margin: 15upx 0;
    .goods_shop {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f4f4f4;
      margin: 10upx;
      padding: 10upx 0;
      .cuIcon-shop {
        font-size: 40upx;
        margin-right: 10upx;
      }
      .shop_name {
        font-weight: 600;
      }
    }
    .goods_list {
      display: flex;
      flex-direction: column;
      .shop {
        display: flex;
        border-bottom: 1px solid #f4f4f4;
        margin: 10upx 20upx;
        align-items: center;
        .goods_list_left {
          .goods-img {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            /* padding: 10px 0; */
            border-radius: 5px;
          }
        }
        .goods_list_rig {
          display: flex;
          flex-direction: column;
          flex: 1;
          .goods_top {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: 600;
          }
          .goods_cen {
            display: flex;
            margin: 10upx 0;
            // color: #666;
            font-size: 20upx;
            .spec_left {
              display: flex;
              align-items: center;
              background: #f7f7f7;
              padding: 8upx;
              .spec {
                margin-right: 8upx;
              }
            }
          }
          .goods_bot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10upx;
            .spec_num {
              display: flex;
              margin-left: 10upx;
              color: #999;
            }
            .spec_sprice {
              color: #e54d42;
            }
            .price {
              font-size: 36upx;
              // color: #333;
            }
          }
        }
      }
      .shop_figure {
        width: 80%;
        margin: 30upx auto;
        .shop_figure_con {
          display: flex;
          justify-content: space-around;
          padding: 10upx 0;
          border-bottom: 1px solid #f7f7f7;

          view {
            flex: 1;
            text-align: center;
            // text-align: left;
            &:last-child {
              text-align: left;
              display: flex;
              justify-content: center;
            }
          }
          &:last-child {
            // width: 80%;;
            text-align: right;
            view {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            // justify-content: center;
          }
          .total-price {
            font-size: 36upx;
            color: #e54d42;
          }
          .amount {
            color: #999;
            padding: 0 10upx;
            line-height: 40upx;
            display: inline-block;
          }
          .price {
            color: #e54d42;
          }
        }
      }
    }
  }

  .payment {
    width: 100%;
    background-color: white;
    display: flex;
    height: 100upx;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    .payment_left {
      display: flex;
      margin-left: 30upx;
      font-size: 32upx;
      .price {
        color: red;
        font-weight: 700;
        margin-left: 10upx;
      }
    }
    .button-box {
      display: flex;
      .payment_right {
        margin-right: 20upx;
        width: 150upx;
        display: flex;
        justify-content: center;
        font-size: 20upx;
        align-items: center;
        padding: 10upx 25upx;
        border-radius: 30upx;
        &.red {
          color: white;
          background-color: #f2270c;
          box-shadow: 0 6px 12px 0 rgba(255, 65, 66, 0.2);
          background-image: linear-gradient(135deg, #f2270c, #f2270c 70%, #f24d0c);
        }
        &.gray {
          color: #333;
          border: 1rpx #999 solid;
          background-color: #fff;
        }
      }
    }
  }
  .order-info {
    display: flex;
    flex-direction: column;
    border-radius: 15upx;
    background-color: #fff;
    margin: 15upx 0;
    min-height: 200upx;
    margin-bottom: 120upx;
    .title {
      height: 50upx;
      margin: 10upx;
      padding-left: 20upx;
      display: flex;
      align-items: center;
      color: #000;
      font-size: 26upx;
      position: relative;
      text {
        padding-left: 10upx;
        font-weight: 600;
        // border-left: 2px solid #e54d42;
      }
      &::before {
        // position: absolute;
        height: 26upx;
        content: '';
        border-left: 3px solid #e54d42;
      }
    }
    .info-list {
      color: #666666;
      font-size: 22upx;
      display: flex;
      padding-left: 30upx;
      .label {
        width: 30%;
        height: 50upx;
        // line-height: 40upx;
      }
      .value {
        flex: 1;
        text-indent: 10upx;
        height: 50upx;
        line-height: 40upx;
      }
    }
  }
}
</style>
