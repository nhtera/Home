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











