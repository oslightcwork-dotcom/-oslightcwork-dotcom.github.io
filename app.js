const API_URL =
"https://script.google.com/macros/s/AKfycbznyJFN6LMABOyuGWZRSEcPdSbsAz-bcNz_yWckujfNxWqJPYReBFH-necqwqPPE1Bj/exec";



let currentData = null;

let memberMap = {};



// =====================================
// 預載全部名單
// =====================================

function loadMembers(){

  showSuccess("載入名單中...");

  const script =
  document.createElement("script");

  script.src =
    API_URL +
    "?action=getMembers" +
    "&callback=handleMembers";

  document.body.appendChild(script);

}



// =====================================
// 名單回傳
// =====================================

window.handleMembers = function(data){

  memberMap = data || {};

  showSuccess("名單載入完成");

};



// 啟動載入
loadMembers();



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

  const data =
  memberMap[number];



  if(data){

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



    const btn =
    document.getElementById("checkinBtn");



    if(data.status === "已報到"){

      btn.disabled = true;

      btn.innerHTML = "已報到";

    }else{

      btn.disabled = false;

      btn.innerHTML = "確認報到";

    }

    showSuccess("查詢完成");

  }else{

    resetData();

    showError("查無資料");

  }

}



// =====================================
// 確認報到
// =====================================

function checkin(){

  if(!currentData){

    showError("請先查詢資料");

    return;

  }

  const btn =
  document.getElementById("checkinBtn");

  btn.disabled = true;

  btn.innerHTML = "處理中...";



  const script =
  document.createElement("script");

  script.src =
    API_URL +
    "?action=checkin" +
    "&number=" +
    encodeURIComponent(currentData.number) +
    "&name=" +
    encodeURIComponent(currentData.name) +
    "&group=" +
    encodeURIComponent(currentData.group) +
    "&callback=handleCheckin";

  document.body.appendChild(script);

}



// =====================================
// 報到回傳
// =====================================

window.handleCheckin = function(data){

  const btn =
  document.getElementById("checkinBtn");



  // 已重複報到
  if(data.duplicate){

    document
    .getElementById("showStatus")
    .innerHTML =
    "狀態：已報到";



    memberMap[currentData.number].status =
    "已報到";



    btn.disabled = true;

    btn.innerHTML = "已報到";



    showError("此分機已完成報到");

    return;

  }



  // 正常成功
  if(data.success){

    document
    .getElementById("showSerial")
    .innerHTML =
    "查詢序號：" + data.serialNumber;

    document
    .getElementById("showStatus")
    .innerHTML =
    "狀態：已報到";



    // 更新本地狀態
    memberMap[currentData.number].status =
    "已報到";



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