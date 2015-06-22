using System;
using Microsoft.AspNet.Http;

namespace Rennder
{
    public class Core
    {
        public String Version = "7.15.6.14";
        // #.#.#.#.#.# =  years since rennder.com domain registration (12/27/2007) [#]
        //                current year, month, day of release [#.#.#]
        //                revision of the day (optional) [#]

        public Server Server;
        public Pipeline.App App;
        public Pipeline.WebService WebService;
        public Utility.Util Util;
        public Sql Sql;
        public User User;
        public Page Page;
        public HttpContext Context;
        public HttpRequest Request;
        public HttpResponse Response;
        public ISessionCollection Session;
        public RML PageRml;
        public RML WebRml;

        public bool isFirstLoad = false;
        public bool isLocal = false;
        public bool isWebService = false;
        public string ViewStateId = "";
        public bool useViewState = true;

        public Core(Server server, HttpContext context, String viewstate = "", String type = "")
        {
            Server = server;
            Context = context;
            Request = context.Request;
            Response = context.Response;
            Session = context.Session;
            Sql = new Sql(this);
            Sql.Start();
            Util = new Utility.Util(this);
            User = new User(this);
            Page = new Page(this);

            //generate visitor id
            if (User.visitorId == "" || User.visitorId == null) { User.visitorId = Util.Str.CreateID(); }
            if (type == "service") { isWebService = true; }

        }

        public void Unload()
        {
            Sql.Close();
        }

        public void SaveViewState()
        {

        }
    }
}
