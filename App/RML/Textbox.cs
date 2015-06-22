namespace Rennder
{
    public class RmlTextbox : RmlClass
    {


        public string htmTextbox = "";
        public RmlTextbox(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
        {
            this.layoutFolder = layoutFolder;
            //Me.designName = designName
            this.rmlBase = rmlBase;
            LoadRmlDesign(designName, type);
        }

        public override void LoadRmlDesign(string designName, string type = "")
        {
            if (this.designName == designName & !string.IsNullOrEmpty(designName))
                return;
            string designRml = rmlBase.GetDesignRml(6);
            //6=textbox 
            int[] start = new int[5];
            start[0] = designRml.IndexOf("<rml:textbox");
            if (start[0] < 1 | (designRml == null) == true)
                return;
            start[1] = designRml.IndexOf(">", start[0]);
            bool foundit = false;
            if (!string.IsNullOrEmpty(designName))
            {
                start[3] = start[0];
                start[4] = start[1];
                do
                {
                    if (start[1] >= 0 & start[0] >= 0)
                    {
                        start[2] = designRml.IndexOf("\"" + designName + "\"", start[0]);
                        if (start[2] >= 0 & start[2] < start[1])
                        {
                            foundit = true;
                            break; // TODO: might not be correct. Was : Exit Do
                        }
                        else
                        {
                            start[0] = designRml.IndexOf("<rml:textbox", start[1]);
                            if (start[0] >= 0)
                            {
                                start[1] = designRml.IndexOf(">", start[0]);
                            }
                        }
                    }
                    else
                    {
                        break; // TODO: might not be correct. Was : Exit Do
                    }
                } while (true);
                if (foundit == false)
                {
                    start[0] = start[3];
                    start[1] = start[4];
                }
            }

            //set name of design that will be used
            this.designName = designName;

            string[] arrAttr = designRml.Substring(start[0], start[1] - start[0]).Split('\"');
            for (int x = 0; x <= arrAttr.Length - 1; x++)
            {
                if (arrAttr[x].IndexOf("stackpanel") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                {
                    stackPanel = arrAttr[x + 1];
                }

                if (arrAttr[x].IndexOf("evolver") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                {
                    evolverPanel = arrAttr[x + 1];
                }
            }

            start[2] = designRml.IndexOf("</rml:textbox>", start[1]);
            if (start[2] >= 0)
            {
                htmTextbox = designRml.Substring(start[1] + 1, start[2] - (start[1] + 1));
            }
            else
            {
                htmTextbox = designRml;
            }


        }

        public string GetCompiledRml(string id, string style, string defaultValue, string textType = "text", string textLabel = "")
        {
            //find <rml:input> tag
            int[] start = new int[4];
            start[0] = htmTextbox.IndexOf("<rml:input");
            if (start[0] >= 0)
            {
                start[1] = htmTextbox.IndexOf(">", start[0]);
                if (start[1] >= 0)
                {
                    //get all attributes from input tag
                    string attrBg = "";
                    string attrStyle = "";
                    string[] arrAttr = htmTextbox.Substring(start[0] + 10, start[1] - (start[0] + 10)).Split('\"');
                    string attrClass = "";
                    string attrLabelClass = "";
                    for (int x = 0; x <= arrAttr.Length - 1; x++)
                    {
                        if (arrAttr[x].IndexOf("background") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                        {
                            attrBg = arrAttr[x + 1];
                        }
                        else if (arrAttr[x].IndexOf("style") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                        {
                            attrStyle = arrAttr[x + 1];
                        }
                        else if (arrAttr[x].IndexOf("labelclass") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                        {
                            attrLabelClass = arrAttr[x + 1];
                        }
                        else if (arrAttr[x].IndexOf("class") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                        {
                            attrClass = arrAttr[x + 1];
                        }
                    }

                    //find width if it exists
                    string attrWidth = "";
                    start[2] = style.IndexOf("width:");
                    if (start[2] >= 0)
                    {
                        start[3] = style.Length;
                        for (int x = start[2] + 6; x <= style.Length; x++)
                        {
                            if (rmlBase.R.Util.Str.IsNumeric(style.Substring(x, 1)) == false & style.Substring(x, 1) != "p" & style.Substring(x, 1) != "x" & style.Substring(x, 1) != "%")
                            {
                                start[3] = x;
                                break; // TODO: might not be correct. Was : Exit For
                            }
                        }
                        if (start[3] > start[2])
                        {
                            attrWidth = style.Substring(start[2] + 6, start[3] - (start[2] + 6));
                            style = style.Replace("width:" + attrWidth, "");
                        }
                    }

                    //build style
                    string strStyle = attrStyle + style;

                    //create textbox compiled HTML
                    string strInput = "<input id=\"" + id + "\" name=\"" + id + "\" style=\" autocomplete=\"off\"";
                    if (!string.IsNullOrEmpty(strStyle))
                        strInput += strStyle + ";";
                    if (attrBg == "hidden")
                    {
                        strInput += "background-color:transparent; border-style:none; border-width:0px;";
                        //add transparent style attributes
                    }
                    strInput += "\"";
                    if (!string.IsNullOrEmpty(defaultValue) & string.IsNullOrEmpty(textLabel))
                    {
                        strInput += " value=\"" + defaultValue + "\"";
                    }

                    if (string.IsNullOrEmpty(textLabel))
                    {
                        if (!string.IsNullOrEmpty(attrClass))
                        {
                            strInput += " class=\"" + attrClass + "\"";
                        }
                        strInput += " type=\"" + textType + "\" />" + "\n";
                    }


                    //convert special rml tags, such as <rml:width/>
                    string newHtmHead = htmTextbox.Substring(1, start[0] - 1);
                    string newHtmFoot = htmTextbox.Substring(start[1] + 1);

                    newHtmHead = newHtmHead.Replace("<rml:width/>", attrWidth);
                    newHtmFoot = newHtmFoot.Replace("<rml:width/>", attrWidth);

                    string htm = "";

                    if (!string.IsNullOrEmpty(textLabel))
                    {
                        htm = "<div id=\"div" + id + "_blank\">" + newHtmHead + strInput.Replace(id, id + "_blank") + " class=\"" + attrLabelClass + " opacity-50\" value=\"" + textLabel + "\" type=\"text\"  onfocus=\"FocusTextbox('" + id + "')\"/>" + newHtmFoot + "</div>";
                        htm += "<div id=\"div" + id + "\" style=\"display:none;\">" + newHtmHead + strInput + " class=\"" + attrClass + "\" value=\"" + defaultValue + "\" type=\"" + textType + "\" onblur=\"BlurTextbox('" + id + "')\"/>" + newHtmFoot + "</div>";
                    }
                    else
                    {
                        htm = newHtmHead + strInput + newHtmFoot;
                    }

                    htm = "<div class=\"relative\">" + htm + "</div>";
                    return htm;

                }
            }

            return "'" + htmTextbox + "'";
        }

        public string GetRmlHead()
        {
            int[] start = new int[2];
            start[0] = htmTextbox.IndexOf("<rml:input");
            if (start[0] >= 0)
            {
                start[1] = htmTextbox.IndexOf(">", start[0]);
                if (start[1] >= 0)
                {
                    return htmTextbox.Substring(1, start[0] - 1);
                }
            }
            return "";
        }

        public string GetRmlFoot()
        {
            int[] start = new int[2];
            start[0] = htmTextbox.IndexOf("<rml:input");
            if (start[0] >= 0)
            {
                start[1] = htmTextbox.IndexOf(">", start[0]);
                if (start[1] >= 0)
                {
                    return htmTextbox.Substring(start[1] + 1);
                }
            }
            return "";
        }
    }
}