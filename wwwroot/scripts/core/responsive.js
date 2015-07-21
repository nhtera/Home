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

    findStackElement_old: function (c, stack) {
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

    findStackElement: function(c){
        var cPos = R.elem.offset(c), ePos;
        //if (arguments[1] != null) { cPos = arguments[1];}
        var panel = R.elem.panel(c);
        var comps = $(panel).find('.container:above(' + (cPos.y) + ')').sort(function (a, b) {
            var aPos = R.elem.offset(a), bPos = R.elem.offset(b);
            if (aPos.y + aPos.h > bPos.y + bPos.h) { return -1; } return 1;
        });
        if (comps.length == 0) { return null; }
        for (x = 0; x < comps.length; x++) {
            if ($(comps[x]).parents('.container').parents(panel).length == 0) {
                ePos = R.elem.offset(comps[x]);
                if (this.inRange(cPos, ePos) == true || this.inRange(ePos, cPos) == true) { return $(comps[x]); }
            }
        }
        return null;
    },

    inRange: function (cPos, ePos) {
        //cPos = target
        //ePos = element that may be in range
        var pad = 10;
        if (arguments[2] != undefined) { pad = arguments[2]; } // padding
        if (ePos.x >= cPos.x - pad && ePos.x < cPos.x + cPos.w + pad) {
            //in range #1 & #3
            return true;
        }
        if (ePos.x < cPos.x - pad && ePos.x + ePos.w >= cPos.x) {
            //in range #2 & #4
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
        var icc = this.findStackElement(c), it = '';
        stack.data[y].stack = icc;
        if (icc != null) { if (icc.length > 0) { it = icc[0].id.substr(1); } else { it = '!'; } } else { it = '!';}
        this.cache[c.id].stacks[lvl] = it;
        this.altered(c);
    },

    altered: function (c) {
        if (R.editor) {
            var ch = this.cache[c.id];
            R.editor.save.add(c.id, 'responsive', { id: c.id, levels: ch.levels, stacks: ch.stacks });
        }
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
                $('.container[autoresize="1"]:not([cid="panel"])'), //[3]
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

R.panels = {
    items: [{ p: null, x: 0, y: 0, w: 0, h: 0 }],

    get: function () {
        if (this.items.length == 0) {
            var p = R.selectors.cache[7], pos;
            for (x = 0; x < p.length; x++) {
                pos = R.elem.offset(p[x]);
                this.items[p[x].id] = { p: p[x], x: pos.x, y: pos.y, w: pos.w, h: pos.h };
            }
        }
        return this.items;
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
        if (typeof isNotResponsive != "undefined") { return;}
        var winPos = R.window.pos(), size = 'hd', wp = $('.webpage');
        if (R.elem.width(wp[0]) > 0) {
            winPos.w = R.window.w = R.elem.width(wp[0]);
        } else {
            winPos.w = R.window.absolute.w;
        }
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
        if (typeof isNotResponsive != "undefined") { return;}
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
                cols, perc, w, h, minw, cl;

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

            //step 2: div-href hidden anchor buttons
            for (x = 0; x < sel[4].length; x++) {
                w = R.elem.width($(sel[4][x]).parent().parent()[0]);
                h = R.elem.height($(sel[4][x]).parent().parent()[0]);
                changes.push({ c: $(sel[4][x])[0], w: w + "px", h: h + "px" });
            }


            //PAINT: Reset element styles //////////////////////////////////////////////////////////////////////

            //REFLOW: Calculate new settings for elements //////////////////////////////////////////////////////

            //PAINT: Update element styles /////////////////////////////////////////////////////////////////////
            if (changes.length > 0) {
                for (x = 0; x < changes.length; x++) {
                    if ((typeof changes[x].c).indexOf('object') >= 0) {
                        if (changes[x].w != null) {
                            changes[x].c.style.width = changes[x].w;
                        }
                        if (changes[x].h != null) {
                            changes[x].c.style.height = changes[x].h;
                        }
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
        if (typeof isNotResponsive != "undefined") { return;}
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
        this.panels = [];
        this.getComponents();
        this.getPanels();

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
        if (typeof isNotResponsive != "undefined") { return;}
        if (this.timer.started == false) {
            R.window.pos();
            this.viewport.w = R.window.w;
            this.viewport.h = R.window.h;
        }
        if (arguments.length == 2 && arguments[1] !== true) {
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
            if (R.editor.dashboard) {
                if (R.editor.dashboard.visible == true) {
                    this.paint(arguments[0] == true ? true : null, arguments[1] == true ? true : null, true);
                    return;
                }
            }
            if ($('.webpage')[0].style.display != 'none') {
                this.paint(arguments[0] == true ? true : null, arguments[1] == true ? true : null);
            } else {
                this.paint(arguments[0] == true ? true : null, arguments[1] == true ? true : null, true);
            }
        }
    },

    paint: function () {
        if (this.timer.started == false || this.disabled == true) { return; }
        var lvlchange = R.responsive.getLevel(), rl = R.responsive.level, r = R.responsive.cache,
            panelw, lvls, c, cid, comp, rcomp, cX, cY, cW, cH, mw, cPos,
            stacks, p, maxW = 0, maxH = 0, pad = 20, stack, cs, irl, pinner;

        if (arguments[0] == true) { lvlchange = true; }

        //REFLOW: get viewport width (if animation enabled)
        if (this.resize.enabled == true) {
            this.resize.position = (100 / this.resize.speed * (new Date() - this.resize.date));

            if (this.resize.position > 100) {
                this.resize.position = 100; this.resize.enabled = false;
                mw = this.resize.endwidth;
            } else {
                if (this.resize.endwidth > this.resize.startwidth) {
                    //grow viewport
                    mw = (((this.resize.endwidth - this.resize.startwidth) * ((this.resize.position / 100))) + this.resize.startwidth);
                    if (mw >= this.resize.endwidth) { mw = this.resize.endwidth; }
                } else {
                    //shrink viewport
                    mw = (((this.resize.startwidth - this.resize.endwidth) * (1 - (this.resize.position / 100))) + this.resize.endwidth);
                    if (mw <= this.resize.endwidth) { mw = this.resize.endwidth; }
                }
            }
            this.viewport.w = mw; R.window.w = mw; this.viewport.changed = true;

            if (this.resize.enabled == false) {
                this.timer.date = new Date();
                if(lvlchange == false){lvlchange = R.responsive.getLevel();} 
                rl = R.responsive.level; 
            }
        }
        if (arguments[2] != true && r != null) {

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

                            if (cW != comp.w) { this.components[cid].w = cW; this.components[cid].changed = true; this.components[cid].wchanged = true; }
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
            if (this.viewport.changed == true && this.viewport.w != R.window.absolute.w) {
                R.selectors.cache[10][0].style.maxWidth = this.viewport.w + 'px';
            } else if (this.viewport.changed == true) {
                R.selectors.cache[10][0].style.maxWidth = '';
            }


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
            this.viewport.changed = false;

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

            //REFLOW: get stack cache on level change
            if (lvlchange == true) { R.responsive.getStackCache(); }
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
                p.changed = false;
                this.panels[stacks[xp].panel.id] = p;
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

            //REFLOW: get panels new width & height
            this.getPanels();
        }//End non-dashboard (webpage) painting

        //execute callbacks
        R.events.doc.resize.callback.execute('onGo');
        if (lvlchange == true) { R.events.doc.resize.callback.execute('onLevelChange', rl);}

        if (this.resize.enabled == false) {
            //stop paint on ms timeout
            if (new Date() - this.timer.date > this.timer.timeout) {
                this.stop();
                return;
            }
        }

        //continue to paint until ms timeout
        this.timer.callback = setTimeout('R.events.render.paint('+arguments[0]+','+ arguments[1]+','+ arguments[2]+');', 1000 / this.timer.fps)
    },

    stop: function () {
        if (this.timer.started == false) { return; }
        this.timer.started = false;

        //execute callbacks
        R.events.doc.resize.callback.execute('onStop');
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
        } else {
            var p, pos;
            for (x in this.panels) {
                p = this.panels[x];
                if (p.wchanged == true || p.hchanged == true) {
                    pos = { w: R.elem.width(p.p), h: R.elem.height(p.p) };
                    p.wchanged = false; p.hchanged = false;
                    p.w = pos.w; p.h = pos.h;
                    this.panels[x] = p;
                }
                
                
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