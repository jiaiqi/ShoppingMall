export default {
  install(Vue, options) {
    Vue.prototype.getShopInfo = async function() {
      let reqs = {
        "serviceName": "srvshop_reg_select",
        "colNames": ["*"],
        "condition": [{
          "colName": "no",
          "ruleType": "eq",
          "value": uni.getStorageSync("shopNo")
        }]
      }
      return this.onRequest("select", "srvshop_reg_select", reqs, "shop")
    }
    /** 获取分类数量*/
    Vue.prototype.getClassify = async function(serviceName, cols, cond, srvApp) {
      if (!cond) {
        cond = []
      }
      let reqs = {
        "serviceName": serviceName,
        "colNames": ["*"],
        "condition": cond,
        "group": [{
          "colName": cols,
          "type": "by"
        }, {
          "colName": "id",
          "type": "count"
        }]
      }
      let app = 'shop'
      if (srvApp) {
        app = srvApp
      }
      let res = await this.onRequest("select", serviceName, reqs, app)
      return res.data.data
    }
    /** 获取购物车商品总数*/
    Vue.prototype.getCarGoodsNum = async function() {
      let user_no = uni.getStorageSync('login_user_info').user_no
      let cond = []
      let reqs = {
        "serviceName": "srvshop_car_goods_select",
        "colNames": ["*"],
        "condition": cond,
      }
      let res = await this.onRequest("select", "srvshop_car_goods_select", reqs, "shop")
      return res.data.data.length
    }
    /**
     * 查询会员信息
     * */
    Vue.prototype.getVipInfo = async function(e) {
        let userNo = e || null
        // https://srvms.100xsys.cn/vip/select/srvvip_member_benefits_select
        let reqs = {
          "serviceName": "srvvip_member_benefits_select",
          "colNames": [
            "*"
          ],
          "condition": [{
              "colName": "user_no",
              "ruleType": "eq",
              "value": userNo
            },
            {
              "colName": "shop_no",
              "ruleType": "eq",
              "value": uni.getStorageSync("shopNo")
            }
          ],
          "page": {
            "pageNo": 1,
            "rownumber": 10
          }
        }
        return this.onRequest("select", "srvvip_member_benefits_select", reqs, "vip")
      },
      Vue.prototype.getvipDiscount = function(e) {
        let value = (Math.floor(e * 100)) / 10
        var num = value.toString().split(".");
        if (num.length == 1) {
          value = value.toString() + ".00";
          return value;
        }
        if (num.length > 1) {
          if (num[1].length < 2) {
            value = value.toString() + "0";
          }
          return value;
        }

      },
      /**
       * 新用户添加到会员表
       */
      Vue.prototype.addToVipList = async function(e) {
        // {
        //   name:wxUserInfo.nickname,
        //   mobile:wxUserInfo.mobile,
        //   headimgurl:wxUserInfo.headimgurl,
        //   user_no: user_no,
        //   up_user_no: up_user_no
        // };
        console.log('addVip:',e)
        let req = [{
          "serviceName": "srvvip_member_up_add",
          "data": [{
            "name":e.nickname,
            "headimgurl":e.headimgurl,
            "mobile":e.mobile,
            "user_no": e.user_no, //用户编号 （必填）
            "up_user_no": e.up_user_no, //上级用户编号
            "join_type": "扫码加入", //'普通加入','链接加入','扫码加入'
            "shop_no": "1485038452", //店铺编号
          }]
        }]
        let cond = []
        let res = await this.onRequest("operate", "srvvip_member_up_add", req, "vip")
        if (res.data.state === "SUCCESS") {
          return res.data.data
        } else {
          // uni.showToast({
          //   title: res.data.resultMessage,
          //   icon: 'none'
          // })
          // alert(JSON.stringify(res.data))
        }
      }
  }
}
