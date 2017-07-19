function loadXMLDoc() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", "/latest_msg", true);
    xmlhttp.send();
}
// loadXMLDoc()
function myrefresh() {
    window.location.reload();
}
setTimeout('myrefresh()', 60000); //指定刷新间隔
window.onload = notify;
function notify(msg) {
    new_msg = $('#my-data').data();
    if (new_msg !== '') {
        showMsgNotification('新的日志', new_msg);
    }
}
function showMsgNotification(title, msg, icon) {
    var options = {
        body: msg,
        icon: icon || "image_url"
    };
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (Notification && Notification.permission === "granted") {
        var instance = new Notification(title, options);
        instance.onclick = function () {
            // Something to do
        };
        instance.onerror = function () {
            // Something to do
        };
        instance.onshow = function () {
            // Something to do
            //                          setTimeout(instance.close, 3000);
            setTimeout(function () {
                instance.close();
            }, 5000);
            // console.log(instance.body)
        };
        instance.onclose = function () {
            // Something to do
        };
        // console.log(instance)
    }
    else if (Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            // If the user said okay
            if (status === "granted") {
                var instance = new Notification(title, options);
                instance.onclick = function () {
                    // Something to do
                };
                instance.onerror = function () {
                    // Something to do
                };
                instance.onshow = function () {
                    // Something to do
                    setTimeout(instance.close, 3000);
                };
                instance.onclose = function () {
                    // Something to do
                };
            }
            else {
                return false;
            }
        });
    }
    else {
        return false;
    }
}
