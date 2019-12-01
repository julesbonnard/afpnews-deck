(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["login"],{"50a3":function(t,e,a){"use strict";var r=a("afa2"),n=a.n(r);n.a},"714b":function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("transition",{attrs:{name:"modal"}},[a("div",{staticClass:"modal-mask"},[a("div",{staticClass:"modal-wrapper"},[a("div",{directives:[{name:"on-clickaway",rawName:"v-on-clickaway",value:t.close,expression:"close"}],staticClass:"modal-container"},[a("div",{staticClass:"actions"},[t._t("actions")],2),a("div",{staticClass:"modal-header"},[t._t("header")],2),a("div",{staticClass:"modal-body"},[t._t("body")],2),a("div",{staticClass:"modal-footer"},[t._t("footer")],2)])])])])},n=[],s=a("2b0e"),o=a("c7db"),i=s["default"].extend({name:"Modal",mixins:[o["mixin"]],methods:{close:function(){this.$emit("close")}}}),c=i,u=(a("50a3"),a("2877")),l=Object(u["a"])(c,r,n,!1,null,"0daffdc0",null);e["a"]=l.exports},a407:function(t,e,a){},a55b:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("modal",{on:{close:t.close},scopedSlots:t._u([{key:"actions",fn:function(){return[a("button",{staticClass:"btn btn-icon close",attrs:{"aria-label":"Close"},on:{click:t.close}},[a("i",{staticClass:"UI-icon UI-close-alt icon-small"})])]},proxy:!0},{key:"header",fn:function(){return[t.isAuthenticated?a("h1",[t._v(" "+t._s(t.$t("auth.success.title"))+" ")]):a("h1",[t._v(" "+t._s(t.$t("auth.not-authenticated.title"))+" ")])]},proxy:!0},{key:"body",fn:function(){return[a("form",{class:{danger:t.authError},on:{submit:function(e){return e.stopPropagation(),e.preventDefault(),t.login(e)}}},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.username,expression:"username",modifiers:{trim:!0}}],staticClass:"inpt inpt-large inpt-bg",attrs:{id:"username",placeholder:t.$t("auth.username"),"aria-label":t.$t("auth.username"),type:"text",name:"username",autocomplete:"username",required:""},domProps:{value:t.username},on:{input:function(e){e.target.composing||(t.username=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}}),a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.password,expression:"password",modifiers:{trim:!0}}],staticClass:"inpt inpt-large inpt-bg",attrs:{id:"password",placeholder:t.$t("auth.password"),"aria-label":t.$t("auth.password"),type:"password",name:"password",autocomplete:"password",required:""},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}}),a("button",{staticClass:"btn btn-large",attrs:{"aria-label":"Submit",type:"submit"}},[t._v(" "+t._s(t.$t("submit"))+" ")])])]},proxy:!0},{key:"footer",fn:function(){return[a("p",[t._v(t._s(t.$t("auth.cookies")))])]},proxy:!0}])})},n=[],s=(a("a4d3"),a("4de4"),a("4160"),a("caad"),a("0d03"),a("1d1c"),a("7a82"),a("e439"),a("dbb4"),a("b64b"),a("d3b7"),a("25f0"),a("2532"),a("159b"),a("96cf"),a("ade3")),o=a("2b0e"),i=a("714b"),c=a("2f62");function u(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}function l(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?u(Object(a),!0).forEach((function(e){Object(s["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):u(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var d=o["default"].extend({name:"Login",metaInfo:{title:"Login"},components:{Modal:i["a"]},data:function(){return{username:"",password:"",authError:!1}},computed:l({},Object(c["f"])(["credentials"]),{},Object(c["d"])(["isAuthenticated"])),methods:l({},Object(c["c"])(["authenticate"]),{login:function(){var t,e;return regeneratorRuntime.async((function(a){while(1)switch(a.prev=a.next){case 0:if(!this.username.includes("@afp.com")){a.next=4;break}return this.$toasted.show(this.$t("auth.warning-email").toString(),{position:"bottom-center",duration:1500,type:"error"}),this.authError=!0,a.abrupt("return",!1);case 4:return a.prev=4,a.next=7,regeneratorRuntime.awrap(this.authenticate({username:this.username,password:this.password}));case 7:this.$toasted.show(this.$t("auth.success.title").toString(),{position:"bottom-center",duration:1500,type:"success"}),this.authError=!1,this.$ga.enable(),t=this.$route.query.redirect,t?Array.isArray(t)?(e=t[0],e&&this.$router.push({path:e})):this.$router.push({path:t}):this.$router.push({name:"deck"}),a.next=17;break;case 14:a.prev=14,a.t0=a["catch"](4),this.authError=!0;case 17:case"end":return a.stop()}}),null,this,[[4,14]])},close:function(){this.$ga.enable(),this.$router.push({name:"deck"})}})}),p=d,m=(a("ecb1"),a("2877")),f=Object(m["a"])(p,r,n,!1,null,"57769280",null);e["default"]=f.exports},afa2:function(t,e,a){},c7db:function(t,e,a){"use strict";var r=a("2b0e");r="default"in r?r["default"]:r;var n="2.2.2",s=/^2\./.test(r.version);s||r.util.warn("VueClickaway "+n+" only supports Vue 2.x, and does not support Vue "+r.version);var o="_vue_clickaway_handler";function i(t,e,a){c(t);var r=a.context,n=e.value;if("function"===typeof n){var s=!1;setTimeout((function(){s=!0}),0),t[o]=function(e){var a=e.path||(e.composedPath?e.composedPath():void 0);if(s&&(a?a.indexOf(t)<0:!t.contains(e.target)))return n.call(r,e)},document.documentElement.addEventListener("click",t[o],!1)}}function c(t){document.documentElement.removeEventListener("click",t[o],!1),delete t[o]}var u={bind:i,update:function(t,e){e.value!==e.oldValue&&i(t,e)},unbind:c},l={directives:{onClickaway:u}};e.version=n,e.directive=u,e.mixin=l},ecb1:function(t,e,a){"use strict";var r=a("a407"),n=a.n(r);n.a}}]);
//# sourceMappingURL=login-legacy.ee13bd36.js.map