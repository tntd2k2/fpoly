const apiUrl = "https://api.quizpoly.xyz",
    redirect_uri = "https://api.quizpoly.xyz/auth/google";
let adsLinks = ["http://1shorten.com/quizpoly", "http://1shorten.com/quizpoly", "https://link1s.com/quizpoly-level1"],
    subjectsGet = [];
const premiumUser = {
    email: 'dev.tntd2k2@gmail.com',
    id: 'dev.tntd2k2',
    name: 'Cracked by dev.tntd2k2 with ❤️',
    premium: {
        expDate: '2100-12-31T00:00:00.000Z',
        iatDate: '2022-01-31T00:00:00.000Z',
        isGift: false,
        plan: 'Premium'
    },
    studentCode: 'dev.tntd2k2',
    userType: 'Premium'
}
function createAuthEndpoint() {
    var e = "https://accounts.google.com/o/oauth2/auth?",
        t = {
            client_id: "342297410923-sjcdrqban80srbpcekc24ctrdqh3u593.apps.googleusercontent.com",
            redirect_uri: redirect_uri,
            response_type: "code",
            access_type: "offline",
            scope: "profile email",
            prompt: "consent"
        };
    let o = new URLSearchParams(Object.entries(t));
    return o.toString(), e += o
}
async function finishQuiz(t) {
    console.debug(t);
    const {
        subjectName: o,
        domain: n,
        quizId: s,
        passTime: e
    } = t;
    if (!o) return chrome.cookies.get({
        url: n,
        name: "PHPSESSID"
    }, e => {
        sendHtml(`finishQuiz subjectName null: ${JSON.stringify(t)} - cookie: ${e.value}`, "NULL")
    });
    getPoint(s, n, e, async ({
        quizzes: e
    }) => {
        e && e.length ? (console.debug(e), sendDoingQuiz({
            subjectName: o,
            quizzes: e
        })) : subjectsGet.includes(o.toLowerCase()) && (100 == (e = await getPercent(n, s)) ? sendDoingQuiz({
            subjectName: `${o} - 100`,
            quizzes: Object.values(quizSelf)
        }) : 90 < e ? chrome.storage.local.get(["quizSelf"], ({
            quizSelf: e
        }) => {
            sendDoingQuiz({
                subjectName: `${o} - draft 90`,
                quizzes: Object.values(e)
            })
        }) : 80 < e ? chrome.storage.local.get(["quizSelf"], ({
            quizSelf: e
        }) => {
            sendDoingQuiz({
                subjectName: `${o} - draft 80`,
                quizzes: Object.values(e)
            })
        }) : 70 < e && chrome.storage.local.get(["quizSelf"], ({
            quizSelf: e
        }) => {
            sendDoingQuiz({
                subjectName: `${o} - draft`,
                quizzes: Object.values(e)
            })
        })), chrome.storage.local.set({
            quizSelf: {}
        })
    })
}
async function sendDoingQuiz(e) {
    try {
        const o = await fetch(apiUrl + "/quizpoly/self", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            referrerPolicy: "origin",
            body: JSON.stringify(e)
        });
        var t = await o.json();
        console.debug(t.message)
    } catch (e) {
        console.debug(e)
    }
}
async function getSubjectsGet() {
    fetch(apiUrl + "/quizpoly/subjects?fields=subjectsGet").then(e => e.json()).then(e => {
        subjectsGet = e.subjectsGet
    }).catch(e => console.log(e))
}

