(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["browser-warning"],{"0f33":function(e,t,n){"use strict";var a=n("34ab"),i=n.n(a);i.a},"34ab":function(e,t,n){},6580:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("modal",{on:{close:function(t){return e.$router.push({name:"deck"})}}},[n("template",{slot:"header"},[n("h3",[e._v(e._s(e.$t("browser-warning.title")))]),n("router-link",{staticClass:"btn btn-icon close",attrs:{to:{name:"deck"},"aria-label":"Close"}},[n("i",{staticClass:"UI-icon UI-close-alt icon-small"})])],1),n("template",{slot:"body"},[n("p",[e._v(e._s(e.$t("browser-warning.description")))]),n("h4",[e._v(e._s(e.$t("browser-warning.unsupported-features")))]),n("ul",e._l(e.$modernizr.unsupportedFeatures,function(t){var a=t[0];return n("li",{key:a},[e._v("\n        "+e._s(a)+"\n      ")])}),0)])],2)},i=[],o=n("2b0e"),s=n("714b"),r=o["default"].extend({name:"BrowserWarning",metaInfo:{title:"Browser warning"},components:{Modal:s["a"]}}),c=r,l=(n("ca58"),n("2877")),u=Object(l["a"])(c,a,i,!1,null,"1101dfd9",null);t["default"]=u.exports},"714b":function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"modal"}},[n("div",{staticClass:"modal-mask"},[n("div",{staticClass:"modal-wrapper"},[n("div",{directives:[{name:"on-clickaway",rawName:"v-on-clickaway",value:e.close,expression:"close"}],staticClass:"modal-container"},[n("div",{staticClass:"actions"},[e._t("actions")],2),n("div",{staticClass:"modal-header"},[e._t("header")],2),n("div",{staticClass:"modal-body"},[e._t("body")],2),n("div",{staticClass:"modal-footer"},[e._t("footer")],2)])])])])},i=[],o=n("2b0e"),s=n("c7db"),r=o["default"].extend({name:"Modal",mixins:[s["mixin"]],methods:{close:function(){this.$emit("close")}}}),c=r,l=(n("0f33"),n("2877")),u=Object(l["a"])(c,a,i,!1,null,"09edb7b6",null);t["a"]=u.exports},b5ec:function(e,t,n){},c7db:function(e,t,n){"use strict";var a=n("2b0e");a="default"in a?a["default"]:a;var i="2.2.2",o=/^2\./.test(a.version);o||a.util.warn("VueClickaway "+i+" only supports Vue 2.x, and does not support Vue "+a.version);var s="_vue_clickaway_handler";function r(e,t,n){c(e);var a=n.context,i=t.value;if("function"===typeof i){var o=!1;setTimeout(function(){o=!0},0),e[s]=function(t){var n=t.path||(t.composedPath?t.composedPath():void 0);if(o&&(n?n.indexOf(e)<0:!e.contains(t.target)))return i.call(a,t)},document.documentElement.addEventListener("click",e[s],!1)}}function c(e){document.documentElement.removeEventListener("click",e[s],!1),delete e[s]}var l={bind:r,update:function(e,t){t.value!==t.oldValue&&r(e,t)},unbind:c},u={directives:{onClickaway:l}};t.version=i,t.directive=l,t.mixin=u},ca58:function(e,t,n){"use strict";var a=n("b5ec"),i=n.n(a);i.a}}]);
//# sourceMappingURL=browser-warning-legacy.128c7996.js.map