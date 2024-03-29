﻿namespace Rennder.Services
{
    public class App: Service
    {
        public App(Core RennderCore, string[] paths):base(RennderCore, paths)
        {
        }

        public PageRequest LoadPage(string title)
        {
            if (R.isSessionLost() == true) { return lostPageRequest(); } //check session

            R.Page.Url.path = title.Replace("-", " ");
            R.Page.pageTitle = R.Util.Str.GetWebsiteTitle(R.Page.pageTitle) + " - " + title;
            R.Page.GetPageId();
            R.Page.LoadPageFromId(R.Page.pageId);
            R.Page.Render();
            return R.Page.PageRequest;
        }

        public PageRequest Hash(string url)
        {
            if(R.isSessionLost() == true) { return lostPageRequest(); } //check session
            return ParseHash(url);
        }

        private PageRequest ParseHash(string url, bool again = false)
        {
             if (string.IsNullOrEmpty(url) | url.IndexOf("dashboard") == 0)
            {
                //load current page with no url
                string pageName = "Home";
                if (url.IndexOf("dashboard") == 0 & R.User.userId < 1) { pageName = "Login"; }
                R.Page.PageRequest = new PageRequest();
                R.Page.Url.path = "";
                if ((R.Page.isEditorLoaded == false & url.IndexOf("dashboard") == 0) | url.IndexOf("dashboard") < 0)
                {
                    R.Page.Url.path = pageName.ToLower().Replace("-", " ");
                    R.Page.pageTitle = R.Page.pageTitle.Split(new char[] { '-', ' ', '\"' })[0] + " - " + pageName.Replace("-", " ");
                    R.Page.GetPageId();
                    R.Page.LoadPageFromId(R.Page.pageId);
                }

                if (url.IndexOf("dashboard") == 0)
                {
                    R.Page.RegisterJS("dashhash", "setTimeout(function(){if(R.editor.dashboard){R.editor.dashboard.show();}},1000);");
                }
                R.Page.Render();
                return R.Page.PageRequest;
            }

            string[] arrHash = url.Split('\"');
            int oldPageId = R.Page.pageId;

            if (arrHash[0].IndexOf("+") < 0)
            {
                //found page with no query in url
                R.Page.Url.path = arrHash[0].Replace("-", " ");
                R.Page.pageTitle = R.Page.pageTitle.Split(new char[] { '-', ' ', '\"' })[0] + " - " + arrHash[0].Replace("-", " ");
                R.Page.GetPageId();
                R.Page.LoadPageFromId(R.Page.pageId);
                R.Page.Render();
                return R.Page.PageRequest;
            }

            return new PageRequest();
        }

        public string KeepAlive(string save = "")
        {
            if (R.isSessionLost() == true) { return "lost"; } //check session

            if (!string.IsNullOrEmpty(save))
            { 
                //SaveWebPage(save);
            }
            R.SaveViewState();
            return "";
        }
    }
}
