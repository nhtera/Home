﻿using System;
using System.Collections.Generic;
using Microsoft.AspNet.Http;

namespace Rennder.WebServices
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

    public class Service
    {
        protected Core R;

        public Service(Server server, HttpContext context, String viewstate = "") {
            R = new Core(server, context, viewstate, "service");
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

        public void Unload()
        {
            R.Unload();
        }
    }
}
