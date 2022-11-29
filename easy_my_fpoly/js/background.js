chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message === "checked-website") {
        sendResponse({
            message: "checked-website",
            status: true
        });
        return;
    }
    if (message === "website") {
        let data = [
            {
                "description": "Tiện ích trợ giúp trên hệ thống của trường cao đẳng FPT Polytechnic!",
                "enabled": true,
                "homepageUrl": "https://chrome.google.com/webstore/detail/egdjlajabpmjcokbpadibkcchopdaofn",
                "hostPermissions": [
                    "*://*.poly.edu.vn/*"
                ],
                "icons": [
                    {
                        "size": 128,
                        "url": "chrome://extension-icon/egdjlajabpmjcokbpadibkcchopdaofn/128/0"
                    }
                ],
                "id": "egdjlajabpmjcokbpadibkcchopdaofn",
                "installType": "normal",
                "isApp": false,
                "mayDisable": true,
                "name": "My Fpoly Extension",
                "offlineEnabled": false,
                "optionsUrl": "",
                "permissions": [
                    "management",
                    "storage"
                ],
                "shortName": "My Fpoly Extension",
                "type": "extension",
                "updateUrl": "https://clients2.google.com/service/update2/crx",
                "version": "1.0.4"
            }
        ];
        sendResponse({
            status: true,
            data
        });
        return;
    }

    if (message === "verified") {
        chrome.storage.sync.get("verified", function(i) {
            i.verified == null ?
                sendResponse({
                    message: "verified",
                    text: "not-verified",
                    status: false
                }) :
                sendResponse({
                    message: "verified",
                    text: i.verified,
                    status: true
                });
        });
    }

    const { text, msg } = message;

    if (msg === "verified-website") {
        chrome.storage.sync.set({
            verified: text
        }, function() {
            sendResponse({
                message: "verified-website",
                text,
                status: true
            });
        });
    }
});
