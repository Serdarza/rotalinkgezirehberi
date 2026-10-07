import { DOWNLOADED_KEY } from "@/lib/downloadPrompt";
import { DOWNLOAD_PAGE_PATH } from "@/config/downloads";

/**
 * `<head>` içinde, sayfa çizilmeden çalışan satır içi betik.
 *
 * Telefondan ilk kez gelen (henüz mağazaya gitmemiş) ziyaretçiyi
 * `/indir` sayfasına alır; oradan mağazaya yönlendirilir. Mağazaya bir kez
 * gidildikten sonra site normal açılır. Arama motoru / önizleme botları
 * yönlendirilmez (indeksleme bozulmasın).
 */
export const MOBILE_APP_GATE_SCRIPT = `(function(){try{
var ua=navigator.userAgent||"";
if(!/android|iphone|ipad|ipod/i.test(ua))return;
if(/bot|crawl|spider|slurp|lighthouse|headless|google-inspectiontool|mediapartners|adsbot|facebookexternalhit|whatsapp|telegram|preview/i.test(ua))return;
var p=location.pathname;
if(p.indexOf(${JSON.stringify(DOWNLOAD_PAGE_PATH)})===0)return;
if(localStorage.getItem(${JSON.stringify(DOWNLOADED_KEY)})==="1")return;
location.replace(${JSON.stringify(DOWNLOAD_PAGE_PATH)}+"?from="+encodeURIComponent(p+location.search));
}catch(e){}})();`;
