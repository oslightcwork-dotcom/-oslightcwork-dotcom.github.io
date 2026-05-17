const API_URL =
"https://script.google.com/macros/s/AKfycbznyJFN6LMABOyuGWZRSEcPdSbsAz-bcNz_yWckujfNxWqJPYReBFH-necqwqPPE1Bj/exec";



let currentData = null;



// =====================================
// Enter 查詢
// =====================================

document
.getElementById("number")
.addEventListener("keypress",(e)=>{

  if(e.key === "Enter"){

    searchData();

  }

});



// =====================================
// 查詢
// =====================================

function searchData(){

  const number =
  document
  .getElementById("number")
  .value
  .trim();

  clearMessage();

  if(!number){

    showError("請輸入分機");

    return;

  }

  // 查詢中
  showSuccess("查詢中...");

  // 清除舊JSONP
  const oldScript =
  document.getElementById("jsonp");

  if(oldScript){

    oldScript.remove();

  }

  // 建立JSONP
  const script =
  document.createElement("script");

  script.id = "jsonp";

  script.src =
    API_URL +
    "?action=search" +
    "&number=" +
    encodeURIComponent(number) +
    "&t=" +
    Date.now() +
    "&callback=handleResponse";

  document.body.appendChild(script);

}



// =====================================
// 查詢回傳
// =====================================

window.handleResponse = function(data){

  console.log("查詢結果:",data);

  if(data.success){

    currentData = data;

    document
    .getElementById("showSerial")
    .innerHTML =
    "查詢序號：";

    document
    .getElementById("showNumber")
    .innerHTML =
    "編號：" + data.number;

    document
    .getElementById("showName")
    .innerHTML =
    "姓名：" + data.name;

    document
    .getElementById("showGroup")
    .innerHTML =
    "組別：" + data.group;

    document
    .getElementById("showStatus")
    .innerHTML =
    "狀態：" + data.status;



    // =====================================
    // 按鈕控制
    // =====================================

    const btn =
    document.getElementById("checkinBtn");



    // 已報到
    if(data.status === "已報到"){

      btn.disabled = true;

      btn.innerHTML = "已報到";

    }else{

      // 未報到
      btn.disabled = false;

      btn.innerHTML = "確認報到";

    }

    showSuccess("查詢完成");

  }else{

    resetData();

    showError("查無資料");

  }

};



// =====================================
// 確認報到
// =====================================

function checkin(){

  if(!currentData){

    showError("請先查詢資料");

    return;

  }

  // 鎖定按鈕避免連點
  const btn =
  document.getElementById("checkinBtn");

  btn.disabled = true;

  btn.innerHTML = "處理中...";

  // 清除舊JSONP
  const oldScript =
  document.getElementById("jsonpCheckin");

  if(oldScript){

    oldScript.remove();

  }

  // 建立JSONP
  const script =
  document.createElement("script");

  script.id = "jsonpCheckin";

  script.src =
    API_URL +
    "?action=checkin" +
    "&number=" +
    encodeURIComponent(currentData.number) +
    "&name=" +
    encodeURIComponent(currentData.name) +
    "&group=" +
    encodeURIComponent(currentData.group) +
    "&t=" +
    Date.now() +
    "&callback=handleCheckin";

  document.body.appendChild(script);

}



// =====================================
// 報到回傳
// =====================================

window.handleCheckin = function(data){

  console.log("報到結果:",data);

  const btn =
  document.getElementById("checkinBtn");

  if(data.success){

    // 顯示流水號
    document
    .getElementById("showSerial")
    .innerHTML =
    "查詢序號：" + data.serialNumber;

    // 顯示已報到
    document
    .getElementById("showStatus")
    .innerHTML =
    "狀態：已報到";

    // 鎖定按鈕
    btn.disabled = true;

    btn.innerHTML = "已報到";

    showSuccess("報到完成");

  }else{

    btn.disabled = false;

    btn.innerHTML = "確認報到";

    showError("報到失敗");

  }

};



// =====================================
// 修正
// =====================================

function resetForm(){

  document
  .getElementById("number")
  .value = "";

  currentData = null;

  resetData();

  clearMessage();

  // 鎖定按鈕
  const btn =
  document.getElementById("checkinBtn");

  btn.disabled = true;

  btn.innerHTML = "確認報到";

}



// =====================================
// 清空資料
// =====================================

function resetData(){

  document
  .getElementById("showSerial")
  .innerHTML =
  "查詢序號：";

  document
  .getElementById("showNumber")
  .innerHTML =
  "編號：";

  document
  .getElementById("showName")
  .innerHTML =
  "姓名：";

  document
  .getElementById("showGroup")
  .innerHTML =
  "組別：";

  document
  .getElementById("showStatus")
  .innerHTML =
  "狀態：";

}



// =====================================
// 成功訊息
// =====================================

function showSuccess(text){

  const msg =
  document.getElementById("msg");

  msg.className = "msg";

  msg.innerHTML = text;

}



// =====================================
// 錯誤訊息
// =====================================

function showError(text){

  const msg =
  document.getElementById("msg");

  msg.className = "msg error";

  msg.innerHTML = text;

}



// =====================================
// 清除訊息
// =====================================

function clearMessage(){

  const msg =
  document.getElementById("msg");

  msg.className = "msg";

  msg.innerHTML = "";

}