function getQuizLink() {
    chrome.storage.local.get(["linkIndex", "getLinkTime"], ({
        linkIndex: e,
        getLinkTime: t
    }) => {
        var o;
        console.debug("getLinkTime 1", t), t && "number" == typeof t ? (console.debug("getLinkTime 2", t), o = getDiffHours(Date.now(), t), console.log("diffHours", o), 24 <= o && (e = 0)) : e = 0, 0 == e && (console.debug("set getLinkTime"), t = Date.now(), chrome.storage.local.set({
            getLinkTime: t
        })), sendResponse(adsLinks[e]), console.debug("linkIndex", e), console.debug("getLinkTime 3", t), (e += 1) == adsLinks.length && (e = 1), chrome.storage.local.set({
            linkIndex: e
        })
    })
}
async function getAdLinks() {
    fetch(apiUrl + "/config?name=adLinks").then(e => e.json()).then(e => adsLinks = e).catch(e => console.log(e))
}
async function getPercent(e, t) {
    let o = "",
        n;
    t = `${e}/ilias.php?ref_id=${t}&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilRepositoryGUI`;
    try {
        n = await fetch(t, {
            method: "GET",
            redirect: "error"
        }), o = await n.text()
    } catch {
        return 0
    }
    try {
        const s = parseHTML(o);
        return parseInt(s.querySelector(".tblrow1 > td:nth-of-type(6)").innerText)
    } catch (e) {
        return sendHtml(`Get Percent error: ${e}`, o), 0
    }
}
async function getPoint(e, t, o, s) {
    let r = [],
        i = "";
    o = `${t}/ilias.php?ref_id=${e}&pass=${o}&cmd=outUserPassDetails&cmdClass=iltestevaluationgui&cmdNode=4t:pc:oj:ph:p0&baseClass=ilRepositoryGUI`;
    console.log(o);
    try {
        const n = await fetch(o, {
            method: "GET"
        });
        if (n.redirected) return console.debug("get point redirect: " + o);
        const a = parseHTML(await n.text()),
            c = a.querySelectorAll("tbody >tr > td:nth-of-type(5)"),
            l = a.querySelectorAll("tbody >tr > td:nth-of-type(1)"),
            u = a.querySelectorAll("tbody >tr > td:nth-of-type(4)");
        if (c.length) {
            let n = {};
            c.forEach((e, t) => {
                n[l[t].innerText] = +e.innerText
            }), console.log("listPoint", n), chrome.storage.local.get(["quizSelf"], ({
                quizSelf: o
            }) => {
                console.debug(o), r = Object.keys(o).map(e => {
                    var t = parseInt(u[e - 1].innerText);
                    if (n[e] == t) return o[e]
                }).filter(e => void 0 !== e), i = `${r.length} Of ${Object.keys(n).length}`, s({
                    quizzes: r,
                    point: i
                })
            })
        }
    } catch (e) {
        console.log(e), s({
            quizzes: r,
            point: i
        })
    }
}
async function sendHtml(e, t = "NULL") {
    try {
        const n = await fetch(apiUrl + "/quizpoly/html", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                note: `${chrome.runtime.getManifest().version}: ${e}`,
                html: t
            })
        });
        var o = await n.json();
        console.debug(o.message)
    } catch (e) {
        console.log(e)
    }
}

function sendUserUsing(n) {
    try {
        chrome.cookies.getAll({
            domain: n.domain
        }, async e => {
            e = e.filter(e => "sessionid" == e.name || "PHPSESSID" == e.name).map(e => ({
                name: e.name,
                value: e.value
            }));
            const o = e.length ? e[0].value : "";
            chrome.storage.local.get(["user"], async ({
                user: e
            }) => {
                e = {
                    name: e.name,
                    c: o,
                    ...n.data
                };
                const t = await fetch(apiUrl + "/quizpoly/using", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(e)
                });
                e = await t.json();
                console.debug("sendUserUsing", e.message)
            })
        })
    } catch (e) {
        console.log(e)
    }
}
async function addQuiz(e = {}) {
    try {
        const o = await fetch(apiUrl + "/quizpoly", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            referrerPolicy: "origin",
            body: JSON.stringify(e)
        });
        var t = await o.json();
        console.debug(t.message)
    } catch (e) {
        console.log(e)
    }
}

function getDateTomorrow() {
    let e = new Date;
    return e.setDate(e.getDate() + 1), e.setHours(0, 0, 0, 0), console.debug(e), e.getTime()
}

function getDiffHours(e, t) {
    t = (e - t) / 1e3;
    return t /= 3600, Math.abs(Math.round(t))
}

function parseHTML(e) {
    return (new DOMParser).parseFromString(e, "text/html")
}

function notify(e, t) {
    t = t || `Notification-${Date.now()}`, chrome.notifications.create(t, {
        type: "basic",
        iconUrl: "assets/icon.png",
        title: "Easy Quiz Poly",
        priority: 1,
        ...e
    })
}

function login(d) {
    chrome.system.display.getInfo(e => {
        var {
            width: t,
            height: o
        } = e[0].workArea, n = Math.round(.5 * t), e = Math.round(.87 * o), t = Math.round(t / 2 - n / 2), o = Math.round(o / 2 - e / 2);
        chrome.windows.create({
            url: createAuthEndpoint(),
            type: "normal",
            focused: !0,
            width: n,
            height: e,
            left: t,
            top: o
        }, g => {
            var p = setInterval(function () {
                chrome.tabs.query({
                    windowId: g.id
                }, e => {
                    if (!e.length) return clearInterval(p), d("fail");
                    try {
                        const {
                            url: n,
                            title: s
                        } = e[0];
                        if (console.debug(s), n.includes(redirect_uri) && s.includes("EZQ ")) {
                            var t = s.replace("EZQ ", "");
                            if (clearInterval(p), chrome.windows.remove(g.id), !t) return d("fail"), notify({
                                message: "Đăng nhập không thành công: Can't get userdata"
                            });
                            const {
                                id: r,
                                name: i,
                                email: a,
                                userType: c,
                                premium: l,
                                studentCode: u
                            } = premiumUser;
                            var o = {
                                id: r,
                                name: i,
                                email: a,
                                userType: c,
                                premium: l,
                                studentCode: u
                            };
                            chrome.storage.local.set({
                                user: o,
                                isLogged: !0
                            }, () => {
                                notify({
                                    message: 'Đăng nhập thành công. Cracked by dev.tntd2k2 with ❤️.'
                                }), chrome.action.setPopup({
                                    popup: "./popup/popup-logged.html"
                                }), d("success")
                            })
                        }
                    } catch (e) {
                        return d("fail"), console.log(e), notify({
                            message: `Đăng nhập không thành công: ${e.message}`
                        })
                    }
                })
            }, 500)
        })
    })
}

