import {
  ANDROID_PACKAGE,
  APP_GATE_EXCLUDED_PREFIXES,
  APP_GATE_SESSION_KEY,
  APP_SCHEME,
  STAY_ON_WEB_PARAM,
} from "@/lib/appLink";
import { WEB_STATS_ORIGIN } from "@/lib/webAnalytics";

/**
 * `<head>` içinde, sayfa çizilmeden çalışan satır içi betik.
 *
 * Telefon (Android / iOS) + bot değil + bu oturumda henüz yönlendirilmemiş:
 * - Android: `intent://` ile uygulamadaki ilgili sayfayı aç; uygulama yoksa
 *   Chrome, ölçüm uç noktasına düşer ve sunucu 302 ile Play Store'a gider.
 * - iOS: ölçüm uç noktası → 302 App Store.
 *
 * Mağaza yönlendirme sayısı sunucu tarafında kaydedilir (JS ping kaybolmaz).
 * Ziyaret sayımı ayrı collect betiğiyle yapılır; burada yalnızca mağaza hop'u.
 */
export const MOBILE_APP_GATE_SCRIPT = `(function(){try{
var ua=navigator.userAgent||"";
var android=/android/i.test(ua);
var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
if(!android&&!ios)return;
if(/bot|crawl|spider|slurp|lighthouse|headless|google-inspectiontool|googleother|mediapartners|adsbot|apis-google|feedfetcher|facebookexternalhit|facebot|whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|discordbot|pinterest|embedly|preview/i.test(ua))return;
var p=location.pathname,q=location.search;
var ex=${JSON.stringify(APP_GATE_EXCLUDED_PREFIXES)};
for(var i=0;i<ex.length;i++){if(p.indexOf(ex[i])===0)return;}
var ss=null,ls=null;try{ss=window.sessionStorage;}catch(e){}try{ls=window.localStorage;}catch(e){}
var key=${JSON.stringify(APP_GATE_SESSION_KEY)};
if(new RegExp("[?&]${STAY_ON_WEB_PARAM}=1(&|$)").test(q)){if(ss)ss.setItem(key,"1");return;}
var rf=document.referrer||"";
if(/^https?:[/][/]([a-z0-9-]+[.])*(google|bing|yandex|duckduckgo|yahoo|ecosia|brave|startpage|baidu|qwant|naver|seznam)[.][a-z.]+([/]|$|[?])/i.test(rf)||rf.indexOf("android-app://com.google.android.googlequicksearchbox")===0){if(ss)ss.setItem(key,"1");return;}
if(ss){if(ss.getItem(key))return;ss.setItem(key,"1");}
var path=p+q;
var tag=p.split("/").filter(Boolean).join("_").toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,48)||"home";
function rid(){var a=new Uint8Array(16);if(crypto&&crypto.getRandomValues)crypto.getRandomValues(a);var s="";for(var i=0;i<a.length;i++)s+=("0"+a[i].toString(16)).slice(-2);return s;}
function get(store,k){try{return store&&store.getItem(k)||"";}catch(e){return"";}}
function set(store,k,v){try{if(store)store.setItem(k,v);}catch(e){}}
var vid=get(ls,"rotalink_vid_v1")||rid();set(ls,"rotalink_vid_v1",vid);
var sid=get(ss,"rotalink_sid_v1")||rid();set(ss,"rotalink_sid_v1",sid);
function attrs(extra){
  var qp=new URLSearchParams();
  qp.set("vid",vid);qp.set("sid",sid);qp.set("p",android?"android":"ios");qp.set("eid",rid());
  qp.set("path",path.slice(0,300));qp.set("tag",tag);qp.set("utm_campaign",tag);
  if(rf)qp.set("ref",rf.slice(0,400));
  ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"].forEach(function(k){var v=new URLSearchParams(q).get(k);if(v)qp.set(k,v);});
  if(extra)Object.keys(extra).forEach(function(k){qp.set(k,extra[k]);});
  return qp;
}
function go(store,extra){
  return ${JSON.stringify(`${WEB_STATS_ORIGIN}/public/web-stats/go`)}+"?"+attrs(Object.assign({store:store},extra||{})).toString();
}
if(android){
// Uygulama açılsa bile ziyaret kaydı düşsün; Play yalnızca fallback go ile sayılır.
if(!ss||ss.getItem("rotalink_visit_sent_v1")!=="1"){
  var collect=${JSON.stringify(`${WEB_STATS_ORIGIN}/public/web-stats/collect`)}+"?"+attrs().toString();
  try{if(navigator.sendBeacon)navigator.sendBeacon(collect);else fetch(collect,{method:"POST",keepalive:true,mode:"no-cors"});}catch(e){}
  if(ss)ss.setItem("rotalink_visit_sent_v1","1");
}
var play=go("play");
setTimeout(function(){if(document.visibilityState==="visible")location.replace(play);},2500);
location.replace("intent://open"+path+"#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url="+encodeURIComponent(play)+";end");
}else{
// iOS: tek sunucu hop'u (ziyaret + App Store); beacon'a güvenilmez.
if(ss)ss.setItem("rotalink_visit_sent_v1","1");
location.replace(go("app",{visit:"1"}));
}
}catch(e){}})();`;
