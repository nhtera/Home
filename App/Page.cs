﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Xml;
using Newtonsoft.Json;

namespace Rennder
{
    public class Page
    {
        #region "Properties"
        [JsonIgnore]
        private Core R;

        //Global Variables
        public bool useAJAX = true;
        public bool isEditable = false;
        public bool isEditorLoaded = false;
        public bool isDemo = false;
        public bool isTemplate = false;
        public bool isBot = false;
        public bool isMobile = false;
        public bool is404 = false;
        public string pageFolder = ""; //the page folder to use, either page or template folder
        public string workFolder = "";
        public int pageId = 0;
        public int demoId = 0;
        public int pageParentId = 0;
        public int pageType = 1; //1 = page, 2 = layer
        public string pageTitle = "";
        public string PageTitleForHash = "";
        public string PageTitleForBrowserTab = "";
        public string parentTitle = "";
        public string pageKeywords = "";
        public string pageDescription = "";
        public string pageFavIcon = "";
        public DateTime pageCreated;
        public int pageSecurity = 0;
        public int pageUsersOnly = 0;
        public string pageVersion = ""; //either empty or an A/B Test ID
        public bool pageLoaded = false;
        public string pageBackground = "";
        public string pageFacebook = "";
        public int websiteId = 0;
        public string websiteTitle = "";
        public int websiteType = 0;
        public bool websiteTrial = false;
        public int websitePageAccessDenied = 0;
        public int websitePage404 = 0;
        public bool accessDenied = false;
        public int ownerId = 0;
        public int themeId = 0;
        public int themeOwner = 0;
        public string themeName = "";
        public string themeFolder = "";
        public string prevThemeFolder = "";
        public string googleWebPropertyId = "";


        //Javascript
        [JsonIgnore]
        protected string[] postJSnames = new string[] { }; //used so duplicate JS doesn't get added to the page
        [JsonIgnore]
        public string[] postJScode = new string[] { }; //array of javascript to add
        public string[] postJSonce = new string[] { }; //used so duplicate JS that loads only once doesn't get added to the page
        [JsonIgnore]
        public string postJS = ""; //used to compile javascript for postback response
        [JsonIgnore]
        public string postJSLast = ""; //added to the end of postJS

        //CSS
        [JsonIgnore]
        public string[] postCSS = new string[] { }; //array of CSS to add
        [JsonIgnore]
        protected string[] postCSSnames = new string[] { }; //used so duplicate CSS doesn't get added to the page

        //Validation
        [JsonIgnore]
        private bool pageCssChanged = false;
        [JsonIgnore]
        private bool isPageLoaded = false;

        //HTML
        [JsonIgnore]
        private string themeHtml = ""; //generated HTML for the theme

        //Page Title
        [JsonIgnore]
        private string pageEditorTitle = ""; //beginning of title (in edit-mode)
        [JsonIgnore]
        private string pageEditorTitleEnd = " - Rennder Page Editor"; //end of title (in edit-mode)

        //Request Url Info
        public struct structUrl
        {
            public string path;
            public string host;
            public string hash;
            public string pathAndHash;
        }
        public structUrl Url;

        //Page Elements
        [JsonIgnore]
        private List<Panel> bodyPanels;
        [JsonIgnore]
        private List<Component> Components = new List<Component>();
        public List<Layer> Layers;
        public List<ComponentView> ComponentViews;
        public List<PanelView> PanelViews;

        //Web Services
        [JsonIgnore]
        public PageRequest PageRequest;

        //SQL
        [JsonIgnore]
        public SqlClasses.Page SqlPage;

        //initialize class
        public Page()
        {
        }

        public void Load(Core RennderCore)
        {
            R = RennderCore;
            SqlPage = (SqlClasses.Page)R.Sql.Class["Page"];
        }
        #endregion

        #region "Web Page"

        public void GetPageUrl(string urlhash = "")
        {
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Get Page Url & Build Hash
            //Url: 0=domain name (with protocol), 1=web page title, 2=web page title (with "-" & "/"), 3=url folder structure, 4=raw hash (without #)
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            Url.hash = "";
            string path = R.Request.Path.ToString().ToLower().Replace(" ", "+");
            string[] arr = null;

            if(path != "")
            {
                arr = path.Split(new char[] { '/' });
                Url.path = arr[0].Replace("-", " ");
                if(arr.Length > 1)
                {
                    Url.pathAndHash = path;
                }
            }else
            {
                Url.path = "home";
            }

            Url.host = R.Request.Host.ToString();
            int start = 0;
            start = Url.host.IndexOf("//");
            if (start >= 0)
            {
                start = Url.host.IndexOf('/', start + 3);
                if (start >= 0)
                {
                    Url.host = Url.host.Substring(0, start);
                }
            }
            if (Url.host.Substring(Url.host.Length - 1, 1) != "/")
            {
                //Url.host += "/";
            }

            //get hash
            if (!string.IsNullOrEmpty(Url.pathAndHash))
            {
                if (Url.pathAndHash.IndexOf("/") >= 0)
                {
                    Url.hash = Url.pathAndHash.Split(new char[] { '/' }, 2)[1];
                }
            }

            if(urlhash != "")
            {
                Url.hash = urlhash;
            }
        }

        public void GetPageId(bool skipDomain = false)
        {
            string domain = R.Util.Str.GetDomainName(R.Request.Host.ToString());
            string pid = R.Request.Query["pageid"];
            if (!String.IsNullOrEmpty(pid))
            {
                pageId = int.Parse(R.Request.Query["pageid"].ToString());
                return;
            }
            if(skipDomain == false)
            {
                pageId = GetPageIdByDomainName(Url.host, Url.path);
            }
        }

        public int GetPageIdByDomainName(string domainName, string pagetitle = "")
        {
            //try to get the sub domain name
            {
                string Domain = "";
                string subDomain = "";
                string[] domains = R.Util.Str.GetDomainParts(domainName);
                Domain = domains[1];
                subDomain = domains[0];
                if (string.IsNullOrEmpty(Domain)) {Domain = domainName; }
                object pid;
                

                //try to get pageId based on domain name
                if (!string.IsNullOrEmpty(pagetitle))
                {
                    if (pagetitle == "rennder")
                    {
                        //get pageid from web site home page
                        pid = SqlPage.GetHomePageIdFromDomain(Domain);
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(subDomain))
                        {
                            //get pageid from web site domain name & page title
                            pid = SqlPage.GetPageIdFromDomainAndTitle(Domain, pagetitle);
                        }
                        else
                        {
                            //get pageid from web site domain & sub domain & page title
                            pid = SqlPage.GetPageIdFromSubDomainAndTitle(Domain, subDomain, pagetitle);
                        }
                    }

                }
                else
                {
                    if (string.IsNullOrEmpty(subDomain))
                    {
                        //get pageid from web site home page
                        pid = SqlPage.GetHomePageIdFromDomain(Domain);
                    }
                    else
                    {
                        //get pageid from web site sub domain home page
                        pid = SqlPage.GetHomePageIdFromSubDomain(Domain, subDomain);

                    }
                }
                if (R.Util.IsEmpty(pid) == false && R.Util.Str.IsNumeric(pid))
                {
                    return (int)pid;
                }else {
                    return 0;
                }
            }
        }

