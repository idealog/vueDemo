import axios from 'axios'
let HOST;
if (process.env.NODE_ENV === 'development') {
  HOST = '/data_api/api/v1/';
} else {
  HOST = 'https://www.cocheer.net/qmh_test/api/v1/'; //愤怒的小鸟公众号后台服务
}

export const api = (url, data, method = "GET") => {
  url = HOST + url;
  switch (method) {
    case "POST":
    case "PUT":
    case "DELETE":
      return axios({
        url,
        data,
        method
      });
      break;
    case "GET":
      return axios({
        url,
        params: data,
        method
      });
      break;
  }
}
