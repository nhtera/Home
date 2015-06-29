/*! jQuery v2.1.3 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.3",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=hb(),z=hb(),A=hb(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},eb=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fb){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function gb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+rb(o[l]);w=ab.test(a)&&pb(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function hb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ib(a){return a[u]=!0,a}function jb(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function kb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function lb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function nb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function ob(a){return ib(function(b){return b=+b,ib(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pb(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=gb.support={},f=gb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=gb.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",eb,!1):e.attachEvent&&e.attachEvent("onunload",eb)),p=!f(g),c.attributes=jb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=jb(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=jb(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(jb(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),jb(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&jb(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return lb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?lb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},gb.matches=function(a,b){return gb(a,null,null,b)},gb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return gb(b,n,null,[a]).length>0},gb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},gb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},gb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},gb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=gb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=gb.selectors={cacheLength:50,createPseudo:ib,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||gb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&gb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=gb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||gb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ib(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ib(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ib(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ib(function(a){return function(b){return gb(a,b).length>0}}),contains:ib(function(a){return a=a.replace(cb,db),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ib(function(a){return W.test(a||"")||gb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:ob(function(){return[0]}),last:ob(function(a,b){return[b-1]}),eq:ob(function(a,b,c){return[0>c?c+b:c]}),even:ob(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:ob(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:ob(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:ob(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=mb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=nb(b);function qb(){}qb.prototype=d.filters=d.pseudos,d.setFilters=new qb,g=gb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?gb.error(a):z(a,i).slice(0)};function rb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function tb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ub(a,b,c){for(var d=0,e=b.length;e>d;d++)gb(a,b[d],c);return c}function vb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wb(a,b,c,d,e,f){return d&&!d[u]&&(d=wb(d)),e&&!e[u]&&(e=wb(e,f)),ib(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ub(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:vb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=vb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=vb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sb(function(a){return a===b},h,!0),l=sb(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sb(tb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wb(i>1&&tb(m),i>1&&rb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xb(a.slice(i,e)),f>e&&xb(a=a.slice(e)),f>e&&rb(a))}m.push(c)}return tb(m)}function yb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=vb(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&gb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ib(f):f}return h=gb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,yb(e,d)),f.selector=a}return f},i=gb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&pb(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&rb(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&pb(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=jb(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),jb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||kb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&jb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||kb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),jb(function(a){return null==a.getAttribute("disabled")})||kb(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),gb}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+K.uid++}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){return M.access(a,b,c)
},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ab=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bb=/<([\w:]+)/,cb=/<|&#?\w+;/,db=/<(?:script|style|link)/i,eb=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/^$|\/(?:java|ecma)script/i,gb=/^true\/(.*)/,hb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ib={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ib.optgroup=ib.option,ib.tbody=ib.tfoot=ib.colgroup=ib.caption=ib.thead,ib.th=ib.td;function jb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function kb(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function lb(a){var b=gb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function mb(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function nb(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function ob(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pb(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=ob(h),f=ob(a),d=0,e=f.length;e>d;d++)pb(f[d],g[d]);if(b)if(c)for(f=f||ob(a),g=g||ob(h),d=0,e=f.length;e>d;d++)nb(f[d],g[d]);else nb(a,h);return g=ob(h,"script"),g.length>0&&mb(g,!i&&ob(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(cb.test(e)){f=f||k.appendChild(b.createElement("div")),g=(bb.exec(e)||["",""])[1].toLowerCase(),h=ib[g]||ib._default,f.innerHTML=h[1]+e.replace(ab,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=ob(k.appendChild(e),"script"),i&&mb(f),c)){j=0;while(e=f[j++])fb.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(ob(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&mb(ob(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(ob(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!db.test(a)&&!ib[(bb.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(ab,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ob(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(ob(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&eb.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(ob(c,"script"),kb),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,ob(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,lb),j=0;g>j;j++)h=f[j],fb.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(hb,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qb,rb={};function sb(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function tb(a){var b=l,c=rb[a];return c||(c=sb(a,b),"none"!==c&&c||(qb=(qb||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qb[0].contentDocument,b.write(),b.close(),c=sb(a,b),qb.detach()),rb[a]=c),c}var ub=/^margin/,vb=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wb=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};function xb(a,b,c){var d,e,f,g,h=a.style;return c=c||wb(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),vb.test(g)&&ub.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function yb(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),f.removeChild(c),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var zb=/^(none|table(?!-c[ea]).+)/,Ab=new RegExp("^("+Q+")(.*)$","i"),Bb=new RegExp("^([+-])=("+Q+")","i"),Cb={position:"absolute",visibility:"hidden",display:"block"},Db={letterSpacing:"0",fontWeight:"400"},Eb=["Webkit","O","Moz","ms"];function Fb(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Eb.length;while(e--)if(b=Eb[e]+c,b in a)return b;return d}function Gb(a,b,c){var d=Ab.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Hb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ib(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wb(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xb(a,b,f),(0>e||null==e)&&(e=a.style[b]),vb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Hb(a,b,c||(g?"border":"content"),d,f)+"px"}function Jb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",tb(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Bb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xb(a,b,d)),"normal"===e&&b in Db&&(e=Db[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?zb.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Cb,function(){return Ib(a,b,d)}):Ib(a,b,d):void 0},set:function(a,c,d){var e=d&&wb(a);return Gb(a,c,d?Hb(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=yb(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ub.test(a)||(n.cssHooks[a+b].set=Gb)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Jb(this,!0)},hide:function(){return Jb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Kb(a,b,c,d,e){return new Kb.prototype.init(a,b,c,d,e)}n.Tween=Kb,Kb.prototype={constructor:Kb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Kb.propHooks[this.prop];return a&&a.get?a.get(this):Kb.propHooks._default.get(this)},run:function(a){var b,c=Kb.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Kb.propHooks._default.set(this),this}},Kb.prototype.init.prototype=Kb.prototype,Kb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Kb.propHooks.scrollTop=Kb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Kb.prototype.init,n.fx.step={};var Lb,Mb,Nb=/^(?:toggle|show|hide)$/,Ob=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pb=/queueHooks$/,Qb=[Vb],Rb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Ob.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Ob.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sb(){return setTimeout(function(){Lb=void 0}),Lb=n.now()}function Tb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ub(a,b,c){for(var d,e=(Rb[b]||[]).concat(Rb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Vb(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||tb(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Nb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?tb(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ub(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xb(a,b,c){var d,e,f=0,g=Qb.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Lb||Sb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Lb||Sb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wb(k,j.opts.specialEasing);g>f;f++)if(d=Qb[f].call(j,a,k,j.opts))return d;return n.map(k,Ub,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xb,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Rb[c]=Rb[c]||[],Rb[c].unshift(b)},prefilter:function(a,b){b?Qb.unshift(a):Qb.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xb(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Tb(b,!0),a,d,e)}}),n.each({slideDown:Tb("show"),slideUp:Tb("hide"),slideToggle:Tb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Lb=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Lb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Mb||(Mb=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Mb),Mb=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Yb,Zb,$b=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Zb:Yb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))
},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Zb={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$b[b]||n.find.attr;$b[b]=function(a,b,d){var e,f;return d||(f=$b[b],$b[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$b[b]=f),e}});var _b=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_b.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ac=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ac," ").indexOf(b)>=0)return!0;return!1}});var bc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cc=n.now(),dc=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var ec=/#.*$/,fc=/([?&])_=[^&]*/,gc=/^(.*?):[ \t]*([^\r\n]*)$/gm,hc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,ic=/^(?:GET|HEAD)$/,jc=/^\/\//,kc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,lc={},mc={},nc="*/".concat("*"),oc=a.location.href,pc=kc.exec(oc.toLowerCase())||[];function qc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function rc(a,b,c,d){var e={},f=a===mc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function sc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function tc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function uc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:oc,type:"GET",isLocal:hc.test(pc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":nc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?sc(sc(a,n.ajaxSettings),b):sc(n.ajaxSettings,a)},ajaxPrefilter:qc(lc),ajaxTransport:qc(mc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=gc.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||oc)+"").replace(ec,"").replace(jc,pc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=kc.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===pc[1]&&h[2]===pc[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(pc[3]||("http:"===pc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),rc(lc,k,b,v),2===t)return v;i=n.event&&k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!ic.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(dc.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=fc.test(d)?d.replace(fc,"$1_="+cc++):d+(dc.test(d)?"&":"?")+"_="+cc++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+nc+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=rc(mc,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=tc(k,v,f)),u=uc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var vc=/%20/g,wc=/\[\]$/,xc=/\r?\n/g,yc=/^(?:submit|button|image|reset|file)$/i,zc=/^(?:input|select|textarea|keygen)/i;function Ac(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||wc.test(a)?d(a,e):Ac(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Ac(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Ac(c,a[c],b,e);return d.join("&").replace(vc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&zc.test(this.nodeName)&&!yc.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(xc,"\r\n")}}):{name:b.name,value:c.replace(xc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Bc=0,Cc={},Dc={0:200,1223:204},Ec=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Cc)Cc[a]()}),k.cors=!!Ec&&"withCredentials"in Ec,k.ajax=Ec=!!Ec,n.ajaxTransport(function(a){var b;return k.cors||Ec&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Bc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Cc[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Dc[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Cc[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Fc=[],Gc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Fc.pop()||n.expando+"_"+cc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Gc.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Gc,"$1"+e):b.jsonp!==!1&&(b.url+=(dc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Fc.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Hc=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Hc)return Hc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Ic=a.document.documentElement;function Jc(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Jc(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Ic;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ic})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Jc(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=yb(k.pixelPosition,function(a,c){return c?(c=xb(a,b),vb.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Kc=a.jQuery,Lc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Lc),b&&a.jQuery===n&&(a.jQuery=Kc),n},typeof b===U&&(a.jQuery=a.$=n),n});


/// Rennder Platform : global.js ///

//global variables
var scrollbarW = 0;
var winPosChange = true;
var winPosVal = null;

//special functions
function $R(id) {
    return document.getElementById(id);
}

function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}
function ltrim(stringToTrim) {
    return stringToTrim.replace(/^\s+/, "");
}
function rtrim(stringToTrim) {
    return stringToTrim.replace(/\s+$/, "");
}

function left(str, n) {
    if (n <= 0) {
        return "";
    } else if (n > String(str).length) {
        return str;
    } else {
        return String(str).substring(0, n);
    }
}
function right(str, n) {
    if (n <= 0) {
        return "";
    } else if (n > String(str).length) {
        return str;
    } else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}

function isNumeric(sText) {
    return (sText - 0); //javascript forces boolean value even if it is not a numeric string
}

