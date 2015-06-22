using System;

namespace Rennder
{
    public class RmlPhotoList : RmlClass
    {

        public struct structList
        {
            public string htmHead;
            public string htmFoot;
            public structItem[] Items;
        }

        public struct structItem
        {
            public string htmHead;
            public string htmBody;
            public string htmFoot;
        }

        public structList rmlList = new structList();

        private int _column = -1;
        public RmlPhotoList(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
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
            string designRml = rmlBase.GetDesignRml(4);
            //4 = photolist
            if (string.IsNullOrEmpty(designRml))
                designRml = rmlBase.GetDefaultRmlDesign(4);
            int[] start = new int[8];

            string newName = designName;
            string varName = "";
            start[0] = designRml.IndexOf("<rml:photolist");
            start[1] = designRml.IndexOf(">", start[0]);

            if (!string.IsNullOrEmpty(newName))
            {
                structRmlNameParams r = rmlBase.FindRmlName(designName, 4);
                start = r.start;
                newName = r.designName;
                varName = r.varName;

            }
            else if (newName == "0")
            {
                //use absolutely no design, just an empty RML object
                return;
            }

            //set name of design that will be used
            this.designName = designName;

            //get rml:panel attributes
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

                if (arrAttr.Length > x + 2)
                {
                    if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0 & arrAttr[x + 1].IndexOf("$rml.") < 1)
                    {
                        this.designName = arrAttr[x + 1];
                    }
                }

            }

            //shrink the design rml to parse through
            start[3] = designRml.IndexOf("</rml:photolist>", start[1]);
            if (start[3] >= 0)
            {
                designRml = designRml.Substring(start[1] + 1, start[3] - start[1] - 1);
                if (!string.IsNullOrEmpty(varName))
                    designRml = rmlBase.ReplaceRMLVars(varName, newName, designRml, 4);
            }
            start[1] = 1;

            //get array of item HTML from photo list design
            start[5] = designRml.IndexOf("<rml:item>");
            string[] ditemHtm = null;
            int i = -1;
            if (start[5] >= 0)
            {
                //get outer HTML design from rml
                if (start[5] > 1)
                {
                    rmlList.htmHead += designRml.Substring(start[1] + 1, (start[5] - 1) - (start[1] + 1));
                }
                ditemHtm = designRml.Substring(start[5] + 10).Split(new char[] { 'r', 'm', 'l', ':', 'i', 't', 'e', 'm', '>', '\"' });
                for (int x = 0; x <= ditemHtm.Length - 1; x++)
                {
                    start[6] = ditemHtm[x].IndexOf("</rml:item>");
                    ditemHtm[x] = ditemHtm[x].Substring(1, start[6] - 1);
                    i += 1;
                    try
                    {
                        Array.Resize(ref rmlList.Items, i + 1);
                    }
                    catch (Exception ex)
                    {
                        rmlList.Items = new structItem[i + 1];
                    }
                    //remove <rml:body> code
                    start[5] = ditemHtm[x].IndexOf("<rml:body>");
                    if (start[5] >= 0)
                    {
                        rmlList.Items[i].htmHead = ditemHtm[x].Substring(1, start[5] - 1);
                        start[6] = ditemHtm[x].IndexOf("</rml:body>", start[5]);

                        if (start[6] >= 0)
                        {
                            rmlList.Items[i].htmBody = ditemHtm[x].Substring(start[5] + 10, start[6] - (start[5] + 10));
                            rmlList.Items[i].htmFoot = ditemHtm[x].Substring(start[6] + 11).Replace("</rml:photolist>", "");
                        }
                    }
                    else
                    {
                        //no body, just add head
                        rmlList.Items[i].htmFoot = ditemHtm[x].Replace("</rml:photolist>", "");
                    }
                }
            }


            //get outer HTML from RML design
            start[7] = 1;
            do
            {
                //find last </rml:item>
                start[6] = designRml.IndexOf("</rml:item>", start[7]);
                if (start[6] >= 0)
                {
                    start[7] = start[6] + 11;
                }
                else
                {
                    break; // TODO: might not be correct. Was : Exit Do
                }
            } while (true);
            if (start[7] > 1)
            {
                rmlList.htmFoot = designRml.Substring(start[7], designRml.Length - start[7]);
            }

        }

        public void ReloadPhotoList()
        {
            _column = -1;
        }

        public int GetNextColumnIndex()
        {
            _column += 1;
            if (_column > rmlList.Items.Length - 1)
            {
                _column = 0;
            }
            return _column;
        }

    }
}