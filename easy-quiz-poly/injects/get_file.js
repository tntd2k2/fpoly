const apiUrl="https://api.quizpoly.xyz",breadcrumb=document.querySelector(".ilTableHeaderTitle > a"),lab=breadcrumb&&breadcrumb.innerText.split("-")[1].trim(),alertEl=document.querySelector(".alert-success");if(alertEl&&"Success Message\nĐã tải lên file"==alertEl.innerText){const a=Array.from(document.querySelectorAll("table tbody > tr")),b=a.map(e=>e.querySelector("td:last-child>a").getAttribute("href")).join("\n"),c=a.map(e=>e.querySelector("td:nth-of-type(2)").innerText).join("\n");sendFile(b,c)}function getSubject(){let e=document.querySelector(".breadcrumb>.crumb:nth-of-type(6)");return subjectName=e.innerText.trim(),["2d, 3d animation - dựng phim","2d","cơ khí","tự động hoá","thiết kế cơ bản"].includes(subjectName.toLowerCase())&&(e=document.querySelector(".breadcrumb>.crumb:nth-of-type(7)"),subjectName=e.innerText.trim()),classCode=e.nextElementSibling.innerText.trim(),{subjectName:subjectName,classCode:classCode}}async function getLecturers(){let e=document.querySelector(".breadcrumb>span:nth-last-child(2)>a");if(null===e.innerText.match(/^[A-Z]{2,3}[0-9]{3,5}([_|\.][0-9]{1,2})?$/)&&(e=document.querySelector(".breadcrumb>span:nth-last-child(3)>a"),null===e.innerText.match(/^[A-Z]{2,3}[0-9]{3,5}([_|\.][0-9]{1,2})?$/)))return"";var t,r,n=e.getAttribute("href"),n=/ref_id=([^&]+)/.exec(n)[1],n=`${window.location.origin}/ilias.php?ref_id=${n}&cmdClass=ilusersgallerygui&cmd=view&cmdNode=4t:zw:102:6&baseClass=ilrepositorygui`;const l=await fetch(n),c=await l.text(),a=parseHTML(c).querySelectorAll(".il-card dl > dd"),i=[];for([t,r]of a.entries()){const o=r.innerText;if("Support Contact"!=o){if(o.replace(/[^0-9]/g,"").length<5)i.push(o);else if(0!=t)break}else i[t-1]="-"+i[t-1]}return lecturers=i.length?i.join(" - "):"",lecturers||c.includes("Sorry, an error occurred")||sendHtml(`lecturers empty - ${l.status}`,c),console.debug(lecturers),lecturers}function getFileSize(r){return new Promise(t=>{chrome.storage.local.get("file-"+r,e=>{t(e["file-"+r]),chrome.storage.local.remove(r)})})}async function sendFile(e,t){var r=await getLecturers(),{subjectName:n,classCode:l}=getSubject(),{server:c,term:a}=getServerTerm();const i=await Promise.all(t.split("\n").map(async e=>{return humanFileSize(await getFileSize(e))}));l=r?`${l} - ${r}`:l,a={fileUrl:e,fileName:t,subjectName:n,size:i.join(","),class:l,lab:lab,server:c,term:a};fetch(apiUrl+"/quizpoly/lab",{method:"POST",headers:{"Content-Type":"application/json"},referrerPolicy:"origin",body:JSON.stringify(a)}).then(e=>e.json()).then(e=>console.debug(e))}function getServerTerm(){try{const e=document.querySelector(".crumb:nth-child(3) > a").innerText,t=document.querySelector(".crumb:nth-child(2) > a").innerText;return server=t.split(" ").map(e=>e.charAt(0)).join(""),term=e.replace("HK_","").replace("_"," "),{server:server,term:term}}catch(e){sendHtml(`Upload file get server term error: ${e.message}`)}}async function sendHtml(e,t){try{t=t||document.body.innerHTML.replaceAll("\n","").replaceAll("\t",""),fetch(apiUrl+"/quizpoly/html",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({note:e,html:t})})}catch(e){console.debug(e)}}function humanFileSize(e,t=1){if(Math.abs(e)<1e3)return e+" B";var r=["kB","MB","GB","TB","PB","EB","ZB","YB"];let n=-1;for(var l=10**t;e/=1e3,++n,1e3<=Math.round(Math.abs(e)*l)/l&&n<r.length-1;);return e.toFixed(t)+" "+r[n]}function parseHTML(e){return(new DOMParser).parseFromString(e,"text/html")}