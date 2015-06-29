using Microsoft.AspNet.Http;

namespace Rennder.Pipeline
{
    public class WebService
    {
        public WebService(Server server, HttpContext context, string[] paths)
        {
            //decide which service to load
            string viewstate = "";
            WebServices.Service service;
            switch (paths[2])
            {
                case "core":
                    service = new Services.Core(server, context, viewstate);
                    break;

                case "editor":
                    break;

                case "dashboard":
                    break;

                case "app":
                    break;

                default:
                    break;
            }

            context.Response.WriteAsync("Load Web Service");
        }


    }
}
