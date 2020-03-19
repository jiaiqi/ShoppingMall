<template>
  <view>
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
      <!-- <block slot="backText">返回</block> -->
      <block slot="content" v-if="colsV2Data !== null && colsV2Data.service_view_name">{{ colsV2Data.service_view_name }}</block>
    </cu-custom>
    <bxform ref="bxForm" :pageType="type" :BxformType="type" :fields="fields"></bxform>
    <bxButtons v-if="type !== 'detail'" :buttons="buttons" @on-button-change="onButton($event)"></bxButtons>
  </view>
</template>

<script>
import bxform from '@/components/bx-form/bx-form.vue';
import bxButtons from '@/components/bx-buttons/bx-buttons.vue';
export default {
  components: { bxform, bxButtons },
  props: {
    // serviceName:{
    // 	type:String,
    // 	default() {
    // 		return '';
    // 	}
    // },
    // type:{
    // 	type:String,
    // 	default(){
    // 		return ''; // add || update || detail
    // 	}
    // },
    // loadedType:{
    // 	type:String,
    // 	default(){
    // 		return "srvV2"; // srvV2 : 加载 serviceName v2 配置数据。
    // 	}
    // }
  },
  data() {
    return {
      fields: [],
      loadedType: 'srvV2',
      colsV2Data: null,
      type: '',
      serviceName: '',
      condition: [],
      defaultCondition: [],
      params: {}
    };
  },
  created() {
  	uni.showLoading({
  		mask:true
  	})
  },
  computed: {
    buttons: function() {
      return this.colsV2Data !== null && this.colsV2Data._formButtons ? this.colsV2Data._formButtons : [];
    }
  },
  onLoad(option) {
    // this.fields = this.$tapi.json('configCols')
    // let option = {
    // 	"type":"update",
    // 	"condition":[{
    // 		"colName": "id",
    // 		"ruleType": "in",
    // 		"value": e.id
    // 	}],
    // 	"serviceName":"srvshop_goods_update",
    // 	"defaultVal":null
    // }
    //999
    if (option.params) {
      this.params = JSON.parse(option.params);
    }
    if (option.hasOwnProperty('loadedType')) {
      this.loadedType = option.loadedType;
    } else if (option.hasOwnProperty('params')) {
      this.serviceName = this.params.serviceName;
      this.type = this.params.type;
      this.condition = this.params.condition;
      this.defaultVal = this.params.defaultVal;
      this.getFieldsV2();
    } else if (option.serviceName && option.type) {
      this.serviceName = option.serviceName;
      this.type = option.type;
      this.getFieldsV2();
    } else {
      uni.showToast({
        title: '加载错误'
      });
    }
  },

  methods: {
    getFieldsV2: async function() {
		let self = this
      let colVs = await this.getServiceV2(this.serviceName, this.type, this.type);
      this.colsV2Data = colVs;
      switch (this.type) {
        case 'update':
			// 处理是否url是否传默认值
			if(this.isInvalid(this.defaultVal)){
				console.log("isInvalid")
				self.fields = self.setFieldsDefaultVal(colVs._fieldInfo, this.defaultVal);
			}else{
				console.log("no isInvalid")
				let reqs = {
					"colNames": ["*"],
					"condition": this.condition,
					"serviceName": self.colsV2Data.select_service_name,
				}
				let values  = null
				  self.onRequest("select", self.colsV2Data.select_service_name, reqs, "shop").then((res) =>{
					  if(res.data.state === "SUCCESS" && res.data.data.length > 0){
						  values = res.data.data[0]
						  console.log("onRequest")
						  self.fields = self.setFieldsDefaultVal(colVs._fieldInfo, values);
						 
					  }
				  })
			}
          break;
        case 'add':
			if(this.isInvalid(this.defaultVal)){
				console.log("isInvalid")
				self.fields = self.setFieldsDefaultVal(colVs._fieldInfo, this.defaultVal);
			}else{
				self.fields = colVs._fieldInfo;
			}
          
          break;
        case 'detail':
          this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, this.params.defaultVal);
          break;
        default:
          break;
      }
	  uni.hideLoading()
    },
    async onButton(e) {
      let req = this.$refs.bxForm.getFieldModel();
      console.log(e,req);
      switch (e.button_type) {
        case 'edit':
          if (e.page_type === '详情') {
            // this.
          } else {
            if (req) {
              req = [{ serviceName: e.service_name, data: [req], condition: this.condition }];
              let app = uni.getStorageSync('activeApp');
              this.onRequest('update', e.service_name, req).then(res => {
                console.log('res:' + e.service_name, res);
                if (res.data.state === 'SUCCESS') {
                  let resData = this.getResData(res.data.response);
                  console.log('resData', resData);
                  uni.navigateBack();
                  // this.onButtonToUrl({
                  // 	button:{
                  // 		button_type:"select"
                  // 	},
                  // 	row:resData
                  // })
                }
              });
            }
          }

          break;
        case 'submit':
          if (req) {
            req = [{ serviceName: e.service_name, data: [req] }];
			if (req) {
			  let app = uni.getStorageSync('activeApp');
			  this.onRequest('add', e.service_name, req).then(res => {
			    console.log('res:' + e.service_name, res);
			    if (res.data.state === 'SUCCESS') {
			      let resData = this.getResData(res.data.response);
			      console.log('resData', resData);
			      uni.navigateBack();
			      // this.onButtonToUrl({
			      // 	button:{
			      // 		button_type:"select"
			      // 	},
			      // 	row:resData
			      // })
			    }
			  });
			}
			
          }
          break;
        case 'reset':
          this.$refs.bxForm.onReset().then(res => {
            if (res) {
              uni.showToast({
                title: '已重置'
              });
            } else {
              uni.showToast({
                title: '无效操作'
              });
            }
          });
          break;
        default:
          uni.showToast({
            title: e.button_name
          });
          break;
      }
    }
  }
};
</script>

<style></style>
