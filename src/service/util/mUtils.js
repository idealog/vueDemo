/**
 * 将数组处理为“周一至周日”这样的字段
 * @param {Array} arr 用于处理的数组，[0, 1, 4, 5, 6];
 */
export const showWeekDays = arr => {
  if (!arr) {
    return;
  }
  arr = initArr(arr);
  let newArr = arrange(arr);

  const weekDay = [
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
    "周日"
  ];

  let data = [];
  for (let i = 0; i < newArr.length; i++) {
    const item = newArr[i];
    if (item.length < 2) {
      data.push(weekDay[item[0] - 1]);
    } else {
      let _str = weekDay[item[0] - 1] + "至" + weekDay[item[item.length - 1] - 1];
      data.push(_str);
    }
  }
  let result = data.join(', ');
  return result;
}

/**
 * 将一维数组转化为二维数组，并将连续的数字放在一起
 * @param {Array} arr 初始数组, [1,2,4,5,7]
 * @return [[1, 2], [4, 5], [7]]
 */
function arrange(arr) {
  var result = [],
    i = 0;
  result[i] = [arr[0]];
  arr.reduce(function (prev, cur) {
    cur - prev === 1 ? result[i].push(cur) : result[++i] = [cur];
    return cur;
  });
  return result;
}

function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 > value2) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * 将初始字符串转化为数组并按升序排列
 * @param {String} date 
 */
export const initArr = (date) => {
  date = date.split(",");

  let newArr = date.map(item => {
    if (item == "0") {
      item = 7
    }
    return parseInt(item);
  })

  return newArr.sort(compare);
}

/**
 * 计算一周第i天的日期
 * @param {Number} i i从0到6，对应周一到周日
 * @returns {String} "10-12"
 */
export const getWeek = (i) => {
  const now = new Date();
  const firstDay = new Date(now - (now.getDay() - 1) * 86400000);
  firstDay.setDate(firstDay.getDate() + i);
  const mon = Number(firstDay.getMonth()) + 1;
  return mon + "-" + firstDay.getDate();
}

/**
 * 将原始数组转化为字符串 '周一，周二'，便于显示
 * @param {Array} weekArr 从服务器获取的原始数据 [1,2,3]
 * @returns '周一，周二'
 */
export const transformArrToWeek = weekArr => {
  let arr = [];
  for (let i = 0; i < weekArr.length; i++) {
    const week = weekArr[i];
    switch (week) {
      case "1":
        arr[i] = "周一";
        break;
      case "2":
        arr[i] = "周二";
        break;
      case "3":
        arr[i] = "周三";
        break;
      case "4":
        arr[i] = "周四";
        break;
      case "5":
        arr[i] = "周五";
        break;
      case "6":
        arr[i] = "周六";
        break;
      case "0":
        arr[i] = "周日";
        break;
    }
  }
  return arr.join("，");
}

/**
 * 转化重复周期为易于处理的数组
 * @param {String} str 用户输入的原始字符串 '周一，周二'
 * @returns [1, 2]
 */
export const transformWeekToArr = str => {
  const weekArr = str.split("，");
  for (let i = 0; i < weekArr.length; i++) {
    const week = weekArr[i];
    switch (week) {
      case "周一":
        weekArr[i] = 1;
        break;
      case "周二":
        weekArr[i] = 2;
        break;
      case "周三":
        weekArr[i] = 3;
        break;
      case "周四":
        weekArr[i] = 4;
        break;
      case "周五":
        weekArr[i] = 5;
        break;
      case "周六":
        weekArr[i] = 6;
        break;
      case "周日":
        weekArr[i] = 0;
        break;
      default:
        weekArr.splice(0, 1); //如果没有选择，数组应该为空
        break;
    }
  }
  return weekArr;
}

/**
 * 将秒转换为 分:秒
 * @param {int} s int 秒数
 */
export const secondToMin = s => {
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  var h;
  h = Math.floor(s / 60);
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = s % 60;
  //将变量转换为字符串
  h += '';
  s += '';
  //如果只有一位数，前面增加一个0
  h = (h.length == 1) ? '0' + h : h;
  s = (s.length == 1) ? '0' + s : s;
  return h + ':' + s;
}
