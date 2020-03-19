**H5微信环境调起微信支付**
## 请求参数
```
{
  appId:'',
  timeStamp:'',
  nonceStr:'',
  package:'', // 统一下单接口返回的prepay_id参数值，提交格式如：prepay_id=***
  signType:'MD5',
  paySign:''
}
```