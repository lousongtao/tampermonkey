// ==UserScript==
// @name         Highlight Applied Companies - V2
// @namespace    http://tampermonkey.net/
// @version      2024-10-28
// @description  在DynamoDB中记录曾经申请过的公司(非职位). 当打开Linkedin搜索职位时, 把已经投递过的公司高亮显示, 避免重复投递. 对于不满足要求的职位(主要是要求语言非java的), 使用红色标记, 减少查看Job Description的时间.
// @author       You
// @match        https://www.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @connect      ca-central-1.amazonaws.com
// @run-at       document-idle

// ==/UserScript==

(function() {
    'use strict';

    console.log('Tamper script start...');

    // 使用 Promise 封装 GM_xmlhttpRequest
    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    resolve(JSON.parse(response.responseText));
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 定义API端点，这里用假设的API URL
    const apiUrl_applied = 'https://yjnmx3q01d.execute-api.ca-central-1.amazonaws.com/1/applied';
    const apiUrl_exclude = 'https://yjnmx3q01d.execute-api.ca-central-1.amazonaws.com/1/exclude';

    // 并行请求两个 API
    Promise.all([fetchData(apiUrl_applied), fetchData(apiUrl_exclude)])
        .then(([respApplied, respExclude]) => {
            const observer = new MutationObserver(throttle(() => {
                        const companyNodes = document.querySelectorAll('.scaffold-layout__list-container .jobs-search-results__list-item .job-card-container__primary-description');
                        if (companyNodes.length > 0) {
                            console.log('companyNodes.length = ' + companyNodes.length);
                            // 遍历页面内容，查找并高亮匹配内容
                            highlightMatchingContent(respApplied, companyNodes, "yellow");
                            highlightMatchingContent(respExclude, companyNodes, "red");
                        }
                    }, 500)); //500ms的间隔观察窗口
            // 观察整个文档的变动
            observer.observe(document.body, { childList: true, subtree: true });
        })
        .catch(error => console.error("API 请求失败:", error));

    

    // 高亮匹配内容
    function highlightMatchingContent(companies, companyNodes, color) {
        console.log('color: ' + color + ', highlight companies = ' + JSON.stringify(companies));

        // 遍历每个值，检查页面是否包含该值
        companies.forEach(value => {
            // 使用正则表达式全局匹配
            const regex = new RegExp(`(${value})`, 'gi');
            companyNodes.forEach(item => {
                if (regex.test(item.textContent)) {
                    item.innerHTML = item.textContent.replace(regex, '<span style="background-color: ' + color + ';">$1</span>');
                }
            });
        });
    };

    // 节流函数，用于限制高亮触发频率
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall >= delay) {
                lastCall = now;
                return func(...args);
            }
        };
    }
})();