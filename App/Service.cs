using System;
using System.Collections.Generic;
using Microsoft.AspNet.Http;
using System.IO;
using Newtonsoft.Json;

namespace Rennder
{

    public enum enumInjectTypes
    {
        replace = 0,
        append = 1,
        before = 2,
        after = 3
    }

    public class PageComponent
    {
        public string panelClassId = "";
        public string itemId = "";
        public string html = "";
        public string css = "";
        [JsonIgnore]
        public Component Component;
    }

    public class PageRequest
    {
        public string pageTitle = "";
        public List<PageComponent> components = new List<PageComponent>();
        public List<string> @remove = new List<string>();
        public string js = "";
        public string css = "";
        public string editor = "";
    }

    public class Inject
    {
        public string element = "";
        public string html = "";
        public string js = "";
        public string css = "";
        public enumInjectTypes inject = 0;
    }

    public class WebRequest
    {
        public string html = "";
        public string contentType = "text/html";
    }

    public class Service
    {
        protected Core R;
        protected string[] Paths;
        public Dictionary<string, string> Form = new Dictionary<string, string>();
        public IFormFileCollection Files;

        public Service(Core RennderCore, string[] paths) {
            R = RennderCore;
            Paths = paths;
        }

        public struct structResponse
        {
            public string html;
            public string js;
            public string window;
        }

        protected structResponse lostResponse()
        {
            //if session is lost, reload the page
            structResponse response = new structResponse();
            response.js = "R.lostSession();";
            return response;
        }

        protected Inject lostInject()
        {
            //if session is lost, reload the page
            Inject response = new Inject();
            response.js = "R.lostSession();";
            return response;
        }

        protected PageRequest lostPageRequest()
        {
            //if session is lost, reload the page
            PageRequest response = new PageRequest();
            response.js = "R.lostSession();";
            return response;
        }

        protected string CompileJs()
        {
            if (R.Page.postJScode != null)
            {
                R.Page.postJS += string.Join("\n", R.Page.postJScode) + R.Page.postJSLast;
            }
            return R.Page.postJS;
        }

        protected string RenderHelpColumn(string filename)
        {
            if(R.Server.Cache.ContainsKey(filename) == false || R.isLocal == true)
            {
                string htm = "<div class=\"column-help dashboard-only\"><div>" + File.ReadAllText(R.Server.MapPath(filename)) + "</div></div>";
                R.Server.Cache[filename] = htm;
                return htm;
            }else
            {
                return (string)R.Server.Cache[filename];
            }

        }

        public void Unload()
        {
            R.Unload();
        }
    }
}
