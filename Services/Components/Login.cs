using System.Collections.Generic;

namespace Rennder.Services
{
	public class Login: Service
	{
        private string itemId = "login";
        private string host = "";
        private Dictionary<string, string> Elements;
        private string[] arrContent;
        private string[] arrDesign;
        private int websiteId;
        private string layoutFolder;
        private string websiteFolder;

    public Login(Core RennderCore, string[] paths):base(RennderCore, paths)
		{
		}

        private void SetupWebRequest()
        {
            host = R.Page.Url.host;

            //setup scaffolding variables
            Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] { "head", "action", "body", "foot", "script" });

            //get Website properties from Request.Query
            arrContent = R.Request.Query["s"].Split(',');
            arrDesign = R.Request.Query["d"].Split(',');
            if (arrDesign.Length <= 1) { arrDesign = new string[] { "", "", "", "", "", "", "", "", "", "", "", "false", "", "", "" }; }
            websiteId = int.Parse(R.Request.Query["w"]);
            layoutFolder = "/content/layouts/" + R.Request.Query["lu"] + "/" + R.Request.Query["l"] + "/";
            websiteFolder = "/content/websites/" + websiteId + "/";
            Elements["head"] = "<link rel=\"Stylesheet\" type=\"text/css\" href=\"/css/rennder.css\"/>" +
                               "<link rel=\"Stylesheet\" type=\"text/css\" href=\"" + layoutFolder + "style.css\"/>";

            //set form action
            Elements["action"] = "/rennder/Login/PostForm" + R.Request.QueryString;

            //set missing Page properties
            R.Page.layoutFolder = layoutFolder;
            R.Page.websiteId = websiteId;
            R.Page.LoadRmlEngine();

            //setup scaffold parameters
            Elements["script"] = "var isNotResponsive = true; var isNotKeepAlive = true; setTimeout(function(){R.selectors.get();R.responsive.resize.onLevelChange();},100);";

