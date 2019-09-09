import wx from "weixin-js-sdk";

export function configWXDevice(appId, timestamp, nonceStr, signature, deviceId, ticketCallBack) {
  wx.config({
    beta: true, // 开启内测接口调用，注入wx.invoke方法
    debug: false,
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
      'openWXDeviceLib',
      'getWXDeviceTicket',
      // 'onMenuShareAppMessage',
    ]
  });

  wx.ready(function () {
    // wx.invoke("openWXDeviceLib", {}, res => {

    // });
    // wx.invoke('getWXDeviceTicket', {
    //   "deviceId": deviceId,
    //   "type": 1
    // }, res => {
    //   ticketCallBack(res);
    // });
  });

  wx.error(res => {
    this.$toast("config失败, err_msg:" + res.err_msg);
  });
}
