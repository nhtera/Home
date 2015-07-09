using System.Collections.Generic;
using System.Data.SqlClient;

namespace Rennder.Services.Dashboard
{
    public class Pages : Service
    {
        public Pages(Core RennderCore, string[] paths) : base(RennderCore, paths)
        {
        }

        public Inject LoadPages()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup response
            response.element = ".winWebPages > .content";
            response.html = LoadPagesList();
            response.js = CompileJs();

            return response;
        }

        public Inject LoadSubPages(int parentId)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup response
            response.element = ".winWebPages > .content .pages-list";
            response.html = LoadPagesList(parentId);
            response.js = CompileJs();

            return response;
        }


        private string LoadPagesList(int parentId = 0, bool layout = true, int orderBy = -1, string viewType = "", string search = "")
        {
            bool secureEdit = R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 4);
            bool secureSettings = R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 3);
            bool secureDelete = R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 2);
            bool secureCreate = R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 1);
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false)
                return "";

            string sql = null;
            int start = 1;
            int length = 100;
            string parentTitle = "";
            int rootId = 0;
            string rootTitle = "Root";
            if (parentId >= 0)
            {
                SqlDataReader pReader = R.Sql.ExecuteReader("SELECT p.title, p.parentid, r.title AS parenttitle FROM pages p LEFT JOIN pages r ON r.pageid=p.parentid WHERE p.pageid=" + parentId + " AND p.websiteid=" + R.Page.websiteId);
                if (pReader.HasRows == true)
                {
                    pReader.Read();
                    parentTitle = R.Util.Str.GetPageTitle(R.Sql.Get("title"));
            if (R.Util.IsEmpty(pReader["parentid"]) == false)
                    {
                        rootId = R.Sql.GetInt("parentid");
                    }
                    if (R.Util.IsEmpty(R.Sql.Get("parenttitle")) == false)
                    {
                        rootTitle = R.Sql.Get("parenttitle");
                    }
                }
                pReader.Dispose();
            }

            //setup sql query
            sql = "SELECT * FROM (SELECT ROW_NUMBER() OVER(";
            switch (orderBy)
            {
                case 1:
                case -1:
                    sql += "ORDER BY datecreated ASC";
                    break;
                case 2:
                    sql += "ORDER BY datecreated DESC";
                    break;
                case 3:
                    sql += "ORDER BY datemodified ASC";
                    break;
                case 4:
                    sql += "ORDER BY datemodified DESC";
                    break;
                case 5:
                    sql += "ORDER BY title ASC";
                    break;
                case 6:
                    sql += "ORDER BY title DESC";
                    break;
                case 7:
                    sql += "ORDER BY membersonly DESC, datecreated ASC";
                    break;
            }
            sql += ") AS rownum, p.pageid, p.galaxyid, p.title, p.tagwords, p.datecreated, p.datemodified, p.favorite, p.security, p.published, p.ratingtotal, p.ratedcount, p.description, (CASE WHEN p.templateid IS NULL THEN 0 ELSE p.templateid END) AS templateid ";
            sql += ", (SELECT COUNT(*) FROM pages WHERE websiteid=" + R.Page.websiteId + " AND parentid=p.pageid) AS haschildren ";
            sql += "FROM pages p WHERE p.websiteid=" + R.Page.websiteId + " AND p.ownerid=" + R.Page.ownerId + " AND p.deleted=0 AND p.enabled=1";
            if (!string.IsNullOrEmpty(search))
            {
                sql += " AND (p.title LIKE '%" + search + "%' OR p.tagwords LIKE '%" + search + "%' OR p.description LIKE '%" + search + "%')";
            }
            if (orderBy == 7)
            {
                sql += " AND p.membersonly=1";
            }
            if (parentId > -1)
            {
                if (parentId == 0)
                {
                    sql += " AND (p.parentid=0 OR p.parentid is null)";
                }
                else
                {
                    sql += " AND p.parentid=" + parentId;
                }

                //favorites only
            }
            else if (parentId == -1)
            {
                sql += " AND p.favorite=1";
            }
            sql += ") AS mytbl WHERE rownum >= " + start + " AND rownum < " + (start + (length + 1));
            sql += " ORDER BY haschildren DESC";

            //get page list from database
            SqlDataReader myReader = R.Sql.ExecuteReader(sql);
            string htm = "";
            if (viewType == "treeview")
            {
                htm = LoadLayoutForTreeView(myReader, parentId, parentTitle, secureDelete, secureSettings, secureCreate);

            }
            else if (viewType == "list" | string.IsNullOrEmpty(viewType))
            {
                htm = LoadLayoutForList(myReader, layout, parentId, parentTitle, rootId, rootTitle, secureDelete, secureSettings, secureCreate);

            }
            myReader.Dispose();

            return htm;
        }

        private string LoadLayoutForList(SqlDataReader myReader, bool layout, int parentId, string parentTitle, int rootId, string rootTitle, bool secureDelete, bool secureSettings, bool secureCreate)
        {
            List<string> htm = new List<string>();
            if (myReader.HasRows == true)
            {
                int i = 2;
                bool hasDelete = false;
                string pageTitle = "";
                string pageLink = "";
                int pageId = 0;
                string options = "";
                string expander = "";
                bool hasCreate = false;
                int hasChildren = 0;
                string color = "";
                string folderIcon = "";
                string folderDiv = "";

                if (layout == true)
                    htm.Add("<div class=\"pages-title\">" + LoadPagesTitleRow(parentId, parentTitle, rootId, rootTitle) + "</div><div class=\"pages-list\">");
                htm.Add("<ul class=\"columns-first\">");

                if (parentId >= 0)
                {
                    //page folder icon
                    i = (i == 2 ? 1 : 2);
                    folderIcon = "<div class=\"left icon icon-folder\"><a href=\"javascript:\" title=\"Go back to the parent folder\">" + "<svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-folder\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";

                    htm.Add("<li><div class=\"row color" + i + " item\"><div class=\"column-row\">" + "<div class=\"hover-title left\" onclick=\"R.editor.pages.load(" + rootId + ",'" + rootTitle + "','down')\" style=\"cursor:pointer\">" + folderIcon + "..</div>" + "<div class=\"hover-only right\">" + options + "</div>" + "</div><div class=\"clear\"></div></div></li>");
                }

                while (myReader.Read() == true)
                {
                    i = (i == 2 ? 1 : 2);
                    i = 1;
                    color = "empty";
                    pageTitle = R.Sql.Get("title").Split(new string[]{ "- "},0)[1];
            if (!string.IsNullOrEmpty(parentTitle))
                        pageTitle = pageTitle.Substring(parentTitle.Length + 1);
                    pageId = R.Sql.GetInt("pageid");
                    hasChildren = R.Sql.GetInt("haschildren");
                    hasDelete = true;
                    hasCreate = true;
                    pageLink = "";
                    options = "";
                    folderDiv = "";

                    //disable delete button
                    switch (pageTitle.ToLower())
                    {
                        case "home":
                        case "login":
                        case "error 404":
                        case "access denied":
                        case "about":
                        case "contact":
                            hasDelete = false;
                            break;
                    }

                    //disable sub-page creation
                    switch (pageTitle.ToLower())
                    {
                        case "login":
                        case "error 404":
                        case "access denied":
                            hasCreate = false;
                            break;
                    }

                    //change row color
                    switch (pageTitle.ToLower())
                    {
                        case "login":
                        case "about":
                        case "contact":
                            color = "yellow";
                            break;
                        case "error 404":
                        case "access denied":
                            color = "red";
                            break;
                        case "home":
                            color = "turqoise";
                            break;
                    }

                    //setup page link
                    if (R.isLocal == true)
                    {
                        if (R.Page.websiteId > 1)
                        {
                            pageLink = "/?pageid=" + pageId;
                        }
                    }
                    if (string.IsNullOrEmpty(pageLink))
                    {
                        if (R.Page.useAJAX == true)
                        {
                            pageLink = "/#" + ((!string.IsNullOrEmpty(parentTitle) ? parentTitle + " " : "") + pageTitle).Replace(" ", "-");
                        }
                        else
                        {
                            pageLink = "/" + ((!string.IsNullOrEmpty(parentTitle) ? parentTitle + " " : "") + pageTitle).Replace(" ", "-");
                        }
                    }

                    //setup options
                    if (secureDelete == true & hasDelete == true)
                    {
                        options += "<div class=\"right icon icon-delete\"><a href=\"javascript:\" onclick=\"R.editor.pages.remove('" + pageId + "');return false\" title=\"Permanently delete the page '" + pageTitle + "' and all of its sub-pages\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-close\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureSettings == true)
                    {
                        options += "<div class=\"right icon icon-settings\"><a href=\"javascript:\" onclick=\"R.editor.pages.settings.show('" + pageId + "');return false\" title=\"Page Settings for '" + pageTitle + "'\"><svg viewBox=\"0 0 36 36\"><use xlink:href=\"#icon-settings\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureCreate == true & hasCreate == true)
                    {
                        options += "<div class=\"right icon icon-add\"><a href=\"javascript:\" onclick=\"R.editor.pages.add.show('" + pageId + "','" + pageTitle + "');return false\" title=\"Create a new Sub-Page for '" + pageTitle + "'\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";
                    }

                    //page link
                    options += "<div class=\"right icon icon-add\"><a href=\"" + pageLink + "\" title=\"View Web Page\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-openwindow\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";

                    //page folder icon
                    folderIcon = "<div class=\"left icon icon-folder\">";
                    if (hasChildren > 0)
                    {
                        folderIcon += "<a href=\"javascript:\" title=\"View a list of sub-pages for '" + pageTitle + "'\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-folder\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a>";
                        folderDiv = " onclick=\"R.editor.pages.load(" + pageId + ",'" + pageTitle + "','up')\" style=\"cursor:pointer;\"";
                    }
                    folderIcon += "</div>";

                    htm.Add("<li><div class=\"row color" + i + " item page-" + pageId + "\"><div class=\"column-row\">" + "<div class=\"" + (!string.IsNullOrEmpty(folderDiv) ? "hover-title " : "") + "left\"" + folderDiv + ">" + folderIcon + pageTitle + "</div>" + "<div class=\"hover-only right\">" + options + "</div>" + "</div><div class=\"clear\"></div></div></li>");
                }
                htm.Add("</ul>");
                if (layout == true)
                {
                    htm.Add("</div>");
                    //htm.Add(RenderHelpColumn("/help/dashboard/pages.htm"));
                }
            }
            return string.Join("\n", htm);
        }

        private string LoadPagesTitleRow(int parentId, string parentTitle, int rootId, string rootTitle)
        {
            string options = "";
            string htm = "";
            options = "<div class=\"right\">" + 
                "<a href=\"javascript:\" onclick=\"R.editor.pages.showSearch()\" title=\"Search for pages within your website\">" + 
                "<svg viewBox=\"0 0 25 25\" style=\"width:15px; height:15px;\">" + 
                "<use xlink:href=\"#icon-search\" x=\"0\" y=\"0\" width=\"25\" height=\"25\" />" + 
                "</svg>" + "</a>" + "</div>" + 

                "<div class=\"right\" style=\"padding-right:7px;\">" + 
                "<a href=\"javascript:\" onclick=\"R.editor.pages.add.show(0,'')\" title=\"Add a new page to the root of your website\">" + 
                "<svg viewBox=\"0 0 15 15\" style=\"width:15px; height:15px;\">" + 
                "<use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" />" + 
                "</svg>" + "</a>" + "</div>";

            htm = "<div class=\"row color2\"><div class=\"column-row\"><div class=\"left page-title\"></div>" + 
                "<div class=\"hover-only right\">" + options + "</div>" + 
                "<div class=\"clear\"></div></div></div>";

            R.Page.RegisterJS("pagetitle", "R.editor.pages.tree.updateTitle();");
            return htm;
        }

        private string LoadLayoutForTreeView(SqlDataReader myReader, int parentId, string parentTitle, bool secureDelete, bool secureSettings, bool secureCreate)
        {
            List<string> htm = new List<string>();
            if (myReader.HasRows == true)
            {
                int i = 2;
                bool hasDelete = false;
                string pageTitle = "";
                string pageLink = "";
                int pageId = 0;
                string options = "";
                string expander = "";
                bool hasCreate = false;
                int hasChildren = 0;
                string color = "";

                if (parentId >= 0)
                {
                    htm.Add("<div class=\"sub\">");
                }
                else
                {
                    htm.Add("<div class=\"pages-treeview\">");
                }



                while (myReader.Read() == true)
                {
                    i = (i == 2 ? 1 : 2);
                    color = "empty";
                    pageTitle = R.Sql.Get("title").Split(new string[]{" - "},0)[1];
            if (!string.IsNullOrEmpty(parentTitle))
                        pageTitle = pageTitle.Substring(parentTitle.Length + 1);
                    pageId = R.Sql.GetInt("pageid");
                    hasChildren = R.Sql.GetInt("haschildren");
                    hasDelete = true;
                    hasCreate = true;
                    pageLink = "";
                    options = "";

                    //disable delete button
                    switch (pageTitle.ToLower())
                    {
                        case "home":
                        case "login":
                        case "error 404":
                        case "access denied":
                        case "about":
                        case "contact":
                            hasDelete = false;
                            break;
                    }

                    //disable sub-page creation
                    switch (pageTitle.ToLower())
                    {
                        case "login":
                        case "error 404":
                        case "access denied":
                        case "about":
                        case "contact":
                            hasCreate = false;
                            break;
                    }

                    //change row color
                    switch (pageTitle.ToLower())
                    {
                        case "login":
                        case "about":
                        case "contact":
                            color = "yellow";
                            break;
                        case "error 404":
                        case "access denied":
                            color = "red";
                            break;
                        case "home":
                            color = "turqoise";
                            break;
                    }

                    //setup page link
                    if (R.isLocal == true)
                    {
                        if (R.Page.websiteId > 1)
                        {
                            pageLink = "/?pageid=" + pageId;
                        }
                    }
                    if (string.IsNullOrEmpty(pageLink))
                    {
                        if (R.Page.useAJAX == true)
                        {
                            pageLink = "/#" + ((!string.IsNullOrEmpty(parentTitle) ? parentTitle + " " : "") + pageTitle).Replace(" ", "-");
                        }
                        else
                        {
                            pageLink = "/" + ((!string.IsNullOrEmpty(parentTitle) ? parentTitle + " " : "") + pageTitle).Replace(" ", "-");
                        }
                    }

                    //setup options
                    if (secureDelete == true & hasDelete == true)
                    {
                        options += "<div class=\"right icon icon-delete\"><a href=\"javascript:\" onclick=\"R.editor.pages.remove('" + pageId + "')\" title=\"Permanently delete this page\"><svg viewBox=\"0 0 15 15\" style=\"width:12px;\"><use xlink:href=\"#icon-close\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureSettings == true)
                    {
                        options += "<div class=\"right icon icon-settings\"><a href=\"javascript:\" onclick=\"R.editor.pages.settings.show('" + pageId + "')\" title=\"Page Settings\"><svg viewBox=\"0 0 36 36\"><use xlink:href=\"#icon-settings\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureCreate == true & hasCreate == true)
                    {
                        options += "<div class=\"right icon icon-add\"><a href=\"javascript:\" onclick=\"R.editor.pages.add.show('" + pageId + "','" + pageTitle + "')\" title=\"Create New Sub-Page\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";
                    }

                    //setup expander
                    expander = "<div class=\"expander " + color + "\">";
                    if (hasChildren > 0)
                    {
                        expander += "<div class=\"column right icon icon-expand\"><a href=\"javascript:\" onclick=\"R.editor.pages.expand('" + pageId + "')\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-expand\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";
                    }
                    else
                    {
                        expander += "<div class=\"column\">&nbsp;</div>";
                    }
                    expander += "</div>";


                    htm.Add("<div class=\"row color" + i + " item page-" + pageId + "\">" + expander + "<div class=\"column\"><a href=\"" + pageLink + "\">" + pageTitle + "</a>" + "<div class=\"hover-only right\">" + options + "</div>" + "</div><div class=\"clear\"></div></div>");
                }
                if (parentId >= 0)
                {
                    htm.Add("</div>");
                }
                else
                {
                    htm.Add("</div>");
                }

            }
            return string.Join("\n", htm);
        }

    }
}
