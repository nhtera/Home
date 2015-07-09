using System.Collections.Generic;

namespace Rennder.Services.Dashboard
{
    public class Sidebar : Service
    {
        public Sidebar(Core RennderCore, string[] paths) : base(RennderCore, paths)
        {
        }

        public Inject Load()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 4) == false) { return response; }

            //setup response
            response.element = ".winDashboardSidebar > .content";

            //setup scaffolding variables
            Dictionary<string, string> Elements = new Dictionary<string, string>();
            Elements = R.Server.SetupScaffold(new string[] { "website-title"});
            Elements["website-title"] = R.Page.websiteTitle;

            //finally, scaffold Rennder platform HTML
            response.html = R.Server.RenderScaffold("/app/dashboard/sidebar.html", Elements);
            response.js = CompileJs();

            return response;
        }
    }
}
