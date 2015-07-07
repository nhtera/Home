namespace Rennder
{
    public class RmlButton : RmlClass
    {

        public struct structButton
        {
            public string htm;
        }

        public structButton rmlDefault = new structButton();
        public structButton rmlMouseOver = new structButton();

        public structButton rmlDisabled = new structButton();

        public RmlButton(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
        {
            this.layoutFolder = layoutFolder;
            this.rmlBase = rmlBase;
            LoadRmlDesign(designName, type);
        }

        public override void LoadRmlDesign(string designName, string type = "")
        {
            if (this.designName == designName & !string.IsNullOrEmpty(designName)) { return; }
            string designRml = rmlBase.GetDesignRml(0); //0 = button
            if (string.IsNullOrEmpty(designRml)) { designRml = rmlBase.GetDefaultRmlDesign(0); }
            int[] start = new int[7];

            string newName = designName;
            string varName = "";
            start[0] = designRml.IndexOf("<rml:button");
            start[1] = designRml.IndexOf(">", start[0]);

            if (!string.IsNullOrEmpty(newName))
            {
                structRmlNameParams r = rmlBase.FindRmlName(designName, 0);
                start = r.start;
                newName = r.designName;
                varName = r.varName;
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

                if (arrAttr[x].IndexOf("type") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                {
                    buttonType = arrAttr[x + 1];
                }
            }

            start[2] = designRml.IndexOf("</rml:button>", start[1]);

            if (start[2] >= 0)
            {
                designRml = designRml.Substring(start[1] + 1, start[2] - start[1]);

                if (!string.IsNullOrEmpty(varName))
                    designRml = rmlBase.ReplaceRMLVars(varName, newName, designRml, 0);

                start[2] = designRml.IndexOf("<rml:default>");
                if (start[2] >= 0)
                {
                    start[3] = designRml.IndexOf("</rml:default>", start[2]);
                    if (start[3] >= 0)
                    {
                        rmlDefault.htm = designRml.Substring(start[2] + 13, start[3] - (start[2] + 13));
                    }
                }

                start[2] = designRml.IndexOf("<rml:mouseover>");
                if (start[2] >= 0)
                {
                    start[3] = designRml.IndexOf("</rml:mouseover>", start[2]);
                    if (start[3] >= 0)
                    {
                        rmlMouseOver.htm = designRml.Substring(start[2] + 15, start[3] - (start[2] + 15));
                    }
                }

                start[2] = designRml.IndexOf("<rml:disabled>");
                if (start[2] >= 0)
                {
                    start[3] = designRml.IndexOf("</rml:disabled>", start[2]);
                    if (start[3] >= 0)
                    {
                        rmlDisabled.htm = designRml.Substring(start[2] + 14, start[3] - (start[2] + 14));
                    }
                }
            }
        }

        public string GetCompiledRml(string title, string url, string id, bool isDisabled = false, string containerStyle = "", string defaultStyle = "", string overStyle = "", bool width_100_Percent = false, string loadingHtm = "", bool useLoading = false,
        string tooltip = "", string target = "")
        {
            if (isDisabled == true)
            {
                return GetCompiledHtml(rmlDisabled.htm, title, url, id);
            }

            string myHtm = "";
            myHtm += "<div id=\"" + id + "_button\" style=\"" + containerStyle + "\">";
            if (!string.IsNullOrEmpty(rmlMouseOver.htm))
            {
                //mouse over
                string modUrl = "";
                string aUrl = url;
                if (url.IndexOf("javascript:") >= 0)
                {
                    modUrl = url.Substring(11);
                    aUrl = "javascript:";
                }
                if (useLoading == true)
                    modUrl += "buttonPress('" + id + "');";
                myHtm += "<div id=\"" + id + "_onclick\" onmouseover=\"$('#" + id + "d0').hide();$('#" + id + "o0').show();\"  onmouseout=\"$('#" + id + "o0').hide();$('#" + id + "d0').show();\" style=\"height:100%; ";
                if (width_100_Percent == true)
                {
                    myHtm += "width:100%;";
                }
                if (rmlDefault.htm.IndexOf("<a href=\"javascript:\"") == 0)
                {
                    myHtm += "cursor:pointer;";
                }

                myHtm += containerStyle + "\"";
                if (!string.IsNullOrEmpty(tooltip))
                    myHtm += " title=\"" + tooltip + "\"";
                myHtm += ">" + "\n";
                myHtm += "<div id=\"" + id + "loading\" class=\"absolute\" style=\"width:100%; display:none;\">" + loadingHtm + "</div>";
                myHtm += "<div id=\"" + id + "buttons\" style=\"" + containerStyle + "\">";

                if (rmlDefault.htm.IndexOf("<a href=\"javascript:\"") < 0)
                {
                    myHtm += "<div class=\"absolute empty-href\"><a class=\"div-href\" style=\"display: inline-block; overflow: hidden;\" href=\"" + aUrl + "\"" + (!string.IsNullOrEmpty(target) & url.IndexOf("javascript:") < 1 ? " target=\"" + target + "\"" : "") + (!string.IsNullOrEmpty(modUrl) ? " onclick=\"" + modUrl + "\"" : "") + "></a></div>";
                }
                else
                {
                    rmlMouseOver.htm = rmlDefault.htm.Replace("javascript:\"", url + "\"" + (!string.IsNullOrEmpty(target) ? " target=\"" + target + "\"" : "") + (!string.IsNullOrEmpty(modUrl) ? " onclick=\"" + modUrl + "\"" : ""));
                }

                myHtm += "<div id=\"" + id + "d0\" style=\"height:100%;" + defaultStyle + "\">" + rmlDefault.htm.Replace("<rml:text/>", title) + "</div>";
                myHtm += "<div id=\"" + id + "o0\" style=\"display:none; height:100%;" + overStyle + "\">";

                myHtm += rmlMouseOver.htm.Replace("<rml:text/>", title) + "</div>";
                myHtm += "</div>";
                myHtm += "</div>";
            }
            else
            {
                //no mouseover, could be just an anchor link...
                myHtm += "<div style=\"" + containerStyle + "\">" + GetCompiledHtml(rmlDefault.htm, title, url, id) + "</div>";
            }
            myHtm += "</div>";

            return myHtm;
        }

        private string GetCompiledHtml(string htm, string title, string url, string id)
        {
            if (string.IsNullOrEmpty(htm))
                return "<a href=\"" + url + "\">" + title + "</a>";
            return htm.Replace("<rml:text/>", title).Replace("<rml:url/>", url).Replace("<rml:id/>", id);
        }
    }
}
