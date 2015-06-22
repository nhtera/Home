using Microsoft.AspNet.Http;

namespace Rennder.Pipeline
{
    public class WebService
    {
        public WebService(Server server, HttpContext context)
        {

            context.Response.WriteAsync("Load Web Service");
        }


    }
}
