/// Rennder Platform : editor.js ///
/// <reference path="core/global.js" />
/// <reference path="core/view.js" />

R.editor = {
    enabled:false,

    load: function () {
        //get current viewport level
        R.editor.viewport.getLevel();

        //initialize text editor
        R.editor.textEditor.init();

        //load photo library window in the background to initialize the body drop-zone
        R.editor.photos.init();
        setTimeout(function () { R.editor.photos.dropzone.init(); }, 100);

        //init component select custom menus
        R.editor.components.menu.items.addRule('cell', '.for-all');
        R.editor.components.menu.items.addRule('textbox', '.menu-options');

        //show editor
        if (arguments[0] === true) {
            this.show();
        }

        //show dashboard
        if (location.hash.indexOf('dashboard') > -1) { $('.webpage, .window, .editor > .tab').hide(); setTimeout(function () { R.editor.dashboard.show(); }, 100); }
    },

    hide: function () {
        if (R.editor.dashboard.visible == true) { return; }
        $('.editor > .toolbar, .editor > .windows, .tools').hide();
        $('.editor > .tab').show();
        $('.body').css({ top: 0 });
        $('body').removeClass('editing');
        this.enabled = false;
        //R.events.render.trigger(1);
    },

    show: function (dashboard) {
        if (R.editor.dashboard.visible == true) { return;}
        $('.editor > .toolbar, .editor > .windows, .tools').show();
        $('.editor > .tab').hide();
        $('.body').css({ top: 50 });
        $('body').addClass('editing');
        this.enabled = true;
        R.editor.components.hideSelect();
        if (dashboard === true) {
            R.editor.dashboard.show();
        } else {
            if (R.editor.dashboard.visible == true) {
                R.editor.dashboard.hide();
            }
        }
        //R.events.render.trigger(1);
    },

    viewport: {
        speed: 0, isChanging: false,
        levels: [350, 700, 1024, 1440, 9999], level: -1, sizeIndex: -1,

        getLevel: function () {
            var w = $('.webpage').width();
            for (x = 0; x < R.editor.viewport.levels.length; x++) {
                if (w <= R.editor.viewport.levels[x]) {
                    var changed = false;
                    if (R.editor.viewport.level != x) { changed = true; }
                    R.editor.viewport.level = x;
                    return changed;
                }
            }
        },

        resize: function (width) {
            var webpage = $('.webpage');
            if (webpage.css('maxWidth') == '' || webpage.css('maxWidth') == 'none') {
                webpage.css({'maxWidth':webpage.width()});
            }
            webpage.stop().animate({ maxWidth: width }, {
                duration: this.speed * 1000,
                progress: function () {
                    if (R.editor.viewport.getLevel() == true) {
                        R.editor.viewport.levelChanged(R.editor.viewport.level);
                    }
                },
                complete: function () {
                    R.editor.viewport.getLevel();
                    if (R.editor.viewport.isChanging == true) {
                        R.editor.viewport.isChanging = false;
                        R.editor.components.disabled = false;
                        R.editor.viewport.levelChanged(R.editor.viewport.level);
                    } else {
                        R.editor.components.resizeSelectBox();
                    }
                }
            });
        },

        view: function (level) {
            //hide selected components
            R.editor.components.hideSelect();
            R.editor.components.disabled = true;
            switch (level) {
                case 4: //HD
                    R.editor.viewport.resize(1920); break;

                default: //all other screen sizes
                    R.editor.viewport.resize(R.editor.viewport.levels[level]); break;
            }
            R.editor.viewport.isChanging = false;
            R.editor.viewport.levelChanged(level)
            R.editor.viewport.isChanging = true;
        },

        levelChanged: function (level) {
            if (R.editor.viewport.isChanging == true) { return; }
            R.editor.viewport.sizeIndex = level;
            var screen = 'HD', ext = 'hd';
            switch (level) {
                case 4: //HD
                    screen = 'HD'; ext = 'hd'; break;

                case 3: //Desktop
                    screen = 'Desktop'; ext = 'desktop'; break;

                case 2: //Tablet
                    screen = 'Tablet'; ext = 'tablet'; break;

                case 1: //Mobile Device
                    screen = 'Mobile Device'; ext = 'mobile'; break;

                case 0: //Cell Phone
                    screen = 'Cell Phone'; ext = 'cell'; break;

            }
            $('.toolbar .menu .screens use').attr('xlink:href', '#icon-screen' + ext)
        },

        nextLevel: function () {
            R.editor.viewport.speed = 2;
            var sizeIndex = R.editor.viewport.sizeIndex;
            if (sizeIndex == -1) {
                sizeIndex = R.editor.viewport.level;
            }
            console.log(sizeIndex + ', ' + R.editor.viewport.level);
            var next = sizeIndex > 0 ? sizeIndex - 1 : 4;
            console.log(next);
            R.editor.viewport.view(next);
        },

        previousLevel: function () {
            R.editor.viewport.speed = 2;
            var sizeIndex = R.editor.viewport.sizeIndex;
            if (sizeIndex == -1) {
                sizeIndex = R.editor.viewport.level;
            }
            var prev = sizeIndex < 4 ? sizeIndex + 1 : 0;
            R.editor.viewport.view(prev);
        }
    },

    events: {   
        hashChange: function () {
            var hash = location.hash.replace("#", "").toLowerCase();
            //reload layers window
            if ($('.winLayers').length == 1) {
                R.editor.layers.refresh();
            }

            //update dashboard
            if (R.editor.dashboard.visible == true) {
                if (hash.indexOf('dashboard') < 0) {
                    R.editor.dashboard.hide();
                }
            }
        }
    },

    dashboard: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        visible: false, init: false, 

        show: function () {
            $('.webpage, .window').hide();
            $('body').addClass('dashboard');
            R.window.changed = true;
            R.window.pos();

            if ($('.editor > .toolbar')[0].style.display == 'none') { R.editor.show(); }
            $('.toolbar > .menu, .toolbar > .rightside > .savepage, .toolbar > .rightside > .close > a').hide();
            R.editor.dashboard.visible = true;

            //add callback for the hash
            if (R.editor.dashboard.init == false) {
                R.editor.dashboard.init = true;
                R.hash.special.add('dashboard', R.editor.dashboard.callback.hash);
            }

            if ($('.winDashboardInterface').length == 0) {
                //load interface window
                R.editor.window.load('DashboardInterface', 'Dashboard/Interface/Load', {}, { x: 0, y: 50, w: '100%', h: '100%', toolbar: false });
            } else {
                $('.winDashboardInterface').addClass('dashboard').show();
            }
            
            R.editor.dashboard.loadFromHash();

            R.events.doc.resize.callback.add('dashboardresize', null, null, R.editor.dashboard.callback.resize, R.editor.dashboard.callback.resize);
            R.editor.dashboard.callback.resize();
        },

        hide: function () {
            $('.toolbar > .menu, .toolbar > .rightside > .savepage, .toolbar > .rightside > .close > a, .webpage').show();
            $('.winDashboardInterface, .winDashboardTimeline').hide();
            $('body, .interface').removeClass('dashboard');
            R.editor.dashboard.hideAllWindows();
            R.editor.dashboard.visible = false;
            R.window.changed = true;
            R.window.pos();
            for (win in R.editor.window.windows) {
                var item = R.editor.window.windows[win];
                if (item.w.toString().indexOf('%') < 0) {
                    $(item.elem).css({ width: item.w });
                }
                if (item.h.toString().indexOf('%') < 0) {
                    $(item.elem).css({ height: item.h });
                }
            }
        },

        hideAllWindows: function(){
            $('.window:not(.winDashboardInterface)').hide();
        },

        callback:{
            resize: function () {
                var pos = R.elem.pos($('.winDashboardInterface .dash-body')[0]);
                $('.window.interface.dashboard:not(.winDashboardInterface)').css({ top: 50, left: pos.x, width: pos.w, height: R.window.absolute.h - 50 }).find('.grip').hide();
                $('.dash-menu').css({ minHeight: R.window.absolute.h - 50 });
                $('ul.columns-first').each(function () {
                    this.style.width = '';
                    var pos = R.elem.offset($(this).find('li:last-child')[0]);
                    this.style.width = (pos.x + pos.w) + 'px';
                });
            },

            hash: function (hash) {
                if (R.editor.dashboard.visible == true) {
                    if (hash.indexOf('dashboard') == 0) {
                        if (R.hash.last != hash) {
                            R.editor.dashboard.loadFromHash();
                        }
                    }
                } else {
                    if (hash.indexOf('dashboard') == 0) {
                        R.editor.dashboard.show();
                    }
                }
            }
        },

        loadFromHash: function () {
            var hash = location.hash.replace('#', '').toLowerCase();
            if (hash.indexOf('Dashboard/') == 0) {
                var arrhash = hash.split('/');
                switch (arrhash[1]) {
                    case 'timeline':
                        R.editor.window.open.timeline(R.website.title);
                        break;

                    case 'pages':
                        R.editor.window.open.pages(R.website.title);
                        break;

                    case 'page-settings':
                        R.editor.window.open.pageSettings(arrhash[2], R.website.title);
                        break;

                    case 'photos':
                        R.editor.window.open.photoLibrary(R.editor.dashboard.visible ? 'dashboard' : null);
                        break;

                    case 'analytics':
                        R.editor.window.open.analytics(R.website.title);
                        break;

                    case 'designer':
                        R.editor.window.open.designer(R.website.title);
                        break;

                    case 'users':
                        R.editor.window.open.users(R.website.title);
                        break;

                    case 'apps':
                        R.editor.window.open.apps(R.website.title);
                        break;

                    case 'settings':
                        R.editor.window.open.websiteSettings(R.website.title);
                        break;

                    default:
                        R.editor.window.open.timeline(R.website.title);
                }
            } else if (hash == 'dashboard') {
                R.editor.window.open.timeline(R.website.title);
            }
        }
    },

    window: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        windows: [], loadclick:null, popupshown: false,

        load: function (name, url, data, options) {
            var a = this.windows[name.replace(/ /g, '')];
            var div, win = $('.editor > .windows .win' + name.replace(/ /g, ''));
            var autoHide = false, addResize = false;
            if (options != null) {
                if (options.autoHide == true) { autoHide = true; }
                if (options.popup == true) {
                    setTimeout(function () {
                        R.editor.components.disabled = true;
                        R.editor.window.popupshown = true;
                        R.editor.components.hideSelect();
                    }, 100);
                }
            }
            
            if (win.length > 0) {
                div = win[0];
                if (autoHide == true && win[0].style.display != 'none') {
                    win.hide();
                } else {
                    R.editor.window.hidePopUps();
                    if (R.editor.dashboard.visible == true) {
                        if (win.hasClass('dashboard') == false) { win.addClass('dashboard'); }
                        R.editor.dashboard.hideAllWindows();
                        R.editor.dashboard.callback.resize();
                    }
                    win.show();
                }
            } else {
                //create new window
                R.editor.window.hidePopUps();
                var item = {
                    title: name, name: name.replace(/ /g, ''), x: 0, y: 50, w: 320, h: 240, maxh: 0, r: null, target: null,
                    align: null, arrow: null, spacing: 0, toolbar: true, classes: '', addResize: false, resizable: false,
                    popup: false, visible: true, zIndex: 0, resizealign: 'minimize', noDashboard:false, hash:''
                };

                //setup options
                if (options != null) {
                    if (options.x != null) { item.x = options.x; }
                    if (options.y != null) { item.y = options.y; }
                    if (options.w != null) { item.w = options.w; }
                    if (options.h != null) { item.h = options.h; }
                    if (options.maxh != null) { item.maxh = options.maxh; }
                    if (options.r != null) { item.r = options.r; }
                    if (options.title != null) { item.title = options.title; }
                    if (options.target != null) { item.target = options.target; }
                    if (options.align != null) { item.align = options.align; }
                    if (options.arrow != null) { item.arrow = options.arrow; }
                    if (options.spacing != null) { item.spacing = options.spacing; }
                    if (options.toolbar != null) { item.toolbar = options.toolbar; }
                    if (options.popup != null) { item.popup = options.popup; item.classes += ' popup'}
                    if (options.autoHide != null) { item.autoHide = options.autoHide; }
                    if (options.postOnce != null) { item.postOnce = options.postOnce; item.pageId = R.page.id; }
                    if (options.visible != null) { item.visible = options.visible; }
                    if (options.resizable != null) { item.resizable = options.resizable; }
                    if (options.zIndex != null) { item.zIndex = options.zIndex; }
                    if (options.resizealign != null) { item.resizealign = options.resizealign; }
                    if (options.noDashboard != null) { item.noDashboard = options.noDashboard; }
                    if (options.hash != null) { item.hash = options.hash; }
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
                if (R.editor.dashboard.visible == true && item.noDashboard == false) { item.classes += ' dashboard'; R.editor.dashboard.hideAllWindows(); }

                if (item.y < 50) { item.y = 50; }
                item = this.reposition(item);

                //create window using options
                div = document.createElement('div');
                div.className = 'window win' + item.name + ' draggable interface' + item.classes;
                
                if (item.r != null) {
                    //right-aligned
                    item.addResize = true;
                    div.style.left = (R.window.w - item.r - item.w) + 'px';
                } else {
                    //left-aligned
                    div.style.left = item.x + 'px';
                }
                div.style.top = (item.y + item.spacing) + 'px';
                
                if (item.h.toString().indexOf('%') < 0) { div.style.minHeight = item.h + 'px'; } else {
                    div.style.minHeight = (((R.window.absolute.h - item.y) / 100) * parseInt(item.h.replace('%', ''))) + 'px';
                    item.addResize = true;
                }
                if (item.w.toString().indexOf('%') < 0) { div.style.width = item.w + 'px'; } else {
                    div.style.width = (((R.window.absolute.w - item.x) / 100) * parseInt(item.w.replace('%', ''))) + 'px';
                    item.addResize = true;
                }
                if (item.maxh > 0) { div.style.maxHeight = item.maxh + 'px' }
                if (item.popup == true) {
                    div.style.zIndex = 4550;
                }
                if (item.zIndex > 0) {
                    div.style.zIndex = 4500 + item.zIndex;
                }

                if (item.visible == false) { div.style.display = 'none';}

                var htm = '';
                if (item.toolbar != false) {
                    htm += '<div class="grip">';
                    if (item.title != '') { htm += '<div class="title">' + item.title + '</div>'; }
                    htm += '<div class="close"><a href="javascript:" onclick="R.editor.window.hide(event)">' +
                          '<svg viewBox="0 0 15 15"><use xlink:href="#icon-close" x="0" y="0" width="36" height="36" /></svg></a></div>';
                    if (item.resizable == true) {
                        htm +=
                          '<div class="resizable">' +
                            '<div class="resize-leftside"><a href="javascript:" onclick="R.editor.window.resize.leftSide(\''+ item.name +'\')" title="Maximize window to the left-hand side of the screen">' +
                            '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowleftside" x="0" y="0" width="14" height="14" /></svg></a></div>' +
                            '<div class="resize-maximize"><a href="javascript:" onclick="R.editor.window.resize.maximize(\'' + item.name + '\')" title="Maximize window to fullscreen">' +
                            '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowmaximize" x="0" y="0" width="14" height="14" /></svg></a></div>' +
                            '<div class="resize-minimize" style="display:none"><a href="javascript:" onclick="R.editor.window.resize.minimize(\'' + item.name + '\')" title="Minimize window to its original size">' +
                            '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowminimize" x="0" y="0" width="14" height="14" /></svg></a></div>' +
                            '<div class="resize-rightside"><a href="javascript:" onclick="R.editor.window.resize.rightSide(\'' + item.name + '\')" title="Maximize window to the right-hand side of the screen">' +
                            '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowrightside" x="0" y="0" width="14" height="14" /></svg></a></div>' +
                          '</div>';
                    }
                    htm += '</div>';
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

                if (R.editor.dashboard.visible == true) {R.editor.dashboard.callback.resize(); }

                this.callback.windowResize();
            }

            //request data from server to load into window
            var post = true;
            if (win.length > 0) {
                if (a.postOnce == 'pageid') { 
                    if(a.pageId == R.page.id){ post = false; }
                }else if(a.postOnce === true){
                    post = false;
                }
            }
            if (url != '' && url != null && post == true) {
                R.ajax.post('/rennder/'+url, data, R.editor.window.callback.ajax);
            } else {
                if (data != '') {
                    //load content from string
                    $(div).find('.content').append(data);
                }
            }

            this.loadclick = div;

            //change url link
            if (a.hash != '' && R.editor.dashboard.visible == true) {
                location.hash = 'Dashboard/' + a.hash;
            }


            //R.events.render.trigger(true, true);

            setTimeout(function () { R.editor.window.loadclick = null; }, 200);
        },

        reposition: function (item) {
            //if(R.editor.dashboard.visible == true && item.noDashboard != true){return;}
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
                if (data.type == 'Rennder.Inject') {
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
                if (R.editor.dashboard.visible == true) { R.editor.dashboard.callback.resize(); }
            },

            resize: function (item) {
                item = R.editor.window.reposition(item);
                var pos = R.elem.pos(item.elem);
                if (item.resizealign == 'minimize'){
                    item.x = pos.x;
                    if (item.w.toString().indexOf('%') < 0) { item.w = pos.w; }
                    if (item.h.toString().indexOf('%') < 0) { item.h = pos.h; }
                }
                $(item.elem).css({ top: item.y })
                if (item.r != null) {
                    //right-aligned
                    $(item.elem).css({ left: (R.window.w - item.r - item.w) });
                } else {
                    //left-aligned
                    $(item.elem).css({ left: item.x });
                }
                if (item.h.toString().indexOf('%') > -1) {
                    item.elem.style.minHeight = (((R.window.absolute.h - item.y) / 100) * parseInt(item.h.replace('%',''))) + 'px';
                }

                if (item.w.toString().indexOf('%') > -1) {
                    item.elem.style.width = (((R.window.absolute.w - item.x) / 100) * parseInt(item.w.replace('%', ''))) + 'px';
                }
                
                R.editor.window.resize.callback.execute(null,'onResize');
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
                if (hidepopups == true && R.editor.window.popupshown == true) {
                    R.editor.window.popupshown = false;
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
                $('.editor .window > .content').css({ maxHeight: R.window.absolute.h - R.window.scrolly - 80 });
                $('.editor .window.dashboard > .content').css({ maxHeight: R.window.absolute.h - 50 });
                R.editor.window.resize.callback.execute(null, 'onResize');
            }
        },

        open: {
            timeline: function(){
                R.editor.window.load('DashboardTimeline', 'Dashboard/Timeline/Load', {}, { x: 155, y: 50, w: 250, h: '100%', toolbar: false, isDashboard: R.editor.dashboard.visible, hash: '' })
            },

            pages: function(){
                R.editor.window.load('WebPages', 'Dashboard/Pages/LoadPages', {}, { x: 0, align: 'center', y: 0, w: 600, h: 200, spacing: 50, postOnce: true, isDashboard: R.editor.dashboard.visible, title: 'Web Pages for \'' + R.website.title + '\'', hash: 'pages' })
            },

            pageSettings: function (pageId) {
                R.editor.window.load('PageSettings', 'Dashboard/Pages/LoadSettings', { pageId: pageId },
                    { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: 'pageid', title: 'Page Settings for \'' + R.website.title + '\'', hash: 'page-settings' });
            },

            photoLibrary: function (type) {
                R.editor.photos.show(null,type);
            },
            
            analytics: function () {
                R.editor.window.load('Analytics', 'Dashboard/Analytics/LoadAnalytics', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: true, isDashboard: R.editor.dashboard.visible, title: 'Website Analytics for \'' + R.website.title + '\'', hash: 'analytics' })
            },

            designer: function () {
                R.editor.window.load('Design', 'Dashboard/Design/LoadDesigner', {}, { w: 200, h: 100, target: '.editor .toolbar .menu .grid', align: 'bottom-center', arrow: true, spacing: 10, toolbar: false, autoHide: true, popup: true, postOnce: true, isDashboard: R.editor.dashboard.visible })
            },

            users: function () {
                R.editor.window.load('Users', 'Dashboard/Users/LoadUsers', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: true, isDashboard: R.editor.dashboard.visible, title: 'User Security for \'' + R.website.title + '\'', hash: 'users' })
            },

            apps: function(){
                R.editor.window.load('Apps', 'Dashboard/Apps/LoadApps', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: true, isDashboard: R.editor.dashboard.visible, title: 'Apps Installed onto \'' + R.website.title + '\'', hash: 'apps' })
            },

            websiteSettings: function(){
                R.editor.window.load('WebsiteSettings', 'Dashboard/Website/LoadSettings', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, isDashboard: R.editor.dashboard.visible, postOnce: true, title: 'Website Settings for \'' + R.website.title + '\'', hash: 'settings' })
            }
        },

        draggable: function () {
            $(".editor .windows > .window").draggable({
                handle: '.grip', scroll:false, snap: ".editor .window:not(.popup)", snapMode: "outer", drag: function (e, ui) {
                    if (ui.position.left >= R.window.absolute.w - $(this).width()) { ui.position.left = R.window.absolute.w - $(this).width(); }
                    if (ui.position.top >= R.window.absolute.h - $(this).height()) { ui.position.top = R.window.absolute.h - $(this).height(); }
                    if (ui.position.top <= 50) { ui.position.top = 50; }
                    if (ui.position.left < 0) { ui.position.left = 0; }
                }
            });
        },

        resize:{
            leftSide: function (name) {
                var window = $('.windows .win' + name),
                    item = R.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = R.elem.pos(window[0]); }
                item.resizealign = 'leftside';
                window.css({ left: 0, top: 50, width: R.window.absolute.w / 2, height: R.window.absolute.h - 50 });
                window.find('.resize-leftside').hide();
                window.find('.resize-minimize, .resize-maximize, .resize-rightside').show();
                R.editor.window.windows[name] = item;
                R.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            rightSide: function (name) {
                var window = $('.windows .win' + name),
                    item = R.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = R.elem.pos(window[0]); }
                item.resizealign = 'rightside';
                window.css({ left: R.window.absolute.w / 2, top: 50, width: R.window.absolute.w / 2, height: R.window.absolute.h - 50 });
                window.find('.resize-rightside').hide();
                window.find('.resize-minimize, .resize-leftside, .resize-maximize').show();
                R.editor.window.windows[name] = item;
                R.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            maximize: function (name) {
                var window = $('.windows .win' + name),
                    item = R.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = R.elem.pos(window[0]); }
                item.resizealign = 'maximize';
                window.css({ left: 0, top: 50, width: R.window.absolute.w, height: R.window.absolute.h - 50 });
                window.find('.resize-maximize').hide();
                window.find('.resize-minimize, .resize-leftside, .resize-rightside').show();
                R.editor.window.windows[name] = item;
                R.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            minimize: function (name) {
                var window = $('.windows .win' + name),
                    item = R.editor.window.windows[name];
                item.resizealign = 'minimize';
                window.css({ left: item.curPos.x, top: item.curPos.y, width: item.curPos.w, height: item.curPos.h });
                window.find('.resize-minimize').hide();
                window.find('.resize-maximize, .resize-leftside, .resize-rightside').show();
                R.editor.window.windows[name] = item;
                R.editor.window.resize.callback.execute(window[0],'onResize');
            },

            callback: {
                //register & execute callbacks when the window resizes
                items: [],

                add: function (elem, vars, onResize) {
                    this.items.push({ elem: elem, vars: vars, onResize: onResize });
                },

                remove: function (elem) {
                    for (var x = 0; x < this.items.length; x++) {
                        if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                    }
                },

                execute: function (elem, type) {
                    if (this.items.length > 0) {
                        switch (type) {
                            case '': case null: case 'onResize':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (typeof this.items[x].onResize == 'function' && (this.items[x].elem == elem || elem == null)) {
                                        this.items[x].onResize();
                                    }
                                } break;
                        }
                    }
                }
            }
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
        },

        hidePopUps: function () {
            R.editor.window.callback.click(null, 'bg');
        }
    },

    components: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        selected: null, hovered: null, selbox: $('.tools > .component-select'), disabled: false,
        posStart: { x: 0, y: 0, w: 0, h: 0 },

        dragNew: {
            item: {
                elem: null, pos: { x: 0, y: 0, w: 0, h: 0 }, curPos:{ x: 0, y: 0},
                cursorStart: { x: 0, y: 0 }, cursor: { x: 0, y: 0 }
            },
            timer: null, started: false, painting: false, moved: false, target:null, panel:null,

            start: function (e) {
                var elem = R.elem.fromEvent(e);
                var pos = R.elem.pos(elem);
                var mPos = { x: e.pageX, y: e.pageY };
                var win = R.window;

                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                R.editor.components.dragNew.moved = false;
                R.editor.components.dragNew.started = true;
                R.editor.components.dragNew.item.elem = elem;
                R.editor.components.dragNew.item.pos = R.elem.offset(elem);
                R.editor.components.posStart = R.elem.offset(elem);
                //R.editor.components.dragNew.item.pos.x += wPos.x;
                //R.editor.components.dragNew.item.pos.y += wPos.y;
                R.editor.components.dragNew.item.cursorStart = {
                    x: mPos.x,
                    y: mPos.y,
                    scrolly: R.window.scrolly,
                    offset: { x: mPos.x - (pos.x + R.window.scrollx), y: mPos.y - (pos.y + R.window.scrolly) }
                };
                R.editor.components.dragNew.item.cursor = {
                    x: mPos.x + win.scrollx,
                    y: mPos.y + win.scrolly
                };

                //get positions of panels
                R.panels.get();

                //bind document mouse events
                $(document).bind('mousemove', R.editor.components.dragNew.go);
                $(document).bind('mouseup', R.editor.components.dragNew.end);
            },

            startFinish: function () {
                if (this.started == true && this.painting == false) {
                    R.editor.components.disabled = true;
                    this.painting = true;

                    //clone target icon
                    var div = document.createElement('div');
                    div.className = 'target';
                    $(div).append($(this.item.elem).clone());
                    $('.tools').before(div);
                    this.target = div;

                    //create panel border   
                    var div = document.createElement('div');
                    div.className = 'page-panel-border';
                    div.innerHTML = '&nbsp;';
                    $('.tools .borders').append(div);

                    //start paint timer
                    R.editor.components.dragNew.paint();
                }
            },

            go: function (e) {
                if (R.editor.components.dragNew.painting == false) {
                    R.editor.components.dragNew.startFinish();
                }
                R.editor.components.dragNew.item.cursor.x = e.pageX;
                R.editor.components.dragNew.item.cursor.y = e.pageY;
            },

            paint: function () {
                var mDiff = {
                    x: (this.item.cursor.x - this.item.cursorStart.x),
                    y: (this.item.cursor.y - this.item.cursorStart.y) + (this.item.cursorStart.scrolly - R.window.scrolly)
                }, wPos = R.elem.pos($('.winComponents')[0]);
                var x = this.item.pos.x + mDiff.x + wPos.x, y = this.item.pos.y + mDiff.y + R.window.scrolly + wPos.y;

                if (this.item.curPos.x != x || this.item.curPos.y != y) {
                    this.item.curPos = { x: x, y: y, w:this.item.pos.w };

                    if (mDiff.x != 0 || mDiff.y != 0) { this.moved = true; }
                    $(this.target).css({ left: x, top: y });

                    //find nearest panel 
                    var panels = $.nearest({ x: x + this.item.cursorStart.offset.x, y: y + this.item.cursorStart.offset.y }, '.ispanel');
                    var max = 0, len, panel, novis = false;
                    for (z = 0; z < panels.length; z++) {
                        //make sure panel is visible
                        novis = false;
                        if (panels[z].style.display == 'none') { novis = false; }
                        else {
                            if ($(panels[z].parentNode).hasClass('slide') == true) {
                                var slides = $(panels[z]).parents('.slides')[0];
                                var sPos = R.elem.offset(slides);
                                var pPos = R.elem.offset(panels[z]);
                                if (pPos.x >= sPos.w || pPos.x + pPos.w <= 0) { novis = true; }
                                if (pPos.y >= sPos.h || pPos.y + pPos.h <= 0) { novis = true; }
                            }
                        }
                        if (novis == false) {
                            len = $(panels[z]).parentsUntil('.webpage').length;
                            if (len > max) { max = len; panel = panels[z]; }
                        }

                    }

                    if (panel != undefined) {
                        var pos = R.elem.pos(panel);
                        $('.tools .borders .page-panel-border').css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                        this.panel = panel;
                    }
                }
                


                if (this.started == true) {
                    setTimeout(function () { R.editor.components.dragNew.paint(); }, 33);
                }
            },

            end: function () {
                R.editor.components.dragNew.started = false;
                
                //unbind document mouse up event
                $(document).unbind('mousemove', R.editor.components.dragNew.go);
                $(document).unbind('mouseup', R.editor.components.dragNew.end);

                if (R.editor.components.dragNew.painting == true && R.editor.components.dragNew.moved == true) {
                    //drop component into panel
                    var cid = R.editor.components.dragNew.item.elem.getAttribute('cid'),
                        panel = R.editor.components.dragNew.panel;
                    var pid = panel.id, selector = '#' + panel.id + ' .inner' + panel.id;
                    var pPos = R.elem.pos(panel),
                        pos = R.editor.components.dragNew.item.curPos;
                    var x = pos.x - pPos.x - R.window.scrollx,
                        y = pos.y - pPos.y - R.window.scrolly;
                    var tc = (x - (Math.round((pPos.w - pos.w) / 2)));
                    var responsive = 'px,px,px,,<tc>,'+x+','+y+',<w>,,,,,px';
                    //  responsive = left, width, top, parallax, alignment, x, y, width, top-padding, ?, right-position, height, height-type
                    var pContain = $(panel).parents('.component');
                    var zIndex = parseInt(pContain.length > 0 ? pContain[0].style.zIndex : 99 || 99) + $(pid + ' > .component').length + 1;
                    var options = { componentId: cid, panelId: pid, selector: selector, x: x, y: y, panelWidth:pPos.w};
                    R.ajax.post('/rennder/Editor/NewComponent', options, R.ajax.callback.inject);

                } else if (R.editor.components.dragNew.moved == false) {
                    //cancel drag
                }
                $(R.editor.components.dragNew.target).remove();
                $('.tools .borders .page-panel-border').remove();
                R.editor.components.dragNew.painting = false;
                R.editor.components.disabled = false;

            }
        },

        drag: {
            item: {
                elem: null, pos: { x: 0, y: 0, w: 0, h: 0 },
                cursorStart: { x: 0, y: 0 }, cursor: { x: 0, y: 0 }
            },
            timer:null, started:false, startedTime:null, painting:false, disabled:false, vertical:false, moved:false,
            start: function (e) {
                 R.editor.components.drag.startedTime = new Date();
                 if (R.editor.enabled == false) { return; }
                 if (R.editor.components.hovered) { if (R.editor.components.hovered.id == 'inner') { return; } }
                if ($(e.target).hasClass('component-select') == false && $(e.target).parents('.arrow-down').length == 0) { return;}
                if (R.editor.components.drag.disabled == true) { return; }
                R.editor.components.drag.panel = R.elem.panel(R.editor.components.hovered);
                R.editor.components.drag.panelPos = R.elem.pos(R.editor.components.drag.panel);
                R.editor.components.drag.moved = false;
                R.editor.components.drag.started = true;
                R.editor.components.drag.above = -1;
                R.editor.components.drag.item.offsety = 0;
                R.editor.components.drag.item.elem = R.editor.components.hovered;
                R.editor.components.posStart = R.elem.pos(R.editor.components.hovered);
                R.editor.components.drag.item.pos = R.elem.innerPos(R.editor.components.hovered);
                R.editor.components.drag.item.left = R.editor.components.hovered.style.left.replace('px', '');
                R.editor.components.drag.item.top = R.editor.components.hovered.style.top.replace('px', '');
                if (R.editor.components.drag.item.left != '') { R.editor.components.drag.item.left = parseInt(R.editor.components.drag.item.left); }
                else {R.editor.components.drag.item.left = 0;}
                if (R.editor.components.drag.item.top != '') { R.editor.components.drag.item.top = parseInt(R.editor.components.drag.item.top); }
                else { R.editor.components.drag.item.top = 0;}
                R.editor.components.drag.item.absolute = {
                    x: R.editor.components.drag.item.pos.x - R.editor.components.drag.item.left,
                    y: R.editor.components.drag.item.pos.y - R.editor.components.drag.item.top,
                }

                var mPos = { x: e.pageX, y: e.pageY };
                var win = R.window;
                R.editor.components.drag.item.cursorStart = {
                    x: mPos.x + win.scrollx,
                    y: mPos.y + win.scrolly,
                    comp: {
                        x: mPos.x + win.scrollx - R.editor.components.drag.item.pos.x,
                        y: mPos.y + win.scrolly - R.editor.components.drag.item.pos.y
                    }
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

                    //create barrier on page
                    var div = document.createElement('div');
                    div.className = 'barrier';
                    div.style.width = R.window.absolute.w + 'px';
                    div.style.height = R.window.absolute.h + 'px';
                    $('.editor').append(div);

                    //start paint timer
                    R.editor.components.drag.paint();
                }
            },

            go: function (e) {
                if (new Date() - R.editor.components.drag.startedTime < 200) { return;}
                if (R.editor.components.drag.disabled == true) { return; }
                if(R.editor.components.drag.painting == false){
                    R.editor.components.drag.startFinish();
                }
                R.editor.components.drag.item.cursor.x = e.pageX + R.window.scrollx;
                R.editor.components.drag.item.cursor.y = e.pageY + R.window.scrolly;
            },

            paint: function () {
                if (this.painting == false) { return;}
                if (this.disabled == true) { return; }
                var mDiff = {
                    x: this.item.cursor.x - this.item.cursorStart.x,
                    y: this.item.cursor.y - this.item.cursorStart.y
                }

                var pos = {
                    x: this.item.cursor.x - this.item.absolute.x - this.item.cursorStart.comp.x,
                    y: this.item.cursor.y - this.item.absolute.y - this.item.cursorStart.comp.y - this.item.offsety,
                }

                var targety = this.item.absolute.y + pos.y + 10;

                if (this.vertical == true) { mDiff.x = 0; }
                if (mDiff.x != 0 || mDiff.y != 0) { this.moved = true; }
                $(this.item.elem).css({ left: pos.x, top: pos.y });

                //get component above
                var comp = R.editor.components.getComponentAbove(this.item.elem, targety);

                //check if new placeholder should be made if cursor is in range
                var isinRange = false;
                var compPos = R.elem.pos(comp);
                var nobox = false;
                if (comp == null) {
                    if (targety - this.panelPos.y < 50) {
                        isinRange = true;
                    }
                } else {
                    if (targety - (compPos.y + compPos.h) < 50) {
                        isinRange = true;
                    }
                }
                   
                if (isinRange == true) {
                    if (this.above != comp) {
                        //destroy border
                        $('.tools .borders .above-border').remove();
                        //create new box placeholder
                        var div = document.createElement('div');
                        div.className = 'above-border';
                        div.innerHTML = '&nbsp;';
                        var border = { x: 0, y: 0, w: 0 };
                        if (comp == null) {
                            border.x = this.panelPos.x;
                            border.y = this.panelPos.y + 3;
                            border.w = this.panelPos.w;
                        } else {
                            border.x = compPos.x;
                            border.y = compPos.y + compPos.h;
                            border.w = compPos.w;
                        }
                        $(div).css({ left: border.x, top: border.y, width: border.w, height:1 });
                        $('.tools .borders').append(div);
                        this.above = comp;
                        this.moved = true;
                    }
                } else {
                    this.above = 2;
                    //destroy border
                    $('.tools .borders .above-border').remove();
                }
                    
                R.editor.components.resizeSelectBox();

                if (this.started == true) {
                    setTimeout(function () { R.editor.components.drag.paint(); }, 33);
                }
            },

            end: function () {
               var drag = R.editor.components.drag;
               R.editor.components.drag.started = false;

                //unbind document mouse up event
                $(document).unbind('mousemove', drag.go);
                $(document).unbind('mouseup', drag.end);

                if (drag.painting == true && drag.disabled == false && drag.moved == true) {
                    R.editor.components.drag.painting = false;

                    //rearrange components in DOM
                    if (drag.above != -1 && drag.above != null) {
                        if (drag.above != 2) {
                            if (drag.above.nextSibling != drag.item.elem) {
                                //move component below the target
                                $(drag.item.elem).insertAfter(drag.above);
                            }
                        }
                    } else {
                        if (drag.panel.firstChild != drag.item.elem) {
                            //move component to top
                            $(drag.item.elem).insertBefore($(drag.panel).find('.inner' + drag.panel.id)[0].firstChild);
                        }
                    }
                    $(drag.item.elem).css({ left: '', top: '' });
                    $('.tools .borders .above-border').remove();
                    R.editor.components.drag.item.offsety = 0;
                    
                    //show component select
                    setTimeout(function () {
                        //R.editor.components.selected = null;
                        R.editor.components.disabled = false;
                        R.editor.components.mouseEnter(R.editor.components.drag.item.elem);
                        $('.component-select').animate({ opacity: 1 }, 300);
                    }, 10);

                } else if (drag.moved == false) {
                    //cancel drag & click instead
                    $('.component-select').css({ opacity: 1 });
                    R.editor.components.hideSelect('drag');
                    R.editor.components.disabled = false;
                }
                R.editor.components.drag.painting = false;

                $('.editor > .barrier').remove();
            }
        },

        resize: {
            options: {
                pad: { left: 0, right: 0, top: 0, bottom: 0 }, inner: { left: false, right: false, top: false },
                side: 't', cursor: { x: 0, y: 0 }, cursorStart: { x: 0, y: 0 }, elemStart: { x: 0, y: 0, w:0, h:0 }, offset: { x: 0, y: 0 },
                elemPos: { x: 0, y: 0, w: 0, h: 0 }, panelPos: { x: 0, y: 0, w: 0, h: 0 }, elem: null, timer: null, started: false,
                corner: 20, border: 5, autoHeight:false, autoResize:false, rIndex:0, isPanel:false, startTimer:null
            },

            start: function (e) {
                if (R.editor.enabled == false) { return; }
                if (R.editor.components.disabled == true) { return; }
                if (R.editor.components.hovered.id == 'inner') { return; }
                //setup options
                R.editor.components.disabled = true;
                R.editor.components.resize.options.started = true;
                R.editor.components.drag.disabled = true;
                R.editor.components.posStart = R.elem.offset(R.editor.components.hovered);

                var bar = $(this),
                    mPos = { x: e.pageX + R.window.scrollx, y: e.pageY + R.window.scrolly},
                    p = R.elem.panel(R.editor.components.hovered),
                    c = R.editor.components.hovered;//, r = R.responsive.cache;
                R.editor.components.resize.options.elem = c;
                R.editor.components.resize.options.cursor.x = mPos.x;
                R.editor.components.resize.options.cursor.y = mPos.y;
                R.editor.components.resize.options.cursorStart.x = mPos.x;
                R.editor.components.resize.options.cursorStart.y = mPos.y;
                R.editor.components.resize.options.elemPos = R.elem.innerPos(c);
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
                R.editor.components.resize.options.left = R.editor.components.hovered.style.left.replace('px', '');
                R.editor.components.resize.options.top = R.editor.components.hovered.style.top.replace('px', '');
                if (R.editor.components.resize.options.left != '') { R.editor.components.resize.options.left = parseInt(R.editor.components.resize.options.left); }
                else { R.editor.components.resize.options.left = 0; }
                if (R.editor.components.resize.options.top != '') { R.editor.components.resize.options.top = parseInt(R.editor.components.resize.options.top); }
                else { R.editor.components.resize.options.top = 0; }
                R.editor.components.resize.options.absolute = {
                    x: R.editor.components.resize.options.elemPos.x - R.editor.components.resize.options.left,
                    y: R.editor.components.resize.options.elemPos.y - R.editor.components.resize.options.top,
                }

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
                $('.component-select').stop().css({ opacity: 0.3 });

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
                var pos = { w: this.options.elemStart.w, h: this.options.elemStart.h };
                var mDiff = {
                    x: this.options.cursor.x - this.options.cursorStart.x,
                    y: this.options.cursor.y - this.options.cursorStart.y
                }
                var perc = false;
                var center = 1;
                if ($(this.options.elem).css('margin').indexOf('px ') >= 0) { center = 2; }
                if (this.options.elem.style.width.indexOf('%') >= 0) { perc = true; }
                if (perc == true) {
                    //find new percentage value
                } else {
                    switch (this.options.side) {
                        case 't'://top
                            pos.h -= mDiff.y;
                            break;
                        case 'tr'://top-right
                            pos.h -= mDiff.y;
                            pos.w += (mDiff.x * center);
                            break;
                        case 'r'://right
                            pos.w += (mDiff.x * center);
                            break;
                        case 'br'://bottom-right
                            pos.h += mDiff.y;
                            pos.w += (mDiff.x * center);
                            break;
                        case 'b'://bottom
                            pos.h += mDiff.y;
                            break;
                        case 'bl'://bottom-left
                            pos.w -= (mDiff.x * center);
                            break;
                        case 'l'://left
                            pos.w -= (mDiff.x * center);
                            break;
                        case 'tl'://top-left
                            pos.h -= mDiff.y;
                            pos.w -= (mDiff.x * center);
                            break;
                    }
                }

                if (this.options.autoHeight == false && this.options.autoResize == false) {
                    $(this.options.elem).css({ minHeight: pos.h });
                }
                if (this.options.autoResize == false) {
                    $(this.options.elem).css({ maxWidth: pos.w });
                }
                R.editor.components.resizeSelectBox();
                //R.events.render.trigger();
                if (this.options.started == true) {
                    setTimeout(function () { R.editor.components.resize.paint(); }, 33);
                }
            },

            end: function () {
                R.editor.components.resize.options.started = false;

                //save responsive changes 
                R.editor.components.savePosition(R.editor.components.resize.options.elem);

                //unbind document mouse move event
                $(document).unbind('mousemove', R.editor.components.resize.go);
                $(document).unbind('mouseup', R.editor.components.resize.end);

                //modify component select
                $('.component-select .menu, .component-select  .arrow-down, .editor .windows').show();
                $('.component-select').stop().css({ opacity: 1 });
                setTimeout(function () {
                    R.editor.components.drag.disabled = false;
                    R.editor.components.disabled = false;
                    R.editor.components.selected = null;
                    R.editor.components.mouseEnter(R.editor.components.resize.options.elem);
                }, 0);

                
            }
        },

        mouseEnter: function () {
            if (R.editor.enabled == false) { return; }
            if (R.editor.components.disabled == true) { return; }
            R.editor.components.menu.hideAll();
            var c = this, selectType = '', isalsopanel = false;
            if (R.editor.components.hovered != null) { $('.tools > .component-select').stop(); }
            if (typeof arguments[0].id != 'undefined') { c = arguments[0]; }
            if (c == R.editor.components.selected) { return; }

            //reset any attributes or styles
            $('.tools > .component-select').removeClass('isalsopanel');

            //check if hovered element is inner panel cell
            if (c.id == 'inner') {
                //cancel if hovered element is not a panel cell from a panel component
                if (c.className.indexOf('innerpanel') > -1) { return; }
                //check if there is a selected element
                if (R.editor.components.selected != null) {
                    //check if hovered element is inside selected element
                    if (R.editor.components.selected.id != 'inner') {
                        if ($('#' + R.editor.components.selected.id + ' .' + c.className.replace(' ', '.')).length == 0) {
                            if ($(R.editor.components.selected).parents('.ispanel').find(c).length == 0) {
                                //cancel if selected element 
                                return;
                            }
                        }
                    }
                    //check if hovered panel cell element has siblings
                    if ($(c).parents('.grid-container').length > 0) {
                        //cancel if panel cell has no siblings
                        if($($(c).parents('.grid-container')[0]).find('.panel-grid').length == 1){return;}
                    } else {
                        //no grid, no need for showing panel cell
                        return;
                    }
                }
                selectType = 'cell';
            }

            //check selected element
            if (R.editor.components.selected != null) {
                if (R.editor.components.selected.id == 'inner') {
                    if (c.id != 'inner') {
                        //check if selected element is in same panel as hovered element
                        if ($(c).parents('.ispanel:not(.islayout)').length > 0) {
                            if ($(R.editor.components.selected).parents('.ispanel:not(.islayout)')[0] == $(c).parents('.ispanel:not(.islayout)')[0]) {
                                if ($($(R.editor.components.selected).parents('.ispanel:not(.islayout)')[0]).find('#' + c.id).length == 0) { return; }
                            }
                        } else {
                            //check if hovered element is a panel
                            if ($(c).hasClass('type-panel') == true) {
                                if ($(R.editor.components.selected).parents('.type-panel')[0] == c) {
                                    return;
                                }
                            } else {
                                return;
                            }
                        }
                        
                    }
                } else if (c.id != 'inner') {
                    if ($(R.editor.components.selected).parents('#' + c.id).length > 0) { return; }
                } else if(c.id == 'inner') {
                    if ($(c).find(R.editor.components.selected).length > 0) { return; }
                }
            }

            if (R.editor.components.selected != c) {
                //setup & show component select
                if (R.editor.components.selected == null) {
                    var p = $(c).parents('.component.type-panel');
                    if (p.length > 0) {
                        R.editor.components.selected = p[0];
                    }
                }
                R.editor.components.hovered = c;
                
                R.editor.components.callback.execute('onHover', R.editor.components.hovered);
                $('.tools > .component-select').show().stop().css({ opacity: 1 });

                if (R.components.cache[c.id] != undefined) {
                    R.editor.components.menu.items.load(R.components.cache[c.id].type.replace('/','-'));
                } else {
                    R.editor.components.menu.items.load('cell');
                }

                R.editor.components.resizeSelectBox();

                //update component select class for color change
                if ($(c).hasClass('type-panel') == true) {
                    //check if hovered panel cell element has siblings
                    if ($(c).find('.grid-container').length > 0) {
                        //cancel if panel cell has no siblings
                        if ($($(c).find('.grid-container')[0]).find('.panel-grid').length == 1) { selectType = 'cell'; }
                    } else {
                        //no grid, no need for showing panel cell
                        selectType = 'cell';
                        $('.tools > .component-select').addClass('isalsopanel');
                        isalsopanel = true;
                    }
                }

                if (selectType == 'cell') {
                    $('.tools > .component-select').addClass('forpanel');
                    if (isalsopanel == false) {
                        $('.tools > .component-select .arrow-down').hide();
                    } else {
                        $('.tools > .component-select .arrow-down').show();
                    }

                    //add custom quickmenus
                    //R.editor.components.quickmenu.show(R.editor.components.hovered, 'cell');

                } else {
                    $('.tools > .component-select').removeClass('forpanel');
                    $('.tools > .component-select .arrow-down').show();
                    $('.tools > .component-select .quickmenu').show();

                    //add custom quickmenu
                    //if ($(c).hasClass('type-panel') == true) {
                    //    R.editor.components.quickmenu.show(R.editor.components.hovered, 'panel');
                    //}else{
                    //    R.editor.components.quickmenu.show(R.editor.components.hovered, 'component');
                    //}
                    
                }

                
            } 
            $('.tools > .component-select').css({ opacity: 1 });

            
        },

        mouseLeave: function (e) {
            if (R.editor.enabled == false) { return; }
            if (R.editor.components.disabled == true) { return; }
                R.editor.components.hideSelect('leave');
        },

        click: function (target, type) {
            if (R.editor.enabled == false) { return;}
            if (R.editor.components.disabled == true) { return; }
            if (type == 'component-select') {
                //select component
                if ($(target).hasClass('component-select') == false) { return; }
                if (R.editor.components.selected != R.editor.components.hovered) {
                    if (R.editor.components.selected != null) { R.editor.components.callback.execute('onHide', R.editor.components.selected);}
                    R.editor.components.selected = R.editor.components.hovered;
                    R.editor.components.hideSelect('select');
                    R.editor.components.callback.execute('onClick', R.editor.components.selected);
                }
            } else {
                if(type != 'window' && type != 'toolbar' && type != 'tools'){
                    //deselect component
                    var t = target, hide = false;
                    if (type == 'component') {
                        if ($(t).hasClass('component') == true) {
                            if ($(t).hasClass('.type-panel') == true) {
                                //mouseEnter only if the component is a panel
                                t = $(t).parents('.component')[0];
                            }
                        }
                    }
                    if (t == R.editor.components.selected || $(t).find(R.editor.components.selected).length > 0) {
                        //clicked selected panel to allow mouseEnter
                        R.editor.components.callback.execute('onHide', R.editor.components.selected);
                        R.editor.components.selected = null;
                        R.editor.components.hideSelect();
                        R.editor.components.mouseEnter(t);
                    } else {
                        if (R.editor.components.selected != null) {
                            if ($(t).parents(R.editor.components.selected).length == 0) {
                                hide = true;
                            }
                        } else { hide = true;}
                    }
                    if (type == 'bg') {
                        hide = true;
                        if (R.editor.components.hovered == null) { R.editor.components.hovered = R.editor.components.selected;}
                    }
                    if (hide == true) {
                        //completely deselect component
                        R.editor.components.callback.execute('onHide', R.editor.components.hovered);
                        R.editor.components.selected = null;
                        R.editor.components.hideSelect();
                    }
                }

            }
            
        },

        callback: {
            items: [],

            add: function (elem, vars, onHover, onClick, onResize, onHide) {
                this.items.push({ elem: elem, vars: vars, onHover: onHover, onClick: onClick, onResize: onResize, onHide: onHide });
            },

            remove: function (elem) {
                for (var x = 0; x < this.items.length; x++) {
                    if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                }
            },

            execute: function (type, target, pos) {
                if (this.items.length > 0) {
                    for (var x = 0; x < this.items.length; x++) {
                        //if (this.items[x].elem == target) {
                            switch (type) {
                                case '': case null: case 'onHover':
                                    if (typeof this.items[x].onHover == 'function') {
                                        this.items[x].onHover(target);
                                    }
                                    break;

                                case 'onClick':
                                    if (typeof this.items[x].onClick == 'function') {
                                        this.items[x].onClick(target);
                                    }
                                    break;

                                case 'onResize':
                                    if (typeof this.items[x].onResize == 'function') {
                                        this.items[x].onResize(target, pos);
                                    }
                                    break;

                                case 'onHide':
                                    if (typeof this.items[x].onHide == 'function') {
                                        this.items[x].onHide(target);
                                    }
                                    break;
                            }
                            //break;
                        //}
                    }
                }
            }
        },

        hideSelect: function () {
            
            var type = arguments[0] || '';
            if (type == 'leave') { R.editor.components.hovered = null; }
            var sel = R.editor.components.selected;
            if (sel == null) {
                if (type == '' || type == 'leave') {
                    $('.tools > .component-select').hide();
                }
                return;
            }
            var ctype = R.components.cache[sel.id];
            var hide = true;
            if (sel.id != 'inner' && ctype != null) {
                hide = false;
                switch (ctype.type) {
                    case 'panel': case 'textbox':
                        hide = true;
                        break;
                }
            }
            
            $('.tools > .component-select').hide();
            $('.component-select .menu .item').css({ paddingRight: 0 });
            return;

            if (hide == true && (type == '' || type == 'leave')) {
                $('.tools > .component-select').hide();
            } else {
                $('.tools > .component-select').css({ width: 0, height: 0 });
            }
            //stop().animate({ opacity: 0 }, 4000, function () { $(this).hide();});
        },

        nudge: function (dir, speed) {
            if (this.hovered != null) {
                var c = this.hovered;
                var cPos = R.elem.offset(c);
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
                        //var s = R.responsive.getComponentFromStack(c);
                        R.editor.components.savePosition(c, null, null, null, null, null, cPos, 'nostack');
                    }
                }, 100);
            }
        },

        resizeSelectBox: function () {
            if (this.hovered == null) { return;}
            var cPos = R.elem.pos(this.hovered), pad = { left: 12, right: 12, top: 12, bottom: 12 }, 
            corner = this.resize.options.corner, border = this.resize.options.border, inner={left:false, right:false, top:false},
            menu = this.selbox.find('.menu'); var menuPos = R.elem.offset(menu[0]);

            //check padding for window edges
            if (cPos.x + cPos.w + border + menuPos.w >= R.window.absolute.w) {
                //right edge
                if (cPos.x + cPos.w + border >= R.window.absolute.w) {
                    pad.right = 0 - ((cPos.x + cPos.w) - R.window.absolute.w);
                } else {
                    pad.right = 12;
                }
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
                this.selbox.find('.arrow-down').css({ left: (cPos.w / 2) - 20, top: -15 + border }).removeClass('below').addClass('above');
            } else {
                this.selbox.find('.arrow-down').css({ left: (cPos.w / 2) - 20, top: 0 }).removeClass('above').addClass('below');
            }

            //reposition menu
            if (inner.right == false) {
                menu.css({ left: cPos.w, top: 0 }).removeClass('inside').addClass('outside');
                $('.component-select .menu .item').css({ marginLeft: 0 });
            } else {
                menu.css({ left: cPos.w - menuPos.w - border, top: border }).removeClass('outside').addClass('inside');
                $('.component-select .menu .item').css({ marginLeft: 3 });
            }

            //execute callback
            R.editor.components.callback.execute('onResize', R.editor.components.hovered, cPos);
        },

        getComponentAbove: function(c, y){
            var ePos, cPos = R.elem.pos(c);
            //if (arguments[1] != null) { cPos = arguments[1];}
            var panel = R.elem.panel(c);
            var comps = $(panel).find('.component:above(' + (y + 300) + ')').sort(function (a, b) {
                var aPos = R.elem.pos(a), bPos = R.elem.pos(b);
                if (aPos.y + aPos.h > bPos.y + bPos.h) { return -1; } return 1;
            });
            if (comps.length == 0) { return null; }
            for (x = 0; x < comps.length; x++) {
                if ($(comps[x]).parents('.component').parents(panel).length == 0 && comps[x] != c) {
                    ePos = R.elem.pos(comps[x]);
                    if (ePos.y + (ePos.h / 2) <= y) {
                        if (this.inRange(cPos, ePos) == true || this.inRange(ePos, cPos) == true) { return comps[x]; }
                    }
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

        saveStyle: function () {
            //update component style based on menu settings

        },

        menu: {
            showing: null,

            show: function (tab) {
                var p = $('.component-select .properties');
                if ($('.component-select .section-' + tab)[0].style.display != 'none' && p[0].style.display != 'none') { this.hide(tab); return; }
                this.hideAll();
                $('.component-select .section-position, .component-select .section-layer, .component-select .section-style').hide();
                $('.component-select .section-' + tab).show();
                p.css({ opacity: 0, width:'' }).show();
                var cPos = R.elem.pos(R.editor.components.hovered), pPos = R.elem.offset(p[0]), 
                    mPos = R.elem.offset($('.component-select .menu')[0]), options = R.editor.components.resize.options;
                var pos = { x: mPos.x + mPos.w, y: 0 }
                if (options.inner.right == true) {
                    //display window inside component select next to menu
                    pos.x = mPos.x - 3;
                    p.css({ opacity: 1, left: pos.x - pPos.w, top: options.border + 3 });
                } else {
                    if (mPos.x + pPos.w >= R.window.w) {
                        //display window inside component select next to resize bar
                        pos.x = mPos.x - options.border;
                        p.css({ opacity: 1, left: pos.x - pPos.w, top: options.border + 3 });
                    } else {
                        //display window outside component next to menu
                        p.css({ opacity: 1, left: pos.x - options.border, top: 0 });
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

            items: {
                rules: [],

                addRule:function(componentName, hideItems){
                    //adds a rule to hide certain items when displaying custom menu items for a specific component type
                    //hideItems is selector of items to hide, example: ".menu-options, .menu-layer"
                    this.rules.push({ componentName: componentName, hideItems: hideItems });
                },

                add: function (componentName, menuName, iconHtm, append, onclick) {
                    //add a custom menu item to the list of items
                    var div = document.createElement('div');
                    div.className = 'item menu-' + menuName + ' for-' + componentName;
                    div.setAttribute('onclick', onclick);
                    div.innerHTML = iconHtm;
                    if (append == null || append == 'after') {
                        $('.tools .component-select .menu').append(div);
                    } else if (append == 'before') {
                        $('.tools .component-select .menu').prepend(div);
                    }
                },

                load: function (componentName) {
                    //executed when the user hovers over a component to display the component select & menu item list
                    //determines which menu items to show & hide

                    //first, hide all menu items
                    $('.tools .component-select .menu .item').hide().removeClass('first last');

                    //next, show all matching menu items
                    $('.tools .component-select .menu .item.for-all, .tools .component-select .menu .item.for-' + componentName).show();

                    //find matching rule & hide menu items within the matching rule
                    for (x = 0; x < this.rules.length; x++) {
                        if (this.rules[x].componentName == componentName) {
                            $('.tools .component-select .menu').find(this.rules[x].hideItems).hide();
                            break;
                        }
                    }

                    //hide style icon
                    $('.tools .component-select .menu .item.menu-style').hide();

                    //determine how many columns to show
                    var items = $('.tools .component-select .menu .item:visible');
                    
                    if (items.length > 4) {
                        $('.tools .component-select .menu').css({ width: 83 });
                        $(items[1]).addClass('first');
                        $(items[items.length - 1]).addClass('last');
                    } else {
                        $('.tools .component-select .menu').css({ width: 43 });
                        if (items.length > 0) {
                            $(items[0]).addClass('first');
                            $(items[items.length - 1]).addClass('last');
                        }
                    }
                    
                }
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
                var itemid = R.editor.components.hovered.id.substr(1);
                R.editor.components.hovered.parentNode.removeChild(R.editor.components.hovered);
                R.editor.components.hideSelect();
                R.ajax.post('/rennder/Editor/RemoveComponent', { componentId: itemid }, R.ajax.callback.inject);
                R.editor.save.add('', '', '');            }
        },

        quickmenu:{
            items: [],

            add: function (componentType, menuHtm, onInit) {
                //add a custom menu for each component type
                this.items.push({ componentType: componentType, menuHtm: menuHtm, onInit: onInit });
            },

            show: function (innerPanel, type) {
                //executed when the user hovers over a component to display the component select & menu item list
                //determines where to load custom quick menus for each component within an inner panel cell, 
                //then generates them & repositions them intelligently within the component select's transparent area

                //find all possible components
                $('.tools .component-select .quickmenu')[0].innerHTML = '';

                var matching = [];
                for (c in R.components.cache) {
                    var exists = false;
                    for (x = 0; x < matching.length; x++) {
                        if (matching[x] == R.components.cache[c].type.toLowerCase()) { exists = true; break; }
                    }
                    if (exists == false) { matching.push(R.components.cache[c].type.toLowerCase()); }
                }
                var components = [];
                switch(type){
                    case 'cell': case 'panel':
                        components = $(innerPanel).find('.component');
                        break;
                    case 'component':
                        components = $(innerPanel);
                        return;
                        break;
                }
                var innerPos = R.elem.offset(innerPanel);

                for (c in components) {
                    if (components[c]) {
                        if (components[c].className) {
                            var carr = components[c].className.split(' '),
                                cPos = R.elem.offset(components[c]),
                                iPos = { x: 0, y: 0, w: 0, h: 0 };
                            if (type == 'panel') {
                                var inner = $(components[c]).parents('#inner')[0];
                                iPos = R.elem.offset(inner);
                                
                                var gridpanel = $(inner).parents('.panel-grid');
                                if (gridpanel.length > 0) {
                                    iPos = R.elem.offset(gridpanel[0]);
                                    cPos.x += iPos.x;
                                    cPos.y += iPos.y;
                                }                                
                            }
                            for (a = 0; a < carr.length; a++) {
                                if (carr[a].indexOf('type-') == 0) {
                                    var componentType = carr[a].replace('type-', '');

                                    //find associated quick menu item for this component type
                                    var item = null, items = R.editor.components.quickmenu.items;
                                    for (x = 0; x < items.length; x++) {
                                        item = items[x];
                                        if (item.componentType == componentType) {
                                            var div = document.createElement('div'), arrow = 'arrow-top';
                                            div.className = 'quickmenu-item for-' + componentType;
                                            div.innerHTML = this.items[x].menuHtm;
                                            $('.tools .component-select .quickmenu').append(div);
                                            var dPos = R.elem.offset(div);
                                            
                                            if (type == 'cell' || type == 'panel') {
                                                var newy = (cPos.y + ((cPos.h / 2) - (dPos.h / 2)));
                                                if (newy < cPos.y + 20) { newy += 15; }
                                                div.style.top = newy + 'px';

                                                if ((cPos.x < (cPos.w / 5) || cPos.x - iPos.x < 300) && innerPos.h > 200) {
                                                    //align to left-hand side
                                                    if ((cPos.x - iPos.x - dPos.w - 10) < 30) {
                                                        //align to far left-hand side
                                                        div.style.left = (10 + iPos.x) + 'px';
                                                        arrow = 'arrow-right';
                                                    } else {
                                                        //align to left of component
                                                        div.style.left = ((cPos.x - iPos.x - dPos.w - 10) > 10 ? (cPos.x - dPos.w - 10) : 10 + iPos.x) + 'px';
                                                        arrow = 'arrow-right';
                                                    }
                                                } else {
                                                    div.style.left = cPos.x + ((cPos.w / 2) - (dPos.w / 2)) + 'px';
                                                }
                                                
                                            } else if (type == 'component') {
                                                div.style.top = (cPos.h / 7) + 'px';
                                                div.style.left = ((cPos.w / 2) - (dPos.w / 2)) + 'px';
                                            }
                                            
                                            
                                            div.style.opacity = '0';
                                            
                                            $(div).css({ opacity: 0 }).addClass(arrow).show().stop().delay(0).animate({ opacity: 1 }, 500);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                
            }
        },

        properties: {
            //current = object loaded from component properties.js
            selected: null, section:'', current: null,

            show: function () {
                if ($('.winProperties').length == 0) {
                    //load the window first
                    var htm =
                        '<div class="top-menu"><div class="tabs"></div></div><div class="props-content"></div>' +
                        '<div class="props-save">' + 
                            '<div class="button center">Save Changes</div>' + 
                        '</div>';
                    R.editor.window.load('Properties', '', htm, { x: 0, align: 'center', y: 0, w: 600, h: 100, spacing: 50, postOnce: true, visible:false, title: 'Component Properties' });
                }
                var section = arguments[0] || '';
                if (R.editor.components.properties.selected != R.editor.components.hovered || R.editor.components.properties.section != section) {
                    $('.winProperties .props-content')[0].innerHTML = '';
                    R.ajax.post('/rennder/Editor/ComponentProperties', { id: R.editor.components.hovered.id.substr(1), section:section }, R.ajax.callback.inject);
                    R.editor.components.properties.section = section;
                } else {
                    $('.winProperties').show();
                }
                R.editor.components.properties.selected = R.editor.components.hovered;
            },

            loaded: function (name, w) {
                $('.winProperties .grip .title')[0].innerHTML = name + ' Properties';
                $('.winProperties').css({ width: w});
                $('.winProperties').show();
            },

            menu: {
                total: 0,

                add: function (title, parent, index) {
                    this.total += 1;
                    var div = document.createElement('div');
                    div.className = 'item';
                    div.setAttribute('onclick', 'R.editor.components.properties.menu.select(\'' + parent + '\',' + index + ')');
                    div.innerHTML = title;
                    $('.winProperties .top-menu .tabs').append(div);
                },

                select: function (parent, index) {
                    $('.winProperties ' + parent + ' > div').hide();
                    $('.winProperties ' + parent + ' > div:nth-child(' + index + ')').show();
                    $('.winProperties .top-menu .tabs .item').removeClass('selected');
                    $('.winProperties .top-menu .tabs .item:nth-child(' + index + ')').addClass('selected');
                },

                clear: function () {
                    R.editor.components.properties.menu.total = 0;
                    $('.winProperties .top-menu .tabs .item').remove();
                }
            }
        },

        toolbar:{
            mouseEnter: function (elem) {
                //show tooltip for component
                $('.winComponents #component-info')[0].innerHTML =
                    "<h4>" + elem.getAttribute("cname") + "</h4>" +
                    "<div class=\"info\">" + elem.getAttribute("ctitle") + "</div>";
            },

            mouseLeave: function () {
                //hide tooltip
                $('.winComponents #component-info')[0].innerHTML = "&nbsp;";
            }
        },

        category: {
            load: function (id) {
                R.ajax.post('/rennder/Editor/ComponentsFromCategory', { category: id },
                    function (data) {
                        R.ajax.callback.inject(data);
                        $('.window.winComponents #component-categories').hide();
                        $('.window.winComponents #components').show();
                    });
            }
        }
    },

    textEditor: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        instance: null,

        init: function () {
            //setup callbacks
            var htm = '';
            R.editor.components.callback.add($('.editor')[0], null, null, this.show, null, this.hide);

            //generate toolbar
            var toolbar = document.createElement('div'),
                btnSelect = document.createElement('div');
            
            toolbar.className = 'texteditor-toolbar';
            toolbar.style.display = 'none';

            btnSelect.className = 'texteditor-btnselect';
            btnSelect.style.display = 'none';

            //create buttons for toolbar
            var buttons = [
                { title: 'bold', svg: 'bold', click: 'R.editor.textEditor.commands.bold()' },
                { title: 'italic', svg: 'italic', click: 'R.editor.textEditor.commands.italic()' },
                { title: 'strike-thru', svg: 'strikethru', click: 'R.editor.textEditor.commands.strikethru()' },
                { title: 'underline', svg: 'underline', click: 'R.editor.textEditor.commands.underline()' },
                { title: 'bullet list', svg: 'bullet', click: 'R.editor.textEditor.commands.bulletList()' },
                { title: 'number list', svg: 'numbers', click: 'R.editor.textEditor.commands.numberList()' },
                //{ title: 'outdent', svg: 'outdent', click: 'R.editor.textEditor.commands.outdent()' },
                { title: 'indent', svg: 'indent', click: 'R.editor.textEditor.commands.indent()' },
                { title: 'align left', svg: 'left', click: 'R.editor.textEditor.commands.alignLeft()' },
                { title: 'align center', svg: 'center', click: 'R.editor.textEditor.commands.alignCenter()' },
                { title: 'align right', svg: 'right', click: 'R.editor.textEditor.commands.alignRight()' },
                { title: 'photo', svg: 'photo', click: 'R.editor.textEditor.commands.photo.show()' },
                { title: 'table', svg: 'table', click: 'R.editor.textEditor.commands.table.show()' },
                { title: 'anchor link', svg: 'link', click: 'R.editor.textEditor.commands.link.show()' },
                { title: 'font color', svg: 'color', click: 'R.editor.textEditor.commands.colors.show("color")' },
                { title: 'highlight color', svg: 'bgcolor', click: 'R.editor.textEditor.commands.colors.show("highlight")' },
                { title: 'source code', svg: 'source', click: 'R.editor.textEditor.commands.source.show()' }
            ];

            for (x = 0; x < buttons.length; x++) {
                htm += '<div class="button"><a href="javascript:" onmousedown="' + buttons[x].click + ';return false" title="' + buttons[x].title + '">' +
                    '<svg viewBox="0 0 18 18"><use xlink:href="#icon-text' + buttons[x].svg + '" x="0" y="0" width="18" height="18" /></svg></a></div>';
            }


            //add toolbar to the tools div
            toolbar.innerHTML = htm;
            $('.tools').append(toolbar);
            htm = '';

            //create button for viewing the component select
            var btns = [{ title: 'View the Component Box & Options Menu for this Textbox', svg: 'componentselect', click: 'R.editor.textEditor.commands.componentSelect()' }];
            for (x = 0; x < btns.length; x++) {
                htm += '<div class="button"><a href="javascript:" onmousedown="' + btns[x].click + ';return false" title="' + btns[x].title + '">' +
                    '<svg viewBox="0 0 22 19" style="width:22px"><use xlink:href="#icon-' + btns[x].svg + '" x="0" y="0" width="22" height="19" /></svg></a></div>';
            }


            //add button to the tools div
            btnSelect.innerHTML = htm;
            $('.tools').append(btnSelect);
            htm = '';

            //create button for viewing the text editor
            htm = '<div title="View the Text Editor">' +
                  '<svg viewBox="0 0 18 18" style="display:inline-block; width:10px; padding:2px 2px 0px 8px;"><use xlink:href="#icon-textbold" x="0" y="0" width="18" height="18" /></svg>' +
                  '<svg viewBox="0 0 18 18" style="display:inline-block; width:10px; padding:2px 2px 0px 2px;"><use xlink:href="#icon-textitalic" x="0" y="0" width="18" height="18" /></svg>' +
                  '<svg viewBox="0 0 18 18" style="display:inline-block; width:10px; padding:2px 2px 0px 8px;"><use xlink:href="#icon-textstrikethru" x="0" y="0" width="18" height="18" /></svg>' +
                  '<svg viewBox="0 0 18 18" style="display:inline-block; width:10px; padding:2px 2px 0px 2px;"><use xlink:href="#icon-textunderline" x="0" y="0" width="18" height="18" /></svg>' +
                  '</div>';

            //add text editor button to the component select menu
            R.editor.components.menu.items.add('textbox', 'texteditor', htm, 'before', 'R.editor.components.click($(".component-select")[0], "component-select")');

            

            //configure rangy
            rangy.config.preferTextRange = true;
            rangy.createMissingNativeApi();
        },

        show: function (target) {
            if ($(target).hasClass('type-textbox') == true) {
                var textedit = $(target).find('.textedit');
                textedit.addClass('editing')[0].contentEditable = "true";

                //setup events
                R.hotkeys.callback.add('texteditor', null, null, R.editor.textEditor.keyUp);
                textedit.bind('mousedown', R.editor.textEditor.mouseDown);
                textedit.bind('mouseup', R.editor.textEditor.mouseUp);
                R.events.doc.scroll.callback.add($('.tools .texteditor-toolbar')[0], target, R.editor.textEditor.reposition, R.editor.textEditor.reposition, R.editor.textEditor.reposition);
                R.events.doc.resize.callback.add($('.tools .texteditor-toolbar')[0], target, R.editor.textEditor.reposition, R.editor.textEditor.reposition, R.editor.textEditor.reposition);
                
                //reposition the text editor toolbar
                R.editor.textEditor.reposition(target);
            }
        },

        reposition: function (target) {
            var t = this.vars ? this.vars : target;
            var pos = R.elem.pos(t);
            var tPos = { x: pos.x, y: pos.y - 45 };
            if (pos.y - R.window.scrolly < 105) {
                tPos.y = pos.y + pos.h + 10;
            }
            $('.tools .texteditor-toolbar').css({ top: tPos.y, left: tPos.x - 12 }).show();

            pos = R.elem.pos(t);
            if (pos.x + pos.w + 60 > R.window.absolute.w) { pos.x -= (40); }
            if (pos.y - R.window.scrolly < 105) { pos.y += pos.h - 12; }
            $('.tools .texteditor-btnselect').css({ top: pos.y - 12, left: pos.x + pos.w + 10 }).show();
        },

        hide: function (target) {
            if ($(target).hasClass('type-textbox') == true) {
                if ($(target).find('.textedit.editing').length == 1) {
                    var textedit = $(target).find('.textedit');
                    textedit.removeClass('editing')[0].contentEditable = "false";
                    R.hotkeys.callback.remove('texteditor', null, null, R.editor.textEditor.keyUp);
                    textedit.unbind('mousedown', R.editor.textEditor.mouseDown);
                    textedit.unbind('mouseup', R.editor.textEditor.mouseUp);
                    //R.editor.textEditor.save.finish(target);
                }
                $('.tools .texteditor-toolbar, .tools .texteditor-btnselect').hide();
                R.events.doc.scroll.callback.remove($('.tools .texteditor-toolbar')[0]);
                R.events.doc.resize.callback.remove($('.tools .texteditor-toolbar')[0]);
            }
        },

        keyUp: function () {
            //R.events.render.trigger(1);
            R.editor.textEditor.reposition(R.editor.components.selected);
            R.editor.textEditor.save.start();
        },

        mouseDown: function () {
            R.editor.components.disabled = true;
        },

        mouseUp: function () {
            setTimeout(function () { R.editor.components.disabled = false; }, 100);
        },

        alterRange: function (name, tag, attributes, remove, outerOnly) {
            var sel = rangy.getSelection(), range, el, f, container,
                hasremove = false, hasclass = false;

            //select children if there is no selection made ///////////////////////
            if (sel.isCollapsed == true) {
                sel.selectAllChildren(sel.anchorNode);
            }

            if (outerOnly == true) {
                //create outer node
                sel.refresh();
                range = sel.getRangeAt(0).cloneRange();
                container = range.commonAncestorContainer;
                var contents = range.extractContents();
                f = document.createDocumentFragment();
                el = document.createElement(tag);
                if (attributes != null) { $(el).attr(attributes); }
                el.appendChild(contents);
                var el2 = $(el).find('.' + name);
                if (el2.length == 0 && remove != null) {
                    for (x = 0; x < remove.length; x++) {
                        el2 = $(el).find('.' + remove[x]);
                        if (el2.length > 0) { hasremove = true; break; }
                    }
                }
                if (el2.length > 0) {
                    el = el.firstChild;
                    if (hasremove == false) {
                        //remove outer node (toggle)
                        hasclass = true;
                        $(f).append(el.childNodes);
                        range.insertNode(f);
                    }
                }
                if (hasclass == false) {
                    f.appendChild(el);
                    range.insertNode(f);
                }
                range.normalizeBoundaries();
                sel.refresh();
                sel.setSingleRange(range);
            }
            

            //apply attributes & class (name) to all elements within the select ///
            var applier = rangy.createClassApplier(name, {
                elementTagName: tag,
                elementAttributes: attributes
            }, tag);
            applier.toggleSelection();
            
            //remove any classes from the selection that don't belong /////////////
            if (remove != null) {
                if (remove.length > 0) {
                    //remove classes from range
                    for (x = 0; x < remove.length; x++) {
                        applier = rangy.createClassApplier(remove[x], {
                            elementTagName: tag,
                            elementAttributes: attributes
                        }, tag);
                        applier.undoToSelection();
                    }
                }
            }

            //replace trailing spaces with &nbsp; /////////////////////////////////
            sel.refresh();
            var nodes = [];
            //get all nodes within the selection
            for (x = 0; x < sel.rangeCount; x++) {
                nodes = nodes.concat(sel.getRangeAt(x).getNodes());
            }
            //find each text node and replace trailing spaces with &nbsp;
            for (x = 0; x < nodes.length; x++) {
                if (nodes[x].nodeType == 3) {
                    nodes[x].nodeValue = nodes[x].nodeValue.replace(/\s+$/g, '\u00a0');
                }
            }

            if (outerOnly == true) {
                //remove class (name) from all child nodes
                if (hasclass == false) {
                    el.className = name;
                }
                var c = $(el).find('.' + name).removeClass(name);
                sel.refresh();
                if (hasclass == false) {
                    range.selectNode(el);
                } else {
                    range.selectNodeContents(container);
                }
                sel.setSingleRange(range);
            }
        },

        commands: {
            bold: function () {
                R.editor.textEditor.alterRange('bold', 'span', {});
            },

            italic: function () {
                R.editor.textEditor.alterRange('italic', 'span', {});
            },

            strikethru: function () {
                R.editor.textEditor.alterRange('linethru', 'span', {});
            },

            underline: function () {
                R.editor.textEditor.alterRange('underline', 'span', {});
            },

            bulletList: function () {
                //R.editor.textEditor.instance.invokeElement('ul', { style: 'list-style-type:disc' }).invokeElement('li', {});
            },

            numberList: function () {
                //R.editor.textEditor.instance.invokeElement('ul', { style: 'list-style-type:decimal' }).invokeElement('li', {});
            },

            outdent: function () {
            },

            indent: function () {
                R.editor.textEditor.alterRange('indent', 'span', {}, {}, true);
            },

            alignLeft: function () {
                R.editor.textEditor.alterRange('alignleft', 'span', {}, ['aligncenter','alignright'], true);
            },

            alignCenter: function () {
                R.editor.textEditor.alterRange('aligncenter', 'span', {}, ['alignleft', 'alignright'], true);
            },

            alignRight: function () {
                R.editor.textEditor.alterRange('alignright', 'span', {}, ['aligncenter', 'alignleft'], true);
            },

            photo: {
                show: function () {

                },

                add: function (file) {

                }
            },

            table: {
                show: function () {

                },

                add: function (rows, columns) {

                }
            },

            link: {
                show: function () {

                },

                add: function () {

                }
            },

            colors: {
                type: 'color',

                show: function (type) {

                },

                add: function (color) {

                }
            },

            source: {
                show: function () {

                },

                hide: function () {

                }
            },

            componentSelect: function () {
                R.editor.components.hovered = R.editor.components.selected;
                R.editor.components.selected = null;
                $('.component-select').show();
                R.editor.components.resizeSelectBox();
                R.editor.textEditor.hide(R.editor.components.hovered);
                
            }
        },

        save: {
            timer: null,

            start: function () {
                //wait 1.5 seconds after the user is done typeing before saving text
                if (this.timer != null) { clearTimeout(this.timer); }
                var fin = 'R.editor.textEditor.save.finish($("#' + R.editor.components.selected.id + '")[0]);';
                this.timer = setTimeout(fin, 1500);
            },

            finish: function (c) {
                var val = $(c).find('> .textedit')[0].innerHTML;
                R.editor.save.add(c.id, 'data', val);
            }
        }
    },

    pages: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        tree:{
            items: [],

            add: function (pageId, title) {
                R.editor.pages.tree.items.push({ pageId: pageId, title: title });
                R.editor.pages.tree.updateTitle();
            },

            remove: function (pageId) {
                var found = false;
                for (var x = 0; x < R.editor.pages.tree.items.length; x++) {
                    if (R.editor.pages.tree.items[x].pageId == pageId) {found = true; break; }
                }
                R.editor.pages.tree.items.splice(x-1, 1);
                R.editor.pages.tree.updateTitle();
            },

            updateTitle: function () {
                var htm = '';
                for (x = 0; x < R.editor.pages.tree.items.length; x++) {
                    if (x > 0) { htm += '/'; }
                    htm += R.editor.pages.tree.items[x].title;
                }
                //if (htm == '') { htm = 'root';}
                $('.winWebPages .pages-title .page-title')[0].innerHTML = '/' + htm;
            }
        },

        add: {
            item: { parentId: 0, title: '', description: '' },
            show:function (parentId) {
                R.editor.pages.add.item = { parentId: parentId, title: '', description: '' };
                R.editor.window.load('NewPage', 'Editor/NewPage', { parentId: parentId || 0, title: R.website.title },
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', spacing: 50, loadOnce: true, noDashboard:true, title: 'New Web Page' });
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
                R.ajax.post('/rennder/Dashboard/Pages/Create', data, R.ajax.callback.inject);
            },
        },

        settings: {
            item: { pageId: 0},
            show: function (pageId) {
                R.editor.pages.settings.item = { pageId: pageId};
                R.editor.window.load('PageSettings', 'Editor/PageSettings', { pageId: pageId},
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', spacing: 50, loadOnce: true, title: 'Web Page Settings', hash: 'page-settings' });
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
                R.ajax.post('/rennder/Dashboard/Pages/Update', data, R.ajax.callback.inject);
            },
        },

        remove: function (pageId) {
            if (confirm('Do you really want to delete this web page? This cannot be undone.') == true) {
                R.ajax.post('/rennder/Dashboard/Pages/Remove', { pageId: pageId }, R.ajax.callback.inject);
            }
        },

        load: function (pageId, title, updown) {
            if (updown == null || updown == 'up' || updown == true) {
                R.editor.pages.tree.add(pageId, title);
            } else {
                R.editor.pages.tree.remove(pageId);
            }
            R.ajax.post('/rennder/Dashboard/Pages/LoadSubPages', { parentId: pageId }, R.ajax.callback.inject);
        },

        expand: function (pageId) {
            if ($('.winWebPages .content .page-' + pageId).children().length == 3) {
                //load sub pages
                R.ajax.post('/rennder/Dashboard/Pages/LoadSubPages', { parentId: pageId }, R.ajax.callback.inject);
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

    layers: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        show: function(){
            R.editor.window.load('Layers', 'Editor/Layers', {}, { r: 0, y: 0, w: 250, h: 100, loadOnce: true });
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
                    comps = p.find('.component').filter(function (index, elem) { if ($(elem).parents('.ispanel:not(.islayout)').length > 0) { return false; } return true;});
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
                                            
                                        comps2 = p2.find('.component');
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

    designer: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        show: function () {
            R.editor.window.hidePopUps();
            if ($('.windows .winDesigner').length == 0) {
                var htm =
                    '<div class="side-menu">' +
                        '<div class="column-icon">' +
                            '<a href="javascript:" onclick="R.editor.designer.backgrounds.show()" title="Backgrounds">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-background" x="0" y="0" width="25" height="25" />' +
                            '</svg></a>' +
                        '</div>' +
                            '<div class="column-icon">' +
                            '<a href="javascript:" onclick="R.editor.designer.fonts.show()" title="Custom Fonts">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-fonts" x="0" y="0" width="25" height="25" />' +
                            '</svg></a>' +
                        '</div>' +
                            '<div class="column-icon">' +
                            '<a href="javascript:" onclick="R.editor.designer.colors.show()" title="Color Schemes">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-colorschemes" x="0" y="0" width="25" height="25" />' +
                            '</svg></a>' +
                        '</div>' +
                            '<div class="column-icon">' +
                            '<a href="javascript:" onclick="R.editor.designer.code.show()" title="Source Code">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-sourcecode" x="0" y="0" width="25" height="25" />' +
                            '</svg></a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ide">' +
                        '<div class="backgrounds-content"></div>' +
                        '<div class="fonts-content"></div>' +
                        '<div class="colorschemes-content"></div>' +
                        '<div class="code-content">' + 
                            '<div class="top-menu">' + 
                                
                            '</div>' + 
                            '<div class="code-files">' + 
                                '<div class="code-filelist"></div>' +
                            '</div>' + 
                            '<div class="code-editor">' +
                                '<div class="code-ace-files tabs">' +
                                    '<div class="code-ace-save">' +
                                        '<a href="javascript:" onclick="R.editor.designer.code.file.save()" title="save file changes">' +
                                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                                '<use xlink:href="#icon-save" x="0" y="0" width="25" height="25" />' +
                                            '</svg>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="code-ace">' +
                                    '<div id="ace-editor"></div>' + 
                                '</div>' +
                                '<div class="code-ace-info"></div>' +
                            '</div>' + 
                        '</div>' +
                    '</div>';
                R.editor.window.load('Designer', '', htm, { x: 0, align: 'center', y: 0, w: 780, h: 400, spacing: 50, postOnce: true, resizable: true, title: 'Designer Tools', hash: 'designer' });
            } else {
                $('.windows .winDesigner').show();
            }
            
        },

        hideContent: function () {
            $('.winDesigner .backgrounds-content, .winDesigner .fonts-content, .winDesigner .colorschemes-content, .winDesigner .code-content').hide();
        },

        backgrounds: {
            show: function () {
                R.editor.designer.show();
                R.editor.designer.hideContent();
                $('.winDesigner .backgrounds-content').show();
            }
        },

        fonts: {
            show: function () {
                R.editor.designer.show();
                R.editor.designer.hideContent();
                $('.winDesigner .fonts-content').show();
            }
        },

        colors: {
            show: function () {
                R.editor.designer.show();
                R.editor.designer.hideContent();
                $('.winDesigner .colorschemes-content').show();
            }
        },

        code: {
            ace: null, sessions:[], selected:0,

            show: function () {
                R.editor.designer.show();
                R.editor.designer.hideContent();
                $('.winDesigner .code-content').show();
                if ($('.winDesigner .code-content #ace-editor > div').length == 0) {
                    $.when(
                        $.getScript('/scripts/ace/builds/src-min-noconflict/ace.js'),
                        $.Deferred(function (deferred) { $(deferred.resolve); })
                    ).done(function () {
                        //configure Ace Editor
                        ace.config.set("basePath", "/scripts/ace/builds/src-min-noconflict/");
                        R.editor.designer.code.ace = ace.edit("ace-editor");
                        R.editor.designer.code.ace.setTheme("ace/theme/twilight");
                        R.editor.designer.code.ace.commands.addCommand({
                            name: 'saveFile',
                            bindKey: {
                                win: 'Ctrl-S',
                                mac: 'Command-S',
                                sender: 'editor|cli'
                            },
                            exec: function (env, args, request) {
                                R.editor.designer.code.file.save();
                            }
                        });

                        //load website folder list of files
                        R.ajax.post('/rennder/Dashboard/Designer/Code/LoadFolder', { type: 'website', folder:'' }, 
                            function (data) {
                                R.ajax.callback.inject(data);
                                //then load page CSS code for this web page
                                R.editor.designer.code.file.load('page', '')
                                
                                //callback for resizing window
                                R.editor.window.resize.callback.add($('.winDesigner')[0], null, R.editor.designer.code.resizeAce);
                                R.editor.designer.code.resizeAce();
                            }
                        );
                        
                    });
                }
            },

            file: {
                load: function (type, file) {
                    //load file into Ace Editor
                    $('.winDesigner .code-ace-files .item').removeClass('selected');
                    var s = R.editor.designer.code.sessions, found = false;
                    if (s.length > 0) {
                        for (x = 0; x < s.length; x++) {
                            if (s[x].type == type && s[x].file == file) {
                                found = true;
                                //show tab
                                $('.winDesigner .code-ace-files .item[data-filetype="' + type + '"][data-file="' + file + '"]').addClass('selected');
                                //load session into Ace Editor
                                R.editor.designer.code.selected = x;
                                R.editor.designer.code.file.modified(s[x].modified);
                                R.editor.designer.code.ace.setSession(s[x].session);
                                R.editor.designer.code.ace.focus();
                            }
                        }
                    }
                    if (found == false) {
                        //load file from server
                        R.editor.designer.code.ace.focus();
                        R.ajax.post('/rennder/Dashboard/Designer/code/LoadFile', { type: type, file: file },
                            function (data) {
                                //get file name
                                var f = file;
                                if (f == '') {
                                    switch (type) {
                                        case 'page':
                                            f = 'page.css'; break;
                                    }
                                }

                                //create tab
                                var div = document.createElement('div');
                                div.className = "item selected";
                                div.setAttribute('data-filetype', type);
                                div.setAttribute('data-file', file);
                                div.setAttribute('onclick', "R.editor.designer.code.file.load('" + type + "','" + file + "')");
                                div.innerHTML = f;
                                $('.winDesigner .code-ace-files').append(div);

                                //add session
                                var textmode = 'ace/mode/css', ext = R.util.file.extension(f);
                                switch (ext) {
                                    case 'htm':
                                    case 'html':
                                        textmode = 'ace/mode/html'; break;
                                    case 'rml':
                                        textmode = 'ace/mode/html'; break;
                                }
                                //create new session
                                var session = ace.createEditSession(data.d.html, textmode);
                                session.on("change", R.editor.designer.code.file.change, 'test');
                                //load session into Ace Editor
                                R.editor.designer.code.ace.setSession(session);
                                //save session to array
                                R.editor.designer.code.sessions.push({ type: type, file: file, session: session, modified: false });
                                R.editor.designer.code.selected = R.editor.designer.code.sessions.length-1;
                                R.editor.designer.code.file.modified(false);
                            }
                        );
                    }
                },

                change:function(e, p){
                    R.editor.designer.code.sessions[R.editor.designer.code.selected].modified = true;
                    R.editor.designer.code.file.modified(true);
                },

                modified: function (ismodified) {
                    if (ismodified == true) {
                        $('.winDesigner .code-ace-files .code-ace-save').css({ opacity: 1 }).attr('onclick', 'R.editor.designer.code.file.save()').removeClass('nosave');
                    } else {
                        $('.winDesigner .code-ace-files .code-ace-save').css({ opacity: 0.3}).attr('onclick', '').addClass('nosave');
                    }
                },

                save: function (){
                    var s = R.editor.designer.code.sessions[R.editor.designer.code.selected];
                    if (s.modified == true) {
                        var t = s.session.getValue();
                        s.modified = false;
                        R.editor.designer.code.sessions[R.editor.designer.code.selected] = s;
                        $('.winDesigner .code-ace-files .code-ace-save').addClass('saving');
                        R.ajax.post('/rennder/Dashboard/Designer/code/SaveFile', { type: s.type, file: s.file, value: t },
                            function (data) {
                                $('.winDesigner .code-ace-files .code-ace-save').removeClass('saving').addClass('nosave');
                                R.editor.designer.code.file.modified(false);
                            }
                        );

                        if (s.type == 'page' && s.file == '') {
                            //update page CSS
                            $('#customCSS')[0].innerHTML = '<style rel="stylesheet/css" type="text/css">' + t + '</style>';
                        }
                    }
                },

                close: function () {

                }
            },

            folder: {
                load: function (type, folder) {
                    R.ajax.post('/rennder/Dashboard/Designer/code/LoadFolder', { type: type, folder: folder }, R.ajax.callback.inject);
                }
            },

            resizeAce: function () {
                var h = R.elem.height($('.winDesigner')[0]);
                var infoh = R.elem.height($('.winDesigner .code-ace-info')[0]);
                $('.winDesigner .code-editor').css({ height: h - 60 - infoh });
                R.editor.designer.code.ace.resize();
            }

        }
    },

    photos: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        info: { total: 0, start: 1, len: 0 },
        folder:'', selected:null, ismoving: false,

        init: function(){
            Dropzone.autoDiscover = false;
            var htm =
                '<div class="top-menu">' +
                    '<div class="folder">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-folder">' +
                            '<a href="javascript:" onclick="R.editor.photos.folders.show()">' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-folderfiles" x="0" y="0" width="25" height="25" /></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label"></div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="folder-add" style="display:none;">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-folder-add relative">' +
                            '<a href="javascript:" onclick="R.editor.photos.folders.showAdd()" title="Add a new folder to put photos into">' +
                                '<div class="absolute icon-plus"><svg viewBox="0 0 25 25" style="width:9px;"><use xlink:href="#icon-plus" x="0" y="0" width="25" height="25" /></svg></div>' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-folderfiles" x="0" y="0" width="25" height="25" /></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label"></div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="move-photos" style="display:none;">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-move">' +
                            '<a href="javascript:" onclick="R.editor.photos.buttons.move()" title="Move selected photos into another folder">' +
                                '<svg viewBox="0 0 31 25" style="width:31px;"><use xlink:href="#icon-movefolder" x="0" y="0" width="31" height="25" /></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label">Move</div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="remove-photos" style="display:none;">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-remove">' +
                            '<a href="javascript:" onclick="R.editor.photos.buttons.remove()" title="Remove selected photos permanently">' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-remove" x="0" y="0" width="25" height="25" /></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label">Remove</div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="dropzone"></div>' +
                    '<div class="msg-movephotos" style="display:none;">Choose a folder to move your photos into. &nbsp;&nbsp;&nbsp;<a href="javascript:" onclick="R.editor.photos.buttons.moveCancel()">Cancel</a></div>' +
                    '<div class="upload">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-upload">' +
                            '<a href="javascript:">' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-upload" x="0" y="0" width="25" height="25" /></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label">Upload</div>' +
                    '</div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="info-bar"><div class="selected-folder font-faded">Folder: All Photos</div><div class="folder-info font-faded"></div></div>' +
                '<div class="dialog-bar" style="display:none"></div>' +
                '<div class="folder-addbar" style="display:none">' +
                    '<div class="folder-create">' + 
                    '<div class="row">' +
                        '<div class="column-label with-buttons">New Folder</div>' +
                        '<div class="column-input with-buttons"><input type="text" id="txtNewFolder"/></div>' +
                        '<div class="column-buttons">'+
                            '<div class="button" onclick="R.editor.photos.folders.add()">Create Folder</div>'+
                            '<div class="button cancel" onclick="R.editor.photos.folders.hideAdd()">Cancel</div></div>' +
                    '</div></div>' +
                '</div>' +
                '<div class="photo-list"></div>' +
                '<div class="folder-list"></div>';
            R.editor.window.load('Photos', '', htm, { x: 0, align: 'center', y: 0, w: 780, h: 400, spacing: 50, postOnce: true, title: 'Photo Library', visible: false, zIndex: 40, hash: 'photos' });
        },

        show: function (dialog, type) {
            if (type == 'dashboard') {
                $('.winPhotos').addClass('dashboard');
                R.editor.dashboard.hideAllWindows();
                R.editor.dashboard.callback.resize();
                R.hash.ghost('Dashboard/Photos');
            }
            R.editor.window.hidePopUps();
            if ($('.winPhotos .photo-list')[0].children.length == 0) {
                R.ajax.post("/rennder/Dashboard/Photos/LoadPhotoList", { start: '1', folder: '', search: '', orderby: '0' },
                    function (data) {
                        R.ajax.callback.inject(data);
                        //change onclick 
                        if (dialog == 'select' || dialog == 'multiple') {
                            R.editor.photos.dialog.init();
                        }
                    }
                );
            } else if (dialog == 'select' || dialog == 'multiple') {
                R.editor.photos.dialog.init();
            }
            $('.winPhotos .dialog-bar').hide();
            $('.winPhotos').show();
            R.editor.show();
            R.editor.photos.folders.hide();
            R.editor.photos.buttons.hide();
        },

        bind:function(){
            $('.winPhotos .photo-list').off('click').on('click', 'input', function () {
                if ($(this).prop('checked') == true) {
                    $(this).parents('.check').removeClass('hover-only');
                    R.editor.photos.buttons.show();
                } else {
                    $(this).parents('.check').addClass('hover-only');
                    if ($('.winPhotos .photo-list :checked').length == 0) {
                        R.editor.photos.buttons.hide();
                    }
                }
            });
            if (R.editor.photos.dialog.type != '') {
                R.editor.photos.dialog.init();
            }
            R.editor.photos.folders.hide();
        },

        buttons:{
            show: function () {
                $('.winPhotos .move-photos, .winPhotos .remove-photos').show();
                $('.winPhotos .dropzone').hide();
            },

            hide:function(){
                $('.winPhotos .move-photos, .winPhotos .remove-photos').hide();
                $('.winPhotos .dropzone').show();
                $('.winPhotos .photo-list :checked').prop('checked', '').parents('.check').addClass('hover-only');
            },

            move: function () {
                //get a list of files
                var files = [], lst = $('.winPhotos .photo-list');
                var chks = $('.winPhotos .photo-list :checked');
                for (x = 0; x < chks.length; x++) {
                    files.push(chks[x].getAttribute("filename"));
                }
                R.editor.photos.selected = files;

                //load folders list
                R.editor.photos.folders.show('move');
                $('.winPhotos .top-menu .msg-movephotos').show();
                $('.winPhotos .top-menu .folder, .winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(1), .winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(2)').hide();
                R.editor.photos.ismoving = true;
            },

            moveCancel: function(){
                R.editor.photos.folders.bind();
                R.editor.photos.folders.hide();
                $('.winPhotos .top-menu .msg-movephotos').hide();
                $('.winPhotos .top-menu .show').hide();
            },

            remove: function () {
                if (confirm("Do you really want to remove these photos from your library? This cannot be undone.") == true) {
                    var files = [], lst = $('.winPhotos .photo-list');
                    var chks = $('.winPhotos .photo-list :checked');
                    R.editor.photos.info.len -= chks.length;
                    for (x = 0; x < chks.length; x++) {
                        files.push(chks[x].getAttribute("filename"));
                        $(chks).parents('.photo').remove();
                    }
                    
                    R.ajax.post('/rennder/Dashboard/Photos/Remove', {files:files.join(',')}, R.ajax.callback.inject);
                }
            }
        },

        folders: {
            show: function (type) {
                R.ajax.post('/rennder/Dashboard/Photos/LoadFolders', {type:type != null ? type : ''}, R.ajax.callback.inject);
                $('.winPhotos .icon-folder use').attr('xlink:href', '#icon-grid');
                $('.winPhotos .icon-folder a').attr('onclick', 'R.editor.photos.folders.hide()');
                $('.winPhotos .photo-list, .winPhotos .info-bar, .winPhotos .dropzone, .winPhotos .upload').hide();
                $('.winPhotos .folder-list, .winPhotos .folder-add').show();
                R.editor.photos.buttons.hide();
            },

            hide: function () {
                $('.winPhotos .icon-folder use').attr('xlink:href', '#icon-folderfiles');
                $('.winPhotos .icon-folder a').attr('onclick', 'R.editor.photos.folders.show()');
                $('.winPhotos .folder-list, .winPhotos .folder-add, .winPhotos .folder-addbar, .winPhotos .top-menu .msg-movephotos').hide();
                $('.winPhotos .photo-list, .winPhotos .info-bar, .winPhotos .dropzone, .winPhotos .upload, .winPhotos .top-menu .folder, .winPhotos .folder-list .folder-column > .row').show();
                R.editor.photos.ismoving = false;
            },

            showAdd: function(){
                $('.winPhotos .folder-list').hide();
                $('.winPhotos .folder-addbar').show();
            },

            hideAdd: function(){
                $('.winPhotos .folder-addbar').hide();
                $('.winPhotos .folder-list').show();
            },

            add: function(){
                R.ajax.post('/rennder/Dashboard/Photos/AddFolder', {name:$('.winPhotos #txtNewFolder').val()}, R.ajax.callback.inject);
            },

            addCallback: function(name){
                if (R.editor.photos.ismoving == true) {
                    R.editor.photos.folders.hideAdd();
                } else {
                    $('.winPhotos .folder-info')[0].innerHTML = ''; R.editor.photos.folders.hide();
                    $('.winPhotos .photo-list')[0].innerHTML = '<div class=""no-photos font-faded"">No photos in this folder yet. Drag & Drop your photos here.</div>';
                    R.editor.photos.folders.change(name);
                }
            },

            bind: function () {
                $('.winPhotos .folder-list').off('click').on('click', '.item', function (e) {
                    var name = $(this)[0].firstChild.textContent;
                    if (name == '[All Photos]') { name = ''; }
                    if (name == '[Unorganized Photos]') { name = '!'; }
                    R.editor.photos.folders.select(name);

                }).on('click', '.icon-close a', function (e) {
                    if($(this).parents('.column-row.item')[0]){
                        R.editor.photos.folders.remove($(this).parents('.column-row.item')[0].firstChild.textContent);
                    } return false;
                }).parent('.icon-close').addClass('hover-only').css({ 'display': '' });

            },

            bindForMove: function () {
                $('.winPhotos .folder-list').off('click').on('click', '.item', function (e) {
                    R.editor.photos.folders.moveTo($(this)[0].firstChild.textContent);
                }).find('.icon-close').removeClass('hover-only').hide();
                $('.winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(1), .winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(2)').hide();
            },

            remove: function(name){
                if (confirm("Do you really want to delete the folder '" + name + "' and all the photos that belong within the folder? This cannot be undone.") == true) {
                    R.ajax.post('/rennder/Dashboard/Photos/RemoveFolder', { folder: name }, R.ajax.callback.inject);
                }
            },

            select: function(name){
                if ($(e.target).parents('.icon-close').length > 0) { return; }
                R.ajax.post('/rennder/Dashboard/Photos/LoadPhotoList', { start: "1", folder: name, search: '', orderby: '0' }, R.ajax.callback.inject);
            },

            change: function (name) {
                var n = name.toString();
                if (n == '') { n = 'All Photos'; }
                if (n == '!') { n = 'Unorganized Photos'; }
                $('.winPhotos .selected-folder')[0].innerHTML = 'Folder: ' + n;
                R.editor.photos.folder = name;
                R.editor.photos.folders.bind();
                R.editor.photos.dropzone.body.options.url = '/rennder/Dashboard/Photos/Upload?v=' + R.ajax.viewstateId + '&folder=' + encodeURIComponent(R.editor.photos.folder);
            },

            moveTo: function (name) {
                R.ajax.post('/rennder/Dashboard/Photos/MoveTo', { folder: name, files: R.editor.photos.selected.join(',') }, R.ajax.callback.inject);
            }
        },

        dropzone: {
            body: null,

            init: function () {
                R.editor.photos.dropzone.body = new Dropzone(document.body, {
                    url: '/rennder/Dashboard/Photos/Upload?v=' + R.ajax.viewstateId,
                    previewsContainer: ".winPhotos .dropzone",
                    clickable: ".winPhotos .top-menu .upload a",
                    paramName: 'file',
                    maxFilesize: 4,
                    uploadMultiple: true,
                    thumbnailWidth: 50,
                    thumbnailHeight: 40,
                    parallelUploads: 1
                    , init: function () {
                        this.on('drop', function () {
                            $('.winPhotos .dropzone').animate({ height: 60 }, 300);
                            if (R.editor.dashboard.visible == true) {
                                R.editor.window.open.photoLibrary('dashboard');
                            } else {
                                R.editor.window.open.photoLibrary();
                            }
                            
                        });

                        this.on('complete', function (file) {
                            this.removeFile(file);
                        });

                        this.on('successmultiple', function (f, data) {
                            var d = data.split(','), htm = '';
                            for (x = 1; x < d.length; x++) {
                                htm += '<div class="photo"><div class="check hover-only"><input type="checkbox" id="chkPhoto' + (R.editor.photos.info.start + R.editor.photos.info.len + x - 2) + '" /></div><div class="tbl-cell"><div class="img"><img src="' + d[0] + 'tiny' + d[x] + '"/></div></div></div>'
                            }
                            var list = $('.winPhotos .photo-list');
                            list.append(htm);
                            list.find('.no-photos').remove();
                            R.editor.photos.listInfo();
                            setTimeout(function () {
                                list.scrollTop(list.prop('scrollHeight') + 50);
                            }, 500);
                        });

                        this.on('queuecomplete', function () {
                            $('.winPhotos .dropzone').animate({ height: 0, minHeight: 0 }, 300);
                            var list = $('.winPhotos .photo-list');
                            R.editor.photos.listInfo();
                            setTimeout(function () {
                                list.scrollTop(list.prop('scrollHeight') + 50);
                            }, 1000);
                            R.ajax.post('/rennder/Dashboard/Photos/Save', { folder: R.editor.photos.folder }, R.ajax.callback.inject);
                        });
                    }
                });
            }
        },

        dialog:{
            exec: null, photos: [], type: '',

            init: function () {
                $('.winPhotos .photo-list').off('click', '.photo').on('click', '.photo', R.editor.photos.dialog.click);
                $('.winPhotos .photo-list .photo').css({ cursor: 'pointer' });
            },

            selectPhoto: function (serviceType, imageType, msg, callback) {
                //serviceType: null or 'photos', 'icons', 'webstorage' (dropbox, google drive, etc)
                //imageType: null or 'photo', 'icon', 'button', 'background', 'tile', 'person'
                R.editor.photos.show('select');
                $('.winPhotos .dialog-bar').show()[0].innerHTML = 'Please select a photo to use ' + msg + '&nbsp;&nbsp;<a href="javascript:" onclick="R.editor.photos.dialog.close()">Cancel</a>';
                R.editor.photos.dialog.exec = callback;
                R.editor.photos.dialog.type = 'select';
            },

            selectMultiple: function (serviceType, imageType, msg, callback) {
                //serviceType: null or 'photos', 'icons', 'webstorage' (dropbox, google drive, etc)
                //imageType: null or 'photo', 'icon', 'button', 'background', 'tile', 'person'
                R.editor.photos.show('multiple');
                $('.winPhotos .dialog-bar').show()[0].innerHTML = 'Please select one or more photos to use ' + msg +
                    '&nbsp;&nbsp;<a href="javascript:" onclick="R.editor.photos.dialog.close()">Done</a>'
                '&nbsp;&nbsp;&nbsp;<a href="javascript:" onclick="R.editor.photos.dialog.close()">Cancel</a>';
                R.editor.photos.dialog.exec = callback;
                R.editor.photos.dialog.type = 'multiple';
            },

            click: function (e) {
                if ($(e.target).parents('.check').length > 0 || $(e.target).hasClass('check')) { return; }
                var src = $(this).find('img')[0].getAttribute('src');
                
                if (src.indexOf('/') > -1) {
                    var path = src.split('/');
                    src = path[path.length - 1].replace('tiny','');
                }
                R.editor.photos.dialog.exec(src);
                if (R.editor.photos.dialog.type == 'select') {
                    R.editor.photos.dialog.close();
                }
            },

            close: function(){
                R.editor.photos.dialog.exec = null;
                R.editor.photos.dialog.photos = null;
                R.editor.photos.dialog.type = '';
                $('.winPhotos .photo-list').off('click', '.photo');
                $('.winPhotos .photo-list .photo').css({ cursor: 'default' });
                $('.winPhotos').hide();
            },

            callback:function(photos){
                var dialog = R.editor.photos.dialog;
                if(dialog.exec != null){
                    //execute callback
                }
            }

        },

        listInfo: function () {
            var end=0, total = $('.winPhotos .photo-list > .photo').length;
            if (arguments[0]) {
                end = arguments[0];
                R.editor.photos.info.len = total;
                R.editor.photos.info.total = end;
            } else {
                end = R.editor.photos.info.len + R.editor.photos.info.start - 1;
                if (total + R.editor.photos.info.start - 1 > end) {
                    R.editor.photos.info.len = total;
                    R.editor.photos.info.total += ((total + R.editor.photos.info.start - 1) - end);
                }
            }
            if (arguments[1]) { R.editor.photos.info.start = arguments[1]; }
            if (R.editor.photos.info.len > 0 && R.editor.photos.info.start == 0) { R.editor.photos.info.start = 1; }
            var a = R.editor.photos.info;
            $('.winPhotos .folder-info')[0].innerHTML = 'Viewing ' + a.start + ' to ' + a.len + ' of ' + a.total + ' photos';
        }
},

    save: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        cache: [],

        add: function (id, type, obj) {
            //return;//debug
            var i = -1;
            for (x = 0; x < this.cache.length; x++) {
                if (this.cache[x].id == id) {
                    i = x; break;
                }
            }
            if (i == -1) {
                i = this.cache.length;
            }
            this.cache[i] = { id: id, type: type, data: obj };
            $('.editor .toolbar .savepage').removeClass('nosave');
        },

        enable:function(){
            $('.editor .toolbar .savepage').removeClass('nosave');
        },

        click: function () {
            if ($('.editor .toolbar .savepage').hasClass('saving') == false && $('.editor .toolbar .savepage').hasClass('nosave') == false) {
                var options = {};
                options.save = JSON.stringify(R.editor.save.cache);
                R.editor.save.cache = [];
                $('.editor .toolbar .savepage').addClass('saving');
                R.ajax.post("/rennder/App/KeepAlive", options, function () { $('.editor .toolbar .savepage').removeClass('saving').addClass('nosave'); });
            }
        }
    },

    logout: function () {
        R.editor.hide();

        //unbind events
        delete document.onkeydown;
        R.events.doc.click.callback.remove($('.editor')[0]);
        $('.webpage').delegate('.component', 'mouseenter');
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
                if ($(c).hasClass('type-stackpanel') == true) { isPanel = true;}
            }

            if (e.shiftKey == true) {//shift pressed
                R.hotkeys.keyhold = 'shift';
                R.hotkeys.callback.execute('onKeyDown', k, 'shift');
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
                R.hotkeys.callback.execute('onKeyDown', k, 'ctrl');
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
                R.hotkeys.callback.execute('onKeyDown', k, '');
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
                        R.editor.viewport.view(0);
                        break;
                    case 50: //2
                        R.editor.viewport.view(1);
                        break;
                    case 51: //3
                        R.editor.viewport.view(2);
                        break;
                    case 52: //4
                        R.editor.viewport.view(3);
                        break;
                    case 53: //5
                        R.editor.viewport.view(4);
                        break;
                }
            }

            if (k >= 37 && k <= 40) { //arrow keys
                if($('.type-textbox .textedit.editing').length == 0){
                    return false;
                }
                
            }

        }
    },

    keyup: function (e) {
        var k = e.keyCode;
        R.hotkeys.keyhold = '';
        if (e.shiftKey == true) {//shift pressed
            R.hotkeys.callback.execute('onKeyUp', k, 'shift');

        } else if (e.ctrlKey == true) {
            R.hotkeys.callback.execute('onKeyUp', k, 'ctrl');

        } else {
            R.hotkeys.callback.execute('onKeyUp', k, '');
        }
    },

    callback: {
        //register & execute callbacks when the window resizes
    items: [],

    add: function (elem, vars, onKeyDown, onKeyUp) {
        this.items.push({ elem: elem, vars: vars, onKeyDown: onKeyDown, onKeyUp: onKeyUp });
    },

    remove: function (elem) {
        for (var x = 0; x < this.items.length; x++) {
            if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
        }
    },

    execute: function (type, key, keyHeld) {
        if (this.items.length > 0) {
            switch (type) {
                case '': case null: case 'onKeyDown':
                    for (var x = 0; x < this.items.length; x++) {
                        if (typeof this.items[x].onKeyDown == 'function') {
                            this.items[x].onKeyDown(key, keyHeld);
                        }
                    } break;

                case 'onKeyUp':
                    for (var x = 0; x < this.items.length; x++) {
                        if (typeof this.items[x].onKeyUp == 'function') {
                            this.items[x].onKeyUp(key, keyHeld);
                        }
                    } break;
            }
        }
    }
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

R.util.file = {
    extension: function (filename) {
        return filename.substr(filename.lastIndexOf('.') + 1);
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
$('.webpage').delegate('.component', 'mouseenter', R.editor.components.mouseEnter);
$('.webpage').delegate('.inner-panel', 'mouseenter', R.editor.components.mouseEnter);
$('.component-select').delegate('.resize-bar', 'mousedown', R.editor.components.resize.start);
$('.component-select').bind('mouseleave', R.editor.components.mouseLeave);