function isValidText(sText, ValidChars, extraChars) {

    var valchar = '';
    valchar = ValidChars;
    if (valchar == '') { valchar = '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    valchar += extraChars;
    var Char = '';
    for (i = 0; i < sText.length; i++) {
        Char = sText.charAt(i);
        if (valchar.indexOf(Char) == -1) {
            return false;
        }
    }
    return true;
}

function getElementFromEvent(event) {
    var obj = new Object();
    if (R.browser.isIE) {
        obj = window.event.srcElement;
    }
    if (R.browser.isNS) {
        obj = event.target;
    }
    return obj;
}

function windowPos() {
    if (winPosChange == false) { return winPosVal; } else {
        winPosChange = false;
        //cross-browser compatible window dimensions
        var scrollx = 0;
        var scrolly = 0;
        var w = 0;
        var h = 0;
        scrollx = window.scrollX;
        scrolly = window.scrollY;
        if (typeof scrollx == 'undefined') {
            scrollx = document.body.scrollLeft;
            scrolly = document.body.scrollTop;
            if (typeof scrollx == 'undefined') {
                scrollx = window.pageXOffset;
                scrolly = window.pageYOffset;
                if (typeof scrollx == 'undefined') {
                    z = GetZoomFactor();
                    scrollx = Math.round(document.documentElement.scrollLeft / z);
                    scrolly = Math.round(document.documentElement.scrollTop / z);
                }
            }
        }
        if (arguments[0] == 1) { return winPosVal; }

        if (document.documentElement) {
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        }
        if (R.browser.isNS) {
            w = window.innerWidth;
            h = window.innerHeight;
        }

        //detect vertical scrollbar
        if ($(document.body).height() <= h || window.location.href.indexOf('&a=') > -1) {
            if ($('body').css('overflowY') != 'hidden') { $('body').css({ 'overflowY': 'hidden' }); }

        } else {
            if ($('body').css('overflowY') != 'auto') { $('body').css({ 'overflowY': 'auto' }); }
            w = w - getScrollBarWidth(); //scrollbar fix
        }
        winPosVal = { scrollx: scrollx, scrolly: scrolly, w: w, h: h };
        return winPosVal;
    }
}

function mousePos(event) {
    //cross-broswer compatible mouse X & Y position
    var x = 0;
    var y = 0;
    if (R.browser.isIE) {
        x = window.event.clientX;
        y = window.event.clientY;
    }
    if (R.browser.isNS) {
        x = event.clientX;
        y = event.clientY;
    }
    return { x: x, y: y };
}

function elementPos(elem) {
    //cross-browser compatible element x & y position & width & height
    var x = 0, y = 0, w = 0, h = 0, myelem = elem;
    if (typeof elem != 'undefined' && elem != null) {
        while (elem.offsetParent) {
            x += elem.offsetLeft + (elem.clientLeft || 0);
            y += elem.offsetTop + (elem.clientTop || 0);
            elem = elem.offsetParent;
        }
        w = myelem.offsetWidth ? myelem.offsetWidth : myelem.clientWidth;
        h = myelem.offsetHeight ? myelem.offsetHeight : myelem.clientHeight;
        if (h == 0) { if (typeof $ != 'undefined') { h = $(myelem).height(); } }
    }
    return { x: x, y: y, w: w, h: h };
}

function offsetPos(myelem) {
    return {
        y: myelem.offsetTop ? myelem.offsetTop : myelem.clientTop,
        x: myelem.offsetLeft ? myelem.offsetLeft : myelem.clientLeft,
        w: myelem.offsetWidth ? myelem.offsetWidth : myelem.clientWidth,
        h: myelem.offsetHeight ? myelem.offsetHeight : myelem.clientHeight
    }
}

function GetZoomFactor() {
    var factor = 1;
    if (document.body.getBoundingClientRect) {
        // rect is only in physical pixel size in IE before version 8 
        var rect = document.body.getBoundingClientRect();
        var physicalW = rect.right - rect.left;
        var logicalW = document.body.offsetWidth;

        // the zoom level is always an integer percent value
        factor = Math.round((physicalW / logicalW) * 100) / 100;
    }
    return factor;
}

function centerElement(elementId) {
    var myElem = $R(elementId);
    if (myElem) {
        var winPos = windowPos();
        var ePos = elementPos(myElem);
        myElem.style.left = ((winPos.w / 2) - (ePos.w / 2) + winPos.scrollx) + "px";
        myElem.style.top = ((winPos.h / 2) - (ePos.h / 2) + winPos.scrolly) + "px";
    }
}

function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) {
        num = "0";
    }
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10) {
        cents = "0" + cents;
    }
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}

function htmlEncode(txt) {
    var r = txt;
    r = Replace(/\&/g, "&amp;");
    r = Replace(/\</g, "&lt;");
    r = Replace(/\>/g, "&gt;");

    return r;
}

function htmlDecode(txt) {
    var r = txt;
    r = Replace(/'&amp;'/g, "&");
    r = Replace(/'&lt;'/g, "<");
    r = Replace(/'&gt;'/g, ">");
    return r;

}

function rgb2hex(rgb) {
    if (rgb == null || rgb == undefined || rgb == '') { return ''; }
    if (rgb.indexOf("#") > -1) { return rgb; }
    if (rgb.indexOf("rgb") == -1) { return "#" + rgb; }
    var r = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (r == null) { r = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/); }
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(r[1]) + hex(r[2]) + hex(r[3]);
}

function hex2rgb(hex, opacity) {
    var rgb = hex.replace('#', '').match(/(.{2})/g);

    var i = 3;
    while (i--) {
        rgb[i] = parseInt(rgb[i], 16);
    }

    if (typeof opacity == 'undefined') {
        return 'rgb(' + rgb.join(', ') + ')';
    }

    return 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
};

function getScrollBarWidth() {
    if (scrollbarW != 0) { return scrollbarW; }
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);
    scrollbarW = w1 - w2;
    if (scrollbarW < 10) { scrollbarW = 25; }
    return (scrollbarW);
};



/// Rennder Platform : fixes.js ///

/// Rennder Platform : rml.js ///
/// <reference path="global.js" />
/// <reference path="view.js" />
/// <reference path="responsive.js" />

//#region 'Menu System'
function selectMenuItem(menuId, itemId, count) {
    resetMenuItems(menuId, count || 10);
    $R(menuId + "_item" + itemId + "Over").style.display = "none";
    $R(menuId + "_item" + itemId).style.display = "none";
    $R(menuId + "_itemSelected" + itemId).style.display = "block";
}

function resetMenuItems(menuId, count) {
    for (x = 1; x <= count; x++) {
        if (typeof $R(menuId + "_itemSelected" + x) != 'undefined') {
            $R(menuId + "_itemSelected" + x).style.display = "none";
            $R(menuId + "_item" + x + "Over").style.display = "none";
            $R(menuId + "_item" + x).style.display = "block";
        }
    }
}

function mouseOverMenuItem(menuId, itemId) {
    if ($R(menuId + "_itemSelected" + itemId).style.display == 'none' && $R(menuId + "_item" + itemId).style.display != "none") {
        $('#' + menuId + "_item" + itemId).hide();
        $('#' + menuId + "_item" + itemId + "Over").show();
    }
}

function mouseOutMenuItem(menuId, itemId) {
    if ($R(menuId + "_itemSelected" + itemId).style.display == 'none' && $R(menuId + "_item" + itemId + "Over").style.display != 'none') {
        $('#' + menuId + "_item" + itemId + "Over").hide();
        $('#' + menuId + "_item" + itemId).show();
    }
}

var menuDropdownTimer = null, menuDropdown = [{ panelId: '', menuId: '', menuItemId: '', direction: '', transition: '', speed: 0, offsetX: 0, offsetY: 0, altside: '', mouse: { cPos: { x: 0, y: 0, w: 0, h: 0 }, pPos: { x: 0, y: 0, w: 0, h: 0 }, winPos: { w: 0, h: 0, scrolly: 0, scrollx: 0 } } }];
var menuWatch = false, menuLength = 0;
function menuShowDropdownPanel(panelId, menuId, menuItemId, direction, transition, speed, offsetX, offsetY, showCbox) {
    if (menuDropdownTimer != null) { clearTimeout(menuDropdownTimer); menuDropdownTimer = null; }
    if (menuDropdown[menuLength].panelId != '' && menuDropdown[menuLength].menuId == menuId && menuDropdown[menuLength].panelId != panelId) { menuHideDropdownPanelFinish(menuId); }

    //increment menu array
    if (menuDropdown[menuLength].menuId != '' && menuDropdown[menuLength].menuId != menuId) {
        menuLength += 1;
        menuDropdown[menuLength] = { panelId: '', menuId: '', menuItemId: '', direction: '', transition: '', speed: 0, offsetX: 0, offsetY: 0, altside: '', mouse: { cPos: { x: 0, y: 0, w: 0, h: 0 }, pPos: { x: 0, y: 0, w: 0, h: 0 }, winPos: { w: 0, h: 0, scrolly: 0, scrollx: 0 } } };
    }

    var c = $R(menuItemId), p = $R(panelId), b = $R(menuItemId).parentNode;
    if (p.style.display == 'none') { $(p).css({ opacity: 0 }).show(); }
    var cPos = R.elem.pos(c), bPos = R.elem.pos(b), pPos = R.elem.pos(p);
    var winPos = windowPos();
    var startPos = { x: 0, y: 0 }, finalPos = { x: 0, y: 0 };
    var sides = direction.split(',');
    var altside = sides[R.responsive.level];
    var offsetT = 0, offsetB = 0, offsetXbody = 0;
    if (R.editor.editMode == true) { offsetT = 54; offsetB = 0; }

    if (typeof altside == 'undefined') { altside = 'bottom'; }
    var pagePos = { x: 0, y: 0, w: 0, h: 0 };
    if (altside == '') {
        //find alternative level setting
        var dir = [4, 3, 2, 1, 0];
        switch (R.responsive.level) {
            case 0: dir = [1, 2, 3, 4]; break;
            case 1: dir = [2, 3, 4, 0]; break;
            case 2: dir = [3, 4, 1, 0]; break;
            case 3: dir = [4, 2, 1, 0]; break;
            case 4: dir = [3, 2, 1, 0]; break;
        }
        for (var x = 0; x < dir.length; x++) {
            if (sides[dir[x]] != '') {
                altside = sides[dir[x]]; break;
            }
        }
    }

    //change altside based on window boundaries
    var i = 0;
    do {
        i++;
        switch (altside) {
            case "top":
                if (cPos.y - pPos.h - offsetT + offsetY <= 0) { altside = "bottom"; i = 3; }
                break;
            case "right":
                if (cPos.x + cPos.w + offsetX + offsetXbody + pPos.w >= winPos.w) { altside = "bottom"; i = 1 }
                break;
            case "bottom":
                if (cPos.y + cPos.h + pPos.h + offsetT + offsetB + offsetY >= winPos.h) { altside = "top"; i = 3 }
                break;
            case "left":
                if (cPos.x - pPos.w + offsetX + offsetXbody <= 0) { altside = "bottom"; i = 1; }
                break;
        }
    } while (i < 3);



    //figure out final position of drop down menu
    switch (altside) {
        case "top":
            finalPos.x = cPos.x + offsetX + offsetXbody;
            finalPos.y = cPos.y - pPos.h + offsetY;
            break;
        case "right":
            finalPos.x = cPos.x + cPos.w + offsetX + offsetXbody;
            finalPos.y = cPos.y + offsetY;
            break;
        case "bottom":
            finalPos.x = cPos.x + offsetX + offsetXbody;
            finalPos.y = cPos.y + cPos.h + offsetY;
            break;
        case "left":
            finalPos.x = cPos.x - pPos.w + offsetX + offsetXbody;
            finalPos.y = cPos.y + offsetY;
            break;
    }

    if (R.editor.editMode == true) { finalPos.y -= 50; }
    if (b.style.left == "100%") {
        finalPos.x += bPos.w; //right-aligned component
    }

    //realign menu if it overflows outside the window bounds
    if (finalPos.x + pPos.w > winPos.w) {
        finalPos.x = winPos.w - pPos.w;
    }
    if (finalPos.x < 0) { finalPos.x = 0; }

    //align the drop down menu & animate transition (if needed)
    console.log(finalPos);
    switch (transition) {
        case "none":
            $(p).stop().css({ opacity: 1, left: finalPos.x, top: finalPos.y }).show()
            
            speed = 0;
            break;
        case "slideout":
            switch (sides[R.responsive.level]) {
                case "top":
                    break;
                case "right":

                    break;
                case "bottom":

                    break;
                case "left":

                    break;
            }
            break;
        case "fadein":
            $(p).stop().css({ opacity: 0, left: finalPos.x, top: finalPos.y }).show().animate({ opacity: 1 }, speed * 1000);
            break;
        case "expand":

            break;
    }

    if (R.editor.editMode == true) {
        saveResponsiveDesignProperties(p, null, null, null, null, null, { x: finalPos.x, y: finalPos.y }, null, null);
    }

    //show component box if neccessary
    if (showCbox == true) {
        setTimeout("$R('componentbox').setAttribute('piece','" + panelId + "');modifyComponent('" + panelId + "');modifyComponent('" + panelId + "');", speed * 1100);
        //menuWatch = true;
    }

    //save current selected dropdown settings
    menuDropdown[menuLength].panelId = panelId;
    menuDropdown[menuLength].menuId = menuId;
    menuDropdown[menuLength].menuItemId = menuItemId;
    menuDropdown[menuLength].direction = direction;
    menuDropdown[menuLength].transition = transition;
    menuDropdown[menuLength].speed = speed;
    menuDropdown[menuLength].offsetX = offsetX;
    menuDropdown[menuLength].offsetY = offsetY;
    menuDropdown[menuLength].altside = altside;
    menuDropdown[menuLength].mouse = { cPos: { x: 0, y: 0, w: 0, h: 0 }, pPos: { x: 0, y: 0, w: 0, h: 0 }, winPos: { w: 0, h: 0, scrolly: 0, scrollx: 0 } };
}

function menuHideDropdownPanel(event) {
    if (menuWatch === true) { return; }
    if (menuDropdownTimer != null) { menuCancelHideDropdownPanel(event); }
    menuDropdownTimer = setTimeout(function () { menuWatchMouseMoveForDropdownPanel(event) }, 500);
}

