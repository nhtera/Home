using System.Collections.Generic;

namespace Rennder.Services.Dashboard
{
    public class Interface : Service
    {
        public Interface(Core RennderCore, string[] paths) : base(RennderCore, paths)
        {
        }

        public Inject Load()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 4) == false) { return response; }

            //setup response
            response.element = ".winDashboardInterface > .content";

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(R, "/app/dashboard/interface.html", "", new string[] { "website-title" });
            scaffold.Data["website-title"] = R.Page.websiteTitle;

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }
    }
}
