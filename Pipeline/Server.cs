using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace Rennder
{
    public class Server
    {
        ////////////////////////////////////////////////
        //Server     (for application-wide memory store)
        ////////////////////////////////////////////////

        public int requestCount = 0;
        public float requestTime = 0;


        public struct structScaffold
        {
            public string name;
            public string htm;
        }

        //Dictionary used for caching non-serialized objects, files from disk, or raw text
        //be careful not to leak memory into the cache while causing an implosion!
        public Dictionary<string, object> Cache = new Dictionary<string, object>();

        //Dictionary used for HTML scaffolding of various files on the server. 
        //Value for key/value pair is an array of HTML (scaffold["key"][x].htm), 
        //         separated by scaffold variable name (scaffold["key"][x].name),
        //         where data is injected in between each array item.
        private Dictionary<string, List<structScaffold>> scaffold = new Dictionary<string, List<structScaffold>>();

        
        #region "Scaffolding"

        /// <summary>
        /// First, use SetupScaffold to setup a dictionary of variable names found within your scaffold html file. 
        /// Afterwards, set up the values for your variable names within the dictionary.
        /// Finally, execute RenderScaffold to generate the output HTML from a file,
        /// replacing the variable names in your HTML with the dictionary values.
        /// </summary>
        /// <param name="varNames"></param>
        /// <returns></returns>
        public Dictionary<string,string> SetupScaffold(string[] varNames)
        {
            Dictionary<string, string> settings = new Dictionary<string, string>();
            for (var x = 0; x < varNames.Length; x++)
            {
                settings.Add(varNames[x], "");
            }
            return settings;
        }


        /// <summary>
        /// First, use SetupScaffold to setup a dictionary of variable names found within your scaffold html file. 
        /// Afterwards, set up the values for your variable names within the dictionary.
        /// Finally, execute RenderScaffold to generate the output HTML from a file,
        /// replacing the variable names in your HTML with the dictionary values.
        /// </summary>
        /// <param name="file"></param>
        /// <param name="settings"></param>
        /// <returns></returns>
        public string RenderScaffold(string file, Dictionary<string, string> settings)
        {
            List<structScaffold> newScaffold;
            if (scaffold.ContainsKey(file) == false) {
                //get scaffold from html file
               newScaffold = new List<structScaffold>();
                var s = File.ReadAllText(path(file));
                var arr = s.Split(new string[] { "{{" }, StringSplitOptions.RemoveEmptyEntries);
                
                var i = 0; structScaffold scaff;
                for (var x = 0; x < arr.Length; x++)
                {
                    i = arr[x].IndexOf("}}");
                    scaff = new structScaffold();
                    if (i > 0)
                    {
                        scaff.name = arr[x].Substring(0, i);
                        scaff.htm = arr[x].Substring(i + 2);
                    }
                    else
                    {
                        scaff.name = "";
                        scaff.htm = arr[x];
                    }
                    newScaffold.Add(scaff);
                }
                scaffold.Add(file, newScaffold);
            }
            else
            {
                //get scaffold from memory
                newScaffold = scaffold[file];
            }

            if (newScaffold.Count > 0)
            {
                //render scaffold with paired settings data
                List<string> scaffold = new List<string>(); string s = "";
                for (var x = 0; x < newScaffold.Count; x++)
                {
                    //inject string into scaffold
                    if (settings.ContainsKey(newScaffold[x].name) == true)
                    {
                        s = settings[newScaffold[x].name];
                        if (string.IsNullOrEmpty(s) == true) { s = ""; }
                        scaffold.Add(s + newScaffold[x].htm);
                    }
                    else
                    {
                        scaffold.Add(newScaffold[x].htm);
                    }
                }
                return String.Join("", scaffold.ToArray());
            }
            return "";
        }

        #endregion

        #region "Microsoft Page.Server methods"
        public string path(string strPath = "")
        {
            return "c:\\projects\\Rennder5\\Rennder\\" + strPath.Replace("/","\\");
        }

        public string MapPath(string strPath = "") { return path(strPath); }

        public string UrlDecode(string strPath)
        {
            return Uri.EscapeDataString(strPath);
        }

        public string UrlEncode(string strPath)
        {
            return Uri.UnescapeDataString(strPath);
        }
        
        #endregion
    }


}