function menuWatchMouseMoveForDropdownPanel(event) {
    menuWatch = true;
    // Capture mousemove and mouseup events on the page.
    if (R.browser.isIE) {
        document.attachEvent("onmousemove", menuDropdownWatchMouseMove);
        //document.attachEvent("onmouseup", menuDropdownWatchMouseUp);
        window.event.cancelBubble = true;
        window.event.returnValue = false;
        document.onselectstart = function () { return false; };
    }
    if (R.browser.isNS) {
        document.addEventListener("mousemove", menuDropdownWatchMouseMove, true);
        //document.addEventListener("mouseup", menuDropdownWatchMouseUp, true);
        event.preventDefault();
        return false;
    }
}

function menuDropdownWatchMouseMove(event) {
    if (menuDropdownTimer != null) { clearTimeout(menuDropdownTimer); menuDropdownTimer = null; }
    var item = $R(menuDropdown[menuLength].menuItemId);
    var panel = $R(menuDropdown[menuLength].panelId);
    var piece = null; if ($R('componentbox')) { piece = $R('componentbox').getAttribute('piece'); }
    if (piece != null) {
        if (piece != '') {
            if (piece = item.id) {
                //menuCancelHideDropdownPanel(event);
                return;
            }

            //find the parent
            var p = $('#' + piece).parent('#' + item.id);
            if (p.length > 0) { return; }
        }
    }
    if (typeof item != 'undefined' && item != null && typeof panel != 'undefined' && panel != null) {
        var mPos = mousePos(event), cPos, pPos, winPos;
        if (menuDropdown[menuLength].mouse.winPos.w == 0) {
            cPos = R.elem.pos(item);
            pPos = R.elem.pos(panel);
            winPos = windowPos();
            menuDropdown[menuLength].mouse.cPos = cPos;
            menuDropdown[menuLength].mouse.pPos = pPos;
            menuDropdown[menuLength].mouse.winPos = winPos;
        } else {
            cPos = menuDropdown[menuLength].mouse.cPos;
            pPos = menuDropdown[menuLength].mouse.pPos;
            winPos = menuDropdown[menuLength].mouse.winPos;
        }
        if (hitTestManual(mPos.x, mPos.y + winPos.scrolly, cPos.x, cPos.y, cPos.w, cPos.h) == false && hitTestManual(mPos.x, mPos.y + winPos.scrolly, pPos.x, pPos.y, pPos.w, pPos.h) == false) {
            menuWatch = false;
            menuDropdownCancelEventBubble(event);
            menuHideDropdownPanelFinish(menuDropdown[menuLength].menuId);
            menuDropdownWatchMouseMove(event);
            //menuHideDropdownPanel(event);
        }
    }
}

function menuCancelHideDropdownPanel(event) {
    if (menuDropdownTimer != null) { clearTimeout(menuDropdownTimer); menuDropdownTimer = null; }
    menuDropdownCancelEventBubble(event);
}

