using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;

namespace Rennder
{
    public class RmlLoading : RmlClass
    {


        private string _htm = "";
        public RmlLoading(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
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
            string designRml = rmlBase.GetDesignRml(10);
            int[] start = new int[5];
            if (string.IsNullOrEmpty(designRml.Trim()))
                return;
            start[0] = designRml.IndexOf("<rml:loading");
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
                            break;
                        }
                        else
                        {
                            start[0] = designRml.IndexOf("<rml:loading", start[1]);
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
                    start[0] = start[3];
                    start[1] = start[4];
                }
            }

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

            start[2] = designRml.IndexOf("</rml:loading>", start[1]);

            _htm = designRml.Substring(start[1] + 1, start[2] - (start[1] + 1));
        }

        public string GetCompiledRml()
        {
            return _htm;
        }

    }
}