
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace Rennder
{

    public struct structRMLDetails
    {
        public string name;
        public string vars;
        public string icon;
        public string iconVars;
    }

    public struct structRMLDesigns
    {
        public string rml;
        public DateTime datecreated;
    }

    public struct structRMLArray
    {
        public string id;
        public List<structRMLArrayItem> values;
    }

    public struct structRMLArrayItem
    {
        public string name;
        public List<structRMLArrayValues> values;
    }

    public struct structRMLArrayValues
    {
        public string name;
        public string value;
    }

    public struct structRMLVarsParsed
    {
        public List<string> nameVars;
        public List<structRMLArray> nameArray;
    }

    public struct structRmlNameParams
    {
        public string designName;
        public string varName;
        public int[] start;
    }

    public class RMLCache
    {
        public RmlButton[] rmlButton;
        public RmlMenu[] rmlMenu;
        public RmlPhotoList[] rmlPhotoList;
        public RmlStackPanel[] rmlStackPanel;
        public RmlTextbox[] rmlTextbox;
        public RmlList[] rmlList;
        public RmlLoading[] rmlLoading;

        public RmlPaging[] rmlPaging;
        public List<structRMLDetails> rmlButtonDetails;
        public List<structRMLDetails> rmlCommentDetails;
        public List<structRMLDetails> rmlGridDetails;
        public List<structRMLDetails> rmlMenuDetails;
        public List<structRMLDetails> rmlPhotoListDetails;
        public List<structRMLDetails> rmlStackPanelDetails;
        public List<structRMLDetails> rmlTextboxDetails;
        public List<structRMLDetails> rmlProductListDetails;
        public List<structRMLDetails> rmlListDetails;
        public List<structRMLDetails> rmlBlogEntryDetails;
        public List<structRMLDetails> rmlLoadingDetails;
        public List<structRMLDetails> rmlTooltipDetails;

        public List<structRMLDetails> rmlPagingDetails;
        public string[] rmlButtonNames;
        public string[] rmlCommentNames;
        public string[] rmlGridNames;
        public string[] rmlMenuNames;
        public string[] rmlPhotoListNames;
        public string[] rmlStackPanelNames;
        public string[] rmlTextboxNames;
        public string[] rmlProductListNames;
        public string[] rmlListNames;
        public string[] rmlBlogEntryNames;
        public string[] rmlLoadingNames;
        public string[] rmlTooltipNames;

        public string[] rmlPagingNames;
        public List<structRMLArray> rmlButtonArray;
        public List<structRMLArray> rmlCommentArray;
        public List<structRMLArray> rmlGridArray;
        public List<structRMLArray> rmlMenuArray;
        public List<structRMLArray> rmlPhotoListArray;
        public List<structRMLArray> rmlStackPanelArray;
        public List<structRMLArray> rmlTextboxArray;
        public List<structRMLArray> rmlProductListArray;
        public List<structRMLArray> rmlListArray;
        public List<structRMLArray> rmlBlogEntryArray;
        public List<structRMLArray> rmlLoadingArray;
        public List<structRMLArray> rmlTooltipArray;

        public List<structRMLArray> rmlPagingArray;
        public structRMLDesigns[] designRml = new structRMLDesigns[13];
    }

    public class RML
    {
        public Core R;
        private string layoutFolder = "";

        private RMLCache _cache;
        private struct structRMLArrayMatches
        {
            public int arrayIndex;
            public int valueIndex;
        }

        public RML(Core RennderCore, string layoutfolder)
        {
            R = RennderCore;
            layoutFolder = layoutfolder;
        }

        #region "Cache"
        private RMLCache cache
        {
            get
            {
                // debug only (clears cache)
                //if ((_cache == null))
                //{
                //    _cache = new RMLCache();
                //}
                //return _cache;
                // //////////////////////
                if (_cache != null)
                {
                    return _cache;
                }
                if (R.Server.Cache.ContainsKey("design-" + layoutFolder) == false)
                {
                    if ((_cache == null))
                    {
                        _cache = new RMLCache();
                    }
                }
                else
                {
                    _cache = (RMLCache)R.Server.Cache["design-" + layoutFolder];
                }
                return _cache;
            }
        }

        private void UpdateCache()
        {
            // save cache to application state
            R.Server.Cache["design-" + layoutFolder] = _cache;
        }

        public void ClearCache()
        {
            // remove all RML designs for this layout from application cache
            R.Server.Cache.Remove("design-" + layoutFolder);
            string[] folders = layoutFolder.Split('/');
            for (var x = 0; (x <= 12); x++)
            {
                // remove all multi-dropdown javascript arrays referencing this RML layout from application cache
                R.Server.Cache.Remove("multidropdown-" + folders[(folders.Length - 2)] + ("-" + x));
            }
            R.Server.Cache.Remove(layoutFolder + "default.htm");
            _cache = null;
        }

        public void CleanMemory()
        {
            // removes the large RML strings from memory at the end of the page render
            for (int x = 0; x < cache.designRml.Length; x++)
            {
                try
                {
                    if ((cache.designRml[x].rml != ""))
                    {
                        if ((DateTime.Now - cache.designRml[x].datecreated).Minutes > 5)
                        {
                            // only remove string if it is older than 5 minutes
                            cache.designRml[x].rml = "";
                        }
                    }
                }
                catch (Exception ex)
                {
                }
            }
        }

        #endregion

        #region "Rml Names"
        public string GetRmlNameFromIndex(int index)
        {
            string[] r = {
                "button",
                "comment",
                "grid",
                "menu",
                "photolist",
                "panel",
                "textbox",
                "productlist",
                "list",
                "blogentry",
                "loading",
                "tooltip",
                "paging"
            };
            return r[index];
        }

        private RmlClass[] rmlObject(int index)
        {
            switch (index)
            {
                case 0:
                    return cache.rmlButton;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    return cache.rmlMenu;
                case 4:
                    return cache.rmlPhotoList;
                case 5:
                    return cache.rmlStackPanel;
                case 6:
                    return cache.rmlTextbox;
                case 7:
                    break;
                case 8:
                    return cache.rmlList;
                case 9:
                    break;
                case 10:
                    return cache.rmlLoading;
                case 11:
                    break;
                case 12:
                    return cache.rmlPaging;
            }
            return null;
        }

        private List<structRMLDetails> rmlObjectDetails(int index)
        {
            switch (index)
            {
                case 0:
                    return cache.rmlButtonDetails;
                case 1:
                    return cache.rmlCommentDetails;
                case 2:
                    return cache.rmlGridDetails;
                case 3:
                    return cache.rmlMenuDetails;
                case 4:
                    return cache.rmlPhotoListDetails;
                case 5:
                    return cache.rmlStackPanelDetails;
                case 6:
                    return cache.rmlTextboxDetails;
                case 7:
                    return cache.rmlProductListDetails;
                case 8:
                    return cache.rmlListDetails;
                case 9:
                    return cache.rmlBlogEntryDetails;
                case 10:
                    return cache.rmlLoadingDetails;
                case 11:
                    return cache.rmlTooltipDetails;
                case 12:
                    return cache.rmlPagingDetails;
            }
            return null;
        }

        private string[] rmlObjectNames(int index)
        {
            switch (index)
            {
                case 0:
                    return cache.rmlButtonNames;
                case 1:
                    return cache.rmlCommentNames;
                case 2:
                    return cache.rmlGridNames;
                case 3:
                    return cache.rmlMenuNames;
                case 4:
                    return cache.rmlPhotoListNames;
                case 5:
                    return cache.rmlStackPanelNames;
                case 6:
                    return cache.rmlTextboxNames;
                case 7:
                    return cache.rmlProductListNames;
                case 8:
                    return cache.rmlListNames;
                case 9:
                    return cache.rmlBlogEntryNames;
                case 10:
                    return cache.rmlLoadingNames;
                case 11:
                    return cache.rmlTooltipNames;
                case 12:
                    return cache.rmlPagingNames;
            }
            return null;
        }

        private List<structRMLArray> rmlObjectArray(int index)
        {
            switch (index)
            {
                case 0:
                    return cache.rmlButtonArray;
                case 1:
                    return cache.rmlCommentArray;
                case 2:
                    return cache.rmlGridArray;
                case 3:
                    return cache.rmlMenuArray;
                case 4:
                    return cache.rmlPhotoListArray;
                case 5:
                    return cache.rmlStackPanelArray;
                case 6:
                    return cache.rmlTextboxArray;
                case 7:
                    return cache.rmlProductListArray;
                case 8:
                    return cache.rmlListArray;
                case 9:
                    return cache.rmlBlogEntryArray;
                case 10:
                    return cache.rmlLoadingArray;
                case 11:
                    return cache.rmlTooltipArray;
                case 12:
                    return cache.rmlPagingArray;
            }
            return null;
        }

        public List<structRMLArray> GetRmlDesignArrays(int index)
        {
            if ((rmlObjectArray(index) == null) == false)
            {
                if (rmlObjectArray(index).Count > 0)
                {
                    //list of arrays already exists in cache
                    return rmlObjectArray(index);
                }
            }

            List<structRMLArray> rmlArrays = new List<structRMLArray>();
            string d = GetDesignRml(index);
            int[] start = new int[4];
            int i = -1;
            start[0] = 0;
            do
            {
                //get a list of arrays
                start[0] = d.IndexOf("<rml:array", start[0]);
                if (start[0] >= 0)
                {
                    start[0] = start[0] + 10;
                    start[1] = d.IndexOf(">", start[0]);
                    if (start[1] >= 0)
                    {
                        i += 1;
                        string[] arrAttr = d.Substring(start[0], start[1] - start[0]).Split('\"');
                        start[0] = d.IndexOf("</rml:array>", start[1]);
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("id") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                structRMLArray newArray = new structRMLArray();
                                newArray.values = new List<structRMLArrayItem>();
                                newArray.id = arrAttr[x + 1];
                                start[3] = start[1];
                                do
                                {
                                    //get a list of items in the array
                                    start[2] = d.IndexOf("<rml:item", start[3]);
                                    if (start[2] >= 0 & start[2] < start[0])
                                    {
                                        start[2] = start[2] + 9;
                                        start[3] = d.IndexOf("/>", start[2]);
                                        if (start[3] >= 0)
                                        {
                                            i += 1;
                                            string[] arrAttr2 = d.Substring(start[2], start[3] - start[2]).Split('\"');
                                            structRMLArrayItem newItem = new structRMLArrayItem();
                                            newItem.values = new List<structRMLArrayValues>();
                                            for (int y = 0; y <= arrAttr2.Length - 1; y++)
                                            {
                                                if (arrAttr2[y].IndexOf("name") >= 0 & arrAttr2[y].IndexOf("=") >= 0)
                                                {
                                                    //get new item name
                                                    newItem.name = arrAttr2[y + 1];
                                                    y += 1;
                                                }
                                                else if (!string.IsNullOrEmpty(arrAttr2[y]))
                                                {
                                                    //add a key/value pair to the new item
                                                    structRMLArrayValues newValue = new structRMLArrayValues();
                                                    newValue.name = arrAttr2[y].Replace("=", "").Replace(" ", "");
                                                    newValue.value = arrAttr2[y + 1];
                                                    newItem.values.Add(newValue);
                                                    y += 1;
                                                }
                                            }
                                            newArray.values.Add(newItem);
                                        }
                                        else
                                        {
                                            break; 
                                        }
                                    }
                                    else
                                    {
                                        if (newArray.values.Count == 0)
                                        {
                                            newArray.id = "";
                                        }
                                        break; 
                                    }
                                } while (true);
                                if (newArray.id != "")
                                {
                                    rmlArrays.Add(newArray);
                                }
                                break; 
                            }
                        }
                        start[0] = start[1];
                    }
                    else
                    {
                        break; 
                    }
                }
                else
                {
                    break; 
                }
            } while (true);

            //update the cache
            switch (index)
            {
                case 0:
                    cache.rmlButtonArray = rmlArrays;
                    break;
                case 1:
                    cache.rmlCommentArray = rmlArrays;
                    break;
                case 2:
                    cache.rmlGridArray = rmlArrays;
                    break;
                case 3:
                    cache.rmlMenuArray = rmlArrays;
                    break;
                case 4:
                    cache.rmlPhotoListArray = rmlArrays;
                    break;
                case 5:
                    cache.rmlStackPanelArray = rmlArrays;
                    break;
                case 6:
                    cache.rmlTextboxArray = rmlArrays;
                    break;
                case 7:
                    cache.rmlProductListArray = rmlArrays;
                    break;
                case 8:
                    cache.rmlListArray = rmlArrays;
                    break;
                case 9:
                    cache.rmlBlogEntryArray = rmlArrays;
                    break;
                case 10:
                    cache.rmlLoadingArray = rmlArrays;
                    break;
                case 11:
                    cache.rmlTooltipArray = rmlArrays;
                    break;
                case 12:
                    cache.rmlPagingArray = rmlArrays;
                    break;
            }
            UpdateCache();

            return rmlArrays;
        }

        public Array GetRmlDesignNames(int index)
        {
            if ((rmlObjectNames(index) == null) == false)
            {
                if (rmlObjectNames(index).Length > 0)
                {
                    //list of names already exists in cache
                    return rmlObjectNames(index);
                }
            }


            List<structRMLDetails> rmlDesignList = GetRmlDesignNamesAndDetails(index);
            string[] rmlDesigns = new string[rmlDesignList.Count];
            int i = 0;
            foreach (structRMLDetails r in rmlDesignList)
            {
                rmlDesigns[i] = r.name;
                i += 1;
            }


            //update the cache
            switch (index)
            {
                case 0:
                    cache.rmlButtonNames = rmlDesigns;
                    break;
                case 1:
                    cache.rmlCommentNames = rmlDesigns;
                    break;
                case 2:
                    cache.rmlGridNames = rmlDesigns;
                    break;
                case 3:
                    cache.rmlMenuNames = rmlDesigns;
                    break;
                case 4:
                    cache.rmlPhotoListNames = rmlDesigns;
                    break;
                case 5:
                    cache.rmlStackPanelNames = rmlDesigns;
                    break;
                case 6:
                    cache.rmlTextboxNames = rmlDesigns;
                    break;
                case 7:
                    cache.rmlProductListNames = rmlDesigns;
                    break;
                case 8:
                    cache.rmlListNames = rmlDesigns;
                    break;
                case 9:
                    cache.rmlBlogEntryNames = rmlDesigns;
                    break;
                case 10:
                    cache.rmlLoadingNames = rmlDesigns;
                    break;
                case 11:
                    cache.rmlTooltipNames = rmlDesigns;
                    break;
                case 12:
                    cache.rmlPagingNames = rmlDesigns;
                    break;
            }
            UpdateCache();


            return rmlDesigns;
        }

        public List<structRMLDetails> GetRmlDesignNamesAndDetails(int index)
        {
            if ((rmlObjectDetails(index) == null) == false)
            {
                if (rmlObjectDetails(index).Count > 0)
                {
                    //list of names already exists in cache
                    return rmlObjectDetails(index);
                }
            }

            //create list of names
            List<string> rmlNames = new List<string>();
            List<structRMLDetails> rmlDesigns = new List<structRMLDetails>();
            structRMLDetails design = default(structRMLDetails);
            string d = GetDesignRml(index);
            int[] start = new int[4];
            int i = -1;
            start[0] = 0;

            //get rml arrays
            List<structRMLArray> rmlArrays = GetRmlDesignArrays(index);

            do
            {
                start[0] = d.IndexOf("<rml:" + GetRmlNameFromIndex(index), start[0]);
                if (start[0] >= 0)
                {
                    start[0] = start[0] + GetRmlNameFromIndex(index).Length - 1;
                    start[1] = d.IndexOf(">", start[0]);
                    if (start[1] >= 0)
                    {
                        i += 1;
                        design = new structRMLDetails();
                        string[] arrAttr = d.Substring(start[0], start[1] - start[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                if (arrAttr[x + 1].IndexOf("$rml.") >= 0)
                                {
                                    //get all combinations of names from within the arrays
                                    string icon = "";
                                    for (int y = x + 1; y <= arrAttr.Length - 1; y++)
                                    {
                                        //first, find the icon attribute
                                        if (arrAttr[y].IndexOf("icon") >= 0 & arrAttr[y].IndexOf("=") >= 0)
                                        {
                                            icon = arrAttr[y + 1];
                                            break; 
                                        }
                                    }
                                    //next, build a list of compiled design names along with compiled icon paths
                                    List<int> nameParts = new List<int>();
                                    string n = arrAttr[x + 1];
                                    string a = "";
                                    string b = "";
                                    string ico = "";
                                    string v = "";
                                    string[] vr = null;
                                    structRMLVarsParsed vars = ParseRMLVars(n, index);
                                    structRMLVarsParsed varsIcon = ParseRMLVars(icon, index);
                                    for (int y = 0; y <= vars.nameVars.Count - 1; y++)
                                    {
                                        nameParts.Add(0);
                                    }

                                    do
                                    {
                                        for (int y = nameParts.Count - 1; y >= 0; y += -1)
                                        {
                                            //incriment nameParts
                                            nameParts[y] += 1;
                                            if (nameParts[y] == vars.nameArray[y].values.Count)
                                            {
                                                if (y >= 0)
                                                {
                                                    nameParts[y] = 0;
                                                }
                                                else
                                                {
                                                    break; 
                                                }
                                            }
                                            else
                                            {
                                                break; 
                                            }
                                        }

                                        //create new design name & icon path from array
                                        design = new structRMLDetails();
                                        a = n;
                                        for (int y = 0; y <= nameParts.Count - 1; y++)
                                        {
                                            a = Regex.Replace(a, vars.nameVars[y].Replace("$", "\\$").Replace(".", "\\.") + "\\b", vars.nameArray[y].values[nameParts[y]].name);
                                        }

                                        design.name = a;
                                        ico = icon;

                                        //replace rml vals in icon with values
                                        for (int z = 0; z <= varsIcon.nameVars.Count - 1; z++)
                                        {
                                            //get value from nameArray
                                            v = varsIcon.nameVars[z].Replace("$rml.", "");
                                            vr = v.Split('.');
                                            for (int u = 0; u <= vars.nameArray.Count - 1; u++)
                                            {
                                                //main array id
                                                if (vars.nameArray[u].id == vr[0])
                                                {
                                                    for (int o = 0; o <= vars.nameArray[u].values[nameParts[u]].values.Count - 1; o++)
                                                    {
                                                        if (vars.nameArray[u].values[nameParts[u]].values[o].name == vr[1])
                                                        {
                                                            ico = Regex.Replace(ico, varsIcon.nameVars[z].Replace("$", "\\$").Replace(".", "\\.") + "\\b", vars.nameArray[u].values[nameParts[u]].values[o].value);
                                                            break; 
                                                        }
                                                    }
                                                    break; 
                                                }
                                            }
                                        }
                                        design.icon = ico;
                                        design.iconVars = ico.Replace(a.Split(new string[] { ": " }, StringSplitOptions.None)[0].ToLower().Replace(" ", ""), "{0}");
                                        design.vars = n;
                                        rmlDesigns.Add(design);
                                        rmlNames.Add(design.name);
                                    } while (true);
                                    design = new structRMLDetails();
                                }
                                else
                                {
                                    //get single name
                                    design.name = arrAttr[x + 1];
                                    design.vars = design.name;
                                }
                                x += 1;
                            }
                            else if (arrAttr[x].IndexOf("icon") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                if (design.vars != "")
                                {
                                    design.icon = arrAttr[x + 1];
                                }
                                x += 1;
                            }
                        }
                        if (design.vars != "")
                        {
                            if ((design.name == null) == false)
                            {
                                rmlDesigns.Add(design);
                                rmlNames.Add(design.name);
                            }
                        }

                    }
                    else
                    {
                        break; 
                    }
                }
                else
                {
                    break; 
                }
            } while (true);

            //update the cache
            //do not cache these names! millions of names!!!!!
            if (1 == 0)
            {
                switch (index)
                {
                    case 0:
                        cache.rmlButtonDetails = rmlDesigns;
                        break;
                    case 1:
                        cache.rmlCommentDetails = rmlDesigns;
                        break;
                    case 2:
                        cache.rmlGridDetails = rmlDesigns;
                        break;
                    case 3:
                        cache.rmlMenuDetails = rmlDesigns;
                        break;
                    case 4:
                        cache.rmlPhotoListDetails = rmlDesigns;
                        break;
                    case 5:
                        cache.rmlStackPanelDetails = rmlDesigns;
                        break;
                    case 6:
                        cache.rmlTextboxDetails = rmlDesigns;
                        break;
                    case 7:
                        cache.rmlProductListDetails = rmlDesigns;
                        break;
                    case 8:
                        cache.rmlListDetails = rmlDesigns;
                        break;
                    case 9:
                        cache.rmlBlogEntryDetails = rmlDesigns;
                        break;
                    case 10:
                        cache.rmlLoadingDetails = rmlDesigns;
                        break;
                    case 11:
                        cache.rmlTooltipDetails = rmlDesigns;
                        break;
                    case 12:
                        cache.rmlPagingDetails = rmlDesigns;
                        break;
                }
            }

            UpdateCache();

            return rmlDesigns;
        }

        public structRMLVarsParsed ParseRMLVars(string n, int index)
        {
            List<structRMLArray> rmlArrays = GetRmlDesignArrays(index);
            structRMLVarsParsed vars = new structRMLVarsParsed();
            vars.nameVars = new List<string>();
            vars.nameArray = new List<structRMLArray>();
            int[] start = new int[2];
            string a = "";
            string b = "";
            int i = 0;
            start[0] = 0;
            do
            {
                start[0] = n.IndexOf("$rml.", start[0]);
                if (start[0] >= 0)
                {
                    //find entire var reference
                    for (int y = start[0] + 4; y <= n.Length - 1; y++)
                    {
                        a = n.Substring(y, 1);
                        if (R.Util.Str.OnlyAlphabet(a, new string[] { "." }) == false | y == n.Length - 1)
                        {
                            if (y == n.Length - 1)
                            {
                                i = 1;
                            }

                            a = n.Substring(start[0], (y + i) - start[0]);
                            vars.nameVars.Add(a);
                            b = a.Replace("$rml.", "").Split('.')[0];
                            //find array that matches
                            for (int z = 0; z <= rmlArrays.Count - 1; z++)
                            {
                                if (rmlArrays[z].id == b)
                                {
                                    vars.nameArray.Add(rmlArrays[z]);
                                    break; 
                                }
                            }
                            if (vars.nameVars.Count > vars.nameArray.Count)
                                vars.nameVars.Remove(vars.nameVars[vars.nameVars.Count - 1]);
                            break; 
                        }
                    }
                    start[0] += 4;
                }
                else
                {
                    break; 
                }
            } while (true);
            return vars;
        }

        public string ReplaceRMLVars(string designNameVars, string designName, string str, int index)
        {
            List<int> nameParts = new List<int>();
            string a = "";
            string b = "";
            string s = str;
            string v = "";
            string[] vr = null;
            structRMLVarsParsed vars = ParseRMLVars(designNameVars, index);
            structRMLVarsParsed varsStr = ParseRMLVars(str, index);
            string[] nameArr = designName.Split(new string[] { ": " } ,StringSplitOptions.None);
            string[] nameVarArr = designNameVars.Split(new string[] { ": " }, StringSplitOptions.None);
            int i = -1;
            for (int y = 0; y < vars.nameVars.Count; y++)
            {
                i += 1;
                bool isf = false;
                do
                {
                    if (nameArr.Length > i)
                    {
                        if (nameVarArr[i].IndexOf("$rml.") < 0)
                        {
                            i += 1;
                        }
                        else
                        {
                            break; 
                        }
                    }
                    else
                    {
                        break; 
                    }
                } while (true);
                if (y < nameArr.Length && i < nameArr.Length)
                {
                    for (int x = 0; x < vars.nameArray[y].values.Count; x++)
                    {
                        if (vars.nameArray[y].values[x].name == nameArr[i])
                        {
                            nameParts.Add(x);
                            isf = true;
                            break; 
                        }
                    }
                }
                if (isf == false)
                    nameParts.Add(0);
            }

            a = designName;
            //replace rml vals in icon with values
            for (int z = 0; z <= varsStr.nameVars.Count - 1; z++)
            {
                //get value from nameArray
                v = varsStr.nameVars[z].Replace("$rml.", "");
                vr = v.Split('.');
                for (int u = 0; u <= vars.nameArray.Count - 1; u++)
                {
                    //main array id
                    if (vars.nameArray[u].id == vr[0])
                    {
                        for (int o = 0; o <= vars.nameArray[u].values[nameParts[u]].values.Count - 1; o++)
                        {
                            if (vars.nameArray[u].values[nameParts[u]].values[o].name == vr[1])
                            {
                                s = Regex.Replace(s, varsStr.nameVars[z].Replace("$", "\\$").Replace(".", "\\."), vars.nameArray[u].values[nameParts[u]].values[o].value);
                                //s = Regex.Replace(s, varsStr.nameVars[z].Replace("$", "\$").Replace(".", "\.") & "\b", vars.nameArray[u].values(nameParts[u]).values[o].value)
                                break; 
                            }
                        }
                        break; 
                    }
                }
            }

            return s;
        }

        public string GetDefaultRmlDesign(int index)
        {
            switch (index)
            {
                case 0:
                    //button

                    return "<rml:button><rml:text/></rml:button>";
                case 5:
                    //panel

                    return "<rml:panel><rml:content/></rml:panel>";
                case 10:
                    //loading
                    return "<rml:loading></rml:loading>";
            }

            return "<rml:" + GetRmlNameFromIndex(index) + "></rml:" + GetRmlNameFromIndex(index) + ">";
        }

        public structRmlNameParams FindRmlName(string designName, int index)
        {
            string designRml = GetDesignRml(index);
            string rmlName = GetRmlNameFromIndex(index);
            if (string.IsNullOrEmpty(designRml))
                designRml = GetDefaultRmlDesign(index);
            int[] start = new int[8];
            bool foundit = false;
            string newName = designName;
            string varName = "";
            string[] arrName = newName.Split(new string[] { ": " }, StringSplitOptions.None);

            start[0] = designRml.IndexOf("<rml:" + rmlName);
            start[1] = designRml.IndexOf(">", start[0]);
            start[3] = start[0];
            start[4] = start[1];
            //find raw string rml name within file
            do
            {
                if (start[1] >= 0 & start[0] >= 0)
                {
                    start[2] = designRml.IndexOf("\"" + newName + "\"", start[0]);
                    if (start[2] >= 0 & start[2] < start[1])
                    {
                        foundit = true;
                        break; 
                    }
                    else
                    {
                        start[0] = designRml.IndexOf("<rml:" + rmlName, start[1]);
                        if (start[0] >= 0)
                        {
                            start[1] = designRml.IndexOf(">", start[0]);
                        }
                    }
                }
                else
                {
                    break; 
                }
            } while (true);
            if (foundit == false)
            {
                //find design name by searching through all RML arrays (& matched combinations of array names)
                List<structRMLArray> rmlArray = GetRmlDesignArrays(index);
                List<List<structRMLArrayMatches>> matches = new List<List<structRMLArrayMatches>>();
                int mx = 0;
                int mz = 0;
                int[] mi = null;
                bool foundMatch = false;
                for (int x = 0; x <= arrName.Length - 1; x++)
                {
                    matches.Add(new List<structRMLArrayMatches>());
                }
                if ((rmlArray == null) == false)
                {
                    if (rmlArray.Count > 0)
                    {
                        //find each matching RML array for each part of the name (arrName)
                        for (int z = 0; z <= arrName.Length - 1; z++)
                        {
                            //find all possible matches of values
                            for (int x = 0; x <= rmlArray.Count - 1; x++)
                            {
                                if (rmlArray[x].values.Count > 0)
                                {
                                    for (int y = 0; y <= rmlArray[x].values.Count - 1; y++)
                                    {
                                        if (rmlArray[x].values[y].name == arrName[z])
                                        {
                                            structRMLArrayMatches match = new structRMLArrayMatches();
                                            match.arrayIndex = x;
                                            match.valueIndex = y;
                                            matches[z].Add(match);
                                            break;
                                        }
                                    }
                                    if(foundMatch == true) { foundMatch = false; break; }
                                }
                            }
                        }

                        if (matches[0].Count > 0)
                        {
                            mi = new int[matches.Count];
                            for (int x = 0; x <= mi.Length - 1; x++)
                            {
                                mi[x] = 0;
                            }
                            for (int i = 0; i <= arrName.Length - 1; i++)
                            {
                                //for each item in the name array, create a match combination name
                                if (matches[i].Count > 0)
                                {
                                    for (int x = 0; x <= matches[i].Count - 1; x++)
                                    {
                                        newName = designName;
                                        for (int z = 0; z <= matches.Count - 1; z++)
                                        {
                                            //create combination
                                            if (matches[z].Count > 0)
                                            {
                                                mx = matches[z][mi[z]].arrayIndex;
                                                mz = matches[z][mi[z]].valueIndex;
                                                //replace first part of name within rml design name with the var name
                                                if (z == 0)
                                                {
                                                    newName = "$rml." + rmlArray[mx].id + newName.Substring(rmlArray[mx].values[mz].name.Length);
                                                    //replace part of name within rml design name with the var name
                                                }
                                                else
                                                {
                                                    newName = newName.Replace(": " + rmlArray[mx].values[mz].name, ": $rml." + rmlArray[mx].id);
                                                }
                                            }

                                        }

                                        //check to see if combination exists in design RML code
                                        start[0] = designRml.IndexOf("\"" + newName + "\"");
                                        if (start[0] >= 0)
                                        {
                                            start[7] = designRml.IndexOf("\"", start[0] + 1);
                                            varName = designRml.Substring(start[0], start[7] - start[0]).Replace("\"", "");
                                            start[0] = start[0] - 10;
                                            start[1] = designRml.IndexOf(">", start[0]);
                                            foundit = true;
                                        }

                                        mi[0] += 1;
                                        if (mi[0] == matches[0].Count)
                                        {
                                            mi[0] = 0;
                                            //incriment mi
                                            mi[0] = 0;
                                            for (int u = 0; u <= matches.Count - 1; u++)
                                            {
                                                mi[u] += 1;
                                                if (mi[u] >= matches[u].Count)
                                                {
                                                    mi[u] = 0;
                                                }
                                                else
                                                {
                                                    break; 
                                                }
                                            }
                                        }
                                        if (foundit == true)
                                            break; 
                                    }
                                }
                                if (foundit == true)
                                    break; 
                            }
                        }
                    }
                }

                if (foundit == false)
                {
                    //last resort, use the first rml design
                    start[0] = start[3];
                    start[1] = start[4];
                    start[3] = designRml.IndexOf("name=\"", start[0]);
                    if (start[3] >= 0 & start[3] < start[4])
                    {
                        start[4] = designRml.IndexOf("\"", start[3] + 7);
                        if (start[4] >= 0 & start[4] < start[1])
                        {
                            varName = designRml.Substring(start[3] + 6, start[4] - (start[3] + 6));
                            designName = varName;
                        }
                    }
                }
            }

            structRmlNameParams r = new structRmlNameParams();
            r.start = start;
            r.varName = varName;
            r.designName = designName;



            return r;
        }

        public int GetTotalDesignCount(int index)
        {
            return 0;
        }
        #endregion

        #region "Rml Classes"

        public string GetDesignRml(int index)
        {
            bool exists = true;
            if (cache.designRml[index].rml == null)
            {
                exists = false;
            }
            if (exists == true)
            {
                if (cache.designRml[index].rml.Length <= 100)
                {
                    exists = false;
                }
            }
            if (exists == false)
            {
                string file = GetRmlNameFromIndex(index).ToString();
                if (File.Exists(R.Server.path(layoutFolder + file + ".rml")) == true)
                {
                    FileStream fs = new FileStream(R.Server.path(layoutFolder + file + ".rml"), FileMode.Open);
                    StreamReader d = new StreamReader(fs);
                    cache.designRml[index].rml = d.ReadToEnd();
                    cache.designRml[index].datecreated = DateTime.Now;
                    d.Dispose();
                    fs.Dispose();
                }
                else
                {
                    cache.designRml[index].datecreated = DateTime.Now;
                    cache.designRml[index].rml = GetDefaultRmlDesign(index);
                }
            }

            return cache.designRml[index].rml;
        }

        private RmlClass GetRmlClass(string designName, int index, string type = "")
        {
            int loadNew = -1;
            if (R.Util.IsEmpty(rmlObject(index)) == false)
            {
                if (R.Util.IsEmpty(rmlObject(index)[0]) == false)
                {
                    //find existing item in array
                    for (int x = 0; x <= rmlObject(index).Length - 1; x++)
                    {
                        if (R.Util.IsEmpty(rmlObject(index)[x]) == false)
                        {
                            if (rmlObject(index)[x].designName == designName)
                            {
                                loadNew = x;
                                break; 
                            }
                            else if (string.IsNullOrEmpty(designName))
                            {
                                if (rmlObject(index)[x].isDefaultDesign == true)
                                {
                                    loadNew = x;
                                    break; 
                                }
                            }
                        }
                    }
                    if (loadNew > -1)
                    {
                        return rmlObject(index)[loadNew];
                    }
                }
            }
            if (loadNew == -1)
            {
                //add new rml class to array
                if ((_cache == null))
                {
                    _cache = new RMLCache();
                }
                int i = 0;
                switch (index)
                {
                    case 0:
                        if ((cache.rmlButton != null))
                        {
                            Array.Resize(ref cache.rmlButton, cache.rmlButton.Length);
                            i = cache.rmlButton.Length - 1;
                        }
                        else
                        {
                            cache.rmlButton = new RmlButton[1];
                        }
                        cache.rmlButton[i] = new RmlButton(this, layoutFolder, designName, type);
                        break;
                    case 1: //was comments
                        break;

                    case 2: //was grid
                        break;

                    case 3:
                        if ((cache.rmlMenu != null))
                        {
                            Array.Resize(ref cache.rmlMenu, cache.rmlMenu.Length);
                            i = cache.rmlMenu.Length - 1;
                        }
                        else
                        {
                            cache.rmlMenu = new RmlMenu[1];
                        }
                        cache.rmlMenu[i] = new RmlMenu(this, layoutFolder, designName, type);
                        break;
                    case 4:
                        if ((cache.rmlPhotoList != null))
                        {
                            Array.Resize(ref cache.rmlPhotoList, cache.rmlPhotoList.Length);
                            i = cache.rmlPhotoList.Length - 1;
                        }
                        else
                        {
                            cache.rmlPhotoList = new RmlPhotoList[1];
                        }
                        cache.rmlPhotoList[i] = new RmlPhotoList(this, layoutFolder, designName, type);
                        break;
                    case 5:
                        if ((cache.rmlStackPanel != null))
                        {
                            Array.Resize(ref cache.rmlStackPanel, cache.rmlStackPanel.Length);
                            i = cache.rmlStackPanel.Length - 1;
                        }
                        else
                        {
                            cache.rmlStackPanel = new RmlStackPanel[1];
                        }
                        cache.rmlStackPanel[i] = new RmlStackPanel(this, layoutFolder, designName, type);
                        break;
                    case 6:
                        if ((cache.rmlTextbox != null))
                        {
                            Array.Resize(ref cache.rmlTextbox, cache.rmlTextbox.Length);
                            i = cache.rmlTextbox.Length - 1;
                        }
                        else
                        {
                            cache.rmlTextbox = new RmlTextbox[1];
                        }
                        cache.rmlTextbox[i] = new RmlTextbox(this, layoutFolder, designName, type);
                        break;
                    case 7://was product list
                        break;

                    case 8:
                        if ((cache.rmlList != null))
                        {
                            Array.Resize(ref cache.rmlList, cache.rmlList.Length);
                            i = cache.rmlList.Length - 1;
                        }
                        else
                        {
                            cache.rmlList = new RmlList[1];
                        }
                        cache.rmlList[i] = new RmlList(this, layoutFolder, designName, type);
                        break;
                    case 9://was blog entry
                        break;

                    case 10:
                        if ((cache.rmlLoading != null))
                        {
                            Array.Resize(ref cache.rmlLoading, cache.rmlLoading.Length);
                            i = cache.rmlLoading.Length - 1;
                        }
                        else
                        {
                            cache.rmlLoading = new RmlLoading[1];
                        }
                        cache.rmlLoading[i] = new RmlLoading(this, layoutFolder, designName, type);
                        break;
                    case 11:
                        break;
                    case 12:
                        if ((cache.rmlPaging != null))
                        {
                            Array.Resize(ref cache.rmlPaging, cache.rmlPaging.Length);
                            i = cache.rmlPaging.Length - 1;
                        }
                        else
                        {
                            cache.rmlPaging = new RmlPaging[1];
                        }
                        cache.rmlPaging[i] = new RmlPaging(this, layoutFolder, designName, type);
                        break;
                }
                UpdateCache();
                return rmlObject(index)[i];
            }
            return null;
        }

        public RmlButton GetRmlButton(string designName, string type = "")
        {
            return (RmlButton)GetRmlClass(designName, 0, type);
        }

        public RmlMenu GetRmlMenu(string designName)
        {
            return  (RmlMenu)GetRmlClass(designName, 3);
        }

        public RmlPhotoList GetRmlPhotoList(string designName)
        {
            return (RmlPhotoList)GetRmlClass(designName, 4);
        }

        public RmlStackPanel GetRmlStackPanel(string designName)
        {
            return (RmlStackPanel)GetRmlClass(designName, 5);
        }

        public RmlTextbox GetRmlTextbox(string designName)
        {
            return (RmlTextbox)GetRmlClass(designName, 6);
        }

        public RmlList GetRmlList(string designName)
        {
            return (RmlList)GetRmlClass(designName, 8);
        }


        public RmlLoading GetRmlLoading(string designName)
        {
            return (RmlLoading)GetRmlClass(designName, 10);
        }

        public RmlPaging GetRmlPaging(string designName)
        {
            return (RmlPaging)GetRmlClass(designName, 12);
        }
        #endregion

        #region "Other"
        /// <summary>
        /// Compiles an RML button into your RML code, replacing whatever tagName you provide with the compiled button.
        /// </summary>
        /// <param name="rmlCode"></param>
        /// <param name="tagName"></param>
        /// <param name="id"></param>
        /// <param name="href"></param>
        /// <returns></returns>
        public string CreateLinkButtonFromRml(string rmlCode, string tagName, string id, string href)
        {
            string htm = rmlCode.ToString();
            int[] start = new int[8];

            start[5] = htm.IndexOf("<rml:" + tagName);
            if (start[5] >= 0)
            {
                start[6] = htm.IndexOf(">", start[5]);
                if (start[6] >= 0)
                {
                    //convert link RML to button
                    string tmpSubmit = htm.Substring(start[5], start[6] - (start[5]));
                    tmpSubmit = tmpSubmit.Replace("'", "\"");
                    string[] tmpCarr = tmpSubmit.Split('\"');
                    string tmpBtnDesign = "";
                    string tmpBtnType = "";
                    string tmpBtnStyle = "";
                    string tmpBtnLbl = "";
                    for (int x = 0; x <= tmpCarr.Length - 1; x++)
                    {
                        if (tmpCarr[x].IndexOf("type") >= 0 & tmpCarr[x].IndexOf("=") >= 0)
                        {
                            tmpBtnType = tmpCarr[x + 1];
                        }
                        if (tmpCarr[x].IndexOf("design") >= 0 & tmpCarr[x].IndexOf("=") >= 0)
                        {
                            tmpBtnDesign = tmpCarr[x + 1];
                        }
                        if (tmpCarr[x].IndexOf("style") >= 0 & tmpCarr[x].IndexOf("=") >= 0)
                        {
                            tmpBtnStyle = tmpCarr[x + 1];
                        }
                        if (tmpCarr[x].IndexOf("text") >= 0 & tmpCarr[x].IndexOf("=") >= 0)
                        {
                            tmpBtnLbl = tmpCarr[x + 1];
                        }
                    }
                    start[7] = htm.IndexOf("</rml:" + tagName + ">", start[5]);
                    if (start[7] >= 0)
                    {
                        if (tmpBtnType != "button")
                        {
                            //link has HTML between 2 tags, create HTML link
                            htm = htm.Substring(0, start[5] - 1) + "<a href=\"" + href + "\">" + htm.Substring(start[6] + 1, start[7] - (start[6] + 1)) + "</a>" + htm.Substring(start[7] + 7 + tagName.Length);
                        }
                        else
                        {
                            //link is a button, generate RML button
                            if (tmpBtnType == "button")
                                tmpBtnType = "";
                            RmlButton myButton = this.GetRmlButton(tmpBtnDesign, tmpBtnType);
                            htm = htm.Substring(0, start[5] - 1) + myButton.GetCompiledRml(tmpBtnLbl, href, id) + htm.Substring(start[6] + 1).Replace("</rml:" + tagName + ">", "");
                        }

                    }
                    else if (!string.IsNullOrEmpty(tmpBtnType))
                    {
                        //link is a button, generate RML button
                        if (tmpBtnType == "button")
                            tmpBtnType = "";
                        RmlButton myButton = this.GetRmlButton(tmpBtnDesign, tmpBtnType);
                        htm = htm.Substring(0, start[5] - 1) + myButton.GetCompiledRml(tmpBtnLbl, href, id) + htm.Substring(start[6] + 1);
                    }

                }
            }

            return htm;
        }

        #endregion

    }

    public class RmlClass
    {
        public RML rmlBase;
        public string layoutFolder = "";
        public string designName = "";
        public string buttonType = "";
        public string stackPanel = "";
        public string evolverPanel = "";
        public bool isDefaultDesign = false;

        public int itemIndex = 0;
        public RmlClass(RML rmlBase, string layoutFolder, string designName, string type = "")
        {
        }

        public virtual void LoadRmlDesign(string designName, string type = "")
        {
        }
    }
}
