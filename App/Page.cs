using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Text.RegularExpressions;

namespace Rennder
{
    public class Page
    {
        #region "Properties"
        private Core R;

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
        public int pageType = 1; //1 = page, 2 = template
        public string pageTitle = "";
        public string PageTitleForHash = "";
        public string PageTitleForBrowserTab = "";
        public string parentTitle = "";
        public string pageKeywords = "";
        public string pageDescription = "";
        public string pageFavIcon = "";
        public DateTime pageCreated;
        public int pageSecurity = 0;
        public int pageMembersOnly = 0;
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
        public int layoutId = 0;
        public int layoutOwner = 0;
        public string layoutFolder = "";
        public string prevLayoutFolder = "";
        public string googleWebPropertyId = "";

        protected string[] postJSnames; //used so duplicate JS doesn't get added to the page
        public string[] postJScode; //array of javascript to add
        public string[] postJSonce; //used so duplicate JS that loads only once doesn't get added to the page
        public string postJS = ""; //used to compile javascript for postback response
        public string postJSLast = ""; //added to the end of postJS

        private bool pageCssChanged = false;
        private bool isPageLoaded = false;

        private string layoutHtml = ""; //generated HTML for the layout
        private string pageHtml = "";   //generated HTML for the page

        private string pageEditorTitle = ""; //beginning of title (in edit-mode)
        private string pageEditorTitleEnd = " - Rennder Page Editor"; //end of title (in edit-mode)

        public struct structUrl
        {
            public string path;
            public string host;
            public string hash;
            public string pathAndHash;
        }

        public structUrl Url;

        private List<Panel> bodyPanels;
        public List<PanelView> PanelViews;
        public WebServices.PageRequest PageRequest;


        public Page(Core RennderCore)
        {
            R = RennderCore;
        }
        #endregion

        #region "Web Page"

        public void GetPageUrl(string urlhash = "")
        {
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Get Page Url & Build Hash
            //pageUrl: 0=domain name (with protocol), 1=web page title, 2=web page title (with "-" & "/"), 3=url folder structure, 4=raw hash (without #)
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            Url.hash = "";
            string path = R.Request.Path.ToString().ToLower().Replace(" ", "+");
            string[] arr = null;

            if(path != "")
            {
                arr = path.Split(new char[] { '/' });
                Url.path = arr[0];
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
            if (Url.host.Substring(Url.host.Length - 2, 1) != "/")
            {
                Url.host += "/";
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
                    
                //try to get pageId based on domain name
                if (!string.IsNullOrEmpty(pagetitle))
                {
                    if (pagetitle == "rennder")
                    {
                        //get pageid from web site home page
                        return (int)(R.Sql.ExecuteScalar("SELECT p.pageid FROM websitedomains w LEFT JOIN pages p ON p.pageid=(SELECT w2.pagehome FROM websites w2 WHERE w2.websiteid=w.websiteid) WHERE w.domain = '" + Domain + "' AND p.deleted=0"));
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(subDomain))
                        {
                            //get pageid from web site domain name & page title
                            return (int)(R.Sql.ExecuteScalar("EXEC GetPageIdFromDomainAndTitle @domainname='" + Domain + "', @pagetitle='" + pagetitle + "'"));
                        }
                        else
                        {
                            //get pageid from web site domain & sub domain & page title
                            return (int)(R.Sql.ExecuteScalar("EXEC GetPageIdFromSubDomainAndTitle @domainname='" + Domain + "', @subdomain='" + subDomain + "', @pagetitle='" + pagetitle + "'"));
                        }
                    }

                }
                else
                {
                    if (string.IsNullOrEmpty(subDomain))
                    {
                        //get pageid from web site home page
                        return (int)(R.Sql.ExecuteScalar("SELECT p.pageid FROM websitedomains w LEFT JOIN pages p ON p.pageid=(SELECT w2.pagehome FROM websites w2 WHERE w2.websiteid=w.websiteid) WHERE w.domain = '" + Domain + "' AND p.deleted <> 1"));
                    }
                    else
                    {
                        //get pageid from web site sub domain home page
                        return (int)(R.Sql.ExecuteScalar("SELECT p.pageid FROM websitesubdomains w LEFT JOIN pages p ON p.pageid=(SELECT w2.pagehome FROM websites w2 WHERE w2.websiteid=w.websiteid) WHERE w.domain = '" + Domain + "' AND w.subdomain='" + subDomain + "' AND p.deleted <> 1"));
                    }
                }
            }
        }

