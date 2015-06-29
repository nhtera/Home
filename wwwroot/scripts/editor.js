/// Rennder Platform : editor.js ///
/// <reference path="core/global.js" />
/// <reference path="core/view.js" />
/// <reference path="core/responsive.js" />


R.editor = {
    hide: function () {
        $('.editor > .toolbar, .editor > .windows, .tools').hide();
        $('.editor > .tab').show();
        $('.body').css({ top: 0 });
        $('body').removeClass('editing');
    },

    show: function () {
        $('.editor > .toolbar, .editor > .windows, .tools').show();
        $('.editor > .tab').hide();
        $('.body').css({ top: 50 });
        $('body').addClass('editing');
        R.editor.components.hideSelect();
    },

    viewport: {
        speed: 0,

        resize: function (width) {
            R.events.render.trigger(this.speed * 500, width);
        }
    },

    events: {
        hashChange: function () {
            //reload layers window
            if ($('.winLayers').length == 1) {
                R.editor.layers.refresh();
            }
        }
    },

    window: {
        windows: [], loadclick:null,

        load: function (name, url, data, options) {
            var a = this.windows[name.replace(/ /g, '')];
            var div, win = $('.editor > .windows .win' + name.replace(/ /g, ''));
            var autoHide = false, addResize = false;
            if (options != null) {
                if (options.autoHide == true) { autoHide = true; }
                if (options.popup == true) {
                    setTimeout(function () { R.editor.components.disabled = true; R.editor.components.hideSelect();}, 100);
                }
            }
            
            if (win.length > 0) {
                div = win[0];
                if (autoHide == true && win[0].style.display != 'none') {
                    win.hide();
                } else {
                    R.editor.window.callback.click(null, 'bg');
                    win.show();
                }
            } else {
                //create new window
                R.editor.window.callback.click(null, 'bg');
                var item = { title:name, name:name.replace(/ /g, ''), x: 0, y: 50, w: 320, h: 240, r: null, target: null, align: null, arrow: null, spacing: 0, toolbar: true, classes:'', addResize:false, resizable:false, popup:false };

                //setup options
                if (options != null) {
                    if (options.x != null) { item.x = options.x; }
                    if (options.y != null) { item.y = options.y; }
                    if (options.w != null) { item.w = options.w; }
                    if (options.h != null) { item.h = options.h; }
                    if (options.r != null) { item.r = options.r; }
                    if (options.title != null) { item.title = options.title; }
                    if (options.target != null) { item.target = options.target; }
                    if (options.align != null) { item.align = options.align; }
                    if (options.arrow != null) { item.arrow = options.arrow; }
                    if (options.spacing != null) { item.spacing = options.spacing; }
                    if (options.toolbar != null) { item.toolbar = options.toolbar; }
                    if (options.popup != null) { item.popup = options.popup; item.classes += ' popup'}
                    if (options.autoHide != null) { item.autoHide = options.autoHide; }
                    if (options.postOnce != null) { item.postOnce = options.postOnce; item.pageId = R.page.id;}
                }
                
                if (a != null && typeof a != 'undefined') {
                    if (a.x != null) { item.x = a.x; }
                    if (a.y != null) { item.y = a.y; }
                    if (a.w != null) { item.w = a.w; }
                    if (a.h != null) { item.h = a.h; }
                    if (a.r != null) { item.r = a.r; }
                }

                switch (item.align) {
                    case 'bottom-center':
                        if (item.arrow == true) { item.classes += ' arrow-top'; }
                        break;
                }

                if (item.y < 50) { item.y = 50; }
                item = this.reposition(item);

                //create window using options
                div = document.createElement('div');
                div.className = 'window win' + item.name + ' draggable' + item.classes;
                if (item.r != null) {
                    //right-aligned
                    item.addResize = true;
                    div.style.left = (R.window.w - item.r - item.w) + 'px';
                } else {
                    //left-aligned
                    div.style.left = item.x + 'px';
                }
                div.style.top = (item.y + item.spacing) + 'px';
                div.style.width = item.w + 'px';
                div.style.minHeight = item.h + 'px';
                if (item.popup == true) {
                    div.style.zIndex = 4550;
                }

                var htm = '';
                if (item.toolbar != false) {
                    htm += '<div class="grip">';
                    if (item.title != '') { htm += '<div class="title">' + item.title + '</div>'; }
                    htm += '<div class="close"><a href="javascript:" onclick="R.editor.window.hide(event)">' +
                          '<svg viewBox="0 0 15 15"><use xlink:href="#icon-close" x="0" y="0" width="36" height="36" /></svg></a></div></div>';
                }
                htm += '<div class="content"></div>';
                div.innerHTML = htm;
                $('.editor > .windows')[0].appendChild(div);
                item.elem = div;
                R.editor.window.draggable();

                this.windows[item.name] = item;
                a = item;

                if (item.addResize == true) {
                    R.events.doc.resize.callback.add(div, this.windows[item.name], null,
                        function () { R.editor.window.callback.resize(this.vars); },
                        function () { R.editor.window.callback.resize(this.vars); });
                }

                this.callback.windowResize();
            }

            //request data from server to load into window
            var post = true, a;
            if (win.length > 0) {
                if (a.postOnce == 'pageid') { 
                    if(a.pageId == R.page.id){ post = false; }
                }else if(a.postOnce === true){
                    post = false;
                }
            }
            if (url != '' && url != null && post == true) {
                R.ajax.post('/services/'+url, data, R.editor.window.callback.ajax);
            }

            this.loadclick = div;
            setTimeout(function () { R.editor.window.loadclick = null; }, 200);
        },

        reposition: function (item) {
            if (item.align != null) {
                //align window to the target
                item.addResize = true;
                var targ, win = R.window;
                if (item.target != null) {
                    targ = { target: $(item.target), item: null, spacing: 0 };
                    targ.pos = R.elem.pos(targ.target[0]);
                    targ.spacing = item.spacing;
                    if (item.arrow == true) { targ.spacing += 10; }
                }
                
                
                switch (item.align) {
                    case 'bottom-center':
                        item.x = (targ.pos.x + (targ.pos.w / 2)) - (item.w / 2);
                        item.y = targ.pos.y + targ.pos.h + targ.spacing;
                        break;
                    case 'center':
                        item.x = (win.absolute.w / 2) - (item.w / 2);
                }
            }
            return item;
        },

        callback: {
            ajax: function (data) {
                if (data.d.__type == 'Rennder.WebServices.Inject') {
                    R.ajax.callback.inject(data);
                } else {
                    if (data.d.window != null && data.d.html != null) {
                        $('.editor .window.win' + data.d.window + ' > .content')[0].innerHTML = data.d.html;
                    }

                    //finally, execute callback javascript
                    if (data.d.js != '' && data.d.js != null) {
                        var js = new Function(data.d.js);
                        js();
                    }
                }
            },

            resize: function (item) {
                item = R.editor.window.reposition(item);
                $(item.elem).css({ top: item.y })
                if (item.r != null) {
                    //right-aligned
                    $(item.elem).css({ left: (R.window.w - item.r - item.w) });
                } else {
                    //left-aligned
                    $(item.elem).css({ left: item.x });
                }
                

            },

            click: function (target, type) {
                //hide window popups
                var hidepopups = false;
                var exclude = null;
                if (type != 'window') {
                    hidepopups = true;
                } else {
                    var t = $(target)
                    if ($(target).hasClass('window') == false) {
                        t = $(target).parents('.window');
                    }
                    var c = t[0].className.split(' ');
                    for (x = 0; x < c.length; x++) {
                        if (c[x].indexOf('win') == 0 && c[x] != 'window') {
                            exclude = $('.window.' + c[x])[0]; break;
                        }
                    }
                    hidepopups = true;
                }
                if (hidepopups == true) {
                    var win;
                    for (c in R.editor.window.windows) {
                        win = R.editor.window.windows[c];
                        if (win.elem != exclude && win.popup == true && R.editor.window.loadclick != win.elem) {
                            $(win.elem).hide();
                        }
                    }
                    R.editor.components.disabled = false;
                }

            },

            windowResize: function () {
                $('.editor .window > .content').css({ maxHeight: R.window.absolute.h - 80 });
            }
        },

        open: {
            pageSettings: function (pageId, title) {
                R.editor.window.load('PageSettings', 'dashboard/pages.asmx/LoadSettings', { pageId: pageId },
                    { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: 'pageid', title: 'Page Settings for \'' + title + '\'' });
            }
        },

        draggable: function () {
            $(".editor .windows > .window").draggable({
                handle: '.grip', containment: '.body', scroll:false, snap: ".editor .window:not(.popup)", snapMode: "outer", drag: function (e, ui) {
                    if (ui.position.left >= R.window.absolute.w - $(this).width()) { ui.position.left = R.window.absolute.w - $(this).width(); }
                    if (ui.position.top >= R.window.absolute.h - $(this).height()) { ui.position.top = R.window.absolute.h - $(this).height(); }
                }
            });
        },

        hide: function (e) {
            var c = null;
            if (typeof e.target != 'undefined') {
                c = $(e.target);
            } else {
                c = e;
            }
            if (c.hasClass('window')==true) {
                c.hide();
            } else {
                c.parents('.window').hide();
            }
        }
    },

    components: {
        selected: null, hovered: null, selbox: $('.tools > .component-select'), disabled: false,
        posStart: { x: 0, y: 0, w: 0, h: 0 },

        dragNew: {
            item:{elem:null, pos:{x:0,y:0,w:0,h:0}},
            start: function (e) {
                item.elem = R.elem.fromEvent(e);
                item.pos = R.elem.offset(item.elem);
                var mPos = mousePos(e);
                var win = R.window;
                var x = mPos.x + win.scrollx,
                    y = mPos.y + win.scrolly;
            },

            go: function () {

            },

            end: function () {

            }
        },

        drag: {
            item: {
                elem: null, pos: { x: 0, y: 0, w: 0, h: 0 },
                cursorStart: { x: 0, y: 0 }, cursor: { x: 0, y: 0 }
            },
            timer:null, started:false, painting:false, disabled:false, vertical:false, moved:false,
            start: function (e) {
                if ($(e.target).hasClass('component-select') == false && $(e.target).parents('.arrow-down').length == 0) { return;}
                if (R.editor.components.drag.disabled == true) { return; }
                R.editor.components.drag.moved = false;
                R.editor.components.drag.started = true;
                R.editor.components.drag.item.elem = R.editor.components.hovered;
                R.editor.components.posStart = R.elem.offset(R.editor.components.hovered);
                R.editor.components.drag.item.pos = R.elem.offset(R.editor.components.hovered);

                var mPos = { x: e.pageX, y: e.pageY };
                var win = R.window;
                R.editor.components.drag.item.cursorStart = {
                    x: mPos.x + win.scrollx,
                    y: mPos.y + win.scrolly
                };
                R.editor.components.drag.item.cursor = {
                    x: mPos.x + win.scrollx,
                    y: mPos.y + win.scrolly
                };
                if ($(e.target).hasClass('arrow-down') == true || $(e.target).parents('.arrow-down').length > 0) {
                    R.editor.components.drag.vertical = true;
                } else {
                    R.editor.components.drag.vertical = false;
                }

                //bind document mouse events
                $(document).bind('mousemove', R.editor.components.drag.go);
                $(document).bind('mouseup', R.editor.components.drag.end);
            },

            startFinish: function () {
                if (R.editor.components.drag.disabled == true) { return; }
                if (this.started == true && this.painting == false) {
                    R.editor.components.disabled = true;
                    this.painting = true;

                    //modify component select
                    $('.component-select').css({ opacity: 0 });

                    //start paint timer
                    R.editor.components.drag.paint();
                }
            },

            go: function (e) {
                if (R.editor.components.drag.disabled == true) { return; }
                if(R.editor.components.drag.painting == false){
                    R.editor.components.drag.startFinish();
                }
                R.editor.components.drag.item.cursor.x = e.pageX + R.window.scrollx;
                R.editor.components.drag.item.cursor.y = e.pageY + R.window.scrolly;
            },

            paint: function () {
                if (this.disabled == true) { return; }
                var mDiff = {
                    x: this.item.cursor.x - this.item.cursorStart.x,
                    y: this.item.cursor.y - this.item.cursorStart.y
                }

                if (this.vertical == true) { mDiff.x = 0; }
                if (mDiff.x != 0 || mDiff.y != 0) { this.moved = true; }
                $(this.item.elem).css({ left: this.item.pos.x + mDiff.x, top: this.item.pos.y + mDiff.y });

                if (this.started == true) {
                    setTimeout(function () { R.editor.components.drag.paint(); }, 33);
                }
            },

            end: function () {
                R.editor.components.drag.started = false;

                //unbind document mouse up event
                $(document).unbind('mouseup');
                $(document).unbind('mousemove');


                if (R.editor.components.drag.painting == true && R.editor.components.drag.disabled == false && R.editor.components.drag.moved == true) {
                    //save responsive changes 
                    R.editor.components.savePosition(R.editor.components.drag.item.elem);

                    //show component select
                    setTimeout(function () {
                        R.editor.components.disabled = false;
                        R.editor.components.mouseEnter(R.editor.components.drag.item.elem);
                        $('.component-select').animate({ opacity: 1 }, 300);
                    },10);
                } else if (R.editor.components.drag.moved == false) {
                    //cancel drag & click instead
                    $('.component-select').css({ opacity: 1 }).hide();
                    R.editor.components.disabled = false;
                    //R.editor.components.click(R.editor.components.hovered, 'component-select');
                }
                R.editor.components.drag.painting = false;
            }
        },

        resize: {
            options: {
                pad: { left: 0, right: 0, top: 0, bottom: 0 }, inner: { left: false, right: false, top: false },
                side: 't', cursor: { x: 0, y: 0 }, cursorStart: { x: 0, y: 0 }, elemStart: { x: 0, y: 0, w:0, h:0 }, offset: { x: 0, y: 0 },
                elemPos: { x: 0, y: 0, w: 0, h: 0 }, panelPos: { x: 0, y: 0, w: 0, h: 0 }, elem: null, timer: null, started: false,
                corner: 20, border: 5, autoHeight:false, autoResize:false, rIndex:0, isPanel:false, 
            },

            start: function (e) {
                //setup options
                R.editor.components.disabled = true;
                R.editor.components.resize.options.started = true;
                R.editor.components.drag.disabled = true;
                R.editor.components.posStart = R.elem.offset(R.editor.components.hovered);

                var bar = $(this), mPos = { x: e.pageX, y: e.pageY };
                var p = R.elem.panel(R.editor.components.hovered),
                    c = R.editor.components.hovered, r = R.responsive.cache;
                mPos.x += R.window.scrollx;
                mPos.y += R.window.scrolly;
                R.editor.components.resize.options.elem = c;
                R.editor.components.resize.options.cursor.x = mPos.x;
                R.editor.components.resize.options.cursor.y = mPos.y;
                R.editor.components.resize.options.cursorStart.x = mPos.x;
                R.editor.components.resize.options.cursorStart.y = mPos.y;
                R.editor.components.resize.options.elemPos = R.elem.offset(c);
                R.editor.components.resize.options.panelPos = R.elem.pos(p);
                R.editor.components.resize.options.elemStart = {
                    x: R.editor.components.resize.options.elemPos.x - R.editor.components.resize.options.offset.x,
                    y: R.editor.components.resize.options.elemPos.y - R.editor.components.resize.options.offset.y,
                    w: R.editor.components.resize.options.elemPos.w,
                    h: R.editor.components.resize.options.elemPos.h
                }
                if (R.editor.components.hovered.getAttribute('autoheight') == '1') {
                    R.editor.components.resize.options.autoHeight = true;
                } else {
                    R.editor.components.resize.options.autoHeight = false;
                }
                if (R.editor.components.hovered.getAttribute('autoresize') == '1') {
                    R.editor.components.resize.options.autoResize = true;
                } else {
                    R.editor.components.resize.options.autoResize = false;
                }

                //find component within responsive cache
                R.editor.components.resize.options.rIndex = R.responsive.getComponentFromCache(c);


                //get selected resize side or corner
                if (bar.hasClass('resize-top') == true) {
                    R.editor.components.resize.options.side = 't';
                } else if (bar.hasClass('resize-top-right') == true) {
                    R.editor.components.resize.options.side = 'tr';
                } else if (bar.hasClass('resize-right-top') == true) {
                    R.editor.components.resize.options.side = 'tr';
                } else if (bar.hasClass('resize-right') == true) {
                    R.editor.components.resize.options.side = 'r';
                } else if (bar.hasClass('resize-right-bottom') == true) {
                    R.editor.components.resize.options.side = 'br';
                } else if (bar.hasClass('resize-bottom-right') == true) {
                    R.editor.components.resize.options.side = 'br';
                } else if (bar.hasClass('resize-bottom') == true) {
                    R.editor.components.resize.options.side = 'b';
                } else if (bar.hasClass('resize-bottom-left') == true) {
                    R.editor.components.resize.options.side = 'bl';
                } else if (bar.hasClass('resize-left-bottom') == true) {
                    R.editor.components.resize.options.side = 'bl';
                } else if (bar.hasClass('resize-left') == true) {
                    R.editor.components.resize.options.side = 'l';
                } else if (bar.hasClass('resize-left-top') == true) {
                    R.editor.components.resize.options.side = 'tl';
                } else if (bar.hasClass('resize-top-left') == true) {
                    R.editor.components.resize.options.side = 'tl';
                }

                //modify component select
                $('.component-select .menu, .component-select .arrow-down, .editor .windows').hide();

                //bind document mouse events
                $(document).bind('mousemove', R.editor.components.resize.go);
                $(document).bind('mouseup', R.editor.components.resize.end);

                //start timer
                R.editor.components.resize.timer = setTimeout(function () { R.editor.components.resize.paint(); }, 50);
            },

            go: function (e) {
                R.editor.components.resize.options.cursor.x = e.pageX + R.window.scrollx;
                R.editor.components.resize.options.cursor.y = e.pageY + R.window.scrolly;
            },

            paint: function () {
                var pos = $.extend({}, this.options.elemStart);
                var mDiff = {
                    x: this.options.cursor.x - this.options.cursorStart.x,
                    y: this.options.cursor.y - this.options.cursorStart.y
                }
                switch (this.options.side) {
                    case 't'://top
                        pos.y += mDiff.y;
                        pos.h -= mDiff.y;
                        break;
                    case 'tr'://top-right
                        pos.y += mDiff.y;
                        pos.h -= mDiff.y;
                        pos.w += mDiff.x;
                        break;
                    case 'r'://right
                        pos.w += mDiff.x;
                        break;
                    case 'br'://bottom-right
                        pos.h += mDiff.y;
                        pos.w += mDiff.x;
                        break;
                    case 'b'://bottom
                        pos.h += mDiff.y;
                        break;
                    case 'bl'://bottom-left
                        pos.h += mDiff.y;
                        pos.x += mDiff.x;
                        pos.w -= mDiff.x;
                        break;
                    case 'l'://left
                        pos.x += mDiff.x;
                        pos.w -= mDiff.x;
                        break;
                    case 'tl'://top-left
                        pos.y += mDiff.y;
                        pos.h -= mDiff.y;
                        pos.w -= mDiff.x;
                        break;
                }
                if (R.hotkeys.keyhold == 'shift') {
                    //resize from center instead of top-left
                    var newPos = $.extend({}, pos);
                    var origPos = $.extend({}, this.options.elemStart);
                    if (origPos.w > pos.w) {
                        //smaller width
                        newPos.x = origPos.x + (origPos.w - pos.w);
                        newPos.w -= ((origPos.w - pos.w));
                    } else {
                        //larger width
                        newPos.x = origPos.x - (pos.w - origPos.w);
                        newPos.w += ((pos.w - origPos.w));
                    }
                    if (origPos.h > pos.h) {
                        //smaller height
                        newPos.y = origPos.y + (origPos.h - pos.h);
                        newPos.h -= ((origPos.h - pos.h));
                    } else {
                        //larger height
                        newPos.y = origPos.y - (pos.h - origPos.h);
                        newPos.h += ((pos.h - origPos.h));
                    }
                    pos = $.extend({}, newPos);
                }

                $(this.options.elem).css({ left: pos.x, top: pos.y });
                if (this.options.autoHeight == false && this.options.autoResize == false) {
                    $(this.options.elem).css({ height: pos.h });
                    if (mDiff.y != 0) {
                        //update height in responsive settings
                        R.responsive.cache[this.options.rIndex].h = pos.h;
                        R.responsive.cache[this.options.rIndex].levels[R.responsive.level][11] = pos.h;
                        R.events.render.components[this.options.elem.id].h = pos.h;

                    }
                }
                if (this.options.autoResize == false) {
                    $(this.options.elem).css({ width: pos.w });
                }
                R.editor.components.resizeSelectBox();

                

                R.events.render.trigger();
                if (this.options.started == true) {
                    setTimeout(function () { R.editor.components.resize.paint(); }, 33);
                }
            },

            end: function () {
                R.editor.components.resize.options.started = false;

                //save responsive changes 
                R.editor.components.savePosition(R.editor.components.resize.options.elem);

                //unbind document mouse move event
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');

                //modify component select
                $('.component-select .menu, .component-select  .arrow-down, .editor .windows').show();
                setTimeout(function () {
                    R.editor.components.drag.disabled = false;
                    R.editor.components.disabled = false;
                    R.editor.components.selected = null;
                    R.editor.components.mouseEnter(R.editor.components.resize.options.elem);
                }, 0);

                
            }
        },

        mouseEnter: function () {
            if (R.editor.components.disabled == true) { return; }
            R.editor.components.menu.hideAll();
            var c = this;
            if (typeof arguments[0].id != 'undefined') { c = arguments[0];}
            if (R.editor.components.selected != c) {
                if (R.editor.components.selected != null) {
                    if ($(R.editor.components.selected).parents('#' + c.id).length > 0) { return; }
                } else {
                    var p = $(c).parents('.component.type-panel');
                    if (p.length > 0) {
                        R.editor.components.selected = p[0];
                    }
                }
                R.editor.components.hovered = c;
                R.editor.components.resizeSelectBox();
                $('.tools > .component-select').show();
            }
        },

        mouseLeave: function (e) {
            if (R.editor.components.disabled == true) { return; }
            if (R.editor.components.selected != this && $(e.target).parents('.arrow-down, .menu').length == 0) {
                
                R.editor.components.hideSelect();
            }
        },

        click: function (target, type) {
            if (R.editor.components.disabled == true) { return; }
            if (type == 'component-select') {
                //select component
                if ($(target).hasClass('component-select') == false) { return; }
                if (R.editor.components.selected != R.editor.components.hovered) {
                    R.editor.components.selected = R.editor.components.hovered;
                    $('.tools > .component-select').hide();
                }
            } else {
                if(type != 'window' && type != 'toolbar' && type != 'tools'){
                    //deselect component
                    var t = target, hide = false;
                    if (type == 'component') {
                        if ($(t).hasClass('container') == false) {
                            if ($($(t).parents('.container')[0]).find('.ispanel').length > 0) {
                                //mouseEnter only if the component is a panel
                                t = $(t).parents('.container')[0];
                            }
                        }
                    }
                    if (t == R.editor.components.selected || $(t).find(R.editor.components.selected).length > 0) {
                        R.editor.components.selected = null;
                        R.editor.components.hideSelect();
                        R.editor.components.mouseEnter(t);
                    } else {
                        if (R.editor.components.selected != null) {
                            if ($(t).parents(R.editor.components.selected).length = 0) {
                                hide = true;
                            }
                        } else { hide = true;}
                    }
                    if (hide == true) {
                        R.editor.components.selected = null;
                        R.editor.components.hideSelect();
                    }
                }

            }
            
        },

        hideSelect: function () {
            R.editor.components.hovered = null;
            $('.tools > .component-select').hide();
        },

        nudge: function (dir, speed) {
            if (this.hovered != null) {
                var c = this.hovered;
                switch (dir) {
                    case 'up':
                        $(c).css({ top: "-=" + speed });
                        break;
                    case 'right':
                        $(c).css({ left: "+=" + speed });
                        break;
                    case 'down':
                        $(c).css({ top: "+=" + speed });
                        break;
                    case 'left':
                        $(c).css({ left: "-=" + speed });
                        break;
                }
                this.resizeSelectBox();
                //delay, save position into responsive design settings
                setTimeout(function () {
                    var c = R.editor.components.hovered;
                    if (c != null) {
                        var s = getComponentFromStack(c);
                        R.editor.components.savePosition(c, null, null, null, null, null, cPos, 'nostack', R.responsive.stacks[R.responsive.level][s.panel].data[s.c]);
                    }
                }, 100);
            }
        },

        resizeSelectBox: function () {

            var cPos = R.elem.pos(this.hovered), pad = { left: 12, right: 12, top: 12, bottom: 12 }, 
                corner = this.resize.options.corner, border = this.resize.options.border, inner={left:false, right:false, top:false};

            //check padding for window edges
            if (cPos.x + cPos.w + border >= R.window.absolute.w) {
                //right edge
                pad.right = 0 - ((cPos.x + cPos.w) - R.window.absolute.w);
                inner.right = true;
            }
            if (cPos.x - border <= 0) {
                //left edge
                pad.left = 0 + (cPos.x);
                inner.left = true;
            }
            if (cPos.y - border < 50) {
                //top edge
                pad.top = 0 - (50 - (cPos.y));
                inner.top = true;
            }

            //reposition container
            if (this.selected != this.hovered) {
                this.selbox.css({ left: cPos.x-pad.left, top: cPos.y-pad.top, width: cPos.w+(pad.left + pad.right), height: cPos.h+(pad.top + pad.bottom) });
            } else {
                this.selbox.css({ left: cPos.x-pad.left, top: cPos.y-pad.top, width: 0, height: 0 });
            }

            cPos.w += (pad.left + pad.right);
            cPos.h += (pad.top + pad.bottom);
            this.resize.options.pad = pad;
            this.resize.options.inner = inner;

            //repostion resize bars
            if(this.posStart.w != cPos.w || this.posStart.h != cPos.h){
                this.selbox.find('.resize-top').css({ top: 0, left: border + corner, width: cPos.w - (border * 2) - (corner * 2), height: border });
                this.selbox.find('.resize-top-right').css({ top: 0, left: cPos.w - border - corner, width: corner + border, height: border });
                this.selbox.find('.resize-right-top').css({ top: border, left: cPos.w - border, width: border, height: corner });
                this.selbox.find('.resize-right').css({ top: border + corner, left: cPos.w - border, width: border, height: cPos.h - (border * 2) - (corner * 2) });
                this.selbox.find('.resize-right-bottom').css({ top: cPos.h - border - corner, left: cPos.w - border, width: border, height: corner });
                this.selbox.find('.resize-bottom-right').css({ top: cPos.h - border, left: cPos.w - border - corner, width: corner + border, height: border });
                this.selbox.find('.resize-bottom').css({ top: cPos.h - border, left: border + corner, width: cPos.w - (border * 2) - (corner * 2), height: border });
                this.selbox.find('.resize-bottom-left').css({ top: cPos.h - border, left: 0, width: border + corner, height: border });
                this.selbox.find('.resize-left-bottom').css({ top: cPos.h - border - corner, left: 0, width: border, height: corner + border });
                this.selbox.find('.resize-left').css({ top: border + corner, left: 0, width: border, height: cPos.h - (border * 2) - (corner * 2) });
                this.selbox.find('.resize-left-top').css({ top: border, left: 0, width: border, height: corner });
                this.selbox.find('.resize-top-left').css({ top: 0, left: 0, width: border + corner, height: border });
            }

            //reposition vertical drag button
            if (inner.top == false) {
                this.selbox.find('.arrow-down').css({ left: (cPos.w / 2) - 20, top:-15 });
            } else {
                this.selbox.find('.arrow-down').css({ left: (cPos.w / 2) - 20, top:border });
            }

            //reposition menu
            if (inner.right == false) {
                this.selbox.find('.menu').css({ left: cPos.w, top:0});
            } else {
                this.selbox.find('.menu').css({ left: cPos.w - 40 - border, top:border + 3 });
            }

            //reposition menu properties window
        },

        savePosition:function(c){
            //update responsive design properties
            var lvl = R.responsive.level, r = R.responsive.cache, panel = R.elem.panel(c), oldRel, oldPos,
                cPos = R.elem.offset(c), pPos = R.elem.pos(panel), dropped = arguments[1] || false,
                levels = ['px', 'px', 'px', '', 'tc', cPos.x, cPos.y, cPos.w, "", "", cPos.x + cPos.w, cPos.h, "px"];
            //  levels = left, width, top, parallax, alignment, x, y, width, top-padding, ?, right-position, height, height-type

            //get current level settings
            if (R.components.cache[c.id]) {
                if (R.components.cache[c.id].levels.length > 4) {
                    var lv = R.components.getCacheLevel(c);
                    levels = R.components.cache[c.id].levels[lv].split(',');
                }
            }

            //get the old position of the component before it was dragged
            if (arguments[6] != null && arguments[6] != undefined) {
                //get original positions for the component before it was dragged or resized
                oldPos = arguments[6];
                levels[11] = oldPos.h;
            } else {
                oldPos = cPos;
            }
            oldRel = { y: (oldPos.y - pPos.y), x: (oldPos.x - pPos.x), w: oldPos.w, h: oldPos.h };
            
            //set up new level settings
            var newlvls = levels.slice(0);
            if (newlvls[4] == '') { newlvls[4] = 'tc';}
            if (newlvls[7] == '') { newlvls[7] = cPos.w; }
            newlvls[6] = cPos.y;

            //setup left position
            if (levels[4] == 'tl') {
                //align left
                newlvls[5] = cPos.x;
                newlvls[10] = cPos.x + cPos.w;
            } else if (levels[4] == 'tr') {
                //align right
                newlvls[5] = cPos.x - pPos.w;
                newlvls[10] = pPos.w - (cPos.x + cPos.w);
            }

            //setup width
            if (levels[1] == 'fs') {
                newlvls[7] = ((100 / pPos.w) * cPos.w).toString().substring(0, 7) + ";" + pPos.w + ";";
                if (levels[4] == 'tl') {
                    newlvls[7] += cPos.x + ";" + (pPos.w - cPos.x - cPos.w);
                } else if (levels[4] == 'tr') {
                    newlvls[7] += (pPos.w + cPos.x) + ";" + (0 - cPos.x - cPos.w);
                }
            } else if (levels[1] == 'px') {
                if (c.style.width = '') {
                    newlvls[7] = '';
                } else if (c.style.width == '100%') {
                    newlvls[7] = '100%';
                } else {
                    newlvls[7] = cPos.w;
                }
            } else if (levels[1] == '%') {
                newlvls[7] = ((100 / pPos.w) * cPos.w).toString().substring(0, 7);
            }
            if (levels[4].indexOf('tc') == 0) {
                var pnPos = R.elem.offset(c.parentNode);
                newlvls[4] = 'tc;' + (cPos.x - (Math.round((pnPos.w - cPos.w) / 2)))
            }

            //setup height
            if (c.getAttribute("autoresize") != "1" && c.getAttribute("autoheight") != "1") {
                if (levels[12] == 'px') {
                    newlvls[11] = cPos.h;
                } else if (levels[12] == 'aspect') {
                    newlvls[11] = (1 / cPos.w) * cPos.h;
                    if (newlvls[11].toString().length > 6) { newlvls[11] = newlvls[11].toString().substr(0, 6); }
                }
            }

            //update stacking of components within this component's panel /////////////////////////////////////////////////////////////////////////////////////
            var rIndex = R.responsive.getComponentFromCache(c);
            var sIndex = R.responsive.getComponentFromStack(c);
            var stack = R.responsive.stack[lvl][sIndex.panel].data[sIndex.c];
            var stackP = R.responsive.stack[lvl][sIndex.panel];

            var intelC, wastopmost = false, istopmost = false, killIntel = false,
                isOff = false, ison = false, wason = false, isrighton = false,
                intel = null, comPos, comRel, oldcomRel, extraH = 0, ltop = 0, ctop = 0,
                Cpad = 20, newIntelC = new Array(), newIntel = "", oldIntel = "", rlayer,
                comp = null, intelComp = null, comPad = 0, ispushed = false, wasabove = false,
                wasinwidth = false, isinGroup = false, underc = false, itemid = c.id.substr(1),
                isMoved = 0, wasMoved = 0, noblocked = false, wasunder = false, isunder = false,
                wastouching = false, istouching = false, isoverlapping = false, isNudged = false,
                newcRel = { x: cPos.x, y: cPos.y, w: cPos.w, h: cPos.h };

            if (dropped == true) {
                intelC = R.components.findStackElement(c, stackP, null, null, null, 50);
            } else {
                intelC = R.components.findStackElement(c, stackP, true);
            }

            if (stack.stack == null && (intelC != null || intelC != undefined)) {
                //this component had no layer to begin with
                isOff = true;

            } else if (intelC != null && stack.stack != null) {
                //the new layer exists
                var e = R.elem.get(intelC[0].id);
                var ePos = R.elem.pos(e);
                if (cPos.y < ePos.y) {
                    //check previous intelligent layer to see if component is above that
                    isOff = true;
                } else {
                    //check to see if if this component is below previous intelligent layer
                    if (stack.stack[0].id != intelC[0].id) {
                        isOff = true;
                    }
                }
            } else if ((intelC == null || intelC == undefined)) {
                //if component doesn't have an intel layer now but did before
                isOff = true;
            }
            if (isOff == true) { killIntel = true; }

            //rebuild stack array for this component's responsive stack level
            newlvls[9][lvl] = "";
            if (arguments[7] != 'none') {
                rlayer = R.responsive.cache[rIndex].levels[lvl];
                if (intelC != null) {
                    rlayer[9][lvl] = intelC[0].id.substr(1);
                    if (dropped == true) {
                        //this component was just dropped onto the page
                        //replace all other component's intel layers that
                        //uses this component's intel layer, and replace 
                        //it with this component's itemid
                    }

                    //figure out new top-padding for this component
                    Cpad = 0;
                    comPos = R.elem.offset(intelC[0]);
                    Cpad = cPos.y - (comPos.y + comPos.h);
                    if (cPos.y < (comPos.y + comPos.h - 30) && R.components.inRange(comPos, cPos, 1)) {
                        Cpad = 0;
                    }
                    newlvls[8] = Cpad;
                    R.components.saveLevel(c, lvl, null, null, null, null, null, null, null, null, Cpad);
                } else {
                    //set 0 top-padding
                    if (isOff == true) { rlayer[9][lvl] = '!'; } else { rlayer[9][lvl] = ''; }
                    newlvls[8] = 0;
                    R.components.saveLevel(c, lvl, null, null, null, null, null, null, null, null, 0);
                }

                if ((arguments[7] != 'nostack' || arguments[7] == null) && (dropped == false || dropped == null)) {
                    //before restacking components, check for empty stack layers ///////////////////////////////////////////////////////////////////////////////////////////////
                    for (i = 0; i < stackP.length; i++) {
                        comp = stackP[i].c;
                        if (comp.id != c.id) {
                            var aintel = ["", "", "", "", ""];
                            var nintel = R.components.cache[comp.id].stacks;
                            for (ni = 0; ni < 5; ni++) {
                                aintel[ni] = nintel[ni];
                            }

                            if (aintel[lvl] == '') {
                                //find intel layer for this component
                                var iLC = R.components.findStackElement(comp, stackP);
                                //next, save the padding between the two components
                                if (typeof iLC != 'undefined' && iLC != null) {
                                    if (iLC.length > 0) {
                                        stackP[i][4] = iLC;
                                        aintel[lvl] = iLC[0].id.substr(1);
                                        var iLCPos = R.elem.pos(iLC[0]);
                                        var iCPos = R.elem.pos(comp);
                                        var pad = iCPos.y - (iLCPos.y + iLCPos.h);
                                        stackP[i][5] = pad;
                                        R.components.saveLevel(comp, lvl, null, null, null, null, null, null, null, null, pad);
                                    }
                                }

                            }
                            R.components.cache[comp.id].stacks = aintel;
                        }
                    }

                    //restack components based on new position of dragged component ///////////////////////////////////////////////////////////////////////////////////////////////
                    oldcomRel = { x: newcRel.x, y: newcRel.y, w: newcRel.w, h: newcRel.h };
                    for (i = 0; i < stackP.data.length; i++) {
                        comp = stackP.data[i].c;
                        intel = null; newIntel = null; wastopmost = false; istopmost = false; wasinwidth = false; isinGroup = false; noblocked = false;
                        wasunder = false; isunder = false; isNudged = false; wastouching = false; istouching = false; Ctop = -1000;

                        if (ispushed == true || underc == true) { R.components.altered(comp); }

                        if (comp.id == c.id) { underc = true; }
                        if (comp.id != c.id && isinGroup == false) {
                            comRel = R.elem.offset(comp);
                            if (comRel.y > newcRel.y) {
                                isunder = true;
                            }

                            isoverlapping = R.components.isOverlapping(newcRel, comRel);
                            wasoverlapping = R.components.isOverlapping(oldRel, comRel);
                            if (isoverlapping == false) {
                                wastouching = R.components.isTouching(oldRel, comRel);
                                istouching = R.components.isTouching(newcRel, comRel);
                            }

                            //get intel layers
                            intel = R.components.cache[comp.id].stacks;

                            if (isunder == true && (istouching == false || (wastouching == false && istouching == true)) && (isoverlapping == false || (isoverlapping == true && wasoverlapping == false))) {
                                ison = R.components.inRange(comRel, oldcomRel, 1);
                                if (ison == true) {
                                    //get the bottom-most component that is above this component
                                    var bc = null, bRel, bIntel, biPos;
                                    if (intel[lvl] != '' && intel[lvl] != '!') {
                                        bc = $("#c" + intel[lvl])[0];
                                    }
                                    
                                    comPad = Number(stackP.data[i].pad);
                                    if (bc != null) { bRel = R.elem.offset(bc); }
                                    bIntel = R.components.findStackElement(comp, stackP, true);
                                    biPos = bRel;
                                    if (bIntel != null) {
                                        bIntel = bIntel[0];
                                        biPos = R.elem.offset(bIntel);
                                    }
                                    if (ispushed == false) {
                                        //components haven't been pushed down yet
                                        //check to see if component's intel layer is above dragged component

                                        if (comRel.y - (newcRel.y + newcRel.h) < 30) {
                                            if (bc != null) {
                                                //check to see if dragged component is below this component's intel layer
                                                if (newcRel.y + newcRel.h + comPad >= biPos.y + biPos.h + comPad) {
                                                    //push component up/down based on its intel layer
                                                    if (intel[lvl] == itemid) {
                                                        isMoved = (newcRel.y + newcRel.h + comPad) - (comRel.y);
                                                    } else {
                                                        if (newcRel.y + newcRel.h + comPad > comRel.y) {
                                                            isMoved = (newcRel.y + newcRel.h + comPad) - (comRel.y);
                                                        }
                                                    }
                                                    if (isMoved > 0) {
                                                        if (comPad >= isMoved + 20) {
                                                            comPad = comPad - isMoved;
                                                            R.components.saveLevel(comp, lvl, null, null, null, null, null, null, null, null, comPad);
                                                            isMoved = 0;
                                                        }
                                                    }
                                                    Ctop = comRel.y + isMoved;
                                                    newIntel = itemid;
                                                    ispushed = true;
                                                } else {
                                                    //push component up/down based on its new intel layer
                                                    isMoved = (biPos.y + biPos.h + comPad) - comRel.y;
                                                    Ctop = biPos.y + biPos.h + comPad;
                                                    newIntel = bIntel.id.substr(1);
                                                    ispushed = true;
                                                }
                                            }

                                            if (isoverlapping == true) {
                                                isMoved = (newcRel.y + newcRel.h + comPad) - comRel.y;
                                                Ctop = comRel.y + isMoved;
                                                newIntel = itemid;
                                                ispushed = true;
                                            }
                                        } else {
                                            //this component is too far below the dragged component
                                            if (newcRel.y > oldRel.y) {
                                                //dragged component was pushed down
                                                if (itemid == newIntel) {
                                                    comPad -= (newcRel.y - oldRel.y);
                                                }
                                                R.components.saveLevel(comp, lvl, null, null, null, null, null, null, null, null, comPad);
                                            } else if (itemid == newIntel) {
                                                //dragged component was pushed up
                                                comPad = comPad + (oldRel.y - newcRel.y);
                                                R.components.saveLevel(comp, lvl, null, null, null, null, null, null, null, null, comPad);
                                            }
                                            ispushed = true;
                                            isMoved = 0;
                                        }
                                    } else if (isMoved != 0) {
                                        Ctop = comRel.y + isMoved;
                                        comp.style.top = Ctop + "px";
                                        var bIntel2 = R.components.findStackElement(comp, stackP);
                                        if (bIntel2 != null) {
                                            bIntel2 = bIntel2[0];
                                            if (bIntel2.id.substr(1) != intel[lvl]) { bIntel = bIntel2; }
                                        }
                                        if (intel[lvl] == itemid && isoverlapping == false) {
                                            newIntel = bIntel.id.substr(1);
                                        } else if (isoverlapping == true) {
                                            newIntel = itemid;
                                        } else {
                                            newIntel = intel[lvl];
                                        }
                                    }
                                    if (Ctop == -1000) { Ctop = comRel.y; }

                                    if (Ctop != comRel.y) {
                                        //make sure this component isn't overlapping dragged component
                                        var overRel = { x: comRel.x, y: Ctop, w: comRel.w, h: comRel.h };
                                        isoverlapping = R.components.isOverlapping(newcRel, overRel);
                                        if (isoverlapping == true) {
                                            isMoved += ((newcRel.y + newcRel.h + comPad) - Ctop);
                                            Ctop = newcRel.y + newcRel.h + comPad;
                                        }

                                        if (cPos.y < oldRel.y) {
                                            //check for components above this component that block the
                                            //path for pushing this component up along with the dragged component
                                            var chkComp, chkRel, chkon, newMoved = 0;
                                            for (k = 0; k < stackP.data.length; k++) {
                                                chkComp = stackP.data[i][0];
                                                chkRel = R.elem.offset(chkComp);
                                                chkon = R.components.inRange(chkRel, comRel, 1);
                                                if (chkon == true) {
                                                    if (chkRel.y > (cPos.y + cPos.h) && chkRel.y < comRel.y) {
                                                        //this component is blocking the stacked component, so change
                                                        //the stacked component's new Ctop
                                                        Ctop = chkRel.y + chkRel.h + comPad;
                                                        isMoved = comRel.y - Ctop;
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        //finally move component where it belongs
                                        comp.style.top = Ctop + "px";
                                        ispushed = true;
                                        R.components.saveLevel(comp, lvl, null, null, null, null, null, null, Ctop, null, null);
                                        //update intel layer id
                                        intel[lvl] = newIntel;
                                        newIntelC[newIntelC.length] = { c: comp, intel: intel }
                                        oldIntel = comp.id.substr(1);
                                    }
                                    //update oldcomrel to check if component is under last component
                                    if (comRel.x < oldcomRel.x) { oldcomRel.x = comRel.x; }
                                    if (comRel.x + comRel.w > oldcomRel.x + oldcomRel.w) { oldcomRel.w = (comRel.x + comRel.w) - oldcomRel.x; }
                                } else if (ison == false && ispushed == false) {
                                    intel[lvl] = itemid;
                                }
                                oldcomRel.y = comRel.y;
                                oldcomRel.h = comRel.h;
                            }
                            //remove intel layer if the intel layer is the same as the dragged component itemid
                            if (intel[lvl] == itemid) {
                                var iC = R.components.findStackElement(comp, stackP);
                                if (iC != null) {
                                    iC = iC[0];
                                    intel[lvl] = iC.id.substr(1);
                                } else {
                                    intel[lvl] = "";
                                }
                            }
                            if (intel.length > 0) {
                                newIntelC[newIntelC.length] = { c: comp, intel: intel }
                            }
                        }
                    }
                }
                R.components.cache[c.id].stacks[lvl] = rlayer[9][lvl];
                newIntelC[newIntelC.length] = { c: c, intel: rlayer[9] }

                //finally, save the new intel layers for this component into the div attribute
                if (newIntelC.length > 0) {
                    for (i = 0; i < newIntelC.length; i++) {
                        R.components.cache[newIntelC[i].c.id].stacks = newIntelC[i].intel;
                    }
                }
            }

            if (isOff == false) {
                //find true top-padding for this component, based on the stack layer it is associated with
                if (stack.stack != null) {
                    ePos = R.elem.offset(stack.stack[0]);
                    newlvls[8] = cPos.y - (ePos.y + ePos.h);
                    R.components.saveLevel(c, lvl, null, null, null, null, null, null, null, null, newlvls[8]);
                }
            }

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //fix any accidental infinite loops within intel layer system
            var isdone = false, loopd = 0;
            var foundloop = false;
            do {
                for (y = 0; y < stackP.data.length; y++) {//list of components to target
                    for (z = stackP.data.length - 1; z > y; z--) {//list of components to search for infinite loop
                        if (stackP.data[y].stack != null) {
                            if (stackP.data[z].c.id == stackP.data[y].stack[0].id) {
                                for (o = 0; o < stackP.data.length - 1; o++) {
                                    if (stackP.data[o].c.id == stackP.data[y].stack[0].id) {
                                        R.components.saveStackLayer(stackP.data[y].stack[0], stackP, o, lvl)
                                        break;
                                    }
                                }
                                R.components.saveStackLayer(stackP.data[y].c, stackP, y, lvl)
                                foundloop = true;
                                break;
                            }
                        }
                    }
                    if (foundloop == true) { break; }
                }
                if (foundloop == false) { isdone = true; }
                foundloop = false;
                loopd += 1;
            } while (isdone == false && loopd < 10);

            //save responsive settings ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            R.components.cache[c.id].levels[lvl] = newlvls.join(',');
            R.responsive.cache[rIndex].levels[lvl] = newlvls;
            R.responsive.cache[rIndex].levels[lvl][9] = R.components.cache[c.id].stacks;
            R.components.saveLevel(c, lvl, newlvls[0], newlvls[1], newlvls[2], newlvls[3], newlvls[4], newlvls[5], newlvls[6], newlvls[7], newlvls[8]);
            

            //reset responsive system
            R.events.render.init();
            //R.events.render.trigger(true, true);
        },

        menu: {
            showing: null,

            clickFromEvent: function (e) {
                if ($(this).find('.icon-position').length > 0) {
                    R.editor.components.menu.show('position');
                } else if ($(this).find('.icon-layer').length > 0) {
                    R.editor.components.menu.show('layer');
                } else if ($(this).find('.icon-style').length > 0) {
                    R.editor.components.menu.show('style');
                }
            },

            show: function (tab) {
                var p = $('.component-select .properties');
                if ($('.component-select .section-' + tab)[0].style.display != 'none' && p[0].style.display != 'none') { this.hide(tab); return; }
                this.hideAll();
                $('.component-select .section-position, .component-select .section-layer, .component-select .section-style').hide();
                $('.component-select .section-' + tab).show();
                p.css({ opacity: 0, width:'' }).show();
                var cPos = R.elem.pos(R.editor.components.hovered), pPos = R.elem.offset(p[0]), 
                    mPos = R.elem.offset($('.component-select .menu')[0]), options = R.editor.components.resize.options;
                var pos = { x: mPos.x + 43, y: 0 }
                if (options.inner.right == true) {
                    //display window inside component select next to menu
                    pos.x = mPos.x - 3;
                    p.css({ opacity: 1, left: pos.x - pPos.w, top: options.border + 3 });
                    $('.component-select .menu .item:has(.icon-' + tab + ')').css({ left:-3, paddingLeft:3  });
                } else {
                    if (mPos.x + 43 + pPos.w >= R.window.w) {
                        //display window inside component select next to resize bar
                        pos.x = mPos.x - options.border;
                        p.css({ opacity: 1, left: pos.x - pPos.w, top: options.border + 3 });
                    } else {
                        //display window outside component next to menu
                        p.css({ opacity: 1, left: pos.x, top:0 });
                        $('.component-select .menu .item:has(.icon-' + tab + ')').css({ paddingRight: 3 });
                    }

                }
            },

            hide: function (tab) {
                var p = $('.component-select .properties');
                if ($('.component-select .section-' + tab)[0].style.display == 'none' || p[0].style.display == 'none') { return; }
                var cPos = R.elem.pos(R.editor.components.hovered), pPos = R.elem.offset(p[0]),
                    mPos = R.elem.offset($('.component-select .menu')[0]), options = R.editor.components.resize.options;
                var pos = { x: mPos.x + 43, y: 0 }
                p.hide();
                if (options.inner.right == true) {
                    //display window inside component select next to menu
                    $('.component-select .menu .item:has(.icon-' + tab + ')').css({ left: 0, paddingLeft: 0 });
                } else {
                    if (mPos.x + 43 + pPos.w >= R.window.w) {
                        //display window inside component select next to resize bar
                    } else {
                        //display window outside component next to menu
                        $('.component-select .menu .item:has(.icon-' + tab + ')').css({ paddingRight: 0 });
                    }

                }
            },

            hideAll: function () {
                R.editor.components.menu.hide('position');
                R.editor.components.menu.hide('layer');
                R.editor.components.menu.hide('style');
            },

            reposition: function () {

            },

            save: {
                position: function () {

                },

                layer: function () {

                },

                zindex: function () {

                },

                opacity: function () {

                },

                locked: function () {

                }
            },

            remove: function () {

            }
        },

        loadCategory: function (id) {
            R.ajax.post('/services/rennder/editor.asmx/ComponentsFromCategory', { category: id },
                function (data) {
                    R.ajax.callback.inject(data);
                    $('.window.winComponents #component-categories').hide();
                    $('.window.winComponents #components').show();
            });
        }
    },

    pages: {
        add: {
            item: { parentId: 0, title: '', description: '' },
            show:function (parentId, title) {
                R.editor.pages.add.item = { parentId: parentId, title: '', description: '' };
                R.editor.window.load('NewPage', 'rennder/editor.asmx/NewPage', { parentId: parentId || 0, title: title },
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', spacing: 50, loadOnce: true, title: 'New Web Page' });
            },

            typeTitle: function (e) {
                var title = $('#newPageTitle').val(), err = false;
                if (err == false) { if (title == '') { err = true; } }
                if (err == false) { err = R.util.str.isAlphaNumeric(title, true); }
                if (err == false) { err = R.util.str.hasCurseWords(title); }
                title=title.replace(/ /g,'-');
                if (err == true) {
                    $('#newpage-url').html('<div class="font-error" style="text-decoration:line-through">' + R.editor.pages.add.item.url + title + '</div>');
                } else {
                    $('#newpage-url').html(R.editor.pages.add.item.url + title);
                }
                
            },

            submit: function () {
                var title = $('#newPageTitle').val(), desc = $('#newPageDescription').val(), err = false, secure = false, datapage = false;
                if (err == false) {
                    if (title == '') {
                        R.util.message.show($('#newPageError'),'Please include a title for your page.'); return false;
                    }
                }
                if (err == false) {
                    err = R.util.str.isAlphaNumeric(title, true);
                    if (err == true) {
                        R.util.message.show($('#newPageError'), 'Remove special characters from the page title.'); return false;
                    }
                }
                if (err == false) {
                    err = R.util.str.hasCurseWords(title);
                    if (err == true) {
                        R.util.message.show($('#newPageError'), 'Remove bad words from the page title.'); return false;
                    }
                }
                if (err == false) {
                    if (desc == '') {
                        R.util.message.show($('#newPageError'), 'Please include a description for your new page.'); return false;
                    }
                }
                if (err == false) {
                    err = R.util.str.hasCurseWords(desc);
                    if (err == true) {
                        R.util.message.show($('#newPageError'), 'Remove bad words from the page description.'); return false;
                    }
                }
                $(this).hide();
                secure = $('#newPageSecure').is(':checked');
                if ($('#newPageData')) { datapage = $('#newPageData').is(':checked'); }
                var data = { title: title, description: desc, parentId: R.editor.pages.add.item.parentId, isSecure: secure, isDataPage: datapage };
                R.ajax.post('/services/dashboard/pages.asmx/Create', data, R.ajax.callback.inject);
            },
        },

        settings: {
            item: { pageId: 0},
            show: function (pageId) {
                R.editor.pages.settings.item = { pageId: pageId};
                R.editor.window.load('PageSettings', 'rennder/editor.asmx/PageSettings', { pageId: pageId},
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', spacing: 50, loadOnce: true, title: 'Web Page Settings' });
            },

            submit: function () {
                var desc = $('#pageSettingsDescription').val(), err = false, secure = false;
                
                if (err == false) {
                    if (desc == '') {
                        R.util.message.show($('#pageSettingsError'), 'Please include a description for your page settings.'); return false;
                    }
                }
                if (err == false) {
                    err = R.util.str.hasCurseWords(desc);
                    if (err == true) {
                        R.util.message.show($('#pageSettingsError'), 'Remove bad words from the page description.'); return false;
                    }
                }
                $(this).hide();
                secure = $('#pageSettingsSecure').is(':checked');
                var data = {pageId: R.editor.pages.settings.item.pageId, description: desc, isSecure: secure};
                R.ajax.post('/services/dashboard/pages.asmx/Update', data, R.ajax.callback.inject);
            },
        },

        remove: function (pageId) {
            if (confirm('Do you really want to delete this web page? This cannot be undone.') == true) {
                R.ajax.post('/services/dashboard/pages.asmx/Remove', { pageId: pageId }, R.ajax.callback.inject);
            }
        },

        expand: function (pageId) {
            if ($('.winWebPages .content .page-' + pageId).children().length == 3) {
                //load sub pages
                R.ajax.post('/services/dashboard/pages.asmx/LoadSubPages', { parentId: pageId }, R.ajax.callback.inject);
            } else {
                //view sub pages
                $('.winWebPages .content .page-' + pageId + ' > .sub').show();
            }
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a').attr('onclick', 'R.editor.pages.collapse(\'' + pageId + '\')');
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a use').attr('xlink:href', '#icon-collapse');
        },

        collapse: function (pageId) {
            $('.winWebPages .content .page-' + pageId + ' > .sub').hide();
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a').attr('onclick', 'R.editor.pages.expand(\'' + pageId + '\')');
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a use').attr('xlink:href', '#icon-expand');
        }
    },

    layers: {
        show: function(){
            R.editor.window.load('Layers', 'rennder/editor.asmx/Layers', {}, { r: 0, y: 0, w: 250, h: 100, loadOnce: true });
        },

        refresh: function () {
            $('.winLayers .layers-list').off('.row', 'mouseenter mouseleave');
            var layers = R.layers.cache, comps = R.components.cache,
                htm = '', i = [2, 2, 2, 2, 2], pageId, p, p2, rowTitle = '', rowColor = 'blue', hasSubs = false, img, itemId,
                panels = $('.ispanel:not(.islayout)'), laypanels = $('.ispanel.islayout'), comps, comps2, comp, classes;
            for (l = 0; l < layers.length; l++) {
                //load each layer ///////////////////////////////////////////////////////////////////////////////////////////////
                i[0] = i[0] == 2 ? 1 : 2;
                rowTitle = layers[l].title;
                if (layers[l].pageType == 1) { rowTitle = 'Page'; }
                itemId = rowTitle.replace(/ /g, '')+'Layer';
                htm += '<div class="row color'+i[0]+' page-layer-row item-'+itemId+'">'+
                        '<div class="expander purple"><div class="column right icon icon-expand"><a href="javascript:" onclick="R.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15" /></svg></a></div></div>' +
                        '<div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-layers" x="0" y="0" width="36" height="36" /></svg></div>' +
                        '<div class="column left title">' + rowTitle + ' Layer</div><div class="clear"></div>';
                pageId = layers[l].pageId;

                i[1] = 2;
                for (s = 0; s < laypanels.length; s++) {
                    //load each web page panel //////////////////////////////////////////////////////////////////////////////////
                    p = $(laypanels[s]);
                    comps = p.find('.container').filter(function (index, elem) { if ($(elem).parents('.ispanel:not(.islayout)').length > 0) { return false; } return true;});
                    hasSubs = false;
                    //make sure there are components within this panel that belong to the current layer
                    for (c = 0; c < comps.length; c++) {
                        if (R.components.cache[comps[c].id].pageId == pageId) { hasSubs = true; break; }
                    }
                    
                    //this panel contains components that are a part of the current layer
                    i[1] = i[1] == 2 ? 1 : 2;
                    rowColor = 'blue';
                    rowTitle = R.util.str.Capitalize(p[0].className.split(' ')[0].replace('panel', '')) + ' Area';
                    itemId = rowTitle.replace(/ /g, '');
                    htm += '<div class="sub" style="display:none;">' +
                        '<div class="row color'+i[1]+' page-panel-row item-'+itemId+'">' +
                        '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';
                    
                    if (hasSubs == true) {
                        htm += '<a href="javascript:" onclick="R.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15" /></svg></a>';
                    }

                    htm += '</div></div><div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-panel" x="0" y="0" width="36" height="36" /></svg></div>' +
                        '<div class="column left title">' + rowTitle + '</div><div class="clear"></div>';

                    if (hasSubs == true) {
                        i[2] = 2;
                        for (c = 0; c < comps.length; c++) {
                            //load each component that belongs to the web page panel ///////////////////////////////////////////////
                            i[2] = i[2] == 2 ? 1 : 2;
                            comp = $(comps[c]);
                            rowColor = '';
                            classes = comp[0].className.split(' ');
                            rowTitle = R.util.str.Capitalize(classes[R.util.array.indexOfPartialString(classes, 'type-')].replace('type-', ''));

                            hasSubs = false;
                            if (comp.find('.ispanel').length > 0) { hasSubs = true;}
                            itemId = comps[c].id;
                            
                            htm += '<div class="sub" style="display:none;">' +
                                '<div class="row color' + i[1] + ' component-row item-'+itemId+'">' +
                                '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';
                            
                            if (hasSubs == true) {
                                htm += '<a href="javascript:" onclick="R.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15" /></svg></a>';
                            }
                            img = R.components.cache[comps[c].id].type;
                            htm +='</div></div><div class="column left icon-img"><img src="/components/'+img+'/iconsm.png"/></div>' +
                                '<div class="column left title">' + rowTitle + '</div><div class="clear"></div>';

                            if (hasSubs == true) {
                                i[3] = 2;
                                panels = comp.find('.ispanel');
                                for (s2 = 0; s2 < panels.length; s2++) {
                                    //load each component panel cell /////////////////////////////////////////////////////////////////////
                                    p2 = $(panels[s2]);
                                    if (p2.hasClass('islayout') == false) {
                                        //make sure this panel belongs to the current web page panel                                    

                                        hasSubs = false;
                                        //make sure there are components within this panel that belong to the current layer
                                        //for (c = 0; c < stacks[s2].data.length; c++) {
                                        //if (R.components.cache[stacks[s2].data[c].c.id].pageId == pageId) { hasSubs = true; break; }
                                        //}

                                        //this panel contains components that are a part of the current layer
                                        i[3] = i[3] == 2 ? 1 : 2;
                                        rowTitle = 'Cell';
                                        rowColor = 'green';
                                        itemId = panels[s2].id;
                                        htm += '<div class="sub" style="display:none;">' +
                                            '<div class="row color' + i[2] + ' panel-cell-row item-'+itemId+'">' +
                                            '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand"><a href="javascript:" onclick="R.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15" /></svg></a></div></div>' +
                                            '<div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-panel" x="0" y="0" width="36" height="36" /></svg></div>' +
                                            '<div class="column left title">' + rowTitle + '</div><div class="clear"></div>';
                                            
                                        comps2 = p2.find('.container');
                                        i[4] = 2;
                                        for (c2 = 0; c2 < comps2.length; c2++) {
                                            //load each component that belongs to the panel cell ///////////////////////////////////////////////
                                            i[4] = i[4] == 2 ? 1 : 2;
                                            comp = $(comps2[c2]);
                                            rowColor = '';
                                            classes = comp[0].className.split(' ');
                                            rowTitle = R.util.str.Capitalize(classes[R.util.array.indexOfPartialString(classes,'type-')].replace('type-', ''));

                                            hasSubs = false;
                                            if (comp.find('.ispanel').length > 0) { hasSubs = true; rowColor = 'green'; }
                                            itemId = comps2[c2].id;

                                            htm += '<div class="sub" style="display:none;">' +
                                                '<div class="row color' + i[1] + ' component-row item-'+itemId+'">' +
                                                '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';

                                            img = R.components.cache[comps2[c2].id].type;
                                            htm += '</div></div><div class="column left icon-img"><img src="/components/' + img + '/iconsm.png"/></div>' +
                                                '<div class="column left title">' + rowTitle + '</div><div class="clear"></div></div></div>';
                                        }

                                        htm += '</div></div>'; // end component panel row
                                    }
                                }
                            }

                            htm += '</div></div>'; // end component row
                        }
                        if (1 == 0) {
                            
                        }

                        i[1] = 2;
                        for (c = 0; c < comps.length; c++) {
                            //load each component that belongs to the web page panel
                            i[1] = i[1] == 2 ? 1 : 2;
                        }
                    }
                    htm += '</div></div>'; // end web page panel row
                }

                htm += '</div>'; //end layer row
            }
            $('.winLayers .layers-list').html(htm);
            setTimeout(function () {
                $('.winLayers .layers-list').on('mouseenter', '.row', R.editor.layers.mouseEnter.row);
                $('.winLayers .layers-list').on('mouseleave', '.row', R.editor.layers.mouseLeave.row);
            }, 200);
        },

        expand: function (itemId) {
            $('.winLayers .content .item-' + itemId + ' > .sub').show();
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a').attr('onclick', 'R.editor.layers.collapse(\'' + itemId + '\')');
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a use').attr('xlink:href', '#icon-collapse');
        },

        collapse: function (itemId) {
            $('.winLayers .content .item-' + itemId + ' > .sub').hide();
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a').attr('onclick', 'R.editor.layers.expand(\'' + itemId + '\')');
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a use').attr('xlink:href', '#icon-expand');
        },

        mouseEnter: {
            row: function () {
                var classes = this.className.split(' ');
                var itemId = classes[R.util.array.indexOfPartialString(classes, 'item-')].replace('item-', '');
                var rowType = classes[R.util.array.indexOfPartialString(classes, '-row')];
                switch (rowType) {
                    case 'page-panel-row':
                        R.editor.layers.mouseEnter.showPagePanel(itemId.toLowerCase().replace('area',''));
                        break;
                    case 'component-row':
                        R.editor.layers.mouseEnter.showComponent(itemId);
                        break;
                    case 'panel-cell-row':
                        R.editor.layers.mouseEnter.showPanelCell(itemId);
                        break;
                }
            },

            showPagePanel: function (itemId) {
                var pos = R.elem.pos($('#panel' + itemId)[0]);
                var div = document.createElement('div');
                div.className = 'page-panel-border item-' + itemId;
                div.innerHTML = '&nbsp;';
                $(div).css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                $('.tools .borders').append(div);
                R.util.scrollIntoView($('#panel' + itemId)[0]);
            },

            showComponent: function (itemId) {
                R.editor.components.selected = null;
                R.editor.components.hovered = null;
                R.editor.components.disabled = false;
                R.editor.components.mouseEnter($('#' + itemId)[0]);
                R.util.scrollIntoView($('#' + itemId)[0]);
            },

            showPanelCell: function (itemId) {
                var pos = R.elem.pos($('#' + itemId)[0]);
                var div = document.createElement('div');
                div.className = 'panel-cell-border item-' + itemId;
                div.innerHTML = '&nbsp;';
                $(div).css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                $('.tools .borders').append(div);
                R.util.scrollIntoView($('#' + itemId)[0]);
            }
        },

        mouseLeave: {
            row: function () {
                var classes = this.className.split(' ');
                var itemId = classes[R.util.array.indexOfPartialString(classes, 'item-')].replace('item-', '');
                var rowType = classes[R.util.array.indexOfPartialString(classes, '-row')];
                switch (rowType) {
                    case 'page-panel-row':
                        R.editor.layers.mouseLeave.hidePagePanel(itemId.toLowerCase().replace('area', ''));
                        break;
                    case 'component-row':
                        R.editor.layers.mouseLeave.hideComponent(itemId);
                        break;
                    case 'panel-cell-row':
                        R.editor.layers.mouseLeave.hidePanelCell(itemId);
                        break;
                }
            
            },

            hidePagePanel: function (itemId) {
                $('.tools .borders .page-panel-border.item-'+itemId).remove();
            },

            hideComponent: function (itemId) {
                R.editor.components.mouseLeave();
            },

            hidePanelCell: function (itemId) {
                $('.tools .borders .panel-cell-border.item-' + itemId).remove();
            }
        },

        add: {
            show: function () {

            },

            typeTitle: function (e) {

            },

            submit: function () {

            }
        },

        load: {
            show: function () {

            },

            select: function () {

            }
        },

        remove: function () {

        }
    },

    logout: function () {
        R.editor.hide();

        //unbind events
        delete document.onkeydown;
        R.events.doc.click.callback.remove($('.editor')[0]);
        $('.webpage').delegate('.container', 'mouseenter');
        $('.component-select').delegate('.resize-bar', 'mousedown');
        $('.component-select').unbind('mouseleave');

        for (e in this.window.windows) {
            R.events.doc.resize.callback.remove(this.window.windows[e].elem);
        }

        //remove DOM elements
        var editor = $('body > .editor')[0]; editor.parentNode.removeChild(editor);
        var gridleft = $('.webpage > .grid-leftside')[0]; gridleft.parentNode.removeChild(gridleft);
        var gridright = $('.webpage > .grid-rightside')[0]; gridright.parentNode.removeChild(gridright);
    }
}

R.hotkeys = {
    keyhold:'',
    keydown:function(e){
        if ($("input, textarea").is(":focus") == false) {
            var k = e.keyCode, itemId = '', isPanel = false, c = null;
            if (R.editor.components.hovered != null) {
                c = R.editor.components.hovered;
                itemId = c.id.substr(1);
                if ($(c).hasClass('type-panel') == true) { isPanel = true;}
            }

            if (e.shiftKey == true) {//shift pressed
                R.hotkeys.keyhold = 'shift';
                var a, lbl;
                switch (k) { //setup variables for groups of keys
                    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: case 48:
                        //a = $R('aResponsiveSpeed'); lbl = $R('spanResponsiveSpeed');
                }
                switch (k) { //execute code for single key + shift press
                    case 38: //up
                        R.editor.components.nudge('up', 10);
                        break;
                    case 39: //right
                        R.editor.components.nudge('right', 10);
                        break;
                    case 40: //down
                        R.editor.components.nudge('down', 10);
                        break;
                    case 37: //left
                        R.editor.components.nudge('left', 10);
                        break;
                    case 49: //1
                        //a.innerHTML = 'fast';
                        //lbl.innerHTML = "On instant";
                       R.editor.viewport.speed = 0;
                        break;
                    case 50: //2
                        //a.innerHTML = 'slow';
                        //lbl.innerHTML = "On fast";
                        R.editor.viewport.speed = 1;
                        break;
                    case 51: //3
                        //a.innerHTML = 'slower';
                        //lbl.innerHTML = "On slow";
                        R.editor.viewport.speed = 3;
                        break;
                    case 52: //4
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slower";
                        R.editor.viewport.speed = 9;
                        break;
                    case 53: //5
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x2";
                        R.editor.viewport.speed = 12;
                        break;
                    case 54: //6
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x3";
                        R.editor.viewport.speed = 18;
                        break;
                    case 55: //7
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x4";
                        R.editor.viewport.speed = 25;
                        break;
                    case 56: //8
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x5";
                        R.editor.viewport.speed = 35;
                        break;
                    case 57: //9
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x6";
                        R.editor.viewport.speed = 50;
                        break;
                    case 48: //0
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x7";
                        R.editor.viewport.speed = 100;
                        break;
                }

            } else if (e.ctrlKey == true) {
                R.hotkeys.keyhold = 'ctrl';
                switch (k) {
                    case 67: //c (copy)
                       
                        break;
                    case 86: //v (paste)
                        var panelId = '', scrolly = winPos.scrolly;
                        if (isPanel == true) {
                            panelId = itemId;
                            var pPos = R.elem.pos(p);
                            scrolly = winPos.scrolly - pPos.y + 50;
                        }
                        //var panelIndex = ''; //index of visible panel in a slideshow
                        //postRennderAjax('7', panelId + ',' + panelIndex + ',' + scrolly + ',' + interfaceSelected);
                        return false;
                        break;
                    case 88: //x (cut)
                        //postRennderAjax('8', itemId + ',' + winPos.scrolly);
                        break;
                    case 89: //y (redo)
                        //RedoAction();
                        break;
                    case 90: //z (undo);
                        //UndoAction();
                        break;

                }

            } else { //no shift, ctrl, or alt pressed
                R.hotkeys.keyhold = '';
                switch (k) {
                    case 27: //escape
                        if ($('.editor .toolbar')[0].style.display =='none') {
                            R.editor.show();
                        } else {
                            R.editor.hide();
                        }
                    case 38: //up
                        R.editor.components.nudge('up', 1);
                        break;
                    case 39: //right
                        R.editor.components.nudge('right', 1);
                        break;
                    case 40: //down
                        R.editor.components.nudge('down', 1);
                        break;
                    case 37: //left
                        R.editor.components.nudge('left', 1);
                        break;
                    case 46: //backspace
                        R.editor.components.remove();
                        break;
                    case 49: //1
                        R.editor.viewport.resize('cell');
                        break;
                    case 50: //2
                        R.editor.viewport.resize('mobile');
                        break;
                    case 51: //3
                        R.editor.viewport.resize('tablet');
                        break;
                    case 52: //4
                        R.editor.viewport.resize('desktop');
                        break;
                    case 53: //5
                        R.editor.viewport.resize('hd');
                        break;
                }
            }

            if (k >= 37 && k <= 40) { //arrow keys
                return false;
            }

        }
    },

    keyup: function (e) {
        R.hotkeys.keyhold = '';
    }
}

R.util.str = {
    Capitalize: function(str){
        return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    },

    isAlphaNumeric: function (str, spaces, exchars) {
        var ex = [], chr, sub, err=false;
        if (exchars) { if (exchars.length > 0) { ex.concat(exchars); } }
        for (x = 0; x < str.length; x++) {
            sub = str.substr(x,1);
            chr = str.charCodeAt(x);
            //groups of characters
            if (chr >= 0 && chr <= 47) { err = true; }
            if (chr >= 58 && chr <= 64) { err = true; }
            if (chr >= 91 && chr <= 96) { err = true; }
            if (chr >= 123) { err = true; }

            //spaces
            if (spaces == true) { if (sub == ' ') { err = false;}}

            //exempt characters
            for (y = 0; y < ex.length; y++) {
                if (ex[y] == sub) { err = false; break;}
            }
        }
        return err;
    },

    hasCurseWords: function (str, include) {
        var words = ['fuck', 'cunt', 'nigger', 'pussy', 'asshole', 'bitch', 'whore', 'slut'];
        if (include) { if (include.length > 0) { words.concat(include); } }
        for (x = 0; x < words.length; x++) {
            if (str.indexOf(words[x]) > -1) { return true;}
        }
        return false;
    }
}

R.util.array = {
    indexOfPartialString:function(arr, str){
        for (x = 0; x < arr.length; x++){
            if(arr[x].indexOf(str)>-1){return x;}
        }
        return -1;
    }
}

R.util.message = {
    show: function (div, msg) {
        $(div).css({opacity:0, height:'auto'}).show().html(msg);
        var h = R.elem.height($(div)[0]);
        $(div).css({ height: 0, overflow: 'hidden' }).show().animate({ height: h-9, opacity: 1 }, 1000).delay(10000).animate({ opacity: 0, height:0 }, 1000, function () { $(this).hide(); });
    }
}

R.util.scrollIntoView = function (elem) {
    //only scrolls if the element is out of view
    var pos = R.elem.pos(elem);
    var options = { offset: -100 }
    if (arguments[1] != null) {
        var arg = arguments[1];
        if (arg.offset != null) { options.offset = arg.offset;}
    }
    if (pos.y < R.window.scrolly - 50 || pos.y + pos.h > R.window.h + R.window.scrolly + 10) {
        $(document.body).scrollTo($(elem), options);
    }
}

// Window Events ////////////////////////////////////////////////////////////////////////////////////
document.onkeydown = R.hotkeys.keydown;
document.onkeyup = R.hotkeys.keyup;
R.events.doc.resize.callback.add($('.editor')[0], null, null, null, R.editor.window.callback.windowResize);
R.events.doc.click.callback.add($('.editor')[0], null, R.editor.window.callback.click);
R.events.doc.click.callback.add($('.editor')[0], null, R.editor.components.click);
R.events.hash.callback.add($('.editor')[0], null, R.editor.events.hashChange);
$('.webpage').delegate('.container', 'mouseenter', R.editor.components.mouseEnter)
$('.component-select').delegate('.resize-bar', 'mousedown', R.editor.components.resize.start)
$('.component-select').bind('mouseleave', R.editor.components.mouseLeave)
$('.component-select .menu .item:has(.icon-position), .component-select .menu .item:has(.icon-layer), .component-select .menu .item:has(.icon-style)').bind('click', R.editor.components.menu.clickFromEvent);


/*
 * Medium.js - Taking control of content editable
 * Copyright 2013-2015, Jacob Kelley - http://jakiestfu.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/jakiestfu/Medium.js/
 * Version: master
 */

(function (w, d) {
	'use strict';

	var rangy = w['rangy'] || null,
		undo = w['Undo'] || null,
		key = w.Key = {
			'backspace': 8,
			'tab': 9,
			'enter': 13,
			'shift': 16,
			'ctrl': 17,
			'alt': 18,
			'pause': 19,
			'capsLock': 20,
			'escape': 27,
			'pageUp': 33,
			'pageDown': 34,
			'end': 35,
			'home': 36,
			'leftArrow': 37,
			'upArrow': 38,
			'rightArrow': 39,
			'downArrow': 40,
			'insert': 45,
			'delete': 46,
			'0': 48,
			'1': 49,
			'2': 50,
			'3': 51,
			'4': 52,
			'5': 53,
			'6': 54,
			'7': 55,
			'8': 56,
			'9': 57,
			'a': 65,
			'b': 66,
			'c': 67,
			'd': 68,
			'e': 69,
			'f': 70,
			'g': 71,
			'h': 72,
			'i': 73,
			'j': 74,
			'k': 75,
			'l': 76,
			'm': 77,
			'n': 78,
			'o': 79,
			'p': 80,
			'q': 81,
			'r': 82,
			's': 83,
			't': 84,
			'u': 85,
			'v': 86,
			'w': 87,
			'x': 88,
			'y': 89,
			'z': 90,
			'leftWindow': 91,
			'rightWindowKey': 92,
			'select': 93,
			'numpad0': 96,
			'numpad1': 97,
			'numpad2': 98,
			'numpad3': 99,
			'numpad4': 100,
			'numpad5': 101,
			'numpad6': 102,
			'numpad7': 103,
			'numpad8': 104,
			'numpad9': 105,
			'multiply': 106,
			'add': 107,
			'subtract': 109,
			'decimalPoint': 110,
			'divide': 111,
			'f1': 112,
			'f2': 113,
			'f3': 114,
			'f4': 115,
			'f5': 116,
			'f6': 117,
			'f7': 118,
			'f8': 119,
			'f9': 120,
			'f10': 121,
			'f11': 122,
			'f12': 123,
			'numLock': 144,
			'scrollLock': 145,
			'semiColon': 186,
			'equalSign': 187,
			'comma': 188,
			'dash': 189,
			'period': 190,
			'forwardSlash': 191,
			'graveAccent': 192,
			'openBracket': 219,
			'backSlash': 220,
			'closeBracket': 221,
			'singleQuote': 222
		},
		Medium = (function () {

			/**
 * Medium.js - Taking control of content editable
 * @constructor
 * @param {Object} [userSettings] user options
 */
var Medium = function (userSettings) {
	"use strict";

	var medium = this,
		defaultSettings = utils.deepExtend({}, Medium.defaultSettings),
		settings = this.settings = utils.deepExtend(defaultSettings, userSettings),
		cache = new Medium.Cache(),
		selection = new Medium.Selection(),
		action = new Medium.Action(this),
		cursor = new Medium.Cursor(this),
		undoable = new Medium.Undoable(this),
		el,
		newVal,
		i;

	for (i in defaultSettings) if (defaultSettings.hasOwnProperty(i)) {
		// Override defaults with data-attributes
		if (
			typeof defaultSettings[i] !== 'object'
			&& defaultSettings.hasOwnProperty(i)
			&& settings.element.getAttribute('data-medium-' + key)
		) {
			newVal = settings.element.getAttribute('data-medium-' + key);

			if (newVal.toLowerCase() === "false" || newVal.toLowerCase() === "true") {
				newVal = newVal.toLowerCase() === "true";
			}
			settings[i] = newVal;
		}
	}

	if (settings.modifiers) {
		for (i in settings.modifiers) if (settings.modifiers.hasOwnProperty(i)) {
			if (typeof(key[i]) !== 'undefined') {
				settings.modifiers[key[i]] = settings.modifiers[i];
			}
		}
	}

	if (settings.keyContext) {
		for (i in settings.keyContext) if (settings.keyContext.hasOwnProperty(i)) {
			if (typeof(key[i]) !== 'undefined') {
				settings.keyContext[key[i]] = settings.keyContext[i];
			}
		}
	}

	// Extend Settings
	el = settings.element;

	// Editable
	el.contentEditable = true;
	el.className
		+= (' ' + settings.cssClasses.editor)
	+ (' ' + settings.cssClasses.editor + '-' + settings.mode);

	settings.tags = (settings.tags || {});
	if (settings.tags.outerLevel) {
		settings.tags.outerLevel = settings.tags.outerLevel.concat([settings.tags.paragraph, settings.tags.horizontalRule]);
	}

	this.settings = settings;
	this.element = el;
	el.medium = this;

	this.action = action;
	this.cache = cache;
	this.cursor = cursor;
	this.utils = utils;
	this.selection = selection;

	// Initialize editor
	medium.clean();
	medium.placeholders();
	action.preserveElementFocus();

	this.dirty = false;
	this.undoable = undoable;
	this.makeUndoable = undoable.makeUndoable;

	if (settings.drag) {
		medium.drag = new Medium.Drag(medium);
		medium.drag.setup();
	}

	action.setup();

	// Set as initialized
	cache.initialized = true;

	this.makeUndoable(true);
};

Medium.prototype = {
	placeholders: function () {
		//in IE8, just gracefully degrade to no placeholders
		if (!w.getComputedStyle) return;

		var s = this.settings,
			placeholder = this.placeholder || (this.placeholder = d.createElement('div')),
			el = this.element,
			style = placeholder.style,
			elStyle = w.getComputedStyle(el, null),
			qStyle = function (prop) {
				return elStyle.getPropertyValue(prop)
			},
			text = utils.text(el),
			cursor = this.cursor,
			childCount = el.children.length,
			hasFocus = Medium.activeElement === el;

		el.placeholder = placeholder;

		// Empty Editor
		if (
			!hasFocus
			&& text.length < 1
			&& childCount < 2
		) {
			if (el.placeHolderActive) return;

			if (!el.innerHTML.match('<' + s.tags.paragraph)) {
				el.innerHTML = '';
			}

			// We need to add placeholders
			if (s.placeholder.length > 0) {
				if (!placeholder.setup) {
					placeholder.setup = true;

					//background & background color
					style.background = qStyle('background');
					style.backgroundColor = qStyle('background-color');

					//text size & text color
					style.fontSize = qStyle('font-size');
					style.color = elStyle.color;

					//begin box-model
					//margin
					style.marginTop = qStyle('margin-top');
					style.marginBottom = qStyle('margin-bottom');
					style.marginLeft = qStyle('margin-left');
					style.marginRight = qStyle('margin-right');

					//padding
					style.paddingTop = qStyle('padding-top');
					style.paddingBottom = qStyle('padding-bottom');
					style.paddingLeft = qStyle('padding-left');
					style.paddingRight = qStyle('padding-right');

					//border
					style.borderTopWidth = qStyle('border-top-width');
					style.borderTopColor = qStyle('border-top-color');
					style.borderTopStyle = qStyle('border-top-style');
					style.borderBottomWidth = qStyle('border-bottom-width');
					style.borderBottomColor = qStyle('border-bottom-color');
					style.borderBottomStyle = qStyle('border-bottom-style');
					style.borderLeftWidth = qStyle('border-left-width');
					style.borderLeftColor = qStyle('border-left-color');
					style.borderLeftStyle = qStyle('border-left-style');
					style.borderRightWidth = qStyle('border-right-width');
					style.borderRightColor = qStyle('border-right-color');
					style.borderRightStyle = qStyle('border-right-style');
					//end box model

					//element setup
					placeholder.className = s.cssClasses.placeholder + ' ' + s.cssClasses.placeholder + '-' + s.mode;
					placeholder.innerHTML = '<div>' + s.placeholder + '</div>';
					el.parentNode.insertBefore(placeholder, el);
				}

				el.className += ' ' + s.cssClasses.clear;

				style.display = '';
				// Add base P tag and do auto focus, give it a min height if el has one
				style.minHeight = el.clientHeight + 'px';
				style.minWidth = el.clientWidth + 'px';

				if ( s.mode !== Medium.inlineMode && s.mode !== Medium.inlineRichMode ) {
					this.setupContents();

					if (childCount === 0 && el.firstChild) {
						cursor.set(this, 0, el.firstChild);
					}
				}
			}
			el.placeHolderActive = true;
		} else if (el.placeHolderActive) {
			el.placeHolderActive = false;
			style.display = 'none';
			el.className = utils.trim(el.className.replace(s.cssClasses.clear, ''));
			this.setupContents();
		}
	},

	/**
	 * Cleans element
	 * @param {HtmlElement} [el] default is settings.element
	 */
	clean: function (el) {

		/*
		 * Deletes invalid nodes
		 * Removes Attributes
		 */
		var s = this.settings,
			placeholderClass = s.cssClasses.placeholder,
			attributesToRemove = (s.attributes || {}).remove || [],
			tags = s.tags || {},
			onlyOuter = tags.outerLevel || null,
			onlyInner = tags.innerLevel || null,
			outerSwitch = {},
			innerSwitch = {},
			paragraphTag = (tags.paragraph || '').toUpperCase(),
			html = this.html,
			attr,
			text,
			j;

		el = el || s.element;

		if (s.mode === Medium.inlineRichMode) {
			onlyOuter = s.tags.innerLevel;
		}

		if (onlyOuter !== null) {
			for (j = 0; j < onlyOuter.length; j++) {
				outerSwitch[onlyOuter[j].toUpperCase()] = true;
			}
		}

		if (onlyInner !== null) {
			for (j = 0; j < onlyInner.length; j++) {
				innerSwitch[onlyInner[j].toUpperCase()] = true;
			}
		}

		utils.traverseAll(el, {
			element: function(child, i, depth, parent) {
				var nodeName = child.nodeName,
					shouldDelete = true,
					attrValue;

				// Remove attributes
				for (j = 0; j < attributesToRemove.length; j++) {
					attr = attributesToRemove[j];
					if (child.hasAttribute(attr)) {
						attrValue = child.getAttribute(attr);
						if (attrValue !== placeholderClass && (!attrValue.match('medium-') && attr === 'class')) {
							child.removeAttribute(attr);
						}
					}
				}

				if ( onlyOuter === null && onlyInner === null ) {
					return;
				}

				if (depth  === 1 && outerSwitch[nodeName] !== undefined) {
					shouldDelete = false;
				} else if (depth > 1 && innerSwitch[nodeName] !== undefined) {
					shouldDelete = false;
				}

				// Convert tags or delete
				if (shouldDelete) {
					if (w.getComputedStyle(child, null).getPropertyValue('display') === 'block') {
						if (paragraphTag.length > 0 && paragraphTag !== nodeName) {
							utils.changeTag(child, paragraphTag);
						}

						if (depth > 1) {
							while (parent.childNodes.length > i) {
								parent.parentNode.insertBefore(parent.lastChild, parent.nextSibling);
							}
						}
					} else {
						switch (nodeName) {
							case 'BR':
								if (child === child.parentNode.lastChild) {
									if (child === child.parentNode.firstChild) {
										break;
									}
									text = d.createTextNode("");
									text.innerHTML = '&nbsp';
									child.parentNode.insertBefore(text, child);
									break;
								}
							default:
								while (child.firstChild !== null) {
									child.parentNode.insertBefore(child.firstChild, child);
								}
								utils.detachNode(child);
								break;
						}
					}
				}
			}
		});
	},
	/**
	 *
	 * @param {String|Object} html
	 * @param {Function} [callback]
	 * @param {Boolean} [skipChangeEvent]
	 * @returns {Medium}
	 */
	insertHtml: function (html, callback, skipChangeEvent) {
		var result = (new Medium.Html(this, html))
			.insert(this.settings.beforeInsertHtml),
			lastElement = result[result.length - 1];

		if (skipChangeEvent === true) {
			utils.triggerEvent(this.element, "change");
		}

		if (callback) {
			callback.apply(result);
		}

		switch (lastElement.nodeName) {
			//lists need their last child selected if it exists
			case 'UL':
			case 'OL':
			case 'DL':
				if (lastElement.lastChild !== null) {
					this.cursor.moveCursorToEnd(lastElement.lastChild);
					break;
				}
			default:
				this.cursor.moveCursorToEnd(lastElement);
		}

		return this;
	},

	addTag: function (tag, shouldFocus, isEditable, afterElement) {
		if (!this.settings.beforeAddTag(tag, shouldFocus, isEditable, afterElement)) {
			var newEl = d.createElement(tag),
				toFocus;

			if (typeof isEditable !== "undefined" && isEditable === false) {
				newEl.contentEditable = false;
			}
			if (newEl.innerHTML.length == 0) {
				newEl.innerHTML = ' ';
			}
			if (afterElement && afterElement.nextSibling) {
				afterElement.parentNode.insertBefore(newEl, afterElement.nextSibling);
				toFocus = afterElement.nextSibling;

			} else {
				this.element.appendChild(newEl);
				toFocus = this.lastChild();
			}

			if (shouldFocus) {
				this.cache.focusedElement = toFocus;
				this.cursor.set(this, 0, toFocus);
			}
			return newEl;
		}
		return null;
	},

	/**
	 *
	 * @param {String} tagName
	 * @param {Object} [attributes]
	 * @param {Boolean} [skipChangeEvent]
	 * @returns {Medium}
	 */
	invokeElement: function (tagName, attributes, skipChangeEvent) {
		var settings = this.settings,
			remove = attributes.remove || [];

		attributes = attributes || {};

		switch (settings.mode) {
			case Medium.inlineMode:
			case Medium.partialMode:
				return this;
			default:
		}

		//invoke works off class, so if it isn't there, we just add it
		if (remove.length > 0) {
			if (!utils.arrayContains(settings, 'class')) {
				remove.push('class');
			}
		}

		(new Medium.Element(this, tagName, attributes))
			.invoke(this.settings.beforeInvokeElement);

		if (skipChangeEvent === true) {
			utils.triggerEvent(this.element, "change");
		}

		return this;
	},

	/**
	 *
	 * @param {String} [value]
	 * @returns {Medium}
	 */
	value: function (value) {
		if (typeof value !== 'undefined') {
			this.element.innerHTML = value;

			this.clean();
			this.placeholders();

			this.makeUndoable();
		} else {
			return this.element.innerHTML;
		}

		return this;
	},

	/**
	 * Focus on element
	 * @returns {Medium}
	 */
	focus: function () {
		var el = this.element;
		el.focus();
		return this;
	},

	/**
	 * Select all text
	 * @returns {Medium}
	 */
	select: function () {
		utils.selectNode(Medium.activeElement = this.element);
		return this;
	},

	isActive: function () {
		return (Medium.activeElement === this.element);
	},

	setupContents: function () {
		var el = this.element,
			children = el.children,
			childNodes = el.childNodes,
			initialParagraph,
			s = this.settings;

		if (
			!s.tags.paragraph
			|| children.length > 0
			|| s.mode === Medium.inlineMode
			|| s.mode === Medium.inlineRichMode
		) {
			return Medium.Utilities;
		}

		//has content, but no children
		if (childNodes.length > 0) {
			initialParagraph = d.createElement(s.tags.paragraph);
			if (el.innerHTML.match('^[&]nbsp[;]')) {
				el.innerHTML = el.innerHTML.substring(6, el.innerHTML.length - 1);
			}
			initialParagraph.innerHTML = el.innerHTML;
			el.innerHTML = '';
			el.appendChild(initialParagraph);
			//this.cursor.set(this, initialParagraph.innerHTML.length, initialParagraph);
		} else {
			initialParagraph = d.createElement(s.tags.paragraph);
			initialParagraph.innerHTML = '&nbsp;';
			el.appendChild(initialParagraph);
			this.cursor.set(this, 0, el.firstChild);
		}

		return this;
	},

	destroy: function () {
		var el = this.element,
			settings = this.settings,
			placeholder = this.placeholder || null;

		if (placeholder !== null && placeholder.setup && placeholder.parentNode !== null) {
			//remove placeholder
			placeholder.parentNode.removeChild(placeholder);
			delete el.placeHolderActive;
		}

		//remove contenteditable
		el.removeAttribute('contenteditable');

		//remove classes
		el.className = utils.trim(el.className
			.replace(settings.cssClasses.editor, '')
			.replace(settings.cssClasses.clear, '')
			.replace(settings.cssClasses.editor + '-' + settings.mode, ''));

		//remove events
		this.action.destroy();

		if (this.settings.drag) {
			this.drag.destroy();
		}
	},

	// Clears the element and restores the placeholder
	clear: function () {
		this.element.innerHTML = '';
		this.placeholders();
	},

	/**
	 * Splits content in medium element at cursor
	 * @returns {DocumentFragment|null}
	 */
	splitAtCaret: function() {
		if (!this.isActive()) return null;

		var selector = (w.getSelection || d.selection),
			sel = selector(),
			offset = sel.focusOffset,
			node = sel.focusNode,
			el = this.element,
			range = d.createRange(),
			endRange = d.createRange(),
			contents;

		range.setStart(node, offset);
		endRange.selectNodeContents(el);
		range.setEnd(endRange.endContainer, endRange.endOffset);

		contents = range.extractContents();

		return contents;
	},

	/**
	 * Deletes selection
	 */
	deleteSelection: function() {
		if (!this.isActive()) return;

		var sel = rangy.getSelection(),
			range;

		if (sel.rangeCount > 0) {
			range = sel.getRangeAt(0);
			range.deleteContents();
		}
	},

	lastChild: function () {
		return this.element.lastChild;
	},

	bold: function () {

		switch (this.settings.mode) {
			case Medium.partialMode:
			case Medium.inlineMode:
				return this;
		}

		(new Medium.Element(this, 'bold'))
			.setClean(false)
			.invoke(this.settings.beforeInvokeElement);

		return this;
	},
	underline: function () {
		switch (this.settings.mode) {
			case Medium.partialMode:
			case Medium.inlineMode:
				return this;
		}

		(new Medium.Element(this, 'underline'))
			.setClean(false)
			.invoke(this.settings.beforeInvokeElement);

		return this;
	},
	italicize: function () {
		switch (this.settings.mode) {
			case Medium.partialMode:
			case Medium.inlineMode:
				return this;
		}

		(new Medium.Element(this, 'italic'))
			.setClean(false)
			.invoke(this.settings.beforeInvokeElement);

		return this;
	},
	quote: function () {

		return this;
	},
	/**
	 *
	 * @param {String} [text]
	 * @returns {boolean}
	 */
	paste: function (text) {
		var value = this.value(),
			length = value.length,
			totalLength,
			settings = this.settings,
			selection = this.selection,
			el = this.element,
			medium = this,
			postPaste = function(text) {
				text = text || '';
				if (text.length > 0) {
					el.focus();
					Medium.activeElement = el;
					selection.restoreSelection(sel);

					//encode the text first
					text = utils.encodeHtml(text);

					//cut down it's length
					totalLength = text.length + length;
					if (settings.maxLength > 0 && totalLength > settings.maxLength) {
						text = text.substring(0, settings.maxLength - length);
					}

					if (settings.mode !== Medium.inlineMode) {
						text = text.replace(/\n/g, '<br>');
					}

					(new Medium.Html(medium, text))
						.setClean(false)
						.insert(settings.beforeInsertHtml, true);

					medium.clean();
					medium.placeholders();
				}
			};

		medium.makeUndoable();

		if (text !== undefined) {
			postPaste(text);
		} else if (settings.pasteAsText) {
			var sel = selection.saveSelection();

			utils.pasteHook(this, postPaste);
		} else {
			setTimeout(function() {
				medium.clean();
				medium.placeholders();
			}, 20);
		}
		return true;
	},
	undo: function() {
		var undoable = this.undoable,
			stack = undoable.stack,
			can = stack.canUndo();

		if (can) {
			stack.undo();
		}

		return this;
	},
	redo: function() {
		var undoable = this.undoable,
			stack = undoable.stack,
			can = stack.canRedo();

		if (can) {
			stack.redo();
		}

		return this;
	}
};

//Modes
Medium.inlineMode = 'inline';
Medium.partialMode = 'partial';
Medium.richMode = 'rich';
Medium.inlineRichMode = 'inlineRich';
Medium.Messages = {
	pastHere: 'Paste Here'
};

Medium.defaultSettings = {
	element: null,
	modifier: 'auto',
	placeholder: "",
	autofocus: false,
	autoHR: true,
	mode: Medium.richMode,
	maxLength: -1,
	modifiers: {
		'b': 'bold',
		'i': 'italicize',
		'u': 'underline'
	},
	tags: {
		'break': 'br',
		'horizontalRule': 'hr',
		'paragraph': 'p',
		'outerLevel': ['pre', 'blockquote', 'figure'],
		'innerLevel': ['a', 'b', 'u', 'i', 'img', 'strong']
	},
	cssClasses: {
		editor: 'Medium',
		pasteHook: 'Medium-paste-hook',
		placeholder: 'Medium-placeholder',
		clear: 'Medium-clear'
	},
	attributes: {
		remove: ['style', 'class']
	},
	pasteAsText: true,
	beforeInvokeElement: function () {
		//this = Medium.Element
	},
	beforeInsertHtml: function () {
		//this = Medium.Html
	},
	maxLengthReached: function (element) {
		//element
	},
	beforeAddTag: function (tag, shouldFocus, isEditable, afterElement) {
	},
	keyContext: null,
	drag: false
};
(function(Medium, w, d) {
	"use strict";

	function isEditable(e) {
		if (e.hasOwnProperty('target') && e.target.getAttribute('contenteditable') === 'false') {
			utils.preventDefaultEvent(e);
			return false;
		}
		return true;
	}

	Medium.Action = function (medium) {
		this.medium = medium;

		this.handledEvents = {
			keydown: null,
			keyup: null,
			blur: null,
			focus: null,
			paste: null,
			click: null
		};

	};
	Medium.Action.prototype = {
		setup: function () {
			this
				.handleFocus()
				.handleBlur()
				.handleKeyDown()
				.handleKeyUp()
				.handlePaste()
				.handleClick();
		},
		destroy: function() {
			var el = this.medium.element;

			utils
				.removeEvent(el, 'focus', this.handledEvents.focus)
				.removeEvent(el, 'blur', this.handledEvents.blur)
				.removeEvent(el, 'keydown', this.handledEvents.keydown)
				.removeEvent(el, 'keyup', this.handledEvents.keyup)
				.removeEvent(el, 'paste', this.handledEvents.paste)
				.removeEvent(el, 'click', this.handledEvents.click);
		},
		handleFocus: function () {

			var medium = this.medium,
				el = medium.element;

			utils.addEvent(el, 'focus', this.handledEvents.focus = function(e) {
				e = e || w.event;

				if (!isEditable(e)) {
					return false;
				}

				Medium.activeElement = el;

				medium.placeholders();
			});

			return this;
		},
		handleBlur: function () {

			var medium = this.medium,
				el = medium.element;

			utils.addEvent(el, 'blur', this.handledEvents.blur = function(e) {
				e = e || w.event;

				if (Medium.activeElement === el) {
					Medium.activeElement = null;
				}

				medium.placeholders();
			});

			return this;
		},
		handleKeyDown: function () {

			var action = this,
				medium = this.medium,
				settings = medium.settings,
				cache = medium.cache,
				el = medium.element;

			utils.addEvent(el, 'keydown', this.handledEvents.keydown = function(e) {
				e = e || w.event;

				if (!isEditable(e)) {
					return false;
				}

				var keepEvent = true;

				//in Chrome it sends out this event before every regular event, not sure why
				if (e.keyCode === 229) return;

				utils.isCommand(settings, e, function () {
					cache.cmd = true;
				}, function () {
					cache.cmd = false;
				});

				utils.isShift(e, function () {
					cache.shift = true;
				}, function () {
					cache.shift = false;
				});

				utils.isModifier(settings, e, function (cmd) {
					if (cache.cmd) {

						if ( (settings.mode === Medium.inlineMode) || (settings.mode === Medium.partialMode) ) {
							utils.preventDefaultEvent(e);
							return false;
						}

						var cmdType = typeof cmd;
						var fn = null;
						if (cmdType === "function") {
							fn = cmd;
						} else {
							fn = medium[cmd];
						}

						keepEvent = fn.call(medium, e);

						if (keepEvent === false || keepEvent === medium) {
							utils.preventDefaultEvent(e);
							utils.stopPropagation(e);
						}
						return true;
					}
					return false;
				});

				if (settings.maxLength !== -1) {
					var len = utils.text(el).length,
						hasSelection = false,
						selection = w.getSelection(),
						isSpecial = utils.isSpecial(e),
						isNavigational = utils.isNavigational(e);

					if (selection) {
						hasSelection = !selection.isCollapsed;
					}

					if (isSpecial || isNavigational) {
						return true;
					}

					if (len >= settings.maxLength && !hasSelection) {
						settings.maxLengthReached(el);
						utils.preventDefaultEvent(e);
						return false;
					}
				}

				switch (e.keyCode) {
					case key['enter']:
						if (action.enterKey(e) === false) {
							utils.preventDefaultEvent(e);
						}
						break;
					case key['backspace']:
					case key['delete']:
						action.backspaceOrDeleteKey(e);
						break;
				}

				return keepEvent;
			});

			return this;
		},
		handleKeyUp: function () {

			var action = this,
				medium = this.medium,
				settings = medium.settings,
				cache = medium.cache,
				cursor = medium.cursor,
				el = medium.element;

			utils.addEvent(el, 'keyup', this.handledEvents.keyup = function(e) {
				e = e || w.event;

				if (!isEditable(e)) {
					return false;
				}

				utils.isCommand(settings, e, function () {
					cache.cmd = false;
				}, function () {
					cache.cmd = true;
				});
				medium.clean();
				medium.placeholders();

				//here we have a key context, so if you need to create your own object within a specific context it is doable
				var keyContext;
				if (
					settings.keyContext !== null
					&& ( keyContext = settings.keyContext[e.keyCode] )
				) {
					var el = cursor.parent();

					if (el) {
						keyContext.call(medium, e, el);
					}
				}

				action.preserveElementFocus();
			});

			return this;
		},
		handlePaste: function() {
			var medium = this.medium,
				el = medium.element,
				text,
				i,
				max,
				data,
				cD,
				type,
				types;

			utils.addEvent(el, 'paste', this.handledEvents.paste = function(e) {
				e = e || w.event;

				if (!isEditable(e)) {
					return false;
				}

				i = 0;
				utils.preventDefaultEvent(e);
				text = '';
				cD = e.clipboardData;

				if (cD && (data = cD.getData)) {
					types = cD.types;
					max = types.length;
					for (i = 0; i < max; i++) {
						type = types[i];
						switch (type) {
							//case 'text/html':
							//	return medium.paste(cD.getData('text/html'));
							case 'text/plain':
								return medium.paste(cD.getData('text/plain'));
						}
					}
				}

				medium.paste();
			});

			return this;
		},
		handleClick: function() {
			var medium = this.medium,
				el = medium.element,
				cursor = medium.cursor;

			utils.addEvent(el, 'click', this.handledEvents.click = function(e) {
				if (!isEditable(e)) {
					cursor.caretToAfter(e.target);
				}

			});

			return this;
		},
		enterKey: function (e) {
			var medium = this.medium,
				el = medium.element,
				settings = medium.settings,
				cache = medium.cache,
				cursor = medium.cursor;

			if( settings.mode === Medium.inlineMode || settings.mode === Medium.inlineRichMode ){
				return false;
			}

			if (cache.shift) {
				if (settings.tags['break']) {
					medium.addTag(settings.tags['break'], true);
					return false;
				}

			} else {

				var focusedElement = utils.atCaret(medium) || {},
					children = el.children,
					lastChild = focusedElement === el.lastChild ? el.lastChild : null,
					makeHR,
					secondToLast,
					paragraph;

				if (
					lastChild
					&& lastChild !== el.firstChild
					&& settings.autoHR
					&& settings.mode !== Medium.partialMode
					&& settings.tags.horizontalRule
				) {

					utils.preventDefaultEvent(e);

					makeHR =
						utils.text(lastChild) === ""
						&& lastChild.nodeName.toLowerCase() === settings.tags.paragraph;

					if (makeHR && children.length >= 2) {
						secondToLast = children[ children.length - 2 ];

						if (secondToLast.nodeName.toLowerCase() === settings.tags.horizontalRule) {
							makeHR = false;
						}
					}

					if (makeHR) {
						medium.addTag(settings.tags.horizontalRule, false, true, focusedElement);
						focusedElement = focusedElement.nextSibling;
					}

					if ((paragraph = medium.addTag(settings.tags.paragraph, true, null, focusedElement)) !== null) {
						paragraph.innerHTML = '';
						cursor.set(medium, 0, paragraph);
					}
				}
			}

			return true;
		},
		backspaceOrDeleteKey: function (e) {
			var medium = this.medium,
				cursor = medium.cursor,
				settings = medium.settings,
				el = medium.element;

			if (settings.onBackspaceOrDelete !== undefined) {
				var result = settings.onBackspaceOrDelete.call(medium, e, el);

				if (result) {
					return;
				}
			}

			if (el.lastChild === null) return;

			var lastChild = el.lastChild,
				beforeLastChild = lastChild.previousSibling,
				anchorNode = rangy.getSelection().anchorNode;

			if (
				lastChild
				&& settings.tags.horizontalRule
				&& lastChild.nodeName.toLocaleLowerCase() === settings.tags.horizontalRule
			) {
				el.removeChild(lastChild);
			} else if (
				lastChild
				&& beforeLastChild
				&& utils.text(lastChild).length < 1

				&& beforeLastChild.nodeName.toLowerCase() === settings.tags.horizontalRule
				&& lastChild.nodeName.toLowerCase() === settings.tags.paragraph
			) {
				el.removeChild(lastChild);
				el.removeChild(beforeLastChild);
			} else if (
				el.childNodes.length === 1
				&& lastChild
				&& !utils.text(lastChild).length
			) {
				utils.preventDefaultEvent(e);
				medium.setupContents();
			}
			else if ( anchorNode && anchorNode === el ) {
				medium.deleteSelection();
				medium.setupContents();
				cursor.set(medium, 0, el.firstChild);
			}
		},
		preserveElementFocus: function () {
			// Fetch node that has focus
			var anchorNode = w.getSelection ? w.getSelection().anchorNode : document.activeElement;
			if (anchorNode) {
				var medium = this.medium,
					cache = medium.cache,
					el = medium.element,
					s = medium.settings,
					cur = anchorNode.parentNode,
					children = el.children,
					diff = cur !== cache.focusedElement,
					elementIndex = 0,
					i;

				// anchorNode is our target if element is empty
				if (cur === s.element) {
					cur = anchorNode;
				}

				// Find our child index
				for (i = 0; i < children.length; i++) {
					if (cur === children[i]) {
						elementIndex = i;
						break;
					}
				}

				// Focused element is different
				if (diff) {
					cache.focusedElement = cur;
					cache.focusedElementIndex = elementIndex;
				}
			}
		}
	};

})(Medium, w, d);
(function(Medium) {
	"use strict";

	Medium.Cache = function () {
		this.initialized = false;
		this.cmd = false;
		this.focusedElement = null
	};

})(Medium);
(function(Medium) {
	"use strict";
	/*
	 * Handle Cursor Logic
	 */
	Medium.Cursor = function (medium) {
		this.medium = medium;
	};
	Medium.Cursor.prototype = {
		set: function (pos, el) {
			var range;

			if (d.createRange) {
				var selection = w.getSelection(),
					lastChild = this.medium.lastChild(),
					length = utils.text(lastChild).length - 1,
					toModify = el ? el : lastChild,
					theLength = ((typeof pos !== 'undefined') && (pos !== null) ? pos : length);

				range = d.createRange();
				range.setStart(toModify, theLength);
				range.collapse(true);
				selection.removeAllRanges();
				selection.addRange(range);
			} else {
				range = d.body.createTextRange();
				range.moveToElementText(el);
				range.collapse(false);
				range.select();
			}
		},
		//http://davidwalsh.name/caret-end
		moveCursorToEnd: function (el) {
			//get the browser selection object - it may or may not have a selected range
			var selection = rangy.getSelection(),

				//create a range object to set the caret positioning for
				range = rangy.createRange();


			//set the caret after the start node and at the end of the end node
			//Note: the end is set using endNode.length when the node is of the text type
			//and it is set using childNodes.length when the end node is of the element type
			range.setStartAfter(el);
			range.setEnd(el, el.length || el.childNodes.length);

			//apply this range to the selection object
			selection.removeAllRanges();
			selection.addRange(range);
		},
		moveCursorToAfter: function (el) {
			var sel = rangy.getSelection();
			if (sel.rangeCount) {
				var range = sel.getRangeAt(0);
				range.collapse(false);
				range.collapseAfter(el);
				sel.setSingleRange(range);
			}
		},
		parent: function () {
			var target = null, range;

			if (w.getSelection) {
				range = w.getSelection().getRangeAt(0);
				target = range.commonAncestorContainer;

				target = (target.nodeType === 1
					? target
					: target.parentNode
				);
			}

			else if (d.selection) {
				target = d.selection.createRange().parentElement();
			}

			if (target.tagName == 'SPAN') {
				target = target.parentNode;
			}

			return target;
		},
		caretToBeginning: function (el) {
			this.set(0, el);
		},
		caretToEnd: function (el) {
			this.moveCursorToEnd(el);
		},
		caretToAfter: function (el) {
			this.moveCursorToAfter(el);
		}
	};
})(Medium);
(function(Medium) {
	"use strict";
	Medium.Drag = function(medium) {
		this.medium = medium;

		var that = this,
			iconSrc = this.iconSrc.replace(/[{][{]([a-zA-Z]+)[}][}]/g, function(ignore, match) {
				if (that.hasOwnProperty(match)) {
					return that[match];
				}

				return ignore;
			}),
			icon = this.icon = d.createElement('img');

		icon.className = this.buttonClass;
		icon.setAttribute('contenteditable', 'false');
		icon.setAttribute('src', iconSrc);

		this.hide();
		this.element = null;
		this.protectedElement = null;
		this.handledEvents = {
			dragstart: null,
			dragend: null,
			mouseover: null,
			mouseout: null,
			mousemove: null
		};
	};
	Medium.Drag.prototype = {
		elementClass: 'Medium-focused',
		buttonClass: 'Medium-drag',

		//thank you ascii for not including a directional icon (boo!)
		//http://www.flaticon.com/free-icon/pointer-crosstree_10119
		iconSrc: 'data:image/svg+xml;utf8,\
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="21.424px" height="21.424px" viewBox="0 0 21.424 21.424" style="enable-background:new 0 0 21.424 21.424;" xml:space="preserve">\
	<g>\
		<g>\
			<path style="fill:{{iconColor}};" d="M13.616,17.709L13.616,17.709h0.781l-3.686,3.715l-3.685-3.715h0.781l0,0H13.616z M13.616,17.709 M14.007,17.709 M12.555,19.566 M8.87,19.566 M7.418,17.709 M7.809,17.709 M10.712,17.709"/>\
			<path style="fill:{{iconColor}};" d="M13.616,3.715L13.616,3.715h0.781L10.712,0L7.027,3.715h0.781l0,0H13.616z M13.616,3.715 M14.007,3.715 M12.555,1.858 M8.87,1.858 M7.418,3.715 M7.809,3.715 M10.712,3.715"/>\
			<path style="fill:{{iconColor}};" d="M3.716,13.616L3.716,13.616v0.781L0,10.712l3.716-3.685v0.781l0,0V13.616z M3.716,13.616 M3.716,14.007 M1.858,12.555 M1.858,8.87 M3.716,7.417 M3.716,7.808 M3.716,10.712"/>\
			<path style="fill:{{iconColor}};" d="M17.709,13.616L17.709,13.616v0.781l3.715-3.685l-3.715-3.685v0.781l0,0V13.616z M17.709,13.616 M17.709,14.007 M19.566,12.555 M19.566,8.87 M17.709,7.417 M17.709,7.808 M17.709,10.712"/>\
		</g>\
		<path style="fill-rule:evenodd;clip-rule:evenodd;fill:{{iconColor}};" d="M10.712,6.608c2.267,0,4.104,1.838,4.104,4.104 c0,2.266-1.837,4.104-4.104,4.104c-2.266,0-4.104-1.837-4.104-4.104C6.608,8.446,8.446,6.608,10.712,6.608L10.712,6.608z M10.712,7.515c-1.765,0-3.196,1.432-3.196,3.197s1.432,3.197,3.196,3.197c1.766,0,3.197-1.432,3.197-3.197 S12.478,7.515,10.712,7.515z"/>\
	</g>\
</svg>',
		iconColor: '#231F20',
		setup: function() {
			this
				.handleDragstart()
				.handleDragend()
				.handleMouseover()
				.handleMouseout()
				.handleMousemove();
		},
		destroy: function() {
			utils
				.removeEvent(this.icon, 'dragstart', this.handledEvents.dragstart)
				.removeEvent(this.icon, 'dragend', this.handledEvents.dragend)
				.removeEvent(this.icon, 'mouseover', this.handledEvents.mouseover)
				.removeEvent(this.icon, 'mouseout', this.handledEvents.mouseout)
				.removeEvent(this.medium.element, 'mousemove', this.handledEvents.mousemove);
		},
		hide: function() {
			utils.hide(this.icon);
		},
		handleDragstart: function() {

			var me = this;

			utils.addEvent(this.icon, 'dragstart', this.handledEvents.dragstart = function(e) {
				if (me.protectedElement !== null) return;

				e = e || w.event;

				me.protectedElement = utils.detachNode(me.element);

				me.icon.style.opacity = 0.00;
			});

			return this;
		},
		handleDragend: function() {
			var me = this;

			utils.addEvent(this.icon, 'dragend',  this.handledEvents.dragend = d.body.ondragend = function(e) {
				if (me.protectedElement === null) return;

				setTimeout(function() {
					me.cleanCanvas();
					me.protectedElement = null;
				}, 1);
			});

			return this;
		},
		handleMouseover: function() {
			var me = this;

			utils.addEvent(this.icon, 'mouseover', this.handledEvents.mouseover = function(e) {
				if (me.protectedElement !== null) return;

				utils
					.stopPropagation(e)
					.addClass(me.element, me.elementClass);

			});

			return this;
		},
		handleMouseout: function() {
			var me = this;

			utils.addEvent(this.icon, 'mouseout', this.handledEvents.mouseout = function(e) {
				if (me.protectedElement !== null) return;

				utils
					.stopPropagation(e)
					.removeClass(me.element, me.elementClass);
			});
			return this;
		},
		handleMousemove: function() {
			var me = this;

			utils.addEvent(this.medium.element, 'mousemove', this.handledEvents.mousemove = function(e) {
				e = e || w.event;
				var target = e.target || {};

				if (target.getAttribute('contenteditable') === 'false') {
					me.show(target);
				}
			});

			return this;
		},
		show: function(el) {
			if (el === this.icon && this.protectedElement === null) return;

			this.element = el;

			var style = this.icon.style,
				left = el.offsetLeft,
				top = el.offsetTop;

			el.dragIcon = this.icon;
			el.parentNode.appendChild(this.icon);

			style.opacity = 1;
			style.left = left + 'px';
			style.top = top + 'px';

			utils.show(this.icon);
		},
		cleanCanvas: function() {
			var target,
				inserted = false,
				buttons = d.getElementsByClassName(this.buttonClass);

			this.icon.style.opacity = 1;

			while (buttons.length > 0) {
				if (utils.isVisible(target = buttons[0])) {
					if (!inserted) {
						target.parentNode.insertBefore(this.element, target);
						inserted = true;
					}
					utils.detachNode(target);
				}
			}
			utils.detachNode(this.icon);
		}
	};
})(Medium);
(function(Medium) {
	"use strict";

	/**
	 * @param {Medium} medium
	 * @param {String} tagName
	 * @param {Object} [attributes]
	 * @constructor
	 */
	Medium.Element = function (medium, tagName, attributes) {
		this.medium = medium;
		this.element = medium.element;

		switch (tagName.toLowerCase()) {
			case 'bold':
				this.tagName = 'b';
				break;
			case 'italic':
				this.tagName = 'i';
				break;
			case 'underline':
				this.tagName = 'u';
				break;
			default:
				this.tagName = tagName;
		}

		this.attributes = attributes || {};
		this.clean = true;
	};

	Medium.Element.prototype = {
		/**
		 * @methodOf Medium.Element
		 * @param {Function} [fn]
		 */
		invoke: function (fn) {
			if (Medium.activeElement === this.element) {
				if (fn) {
					fn.apply(this);
				}

				var
					attr = this.attributes,
					tagName = this.tagName.toLowerCase(),
					applier,
					cl;

				if (attr.className !== undefined) {
					cl = (attr.className.split[' '] || [attr.className]).shift();
					delete attr.className;
				} else {
					cl = 'medium-' + tagName;
				}

				applier = rangy.createClassApplier(cl, {
					elementTagName: tagName,
					elementAttributes: this.attributes
				});

				this.medium.makeUndoable();

				applier.toggleSelection(w);

				if (this.clean) {
					//cleanup
					this.medium.clean();
					this.medium.placeholders();
				}


			}
		},

		/**
		 *
		 * @param {Boolean} clean
		 * @returns {Medium.Element}
		 */
		setClean: function (clean) {
			this.clean = clean;
			return this;
		}
	};
})(Medium);
(function(Medium) {
	"use strict";

	/**
	 * @constructor
	 * @param {Medium} medium
	 * @param {String|HtmlElement} html
	 */
	Medium.Html = function (medium, html) {
		this.html = html;
		this.medium = medium;
		this.clean = true;
		this.injector = new Medium.Injector();
	};

	Medium.Html.prototype = {
		/**
		 * @methodOf Medium.Html
		 * @param {Function} [fn]
		 * @param {Boolean} [selectInserted]
		 * @returns {HtmlElement}
		 */
		insert: function (fn, selectInserted) {
			if (Medium.activeElement === this.medium.element) {
				if (fn) {
					fn.apply(this);
				}

				var inserted = this.injector.inject(this.html, selectInserted);

				if (this.clean) {
					//cleanup
					this.medium.clean();
					this.medium.placeholders();
				}

				this.medium.makeUndoable();

				return inserted;
			} else {
				return null;
			}
		},

		/**
		 * @methodOf Medium.Html
		 * @param clean
		 * @returns {Medium.Html}
		 */
		setClean: function (clean) {
			this.clean = clean;
			return this;
		}
	};

})(Medium);
(function(Medium) {
	"use strict";

	/**
	 *
	 * @constructor
	 */
	Medium.Injector = function () {
	};

	Medium.Injector.prototype = {
		/**
		 * @methodOf Medium.Injector
		 * @param {String|HtmlElement} htmlRaw
		 * @returns {[HtmlElement|Node]}
		 */
		inject: function (htmlRaw) {
			var nodes = [],
				html,
				isConverted = false;

			if (typeof htmlRaw === 'string') {
				var htmlConverter = d.createElement('div');
				htmlConverter.innerHTML = htmlRaw;
				html = htmlConverter.childNodes;
				isConverted = true;
			} else {
				html = htmlRaw;
			}

			this.insertHTML('<span id="Medium-wedge"></span>');

			var wedge = d.getElementById('Medium-wedge'),
				parent = wedge.parentNode,
				i = 0;

			wedge.removeAttribute('id');

			if (isConverted) {
				//make an array of elements that are about to be inserted, can't use html because they will
				while (i < html.length) {
					nodes.push(html[i]);
					i++;
				}

				while (html.length > 0) {
					parent.insertBefore(html[html.length - 1], wedge);
				}
			} else {
				nodes.push(html);
				parent.insertBefore(html, wedge);
			}
			parent.removeChild(wedge);
			wedge = null;

			return nodes;
		},

		//Thank you Tim Down (super uber genius): http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
		insertHTML: function (html, selectPastedContent) {
			var sel, range;
			if (w.getSelection) {
				// IE9 and non-IE
				sel = w.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();

					// Range.createContextualFragment() would be useful here but is
					// only relatively recently standardized and is not supported in
					// some browsers (IE9, for one)
					var el = d.createElement("div");
					el.innerHTML = html;
					var frag = d.createDocumentFragment(), node, lastNode;
					while ((node = el.firstChild)) {
						lastNode = frag.appendChild(node);
					}
					var firstNode = frag.firstChild;
					range.insertNode(frag);

					// Preserve the selection
					if (lastNode) {
						range = range.cloneRange();
						range.setStartAfter(lastNode);
						if (selectPastedContent) {
							range.setStartBefore(firstNode);
						} else {
							range.collapse(true);
						}
						sel.removeAllRanges();
						sel.addRange(range);
					}
				}
			} else if ((sel = d.selection) && sel.type != "Control") {
				// IE < 9
				var originalRange = sel.createRange();
				originalRange.collapse(true);
				sel.createRange().pasteHTML(html);
				if (selectPastedContent) {
					range = sel.createRange();
					range.setEndPoint("StartToStart", originalRange);
					range.select();
				}
			}
		}
	};
})(Medium);
(function(Medium) {
	"use strict";

	/*
	 * Handle Selection Logic
	 */
	Medium.Selection = function () {
	};
	Medium.Selection.prototype = {
		saveSelection: function () {
			if (w.getSelection) {
				var sel = w.getSelection();
				if (sel.rangeCount > 0) {
					return sel.getRangeAt(0);
				}
			} else if (d.selection && d.selection.createRange) { // IE
				return d.selection.createRange();
			}
			return null;
		},

		restoreSelection: function (range) {
			if (range) {
				if (w.getSelection) {
					var sel = w.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (d.selection && range.select) { // IE
					range.select();
				}
			}
		}
	};
})(Medium);(function(Medium) {
	"use strict";
	Medium.Toolbar = function(medium, buttons) {
		this.medium = medium;

		var elementCreator = d.createElement('div');

		elementCreator.innerHTML = this.html;

		this.buttons = buttons;
		this.element = elementCreator.children[0];
		d.body.appendChild(this.element);
		this.active = false;
		this.busy = true;

		this.handledEvents = {
			scroll: null,
			mouseup: null,
			keyup: null
		};
	};

	Medium.Toolbar.prototype = {
		fixedClass: 'Medium-toolbar-fixed',
		showClass: 'Medium-toolbar-show',
		hideClass: 'Medium-toolbar-hide',

		html:
			'<div class="Medium-toolbar">\
				<div class="Medium-tail-outer">\
					<div class="Medium-tail-inner"></div>\
				</div>\
				<div id="Medium-buttons"></div>\
				<table id="Medium-options">\
					<tbody>\
						<tr>\
						</tr>\
					</tbody>\
				</table>\
			</div>',

		setup: function() {
			this
				.handleScroll()
				.handleMouseup()
				.handleKeyup();

		},
		destroy: function() {
			utils
				.removeEvent(w, 'scroll', this.handledEvents.scroll)
				.removeEvent(d, 'mouseup', this.handledEvents.mouseup)
				.removeEvent(d, 'keyup', this.handledEvents.keyup);
		},
		handleScroll: function() {
			var me = this;

			utils.addEvent(w, 'scroll', this.handledEvents.scroll = function() {
				if (me.active) {
					me.goToSelection();
				}
			});

			return this;
		},
		handleMouseup: function() {
			var me = this;

			utils.addEvent(d, 'mouseup', this.handledEvents.mouseup = function() {
				if (Medium.activeElement === me.medium.element && !me.busy) {
					me.goToSelection();
				}
			});

			return this;
		},
		handleKeyup: function() {
			var me = this;

			utils.addEvent(d, 'keyup', this.handledEvents.keyup = function() {
				if (Medium.activeElement === me.medium.element && !me.busy) {
					me.goToSelection();
				}
			});

			return this;
		},
		goToSelection: function() {
			var high = this.getHighlighted(),
				y = high.boundary.top - 5,
				el = this.element,
				style = el.style;

			if (w.scrollTop > 0) {
				utils.addClass(el, this.fixedClass);
			} else {
				utils.removeClass(el, this.fixedClass);
			}

			if (high !== null) {
				if (high.range.startOffset === high.range.endOffset && !high.text) {
					utils
						.removeClass(el, this.showClass)
						.addClass(el, this.hideClass);

					this.active = false;
				} else {
					utils
						.removeClass(el, this.hideClass)
						.removeClass(el, this.showClass);

					style.opacity = 0.01;
					utils.addClass(el, this.showClass);
					style.opacity = 1;
					style.top = (y - 65) + "px";
					style.left = (
					(
					high.boundary.left + (high.boundary.width / 2)
					)
					- (el.clientWidth / 2)
					) + "px";

					this.active = true;
				}
			}
		},

		getHighlighted: function() {
			var selection = w.getSelection(),
				range = (selection.anchorNode ? selection.getRangeAt(0) : false);

			if (!range) {
				return null;
			}

			return {
				selection : selection,
				range : range,
				text : utils.trim(range.toString()),
				boundary : range.getBoundingClientRect()
			};
		}
	};
})(Medium);
(function(Medium) {
	"use strict";

	/**
	 * @param {Medium} medium
	 * @constructor
	 */
	Medium.Undoable = function (medium) {
		var me = this,
			element = medium.settings.element,
			timer,
			startValue,
			stack = new Undo.Stack(),
			EditCommand = Undo.Command.extend({
				constructor: function (oldValue, newValue) {
					this.oldValue = oldValue;
					this.newValue = newValue;
				},
				execute: function () {
				},
				undo: function () {
					element.innerHTML = this.oldValue;
					medium.canUndo = stack.canUndo();
					medium.canRedo = stack.canRedo();
					medium.dirty = stack.dirty();
				},
				redo: function () {
					element.innerHTML = this.newValue;
					medium.canUndo = stack.canUndo();
					medium.canRedo = stack.canRedo();
					medium.dirty = stack.dirty();
				}
			}),
			makeUndoable = function (isInit) {
				var newValue = element.innerHTML;

				if (isInit) {
					startValue = element.innerHTML;
					stack.execute(new EditCommand(startValue, startValue));
				}

				// ignore meta key presses
				else if (newValue != startValue) {

					if (!me.movingThroughStack) {
						// this could try and make a diff instead of storing snapshots
						stack.execute(new EditCommand(startValue, newValue));
						startValue = newValue;
						medium.dirty = stack.dirty();
					}

					utils.triggerEvent(medium.settings.element, "change");
				}
			};

		this.medium = medium;
		this.timer = timer;
		this.stack = stack;
		this.makeUndoable = makeUndoable;
		this.EditCommand = EditCommand;
		this.movingThroughStack = false;

		utils
			.addEvent(element, 'keyup', function (e) {
				if (e.ctrlKey || e.keyCode === key.z) {
					utils.preventDefaultEvent(e);
					return;
				}

				// a way too simple algorithm in place of single-character undo
				clearTimeout(timer);
				timer = setTimeout(function () {
					makeUndoable();
				}, 250);
			})

			.addEvent(element, 'keydown', function (e) {
				if (!e.ctrlKey || e.keyCode !== key.z) {
					me.movingThroughStack = false;
					return;
				}

				utils.preventDefaultEvent(e);

				me.movingThroughStack = true;

				if (e.shiftKey) {
					stack.canRedo() && stack.redo()
				} else {
					stack.canUndo() && stack.undo();
				}
			});
	};
})(Medium);
(function(Medium) {
	"use strict";

	Medium.Utilities = {
		/*
		 * Keyboard Interface events
		 */
		isCommand: function (s, e, fnTrue, fnFalse) {
			if ((s.modifier === 'ctrl' && e.ctrlKey ) ||
				(s.modifier === 'cmd' && e.metaKey ) ||
				(s.modifier === 'auto' && (e.ctrlKey || e.metaKey) )
			) {
				return fnTrue.call();
			} else {
				return fnFalse.call();
			}
		},
		isShift: function (e, fnTrue, fnFalse) {
			if (e.shiftKey) {
				return fnTrue.call();
			} else {
				return fnFalse.call();
			}
		},
		isModifier: function (settings, e, fn) {
			var cmd = settings.modifiers[e.keyCode];
			if (cmd) {
				return fn.call(null, cmd);
			}
			return false;
		},
		special: (function () {
			var special = {};

			special[key['backspace']] = true;
			special[key['shift']] = true;
			special[key['ctrl']] = true;
			special[key['alt']] = true;
			special[key['delete']] = true;
			special[key['cmd']] = true;

			return special;
		})(),
		isSpecial: function (e) {
			return typeof Medium.Utilities.special[e.keyCode] !== 'undefined';
		},
		navigational: (function () {
			var navigational = {};

			navigational[key['upArrow']] = true;
			navigational[key['downArrow']] = true;
			navigational[key['leftArrow']] = true;
			navigational[key['rightArrow']] = true;

			return navigational;
		})(),
		isNavigational: function (e) {
			return typeof Medium.Utilities.navigational[e.keyCode] !== 'undefined';
		},

		/**
		 * @param element
		 * @param eventNamesString
		 * @param func
		 * @returns Medium.Utilities
		 */
		addEvents: function(element, eventNamesString, func) {
			var i = 0,
				eventName,
				eventNames = eventNamesString.split(' '),
				max = eventNames.length,
				utils = Medium.Utilities;

			for(;i < max; i++) {
				eventName = eventNames[i];
				if (eventName.length > 0) {
					utils.addEvent(element, eventName, func);
				}
			}

			return Medium.Utilities;
		},
		/*
		 * Handle Events
		 */
		addEvent: function addEvent(element, eventName, func) {
			if (element.addEventListener) {
				element.addEventListener(eventName, func, false);
			} else if (element.attachEvent) {
				element.attachEvent("on" + eventName, func);
			} else {
				element['on' + eventName] = func;
			}

			return Medium.Utilities;
		},
		removeEvent: function removeEvent(element, eventName, func) {
			if (element.removeEventListener) {
				element.removeEventListener(eventName, func, false);
			} else if (element.detachEvent) {
				element.detachEvent("on" + eventName, func);
			} else {
				element['on' + eventName] = null;
			}

			return Medium.Utilities;
		},
		preventDefaultEvent: function (e) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}

			return Medium.Utilities;
		},
		stopPropagation: function(e) {
			e = e || window.event;
			e.cancelBubble = true;

			if (e.stopPropagation !== undefined) {
				e.stopPropagation();
			}

			return Medium.Utilities;
		},
		isEventSupported: function (element, eventName) {
			eventName = 'on' + eventName;
			var el = d.createElement(element.tagName),
				isSupported = (eventName in el);

			if (!isSupported) {
				el.setAttribute(eventName, 'return;');
				isSupported = typeof el[eventName] == 'function';
			}
			el = null;
			return isSupported;
		},
		triggerEvent: function (element, eventName) {
			var e;
			if (d.createEvent) {
				e = d.createEvent("HTMLEvents");
				e.initEvent(eventName, true, true);
				e.eventName = eventName;
				element.dispatchEvent(e);
			} else {
				e = d.createEventObject();
				element.fireEvent("on" + eventName, e);
			}

			return Medium.Utilities;
		},

		deepExtend: function (destination, source) {
			var property,
				propertyValue;

			for (property in source) if (source.hasOwnProperty(property)) {
				propertyValue = source[property];
				if (
					propertyValue !== undefined
					&& propertyValue !== null
					&& propertyValue.constructor !== undefined
					&& propertyValue.constructor === Object
				) {
					destination[property] = destination[property] || {};
					Medium.Utilities.deepExtend(destination[property], propertyValue);
				} else {
					destination[property] = propertyValue;
				}
			}
			return destination;
		},
		/*
		 * This is a Paste Hook. When the user pastes
		 * content, this ultimately converts it into
		 * plain text before inserting the data.
		 */
		pasteHook: function (medium, fn) {
			medium.makeUndoable();

			var tempEditable = d.createElement('div'),
				el = medium.element,
				existingValue,
				existingLength,
				overallLength,
				s = medium.settings,
				value,
				body = d.body,
				bodyParent = body.parentNode,
				scrollTop = bodyParent.scrollTop,
				scrollLeft = bodyParent.scrollLeft;

			tempEditable.className = s.cssClasses.pasteHook;
			tempEditable.setAttribute('contenteditable', true);

			body.appendChild(tempEditable);
			utils.selectNode(tempEditable);

			bodyParent.scrollTop = scrollTop;
			bodyParent.scrollLeft = scrollLeft;

			setTimeout(function () {
				value = utils.text(tempEditable);
				el.focus();
				if (s.maxLength > 0) {
					existingValue = utils.text(el);
					existingLength = existingValue.length;
					overallLength = existingLength + value.length;
					if (overallLength > existingLength) {
						value = value.substring(0, s.maxLength - existingLength);
					}
				}
				utils.detachNode( tempEditable );
				bodyParent.scrollTop = scrollTop;
				bodyParent.scrollLeft = scrollLeft;
				fn(value);
			}, 0);

			return Medium.Utilities;
		},
		traverseAll: function(element, options, depth) {
			var children = element.childNodes,
				length = children.length,
				i = 0,
				node;

			depth = depth || 1;

			options = options || {};

			if (length > 0) {
				for(;i < length;i++) {
					node = children[i];
					switch (node.nodeType) {
						case 1:
							Medium.Utilities.traverseAll(node, options, depth + 1);
							if (options.element !== undefined) options.element(node, i, depth, element);
							break;
						case 3:
							if (options.fragment !== undefined) options.fragment(node, i, depth, element);
					}

					//length may change
					length = children.length;
					//if length did change, and we are at the last item, this causes infinite recursion, so if we are at the last item, then stop to prevent this
					if (node === element.lastChild) {
						i = length;
					}
				}
			}
			return Medium.Utilities;
		},
		trim: function (string) {
			return string.replace(/^[\s]+|\s+$/g, '');
		},
		arrayContains: function(array, variable) {
			var i = array.length;
			while (i--) {
				if (array[i] === variable) {
					return true;
				}
			}
			return false;
		},
		addClass: function(el, className) {
			if (el.classList)
				el.classList.add(className);
			else
				el.className += ' ' + className;

			return Medium.Utilities;
		},
		removeClass: function(el, className) {
			if (el.classList)
				el.classList.remove(className);
			else
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			return Medium.Utilities;
		},
		hasClass: function(el, className) {
			if (el.classList)
				return el.classList.contains(className);
			else
				return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		},
		isHidden: function(el) {
			return el.offsetWidth === 0 || el.offsetHeight === 0;
		},
		isVisible: function(el) {
			return el.offsetWidth !== 0 || el.offsetHeight !== 0;
		},
		encodeHtml: function ( html ) {
			return d.createElement( 'a' ).appendChild(
				d.createTextNode( html ) ).parentNode.innerHTML;
		},
		text: function (node, val) {
			if (val !== undefined) {
				if (node === null) {
					return this;
				}
				if (node.textContent !== undefined) {
					node.textContent = val;
				} else {
					node.innerText = val;
				}

				return this;
			}
			else if (node === null) {
				return this;
			}
			else if (node.innerText !== undefined) {
				return utils.trim(node.innerText);
			}

			else if (node.textContent !== undefined) {
				return utils.trim(node.textContent);
			}
			//document fragment
			else if (node.data !== undefined) {
				return utils.trim(node.data);
			}

			//for good measure
			return '';
		},
		changeTag: function (oldNode, newTag) {
			var newNode = d.createElement(newTag),
				node,
				nextNode;

			node = oldNode.firstChild;
			while (node) {
				nextNode = node.nextSibling;
				newNode.appendChild(node);
				node = nextNode;
			}

			oldNode.parentNode.insertBefore(newNode, oldNode);
			oldNode.parentNode.removeChild(oldNode);

			return newNode;
		},
		detachNode: function (el) {
			if (el.parentNode !== null) {
				el.parentNode.removeChild(el);
			}

			return this;
		},
		selectNode: function(el) {
			var range,
				selection;

			el.focus();

			if (d.body.createTextRange) {
				range = d.body.createTextRange();
				range.moveToElementText(el);
				range.select();
			} else if (w.getSelection) {
				selection = w.getSelection();
				range = d.createRange();
				range.selectNodeContents(el);
				selection.removeAllRanges();
				selection.addRange(range);
			}

			return this;
		},
		baseAtCaret: function (medium) {
			if (!medium.isActive()) return null;

			var sel = w.getSelection ? w.getSelection() : document.selection;

			if (sel.rangeCount) {
				var selRange = sel.getRangeAt(0),
					container = selRange.endContainer;

				switch (container.nodeType) {
					case 3:
						if (container.data && container.data.length != selRange.endOffset) return false;
						break;
				}

				return container;
			}

			return null;
		},
		atCaret: function (medium) {
			var container = this.baseAtCaret(medium) || {},
				el = medium.element;

			if (container === false) return null;

			while (container && container.parentNode !== el) {
				container = container.parentNode;
			}

			if (container && container.nodeType == 1) {
				return container;
			}

			return null;
		},
		hide: function(el) {
			el.style.display = 'none';
		},
		show: function(el) {
			el.style.display = '';
		},
		hideAnim: function(el) {
			el.style.opacity = 1;
		},
		showAnim: function(el) {
			el.style.opacity = 0.01;
			el.style.display = '';
		}
	};
})(Medium);
rangy.rangePrototype.insertNodeAtEnd = function (node) {
	var range = this.cloneRange();
	range.collapse(false);
	range.insertNode(node);
	range.detach();
	this.setEndAfter(node);
};

			return Medium;
		}()),
		utils = Medium.Utilities;

	if (typeof define === 'function' && define['amd']) {
		define(function () { return Medium; });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Medium;
	} else if (typeof this !== 'undefined') {
		this.Medium = Medium;
	}

}).call(this, window, document);
