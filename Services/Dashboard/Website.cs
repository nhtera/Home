using System.Collections.Generic;

namespace Rennder.Services.Dashboard
{
    public class Website : Service
    {
        public Website(Core RennderCore, string[] paths) : base(RennderCore, paths)
        {
        }

        public Inject Load()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/website", 0) == false) { return response; }

            //setup response
            response.element = ".winDashboardWebsite > .content";

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] { "test" });
            Elements["test"] = R.Page.websiteTitle;

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/dashboard/website.html", Elements);
            response.js = CompileJs();

            return response;
        }
    }
}
