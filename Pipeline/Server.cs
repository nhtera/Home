using System;
using System.Collections.Generic;
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
                List<string> scaff = new List<string>(); string s = "";
                bool useScaffold = false; List<List<string>> closing = new List<List<string>>();

                //remove any unwanted blocks of HTML from scaffold
                for (var x = 0; x < newScaffold.Count; x++)
                {
                    if (x < newScaffold.Count - 1)
                    {
                        for (var y = x + 1; y < newScaffold.Count; y++)
                        {
                            //check for closing tag
                            if (newScaffold[y].name == "/" + newScaffold[x].name)
                            {
                                //add enclosed group of HTML to list for removing
                                List<string> closed = new List<string>();
                                closed.Add(newScaffold[x].name);
                                closed.Add(x.ToString());
                                closed.Add(y.ToString());
                                
                                if (settings.ContainsKey(newScaffold[x].name) == true)
                                {
                                    //check if user wants to include HTML 
                                    //that is between start & closing tag   
                                    s = settings[newScaffold[x].name];
                                    if (string.IsNullOrEmpty(s) == true) { s = ""; }
                                    if (s == "true" | s == "1")
                                    {
                                        closed.Add("true");
                                    }else { closed.Add(""); }
                                }else { closed.Add(""); }

                                closing.Add(closed);
                            }
                        }

                    }
                }

                //remove all groups of HTML in list that should not be displayed
                List<int> removeIndexes = new List<int>();
                bool isInList = false;
                for(int x = 0; x < closing.Count; x++)
                {
                    if(closing[x][3] != "true")
                    {
                        //add range of indexes from closing to the removeIndexes list
                        for (int y = int.Parse(closing[x][1]); y < int.Parse(closing[x][2]); y++)
                        {
                            isInList = false;
                            for (int z = 0; z < removeIndexes.Count; z++)
                            {
                                if (removeIndexes[z] == y) { isInList = true; break; }
                            }
                            if(isInList == false) { removeIndexes.Add(y); }
                        }
                    }
                }
                //physically remove HTML list items from scaffold
                int offset = 0;
                for (int z = 0; z < removeIndexes.Count; z++)
                {
                    newScaffold.RemoveAt(removeIndexes[z] - offset);
                    offset += 1;
                }

                //finally, replace scaffold variables with custom data
                for (var x = 0; x < newScaffold.Count; x++)
                {
                    //check if scaffold item is an enclosing tag or just a variable
                    useScaffold = true;
                    if(newScaffold[x].name.IndexOf('/') < 0)
                    {
                        for (int y = 0; y < closing.Count; y++)
                        {
                            if(newScaffold[x].name == closing[y][0]) { useScaffold = false; break; }
                        }
                    }else { useScaffold = false; }
                    
                    if ((settings.ContainsKey(newScaffold[x].name) == true 
                    || newScaffold[x].name.IndexOf('/') == 0) & useScaffold == true)
                    {
                        //inject string into scaffold variable
                        s = settings[newScaffold[x].name.Replace("/","")];
                        if (string.IsNullOrEmpty(s) == true) { s = ""; }
                        scaff.Add(s + newScaffold[x].htm);
                    }
                    else
                    {
                        //passively add htm, ignoring scaffold variable
                        scaff.Add(newScaffold[x].htm);
                    }
                    
                }

                //render scaffolding as HTML string
                return String.Join("", scaff.ToArray());
            }
            return "";
        }

        #endregion

        #region "System.UI.Web.Page.Server methods"
        public string path(string strPath = "")
        {
            return Path.GetFullPath("config.json").Replace("config.json","") + strPath.Replace("/", "\\");
        }

        public string MapPath(string strPath = "") { return path(strPath); }

        public string UrlDecode(string strPath)
        {
            return Uri.UnescapeDataString(strPath);
        }

        public string UrlEncode(string strPath)
        {
            return Uri.EscapeDataString(strPath);
        }
        
        #endregion
    }


}
