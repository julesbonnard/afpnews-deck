(function(){"use strict";var e={272:function(){try{self["workbox:background-sync:6.1.5"]&&_()}catch(e){}},895:function(){try{self["workbox:cacheable-response:6.1.5"]&&_()}catch(e){}},913:function(){try{self["workbox:core:6.1.5"]&&_()}catch(e){}},550:function(){try{self["workbox:expiration:6.1.5"]&&_()}catch(e){}},612:function(){try{self["workbox:google-analytics:6.1.5"]&&_()}catch(e){}},977:function(){try{self["workbox:precaching:6.1.5"]&&_()}catch(e){}},80:function(){try{self["workbox:routing:6.1.5"]&&_()}catch(e){}},873:function(){try{self["workbox:strategies:6.1.5"]&&_()}catch(e){}}},t={};function s(n){var a=t[n];if(void 0!==a)return a.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,s),r.exports}!function(){s(913);const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s},t=e;class n extends Error{constructor(e,s){const n=t(e,s);super(n),this.name=e,this.details=s}}s(80);const a="GET",r=e=>e&&"object"===typeof e?e:{handle:e};class i{constructor(e,t,s=a){this.handler=r(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=r(e)}}class c extends i{constructor(e,t,s){const n=({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)};super(n,t,s)}}const o=e=>{const t=new URL(String(e),location.href);return t.href.replace(new RegExp(`^${location.origin}`),"")};class h{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data;0;const s=Promise.all(t.urlsToCache.map((t=>{"string"===typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return void 0;const n=s.origin===location.origin,{params:a,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return void 0;let o;try{o=i.handle({url:s,request:e,event:t,params:a})}catch(u){o=Promise.reject(u)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async n=>{if(h){0;try{return await h.handle({url:s,request:e,event:t,params:a})}catch(r){n=r}}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw n}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const a=this._routes.get(s.method)||[];for(const r of a){let a;const i=r.match({url:e,sameOrigin:t,request:s,event:n});if(i)return a=i,(Array.isArray(i)&&0===i.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"===typeof i)&&(a=void 0),{route:r,params:a}}return{}}setDefaultHandler(e,t=a){this._defaultHandlerMap.set(t,r(e))}setCatchHandler(e){this._catchHandler=r(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new n("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(!(t>-1))throw new n("unregister-route-route-not-registered");this._routes.get(e.method).splice(t,1)}}let u;const l=()=>(u||(u=new h,u.addFetchListener(),u.addCacheListener()),u);function d(e,t,s){let a;if("string"===typeof e){const n=new URL(e,location.href);0;const r=({url:e})=>e.href===n.href;a=new i(r,t,s)}else if(e instanceof RegExp)a=new c(e,t,s);else if("function"===typeof e)a=new i(e,t,s);else{if(!(e instanceof i))throw new n("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}const r=l();return r.registerRoute(a),a}const p={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!==typeof registration?registration.scope:""},f=e=>[p.prefix,e,p.suffix].filter((e=>e&&e.length>0)).join("-"),m=e=>{for(const t of Object.keys(p))e(t)},w={updateDetails:e=>{m((t=>{"string"===typeof e[t]&&(p[t]=e[t])}))},getGoogleAnalyticsName:e=>e||f(p.googleAnalytics),getPrecacheName:e=>e||f(p.precache),getPrefix:()=>p.prefix,getRuntimeName:e=>e||f(p.runtime),getSuffix:()=>p.suffix};function y(e,t){const s=new URL(e);for(const n of t)s.searchParams.delete(n);return s.href}async function g(e,t,s,n){const a=y(t.url,s);if(t.url===a)return e.match(t,n);const r={...n,ignoreSearch:!0},i=await e.keys(t,r);for(const c of i){const t=y(c.url,s);if(a===t)return e.match(c,n)}}class _{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const R=new Set;async function q(){for(const e of R)await e()}function b(e){return new Promise((t=>setTimeout(t,e)))}s(873);function x(e){return"string"===typeof e?new Request(e):e}class v{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new _,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let s=x(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){const e=await t.preloadResponse;if(e)return e}const a=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(i){throw new n("plugin-error-request-will-fetch",{thrownError:i})}const r=s.clone();try{let e;e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions);for(const s of this.iterateCallbacks("fetchDidSucceed"))e=await s({event:t,request:r,response:e});return e}catch(c){throw a&&await this.runCallbacks("fetchDidFail",{error:c,event:t,originalRequest:a.clone(),request:r.clone()}),c}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=x(e);let s;const{cacheName:n,matchOptions:a}=this._strategy,r=await this.getCacheKey(t,"read"),i={...a,cacheName:n};s=await caches.match(r,i);for(const c of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await c({cacheName:n,matchOptions:a,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,t){const s=x(e);await b(0);const a=await this.getCacheKey(s,"write");if(!t)throw new n("cache-put-with-no-response",{url:o(a.url)});const r=await this._ensureResponseSafeToCache(t);if(!r)return!1;const{cacheName:i,matchOptions:c}=this._strategy,h=await self.caches.open(i),u=this.hasCallback("cacheDidUpdate"),l=u?await g(h,a.clone(),["__WB_REVISION__"],c):null;try{await h.put(a,u?r.clone():r)}catch(d){throw"QuotaExceededError"===d.name&&await q(),d}for(const n of this.iterateCallbacks("cacheDidUpdate"))await n({cacheName:i,oldResponse:l,newResponse:r.clone(),request:a,event:this.event});return!0}async getCacheKey(e,t){if(!this._cacheKeys[t]){let s=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=x(await e({mode:t,request:s,event:this.event,params:this.params}));this._cacheKeys[t]=s}return this._cacheKeys[t]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"===typeof t[e]){const s=this._pluginStateMap.get(t),n=n=>{const a={...n,state:s};return t[e](a)};yield n}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;while(e=this._extendLifetimePromises.shift())await e}destroy(){this._handlerDeferred.resolve()}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const n of this.iterateCallbacks("cacheWillUpdate"))if(t=await n({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class T{constructor(e={}){this.cacheName=w.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"===typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,a=new v(this,{event:t,request:s,params:n}),r=this._getResponse(a,s,t),i=this._awaitComplete(r,a,s,t);return[r,i]}async _getResponse(e,t,s){let a;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(a=await this._handle(t,e),!a||"error"===a.type)throw new n("no-response",{url:t.url})}catch(r){for(const n of e.iterateCallbacks("handlerDidError"))if(a=await n({error:r,event:s,request:t}),a)break;if(!a)throw r}for(const n of e.iterateCallbacks("handlerWillRespond"))a=await n({event:s,request:t,response:a});return a}async _awaitComplete(e,t,s,n){let a,r;try{a=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:a}),await t.doneWaiting()}catch(i){r=i}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:a,error:r}),t.destroy(),r)throw r}}class C extends T{async _handle(e,t){let s,a=await t.cacheMatch(e);if(a)0;else{0;try{a=await t.fetchAndCachePut(e)}catch(r){s=r}0}if(!a)throw new n("no-response",{url:e.url,error:s});return a}}const k={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class N extends T{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(k),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){const s=[];const a=[];let r;if(this._networkTimeoutSeconds){const{id:n,promise:i}=this._getTimeoutPromise({request:e,logs:s,handler:t});r=n,a.push(i)}const i=this._getNetworkPromise({timeoutId:r,request:e,logs:s,handler:t});a.push(i);const c=await t.waitUntil((async()=>await t.waitUntil(Promise.race(a))||await i)());if(!c)throw new n("no-response",{url:e.url});return c}_getTimeoutPromise({request:e,logs:t,handler:s}){let n;const a=new Promise((t=>{const a=async()=>{t(await s.cacheMatch(e))};n=setTimeout(a,1e3*this._networkTimeoutSeconds)}));return{promise:a,id:n}}async _getNetworkPromise({timeoutId:e,request:t,logs:s,handler:n}){let a,r;try{r=await n.fetchAndCachePut(t)}catch(i){a=i}return e&&clearTimeout(e),!a&&r||(r=await n.cacheMatch(t)),r}}class U extends T{constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let s,a;try{const s=[t.fetch(e)];if(this._networkTimeoutSeconds){const e=b(1e3*this._networkTimeoutSeconds);s.push(e)}if(a=await Promise.race(s),!a)throw new Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`)}catch(r){s=r}if(!a)throw new n("no-response",{url:e.url,error:s});return a}}function S(e,t){const s=t();return e.waitUntil(s),s}s(977);const E="__WB_REVISION__";function P(e){if(!e)throw new n("add-to-cache-list-unexpected-type",{entry:e});if("string"===typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:s}=e;if(!s)throw new n("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}const a=new URL(s,location.href),r=new URL(s,location.href);return a.searchParams.set(E,t),{cacheKey:a.href,url:r.href}}class L{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class A{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=t&&t.cacheKey||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s):e},this._precacheController=e}}let D,K;function O(){if(void 0===D){const t=new Response("");if("body"in t)try{new Response(t.body),D=!0}catch(e){D=!1}D=!1}return D}async function M(e,t){let s=null;if(e.url){const t=new URL(e.url);s=t.origin}if(s!==self.location.origin)throw new n("cross-origin-copy-response",{origin:s});const a=e.clone(),r={headers:new Headers(a.headers),status:a.status,statusText:a.statusText},i=t?t(r):r,c=O()?a.body:await a.blob();return new Response(c,i)}class I extends T{constructor(e={}){e.cacheName=w.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(I.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;if(!this._fallbackToNetwork)throw new n("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s=await t.fetch(e),s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();const s=await t.fetch(e),a=await t.cachePut(e,s.clone());if(!a)throw new n("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,n]of this.plugins.entries())n!==I.copyRedirectedCacheableResponsesPlugin&&(n===I.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);0===t?this.plugins.push(I.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}I.defaultPrecacheCacheabilityPlugin={async cacheWillUpdate({response:e}){return!e||e.status>=400?null:e}},I.copyRedirectedCacheableResponsesPlugin={async cacheWillUpdate({response:e}){return e.redirected?await M(e):e}};class j{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new I({cacheName:w.getPrecacheName(e),plugins:[...t,new A({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){"string"===typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);const{cacheKey:e,url:a}=P(s),r="string"!==typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==e)throw new n("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:e});if("string"!==typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new n("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(e,s.integrity)}if(this._urlsToCacheKeys.set(a,e),this._urlsToCacheModes.set(a,r),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return S(e,(async()=>{const t=new L;this.strategy.plugins.push(t);for(const[a,r]of this._urlsToCacheKeys){const t=this._cacheKeysToIntegrities.get(r),s=this._urlsToCacheModes.get(a),n=new Request(a,{integrity:t,cache:s,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:r},request:n,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return S(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){const e=await self.caches.open(this.strategy.cacheName);return e.match(s)}}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new n("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params={cacheKey:t,...s.params},this.strategy.handle(s))}}const W=()=>(K||(K=new j),K);function F(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}function*H(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:a}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=F(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(n){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:r});for(const t of e)yield t.href}}class B extends i{constructor(e,t){const s=({request:s})=>{const n=e.getURLsToCacheKeys();for(const e of H(s.url,t)){const t=n.get(e);if(t)return{cacheKey:t}}};super(s,e.strategy)}}function $(e){const t=W(),s=new B(t,e);d(s)}function G(e){const t=W();t.precache(e)}function V(e,t){G(e),$(t)}function Q(e){R.add(e)}function J(e){e.then((()=>{}))}class z{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this._db=null,this._name=e,this._version=t,this._onupgradeneeded=s,this._onversionchange=n||(()=>this.close())}get db(){return this._db}async open(){if(!this._db)return this._db=await new Promise(((e,t)=>{let s=!1;setTimeout((()=>{s=!0,t(new Error("The open request was blocked and timed out"))}),this.OPEN_TIMEOUT);const n=indexedDB.open(this._name,this._version);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"===typeof this._onupgradeneeded&&this._onupgradeneeded(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this._onversionchange.bind(this),e(t))}})),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){const n=await this.getAllMatching(e,{query:t,count:s,includeKeys:!0});return n.map((e=>e.key))}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:a,includeKeys:r=!1}={}){return await this.transaction([e],"readonly",((i,c)=>{const o=i.objectStore(e),h=t?o.index(t):o,u=[],l=h.openCursor(s,n);l.onsuccess=()=>{const e=l.result;e?(u.push(r?e:e.value),a&&u.length>=a?c(u):e.continue()):c(u)}}))}async transaction(e,t,s){return await this.open(),await new Promise(((n,a)=>{const r=this._db.transaction(e,t);r.onabort=()=>a(r.error),r.oncomplete=()=>n(),s(r,(e=>n(e)))}))}async _call(e,t,s,...n){const a=(s,a)=>{const r=s.objectStore(t),i=r[e].apply(r,n);i.onsuccess=()=>a(i.result)};return await this.transaction([t],s,a)}close(){this._db&&(this._db.close(),this._db=null)}}z.prototype.OPEN_TIMEOUT=2e3;const X={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[s,De]of Object.entries(X))for(const e of De)e in IDBObjectStore.prototype&&(z.prototype[e]=async function(t,...n){return await this._call(e,t,s,...n)});const Y=async e=>{await new Promise(((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}}))};function Z(e){w.updateDetails(e)}s(272);const ee=3,te="workbox-background-sync",se="requests",ne="queueName";class ae{constructor(e){this._queueName=e,this._db=new z(te,ee,{onupgradeneeded:this._upgradeDb})}async pushEntry(e){delete e.id,e.queueName=this._queueName,await this._db.add(se,e)}async unshiftEntry(e){const[t]=await this._db.getAllMatching(se,{count:1});t?e.id=t.id-1:delete e.id,e.queueName=this._queueName,await this._db.add(se,e)}async popEntry(){return this._removeEntry({direction:"prev"})}async shiftEntry(){return this._removeEntry({direction:"next"})}async getAll(){return await this._db.getAllMatching(se,{index:ne,query:IDBKeyRange.only(this._queueName)})}async deleteEntry(e){await this._db.delete(se,e)}async _removeEntry({direction:e}){const[t]=await this._db.getAllMatching(se,{direction:e,index:ne,query:IDBKeyRange.only(this._queueName),count:1});if(t)return await this.deleteEntry(t.id),t}_upgradeDb(e){const t=e.target.result;e.oldVersion>0&&e.oldVersion<ee&&t.objectStoreNames.contains(se)&&t.deleteObjectStore(se);const s=t.createObjectStore(se,{autoIncrement:!0,keyPath:"id"});s.createIndex(ne,ne,{unique:!1})}}const re=["method","referrer","referrerPolicy","mode","credentials","cache","redirect","integrity","keepalive"];class ie{constructor(e){"navigate"===e["mode"]&&(e["mode"]="same-origin"),this._requestData=e}static async fromRequest(e){const t={url:e.url,headers:{}};"GET"!==e.method&&(t.body=await e.clone().arrayBuffer());for(const[s,n]of e.headers.entries())t.headers[s]=n;for(const s of re)void 0!==e[s]&&(t[s]=e[s]);return new ie(t)}toObject(){const e=Object.assign({},this._requestData);return e.headers=Object.assign({},this._requestData.headers),e.body&&(e.body=e.body.slice(0)),e}toRequest(){return new Request(this._requestData.url,this._requestData)}clone(){return new ie(this.toObject())}}const ce="workbox-background-sync",oe=10080,he=new Set,ue=e=>{const t={request:new ie(e.requestData).toRequest(),timestamp:e.timestamp};return e.metadata&&(t.metadata=e.metadata),t};class le{constructor(e,{onSync:t,maxRetentionTime:s}={}){if(this._syncInProgress=!1,this._requestsAddedDuringSync=!1,he.has(e))throw new n("duplicate-queue-name",{name:e});he.add(e),this._name=e,this._onSync=t||this.replayRequests,this._maxRetentionTime=s||oe,this._queueStore=new ae(this._name),this._addSyncListener()}get name(){return this._name}async pushRequest(e){await this._addRequest(e,"push")}async unshiftRequest(e){await this._addRequest(e,"unshift")}async popRequest(){return this._removeRequest("pop")}async shiftRequest(){return this._removeRequest("shift")}async getAll(){const e=await this._queueStore.getAll(),t=Date.now(),s=[];for(const n of e){const e=60*this._maxRetentionTime*1e3;t-n.timestamp>e?await this._queueStore.deleteEntry(n.id):s.push(ue(n))}return s}async _addRequest({request:e,metadata:t,timestamp:s=Date.now()},n){const a=await ie.fromRequest(e.clone()),r={requestData:a.toObject(),timestamp:s};t&&(r.metadata=t),await this._queueStore[`${n}Entry`](r),this._syncInProgress?this._requestsAddedDuringSync=!0:await this.registerSync()}async _removeRequest(e){const t=Date.now(),s=await this._queueStore[`${e}Entry`]();if(s){const n=60*this._maxRetentionTime*1e3;return t-s.timestamp>n?this._removeRequest(e):ue(s)}}async replayRequests(){let e;while(e=await this.shiftRequest())try{await fetch(e.request.clone())}catch(t){throw await this.unshiftRequest(e),new n("queue-replay-failed",{name:this._name})}}async registerSync(){if("sync"in self.registration)try{await self.registration.sync.register(`${ce}:${this._name}`)}catch(e){0}}_addSyncListener(){"sync"in self.registration?self.addEventListener("sync",(e=>{if(e.tag===`${ce}:${this._name}`){0;const t=async()=>{let t;this._syncInProgress=!0;try{await this._onSync({queue:this})}catch(s){throw t=s,t}finally{!this._requestsAddedDuringSync||t&&!e.lastChance||await this.registerSync(),this._syncInProgress=!1,this._requestsAddedDuringSync=!1}};e.waitUntil(t())}})):this._onSync({queue:this})}static get _queueNames(){return he}}class de{constructor(e,t){this.fetchDidFail=async({request:e})=>{await this._queue.pushRequest({request:e})},this._queue=new le(e,t)}}s(612);const pe="workbox-google-analytics",fe=2880,me="www.google-analytics.com",we="www.googletagmanager.com",ye="/analytics.js",ge="/gtag/js",_e="/gtm.js",Re=/^\/(\w+\/)?collect/,qe=e=>async({queue:t})=>{let s;while(s=await t.shiftRequest()){const{request:a,timestamp:r}=s,i=new URL(a.url);try{const t="POST"===a.method?new URLSearchParams(await a.clone().text()):i.searchParams,s=r-(Number(t.get("qt"))||0),n=Date.now()-s;if(t.set("qt",String(n)),e.parameterOverrides)for(const a of Object.keys(e.parameterOverrides)){const s=e.parameterOverrides[a];t.set(a,s)}"function"===typeof e.hitFilter&&e.hitFilter.call(null,t),await fetch(new Request(i.origin+i.pathname,{body:t.toString(),method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"text/plain"}}))}catch(n){throw await t.unshiftRequest(s),n}}},be=e=>{const t=({url:e})=>e.hostname===me&&Re.test(e.pathname),s=new U({plugins:[e]});return[new i(t,s,"GET"),new i(t,s,"POST")]},xe=e=>{const t=({url:e})=>e.hostname===me&&e.pathname===ye,s=new N({cacheName:e});return new i(t,s,"GET")},ve=e=>{const t=({url:e})=>e.hostname===we&&e.pathname===ge,s=new N({cacheName:e});return new i(t,s,"GET")},Te=e=>{const t=({url:e})=>e.hostname===we&&e.pathname===_e,s=new N({cacheName:e});return new i(t,s,"GET")},Ce=(e={})=>{const t=w.getGoogleAnalyticsName(e.cacheName),s=new de(pe,{maxRetentionTime:fe,onSync:qe(e)}),n=[Te(t),xe(t),ve(t),...be(s)],a=new h;for(const r of n)a.registerRoute(r);a.addFetchListener()};s(550);const ke="workbox-expiration",Ne="cache-entries",Ue=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class Se{constructor(e){this._cacheName=e,this._db=new z(ke,1,{onupgradeneeded:e=>this._handleUpgrade(e)})}_handleUpgrade(e){const t=e.target.result,s=t.createObjectStore(Ne,{keyPath:"id"});s.createIndex("cacheName","cacheName",{unique:!1}),s.createIndex("timestamp","timestamp",{unique:!1}),Y(this._cacheName)}async setTimestamp(e,t){e=Ue(e);const s={url:e,timestamp:t,cacheName:this._cacheName,id:this._getId(e)};await this._db.put(Ne,s)}async getTimestamp(e){const t=await this._db.get(Ne,this._getId(e));return t.timestamp}async expireEntries(e,t){const s=await this._db.transaction(Ne,"readwrite",((s,n)=>{const a=s.objectStore(Ne),r=a.index("timestamp").openCursor(null,"prev"),i=[];let c=0;r.onsuccess=()=>{const s=r.result;if(s){const n=s.value;n.cacheName===this._cacheName&&(e&&n.timestamp<e||t&&c>=t?i.push(s.value):c++),s.continue()}else n(i)}})),n=[];for(const a of s)await this._db.delete(Ne,a.id),n.push(a.url);return n}_getId(e){return this._cacheName+"|"+Ue(e)}}class Ee{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new Se(e)}async expireEntries(){if(this._isRunning)return void(this._rerunRequested=!0);this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),s=await self.caches.open(this._cacheName);for(const n of t)await s.delete(n,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,J(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){const t=await this._timestampModel.getTimestamp(e),s=Date.now()-1e3*this._maxAgeSeconds;return t<s}return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}class Pe{constructor(e={}){this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const a=this._isResponseDateFresh(n),r=this._getCacheExpiration(s);J(r.expireEntries());const i=r.updateTimestamp(t.url);if(e)try{e.waitUntil(i)}catch(c){0}return a?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this._getCacheExpiration(e);await s.updateTimestamp(t.url),await s.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&Q((()=>this.deleteCacheAndMetadata()))}_getCacheExpiration(e){if(e===w.getRuntimeName())throw new n("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new Ee(e,this._config),this._cacheExpirations.set(e,t)),t}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const t=this._getDateHeaderTimestamp(e);if(null===t)return!0;const s=Date.now();return t>=s-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t),n=s.getTime();return isNaN(n)?null:n}async deleteCacheAndMetadata(){for(const[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}s(895);class Le{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some((t=>e.headers.get(t)===this._headers[t]))),t}}class Ae{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new Le(e)}}Z({prefix:"afpnews-deck"}),V([{'revision':null,'url':'css/about.f0b44e8f.css'},{'revision':'5018f00769011814696a9dd9640c2b53','url':'css/about.f0b44e8f.css.map'},{'revision':null,'url':'css/app.efd6bbec.css'},{'revision':'c926647da182c7567141f458f7c18ee9','url':'css/app.efd6bbec.css.map'},{'revision':null,'url':'css/viewer.bf2c02db.css'},{'revision':'b74b4e9d7def477b2b444648b8477989','url':'css/viewer.bf2c02db.css.map'},{'revision':'b3a4825985487d8845a4c80c87938f2f','url':'favicon.ico'},{'revision':null,'url':'fonts/PoppinsFix-400.2bf49279.woff2'},{'revision':null,'url':'fonts/PoppinsFix-400.a1032dfc.eot'},{'revision':null,'url':'fonts/PoppinsFix-400.a7f8843d.woff'},{'revision':null,'url':'fonts/PoppinsFix-600.181db245.eot'},{'revision':null,'url':'fonts/PoppinsFix-600.3f5700b2.woff2'},{'revision':null,'url':'fonts/PoppinsFix-600.b9136e7b.woff'},{'revision':null,'url':'fonts/ui-essential-normal-full.35a41dcc.eot'},{'revision':null,'url':'fonts/ui-essential-normal-full.78a3e7ca.woff'},{'revision':null,'url':'fonts/ui-essential-normal-full.e9d9e3fc.woff2'},{'revision':null,'url':'img/afpdeck_logo.42450b9d.png'},{'revision':'8bdea0295c981f5cfc6f1cd4b9ba8ebb','url':'img/background/background-1.jpg'},{'revision':'bc986fa43a967d8ee7a25de5df21e4fb','url':'img/background/background-2.jpg'},{'revision':'5848cebc4b17ed08f61426841553301f','url':'img/background/background-3.jpg'},{'revision':'c9d5c3e9807c87aa56a9cd1e674c7389','url':'img/background/background-4.jpg'},{'revision':'6eb5a29cdde7f13bd8b7ee12bcc75f6e','url':'img/background/background-5.jpg'},{'revision':'6ef193169c8fb89ba4068e1665e79f89','url':'img/icons/128x128.png'},{'revision':'2f95329cbf09d03e335637cef21d7977','url':'img/icons/16x16.png'},{'revision':'7254b6d2332d9761cb14c1406c2e8be4','url':'img/icons/192x192.png'},{'revision':'82cd33e1031987c48423bdfc8fbc9e10','url':'img/icons/24x24.png'},{'revision':'9ba9879fc61e04d750adb6ac1414d52e','url':'img/icons/256x256.png'},{'revision':'2f26542324d22a6b74e0e3f06a6dd03a','url':'img/icons/32x32.png'},{'revision':'83652e8cbf8e27fb366c021cb1109e67','url':'img/icons/48x48.png'},{'revision':'d9777f26f5deeba021d2d3ed8e1121b5','url':'img/icons/512x512.png'},{'revision':'9892d50df24e75c50cdb10b0f01b085e','url':'img/icons/64x64.png'},{'revision':'7254b6d2332d9761cb14c1406c2e8be4','url':'img/icons/android-chrome-192x192.png'},{'revision':'c0420bf531d49be9e7907116d7aab29b','url':'img/icons/apple-touch-icon-152x152.png'},{'revision':'a182dc67e218adeade0807cd50c4b421','url':'img/icons/favicon-16x16.png'},{'revision':'c4e1d4f6092b6e05f1f09602681c7aab','url':'img/icons/favicon-32x32.png'},{'revision':'cfa9f211a6f5b7f69fa34becd3e84169','url':'img/icons/msapplication-icon-144x144.png'},{'revision':'6a6701a68bec121651dc81e4da0b57fc','url':'img/icons/mstile-150x150.png'},{'revision':'9e58fa9752cbc88e1e4fccca0e8f2691','url':'img/icons/safari-pinned-tab.svg'},{'revision':'83747e9e83fe5452a6c9479fe62e99ba','url':'index.html'},{'revision':null,'url':'js/about.ca9ab36e.js'},{'revision':'fcbe33c5a1d6c8f3571fe37500791380','url':'js/about.ca9ab36e.js.map'},{'revision':null,'url':'js/app.27bc7e58.js'},{'revision':'3179a31ef70651b535b575007a18b54c','url':'js/app.27bc7e58.js.map'},{'revision':null,'url':'js/chunk-vendors.bceb9bb7.js'},{'revision':'d58d675f5086b6a1b236b11d5e4221d1','url':'js/chunk-vendors.bceb9bb7.js.map'},{'revision':'cd7a34e714de94d5c29b8ac5acdde24b','url':'js/safari-nomodule-fix.js'},{'revision':null,'url':'js/viewer.75bf7745.js'},{'revision':'b555f29df0bffffc044b5b53f623642e','url':'js/viewer.75bf7745.js.map'},{'revision':'53a0e47fd75f2d78fbf2eebc73f186a5','url':'manifest.webmanifest'},{'revision':'07fe3ed6a7bbb4d00fcc04b1b505250c','url':'noscript.css'},{'revision':'9acb275f645d36f28b37059f35f9c255','url':'service-worker.js.map'}],{ignoreUrlParametersMatching:[/.*/],cleanUrls:!1}),d(/^https:\/\/(api|afp-apicore-prod)\.afp\.com\/objects\/api\/medias\?id=.*\.jpg$/,new C({cacheName:"afpnews-images",plugins:[new Pe({maxEntries:150,maxAgeSeconds:86400,purgeOnQuotaError:!0}),new de("afpnews-images-queue",{maxRetentionTime:5}),new Ae({statuses:[0,200]})]}),"GET"),Ce(),addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&e.waitUntil(self.skipWaiting())})),addEventListener("activate",(e=>{e.waitUntil(self.clients.claim())}))}()})();
//# sourceMappingURL=service-worker.js.map