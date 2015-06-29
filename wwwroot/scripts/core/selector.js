//Rennder Javascript Framework (to replace jQuery)

var rennder = function(){
    var elems = [];
    
    return function (sel) {
        this.selector = sel;
        console.log(self);
        var self = this;

        this.getElemType = function (val) {
            if (val.substr(0, 1) == '#') {
                //find element by ID
                return 0;
            } else if (val.substr(0, 1) == '.') {
                //find elements by class name
                return 1;
            } else {
                //find elements by tag name
                return 2;
            }
        }

        this.getElems = function (elem, val) {
            var t = this.getElemType(val);
            switch (t) {
                case 0: //id
                    return document.getElementById(val.replace('#', '')) || [];
                case 1: //class name
                    return elem.getElementsByClassName(val) || [];
                case 2: //tag name
                    return elem.getElementsByTagName(val) || [];
            }
        }


        //get array of elements based on selector
        if (sel != null) {
            //first, sort out the selector into an array matrix
            if (sel.indexOf('#') > 0) { sel = sel.substr(sel.indexOf('#')); } //remove anything before the ID selector
            var selarr = sel.split(' '), i = -1, i2 = 0, selitem, s, e;
            do {
                i++;
                if (getElemType(selarr[i]) == 1) {
                    //combine class names together
                    i2 = i; selitem = selarr[i];
                    do {
                        i2 += 1;
                        if (getElemType(selarr[i2]) == 1) {
                            selitem += ' ' + selarr[i2];
                        }

                    } while (i2 < selarr.length - 2);
                    selarr.splice(i + 1, i2 - (i));
                    selarr[i] = selitem;
                }
            } while (i < selarr.length - 2);
            console.log(selarr);

            //next, get all elements in the DOM that match the selector array matrix
            for (i = 0; i < selarr.length; i++) {
                s = selarr[i]; e = [];
                if (typeof s == 'string') {
                    if (elems.length == 0) {
                        elems = getElems(document.documentElement, s);
                    } else {
                        for (el in elems) {
                            e.push(getElems(document.documentElement, s));
                        }
                    }
                } else if (typeof s == 'object') {

                }

            }
            this.length = selarr.length;
        } else {
            this.elems.length = 0;
            this.length = 0;
        }
        return elems;
    }

    elems.css = function (params) {
        console.log('css!');
        return this;
    }
}


var $ = new rennder();