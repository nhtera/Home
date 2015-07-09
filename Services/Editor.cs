using System;
using System.Collections.Generic;
using System.IO;
using System.Data.SqlClient;

namespace Rennder.Services
{
    public class Editor : Service
    {
        public Editor(Core RennderCore, string[] paths) : base(RennderCore, paths)
        {
        }

        public structResponse Dashboard()
        {
            if (R.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "Dashboard";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] { "website-title", "page-title", "pageid" });
            Elements["website-title"] = R.Page.websiteTitle;
            Elements["page-title"] = R.Util.Str.GetPageTitle(R.Page.pageTitle);
            Elements["pageid"] = R.Page.pageId.ToString();

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/editor/dashboard.html", Elements);
            response.js = CompileJs();

            return response;
        }

        public structResponse Options()
        {
            if (R.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "Options";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] 
            { "helpicon-grid", "helpicon-dragfrompanel", "helpicon-guidelines" });
            Elements["helpicon-grid"] = "";
            Elements["helpicon-dragfrompanel"] = "";
            Elements["helpicon-guidelines"] = "";

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/editor/options.html", Elements);
            response.js = CompileJs();

            return response;
        }

        public structResponse Profile()
        {
            if (R.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "Profile";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[]
            { "websites", "admin" });
            if (R.User.memberId == 1) { Elements["admin"] = "true"; }

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/dashboard/profile.html", Elements);
            response.js = CompileJs();

            return response;
        }

        public structResponse NewPage(int parentId, string title)
        {
            if (R.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "NewPage";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] { "url", "data-page", "data-pagename" });
            Elements["url"] = R.Page.Url.host.Replace("http://", "").Replace("https://", "") + title;
            Elements["data-page"] = "";
            Elements["data-pagename"] = "";

            R.Page.RegisterJS("newpage", "R.editor.pages.add.item.url = '" + Elements["url"] + "';");

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/dashboard/newpage.html", Elements);
            response.js = CompileJs();

            return response;
        }

        public structResponse PageSettings(int pageId)
        {
            if (R.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "PageSettings";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] { "url", "page-title", "description", "secure", "page-type", "type" });

            string parentTitle = "";
            SqlDataReader myReader = R.Sql.ExecuteReader("SELECT TOP 1 p2.title AS parenttitle, p.title, p.security, p.description FROM pages p LEFT JOIN pages p2 ON p2.pageid=p.parentid WHERE p.pageid=" + pageId);
            if (myReader.HasRows == true)
            {
                myReader.Read();
                parentTitle = R.Sql.Get("parenttitle");
                Elements["page-title"] = R.Util.Str.GetPageTitle(R.Sql.Get("title"));
                if (R.Sql.GetBool("security") == true)
                {
                    Elements["secure"] = "true";
                }
                Elements["description"] = R.Sql.Get("description");
            }
            myReader.Dispose();

            Elements["url"] = R.Page.Url.host.Replace("http://", "").Replace("https://", "") + Elements["page-title"].Replace(" ", "-") + "/";

            if (!string.IsNullOrEmpty(parentTitle))
            {
                parentTitle = R.Util.Str.GetPageTitle(parentTitle);
                Elements["page-type"] = "true";
                Elements["type"] = "A sub-page for \"" + parentTitle + "\"";
            }

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/dashboard/pagesettings.html", Elements);
            response.js = CompileJs();

            return response;
        }

        public structResponse Layers()
        {
            if (R.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "Layers";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] { });

            R.Page.RegisterJS("layers", "R.editor.layers.refresh();");

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/editor/layers.html", Elements);
            response.js = CompileJs();

            return response;
        }

        #region "Components"
        public structResponse Components()
        {
            if (R.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "Components";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[]
            { "components", "categories" });

            //get a list of components
            Elements["components"] = GetComponentsList();

            //get a list of categories
            Elements["categories"] = GetComponentCategories();

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/editor/components.html", Elements);
            response.js = CompileJs();

            return response;
        }

        public Inject ComponentsFromCategory(int category)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = "#component-list";
            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            response.html = GetComponentsList(category);
            response.js = CompileJs();

            return response;
        }

        private string GetComponentsList(int category = 1)
        {
            int start = 0;
            int length = 12;
            string htm = "";
            SqlDataReader myReader = R.Sql.ExecuteReader("SELECT * FROM (SELECT TOP " + (start + length) + " ROW_NUMBER() OVER(ORDER BY cindex ASC) AS rownum, componentId, title, description FROM evolvercomponents WHERE category=" + category + ") AS tbl WHERE rownum >= " + start + " AND rownum <= " + (start + length));
            if (myReader.HasRows == true)
            {
                while (myReader.Read() != false)
                {
                    htm += "<div class=\"list-item\" cname=\"" + R.Sql.Get("title") + "\" ctitle=\"" + R.Sql.Get("description") + "\" onmousedown=\"R.editor.components.dragNew.start(event)\" >";
                    htm += "<img src=\"/components/" + R.Sql.Get("componentid").Replace("-", "/") + "/icon.png\" alt=\"" + R.Sql.Get("title") + "\" cid=\"" + R.Sql.Get("componentid") + "\" /></div>";
                }
            }
            myReader.Dispose();
            return htm;
        }

        private string AddCategory(int id, string title, string description, string icon)
        {
            return "<div class=\"row column\"><div class=\"button-outline\" onclick=\"R.editor.components.category.load(" + id + ")\" title=\"" + description + "\">" + 
                "<div class=\"left\" style=\"padding-right:10px;\"><img src=\"/components/" + icon + "/iconsm.png\"/></div><div style=\"padding-top:7px;\">" + title + "</div></div></div>";
        }

        private string GetComponentCategories()
        {
            string htm = "";
            htm = "";
            htm += AddCategory(1, "General", "All the tools you need to create content, including text, photos, videos, panels, menus, lists, and buttons.", "textbox");
            htm += AddCategory(3, "Page", "Add the title of your page, a list of relavent pages, user comments & ratings, and other page-specific content.", "page/title");
            if (R.Page.isDemo == false)
            {
                SqlDataReader myReader = R.Sql.ExecuteReader("SELECT * FROM (SELECT DISTINCT a.title, a.description, a.icon, a.componentcategory, a.orderby, a.applicationid FROM evolverapplicationsowned o LEFT JOIN evolverapplicationcomponentcategories a ON a.applicationid=o.applicationid WHERE o.ownerid=" + R.Page.ownerId + " AND o.websiteid=" + R.Page.websiteId + ") AS tbl ORDER BY applicationid ASC, orderby ASC");
                if (myReader.HasRows == true)
                {
                    while (myReader.Read() != false)
                    {
                        htm += AddCategory(R.Sql.GetInt("componentcategory"), R.Sql.Get("title"), R.Sql.Get("description"), R.Sql.Get("icon"));
                    }
                }
                myReader.Dispose();
            }
            return htm;
        }

        public Inject NewComponent(string componentId, string panelId, string selector, int x, int y, int panelWidth, string responsive, int level, int zIndex)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup response
            response.element = selector;
            response.inject = enumInjectTypes.append;

            //setup default properties for component
            string className = "Rennder.Components." + componentId.Replace("/", ".").Replace("-", ".");
            Type type = Type.GetType(className, false, true);
            if (type == null) { return response; }
            Component comp = (Component)Activator.CreateInstance(type, new object[] { R });
            if (comp == null) { return response; }
            string[] rlevel = new string[5];
            rlevel[level] = responsive.Replace("<w>", comp.defaultWidth.ToString()).Replace("<tc>", "tc;" + (x - ((panelWidth - comp.defaultWidth) / 2)));
            Panel panel = R.Page.GetPanelByName(panelId);

            //render new component
            comp = R.Page.LoadComponent(componentId, x, y, true, "0", "0", "", "", "", true, panel, "/content/websites/" + R.Page.ownerId + "/pages/" + R.Page.pageId, -1, zIndex, R.Page.pageId, 1, true, String.Join("|", rlevel), ",,,,");
            if(comp == null) { return response; }
            response.html = comp.Render();

            //add JS to align component on page correctly
            string js = "(function(){var c = $('#c" + comp.itemId + "'); console.log('new component'); console.log(c);" + 
                        "var options = {left:" + x + ",top:" + y + ", width:" + comp.defaultWidth + "};" + 
                        "R.events.render.init();" + "c.css(options);" + "R.editor.components.savePosition(c[0],true);" + 
                        "})();";

            R.Page.RegisterJS("newcomp", js);
            response.js = CompileJs();

            return response;

        }

        public Inject RemoveComponent(string componentId)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            for (int x = 0; x <= R.Page.ComponentViews.Count - 1; x++)
            {
                if (R.Page.ComponentViews[x].itemId == componentId)
                {
                    R.Page.ComponentViews.Remove(R.Page.ComponentViews[x]);
                    break;
                }
            }

            return response;
        }

        public Inject ComponentProperties(string id, string section)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = ".winProperties .props-content";

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //load properties window
            ComponentView comp = R.Page.GetComponentViewById(id);
            string cid = comp.ComponentName.Replace(" ", ".");
            string className = "Rennder.Components.Properties." + cid;
            Type type = Type.GetType(className, false, true);
            if (type == null) { return response; }
            ComponentProperties properties = (ComponentProperties)Activator.CreateInstance(type, new object[] { R, comp });
            if (comp == null) { return response; }

            //load properties.js
            string js = "";
        
            if (R.Server.Cache.ContainsKey("props-" + cid) == true & R.isLocal == false)
            {
                //load from cache
                js = (string)R.Server.Cache["props-" + cid];
            }
            else
            {
                //load from file
                string jsp = File.ReadAllText(R.Server.MapPath("/components/" + cid + "/properties.js"));
                js = jsp;
                if (R.isLocal == false)
                {
                    //save to cache
                    R.Server.Cache.Add("props-" + cid, jsp);
                }
            }
            R.Page.RegisterJS("props", "R.editor.components.properties.loaded('" + comp.ComponentName + 
                                        "'," + properties.Width + ");" + js);

            //finally, render properties window
            response.html = properties.Render();
            response.js = CompileJs();

            return response;
        }
        #endregion




    }
}