        public SqlDataReader GetPageInfoByDomainName(string domainName, string pagetitle = "")
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
                        return R.Sql.ExecuteReader("EXEC GetPageInfoFromDomain @domain='" + Domain + "'");
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(subDomain))
                        {
                            //get pageid from web site domain name & page title
                            return R.Sql.ExecuteReader("GetPageInfoFromDomainAndTitle @domain='" + Domain + "', @title='" + pagetitle + "'");
                        }
                        else
                        {
                            //get pageid from web site domain & sub domain & page title
                            return R.Sql.ExecuteReader("EXEC GetPageInfoFromSubDomainAndTitle @domain='" + Domain + "', @subdomain='" + subDomain + "', @title='" + pagetitle + "'");
                        }
                    }

                }
                else
                {
                    if (string.IsNullOrEmpty(subDomain))
                    {
                        //get pageid from web site home page
                        return R.Sql.ExecuteReader("EXEC GetPageInfoFromDomain @domain='" + Domain + "'");
                    }
                    else
                    {
                        //get pageid from web site sub domain home page
                        return R.Sql.ExecuteReader("EXEC GetPageInfoFromSubDomain @domain = '" + Domain + "', @subdomain='" + subDomain + "'");
                    }
                }
            }
        }

        public SqlDataReader GetPageInfoByPageId()
        {
            return R.Sql.ExecuteReader("EXEC GetPageInfoFromPageId @pageId=" + pageId);
        }

        public SqlDataReader GetPageInfoFromUrlPath()
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
            LoadPageInfo(R.Sql.ExecuteReader("EXEC GetPageInfoFromPageId @pageId=" + pId));
        }

        public void LoadPageInfo(SqlDataReader reader)
        {
            bool hasRows = false;
            int oldLayoutId = layoutId;

            if(reader.HasRows == true)
            {
                reader.Read();
                hasRows = true;
                pageId = R.Sql.GetInt("pageId");
                ownerId = R.Sql.GetInt("ownerId");
                pageSecurity = R.Sql.GetInt("security");
                pageMembersOnly = R.Sql.GetInt("membersonly");
                pageTitle = R.Sql.Get("title");
                pageCreated = R.Sql.GetDateTime("datecreated");
                layoutId = R.Sql.GetInt("layoutid");
                layoutOwner = R.Sql.GetInt("layoutowner");
                websiteId = R.Sql.GetInt("websiteid");
                websiteTitle = R.Sql.Get("websitetitle");
                if (!(reader["websitetype"] is DBNull))
                {
                    websiteType = R.Sql.GetInt("websitetype");
                }else
                {
                    websiteType = 1;
                }

                websitePageAccessDenied = R.Sql.GetInt("pagedenied");
                websitePage404 = R.Sql.GetInt("page404");
                pageDescription = R.Sql.Decode(R.Sql.Get("description"));
                websiteTrial = R.Sql.GetBool("trial");
                if (!(reader["googlewebpropertyid"] is DBNull))
                {
                    googleWebPropertyId = R.Sql.Get("googlewebpropertyid");
                }
                if (!(reader["pagebackground"] is DBNull))
                {
                    //LoadBackground(R.Sql.Get("pagebackground"]));
                    //page
                }
                else
                {
                    //LoadBackground(R.Sql.Get("background"]));
                    //website
                }
                if (!(reader["parentid"] is DBNull))
                {
                    pageParentId = R.Sql.GetInt("parentid");
                }
                else
                {
                    pageParentId = 0;
                }
                if (!(reader["parenttitle"] is DBNull))
                {
                    parentTitle = R.Sql.Get("parenttitle");
                }
                else
                {
                    parentTitle = "";
                }

                string pageCss = "";
                if (!(reader["websitecss"] is DBNull))
                {
                    //get CSS for whole web site
                    if (isPageLoaded == false | pageCssChanged == true)
                    {
                        if (!string.IsNullOrEmpty(R.Sql.Get("websitecss")))
                        {
                            pageCss = R.Sql.Get("websitecss");
                        }
                    }
                }
                if (!(reader["css"] is DBNull))
                {
                    if (!string.IsNullOrEmpty(R.Sql.Get("css")))
                    {
                        pageCss = R.Sql.Get("css");
                    }
                }

                if (!(reader["icon"] is DBNull))
                {
                    if (!string.IsNullOrEmpty(R.Sql.Get("icon")))
                    {
                        string favIcon = R.Sql.Get("icon");
                        if(R.isWebService == true)
                        {
                            if (favIcon != pageFavIcon)
                            {
                                //change favicon via JS
                            }
                        }else
                        {
                            pageFavIcon = R.Sql.Get("icon");
                        }
                    }
                }

                pageFacebook = "";
                if (!(reader["photo"] is DBNull))
                {
                    if (!string.IsNullOrEmpty(R.Sql.Get("photo")))
                    {
                        pageFacebook = "<meta id=\"metafbimg\" property=\"og:image\" content=\"" + Url.host + R.Sql.Get("css") + "\" />";
                    }
                    pageFacebook += "<meta id=\"metafbtitle\" property=\"og:title\" content=\"" + R.Util.Str.GetPageTitle(pageTitle) + "\" />" +
                                    "<meta id=\"metafbsite\" property=\"og:site_name\" content=\"" + R.Util.Str.GetWebsiteTitle(pageTitle) + "\" />";
                }

            }
            reader.Dispose();

            if(pageId <= 0)
            {
                //no page loaded, show 404
                //LoadPageAndInfo("404");
            }

            if (hasRows == true){
                //finished loading page information, so check for security & core changes made from info
                if(demoId > 0)
                {
                    if(demoId == pageId && R.Request.QueryString.ToString().IndexOf("?demo") >= 0)
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

                }else if(R.Request.QueryString.ToString().IndexOf("?demo") >= 0)
                {
                    //no demo was launched from RennderScript, 
                    //so check to see if this website is a template website 
                    //(which supports demo of any public page)
                    if(websiteType == 2)
                    {
                        isDemo = true;
                        R.User.viewerId = ownerId;
                        isEditable = true;
                        isTemplate = true;
                    }else
                    {
                        demoId = 0;
                        isEditable = false;
                    }
                }

                if(isDemo == true)
                {
                    //load demo tutorial
                }else
                {
                    if(R.User.memberId > 0)
                    {
                        //user is logged in, check security for page editing
                        R.User.viewerId = R.User.memberId;
                        if (R.User.Website(websiteId).getWebsiteSecurityItem("dashboard/pages", 4))
                        {
                            isEditable = true;
                        }
                    }
                }

                //don't let bot / crawler edit page
                if(isBot == true) { isEditable = false; }


                if (!string.IsNullOrEmpty(R.Request.Query["a"]) & R.User.viewerId < 1)
                {
                    //authenticate login for taking a screenshot
                    if ((string)(R.Sql.ExecuteScalar("EXEC authenticateScreenshot @auth='" + R.Request.Query["a"] + "', @websiteid=" + websiteId + ",@kill=" + (R.Request.Query["ak"] == "0" ? "0" : "1"))) == "pass")
                    {
                        R.User.viewerId = ownerId;
                        R.User.memberId = ownerId;
                        RegisterJS("authjs2", "var evscreenshot = 1;$('body').css({ 'overflowY': 'hidden' });");
                    }
                }

                if(pageSecurity == 1 && (ownerId != R.User.viewerId || isDemo == true))
                {
                    //don't allow anyone but the website owner to view this page
                    
                }

                if(isEditable == true || isDemo == true)
                {
                    PageTitleForBrowserTab = pageEditorTitle + websiteTitle + pageEditorTitleEnd;
                }

                if(layoutFolder == "")
                {
                    //load website layout from request query string
                    if (!string.IsNullOrEmpty(R.Request.Query["lid"]))
                    {
                        //LoadLayoutIdFromQuery();
                    }
                    layoutFolder = "/content/layouts/" + layoutOwner + "/" + layoutId + "/";
                    if(R.isFirstLoad == true)
                    {
                        LoadLayout();
                    }
                }
                else
                {
                    if(oldLayoutId != layoutId && R.isFirstLoad == false)
                    {
                        layoutFolder = "/content/layouts/" + layoutOwner + "/" + layoutId + "/";
                    }
                }

                //load RML engine
                LoadRmlEngine();

                //setup page folder
                if (pageType == 1)
                {
                    pageFolder = "/content/websites/" + websiteId + "/pages/" + pageId + "/";
                }else
                {
                    pageFolder = "/content/websites/" + websiteId + "/layers/" + pageId + "/";
                }

                //setup work folder
                workFolder = pageFolder;
                
            }
        }

        public void LoadPage(string pageFile, int pType, int pId, string pName, bool registerLayer = true, bool loadLayers = true, bool keepLayers = false)
        {
            
        }

        public void LoadRmlEngine()
        {

        }

        public void LoadLayout()
        {
            //load website layout into Rennder
            if (layoutFolder == prevLayoutFolder) { return; }
            prevLayoutFolder = layoutFolder;

            //start RML engine
            LoadRmlEngine();

            if (R.isFirstLoad == true)
            {
                //load CSS for layout
                R.App.Elements["layout-css"] = layoutFolder + "style.css?v=" + R.Version;
            }else { 
                //load CSS via javascript instead
                RegisterJS("cssfile", "$('#cssFile').href = '" + layoutFolder + "style.css?v=" + R.Version + "';");
            }

            if(R.Server.Cache.ContainsKey(layoutFolder + "default.htm") == true)
            {

            }else
            {
                int[] start = new int[3];
                string fileHtml = null;
                string fileWebsite = "";
                string headWebsite = "";
                string footWebsite = "";
                string urlDefaultHtm = R.Server.path("/wwwroot/" + layoutFolder + "default.htm");
                string urlWebsiteHtm = R.Server.path("/wwwroot/" + "/content/websites/" + websiteId + "/website.htm");

                //get layout HTML
                if (R.Server.Cache.ContainsKey(layoutFolder + "default.htm")==true)
                {
                    fileHtml = R.Server.Cache[layoutFolder + "default.htm"].ToString();
                }
                else
                {
                    fileHtml = File.ReadAllText(urlDefaultHtm);
                    R.Server.Cache[layoutFolder + "default.htm"] = fileHtml;
                }

                //get website HTML
                if (R.Server.Cache.ContainsKey("/content/websites/" + websiteId + "/website.htm") == true)
                {
                    fileWebsite = R.Server.Cache["/content/websites/" + websiteId + "/website.htm"].ToString();
                }
                else
                {
                    if (File.Exists(urlWebsiteHtm) == true)
                    {
                        fileWebsite = File.ReadAllText(urlWebsiteHtm);
                    }
                    R.Server.Cache["/content/websites/" + websiteId + "/website.htm"] = fileWebsite;
                }
                if (!string.IsNullOrEmpty(fileWebsite))
                {
                    start[0] = fileWebsite.IndexOf("<rml:content/>");
                    if (start[0] >= 0)
                    {
                        headWebsite = fileWebsite.Substring(0, start[0] - 1);
                        footWebsite = fileWebsite.Substring(start[0] + 14);
                    }
                    fileHtml = headWebsite + fileHtml + footWebsite;
                }

                int i = -1;
                List<string> layoutHtm = new List<string>();
                start[2] = 0;
                do
                {
                    start[0] = fileHtml.IndexOf("<rml:evolver", start[2]);
                    if (start[0] >= 0)
                    {
                        //found an evolver panel
                        start[1] = fileHtml.IndexOf("/>",start[0] + 12);
                        if (start[1] >= 0)
                        {
                            i += 1;

                            //add chunck of layout html to the page
                            string htm = "";
                            htm = fileHtml.Substring(start[2], start[0] - start[2]);
                            start[2] = start[1] + 2;

                            //create new evolver panel
                            Panel newPanel = new Panel(R);

                            string[] arrAttr = fileHtml.Substring(start[0] + 11, start[1] - (start[0] + 11)).Split('\"');
                            for (int x = 0; x <= arrAttr.Length - 1; x++)
                            {
                                if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                {
                                    newPanel.Name = arrAttr[x + 1];
                                    htm += "{{panel-" + newPanel.Name.ToLower().Replace(" ", "") + "}}";
                                }
                            }

                            //add attributes to the evolver panel
                            newPanel.isPartOfLayout = true;

                            if (newPanel.Name.ToLower() == "body")
                            {
                                //create loading body div
                                //RmlLoading rmlLoading = default(RmlLoading);
                                ////first try to load website RML
                                //try
                                //{
                                //    rmlLoading = R.WebRml.GetRmlLoading("");
                                //    //if error, load layout RML
                                //}
                                //catch (Exception ex)
                                //{
                                //    rmlLoading = R.PageRml.GetRmlLoading("");
                                //}
                                //
                                //htm += "<div class=\"absolute\" style=\"width:100%;\"><div class=\"relative\" id=\"divPageLoad\" style=\"width:100%;\"><div class=\"div-max-width\" style=\"width:250px; margin:0px auto; padding:100px 0px;\">";
                                //htm += rmlLoading.GetCompiledRml;
                                //htm += "<div style=\"clear:both;\"></div></div></div></div>";
                            }

                            layoutHtm.Add(htm);

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

                layoutHtm.Add(fileHtml.Substring(start[2]));
                layoutHtml = String.Join("", layoutHtm.ToArray());
            }

            
            
            //RegisterJS("folders", "var layoutFolder = '" + layoutFolder + "'; var websiteId = '" + websiteId + "';");
        }

        public String Render()
        {
            //finish loading all panels

            {
                if ((bodyPanels == null) == false & R.isWebService == false)
                {
                    if (bodyPanels.Count > 0)
                    {
                        for (int x = 0; x <= bodyPanels.Count - 1; x++)
                        {
                            layoutHtml = layoutHtml.Replace("{{panel-" + bodyPanels[x].Name.ToLower().Replace(" ","") + "}}",bodyPanels[x].Render());
                        }
                    }
                }
                if (!string.IsNullOrEmpty(layoutHtml))
                {
                    Regex rgx = new Regex(@"\{\{.*?\}\}");
                    layoutHtml = rgx.Replace(layoutHtml, "");
                }

                if (R.isWebService == true & PageRequest != null)
                {
                    if (R.Page.postJScode != null)
                    {
                        R.Page.postJS += string.Join("\n", R.Page.postJScode) + R.Page.postJSLast;
                    }
                    PageRequest.js = R.Page.postJS;
                }

                R.SaveViewState();
            }
            return layoutHtml;
        }

        #endregion

        #region "Panels"
        public void AddPanel(Panel panel)
        {
            if ((bodyPanels == null) == true)
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
            if (R.isWebService == true)
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
            }
            else
            {
                //get panel on first page load
                if ((bodyPanels == null) == false)
                {
                    for (int x = 0; x <= bodyPanels.Count - 1; x++)
                    {
                        if (bodyPanels[x].Name == name)
                            return bodyPanels[x];
                    }
                }
            }

            return null;
        }
        #endregion

        #region "Components"
        public ComponentView GetComponentViewById(string itemId)
        {
            return null;
        }
        #endregion

        #region "Javascript"
        /// <summary>
        /// <para>Adds your Javascript code to a variable that generates a javascript block at the bottom of the page on Page_Rennder, 
        /// either directly on the page, or at the end of an AJAX postback response</para>
        /// <para>No duplicate names are allowed per page or AJAX R.request, which protects Rennder from generating duplicate Javascript code on the page</para>
        /// </summary>
        /// <param name="name"></param>
        /// <param name="js"></param>
        /// <remarks></remarks>
        public virtual void RegisterJS(string name, string js, bool overwrite = false, bool last = false)
        {
            //register non-duplicated javascript with Evolver
            bool addJs = true;
            //check for duplicate name
            if ((postJSnames == null) == false)
            {
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
            }


            if (postJSnames != null)
            {
                Array.Resize(ref postJSnames, postJSnames.Length + 1);
                Array.Resize(ref postJScode, postJScode.Length + 1);
            }
            else
            {
                postJSnames = new string[] { };
                postJScode = new string[] { };

            }
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
            //register javascript with Evolver so it only loads once
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