function menuDropdownCancelEventBubble(event) {
    menuWatch = false;
    if (R.browser.isIE) {
        document.detachEvent("onmousemove", menuDropdownWatchMouseMove);
        document.onselectstart = null;
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
    if (R.browser.isNS) {
        document.removeEventListener("mousemove", menuDropdownWatchMouseMove, true);
        try { event.preventDefault(); } catch (ex) { }
    }
}

function menuHideDropdownPanelFinish(menuId) {
    if (menuDropdown[menuLength].menuId != menuId) { return; }
    var m = menuDropdown[menuLength];
    var item = $R(m.menuItemId);
    var panel = $R(m.panelId);
    var piece = null; if ($R('componentbox')) { piece = $R('componentbox').getAttribute('piece'); }
    if (piece != null) { if (piece != '') { if (piece = item.id) { return; } } }

    var c = $R(m.menuItemId), p = $R(m.panelId);
    var cPos = R.elem.pos(c), pPos = R.elem.pos(p);
    var startPos = { x: 0, y: 0 }, finalPos = { x: 0, y: 0 }
    switch (m.altside) {
        case "top":
            finalPos.x = cPos.x + m.offsetX;
            finalPos.y = cPos.y - pPos.h + m.offsetY;
            break;
        case "right":
            finalPos.x = cPos.x + cPos.w + m.offsetX;
            finalPos.y = cPos.y + m.offsetY;
            break;
        case "bottom":
            finalPos.x = cPos.x + m.offsetX;
            finalPos.y = cPos.y + cPos.h + m.offsetY;
            break;
        case "left":
            finalPos.x = cPos.x - pPos.w + m.offsetX;
            finalPos.y = cPos.y + m.offsetY;
            break;
    }


    switch (m.transition) {
        case "none":
            p.style.left = '-1000px';
            p.style.top = '-1000px';
            speed = 0;
            break;
        case "slideout":
            switch (sides[R.responsive.level]) {
                case "top":

                    break;
                case "right":

                    break;
                case "bottom":

                    break;
                case "left":

                    break;
            }
            break;
        case "fadein":
            $(p).stop().animate({ opacity: 0 }, m.speed * 1000, function () { $(this).css({ left: -1000, top: -1000 }); });
            setTimeout("var p = $R(" + m.panelId + ");p.style.left = '-1000px'; p.style.top = '-1000px';", m.speed + 1050);
            break;
        case "expand":
            break;
    }

    if (R.editor.editMode == true) {
        setTimeout("saveResponsiveDesignProperties($R('" + m.panelId + "'), null, null, null, null, null, {x:-1000,y:-1000,w:" + pPos.w + ",h:" + pPos.h + "}, null, null);", speed * 1100);
    }


    menuDropdown[menuLength].panelId = '';
    menuDropdown[menuLength].menuId = '';
    if (menuLength > 0) { menuDropdown.splice(menuLength, 1); menuLength -= 1; }
}

function menuHideAllDropdownPanels() {
    getResizeSelectors();
    divSel[9].each(function () {
        var pId = this.getAttribute('data-panelid');
        if (typeof pId != 'undefined' && pId != null) {
            var p = $('div[itemid="' + pId + '"]');
            if (p.length > 0) {
                p.css({ opacity: 0, left: -1000, top: -1000 }).show();
            }
        }
    });

}
//#endregion



//#region 'Treeview'
function treeExpand(id) {
    $('#' + id + '_sub').show();
    $('#' + id + '_expand').hide();
    $('#' + id + 'Over_expand').hide();
    $('#' + id + 'Selected_expand').hide();
    $('#' + id + '_minimize').show();
    $('#' + id + 'Over_minimize').show();
    $('#' + id + 'Selected_minimize').show();
    resizeDivs();
    resizeRennder();

}

function treeMinimize(id) {
    $('#' + id + '_sub').hide();
    $('#' + id + '_expand').show();
    $('#' + id + 'Over_expand').show();
    $('#' + id + 'Selected_expand').show();
    $('#' + id + '_minimize').hide();
    $('#' + id + 'Over_minimize').hide();
    $('#' + id + 'Selected_minimize').hide();
    resizeDivs();
    resizeRennder();
}
//#endregion

//#region 'Grid'

var listOldSel = 0;
var listOldSelid = 1;
var listOldSelrow = -1;
var listOldCount = 0;
var ismouseoverow = '';
var ismouseover = new Array();

function mouseOverRmlList(row, col, ccount, id) {
    try { clearTimeout(ismouseover[row]); } catch (ex) {; }
    var istrue = false;
    if (((listOldSelrow != row) && listOldSelid == id) || (listOldSel != col && listOldSelrow != row)) {
        istrue = true;
    }
    if (istrue == true) {
        for (x = 1; x <= ccount; x++) {
            document.getElementById(id + "d" + row + '_' + x).style.display = "none";
            document.getElementById(id + "o" + row + '_' + x).style.display = "block";
        }
    }
    ismouseoverow = row;
}

function mouseOutRmlList(row, col, ccount, id) {
    if (ismouseoverow == row) {
        ismouseoverow = '';
    }
    ismouseover[row] = setTimeout(function () { mouseOutRmlListFinish(row, col, ccount, id); }, 50);
}

function mouseOutRmlListFinish(row, col, ccount, id) {
    if (ismouseoverow != row) {
        var hideit = false;
        if (document.getElementById(id + "s" + row + '_' + col)) {
            if (document.getElementById(id + "s" + row + '_' + col).style.display == 'none') {
                hideit = true;
            }
        }
        else { hideit = true; }
        if (hideit == true) {
            for (x = 1; x <= ccount; x++) {
                document.getElementById(id + "o" + row + '_' + x).style.display = "none";
                document.getElementById(id + "d" + row + '_' + x).style.display = "block";
            }
        }
    }
}

function selectRmlList(row, col, ccount, id) {
    try {
        if (((listOldSel != col || listOldSelrow != row) && listOldSelid == id) || (listOldSel != col || listOldSelrow != row)) {
            for (x = 1; x <= listOldCount; x++) {
                document.getElementById(listOldSelid + "o" + listOldSelrow + '_' + x).style.display = "none";
                document.getElementById(listOldSelid + "s" + listOldSelrow + '_' + x).style.display = "none";
                document.getElementById(listOldSelid + "d" + listOldSelrow + '_' + x).style.display = "block";
            }
        }
    } catch (ex) { };
    listOldSel = col;
    listOldSelid = id;
    listOldSelrow = row;
    listOldCount = ccount;
    for (x = 1; x <= ccount; x++) {
        document.getElementById(id + "d" + row + '_' + x).style.display = "none";
        document.getElementById(id + "o" + row + '_' + x).style.display = "none";
        document.getElementById(id + "s" + row + '_' + x).style.display = "block";
    }
}
//#endregion

//#region 'Buttons'
function buttonPress(id) {
    var me = $R(id + '_onclick');
    if (me != undefined) {
        try {
            var onclick = me.getAttribute('onclick');
            me.setAttribute('onclick', '');
            $('#' + id + 'buttons').animate({ opacity: 0 }, 500).animate({ opacity: 0 }, 5000).animate({ opacity: 1 }, 500);
            $('#' + id + 'loading').css({ opacity: 0, display: 'block' }).animate({ opacity: 1 }, 500).animate({ opacity: 1 }, 5000).animate({ opacity: 0 }, 500);
            me.style.cursor = '';
            setTimeout("if($R('" + id + "_button').getAttribute('onclick')==''){$R('" + id + "_button').setAttribute('onclick','" + onclick.replace(/\'/g, "\\'") + "');$R('" + id + "_button').style.cursor='pointer';}", 5500);
        } catch (ex) { }
    }
}
//#endregion

//#region 'Textbox'
function FocusTextbox(id) {
    try {
        $('#div' + id + '_blank').hide();
        $('#div' + id).show();
    } catch (ex) { }
    try {
        $('#' + id).focus();
        $('#' + id).select();
    } catch (ex) { }
}

function BlurTextbox(id) {
    try {
        if ($R(id + '_' + id).value == '') {
            $('#div' + id).hide();
            $('#div' + id + '_blank').show();
        }
    } catch (ex) { }
    try {
        if ($R(id).value == '') {
            $('#div' + id).hide();
            $('#div' + id + '_blank').show();
        }
    } catch (ex) { }
}
//#endregion













/// Rennder Platform : view.js ///
/// <reference path="global.js" />
/// <reference path="responsive.js" />
var R = {
    window: {
        w: 0, h: 0, scrollx: 0, scrolly: 0, z: 0, absolute: { w: 0, h: 0 }, changed: true,

        pos:function(){
            if (this.changed == false) { return this; } else {
                this.changed = false;
                //cross-browser compatible window dimensions
                this.scrollx = window.scrollX;
                this.scrolly = window.scrollY;
                if (typeof scrollx == 'undefined') {
                    this.scrollx = document.body.scrollLeft;
                    this.scrolly = document.body.scrollTop;
                    if (typeof scrollx == 'undefined') {
                        this.scrollx = window.pageXOffset;
                        this.scrolly = window.pageYOffset;
                        if (typeof scrollx == 'undefined') {
                            this.z = GetZoomFactor();
                            this.scrollx = Math.round(document.documentElement.scrollLeft / this.z);
                            this.scrolly = Math.round(document.documentElement.scrollTop / this.z);
                        }
                    }
                }
                if (arguments[0] == 1) { return this; }

                if (document.documentElement) {
                    this.w = document.documentElement.clientWidth;
                    this.h = document.documentElement.clientHeight;
                }
                if (R.browser.isNS) {
                    this.w = window.innerWidth;
                    this.h = window.innerHeight;
                }

                this.absolute.w = R.elem.width($('.body')[0]);
                this.absolute.h = this.h;
                

                //detect vertical scrollbar
                if ($(document.body).height() <= this.h || window.location.href.indexOf('&a=') > -1) {
                    if ($('body').css('overflowY') != 'hidden') { $('body').css({ 'overflowY': 'hidden' }); }

                } else {
                    if ($('body').css('overflowY') != 'auto') { $('body').css({ 'overflowY': 'auto' }); }
                    this.absolute.w = R.elem.width($('.body')[0]);
                }
                return this;
            }
        }

    },

    elem: {
        get: function(id){
            return document.getElementById(id);
        },

        pos: function(elem){
            var x = 0, y = 0, w = 0, h = 0;
            if (typeof elem != 'undefined' && elem != null) {
                var e = elem;
                while (e.offsetParent) {
                    x += e.offsetLeft + (e.clientLeft || 0);
                    y += e.offsetTop + (e.clientTop || 0);
                    e = e.offsetParent;
                }
                w = elem.offsetWidth ? elem.offsetWidth : elem.clientWidth;
                h = elem.offsetHeight ? elem.offsetHeight : elem.clientHeight;
                if (h == 0) {h = $(elem).height(); }
            }
            return { x: x, y: y, w: w, h: h };
        },

        offset:function(elem){
            return {
                y: elem.offsetTop ? elem.offsetTop : elem.clientTop,
                x: elem.offsetLeft ? elem.offsetLeft : elem.clientLeft,
                w: elem.offsetWidth ? elem.offsetWidth : elem.clientWidth,
                h: elem.offsetHeight ? elem.offsetHeight : elem.clientHeight
            }
        },

        width:function(elem){
            return elem.offsetWidth ? elem.offsetWidth : elem.clientWidth;
        },

        height:function(elem){
            return elem.offsetHeight ? elem.offsetHeight : elem.clientHeight;
        },

        fromEvent: function(event){
            if (R.browser.isIE) { return window.event.srcElement;
            } else if (R.browser.isNS) { return event.target; }
            return null;
        },

        panel: function (elem) {
            var p = $(elem).parents('.ispanel');
            if (p.length > 0) { return p[0]; }
            return null;
        }

    },

    page: {
        id:0, title: '', useAjax: false,

        bg: {
            YTPlayer: {
                destroy: function () {
                    $('#wrapper_mbYTP_updateBackground').hide();
                }
            }
        }
    },


    events: {

        doc: {
            load: function () {
                
            },

            ready: function () {
                R.events.doc.resize.trigger();
                R.events.doc.resize.go();
                R.events.doc.resize.stop();
            },

            click: {
                trigger: function (target) {
                    
                    var type = 'bg';
                    var t = $(target);
                    if (t.parents('.component').length > 0 || t.hasClass('component') == true) {
                        type = 'component';
                    } else if (t.parents('.window').length > 0 || t.hasClass('window') == true) {
                        type = 'window';
                    } else if (t.parents('.toolbar').length > 0 || t.hasClass('toolbar') == true) {
                        type = 'toolbar';
                    } else if (t.parents('.component-select').length > 0 || t.hasClass('component-select') == true) {
                        type = 'component-select';
                    } else if (t.parents('.tools').length > 0) {
                        type = 'tools';
                    }
                    this.callback.execute(target, type);
                },

                callback: {
                    //register & execute callbacks when the user clicks anywhere on the document
                    items: [],

                    add: function (elem, vars, onClick) {
                        this.items.push({ elem: elem, vars: vars, onClick: onClick});
                    },

                    remove: function (elem) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (this.items[x].elem == elem) { this.items.splice(x, 1); x--;}
                        }
                    },

                    execute: function (target, type) {
                        if (this.items.length > 0) {
                            for (var x = 0; x < this.items.length; x++) {
                                if (typeof this.items[x].onClick == 'function') {
                                    this.items[x].onClick(target, type);
                                }
                            }
                        }
                    }
                }
            },

            scroll: {
                timer: { started: false, fps: 60, timeout: 250, date: new Date(), callback: null },
                last: { scrollx: 0, scrolly: 0 },

                trigger: function () {
                    this.timer.date = new Date();
                    if (this.timer.started == false) { this.start(); }
                },

                start: function(){
                    if (this.timer.started == true) { return; }
                    this.timer.started = true;
                    this.timer.date = new Date();
                    this.go();
                },

                go: function () {
                    if (this.timer.started == false) { return; }
                    this.last.scrollx = window.scrollX;
                    this.last.scrolly = window.scrollY;
                    R.window.scrollx = this.last.scrollx;
                    R.window.scrolly = this.last.scrolly;

                    if (new Date() - this.timer.date > this.timer.timeout) {
                        this.stop();
                    } else {
                        this.timer.callback = setTimeout(function () { R.events.doc.scroll.go(); }, 1000 / this.timer.fps)
                    }
                },

                stop: function () {
                    if (this.timer.started == false) { return; }
                    this.timer.started = false;
                    this.last.scrollx = window.scrollX;
                    this.last.scrolly = window.scrollY;
                    R.window.scrollx = this.last.scrollx;
                    R.window.scrolly = this.last.scrolly;
                }
            },

            resize: {
                timer: { started: false, fps: 60, timeout: 100, date: new Date(), callback: null },

                trigger: function () {
                    this.timer.date = new Date();
                    if (this.timer.started == false) { this.start(); }
                },

                start: function () {
                    if (this.timer.started == true) { return; }
                    this.timer.started = true;
                    this.timer.date = new Date();
                    this.callback.execute('onStart');
                    this.go();
                },

                go: function () {
                    R.window.changed = true; R.window.pos();
                    if (this.timer.started == false) { return; }
                    this.callback.execute('onGo');
                    R.events.render.trigger();

                    if (new Date() - this.timer.date > this.timer.timeout) {
                        this.stop();
                    } else {
                        this.timer.callback = setTimeout(function () { R.events.doc.resize.go(); }, 1000 / this.timer.fps)
                    }
                },

                stop: function () {
                    if (this.timer.started == false) { return; }
                    this.timer.started = false;
                    this.callback.execute('onStop');
                },

                callback: {
                    //register & execute callbacks when the window resizes
                    items: [],

                    add: function (elem, vars, onStart, onGo, onStop) {
                        this.items.push({ elem: elem, vars: vars, onStart: onStart, onGo: onGo, onStop: onStop });
                    },

                    remove: function (elem) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                        }
                    },

                    execute: function (type) {
                        if (this.items.length > 0) {
                            switch (type) {
                                case '': case null: case 'onStart':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onStart == 'function') {
                                            this.items[x].onStart();
                                        }
                                    } break;

                                case 'onGo':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onGo == 'function') {
                                            this.items[x].onGo();
                                        }
                                    } break;

                                case 'onStop':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onStop == 'function') {
                                            this.items[x].onStop();
                                        }
                                    } break;

                            }
                        }
                    }
                }
            }
        },

        iframe: {
            loaded: function () {
                
            }
        },

        ajax: {
            //register & execute callbacks when ajax makes a post (including hash change)
            loaded: true, 

            start: function () {
                this.loaded = false;
                $(document.body).addClass('wait');
                clearTimeout(R.hash.timer);
            },

            complete: function () {
                R.events.ajax.loaded = true;
                $(document.body).removeClass('wait');
                R.hash.isChanging = false; R.hash.checked = 0; R.hash.watch();
            },

            error: function (status, err) {
                R.events.ajax.loaded = true;
                $(document.body).removeClass('wait');
                R.hash.isChanging = false; R.hash.checked = 0; R.hash.watch();
            },

            callback: {
                items: [],

                add: function (elem, vars, onStart, onComplete, onError) {
                    this.items.push({ elem: elem, vars:vars, onStart: onStart, onComplete: onComplete, onError: onError });
                },

                remove: function (elem) {
                    for (var x = 0; x < this.items.length; x++) {
                        if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                    }
                },

                execute: function (type) {
                    if (this.items.length > 0) {
                        switch (type) {
                            case '': case null: case 'onStart':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (typeof this.items[x].onStart == 'function') {
                                        this.items[x].onStart();
                                    }
                                } break;

                            case 'onComplete':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (typeof this.items[x].onComplete == 'function') {
                                        this.items[x].onComplete();
                                    }
                                } break;

                            case 'onError':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (typeof this.items[x].onError == 'function') {
                                        this.items[x].onError();
                                    }
                                } break;

                        }
                    }
                }
            }
        },

        hash: {
            //register & execute callbacks when the hash changes
            callback: {
                items: [],

                add: function (elem, vars, onCallback) {
                    this.items.push({ elem: elem, vars: vars, onCallback: onCallback});
                },

                remove: function (elem) {
                    for (var x = 0; x < this.items.length; x++) {
                        if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                    }
                },

                execute: function () {
                    if (this.items.length > 0) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (typeof this.items[x].onCallback == 'function') {
                                this.items[x].onCallback();
                            }
                        }
                    }
                }
            }
        }
    },

    ajax: {
        //class used to make simple web service posts to the server
        viewstateId:'', expire:new Date(),

        post: function (url, data, callback) {
            this.expire = new Date();
            R.events.ajax.start();
            data.viewstateId = this.viewstateId;
            $.ajax({
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                url: url,
                contentType: "application/json; charset=utf-8",
                success: function (d) { R.events.ajax.complete(); callback(d);},
                error: function (xhr, status, err) { R.events.ajax.error(status, err); }
            });
        },

        callback: {
            inject: function (data) {
                if (data.d.__type == 'Rennder.WebServices.Inject') {
                    //load new content from web service
                    var elem = $(data.d.element);
                    if (elem.length > 0 && data.d.html != '') {
                        switch (data.d.inject) {
                            case 0: //replace
                                elem.html(data.d.html);
                                break;
                            case 1: //append
                                elem.append(data.d.html);
                                break;
                            case 2: //before
                                elem.before(data.d.html);
                                break;
                            case 3: //after
                                elem.after(data.d.html);
                                break;
                        }
                    }

                    //finally, execute callback javascript
                    if (data.d.js != '' && data.d.js != null) {
                        var js = new Function(data.d.js);
                        js();
                    }
                }
            }
        },

        keepAlive: function(){
            if (((new Date() - this.expire) / 1000) > 180) {
                this.expire = new Date();
                this.post("/services/core.asmx/KeepAlive", {}, function () { });
            }
            setTimeout(function () { R.ajax.keepAlive(); }, 30000);
        }
    },

    panel:{
        coordinates: new Array()
    },
    
    editor:{
        selectedLayerId: '', editMode: false
    },
    
    hash: {
        // 'AJAX URL Hash System ////////////////////////////////////////////////////////////////////////////////////'
        //the hash system for Rennder is set up to manipulate components on the page. A few examples:

        // page-name/dg8+3+2/b1e+1+love/7ob+2+15+2011/vsa+8279189
        // dashboard/website+1078098+designs+82

        //each object is separated by a plus sign +
        //1st object is the page name of the Rennder Web Site
        //other objects are component instances & commands to execute
        //1st component in the example:
        //dg8+3+2  <--- dg8 = component name, 3 = command #3, 2 = command attribute

        last: '', timer: null, isChanging: false,

        start: function () {
            if (R.page.title != "") {
                R.hash.update();
                setTimeout(function () { R.hash.watch(); }, 500);
            }
        },

        inject:function(obj, inject) {
            //injects the hash into an <a/> tag
            //inject should always be like so:
            //componentId:command:(value)
            //so for example, blog:search:love
            //would search the blog app for the keyword "love"
            //(value) means it is optional

            //first, see if the app is already in the hash
            var newhash = "";
            var arrInj = inject.split("+");
            var start = new Array();
            var evTitle = R.page.title.replace(/\s/g, "-");
            if (arrInj.length > 1) {
                if (R.hash.last != "") {
                    start[0] = R.hash.last.indexOf("/" + arrInj[0]);
                    if (start[0] > -1) {
                        //app is in hash, check to see if command is in app hash
                        start[1] = R.hash.last.substr(start[0] + 1).indexOf("/");
                        newhash = R.hash.last.substr(0, start[0] + 1) + inject;
                        if (start[1] > -1) { newhash += R.hash.last.substr(start[0] + 1 + start[1]); }
                    } else {
                        newhash = R.hash.last + "/" + inject;
                    }
                } else { newhash = evTitle + "/" + inject; }
            } else {
                newhash = evTitle + "/" + inject;
            }
            if (obj.getAttribute("replace") == "true") {
                newhash = evTitle + "/" + inject;
            }
            if (R.page.useAjax == false) {
                newhash = newhash.replace(/\+/g, "/").replace(/:/g, "+");
                //add query string to url
                newhash = "?h=" + newhash;
                if (window.location.search != "") {
                    if (window.location.search.indexOf("?h=") < 0 && window.location.search.indexOf("&h=") < 0) {
                        //h variable isn't in the old querystring, add the entire querystring
                        newhash += "&" + window.location.search.substr(1);
                    } else {
                        //remove "h" variable from the old query string
                        var oldhash = window.location.search;
                        start[0] = oldhash.indexOf("?h=");
                        if (start[0] < 0) { start[0] = oldhash.indexOf("&h="); }
                        start[1] = oldhash.substr(start[0]).indexOf("&");
                        if (start[1] > 1) {
                            oldhash = oldhash.substr(0, start[0]) + oldhash.substr(start[1] + start[0]);
                        } else {
                            oldhash = oldhash.substr(0, start[0]);
                        }
                        newhash += "&" + oldhash.replace("?", "");
                    }
                }
                obj.href = newhash;
            } else {
                //replace page title if needed
                var apage = obj.getAttribute("page");
                if (apage != "" && apage != null && apage != undefined) {
                    start[0] = newhash.indexOf("/");
                    if (start[0] > -1) {
                        newhash = apage + "/" + newhash.substr(start[0] + 1);
                    } else {
                        if (newhash != "") {
                            newhash = apage + "/" + newhash;
                        } else {
                            newhash = apage;
                        }
                    }
                }
                if (obj.getAttribute("replace") == "true") {
                    newhash = inject;
                }
                if (newhash.substring(newhash.length, newhash.length - 1) == "+") { newhash = newhash.substring(0, newhash.length - 1); }
                obj.href = "#" + newhash;
            }
         },

        watch: function() {
            clearTimeout(R.hash.timer); R.hash.timer = null;
            //check to see if the hash has changed every 2 seconds
            if (location.hash.replace("#", "").toLowerCase() != R.hash.last.toLowerCase() && R.page.title != "") {
                //hash has changed
                R.hash.change(); return;

            } else if (location.hash == "" && R.hash.last != "" && R.page.title != "") {
                R.hash.change(); return;

            } else if (R.page.title == "") {
                R.hash.change(); return;
            }
            R.hash.timer = setTimeout(function () { R.hash.watch(); }, 500);
        },

        post: function (url) {
            if (R.page.useAjax == true) {
                location.hash = '#'+url;
            } else {
                location.href = '/'+url
            }
        },

        ghost:function(url) {
            //changes the URL hash while bypassing an AJAX request
            R.hash.last = url;
            location.hash = url;
        },

        change: function () {
            if (this.last.toLowerCase() == 'home' && location.hash.replace("#", "") == '') {
                R.hash.timer = setTimeout(function () { R.hash.watch(); }, 500); return;
            }
            
            clearTimeout(R.hash.timer);
            R.hash.isChanging = true;
            //the hash has changed so send changes to the server via AJAX
            //figure out what has changed within the hash
            var newhash = location.hash.toLowerCase();
            //$R('urlhash').value = newhash; //update hidden field for posting full hash
            newhash = newhash.replace('#', '');
            var arrNhash = newhash.split("/");
            var finalhash = "";
            if (R.hash.last != "") {
                var changed = "";
                var isChanged = true;
                var arrHash = R.hash.last.split("/");
                var arrNhashCmd, arrHashCmd;
                for (x = 0; x < arrNhash.length; x++) {//search new hash
                    isChanged = true;
                    for (y = 0; y < arrHash.length; y++) {//compare with old hash
                        if (arrNhash[x] == arrHash[y]) { isChanged = false; }
                    }
                    if (isChanged == true) {
                        if (changed != "") { changed += "/"; }
                        changed += arrNhash[x];
                    }
                }
                if (changed != "") {
                    //send hash changes to the server
                    finalhash = changed;
                }
            } else {
                //evolver hash is empty, send it all to the server
                finalhash = newhash;
            }
            if (finalhash == "" && arrNhash.length > 0) {
                finalhash = arrNhash[0];
            }
            //remove page title if the page is already loaded
            if (finalhash.indexOf(R.page.title) == 1) { finalhash = finalhash.substr(R.page.title.length + 2); }
            finalhash = finalhash.replace("#", "");
            //$R('CommandArg').value = finalhash;
            R.hash.last = location.hash.replace("#", "").toLowerCase();
            R.hash.update();//updates all href links on the page with new hash
            //$R('btnEvolver').click();
            R.events.render.disabled = true;
            R.ajax.post('/services/core.asmx/Hash', { url: finalhash }, this.callback);
        },

        callback: function (data) {
            if (data.d.__type == 'Rennder.WebServices.PageRequest') {
                //load new page from web service
                var p, comp, div;


                //first, remove unwanted components
                for (x = 0; x < data.d.remove.length; x++) {
                    p = $('#c' + data.d.remove[x]);
                    if (p.length > 0) {
                        p[0].parentNode.parentNode.removeChild(p[0].parentNode);
                    }
                }

                //next, add new components
                for (x = 0; x < data.d.components.length; x++) {
                    comp = data.d.components[x];
                    p = $('.panel' + comp.panelClassId + ' .inner-panel')[0];
                    if (typeof p == 'object') {
                        div = document.createElement('div');
                        div.innerHTML = comp.html;
                        p.appendChild(div.firstChild);
                    }
                }
                $('#divPageLoad').hide();
                $('.container').show();

                //add editor if exists (only on login)
                if (data.d.editor != '') {
                    $('.body').before(data.d.editor);
                }

                //update title
                if (data.d.pageTitle != '') { document.title = data.d.pageTitle; }

                //finally, execute callback javascript
                if (data.d.js != '' && data.d.js != null) {
                    var js = new Function(data.d.js);
                    js();
                }

                //reset the rendering engine
                R.events.render.init();

                //run registered callbacks
                R.events.hash.callback.execute();
            }
        },

        update:function() {
            //reset all a href links
            var arra = $("a[hash]");
            for (var x = 0; x < arra.length; x++) {
                R.hash.inject(arra[x], arra[x].getAttribute("hash"));
            }
        },

        combine:function(url1, url2) {
          var url3, arr1, arr2, arr3, exists;
          arr1 = url1.replace("#", "").split("/");
          arr2 = url2.replace("#", "").split("/");
          if (arr1.length > 1) {
              for (var x = 1; x < arr1.length; x++) {
                  arr3 = arr1[x].split("+");
                  exists = false;
                  if (arr3.length > 0) {
                      //check 2nd array to see if it exists
                      for (var y = 0; y < arr2.length; y++) {
                          if (arr2[x].indexOf(arr3[0]) > -1) {
                              exists = true;
                          }
                      }
                      if (exists == false) { if (url3 != '') { url3 += '/'; } url3 += arr1[x]; }
                  }
              }
              return url3;
          } else {
              return url2;
          }
        }
    },

    browser: {
        isIE:false, isNS:false, version:null,

        get: function () {
            var ua, s, i;
            ua = navigator.userAgent;
            s = "MSIE";
            if ((i = ua.indexOf(s)) >= 0) {
                this.isIE = true;
                this.version = parseFloat(ua.substr(i + s.length));
                return;
            }

            s = "Netscape6/";
            if ((i = ua.indexOf(s)) >= 0) {
                this.isNS = true;
                this.version = parseFloat(ua.substr(i + s.length));
                return;
            }

            // Treat any other "Gecko" browser as NS 6.1.

            s = "Gecko";
            if ((i = ua.indexOf(s)) >= 0) {
                this.isNS = true;
                this.version = 6.1;
                return;
            }
        }
    }
}