        public SqlReader GetPageInfoByDomainName(string domainName, string pagetitle = "")
        {
            //try to get the sub domain name
            {
                string Domain = "";
                string subDomain = "";
                string[] domains = R.Util.Str.GetDomainParts(domainName);
                Domain = domains[1];
                subDomain = domains[0];
                if (string.IsNullOrEmpty(Domain)) { Domain = domainName; }

                //try to get pageId based on domain name
                if (!string.IsNullOrEmpty(pagetitle))
                {
                    if (pagetitle == "rennder")
                    {
                        //get pageid from web site home page
                        return SqlPage.GetPageInfoFromDomain(Domain);
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(subDomain))
                        {
                            //get pageid from web site domain name & page title
                            return SqlPage.GetPageInfoFromDomainAndTitle(Domain, pagetitle);
                        }
                        else
                        {
                            //get pageid from web site domain & sub domain & page title
                            return SqlPage.GetPageInfoFromSubDomainAndTitle(Domain, subDomain, pagetitle);
                        }
                    }

                }
                else
                {
                    if (string.IsNullOrEmpty(subDomain))
                    {
                        //get pageid from web site home page
                        return SqlPage.GetPageInfoFromDomain(Domain);
                    }
                    else
                    {
                        //get pageid from web site sub domain home page
                        return SqlPage.GetPageInfoFromSubDomain(Domain, subDomain);
                    }
                }
            }
        }

        public SqlReader GetPageInfoByPageId()
        {
            return SqlPage.GetPageInfoFromPageId(pageId);
        }

        public SqlReader GetPageInfoFromUrlPath()
        {
            GetPageId(true);
            if(pageId == 0)
            {
                //get page Id AND page Info in one query
                return GetPageInfoByDomainName(Url.host, Url.path);

            }else
            {
                //get page Info from pageId
                return GetPageInfoByPageId();
            };
        }

        public void LoadPageInfo(int pId)
        {
            if(pId <= 0) { return; }
            LoadPageInfo(SqlPage.GetPageInfoFromPageId(pId));
        }

        public void LoadPageInfo(SqlReader reader)
        {
            int oldThemeId = themeId;

            if (reader.Rows.Count > 0)
            {
                reader.Read();
                pageId = reader.GetInt("pageId");
                ownerId = reader.GetInt("ownerId");
                pageSecurity = reader.GetInt("security");
                pageUsersOnly = reader.GetInt("usersonly");
                pageTitle = reader.Get("title");
                pageCreated = reader.GetDateTime("datecreated");
                themeId = reader.GetInt("themeid");
                themeOwner = reader.GetInt("themeowner");
                themeName = reader.Get("themename");
                websiteId = reader.GetInt("websiteid");
                websiteTitle = reader.Get("websitetitle");
                websiteType = reader.GetInt("websitetype");
                if (websiteType < 0) { websiteType = 1; }

                websitePageAccessDenied = reader.GetInt("pagedenied");
                websitePage404 = reader.GetInt("page404");
                pageDescription = R.Sql.Decode(reader.Get("description"));
                //websiteTrial = reader.GetBool("statustype");
                googleWebPropertyId = reader.Get("googlewebpropertyid");
                //LoadBackground(reader.Get("pagebackground"])); //page
                //else LoadBackground(reader.Get("background"])); //website
                pageParentId = reader.GetInt("parentid");
                if (pageParentId < 0) { pageParentId = 0; }
                parentTitle = reader.Get("parenttitle");

                string pageCss = "";
                //get CSS for whole web site
                if (isPageLoaded == false | pageCssChanged == true)
                {
                    pageCss = reader.Get("websitecss");
                }
                pageCss = reader.Get("css");

                string favIcon = reader.Get("icon");
                if (R.isWebService == true)
                {
                    if (favIcon != pageFavIcon)
                    {
                        //change favicon via JS
                    }
                }
                else
                {
                    pageFavIcon = favIcon;
                }

                pageFacebook = "";
                if (reader.Get("photo") != "")
                {
                    pageFacebook = "<meta id=\"metafbimg\" property=\"og:image\" content=\"" + Url.host + reader.Get("photo") + "\" />";
                }
                pageFacebook += "<meta id=\"metafbtitle\" property=\"og:title\" content=\"" + R.Util.Str.GetPageTitle(pageTitle) + "\" />" +
                                "<meta id=\"metafbsite\" property=\"og:site_name\" content=\"" + R.Util.Str.GetWebsiteTitle(pageTitle) + "\" />";
            }

            if (pageId <= 0)
            {
                //no page loaded, show 404
                LoadPage("404");
            }

            if (reader.Rows.Count > 0)
            {
                //finished loading page information, so check for security & core changes made from info
                if (demoId > 0)
                {
                    if (demoId == pageId && R.Request.QueryString.ToString().IndexOf("?demo") >= 0)
                    {
                        isDemo = true;
                        R.User.viewerId = ownerId;
                        isEditable = true;
                    }
                    else
                    {
                        demoId = 0;
                        isEditable = false;
                    }

                }
                else if (R.Request.QueryString.ToString().IndexOf("?demo") >= 0)
                {
                    //no demo was launched from RennderScript, 
                    //so check to see if this website is a template website 
                    //(which supports demo of any public page)
                    if (websiteType == 2)
                    {
                        isDemo = true;
                        R.User.viewerId = ownerId;
                        isEditable = true;
                        isTemplate = true;
                    }
                    else
                    {
                        demoId = 0;
                        isEditable = false;
                    }
                }

                if (isDemo == true)
                {
                    //load demo tutorial
                }
                else
                {
                    if (R.User.userId > 0)
                    {
                        //user is logged in, check security for page editing
                        R.User.viewerId = R.User.userId;
                        if (R.User.Website(websiteId).getWebsiteSecurityItem("dashboard/pages", 4))
                        {
                            isEditable = true;
                        }
                    }
                }

                //don't let bot / crawler edit page
                if (isBot == true) { isEditable = false; }


                if (!string.IsNullOrEmpty(R.Request.Query["a"]) & R.User.viewerId < 1)
                {
                    //authenticate login for taking a screenshot
                    if (R.Page.SqlPage.AuthLoginForScreenshot(R.Request.Query["a"], websiteId, (R.Request.Query["ak"] == "0" ? 0 : 1)) == "pass")
                    {
                        R.User.viewerId = ownerId;
                        R.User.userId = ownerId;
                        RegisterJS("authjs2", "var evscreenshot = 1;");
                    }
                }

                if (pageSecurity == 1 && (ownerId != R.User.viewerId || isDemo == true))
                {
                    //don't allow anyone but the website owner to view this page

                }

                if (isEditable == true || isDemo == true)
                {
                    PageTitleForBrowserTab = pageEditorTitle + websiteTitle + pageEditorTitleEnd;
                }

                if (themeFolder == "")
                {
                    //load website theme from request query string
                    if (!string.IsNullOrEmpty(R.Request.Query["lid"]))
                    {
                        //LoadThemeIdFromQuery();
                    }
                    themeFolder = "/content/themes/" + themeName + "/";
                    if (R.isFirstLoad == true)
                    {
                        LoadTheme();
                    }
                }
                else
                {
                    if (oldThemeId != themeId && R.isFirstLoad == false)
                    {
                        themeFolder = "/content/themes/" + themeName + "/";
                    }
                }

                //setup page folder
                if (pageType == 1)
                {
                    pageFolder = "/content/websites/" + websiteId + "/pages/" + pageId + "/";
                }
                else
                {
                    pageFolder = "/content/websites/" + websiteId + "/layers/" + pageId + "/";
                }

                //setup work folder
                workFolder = pageFolder;

            }
        }

        public void LoadTheme()
        {
            //load website theme into Rennder
            if (themeFolder == prevThemeFolder) { return; }
            prevThemeFolder = themeFolder;

            R.Elements = new Elements(R, themeFolder);

            if (R.isFirstLoad == true)
            {
                //load CSS for theme
                R.App.scaffold.Data["theme-css"] = themeFolder + "style.css?v=" + R.Version;
            }
            else
            {
                //load CSS via javascript instead
                RegisterJS("cssfile", "$('#themeCss').href = '" + themeFolder + "style.css?v=" + R.Version + "';");
            }

            int[] start = new int[3];
            string fileHtml = null;
            string fileWebsite = "";
            string headWebsite = "";
            string footWebsite = "";
            string urlDefaultHtm = R.Server.path(themeFolder + "theme.html");
            string urlWebsiteHtm = R.Server.path("/content/websites/" + websiteId + "/website.html");

            //get theme HTML
            if (R.Server.Cache.ContainsKey(themeFolder + "theme.html") == true)
            {
                fileHtml = R.Server.Cache[themeFolder + "theme.html"].ToString();
            }
            else
            {
                fileHtml = File.ReadAllText(urlDefaultHtm);
                R.Server.Cache[themeFolder + "theme.html"] = fileHtml;
            }

            //get website HTML
            if (R.Server.Cache.ContainsKey("/content/websites/" + websiteId + "/website.html") == true)
            {
                fileWebsite = R.Server.Cache["/content/websites/" + websiteId + "/website.html"].ToString();
            }
            else
            {
                if (File.Exists(urlWebsiteHtm) == true)
                {
                    fileWebsite = File.ReadAllText(urlWebsiteHtm);
                }
                R.Server.Cache["/content/websites/" + websiteId + "/website.html"] = fileWebsite;
            }
            if (!string.IsNullOrEmpty(fileWebsite))
            {
                start[0] = fileWebsite.IndexOf("{{body}}");
                if (start[0] >= 0)
                {
                    headWebsite = fileWebsite.Substring(0, start[0]);
                    footWebsite = fileWebsite.Substring(start[0] + 8);
                }
                fileHtml = headWebsite + fileHtml + footWebsite;
            }

            int i = -1;
            List<string> themeHtm = new List<string>();
            start[2] = 0;
            do
            {
                start[0] = fileHtml.IndexOf("{{", start[2]);
                if (start[0] >= 0)
                {
                    //found a panel
                    start[1] = fileHtml.IndexOf("}}", start[0] + 2);
                    if (start[1] >= 0)
                    {
                        i += 1;

                        //add chunck of theme html to the page
                        string htm = "";
                        htm = fileHtml.Substring(start[2], start[0] - start[2]);
                        start[2] = start[1] + 2;

                        //create new panel
                        Panel newPanel = new Panel(R);

                        string name = fileHtml.Substring(start[0] + 2, start[1] - (start[0] + 2));
                        newPanel.Name = name;
                        newPanel.ID = "panel" + newPanel.Name.Replace(" ", "");

                        //add attributes to the panel
                        newPanel.isPartOfTheme = true;

                        if (newPanel.Name.ToLower() == "body")
                        {
                            //create loading body div
                            htm += "<div class=\"absolute\" style=\"width:100%;\"><div class=\"relative\" id=\"divPageLoad\" style=\"width:100%;\"><div class=\"div-max-width\" style=\"width:250px; margin:0px auto; padding:100px 0px;\">";
                            htm += "Loading content...";
                            htm += "<div style=\"clear:both;\"></div></div></div></div>";
                        }

                        htm += "{{panel-" + newPanel.Name.ToLower().Replace(" ", "") + "}}";

                        themeHtm.Add(htm);

                        //add panel to list
                        AddPanel(newPanel);
                    }
                    else
                    {
                        break;
                    }
                }
                else
                {
                    break;
                }
            } while (true);

            themeHtm.Add(fileHtml.Substring(start[2]));
            themeHtml = String.Join("", themeHtm.ToArray());
        }

        public XmlDocument LoadPageXml(int pid, string pFolder, XmlDocument pageLoadedXml = null)
        {
            if (pid <= 0) { return null; }
            XmlDocument myXmlPage = new XmlDocument();
            string pageName = "page";
            if (!string.IsNullOrEmpty(pageVersion))
                pageName = "page_" + pageVersion;
            string pageFilePath = pFolder + pageName + ".xml";

            if ((pageLoadedXml == null) == false)
            {
                myXmlPage = pageLoadedXml;
            }
            else
            {
                if (File.Exists(R.Server.path(pageFilePath)) == false & File.Exists(R.Server.path(pFolder + "page.xml")) == true)
                {
                    File.Copy(R.Server.path(pFolder + "page.xml"), R.Server.path(pageFilePath));
                }


                if (ownerId == R.User.userId | R.User.Website(websiteId).getWebsiteSecurityItem("dashboard/pages", 4) == true)
                {
                    //attempt to load the unpublished version of this page
                    if (R.Server.Cache.ContainsKey(pFolder + pageName + "_edit.xml"))
                    {
                        //load from memory
                        myXmlPage =(XmlDocument)R.Server.Cache[pFolder + pageName + "_edit.xml"];
                    }
                    else
                    {
                        if (File.Exists(R.Server.path(pFolder + pageName + "_edit.xml")) == true)
                        {
                            //load from disc
                            myXmlPage.LoadXml(File.ReadAllText(R.Server.path(pFolder + pageName + "_edit.xml")));
                            R.Server.Cache[pFolder + pageName + "_edit.xml"] = myXmlPage;
                        }
                        else
                        {
                            if (R.Server.Cache.ContainsKey(pageFilePath))
                            {
                                //load from memory
                                myXmlPage =(XmlDocument)R.Server.Cache[pageFilePath];
                            }
                            else
                            {
                                //load from disc
                                if (File.Exists(R.Server.path(pageFilePath)) == true)
                                {
                                    myXmlPage.LoadXml(File.ReadAllText(R.Server.path(pageFilePath)));
                                    R.Server.Cache[pageFilePath] = myXmlPage;
                                }

                            }
                        }
                    }
                }
                else
                {
                    if (R.Server.Cache.ContainsKey(pageFilePath))
                    {
                        //load from memory
                        myXmlPage = (XmlDocument)R.Server.Cache[pageFilePath];
                    }
                    else
                    {
                        //load from disc
                        if (File.Exists(R.Server.path(pageFilePath)) == false)
                        {
                            //create new page
                            myXmlPage.LoadXml("<theme></theme>");
                            FileStream fs = new FileStream(R.Server.path(pageFilePath), FileMode.CreateNew);
                            myXmlPage.Save(fs);
                        }
                        else
                        {
                            myXmlPage.LoadXml(File.ReadAllText(R.Server.path(pageFilePath)));
                        }

                        R.Server.Cache[pageFilePath] = myXmlPage;
                    }
                }
            }
            return myXmlPage;
        }

        public void LoadPage(string pageFile, int ptype, int pid, string pname, bool saveInterface = true, bool noloadLayers = false, bool keepPreviousPageLoaded = false, XmlDocument pageLoadedXml = null)
        {
            string myJs = "";

            if (pid <= 0) { return; }
            if (string.IsNullOrEmpty(pname)) { return; }

            if (pageUsersOnly == 1 & R.User.userId > 1 & ptype == 1)
            {
                //check to see if this user is a user of the web site
                if (R.User.Website(websiteId).getWebsiteSecurityItem("dashboard/pages", 4) == false)
                {
                    //user doesn't have permission
                    LoadPage("Access Denied");
                    return;
                }
            }
            else if (pageUsersOnly == 1 & ptype == 1)
            {
                //user not logged in
                LoadPage("Access Denied");
                return;
            }
            
            if (ptype == 2)
            {
                if (!string.IsNullOrEmpty(R.Request.Query["noload"]))
                {
                    string[] nl = R.Request.Query["noload"].ToLower().Split('\"');
                    for (int x = 0; x <= nl.Length - 1; x++)
                    {
                        //don't load this content layer, since the querystring says not to
                        if (nl[x] == pname.ToLower())
                            return;
                    }
                }
            }

            //check to see if page is already loaded
            if ((Layers == null) == false)
            {
                for (var x = 0; x <= Layers.Count - 1; x++)
                {
                    if (Layers[x].Id == pid)
                    {
                        return; //page already loaded
                    }
                }
            }

            if (ptype == 1 & R.isWebService == true)
            {
                //setup page request for web service
                PageRequest = new PageRequest();
            }


            //////////////////////////////////////////////////////
            //update  page settings
            string pFolder = pageFile.Replace("page.xml", "");
            if (ptype == 1)
            {
                string pt = R.Util.Str.GetPageTitle(pageTitle).Replace("-", " ");
                string wt = R.Util.Str.GetWebsiteTitle(pageTitle);
                pageId = pid;
                pageFolder = pFolder;
                pageTitle = wt + " - " + pt;
                Url.path = pt.Trim().ToLower();
                myJs += "R.page.title = \"" + pt.ToLower() + "\"; R.page.id=" + pageId + ";";
                myJs += "R.website.title = \"" + wt.ToLower() + "\"; R.website.id=" + websiteId + ";";
                myJs += "$('#divPageLoad').hide();_docLoaded=true;";
                //hide page loading div
                string newTitle = pageTitle;
                if (isEditable == true)
                {
                    newTitle = pageEditorTitle + pageTitle + pageEditorTitleEnd;
                }
                if (R.isWebService == true)
                {
                    PageRequest.pageTitle = pageTitle;
                }
                else
                {
                    R.App.scaffold.Data["title"] = pageTitle;
                }

            }

            //////////////////////////////////////////////////////
            //initialize page editor (rare occurance)
            if (isEditable == true)
            {
                if (isEditorLoaded == false)
                {
                    if (R.isWebService == true)
                    {
                        Editor editor = new Editor(R);
                        string[] result = editor.LoadEditor();
                        PageRequest.editor = result[0];
                        PageRequest.js += result[1];
                    }
                }
            }


            //////////////////////////////////////////////////////
            //Load XML page
            XmlDocument myXmlPage = LoadPageXml(pid, pFolder);

            if (myXmlPage == null)
            {
                //page.xml does not exist, wipe the page clean
                if (ptype == 1)
                    CleanLayers(null, pid);
            }

            //////////////////////////////////////////////////////
            //load custom CSS onto the page
            if (ptype == 1)
            {
                if (!string.IsNullOrEmpty(googleWebPropertyId))
                {
                    //GoogleLogPageRequest()
                }
                string myCSS = "";
                XmlNode nodeCSS = myXmlPage.SelectSingleNode("//CSS");
                if ((nodeCSS == null) == false)
                {
                    myCSS = "<style type=\"text/css\">" + nodeCSS.FirstChild.InnerText + "</style>";

                    if (R.isWebService == true)
                    {
                        PageRequest.css += myCSS;
                    }
                    else
                    {
                        R.App.scaffold.Data["custom-css"] = myCSS;
                    }

                }

                //reset undo redo engine
                if (isEditable == true)
                {
                    //myJs &= "undoRedo = [];AddUndoRedoAction('','all');"
                    //ClearUndoRedo()
                }

                RegisterJS("layersreset", "R.layers.cache = [];");
                RegisterJS("layer" + pid, "R.layers.add(" + pid + ",'" + pageTitle.Split(new char[] { '-', ' ', '\"' })[1] + "'," + ptype + ");");
            }

            //////////////////////////////////////////////////////
            //add page to the list of layers
            if (saveInterface == true)
            {
                string newtitle = pageTitle.Split(new char[] { '-', ' ', '\"' })[1];
                if (string.IsNullOrEmpty(pname) & ptype == 2 & isEditable == true)
                {
                    //get the lost layer name
                    newtitle = R.Sql.ExecuteScalar("SELECT title from pageinterfaces WHERE interfaceid=" + pid).ToString().Split(new char[] { '-', ' ', '\"' })[1];
                }
                else if (!string.IsNullOrEmpty(pname) & ptype == 2)
                {
                    newtitle = pname;
                }
                Layer newItem = new Layer();
                newItem.Id = pid;
                newItem.Title = newtitle;
                if ((Layers == null) == true) { Layers = new List<Layer>(); }
                Layers.Add(newItem);
            }

            ////////////////////////////////////////////////////
            //Load Layers from page.xml
            XmlNodeList myLayers = myXmlPage.SelectNodes("//layer");
            if (noloadLayers == false)
            {
                int intId = 0;
                bool doesExist = false;
                string newtitle = "";
                if (myLayers.Count > 0)
                {
                    for (int i = 0; i <= myLayers.Count - 1; i++)
                    {
                        intId = int.Parse(myLayers[i].Attributes["id"].Value);
                        doesExist = false;
                        if (Layers.Count > 0)
                        {
                            for (int x = 0; x <= Layers.Count - 1; x++)
                            {
                                if (intId == Layers[x].Id)
                                    doesExist = true;
                            }
                        }
                        newtitle = R.Util.Str.Capitalize(myLayers[i].Attributes["name"].Value.Replace("-", " "));
                        RegisterJS("layer" + intId, "R.layers.add(" + intId + ",'" + newtitle + "',2);");
                        if (doesExist == false)
                        {
                            LoadLayer(intId, newtitle);
                        }
                    }
                }
            }

            ////////////////////////////////////////////////////
            //Next, Load Components for each  Panel from page.xml
            XmlNodeList myPanels = myXmlPage.SelectNodes("//panel");
            if (myPanels.Count >= 0)
            {
                //Load components for this page
                for (int i = 0; i <= myPanels.Count - 1; i++)
                {
                    LoadPageComponents(myPanels[i], i + 1, myXmlPage, pageFile, ptype, 1, pid);
                }
            }
            else if (myPanels.Count >= 0)
            {
                //refresh components already loaded on this page
                //RefreshComponents(pid);
            }

            if (ptype == 2)
            {
                //add interface to the log
                //R.Log.AddInterface();
            }

            ////////////////////////////////////////////////////
            //Remove Unused Layers
            //if any components are loaded from an interface that isn't a part of this page,
            //remove those components immediately, and clean up the interface array
            if (ptype == 1)
            {
                CleanLayers(myLayers, pid);
                isPageLoaded = true;
                pageLoaded = true;
                //inform any components that were NOT just loaded
                GetAllComponents();
                if (Components.Count >= 0)
                {
                    for (int x = 0; x <= Components.Count - 1; x++)
                    {
                        if ((Components[x] == null) == false)
                        {
                            if (Components[x].justLoaded == false)
                            {
                                Components[x].LoadedNewPage();
                            }
                        }
                    }
                }
            }

            //////////////////////////////////////////////////////
            //update the  Editor
            if (ptype == 1 & R.isWebService == false)
            {
                if (string.IsNullOrEmpty(Url.hash))
                {
                    string eh = Url.path.Replace(" ", "-").ToLower();
                    if (eh == "home")
                        eh = "";
                    if (!string.IsNullOrEmpty(Url.hash))
                        myJs += "R.hash.last = '" + eh + "';";
                }
                else
                {
                    if (!string.IsNullOrEmpty(Url.hash))
                        myJs += "R.hash.last = '" + Url.hash.Replace(" ", "-").ToLower() + "';";
                }
                myJs += "R.editor.selectedLayerId = '" + pageId + "', R.page.useAjax=" + useAJAX.ToString().ToLower();
            }


            if (!string.IsNullOrEmpty(myJs))
            {
                RegisterJS("loadpage" + pageId, myJs);
            }

            if (ptype == 1)
            {
                //execute Page Load Complete event for all components
                GetAllComponents();
                foreach (Component c in Components)
                {
                    if ((c == null) == false)
                        c.PageLoadComplete();
                }
            }
        }

        public void LoadPage(string pageName)
        {
            switch (pageName)
            {
                case "Access Denied":
                    break;

                case "404":
                    break;
            }
        }

        public void LoadPageFromId(int id)
        {
            LoadPageInfo(id);
            LoadPage("/content/websites/" + websiteId + "/pages/" + id + "/page.xml", 1, id, pageTitle);
        }

        protected void LoadPageComponents(XmlNode panelXml, int panelIndex, XmlDocument myXmlPage, string pageFile, int ptype, int panelType, int pid)
        {
            if (panelXml == null){ return; }
            string panelName = R.Util.Xml.GetAttribute("name", panelXml);

            //get panel object that will load the list of components from xml
            Panel myPanel;
            if (string.IsNullOrEmpty(panelName))
            {
                myPanel = GetPanelByName("body");
            }
            else
            {
                myPanel = GetPanelByName(panelName);
            }

            //find all the components within the  panel
            XmlNodeList myComponents = panelXml.ChildNodes;
            Component comp = default(Component);
            bool wasDenied = accessDenied;
            string compName = "";
            string position = "";
            string css = "";
            string content = "";
            string design = "";
            string js = "";
            string wf = pageFile.Replace("/page.xml", "/"); //work folder
            int zIndex = 1;
            int finalIndex = 1;
            accessDenied = false;
            if (myComponents.Count > 0)
            {
                foreach (XmlNode c in myComponents)
                {
                    string itemId = "";
                    //component ID
                    if ((c.Attributes["id"] == null) == false)
                    {
                        itemId = c.Attributes["id"].Value;
                    }
                    else
                    {
                        itemId = R.Util.Str.CreateID();
                    }

                    //z-index
                    if ((c.Attributes["index"] == null) == false)
                    {
                        finalIndex = int.Parse(c.Attributes["index"].Value);
                    }
                    else
                    {
                        finalIndex = zIndex;
                    }

                    compName = c.Attributes["name"].Value;
                    position = c.SelectSingleNode("position").FirstChild.InnerText;
                    css = c.SelectSingleNode("css").FirstChild.InnerText;
                    content = c.SelectSingleNode("content").FirstChild.InnerText;
                    design = c.SelectSingleNode("design").FirstChild.InnerText;

                    comp = LoadComponent(compName, content, design, itemId, myPanel, wf, zIndex, pid, ptype, false , position, css);
                    if(comp != null)
                    {
                        js += "R.components.add('" + itemId + "', '" + compName + "', '" + position + "', '" + css + "'); ";
                        if (R.isWebService == true & comp != null)
                        {
                            PageComponent newC = new PageComponent();
                            newC.itemId = comp.itemId;
                            newC.panelClassId = panelName;
                            newC.Component = comp;
                            PageRequest.components.Add(newC);
                        }
                        myPanel.Components.Add(comp);
                    }
                    zIndex += 1;
                }

            }
            accessDenied = wasDenied;
            if(js != "")
            {
                RegisterJS("components", js);
            }
        }

        public Component LoadComponent
            (string componentId, string content = "", string design = "", string id = "", Panel myPanel = null, string workFolder = "", 
            int cIndex = 1, int pageid = 0, int pageType = 1, bool isDropped = false, string position = "", string customCss = "")
        {
            if (myPanel == null){return null;}

            //load component from class
            string cFolder = R.Util.Str.Capitalize(componentId.Replace("-", "/"));
            string className = "Rennder.Components." + cFolder.Replace("/",".");
            Type type = Type.GetType(className, false, true);
            if(type == null) { return null; }
            Component component = (Component)Activator.CreateInstance(type, new object[] { R });

            if (component == null) { return null; }
            //load component content
            component.DataField = content;
            component.DesignField = design;

            //set up component properties
            component.panelName = myPanel.Name;
            component.index = cIndex;
            component.ComponentId = componentId;
            component.LayerId = pageid;
            component.pageId = pageid;
            component.ComponentType = "component";

            if (string.IsNullOrEmpty(id))
            {
                id = R.Util.Str.CreateID();
            }

            component.itemId = id;

            //set up component properties
            component.isDropped = isDropped;
            if (isDropped == false)
                component.justLoaded = true;

            if (pageType == 1)
            {
                component.workfolder = "/content/websites/" + websiteId + "/pages/" + pageid + "/";
            }
            else
            {
                component.workfolder = "/content/websites/" + websiteId + "/layers/" + pageid + "/";
            }

            component.Draggable = 1;
            if (componentId.ToLower() == "panel")
            {
                component.ComponentType = "panel";
            }
            else if (myPanel.isPartOfTheme == false)
            {
                component.ComponentType = "panelcomponent";
            }


            //load position CSS properties
            string css = "";
            if (!string.IsNullOrEmpty(position))
            {
                string[] pos = position.Split('|');
                string[] cCss = { "","","","","" };
                if (!string.IsNullOrEmpty(customCss))
                {
                    cCss = customCss.Split('|');
                }
                bool firstlvl = true;

                if(pos.Length == 5)
                { 
                    //HD screen first
                    if(pos[4] != "" || cCss[4] != "")
                    {
                        if(firstlvl == true) { firstlvl = false; css += "#c" + id + ",  "; }
                        css += ".screen.hd #c" + id + ",  .screen.desktop #c" + id + ", .screen.tablet #c" + id + ", .screen.mobile #c" + id + ", .screen.cell #c" + id +
                          "{ " + GetCssForPosition(pos[4]) + "\n" + cCss[4] + "}\n";
                    }

                    //Desktop screen
                    if (pos[3] != "" || cCss[3] != "")
                    {
                        if (firstlvl == true) { firstlvl = false; css += "#c" + id + ",  "; }
                        css += ".screen.desktop #c" + id + ", .screen.tablet #c" + id + ", .screen.mobile #c" + id + ", .screen.cell #c" + id +
                          "{ " + GetCssForPosition(pos[3]) + "\n" + cCss[3] + "}\n";
                    }

                    //Tablet screen
                    if (pos[2] != "" || cCss[2] != "")
                    {
                        if (firstlvl == true) { firstlvl = false; css += "#c" + id + ",  "; }
                        css += ".screen.tablet #c" + id + ", .screen.mobile #c" + id + ", .screen.cell #c" + id +
                          "{ " + GetCssForPosition(pos[2]) + "\n" + cCss[2] + "}\n";
                    }

                    //Mobile screen
                    if (pos[1] != "" || cCss[1] != "")
                    {
                        if (firstlvl == true) { firstlvl = false; css += "#c" + id + ",  "; }
                        css += ".screen.mobile #c" + id + ", .screen.cell #c" + id +
                          "{ " + GetCssForPosition(pos[1]) + "\n" + cCss[1] + "}\n";
                    }

                    //Cell screen
                    if (pos[0] != "" || cCss[0] != "")
                    {
                        if (firstlvl == true) { firstlvl = false; css += "#c" + id + ",  "; }
                        css += ".screen.cell #c" + id +
                          "{ " + GetCssForPosition(pos[0]) + "\n" + cCss[0] + "}\n";
                    }

                }
            }

            if(css != ""){
                RegisterCSS("c" + id, css);
            }

            //finish loading component
            component.Load();

            //load component.js once
            if (CheckJSOnceIfLoaded("comp-" + cFolder) == false)
            {
                if (R.Server.Cache.ContainsKey("compjs-" + cFolder) == true & R.isLocal == false) //only cache if on live server
                {
                    //load from cache
                    R.Page.RegisterJSonce("comp-" + cFolder, R.Server.Cache["compjs-" + cFolder].ToString());
                }
                else
                {
                    //load from file
                    string jsp = File.ReadAllText(R.Server.path("/app/components/" + cFolder + "/component.js"));
                    R.Page.RegisterJSonce("comp-" + cFolder, jsp);
                    if (R.isLocal == false)
                    {
                        //save to cache
                        R.Server.Cache["compjs-" + cFolder] = jsp;
                    }
                }
            }

            GetAllComponents();
            Components.Add(component);
            ComponentViews.Add(component.GetComponentView());
            
            return component;
        }

        private string GetCssForPosition(string position)
        {
            string css = "";
            if (!string.IsNullOrEmpty(position))
            {
                string[] pos = position.Split(',');
                //x-type, x-offset, y-type, y-offset, fixed-type, width, width-type, height, height-type, padding
                switch (pos[0]) //x-type
                {
                    case "l":
                        css += "float:left; display:block;";
                        break;

                    case "c":
                        css += "float:none; display:inline-block;";
                        break;

                    case "r":
                        css += "float:right; display:block;";
                        break;
                }
                //x-offset
                if(!string.IsNullOrEmpty(pos[1])) {
                    css += "left:" + pos[1] + "px; ";
                }
                else
                {
                    css += "left:0px; ";
                }

                switch (pos[2]) //y-type
                {
                    case "f":
                        css += "position:fixed; ";
                        break;
                    default:
                        css += "position:relative; ";
                        break;
                }

                //y-offset
                if (!string.IsNullOrEmpty(pos[3]))
                {
                    css += "top:" + pos[3] + "px; ";
                }
                else
                {
                    css += "top:0px; ";
                }

                switch (pos[4]) //fixed-type
                {
                    case "m":
                        css += "top:50%; bottom:50%; ";
                        break;

                    case "b":
                        css += "top: auto; bottom:0px;";
                        break;
                    default:
                        css += "top: auto; bottom:auto;";
                        break;
                }

                switch (pos[6]) //width-type
                {
                    case "px":
                        css += "max-width:" + pos[5] + "px; ";
                        break;

                    case "%":
                        css += "max-width:" + pos[5] + "%; ";
                        break;

                    case "win":
                        css += "max-width:100%; ";
                        break;
                }

                switch (pos[8]) //height-type
                {
                    case "px":
                        css += "height:" + pos[7] + "px; ";
                        break;

                    case "auto":
                        css += "height:auto; ";
                        break;
                    case "window":
                        css += "height:auto; ";
                        break;
                }

                //padding
                if (!string.IsNullOrEmpty(pos[9]))
                {
                    string[] pad = pos[9].Replace("px", "").Split(' ');
                    css += "padding:" + pos[9] + "; width:calc(100% - " + (int.Parse(pad[1]) + int.Parse(pad[3])) + "px); ";
                }
                else
                {
                    css += "padding: 0px 0px 0px 0px; width:100%;";
                }


            }
            return css;
        }

        public String Render()
        {
            //finish loading all panels
            if (bodyPanels != null & R.isWebService == false)
            {
                if (bodyPanels.Count > 0)
                {
                    for (int x = 0; x <= bodyPanels.Count - 1; x++)
                    {
                        if(themeHtml.IndexOf("{{panel-" + bodyPanels[x].Name.ToLower().Replace(" ", "") + "}}") < 0) { break; }
                        themeHtml = themeHtml.Replace("{{panel-" + bodyPanels[x].Name.ToLower().Replace(" ","") + "}}",bodyPanels[x].Render());
                    }
                }
            }
            if (!string.IsNullOrEmpty(themeHtml))
            {
                Regex rgx = new Regex(@"\{\{.*?\}\}");
                themeHtml = rgx.Replace(themeHtml, "");
            }

            if (R.isWebService == true & PageRequest != null)
            {
                //render all components that have been loaded
                List<PageComponent> remove = new List<PageComponent>();
                foreach (PageComponent comp in PageRequest.components)
                {
                    if(comp.Component.rendered == false)
                    {
                        comp.html = R.Util.Str.CleanHtml(comp.Component.Render());
                    }else
                    {
                        remove.Add(comp);
                    }
                }

                //remove any components from PageRequest that was 
                //rendered inside of a panel component (removing duplicates)
                foreach(PageComponent comp in remove)
                {
                    PageRequest.components.Remove(comp);
                }

                //render Javascript
                if (R.Page.postJScode != null)
                {
                    R.Page.postJS += string.Join("\n", R.Page.postJScode) + R.Page.postJSLast;
                }
                PageRequest.js += R.Page.postJS;

                //render CSS
                PageRequest.css += "<style type=\"text/css\">" + string.Join("\n", R.Page.postCSS) + "</style>";
            }

            R.SaveViewState();
            return themeHtml;
        }

        #endregion

        #region "Panels"
        public void AddPanel(Panel panel)
        {
            if (bodyPanels == null)
            {
                bodyPanels = new List<Panel>();
            }
            bodyPanels.Add(panel);
            if ((PanelViews == null) == true)
            {
                PanelViews = new List<PanelView>();
            }
        }

        public Panel GetPanelByName(string name)
        {
            //get panel from viewstate
            if ((PanelViews == null) == false)
            {
                foreach (PanelView pv in PanelViews)
                {
                    if (pv.Name == name | pv.ClassName == name)
                    {
                        Panel panel = new Panel(R);
                        panel.LoadFromPanelView(pv);
                        return panel;
                    }
                }
            }

            //get panel on first page load
            if ((bodyPanels == null) == false)
            {
                for (int x = 0; x <= bodyPanels.Count - 1; x++)
                {
                    if (bodyPanels[x].Name == name)
                        return bodyPanels[x];
                }
            }

            return new Panel(R);
        }
        #endregion

        #region "Components"
        public List<Component> GetAllComponents()
        {
            if ((Components == null) == true)
                Components = new List<Component>();
            if ((ComponentViews == null) == true)
                ComponentViews = new List<ComponentView>();
            return Components;
        }

        public Component GetComponentById(string itemId)
        {
            GetAllComponents();
            if ((Components == null) == false)
            {
                for (int x = 0; x <= Components.Count - 1; x++)
                {
                    if (Components[x].itemId == itemId)
                        return Components[x];
                }
            }
            return null;
        }

        public ComponentView GetComponentViewById(string itemId)
        {
            GetAllComponents();
            if ((ComponentViews == null) == false)
            {
                for (int x = 0; x <= ComponentViews.Count - 1; x++)
                {
                    if (ComponentViews[x].itemId == itemId)
                        return ComponentViews[x];
                }
            }
            return null;
        }

        public int GetComponentViewIndexById(string itemId)
        {
            GetAllComponents();
            if ((ComponentViews == null) == false)
            {
                for (int x = 0; x <= ComponentViews.Count - 1; x++)
                {
                    if (ComponentViews[x].itemId == itemId)
                        return x;
                }
            }
            return -1;
        }

        public void DeleteComponent(string itemId)
        {
            if ((Components == null) == true)
                return;
            if (Components.Count == 0)
                return;
            for (int x = 0; x <= Components.Count - 1; x++)
            {
                if (Components[x].itemId == itemId)
                {
                    Components.RemoveAt(x);
                    break;
                }
            }
        }

        #endregion

        #region "Layers"
        public void LoadLayer(int id, string name, bool saveLayer = true)
        {
            //loads components from within an interface's xml file
            LoadPage("/content/websites/" + websiteId + "/layers/" + id.ToString() + "/page.xml", 2, id, name, saveLayer);
        }

        public void CleanLayers(XmlNodeList myLayers, int myPageId)
        {
            if (myLayers == null)
                return;
            if (R.isWebService == true)
            {
                GetAllComponents();
                if (ComponentViews.Count == 0)
                    return;
                //find out which layers belong to each component, and remove any components that are part of an old interface
                List<int> pageids = new List<int>();
                List<int> comps = new List<int>();
                List<int> panels = new List<int>();

                //first, get a list of pageIds loaded on the page
                pageids.Add(myPageId);
                pageids.Add(0);
                if (myLayers.Count > 0)
                {
                    for (int i = 0; i <= myLayers.Count - 1; i++)
                    {
                        if ((myLayers[i].Attributes["id"] == null) == false)
                            pageids.Add(int.Parse(myLayers[i].Attributes["id"].Value));
                    }
                }
                for (int y = Layers.Count - 1; y >= 0; y += -1)
                {
                    if (pageids.Contains(Layers[y].Id) == false)
                        pageids.Add(Layers[y].Id);
                    if (Layers[y].Id == myPageId)
                        break; // TODO: might not be correct. Was : Exit For
                }

                //build list of components to remove
                for (int x = 0; x <= ComponentViews.Count - 1; x++)
                {
                    if (pageids.Contains(ComponentViews[x].pageId) == false)
                    {
                        if (R.isWebService == true)
                            PageRequest.remove.Add(ComponentViews[x].itemId);
                        comps.Add(x);
                    }
                }

                //build list of panels to remove
                for (int x = 0; x <= PanelViews.Count - 1; x++)
                {
                    if (pageids.Contains(PanelViews[x].PageId) == false)
                        panels.Add(x);
                }

                //remove any unused layers from the interface array
                List<int> removefaces = new List<int>();
                for (int x = 0; x <= Layers.Count - 1; x++)
                {
                    if (pageids.Contains(Layers[x].Id) == false)
                        removefaces.Add(x);
                }

                //remove components from viewstate
                int removeOffset = 0;
                foreach (int x in comps)
                {
                    ComponentViews.RemoveAt(x - removeOffset);
                    removeOffset += 1;
                }

                //remove panels from viewstate
                removeOffset = 0;
                foreach (int x in panels)
                {
                    PanelViews.RemoveAt(x - removeOffset);
                    removeOffset += 1;
                }

                //remove layers from viewstate
                removeOffset = 0;
                foreach (int x in removefaces)
                {
                    Layers.RemoveAt(x - removeOffset);
                    removeOffset += 1;
                }
            }
        }
        #endregion

        #region "Javascript & CSS"
        /// <summary>
        /// <para>Adds your Javascript code to a variable that generates a javascript block at the bottom of the page on Page_Rennder, 
        /// either directly on the page, or at the end of an AJAX postback response</para>
        /// <para>No duplicate names are allowed per page or AJAX R.Request.Query, which protects Rennder from generating duplicate Javascript code on the page</para>
        /// </summary>
        /// <param name="name"></param>
        /// <param name="js"></param>
        /// <remarks></remarks>
        public virtual void RegisterJS(string name, string js, bool overwrite = false, bool last = false)
        {
            //register non-duplicated javascript with 
            bool addJs = true;
            //check for duplicate name
            if (postJSnames.Length > 0)
            {
                for (int x = 0; x <= postJSnames.Length - 1; x++)
                {
                    if (postJSnames[x] == name)
                    {
                        if (overwrite == true & last == false)
                        {
                            postJScode[x] = js;
                        }
                        return;
                    }
                }
            }

            Array.Resize(ref postJSnames, postJSnames.Length + 1);
            Array.Resize(ref postJScode, postJScode.Length + 1);

            postJSnames[postJSnames.Length - 1] = name;
            if (last == false)
            {
                postJScode[postJSnames.Length - 1] = js;
            }
            else
            {
                if (addJs == true)
                {
                    postJSLast += js;
                }
            }

        }

        /// <summary>
        /// <para>Adds your Javascript code to a variable that generates a javascript block at the bottom of the page on Page_Render, 
        /// either directly on the page, or at the end of an AJAX postback response.</para>
        /// 
        /// <para>No duplicate names are allowed within the entire page life and view state (page load and all AJAX requests), which 
        /// protects Rennder from generating duplicate Javascript code on the page at any given time.</para>
        /// </summary>
        /// <param name="name"></param>
        /// <param name="js"></param>
        /// <returns></returns>
        /// <remarks></remarks>
        public bool RegisterJSonce(string name, string js)
        {
            //register javascript with  so it only loads once
            //throughout the entire viewstate life

            int i = 0;
            if (postJSonce == null)
            {
                postJSonce = new string[] { };
            }
            else
            {
                for (int x = 0; x <= postJSonce.Length - 1; x++)
                {
                    if (postJSonce[x] == name)
                        return false;
                }
                i = postJSonce.Length;
                Array.Resize(ref postJSonce, i + 1);
            }
            postJSonce[i] = name;
            postJS += js + "\n";
            return true;
        }

        public bool CheckJSOnceIfLoaded(string name)
        {
            if ((postJSonce == null) == false)
            {
                for (int x = 0; x <= postJSonce.Length - 1; x++)
                {
                    if (postJSonce[x] == name)
                        return true;
                }
            }
            return false;
        }

        public void RegisterJSfile(string file, string callback = "")
        {
            string myJs = "$.when(" + "$.getScript('" + file + "')," + 
                          "$.Deferred(function(deferred){$(deferred.resolve);})" + ").done(function(){" + callback + "});";
            RegisterJSonce(file, myJs);
        }

        public void RegisterCSS(string name, string css, bool overwrite = false)
        {
            //register non-duplicated css
            if (postCSSnames.Length > 0)
            {
                for (int x = 0; x <= postCSSnames.Length - 1; x++)
                {
                    if (postCSSnames[x] == name)
                    {
                        if (overwrite == true)
                        {
                            postCSS[x] = css;
                        }
                        return;
                    }
                }
            }

            Array.Resize(ref postCSSnames, postCSSnames.Length + 1);
            Array.Resize(ref postCSS, postCSS.Length + 1);

            postCSSnames[postCSSnames.Length - 1] = name;
            postCSS[postCSSnames.Length - 1] = css;
        }

        public void RegisterCSSfile(string file)
        {
            string myJs = "(function(){var f=document.createElement(\"link\");" + "f.setAttribute(\"rel\", \"stylesheet\");" + 
                          "f.setAttribute(\"type\", \"text/css\");" + "f.setAttribute(\"href\", \"" + file + "\");" + 
                          "document.getElementsByTagName(\"head\")[0].appendChild(f);})();";
            RegisterJSonce(file, myJs);
        }
        #endregion


    }
}
