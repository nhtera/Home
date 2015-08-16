using System;
using System.IO;

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
            Scaffold scaffold = new Scaffold(R, "/app/editor/dashboard.html", "", 
                new string[] { "website-title", "page-title", "pageid" });
            scaffold.Data["website-title"] = R.Page.websiteTitle;
            scaffold.Data["page-title"] = R.Util.Str.GetPageTitle(R.Page.pageTitle);
            scaffold.Data["pageid"] = R.Page.pageId.ToString();

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
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
            Scaffold scaffold = new Scaffold(R, "/app/editor/options.html", "", new string[] 
            { "helpicon-grid", "helpicon-dragfrompanel", "helpicon-guidelines" });
            scaffold.Data["helpicon-grid"] = "";
            scaffold.Data["helpicon-dragfrompanel"] = "";
            scaffold.Data["helpicon-guidelines"] = "";

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
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
            Scaffold scaffold = new Scaffold(R, "/app/dashboard/profile.html", "", new string[]
            { "websites", "admin" });
            if (R.User.userId == 1) { scaffold.Data["admin"] = "true"; }

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
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
            Scaffold scaffold = new Scaffold(R, "/app/dashboard/newpage.html", "", new string[] { "url", "data-page", "data-pagename" });
            scaffold.Data["url"] = R.Page.Url.host.Replace("http://", "").Replace("https://", "") + title;
            scaffold.Data["data-page"] = "";
            scaffold.Data["data-pagename"] = "";

            R.Page.RegisterJS("newpage", "R.editor.pages.add.item.url = '" + scaffold.Data["url"] + "';");

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
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
            Scaffold scaffold = new Scaffold(R, "/app/dashboard/pagesettings.html", "", 
                new string[] { "url", "page-title", "description", "secure", "page-type", "type" });

            string parentTitle = "";
            SqlReader reader = R.Page.SqlPage.GetParentInfo(pageId);
            if (reader.Rows.Count > 0)
            {
                reader.Read();
                parentTitle = reader.Get("parenttitle");
                scaffold.Data["page-title"] = R.Util.Str.GetPageTitle(reader.Get("title"));
                if (reader.GetBool("security") == true)
                {
                    scaffold.Data["secure"] = "true";
                }
                scaffold.Data["description"] = reader.Get("description");
            }

            scaffold.Data["url"] = R.Page.Url.host.Replace("http://", "").Replace("https://", "") + scaffold.Data["page-title"].Replace(" ", "-") + "/";

            if (!string.IsNullOrEmpty(parentTitle))
            {
                parentTitle = R.Util.Str.GetPageTitle(parentTitle);
                scaffold.Data["page-type"] = "true";
                scaffold.Data["type"] = "A sub-page for \"" + parentTitle + "\"";
            }

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
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
            Scaffold scaffold = new Scaffold(R, "/app/editor/layers.html", "", new string[] { });

            R.Page.RegisterJS("layers", "R.editor.layers.refresh();");

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
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
            Scaffold scaffold = new Scaffold(R, "/app/editor/components.html", "", new string[] { "components", "categories" });

            //get a list of components
            scaffold.Data["components"] = GetComponentsList();

            //get a list of categories
            scaffold.Data["categories"] = GetComponentCategories();

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
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
            SqlClasses.Editor SqlEditor = new SqlClasses.Editor(R);
            SqlReader reader = SqlEditor.GetComponentsList(category, start, length);
            if (reader.Rows.Count > 0)
            {
                while (reader.Read() != false)
                {
                    htm += "<div class=\"list-item\" cname=\"" + reader.Get("title") + "\" ctitle=\"" + reader.Get("description") + "\" onmousedown=\"R.editor.components.dragNew.start(event)\" onmouseover=\"R.editor.components.toolbar.mouseEnter(this)\" onmouseout=\"R.editor.components.toolbar.mouseLeave()\" >";
                    htm += "<img src=\"/components/" + reader.Get("componentid").Replace("-", "/") + "/icon.png\" alt=\"" + reader.Get("title") + "\" cid=\"" + reader.Get("componentid") + "\" /></div>";
                }
            }
            return htm;
        }

        private string AddCategory(int id, string title, string description, string iconFolder)
        {
            return "<div class=\"row column\"><div class=\"button-outline\" onclick=\"R.editor.components.category.load(" + id + ")\" title=\"" + description + "\">" + 
                "<div class=\"left\" style=\"padding-right:10px;\"><img src=\"/" + iconFolder + "/iconsm.png\"/></div><div style=\"padding-top:7px;\">" + title + "</div></div></div>";
        }

        private string GetComponentCategories()
        {
            string htm = "";
            htm = "";
            htm += AddCategory(1, "General", "All the tools you need to create content, including text, photos, videos, panels, menus, lists, and buttons.", "components/textbox");
            htm += AddCategory(2, "Page", "Add the title of your page, a list of relavent pages, user comments & ratings, and other page-specific content.", "components/page/title");
            if (R.Page.isDemo == false)
            {
                SqlClasses.Editor SqlEditor = new SqlClasses.Editor(R);
                SqlReader reader = SqlEditor.GetComponentCategories();
                if (reader.Rows.Count > 0)
                {
                    while (reader.Read() != false)
                    {
                        htm += AddCategory(reader.GetInt("componentcategory"), reader.Get("title"), reader.Get("description"), "/apps/" + reader.Get("name"));
                    }
                }
            }
            return htm;
        }

        public Inject NewComponent(string componentId, string panelId, string selector, int x, int y, int panelWidth)
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
            Panel panel = R.Page.GetPanelByName(panelId);

            //render new component
            comp = R.Page.LoadComponent(componentId, "", "", "", panel, "/content/websites/" + R.Page.ownerId + "/pages/" + R.Page.pageId, 1, R.Page.pageId, 1, true, "", "");
            if(comp == null) { return response; }
            response.html = comp.Render();

            //add JS to align component on page correctly
            string js = "(function(){var c = $('#c" + comp.itemId + "');" + 
                        "var options = {maxWidth:" + comp.defaultWidth + "};" + 
                        "c.css(options);" +
                        "})();R.components.add('" + comp.itemId + "','" + componentId + "', '', '');";

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
                string jsp = File.ReadAllText(R.Server.MapPath("/app/components/" + cid + "/properties.js"));
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
