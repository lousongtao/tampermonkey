// ==UserScript==
// @name         Checkout51 offers
// @namespace    http://tampermonkey.net/
// @version      2024-10-28
// @description  打开checkout51时, 搜集网站的offer信息, 上传到DynamoDB
// @author       You
// @match        https://www.checkout51.com/account/offers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @connect      ca-central-1.amazonaws.com
// @run-at       document-idle

// ==/UserScript==

(function() {
    'use strict';

    console.log('Tamper script start...');

    // 1. 创建按钮
    const button = document.createElement('button');
    button.textContent = 'Collect Coupon'; // 按钮文字
    button.style.position = 'fixed'; // 固定位置
    button.style.bottom = '20px'; // 距离底部 20px
    button.style.right = '20px'; // 距离右边 20px
    button.style.zIndex = '9999'; // 保证按钮不被其他元素覆盖
    button.style.padding = '10px 20px'; // 按钮大小
    button.style.backgroundColor = '#007bff'; // 背景颜色
    button.style.color = 'white'; // 文字颜色
    button.style.border = 'none'; // 无边框
    button.style.borderRadius = '5px'; // 圆角
    button.style.cursor = 'pointer'; // 鼠标指针
    button.style.fontSize = '16px'; // 字体大小

    // 2. 将按钮添加到页面
    document.body.appendChild(button);

    // 3. 绑定点击事件
    button.addEventListener('click', () => {
        const listItem = document.querySelectorAll('li[data-name]');
        const offers = Array.from(listItem)
                 .filter(item => item.getAttribute('data-section') != null && item.getAttribute('data-section').length > 0)
                 .map(item => {
                     const name = item.getAttribute('data-name');
                     const price = item.querySelector('span.amount');
                     return name + price.textContent.trim();
                 });
        console.log('get offers: ' + offers);
    });

})();