using System.Collections.Generic;

namespace Rennder.Services.Dashboard
{
    public class Analytics : Service
    {
        public Analytics(Core RennderCore, string[] paths) : base(RennderCore, paths)
        {
        }

        public Inject Load()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/analytics", 0) == false) { return response; }

            //setup response
            response.element = ".winDashboardAnalytics > .content";

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(R, "/app/dashboard/analytics.html", "", new string[] { "test" });
            scaffold.Data["test"] = R.Page.websiteTitle;

            //finally, scaffold Rennder platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }
    }
}
