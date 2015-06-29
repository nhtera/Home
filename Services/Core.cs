using System;
using Microsoft.AspNet.Http;

namespace Rennder.Services
{
    public class Core: WebServices.Service
    {
        public Core(Server server, HttpContext context, String viewstate = ""):base(server, context, viewstate)
        {
            
        }
    }
}