            if (R.isLocal == true)
            {
                Elements["foot"] = "<script type=\"text/javascript\" src=\"/scripts/utility/jquery-2.1.3.min.js\"></script>\n" +
                                   "<script type=\"text/javascript\" src=\"/scripts/core/global.js\"></script>\n" +
                                   "<script type=\"text/javascript\" src=\"/scripts/core/fixes.js\"></script>\n" +
                                   "<script type=\"text/javascript\" src=\"/scripts/core/rml.js\"></script>\n" +
                                   "<script type=\"text/javascript\" src=\"/scripts/core/view.js\"></script>\n" +
                                   "<script type=\"text/javascript\" src=\"/scripts/core/responsive.js\"></script>\n";
            }
            else
            {
                Elements["foot"] = "<script type=\"text/javascript\" src=\"/scripts/rennder.js?v=" + R.Version + "\"></script>\n";
            }
        }

        public WebRequest LoadForm()
        {
            WebRequest wr = new WebRequest();
            string htm = "";

            SetupWebRequest();

            //setup RML classes
            RmlTextbox designTextbox;
            RmlStackPanel designStack;
            RmlButton designButton;
            RmlLoading designLoading = default(RmlLoading);

            designTextbox = R.PageRml.GetRmlTextbox(arrDesign[0]);
            designStack = R.PageRml.GetRmlStackPanel(arrDesign[3]);

            //setup login form properties
            int designFieldsAlign = 1; //1=vertical, 2=horizontal
            int designLabelAlign = 1; //1=left, 2=top left, 3=top right
            int designButtonAlign = 1; //1=right, 2=bottom left, 3=bottom center, 4=bottom right, 5=hidden
            int designLabelPadding = 2; //top or bottom padding of label
            int designFieldPadding = 10; //vertical & horizontal padding between form items (textboxes & button)
            string designTextboxWidth = "200px";
            string designButtonWidth = "100px";
            string designButtonTitle = "Log In";
            int designButtonOffset = 2; //top offset position of button
            int designWidth = 0;
            int designHeight = 0;
            int designPadding = 0;

            //load login form settings
            if(arrContent.Length > 4)
            {
                if (R.Util.Str.IsNumeric(arrContent[0]) == true) { designFieldsAlign = int.Parse(arrContent[0]); }
                if (R.Util.Str.IsNumeric(arrContent[1]) == true) { designLabelAlign = int.Parse(arrContent[1]); }
                if (R.Util.Str.IsNumeric(arrContent[2]) == true) { designButtonAlign = int.Parse(arrContent[2]); }
                if (R.Util.Str.IsNumeric(arrContent[3]) == true) { designLabelPadding = int.Parse(arrContent[3]); }
                if (R.Util.Str.IsNumeric(arrContent[4]) == true) { designFieldPadding = int.Parse(arrContent[4]); }
            }
            if(arrContent.Length > 8)
            {
                if (!string.IsNullOrEmpty(arrContent[5])) { designTextboxWidth = arrContent[5]; }
                if (!string.IsNullOrEmpty(arrContent[6])) { designButtonWidth = arrContent[6]; }
                if (!string.IsNullOrEmpty(arrContent[7])) { designButtonTitle = arrContent[7]; }
                if (!string.IsNullOrEmpty(arrContent[8])) { designButtonOffset = int.Parse(arrContent[8]); }
            }
            if(arrContent.Length > 14)
            {
                if (R.Util.Str.IsNumeric(arrContent[12]) == true) { designWidth = int.Parse(arrContent[12]); }
                if (R.Util.Str.IsNumeric(arrContent[13]) == true) { designHeight = int.Parse(arrContent[13]); }
                if (R.Util.Str.IsNumeric(arrContent[14]) == true) { designPadding = int.Parse(arrContent[14]); }
            }

            //stack panel head
            if(designStack.rmlStackPanel.rmlComponent.Length > 0)
            {
                htm += designStack.rmlStackPanel.htmEvolverHead + designStack.rmlStackPanel.rmlComponent[0].htmHead;
            }

            //email label
            htm += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:100%;";
            if (designPadding >= 0)
            {
                //htm &= "padding:" & designPadding & "px;"
            }
            htm += "\"><tr>";
            htm += "<td style=\"vertical-align:top;\">";
            if (designLabelAlign != 4)
            {
                htm += "<div style=\"";
                if (designLabelAlign == 1)
                    htm += " float:left;";
                if (designLabelAlign > 1)
                    htm += " width:100%; padding-bottom:" + designLabelPadding + "px;";
                if (designLabelAlign == 1)
                    htm += " padding-right:" + designLabelPadding + "px;";
                if (designLabelAlign == 3)
                    htm += " text-align:right;";
                if (designFieldsAlign == 2)
                    htm += " padding-top:4px;";
                htm += "\">Email</div>";
            }
            //email textbox
            if (designFieldsAlign == 1 & designLabelAlign == 1)
                htm += "</td><td style=\"vertical-align:top;\">";
            htm += "<div style=\"";
            if (designLabelAlign > 1 & designFieldsAlign == 1)
                htm += "padding-top:" + designLabelPadding + "px;";
            if (designLabelAlign == 1 & designFieldsAlign == 1)
                htm += "padding-top:" + designFieldPadding + "px;";
            if (designLabelAlign == 1)
                htm += "float:left;";
            htm += "\">";

            string email = ""; //load email from cookie

            if (designLabelAlign == 4)
            {
                //add hidden textbox for inside labels
                htm += designTextbox.GetCompiledRml("email", "width:" + designTextboxWidth + ";", email, "text" , "Email");
            }
            else
            {
                htm += designTextbox.GetCompiledRml("email", "width:" + designTextboxWidth + ";", email);
            }

            htm += "</div></td>";
            //password label
            if (designFieldsAlign == 1)
                htm += "</tr><tr>";
            htm += "<td style=\"vertical-align:top;";
            if (designFieldsAlign == 2)
                htm += "padding-left:" + designFieldPadding + "px;";
            if (designFieldsAlign == 1)
                htm += "padding-top:" + designFieldPadding + "px;";
            htm += "\">";
            if (designLabelAlign != 4)
            {
                htm += "<div style=\"";
                if (designLabelAlign == 1) { htm += " float:left;"; }
                if (designLabelAlign > 1) { htm += " width:100%; padding-bottom:" + designLabelPadding + "px;"; }
                if (designLabelAlign == 1) { htm += " padding-right:" + designLabelPadding + "px;"; }
                if (designLabelAlign == 3) { htm += " text-align:right;"; }
                if (designFieldsAlign == 2) { htm += " padding-top:4px;"; }
                htm += "\">Password</div>";
            }
            //password textbox
            if (designFieldsAlign == 1 & designLabelAlign == 1) { htm += "</td><td style=\"vertical-align:top;\">"; }
            htm += "<div style=\"";
            if (designLabelAlign > 1 & designFieldsAlign == 1) { htm += "padding-top:" + designLabelPadding + "px;"; }
            if (designLabelAlign == 1 & designFieldsAlign == 1) { htm += "padding-top:" + designFieldPadding + "px;"; }
            if (designLabelAlign == 1) { htm += "float:left;"; }
            htm += "\">";

            if (designLabelAlign == 4)
            {
                //add hidden textbox for inside labels
                htm += designTextbox.GetCompiledRml("pass", "width:" + designTextboxWidth + ";", "", "password", "Password");
            }
            else
            {
                htm += designTextbox.GetCompiledRml("pass", "width:" + designTextboxWidth + ";", "", "password");
            }

            //forgot password link
            htm += "<div style=\"padding:7px;\"><a href=\"" + R.Request.Path + "&forgotpass\">forgot password?</a></div>";
            htm += "</div></td>";

            //submit button
            if (designButtonAlign < 5)
            {
                designButton = R.PageRml.GetRmlButton(arrDesign[1]);
                if(arrDesign.Length > 4)
                {
                    designLoading = R.PageRml.GetRmlLoading(arrDesign[4]);
                }
                if (designFieldsAlign == 1) { htm += "</tr><tr>"; }
                if (designFieldsAlign == 2 & designButtonAlign > 1) { htm += "</tr><tr>"; }
                htm += "<td style=\"vertical-align:top;";
                if (designFieldsAlign == 2 & designButtonAlign == 1) { htm += "padding-left:" + designFieldPadding + "px;"; }
                if (designFieldsAlign == 1) { htm += "padding-top:" + designFieldPadding + "px;"; }
                htm += "\"";
                if (designFieldsAlign == 1) { htm += " colspan=\"2\""; }
                if (designButtonAlign == 1) { htm += " valign=\"bottom\""; }
                htm += "><div style=\"";
                switch (designButtonAlign)
                {
                    //1=right, 2=bottom left, 3=bottom center, 4=bottom right, 5=hidden
                    case 1:
                    case 4:
                        if (designFieldsAlign == 1)
                        {
                            htm += " float:right;";
                        }
                        else
                        {
                            htm += "position:relative; top:" + designButtonOffset + "px;";
                        }
                        break;
                    case 3:
                        htm += " margin-left:auto; margin-right:auto;";
                        break;
                }
                htm += "\">";

                //add login button
                htm += designButton.GetCompiledRml(designButtonTitle, "javascript:$('form')[0].submit()", itemId + "btnLogin",false ,"" , "", "", false, designLoading.GetCompiledRml());
                htm += "</div></td>";
            }
            htm += "</tr></table>";

            //stack panel foot
            if(designStack.rmlStackPanel.rmlComponent.Length > 0)
            {
                htm += designStack.rmlStackPanel.rmlComponent[0].htmFoot + designStack.rmlStackPanel.htmEvolverFoot;
            }
            Elements["body"] = htm;

            //finally, scaffold login HTML
            wr.html = R.Server.RenderScaffold("/components/login/login.html", Elements);
            return wr;
        }

        public WebRequest PostForm()
        {
            //save form in SQL so parent window can authenticate
            WebRequest wr = new WebRequest();
            if(Form.ContainsKey("email") == false) { return wr; }
            if (Form.ContainsKey("pass") == false) { return wr; }
            SetupWebRequest();

            Utility.Encryption crypt = new Utility.Encryption(R);
            string email = Form["email"];
            string pass = Form["pass"];
            string salt = crypt.GetMD5Hash(email + "?" + pass);
            string loginid = R.Util.Str.CreateID();
            string host;
            if(R.isLocal == true)
            {
                host = "http://" + R.Page.Url.host;
            }else
            {
                host = "https://" + R.Page.Url.host;
            }
            //IHttpConnectionFeature ip = R.Context.GetFeature<IHttpConnectionFeature>();
            R.Page.SqlPage.SaveLoginForAuth(salt, email, loginid);
            Elements["script"] += "setTimeout(function(){parent.postMessage(\"login|" + loginid + "\",\"" + host + "\");},10);";

            //finally, scaffold login HTML
            Elements["body"] = "<div style=\"text-align:center; width:100%; padding-top:10px;\">Processing login...</div>";
            wr.html = R.Server.RenderScaffold("/components/login/login.html", Elements);
            return wr;
        }

        public string Authenticate(string authId)
        {
            //authenticate login info from parent window
            Inject result = new Inject();
            if (R.User.LogIn(authId) == true)
            {
                return "dashboard";
            }
            return "";
        }
	}
}