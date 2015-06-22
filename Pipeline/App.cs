using System.Collections.Generic;
using Microsoft.AspNet.Http;
using System.Data.SqlClient;

namespace Rennder.Pipeline
{
    public class App
    {
        private Core R;
        public Dictionary<string, string> Elements = new Dictionary<string, string>();

        public App(Server server, HttpContext context)
        {
            //the Pipeline.App is simply the first page request for a Rennder website. 
            //Scaffold the HTML, load the Rennder Core, then load a web page.

            R = new Core(server, context, "", "app");
            R.App = this;
            R.isFirstLoad = true;

            //setup scaffolding variables
            Elements = R.Server.SetupScaffold(new string[]
            { "title", "description", "facebook", "layout-css", "website-css", "editor-css", "head-css", "favicon", "font-faces", "body-class", "custom-class",
              "background", "editor","webpage-class", "body-sides","body", "scripts", "https-url", "http-url"});

            //default favicon
            Elements["favicon"] = "/images/favicon.gif";

            //check for web bots such as gogle bot
            string agent = context.Request.Headers["User-Agent"].ToLower();
            if (agent.Contains("bot") | agent.Contains("crawl") | agent.Contains("spider"))
            {
                R.Page.useAJAX = false;
                R.Page.isBot = true;
            }

            //check for mobile agent
            if (agent.Contains("mobile") | agent.Contains("blackberry") | agent.Contains("android") | agent.Contains("symbian") | agent.Contains("windows ce") | 
                agent.Contains("fennec") | agent.Contains("phone") | agent.Contains("iemobile") | agent.Contains("iris") | agent.Contains("midp") | agent.Contains("minimo") | 
                agent.Contains("kindle") | agent.Contains("opera mini") | agent.Contains("opera mobi") | agent.Contains("ericsson") | agent.Contains("iphone") | agent.Contains("ipad"))
            {
                R.Page.isMobile = true;
            }

            //get browser type
            Elements["body-class"] = GetBrowserType();

            //parse URL
            R.Page.GetPageUrl();
            if(R.isLocal == true)
            {
                Elements["https-url"] = R.Page.Url.host.Substring(0, R.Page.Url.host.Length - 2);
            }

            //get page Info
            SqlDataReader reader = R.Page.GetPageInfoFromUrlPath();
            if(reader.HasRows == true)
            {
                //load initial web page
                R.Page.LoadPageInfo(reader);

                if(R.Page.pageId > 0)
                {
                    string js = "";

                    //load page
                    //R.Page.LoadPage();

                    //load website.css
                    Elements["website-css"] = "/content/websites/" + R.Page.websiteId + "/website.css?v=" + R.Version;

                    //load iframe resize code, so if a Rennder web page is loaded within an iframe, it can communicate
                    //with the parent web page whenever the iframe resizes.
                    if (R.Request.Query[ "ifr"] == "1")
                    {
                        js += "var frameSize = 0;" + "function checkResize(){" + "var wurl = \"" + R.Request.Query["w"] + "\";" + "if(frameHeight != frameSize){" + "parent.postMessage(\"resize|\"+(frameHeight),wurl);" + "}" + "frameSize = frameHeight;" + "setTimeout(\"checkResize();\",1000);" + "}" + "checkResize();";
                        R.Page.isEditable = false;
                    }

                    if (R.Page.isEditable == true)
                    {

                    }
                    //display Page Editor


                    //register javascript, if any
                    if(js != "")
                    {
                        R.Page.RegisterJS("app", js);
                    }

                    //render page
                    Elements["body"] = R.Page.Render();
                }
            }

            //finally, scaffold Rennder platform HTML
            R.Response.ContentType = "text/html";
            R.Response.WriteAsync(R.Server.RenderScaffold("/pipeline/app.html", Elements));

            //unload the core
            R.Unload();
        }

        private string GetBrowserType()
        {
            string browser = R.Request.Headers["User-Agent"].ToLower();
            int major = 11;
            int minor = 0;
            string browserType = "";
            if (browser.IndexOf("chrome") >= 0)
            {
                if (major > 10)
                {
                    browserType = "chrome";
                }
                else
                {
                    browserType = "legacy-chrome";
                }
            }
            else if (browser.IndexOf("firefox") >= 0)
            {
                if (major == 3 & minor >= 6)
                {
                    browserType = "firefox";
                }
                else if (major > 3)
                {
                    browserType = "firefox";
                }
                else
                {
                    browserType = "legacy-firefox";
                }
            }
            else if (browser.IndexOf("safari") >= 0)
            {
                if (browser.IndexOf("iphone") >= 0)
                {
                    browserType = "iphone";
                }
                else if (browser.IndexOf("ipad") >= 0)
                {
                    browserType = "ipad";
                }
                else if (major <= 4)
                {
                    browserType = "legacy-safari";
                }
                browserType = "safari";
            }
            return browserType;
        }
    }
}
