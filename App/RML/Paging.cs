namespace Rennder
{
    public class RmlPaging : RmlClass
    {

        public struct structButton
        {
            public string htm;
        }

        public structButton rmlDefault = new structButton();
        public structButton rmlMouseOver = new structButton();

        public structButton rmlSelected = new structButton();

        public RmlPaging(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
        {
            this.layoutFolder = layoutFolder;
            this.rmlBase = rmlBase;
            LoadRmlDesign(designName, type);
        }

        public override void LoadRmlDesign(string designName, string type = "")
        {
            if (this.designName == designName & !string.IsNullOrEmpty(designName))
                return;
            string designRml = rmlBase.GetDesignRml(12);
            //12 = paging
            if (string.IsNullOrEmpty(designRml))
                designRml = rmlBase.GetDefaultRmlDesign(12);
            //12 = paging
            int[] start = new int[7];

            string newName = designName;
            string varName = "";
            start[0] = designRml.IndexOf("<rml:paging");
            start[1] = designRml.IndexOf(">", start[0]);

            if (!string.IsNullOrEmpty(newName))
            {
                structRmlNameParams r = rmlBase.FindRmlName(designName, 12);
                //12 = paging
                start = r.start;
                newName = r.designName;
                varName = r.varName;
            }

            //set name of design that will be used
            this.designName = newName;

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

            start[2] = designRml.IndexOf("</rml:paging>", start[1]);

            if (start[2] >= 0)
            {
                designRml = designRml.Substring(start[1] + 1, start[2] - start[1]);
                if (!string.IsNullOrEmpty(varName))
                    designRml = rmlBase.ReplaceRMLVars(varName, newName, designRml, 12);
                //12 = paging

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

                start[2] = designRml.IndexOf("<rml:selected>");
                if (start[2] >= 0)
                {
                    start[3] = designRml.IndexOf("</rml:selected>", start[2]);
                    if (start[3] >= 0)
                    {
                        rmlSelected.htm = designRml.Substring(start[2] + 14, start[3] - (start[2] + 14));
                    }
                }
            }
        }

        public string GetCompiledRml(string title, string url, string id)
        {
            string myHtm = "";
            if (!string.IsNullOrEmpty(rmlMouseOver.htm))
            {
                //mouse over
                string modUrl = "";

                myHtm += "<div id=\"" + id + "_onclick\" onmouseover=\"HideElement('" + id + "d0');ShowElement('" + id + "o0');\"  onmouseout=\"HideElement('" + id + "o0');ShowElement('" + id + "d0');\" style=\"height:100%;cursor:pointer;\">" + "\n";
                myHtm += "<div class=\"absolute empty-href\"><a class=\"div-href\" style=\"display: inline-block; overflow: hidden;\" href=\"" + url + "\"></a></div>";
                myHtm += "<div id=\"" + id + "d0\" style=\"height:100%;\">" + rmlDefault.htm.Replace("<rml:text/>", title) + "</div>";
                myHtm += "<div id=\"" + id + "o0\" style=\"display:none; height:100%;\">" + rmlMouseOver.htm.Replace("<rml:text/>", title) + "</div>";
                myHtm += "</div>";
            }
            else
            {
                //no mouseover, could be just an anchor link...
                myHtm += GetCompiledHtml(rmlDefault.htm, title, url, id);
            }

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