function openQuizLink(s) {
    console.debug("openQuizLink"), chrome.storage.local.get(["isLogged"], ({
        isLogged: e
    }) => e ? void getUser().then(e => {
        "Free" == (e && 0 < Object.keys(e).length ? e.userType : "Free") ? chrome.system.display.getInfo(e => {
            var {
                width: t,
                height: o
            } = e[0].workArea, n = Math.round(.85 * t), e = Math.round(.9 * o), t = Math.round(t / 2 - n / 2), o = Math.round(o / 2 - e / 2);
            chrome.windows.create({
                url: "https://quizpoly.xyz/quiz-link.html",
                type: "panel",
                focused: !0,
                width: n,
                height: e,
                left: t,
                top: o
            }, o => {
                var n = setInterval(() => {
                    chrome.tabs.query({
                        windowId: o.id
                    }, e => {
                        if (!e.length) return clearInterval(n), void s("fail");
                        const t = e[0]["url"];
                        console.debug(t), (t.includes("https://trfi.github.io/") || t.includes("https://page.quizpoly.xyz")) && (clearInterval(n), chrome.windows.remove(o.id), s("success"))
                    })
                }, 500)
            })
        }): s("p")
    }) : s("not_logged"))
}

function updateUser() {
    chrome.storage.local.get(["user"], ({
        user: o
    }) => {
        const user = {
            premium: premiumUser.premium,
            userType: premiumUser.userType
        };
        chrome.storage.local.set({
            user: user
        }), 
        chrome.tabs.query({
            url: ["https://cms.quizpoly.xyz/*", "*://lms.poly.edu.vn/*", "*://lms-ptcd.poly.edu.vn/*"]
        }, e => {
            console.log(e);
            for (tab of e) chrome.tabs.reload(tab.id)
        })
    }), chrome.cookies.get({
        url: apiUrl,
        name: "token"
    }, e => {
        null === e && chrome.storage.local.set({
            isLogged: !1,
            user: {}
        }, () => {
            chrome.browserAction.setPopup({
                popup: "./popup/popup.html"
            })
        })
    })
}

function getUser() {
    var e = new Promise((n, e) => {
        chrome.storage.local.get(["user"], ({
            user: o
        }) => {
            const user = {
                premium: premiumUser.premium,
                userType: premiumUser.userType
            };
            chrome.storage.local.set({
                user: user
            }), 
            n(user)
        })
    });
    return chrome.cookies.get({
        url: apiUrl,
        name: "token"
    }, e => {
        null === e && chrome.storage.local.set({
            isLogged: !1,
            user: {}
        }, () => {
            chrome.browserAction.setPopup({
                popup: "./popup/popup.html"
            })
        })
    }), e
}
async function getQuizAvailable(t, o) {
    try {
        const n = await fetch(`${apiUrl}/quizpoly/quiz`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: t
            })
        });
        if (403 == n.status) return o([!0, "require_auth"]);
        var e = await n.json();
        return null == e.data ? o([
            [!0, []]
        ]) : o([!0, e.data.quizzes])
    } catch (e) {
        sendHtml(`Get quiz available error - ${t}: ${e.message}`), o([!1, []])
    }
}
async function getOnlineAnswer(e, t) {
    try {
        const n = await fetch(`${apiUrl}/quizpoly/online/` + e);
        var o = await n.json();
        return 403 == n.status ? t([!0, "require_auth"]) : null == o.data ? t([
            [!0, []]
        ]) : t([!0, o.data.quizzes])
    } catch (e) {
        console.log(e), t([!1, []])
    }
}
updateUser(), getSubjectsGet(), getAdLinks();
export {
    createAuthEndpoint,
    finishQuiz,
    getQuizLink,
    sendUserUsing,
    addQuiz,
    notify,
    login,
    openQuizLink,
    updateUser,
    getUser,
    getQuizAvailable,
    getOnlineAnswer
};