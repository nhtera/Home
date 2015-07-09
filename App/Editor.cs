﻿using System;
using System.Collections.Generic;

namespace Rennder
{
    public class Editor
    {
        private Core R;
        public Dictionary<string, string> Elements = new Dictionary<string, string>();

        public Editor(Core RennderCore)
        {
            R = RennderCore;
        }

        public string[] LoadEditor()
        {
            string htm = "";
            string js = "$('.svgicons').load('/images/editor/icons.svg');";

            //setup scaffolding variables
            Elements = R.Server.SetupScaffold(new string[] { "photo" });
            if(R.User.photo == "")
            {
                Elements["photo"] = "<img src=\"/images/editor/memberphoto.jpg\"/>";
            }
            else
            {
                Elements["photo"] = "<img src=\"/content/members/" + R.Util.Str.DateFolders(R.User.signupDate) + "/" + R.User.memberId + "/portrait/s_" + R.User.photo + "\"/>";
            }

            //load grid sides
            js += "(function(){var htm = '" +
                      "<div class=\"grid-leftside\"></div>" +
                      "<div class=\"grid-rightside\"></div>';" +
                      "$('.webpage').prepend(htm);" +
                      "})();";

            if (R.isFirstLoad == true)
            {//first load
                R.App.Elements["editor-css"] = 
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/rennder-edit.css?v=" + R.Version + "\"/>" +
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/colors/" + R.User.editorColor + ".css?v=" + R.Version + "\"/>";
            }
            else
            {//web service
                js += "$('head').append('<link rel=\"stylesheet\" href=\"/css/rennder-edit.css?v=" + R.Version + "\" type=\"text/css\" />');" +
                      "$('head').append('<link rel=\"stylesheet\" href=\"/css/colors/" + R.User.editorColor + ".css?v=" + R.Version + "\" type=\"text/css\" />');";

                if (R.isLocal == true)
                {
                    Random rnd = new Random();
                    int ran = rnd.Next(1, 9999);
                    js += "$.when(" + "$.getScript('/scripts/core/editor.js?v=" + ran + "')," + 
                        "$.getScript('/scripts/rangy/rangy-compiled.js?v=" + ran + "')," + 
                        "$.getScript('/scripts/utility/dropzone.js?v=" + ran + "')," + 
                        "$.Deferred(function(deferred){$(deferred.resolve);})" + 
                        ").done(function(){ R.editor.load(); });";
                }else
                {
                    js += "$.getScript('/scripts/editor.js?v=" + R.Version + "', function(){R.editor.load();});";
                }
                
            }

            //finally, scaffold Editor HTML
            htm = R.Server.RenderScaffold("/app/editor.html", Elements);

            R.Page.isEditorLoaded = true;

            return new string[] { htm, js };
        }
    }
}
