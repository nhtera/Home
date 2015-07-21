using System;
using Microsoft.AspNet.Http;
using System.Text;
using System.IO;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;

namespace Rennder.Pipeline
{
    public class WebService
    {
        Core R;

        public WebService(Server server, HttpContext context, string[] paths)
        {
            //get parameters from request body, including ViewState ID
            string viewstate = "";
            StreamReader reader = new StreamReader(context.Request.Body, Encoding.UTF8);
            string data = reader.ReadToEnd();
            object[] parms = new object[0];
            if (data.Length > 0)
            {
                if(data.IndexOf(":") < 0 && data.IndexOf("=") >= 0)
                {
                    //form post data

                }else
                {
                    //JSON post data
                    Dictionary<string, object> attr = JsonConvert.DeserializeObject<Dictionary<string, object>>(data);
                    parms = new object[attr.Count - 1];
                    int x = 0; string val = "";
                    foreach (KeyValuePair<string, object> item in attr)
                    {
                        val = item.Value.ToString(); ;
                        if (item.Key == "viewstateId")
                        {
                            viewstate = val;
                        }
                        else
                        {
                            //convert value into integer or float
                            if (IsNumeric(val))
                            {
                                if(val.IndexOf('.') >= 0)
                                {
                                    parms[x] = float.Parse(val);
                                }
                                else
                                {
                                    parms[x] = Int32.Parse(val);
                                }
                                
                            }
                            else
                            {
                                parms[x] = item.Value;
                            }
                            
                            x = x + 1;
                        }
                    }
                }
                
            }else
            {
                //get viewstate from query string
            }

            R = new Core(server, context, viewstate, "service");
            R.Page.GetPageUrl();

            //load service class from URL path
            string className = "Rennder.Services." + paths[1];
            string methodName = paths[2];
            if(paths.Length == 4) { className += "." + paths[2]; methodName = paths[3]; }
            Type type =Type.GetType(className);
            Service service = (Service)Activator.CreateInstance(type, new object[] { R, paths });

            //parse form data
            if (data.Length > 0)
            {
                if (data.IndexOf(":") < 0 && data.IndexOf("=") >= 0)
                {
                    //form post data
                    string[] items = R.Server.UrlDecode(data).Split('&');
                    string[] item;
                    for(int x = 0; x < items.Length; x++)
                    {
                        item = items[x].Split('=');
                        service.Form.Add(item[0], item[1]);
                    }
                }
            }

            //execute method from service class
            MethodInfo method = type.GetMethod(methodName);
            object result = method.Invoke(service, parms);
            if(result != null)
            {
                switch (result.GetType().FullName)
                {
                    case "Rennder.WebRequest":
                        //send raw content (HTML)
                        WebRequest res = (WebRequest)result;
                        context.Response.ContentType = res.contentType;
                        context.Response.WriteAsync(res.html);
                        break;

                    default:
                        //JSON serialize web service response
                        string serialized = "{\"type\":\"" + result.GetType().FullName + "\", \"d\":" + JsonConvert.SerializeObject(result) + "}";

                        context.Response.ContentType = "text/json";
                        context.Response.WriteAsync(serialized);
                        break;
                }
            }else {
                context.Response.ContentType = "text/json";
                context.Response.WriteAsync("{\"type\":\"Empty\",\"d\":{}}");
            }

            //finally, unload the Rennder Core:
            //close SQL connection, save ViewState, save User info
            R.Unload();
        }

        private static bool IsNumeric(string s)
        {
            float output;
            return float.TryParse(s, out output);
        }
    }
}
