﻿namespace Rennder.Components
{
    public class Login : Component
    {
        public Login(Core RennderCore) : base(RennderCore)
        {
            //LoadMenu();
        }

        public override string Render()
        {
            string loginHost = "";
            string loginQuery = "";
            //If InStr(myEvolver.pageUrl[0], "localhost") = 0 Then loginHost = "https://" & myEvolver.pageUrl[0].Replace("http://", "").Replace("https://", "").Replace("/", "")
            if (R.isLocal == false)
                loginHost = "https://rennder.com";
            if (R.Util.IsEmpty(R.Request.Query["resetpass"]) == false)
            {
                loginQuery += "&resetpass=" + R.Request.Query["resetpass"];
            }
            string htm = "<iframe id=\"loginframe" + itemId + "\" style=\"width:100%; height:100%; background-color:transparent;\"  frameborder=\"0\" scrolling=\"no\" src=\"" + loginHost + "/rennder/Login/Form?w=" + R.Page.Url.host + "&u=" + R.Page.ownerId + "&l=" + R.Page.layoutId + "&lu=" + R.Page.layoutOwner + "&s=" + DataField.Replace("|", ",") + "&d=" + DesignField.Replace("|", ",") + loginQuery;
            if (R.Page.isEditable == true)
            {
                htm += "&edit=1";
            }
            htm += "\"></iframe>";
            InnerHTML = htm;

            
            if (R.User.memberId == 0 | R.Page.isEditable == true)
            {
                string myJs = "";
                myJs += 
                    "R.components.cache['c" + itemId + "'].LoginFromIframe = function(id){" + 
                        "R.ajax.post('/services/components/rennder-login.asmx/Login',{'id':id, 'itemid':this.id}, this.LoginRedirect);" + 
                    "};" + 
                    "R.components.cache['c" + itemId + "'].LoginRedirect = function(data){" + 
                        "var c = R.components.cache['c" + itemId + "'];" + 
                        "if(data.d == ''){" + 
                            "$R('c'+c.id).innerHTML = '" + htm.Replace("'", "\\'") + "';" + "alert('incorrect email or password');}" + 
                        "else{" + 
                            "$R['c'+c.id].innerHTML = '<div style=\"padding-top:20px; width:100%; text-align:center;\">Login successful. Loading dashboard...</div>';" + 
                            "R.ajax.post('/services/core.asmx/Hash', { url: data.d }, R.hash.callback);" + 
                        "}" + 
                    "};";
                R.Page.RegisterJS("login" + itemId, myJs);
            }

            return base.Render();
        }
    }
}