// ==UserScript==
// @name         Real Canadian Superstore offers
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  
// @author       You
// @match        https://www.pcoptimum.ca/offers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pcoptimum.ca
// @grant        GM_xmlhttpRequest
// @connect      ca-central-1.amazonaws.com
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 1. 创建按钮
    const button = document.createElement('button');
    button.textContent = 'Collect Offers'; // 按钮文字
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
    //PC 的offer情况太多, 没有固定格式, 这里把容易抓的抓到, 把遗漏的以注释的方式标注
    //1. 页面开头的几个并排的offer没有抓取到.
    //2. 其他的offers-section都没有找到,
    button.addEventListener('click', () => {
        const listItem = document.querySelectorAll('.offers-container > .offers-section');
        const offerSections = Array.from(listItem)
                 .map(item => {
                     const offerNodes = item.querySelectorAll("ol>li");
                     const offers = Array.from(offerNodes).map(on => {
                         const reward = on.querySelector(".offer-section__inner .offer__reward").textContent;
                         const name = on.querySelector(".offer-section__inner .offer__text > div").textContent;
                         console.log(name + " " + reward);
                     });

                 });

    });
})();