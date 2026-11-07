/**
 * First-party web visit / store-redirect measurement via admin Worker.
 * Store redirects go through HTTP 302 so counts survive navigation away from the page.
 */

export const WEB_STATS_ORIGIN =
  process.env.NEXT_PUBLIC_WEB_STATS_ORIGIN ?? "https://admin.rotalink.tr";

const VISITOR_KEY = "rotalink_vid_v1";
const SESSION_KEY = "rotalink_sid_v1";
const VISIT_SENT_KEY = "rotalink_visit_sent_v1";

function randomId() {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function storageGet(storage: Storage | null, key: string) {
  try {
    return storage?.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function storageSet(storage: Storage | null, key: string, value: string) {
  try {
    storage?.setItem(key, value);
  } catch {
    // private mode
  }
}

export function visitorId(): string {
  if (typeof window === "undefined") return "";
  let id = storageGet(window.localStorage, VISITOR_KEY);
  if (!id) {
    id = randomId();
    storageSet(window.localStorage, VISITOR_KEY, id);
  }
  return id;
}

export function sessionId(): string {
  if (typeof window === "undefined") return "";
  let id = storageGet(window.sessionStorage, SESSION_KEY);
  if (!id) {
    id = randomId();
    storageSet(window.sessionStorage, SESSION_KEY, id);
  }
  return id;
}

export function platformParam(): "android" | "ios" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return "ios";
  return "desktop";
}

function attributionParams(extra: Record<string, string> = {}) {
  const url = typeof location !== "undefined" ? new URL(location.href) : null;
  const params = new URLSearchParams();
  if (url) {
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"]) {
      const value = url.searchParams.get(key);
      if (value) params.set(key, value);
    }
    params.set("path", `${url.pathname}${url.search}`.slice(0, 300));
  }
  if (typeof document !== "undefined" && document.referrer) {
    params.set("ref", document.referrer.slice(0, 400));
  }
  params.set("vid", visitorId());
  params.set("sid", sessionId());
  params.set("p", platformParam());
  params.set("eid", randomId());
  for (const [key, value] of Object.entries(extra)) {
    if (value) params.set(key, value);
  }
  return params;
}

/** Reliable store hop: record on server then 302 to Play / App Store. */
export function storeGoUrl(store: "play" | "app", options: { path?: string; tag?: string; alsoVisit?: boolean } = {}) {
  const params = attributionParams({
    store,
    ...(options.path ? { path: options.path } : {}),
    ...(options.tag ? { tag: options.tag, utm_campaign: options.tag } : {}),
    ...(options.alsoVisit ? { visit: "1" } : {}),
  });
  return `${WEB_STATS_ORIGIN}/public/web-stats/go?${params.toString()}`;
}

/** Best-effort page visit for desktop / non-redirect pages. */
export function trackVisitOnce() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(VISIT_SENT_KEY) === "1") return;
    sessionStorage.setItem(VISIT_SENT_KEY, "1");
  } catch {
    // continue
  }
  const params = attributionParams();
  const url = `${WEB_STATS_ORIGIN}/public/web-stats/collect?${params.toString()}`;
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
      return;
    }
  } catch {
    // fallback below
  }
  try {
    void fetch(url, { method: "POST", keepalive: true, mode: "no-cors" });
  } catch {
    // ignore
  }
}

/**
 * Inline head script: records a visit once per session without blocking paint.
 * Mobile store redirects use `/public/web-stats/go` separately.
 */
export const WEB_VISIT_COLLECT_SCRIPT = `(function(){try{
var ua=navigator.userAgent||"";
if(/bot|crawl|spider|slurp|lighthouse|headless|google-inspectiontool|googleother|mediapartners|adsbot|apis-google|feedfetcher|facebookexternalhit|facebot|whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|discordbot|pinterest|embedly|preview/i.test(ua))return;
var ss=null,ls=null;try{ss=sessionStorage;}catch(e){}try{ls=localStorage;}catch(e){}
if(ss&&ss.getItem(${JSON.stringify(VISIT_SENT_KEY)})==="1")return;
function rid(){var a=new Uint8Array(16);if(crypto&&crypto.getRandomValues)crypto.getRandomValues(a);var s="";for(var i=0;i<a.length;i++)s+=("0"+a[i].toString(16)).slice(-2);return s;}
function get(store,key){try{return store&&store.getItem(key)||"";}catch(e){return"";}}
function set(store,key,val){try{if(store)store.setItem(key,val);}catch(e){}}
var vid=get(ls,${JSON.stringify(VISITOR_KEY)})||rid();set(ls,${JSON.stringify(VISITOR_KEY)},vid);
var sid=get(ss,${JSON.stringify(SESSION_KEY)})||rid();set(ss,${JSON.stringify(SESSION_KEY)},sid);
var android=/android/i.test(ua);var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
var p=android?"android":ios?"ios":"desktop";
var q=new URLSearchParams();
q.set("vid",vid);q.set("sid",sid);q.set("p",p);q.set("eid",rid());
q.set("path",(location.pathname+location.search).slice(0,300));
if(document.referrer)q.set("ref",document.referrer.slice(0,400));
["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"].forEach(function(k){var v=new URLSearchParams(location.search).get(k);if(v)q.set(k,v);});
var url=${JSON.stringify(`${WEB_STATS_ORIGIN}/public/web-stats/collect`)}+"?"+q.toString();
if(ss)ss.setItem(${JSON.stringify(VISIT_SENT_KEY)},"1");
if(navigator.sendBeacon)navigator.sendBeacon(url);else fetch(url,{method:"POST",keepalive:true,mode:"no-cors"});
}catch(e){}})();`;