R.util = {}

// Window Events ////////////////////////////////////////////////////////////////////////////////////'
$(document).on('ready', function () { R.events.doc.ready(); });
$(document.body).on('click', function (e) { R.events.doc.click.trigger(e.target); });
$(window).on('resize', function () { R.events.doc.resize.trigger();});
$(window).on('scroll', function () { R.events.doc.scroll.trigger(); });
$('iframe').load(function () { R.events.iframe.loaded(); });


// start timers /////////////////////////////////////////////////////////////////////////////////
if (typeof document.getElementsByClassName('container') != 'undefined') {
    R.events.doc.load();
    R.ajax.keepAlive();
}


/// Rennder Platform : responsive.js ///
/// <reference path="global.js" />
/// <reference path="view.js" />

R.components = {
    //all settings about a component are stored here
    cache: [{id:null, levels:null, stacks:null}],

    get: function () {
        var arg = arguments[0];
        if (typeof arg == 'string') {
            if (typeof this.cache['c' + arg] == 'undefined') { this.set(arg, [, , , , ], [, , , , ]); }
            return this.cache['c'+arg];
        } else if (typeof arg == 'object') {
            if(typeof arg.id != 'undefined'){
                for (x = 0; x < this.cache.length;x++) {
                    if (this.cache[x].id == arg.id) { return this.cache[x];}
                }
            }
        }
        return this.cache['c' + arg];
    },

    set: function (id, lvls, stacks) {
        if (typeof this.cache['c' + id] == 'undefined') { this.cache.length++; }
        this.cache['c'+id]  = { id: id, levels: lvls, stacks: stacks };
    },

    setLevel: function (id, lvl, value) {
        var c = this.get['c'+id];
        if (typeof c != 'undefined') { this.cache['c'+id].lvls[lvl - 1] = value; return c; }
    },

    setLevels: function (id, values) {
        var c = this.get['c'+id];
        if (typeof c != 'undefined') { this.cache['c'+id].lvls = values; return c; }
    },

    setStack: function (id, lvl, value) {
        var c = this.get['c'+id];
        if (typeof c != 'undefined') { this.cache['c'+id].stacks[lvl - 1] = value; return c; }
    },

    setStacks: function (id, values) {
        var c = this.get['c'+id];
        if (typeof c != 'undefined') { this.cache['c'+id].stacks = values; return c; }
    },

    cleanup: function () {
        var keep, z;
        for (x in this.cache) {
            keep = false; z = -1
            if ($R('c' + this.cache[x].id) != null) { keep = true; }
            if (keep == false) { z = this.cache.indexOf(x); if (z > -1) { this.cache.splice(z, 1); }}
        }
    },

    getCacheLevel: function (c) {
        var v = 0, r = R.responsive.cache, rl = R.responsive.level, l = 0, x = arguments[1], f = false;
        //get responsive cache array index for specified component
        if (x == null) {
            for (x = 0; x < r.length; x++) {
                if (r[x].c.id == c.id) {
                    f = true;
                    break;
                }
            }
        }
        
        if (f == false) { return rl; }
        if (r[x].levels[rl][1] != '') { return rl;}

        //find best alternative level properties
        var pattrn = new Array();
        switch (rl) {
            case 0: //cell
                pattrn = [0, 1, 2, 3, 4];
                break;
            case 1: //mobile
                pattrn = [1, 2, 0, 3, 4];
                break;
            case 2: //tablet
                pattrn = [2, 3, 4, 1, 0];
                break;
            case 3: //desktop
                pattrn = [3, 4, 2, 1, 0];
                break;
            case 4: //uhd
                pattrn = [4, 3, 2, 1, 0];
                break;
        }

        for (var l = 0; l < 5; l++) {
            v = pattrn[l];
            if (v != rl) {
                if (r[x].levels[v][1] != '') {
                    return v;
                    break;
                }
            }
        }
        return rl;
    },

    getStackLevel: function(comp, alt){
        var v = 0, r = R.responsive.cache, rl = R.responsive.level, l = 0;
        if (arguments[2] != null) { rl = arguments[2]; }
        if (comp.stacks == null || comp.stacks.length == 0) { return rl; }
        if (comp.stacks[rl] != '' && alt != true) {
            if (this.checkStackLevel(comp.levels[rl]) == true) {
                return Number(rl);
            }
        }
        var pattrn = new Array();
        switch (rl) {
            case 0: //cell
                pattrn = [1, 2, 3, 4]; break;
            case 1: //mobile
                pattrn = [2, 0, 3, 4]; break;
            case 2: //tablet
                pattrn = [3, 4, 1, 0]; break;
            case 3: //desktop
                pattrn = [4, 2, 1, 0]; break;
            case 4: //uhd
                pattrn = [3, 2, 1, 0]; break;
        }
        //find best alternative level properties
        for (var l = 0; l < 5; l++) {
            v = pattrn[l];
            if(v != rl){
                if (v >= comp.stacks.length) { return rl; }
                if (comp.stacks[v] != '') {
                    if (arguments[1] == true) {
                        if (this.checkStackLevel(comp.levels[v]) == true) {
                            return v;
                        }
                    } else {
                        return v;
                    }
                }
            }
        }
    },

    checkStackLevel: function (data) {
        //make sure there is enough responsive data for this component level
        if (data == null || data.length == 0) { return false; }
        if (data != "" && data != null) {
            var a = data.split(",");
            if (a.length > 5 && a[0] != '' && a[1] != '' && a[2] != '' && a[5] != '') {
                return true;
            }
        }
        return false;
    },

    findStackElement: function (c, stack) {
        //c = component, stack = 2nd dimensional object inside R.responsive.stack array (panel:object, data:array)
        var z, w, p, t, cPos, ePos, dPos, pPos, nPos, tPos, fPos, oPos, isin = false, ison = false, stackC = null, stackClosest = 9999,
            ic = 0, p, p2, p3 = false, p4 = false, pad = 4, oldC = null, isinside = false, istouching = false, isoverlapping = false,
            emptyspace = new Array();
        if (arguments[2] != null && arguments[2] != undefined) { p4 = arguments[2]; }
        p = stack.panel;
        cPos = R.elem.offset(c);
        pPos = R.elem.offset(p);

        //create temp array for empty space
        for (var w = 0; w < stack.data.length; w++) {
            t = stack.data[w].c;
            tPos = R.elem.offset(t);
            emptyspace[w] = [t, tPos];
        }

        //loop through every component within this component's panel
        for (var z = 0; z < stack.data.length; z++) {
            p = stack.data[z].c;
            p3 = false; p2 = null; ison = false; isinside = false; istouching = false;

            //check to make sure stack layer won't make an infinite loop
            p4 = true;
            if (stack.data[z].stack != null && stack.data[z].stack != undefined) {
                if (stack.data[z].stack[0] != null && stack.data[z].stack[0] != undefined) {
                    p2 = stack.data[z].stack[0];
                    if (p2.id == c.id && p4 == false) { p3 = true; }
                }
            }
            if (p.id != c.id && p3 == false) {
                ePos = R.elem.offset(p);
                if (arguments[5] != null) { if (arguments[5] > 0) { ePos.y -= arguments[5]; } }

                //figure out new x & width for ePos based on empty space around it
                if (cPos.y > ePos.y + (ePos.h / 2)) {
                    ison = this.inRange(cPos, ePos, 1) || this.inRange(ePos, cPos, 1);
                }
                if (arguments[2] == null && ison == false) {
                    if (cPos.y + (cPos.h / 1.3) > ePos.y + (ePos.h / 10)) {
                        ison = this.inRange(cPos, ePos, 1);
                        isinside = true;
                    }
                }
                if (ison == true) {
                    if (arguments[4] == undefined) { istouching = this.isTouching(cPos, ePos); }
                    isoverlapping = this.isOverlapping(ePos, cPos);
                    if (istouching == false && isoverlapping == false || arguments[5] != null) {
                        //component is inside layer, set reference to layer to use later
                        ic = cPos.y - (ePos.y + ePos.h);
                        if (ePos.y + ePos.h > cPos.y + cPos.h) {
                            if ((cPos.y + cPos.h) - ePos.y < 50) {
                                ic = (ic * -1);
                            }
                        }
                        if (stackClosest > ic || isinside == true) {
                            stackClosest = ic;
                            oldC = stackC;
                            oPos = fPos || null;
                            stackC = [p];
                            fPos = ePos;
                        }
                    }
                }
            }
        }

        //make sure this component doesn't overlap with any other component in the same layer
        if (stackC != null && stackC != undefined && p4 == false) {
            for (var z = 0; z < stack.data.length; z++) {
                p = stack.data[z][0];
                if (stack.data[z].stack != null && stack.data[z].stack != undefined) {
                    if (stack.data[z].stack[0] != null && stack.data[z].stack[0] != null) {
                        if (stack.data[z].stack[0].id == stackC[0].id) {
                            //found same stack layer, make sure both components don't overlap
                            ePos = R.elem.offset(p);
                            ison = false;
                            if ((cPos.y >= ePos.y && cPos.y < (ePos.y + (ePos.h - 40))) || (cPos.y < ePos.y && (cPos.y + cPos.h) > (ePos.y + 40))) {
                                ison = this.inRange(cPos, ePos, 1);
                            }
                            if (ison == true && stackC != null && oldC != null) {
                                break;
                            }
                        }
                    }
                }

            }
        }

        if (arguments[3] == undefined || arguments[3] == null) {
            return stackC;
        } else {
            if (stackC != null) {
                fPos.x = fPos.x + pPos.x;
                fPos.y = fPos.y + pPos.y;
            }

            return { c: stackC, p: fPos };
        }
    },

    inRange: function (cPos, ePos) {
        var pad = 1;
        if (arguments[2] != undefined) { pad = arguments[2]; } // padding
        pad = pad * 10;
        if (cPos.x + cPos.w >= ePos.x - pad && cPos.x < (ePos.x + ePos.w + pad)) { // 1.)
            return true;
        }
        if (ePos.x + ePos.w >= cPos.x - pad && ePos.x < (cPos.x + cPos.w + pad)) { // 2.)
            return true;
        }
        return false;

    },

    isOverlapping: function (cPos, ePos) {
        if (cPos.x < ePos.x && (cPos.x + cPos.w) > (ePos.x + ePos.w) && cPos.y < ePos.y && (cPos.y + cPos.h) > (ePos.y + ePos.h)) {
            return true;
        }
        return false;
    },

    isTouching: function (cPos, ePos) {
        var pad = ePos.w / 10; if (pad < 50) { pad = 50; }
        if (cPos.x < (ePos.x + ePos.w) && (cPos.x + cPos.w) > ePos.x) {
            if (ePos.y < cPos.y + cPos.h - (cPos.h / 3) && ePos.y > cPos.y) {
                //touching horizontally
                return true;
            }
            if (cPos.x + cPos.w > ePos.x) {
                if ((100 / (ePos.x + ePos.w - cPos.x)) * (cPos.x + cPos.w - ePos.x) <= 25) {
                    if (cPos.y < (ePos.y + ePos.h) && (cPos.y + cPos.h) > ePos.y) {
                        //touching left edge
                        return true;
                    }
                }
            }
            if (cPos.x > ePos.x + (ePos.w - pad) && cPos.x < ePos.x + ePos.w) {
                //touching right edge
                return true;
            }
            if (cPos.y + cPos.h > ePos.y && cPos.y + cPos.h < (ePos.y + (ePos.h / 2.5))) {
                //touching top
                //return true;
            }
        }

        return false;
    },

    saveLevel: function (c, level, leftStyle, widthStyle, topStyle, topType, alignment, left, top, width, padding, right, height) {
        var attr = this.cache[c.id].levels[level], attr2, arr, arr2;
        if (attr != null && attr != "") {
            arr = attr.split(",");
            if (arr.length < 12) { arr[11] = ''; } else if (arr[11] == 'undefined') { arr[11] = ''; }
        } else {
            arr = new Array("", "", "", "", "", "", "", "", "", "", "", "");
        }
        if (arr[5] == '' || arr[6] == '') {
            var cPos = R.elem.pos(c);
            arr[5] = cPos.x;
            arr[6] = cPos.y;
        }
        var r = R.responsive.cache, z, xrl;
        if (r != null) {
            for (var z = 0; z < r.length; z++) {
                if (r[z].c.id == c.id) {
                    xrl = z;
                    xrl = (this.getCacheLevel(c, xrl));
                    if (xrl > 0) {
                        arr2 = r[z].levels[xrl];
                        if (arr2 != null) {
                            //get individual items from design level attribute
                            for (var x = 0; x < arr2.length; x++) {
                                if (arr2[x] != "") {
                                    arr[x] = arr2[x];
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (leftStyle != null) { arr[0] = leftStyle; }
        if (widthStyle != null) { arr[1] = widthStyle; }
        if (topStyle != null) { arr[2] = topStyle; }
        if (topType != null) { arr[3] = topType; }
        if (alignment != null) { arr[4] = alignment; }
        if (left != null) { arr[5] = left; }
        if (top != null) { arr[6] = top; }
        if (width != null) { arr[7] = width; }
        if (padding != null) { arr[8] = padding; }
        arr[9] = "";
        if (right != null) { arr[10] = right; }
        if (height != null) { arr[11] = height; }
        this.cache[c.id].levels[level] = arr.join(',');
        R.responsive.cache[R.responsive.getComponentFromCache(c)].levels[level] = arr;
        R.components.altered(c);
    },

    saveStackLayer: function (c, stack, y, lvl) {
        var icc = this.findStackElement(c, stack, true), it = '';
        stack.data[y].stack = icc;
        if (icc != null) { it = icc[0].id.substr(1); } else { it = '!'; }
        this.cache[c.id].stacks[lvl] = it;
        this.altered(c);
    },

    altered: function () {

    }
}

R.selectors = {
    //store a cache of jQuery selectors that are used frequently
    cache: null,

    get: function () {
        if (this.cache == null) {
            this.cache = [
                $('.div-max-width'), //[0]
                $('.div-float-width'),  //[1]
                $('.div-float-width > div'), //[2]
                $('.container[autoresize="1"]:not([cid="stackpanel"])'), //[3]
                $('.div-href'), //[4]
                $('.ispanel:not(.islayout) .inner-panel'), //[5]
                $('.container.responsive-grid'), //[6]
                $('.ispanel'), //[7]
                $('img[data-file]'), //[8]
                $('.has-dropdown'), //[9]
                $('.webpage') //[10]
            ];
        } else {
            //update certain selectors
            this.cache[4] = $('.div-href');
        }
    },

    reset: function () {
        this.cache = null;
    }
}

R.layers = {
    cache: [{ pageId: '', title: '', pageType: 1 }],

    add: function (pageId, title, pageType) {
        for (x = 0; x < this.cache.length; x++){
            if(this.cache[x].pageId == pageId){
                this.cache[x] = { pageId: pageId, title: title, pageType: pageType };
                return;
            }
        }
        this.cache.push({ pageId: pageId, title: title, pageType: pageType });
    }
}

R.responsive = {
    //arrays & functions used for the responsive engine
    levels:[350, 700, 1024, 1440, 9999],
    level: -1,
    levelPrev: -2,
    cache: [{
        panel: null,
        c: null,
        id: null,
        x: null,
        y: null,
        w: null,
        h: null,
        usestacks: null,
        levels: [null, null, null, null, null], //left, width, top, parallax, alignment, x, y, width, intel-layer-top-padding, intel-layer-itemID, right-position, height, height-type
        autoResize: null,
        autoHeight: null,
        panelAutoWidth: null,
        panelCalcWidth: null,
        isPanel: false
    }],
    stack: [[{ panel: null, data: [{ c: null, bottom: 0, y: 0, w: 0, stack: { c: null }, pad: 0 }] }]], //[level][panel-index][panel, data[component]]

    getLevel: function () {
        var winPos = R.window.pos(), size = 'hd', wp = $('.webpage');
        winPos.w = R.window.w = R.elem.width(wp[0]);
        if (winPos.w <= this.levels[0]) {//350
            this.level = 0; size = 'cell';
        } else if (winPos.w <= this.levels[1]) {//700
            this.level = 1; size = 'mobile';
        } else if (winPos.w <= this.levels[2]) {//1024
            this.level = 2; size = 'tablet';
        } else if (winPos.w <= this.levels[3]) {//1440
            this.level = 3; size = 'desktop';
        } else if (winPos.w <= this.levels[4]) {//9999
            this.level = 4;
        }
        if (this.level == this.levelPrev) {
            return false;
        }else if (this.level != this.levelPrev) {
            this.levelPrev = this.level;
            wp = $(document.body);
            if (wp.hasClass(size) == false) { wp.removeClass('cell mobile tablet desktop hd screen').addClass(size + ' screen'); }
            //todo: update responsive level info in page editor interface
            return true;
        }
        return false;
    },

    getCache: function () {
        if (this.cache == null) {
            //get a list of components to resize
            var panels = $('.ispanel');
            if (panels.length > 0) {
                var components;
                var r, c, i = 0, s = 0, cPos, f = 0, uselvl = 0, intelc, newY = 0, comp, ispanel;
                var cache = [];
                for (var r = 0; r < panels.length; r++) {
                    components = $('.inner' + panels[r].id + ' > div > div.container');
                    cache[i] = [panels[r], []];
                    s = 0;
                    for (var c = components.length - 1; c >= 0; c--) {
                        comp = R.components.get(components[c].id.substr(1));
                        cPos = R.elem.offset(components[c]);
                        newY = cPos.y;
                        if (components[c].parentNode.style.position == "relative") {
                            //component base is not free form, so remove the width attribute
                            components[c].style.width = "";
                        }
                        ispanel = $(components[c]).hasClass('type-panel');

                        //get all level attributes
                        var lvl = [[0, ''], [0, ''], [0, ''], [0, ''], [0, '']];
                        var af = '';
                        for (f = 0; f < lvl.length; f++) {
                            af = comp.levels[f];
                            if (af == '' || af == 'undefined' || af == null) { af = ',,,,,,,,,'; }
                            lvl[f] = af.split(',');
                            //check to see if this component is responsive
                            if (lvl[f][1] == 'fs' || lvl[f][2] == 'scroll') { //width percent or vertical parallax
                                uselvl = 1;
                            }
                            intelc = comp.stacks;
                            if (intelc.length > 0) {
                                lvl[f][9] = intelc;
                            } else {
                                lvl[f][9] = new Array("", "", "", "", "");
                            }
                            //check stacks for components that don't exist anymore
                            var ic = "";
                            for (var u = 0; u < lvl[f][9].length; u++) {
                                ic = lvl[f][9][u];
                                if (ic != '' && ic != '!') {
                                    if (typeof $('.inner' + panels[r].id +  "" + ' > div > #c' + ic + '')[0] == 'undefined') {
                                        lvl[f][9][u] = '';
                                        comp.stacks[u] = '';
                                        ch = true;
                                    }
                                }
                            }
                        }
                        //save panel & component info to temp cache
                        var au = new Array();
                        au[0] = (components[c].getAttribute('autoresize') == "1"); //r[x][14]
                        au[1] = (components[c].getAttribute('autoheight') == "1"); //r[x][15]
                        au[2] = ($(components[c]).find('.inner-panel[resize="2"]')[0] != null);//r[x][16]
                        au[3] = ($(components[c]).find('.inner-panel[resize!="1"][resize!="4"]')[0] != null); //r[x][17]
                        cache[i][1][s] = [components[c], cPos.x, newY, cPos.w, cPos.h, uselvl, lvl[0], lvl[1], lvl[2], lvl[3], lvl[4], null, null, au[0], au[1], au[2], au[3], ispanel];
                        s++;
                    }
                    i++;
                }

                //sort & apply temp cache to responsive cache
                this.cache = [];
                if (cache.length > 0) {
                    i = 0;
                    for (var x = 0; x < cache.length; x++) {
                        if (cache[x][1].length > 0) {
                            //sort components for this panel based on y position
                            //cache[x][1].sort(function (a, b) { return a.y - b.y; });
                            for (var y = 0; y < cache[x][1].length; y++) {
                                if (typeof cache[x][1][y] != 'undefined') {
                                    //add component to responsive cache
                                    this.cache[i] = {
                                        panel:cache[x][0], 
                                        c:cache[x][1][y][0],
                                        id:cache[x][1][y][0].id,
                                        x:cache[x][1][y][1], 
                                        y:cache[x][1][y][2], 
                                        w:cache[x][1][y][3], 
                                        h:cache[x][1][y][4], 
                                        usestacks:(cache[x][1][y][5] == 1), 
                                        levels:[cache[x][1][y][6], cache[x][1][y][7], cache[x][1][y][8], cache[x][1][y][9], cache[x][1][y][10]], 
                                        autoResize:cache[x][1][y][13], 
                                        autoHeight:cache[x][1][y][14], 
                                        panelAutoWidth:cache[x][1][y][15], 
                                        panelCalcWidth: cache[x][1][y][16],
                                        isPanel: cache[x][1][y][17]
                                    }
                                    i++;
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    getStackCache: function () {
        this.getCache();
        var x,  c, p, oldp = null, cPos, pPos, ePos, pchange = false, comp,
            maxH = 0, maxW = 0, cH = 0, cW = 0, cX = 0, cY = 0, ismH = false,
            warr, wp, wc, ww, wn, wh, rl = this.level, pl;

        if (this.stack == null) { this.stack = [];}
        if (this.stack[rl] == null) {
            this.stack[rl] = [];
        } else {
            if (this.stack[rl].length > 0) { return;}
        }
        pl = -1; wp = 0;

        for (var x = 0; x < this.cache.length; x++) {
            p = this.cache[x].panel; //panel element
            c = this.cache[x].c; //component element
            comp = R.components.get(c.id.substr(1))
            ePos = R.elem.offset(c);
            pchange = false; //check for panel change
            if (p != oldp || oldp == null) { pchange = true; oldp = p; }
            if (pchange == true) {
                pl++; wp = 0;
                this.stack[rl][pl] = { panel: p, data:[]};
            }
            wn = 20;

            //get top-padding from responsive design array
            if (this.cache[x].levels[rl].length > 0) {
                try { if (this.cache[x].levels[rl][8] != null && this.cache[x].levels[rl].length > 8) { wn = this.cache[x].levels[rl][8]; } } catch (ex) { }
            }
            //set up new intel layer array
            var intelObj = null;

            var stacks = comp.stacks;
            if (stacks[rl] != '' && stacks[rl] != '!') {
                intelObj = $('#c' + stacks[rl])[0];
                if (intelObj != null) {
                    intelObj = [intelObj];
                }
            } else if(stacks[rl] != '!'){
                //get alternative intel layer from component intelc attribute
                var irl = R.components.getStackLevel(comp, true, rl);
                if (stacks[irl] != '' && stacks[irl] != '!') {
                    iC = $('#c' + stacks[irl])[0];
                    if (iC != null) {
                        //check to make sure iC is already part of the this.stack array
                        var isabove = false, iCid = iC.id;
                        for (var u = 0; u < this.stack[rl][pl].data.length; u++) {
                            if (this.stack[rl][pl].data[u].c.id == iCid) {
                                //check to see if component is in the same width range for stacking
                                cPos = R.elem.offset(iC);
                                if (this.util.inRange(cPos, ePos) == true) {
                                    isabove = true;
                                } break;

                            }
                        }
                        if (isabove == true) {
                            var altdsgnlvl = comp.levels[irl];
                            if (altdsgnlvl != "" && altdsgnlvl != null) {
                                wn = Number(altdsgnlvl.split(',')[8]) || 0;
                            }
                            intelObj = { c: iC };
                        }
                    }
                }
            }
            if (wn != null) { wn = Number(wn);}
            this.stack[rl][pl].data[wp] = { c: c, bottom: ePos.y + ePos.h, y: ePos.y, w: ePos.w, stack: intelObj, pad: wn };
            wp++;
        }

        this.sortStack();
    },

    getComponentFromCache: function (c) {
        for (x = 0; x < this.cache.length; x++) {
            if (this.cache[x].id == c.id) { return x;}
        }
        return -1;
    },

    getComponentFromStack: function (c) {
        var lvl = this.level;
        for (x = 0; x < this.stack[lvl].length; x++) {
            for (y = 0; y < this.stack[lvl][x].data.length; y++) {
                if (this.stack[lvl][x].data[y].c == c) { return { panel: x, c: y };}
            }
        }
        return { panel: -1, c: -1 };
    },

    sortStack: function (){
        //reorganize array so components are stacked correctly
        for (var x = 0; x < this.stack[this.level].length; x++) {
            if (this.stack[this.level][x] != null) {
                //for each panel (x), sort the list of components
                this.stack[this.level][x].data.sort(function (a, b) { return a.bottom - b.bottom; });
            }
        }
    },

    util: {
        inRange: function (cPos, ePos) {
            var pad = 1; if (arguments[2] != undefined) { pad = arguments[2]; } pad = pad * 10; //padding
            if (cPos.x + cPos.w >= ePos.x - pad && cPos.x < (ePos.x + ePos.w + pad)) { return true; }
            if (ePos.x + ePos.w >= cPos.x - pad && ePos.x < (cPos.x + cPos.w + pad)) { return true; }
            return false;
        }
    },

    resize: {
        onLevelChange: function () {
            var sel = R.selectors.cache, a = [], changes = [],
                cols, perc, w, minw, cl;

            //REFLOW: Get all elements to work with ////////////////////////////////////////////////////////////

            //step 1: panel grids $('.container.responsive-grid')
            for (x = 0; x < sel[6].length; x++) {
                cols = $('#' + sel[6][x].id + ' .grid-container > div.panel-grid');
                if(cols.length > 1){
                    w = R.elem.width(sel[6][x]); perc = 100; minw = sel[6][x].getAttribute("colwidth"), pad = '';
                    switch (cols.length) {
                        case 2:
                            if (w / 2 > minw) { perc = 50; }
                            break;

                        case 3:
                            if (w / 3 < minw) {
                                if (w / 2 >= minw) {
                                    perc = 50;
                                }
                            } else {
                                perc = 33.332;
                            }
                            break;

                        case 4:
                            if (w / 4 < minw) {
                                if (w / 3 >= minw) {
                                    perc = 33.332;
                                } else if (w / 2 >= minw) {
                                    perc = 50;
                                }
                            } else {
                                perc = 25;
                            }
                            break;

                        case 5:
                            if (w / 5 < minw) {
                                if (w / 4 >= minw) {
                                    perc = 25;
                                } else if (w / 3 >= minw) {
                                    perc = 33.332;
                                } else if (w / 2 >= minw) {
                                    perc = 50;
                                }
                            } else {
                                perc = 20;
                            }
                            break;

                        case 6:
                            if (w / 6 < minw) {
                                if (w / 5 >= minw) {
                                    perc = 20;
                                } else if (w / 4 >= minw) {
                                    perc = 25;
                                } else if (w / 3 >= minw) {
                                    perc = 33.332;
                                } else if (w / 2 >= minw) {
                                    perc = 50;
                                }
                            } else {
                                perc = 16.665;
                            }
                            break;

                        case 7:
                            if (w / 7 < minw) {
                                if (w / 6 >= minw) {
                                    perc = 16.665;
                                } else if (w / 5 >= minw) {
                                    perc = 20;
                                } else if (w / 4 >= minw) {
                                    perc = 25;
                                } else if (w / 3 >= minw) {
                                    perc = 33.332;
                                } else if (w / 2 >= minw) {
                                    perc = 50;
                                }
                            } else {
                                perc = 14.285;
                            }
                            break;
                    }
                    perc = perc - 0.1;
                    pad = $(cols[0]).css('padding-right');
                    for (var y = 0; y < cols.length; y++) {
                        if (pad !='') {
                            changes.push({ c: cols[y], w: 'calc(' + perc + '% - ' + pad + ')' })
                        } else {
                            changes.push({ c: cols[y], w: perc + '%' })
                        }
                    }
                }
            }


            //PAINT: Reset element styles //////////////////////////////////////////////////////////////////////

            //REFLOW: Calculate new settings for elements //////////////////////////////////////////////////////

            //PAINT: Update element styles /////////////////////////////////////////////////////////////////////
            if (changes.length > 0) {
                for (x = 0; x < changes.length; x++) {
                    if (changes[x].w != null && typeof changes[x].c == 'object') {
                        changes[x].c.style.width = changes[x].w
                    }
                }
            }
        },




    }
}

R.events.render = {
    //repositioning, resizing, and stacking components on the page using the responsive engine
    timer: { started: false, fps: 30, timeout: 150, date: new Date(), callback: null },
    components: [{ id: '', c: null, x: 0, y: 0, w: 0, h: 0, changed: false, wchanged: false, hchanged: false }],
    panels: [{p: null, x: 0, y: 0, w: 0, h: 0, changed: false}],
    resize: { speed: 10000, enabled: false, startwidth: 0, endwidth: 350, position: 0, date: null },
    viewport: { w: 0, h: 0, changed: false },
    disabled: false,

    init: function () {
        R.window.changed = true;
        R.components.cleanup();
        R.selectors.cache = null;
        R.responsive.cache = null;
        R.responsive.stack = null;
        R.responsive.level = -1;
        R.responsive.levelPrev = -2;
        R.selectors.get();
        R.responsive.getLevel();
        R.responsive.getCache();
        var r = R.responsive.cache;

        //REFLOW: get initial component positions from DOM
        this.components = [];
        this.getComponents();

        //PAINT: set width for components that autoresize
        for (e = 0; e < r.length; e++) {
            if (r[e].autoResize == true) {
                r[e].c.width = '';
            }
        }

        this.disabled = false;
        this.timer.started = false;
        this.trigger(true, true);
        setTimeout(function () { R.window.changed = true; R.window.pos(); R.events.render.trigger(true, true); }, 200);
    },

    trigger: function () {
        if (this.timer.started == false) {
            R.window.pos();
            this.viewport.w = R.window.w;
            this.viewport.h = R.window.h;
        }
        if (arguments.length == 2) {
            //set up animation for resizing viewport
            //0 = speed (ms), 1 = viewport width
            this.resize.speed = arguments[0];
            this.resize.startwidth = R.window.w;
            this.resize.endwidth = arguments[1];
            this.resize.position = 0;
            this.resize.date = new Date();
            this.resize.enabled = true;
        }
        this.timer.date = new Date();
        if (this.timer.started == false) {
            this.timer.started = true;
            this.timer.date = new Date();
            R.selectors.get();
            this.paint(arguments[0] == true ? true : null, arguments[1] == true ? true : null);
        }
    },

    paint: function () {
        if (this.timer.started == false || this.disabled == true) { return; }
        var lvlchange = R.responsive.getLevel(), rl = R.responsive.level, r = R.responsive.cache,
            panelw, lvls, c, cid, comp, rcomp, cX, cY, cW, cH, mw, cPos,
            stacks, p, maxW = 0, maxH = 0, pad = 20, stack, cs, irl, pinner;

        if (arguments[0] == true) { lvlchange = true; }
        this.panels = [];
        this.getPanels();

        //REFLOW: get viewport width (if animation enabled)
        if (this.resize.enabled == true) {
            this.resize.position = (100 / this.resize.speed * (new Date() - this.resize.date));

            if (this.resize.position > 100) { this.resize.position = 100; this.resize.enabled = false;}
            if (this.resize.endwidth > this.resize.startwidth) {
                mw = (((this.resize.endwidth - this.resize.startwidth) * ((this.resize.position / 100))) + this.resize.startwidth);
                if (mw >= this.resize.endwidth) { mw = this.resize.endwidth;}
            } else {
                mw = (((this.resize.startwidth - this.resize.endwidth) * (1 - (this.resize.position / 100))) + this.resize.endwidth);
                if (mw <= this.resize.endwidth) { mw = this.resize.endwidth;}
            }
            this.viewport.w = mw; R.window.w = mw; this.viewport.changed = true;
        }

        //REFLOW: get component positions based on responsive settings
        for (t = 0; t < 2; t++) {
            //separate panels (t=0) from components (t=1)
            for (e = 0; e < r.length; e++) {
                //get component positions from responsive cache
                cX = 0; cY = 0; cW = 0; cH = 0;
                if ((t == 0 && r[e].isPanel == true) || (t == 1 && r[e].isPanel == false)) {
                    irl = R.components.getCacheLevel(r[e].c);
                    lvls = r[e].levels[irl];
                    c = r[e].c; cid = r[e].id; comp = this.components[cid];
                    if (lvls.length > 10) {
                        //change component positions
                        panelw = this.panels[r[e].panel.id].w;
                        cW = this.getWidth(c, comp, lvls[1], lvls[7], r[e].autoResize, panelw, r[e].panelCalcWidth, lvlchange);
                        cX = this.getLeft(c, comp, lvls[4], lvls[5], lvls[10]);
                        
                        if (cW != comp.w) { this.components[cid].w = cW; this.components[cid].changed = true; this.components[cid].wchanged = true;}
                        if (cX != comp.x) { this.components[cid].x = cX; this.components[cid].changed = true; }

                        if (lvlchange == true) {
                            cY = parseInt(lvls[6]) || 0;
                            if (cY != comp.y) { this.components[cid].y = cY; this.components[cid].changed = true; }
                        }
                    }
                    if (lvls.length > 11) {
                        if (lvls[11] != '') {
                            cH = parseInt(lvls[11]) || 0;
                            if (cH != this.components[cid].h && this.components[cid].useHeight == true) { this.components[cid].h = cH; this.components[cid].changed = true; this.components[cid].hchanged = true; }
                        }
                    }
                }
            }
        }

        //PAINT: resize viewport width (if animation enabled)
        if (this.viewport.changed == true && this.viewport.w <= R.window.absolute.w) {
            R.selectors.cache[10][0].style.maxWidth = this.viewport.w + 'px';
        } else if (this.viewport.changed == true){
            R.selectors.cache[10][0].style.maxWidth = '';
        }
        this.viewport.changed = false;

        //PAINT: set component positions
        for (e = 0; e < r.length; e++) {
            cid = r[e].id;
            comp = this.components[cid];
            if (comp.changed == true) {
                c = r[e].c;
                c.style.left = comp.x + 'px';
                c.style.width = comp.w;
                if (comp.useHeight == true) {
                    c.style.height = comp.h + 'px';
                }
                if (lvlchange == true) {
                    c.style.top = comp.y + 'px';
                }
                this.components[cid].changed = false;
            }
        }

        //REFLOW & PAINT: resize elements on the page if level change
        if (lvlchange == true) { R.responsive.resize.onLevelChange(); }

        //REFLOW: get new height for components & panels
        for (e = 0; e < r.length; e++) {
            cid = r[e].id;
            comp = this.components[cid];
            //if (comp.hchanged == true || comp.wchanged == true) {
                this.components[cid].h = R.elem.height(comp.c);
            //}
        }
        this.panels = [];
        this.getPanels();

        //REFLOW: get stack cache on level change
        if (lvlchange == true) { R.responsive.getStackCache();}
        stacks = R.responsive.stack[rl];

        //REFLOW: intelligently stack components
        for (xp = 0; xp < stacks.length; xp++) {
            //each panel
            maxW = 0; maxH = 0; cX = 0; cY = 0; cW = 0; cH = 0, pad = 20;
            for (xc = 0; xc < stacks[xp].data.length; xc++) {
                //each component
                stack = stacks[xp].data[xc];
                p = stacks[xp].panel;
                c = stack.c;
                
                if (c.getAttribute('nostack') != '1') {
                    comp = this.components[c.id];
                    pad = stack.pad;
                    cs = null;
                    if (stack.stack != null) {
                        //component to stack under
                        cs = stack.stack[0];
                        if (cs != null) {
                            if (cs == c) { cs = null; }
                        }
                    }
                    if (cs == null) {
                        //find cs from nearest stack level
                        rcomp = R.components.cache[c.id];
                        if (rcomp != null) {
                            if (rcomp.stacks[rl] != '!') {
                                irl = R.components.getStackLevel(rcomp, true);
                                if (typeof rcomp.stacks[irl] != 'undefined') {
                                    if (rcomp.stacks[irl] != "" && rcomp.stacks[irl] != "!" && 'c' + rcomp.stacks[irl] != c.id) {
                                        cid = $('#c' + rcomp.stacks[irl]);
                                        if (cid.length > 0) { cs = cid[0]; }

                                        //make sure stack is above component

                                    }
                                }
                            }
                            
                        }
                    }

                    if (cs != null) {
                        cPos = this.components[cs.id];
                        this.components[c.id].y = cPos.y + cPos.h + pad;
                        this.components[c.id].changed = true;
                    }
                    if (comp.y + comp.h > maxH) { maxH = comp.y + comp.h; }
                    if (comp.x + comp.w > maxW) { maxW = comp.x + comp.w; }
                }
            }
            //REFLOW: setup panel width & height
            if (typeof p == 'object') {
                if ($(p).hasClass('islayout') == true) {
                    //layout panel
                    if ($(p).hasClass('panelbody') == true) {
                        var pbPos = R.elem.pos($('.body-main')[0]);
                        var bh = R.elem.height(document.body);
                        var below = bh - (pbPos.y + pbPos.h);
                        if (pbPos.y + maxH + below < R.window.h) {
                            maxH = R.window.h - pbPos.y - below;
                        }
                    }

                    this.panels[p.id].h = maxH;
                    this.panels[p.id].changed = true;
                    
                    
                } else {
                    //panel component
                    pinner = $(p).find('.inner-panel')[0];
                    c = $(p).parents('.container')[0];
                    if ((pinner.getAttribute('resize') != "1" && pinner.getAttribute("resize") != "3") ||
                    (pinner.getAttribute('resize') == "1" && c.getAttribute('autoresize') == '0') ||
                    (pinner.getAttribute('resize') == "1" && c.getAttribute('autoheight') == '1')) {
                        if (pinner.getAttribute('resizeh') != '1') {
                            this.panels[p.id].h = maxH;
                            this.panels[p.id].changed = true;
                        }
                        if (pinner.getAttribute('resize') == "2" && maxW > 0) {
                            if ((c.style.width == "" || c.style.width == "100%") && pinner.childNodes.length > 1) {
                                this.panels[p.id].w = '100%';
                                this.panels[p.id].wchanged = true;
                            } else {
                                this.panels[p.id].w = maxW;
                                this.panels[p.id].wchanged = true;
                            }
                        }
                    }
                }
            }
        }

        //PAINT: set panel height & width from stacking
        for (xp = 0; xp < stacks.length; xp++) {
            p = this.panels[stacks[xp].panel.id];
            pinner = $(p.p).find('.inner-panel')[0];
            if (p.changed == true) {
                pinner.style.height = p.h + 'px';
            }
            if (p.wchanged == true) {
                pinner.style.width = p.w;
            }
            p.changed = false; p.wchanged = false;
        }

        //PAINT: set component top positions from stacking
        for (e = 0; e < r.length; e++) {
            cid = r[e].id;
            comp = this.components[cid];
            if (comp.changed == true) {
                c = r[e].c;
                if (lvlchange == true) {
                    c.style.top = comp.y + 'px';
                }
                this.components[cid].changed = false;
            }
        }

        if (this.resize.enabled == false) {
            //stop paint on ms timeout
            if (new Date() - this.timer.date > this.timer.timeout) {
                this.stop();
                return;
            }
        }

        //continue to paint until ms timeout
        this.timer.callback = setTimeout(function () { R.events.render.paint(); }, 1000 / this.timer.fps)
    },

    stop: function () {
        if (this.timer.started == false) { return; }
        this.timer.started = false;
    },

    getComponents: function () {
        if (this.components.length == 0) {
            var c = $('.container'), pos;
            for (x = 0; x < c.length; x++) {
                pos = R.elem.offset(c[x]);
                this.components[c[x].id] = {c:c[x], id:c[x].id, x:pos.x, y:pos.y, w:c[x].style.width, h:pos.h, changed:false, useHeight:c[x].getAttribute('autoheight') == '1' ? false : true};
            }
        }
    },

    getPanels: function () {
        if (this.panels.length == 0) {
            var p = R.selectors.cache[7], pos;
            for (x = 0; x < p.length; x++) {
                pos = R.elem.offset(p[x]);
                this.panels[p[x].id] = { p: p[x], x: pos.x, y: pos.y, w: pos.w, h: pos.h, changed: false };
            }
        }
    },

    getWidth: function (c, pos, type, val, autoresize, panelWidth, panelCalcWidth, lvlchange) {
        if (type == "fs" && autoresize == false) {
            //resize component width to fill space
            var warr, ww, wn, wp, wc, 
            warr = val.split(";");
            ww = Number(warr[1]) - Number(warr[2]) - Number(warr[3]);
            wn = panelWidth - Number(warr[2]) - Number(warr[3]);
            wp = ((100 / ww) * wn);
            if (wp == 0) { wc = 1; } else { wc = 100 / wp; }
            wc = Math.round(ww / wc);
            return wc + 'px';
        }else if (type != "fs" && autoresize == false && lvlchange == true) {
            if (panelCalcWidth == false) {
                //change width
                if (val != "") {
                    if (type == "") { type = "px"; }
                    return val + type;
                } else if (type != "") {
                    return '';
                }
            }
        } else if (lvlchange == true && autoresize == true) {
            var cwi = pos.w;
            pos.w = $(c).width();
            return pos.w + 'px';
        }
        return val + type;
    },

    getLeft: function(c, pos, type, val, posright){
        //change left position
        if (type.indexOf("tc") == 0 || type == "") {
            //align centered
            var pn = c.parentNode;
            var tc = type.replace("tc;", "").replace("tc", "");
            if (tc == "") { tc = 0; } else if (tc != "") { tc = Number(tc); }
            var w = (pn.offsetWidth) ? pn.offsetWidth : pn.clientWidth;
            var posw = pos.w.replace('px', '');
            if (posw.indexOf('%') == -1) {
                return Math.round((w - parseInt(posw)) / 2) + tc;
            }
        } else if (type == "tr") {
            //align right
            var posw = pos.w.replace('px', '');
            if (posw.indexOf('%') == -1) {
                var pn = c.parentNode;
                var w = R.elem.width(pn);
                return (w - parseInt(posw) - Number(posright));
            }
        }
        return val;
    }
}

//reset unused arrays
R.components.cache = [];
R.layers.cache = [];
R.responsive.cache = null;
R.responsive.stack = null;