import {
  ANDROID_PACKAGE,
  APP_GATE_EXCLUDED_PREFIXES,
  APP_GATE_SESSION_KEY,
  APP_SCHEME,
  APP_STORE_REDIRECT_URL,
  PLAY_STORE_BASE_URL,
  REDIRECT_COUNTER_BASE,
  STAY_ON_WEB_PARAM,
} from "@/lib/appLink";

/**
 * `<head>` içinde, sayfa çizilmeden çalışan satır içi betik.
 *
 * Telefon (Android / iOS) + bot değil + bu oturumda henüz yönlendirilmemiş:
 * - Android: `intent://` ile uygulamadaki ilgili sayfayı aç; uygulama yoksa
 *   Chrome doğrudan Play Store'a gider (Install Referrer ile yol taşınır).
 *   Intent engellenirse 2,5 sn sonra Play Store.
 * - iOS: doğrudan App Store. (Uygulama yüklüyse iOS, Universal Link ile
 *   sayfayı hiç yüklemeden uygulamayı açar.)
 * Masaüstü ve botlar etkilenmez; arama motorları normal içeriği görür.
 *
 * Olaylar (CounterAPI): web_to_app, android_store_redirect, ios_store_redirect
 * ve sayfa bazlı `<olay>__<sayfa>` (ör. ios_store_redirect__sehir_kayseri).
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
var ss=null;try{ss=window.sessionStorage;}catch(e){}
var key=${JSON.stringify(APP_GATE_SESSION_KEY)};
if(new RegExp("[?&]${STAY_ON_WEB_PARAM}=1(&|$)").test(q)){if(ss)ss.setItem(key,"1");return;}
if(ss){if(ss.getItem(key))return;ss.setItem(key,"1");}
var path=p+q;
var tag=p.split("/").filter(Boolean).join("_").toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,48)||"home";
var cb=${JSON.stringify(REDIRECT_COUNTER_BASE)};
function ping(n){try{fetch(cb+n+"/up",{keepalive:true,mode:"no-cors"});fetch(cb+n+"__"+tag+"/up",{keepalive:true,mode:"no-cors"});}catch(e){}}
ping("web_to_app");
if(android){
ping("android_store_redirect");
var ref="utm_source=rotalink_web&utm_medium=web_redirect&utm_campaign="+tag+"&rl_path="+encodeURIComponent(path);
var play=${JSON.stringify(PLAY_STORE_BASE_URL)}+"&referrer="+encodeURIComponent(ref);
setTimeout(function(){if(document.visibilityState==="visible")location.replace(play);},2500);
location.replace("intent://open"+path+"#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url="+encodeURIComponent(play)+";end");
}else{
ping("ios_store_redirect");
location.replace(${JSON.stringify(APP_STORE_REDIRECT_URL)});
}
}catch(e){}})();`;
