using System;
using System.Collections.Generic;

namespace Rennder
{
    public class RmlStackPanel : RmlClass
    {

        public struct structStackPanel
        {
            public string htmEvolverHead;
            public string htmEvolverFoot;
            public structComponent[] rmlComponent;
            public string htmSplitHoriz;
            public string htmSplitVert;
            public string stackDirection;
            public List <structRMLArray> usedArrays;
        }

        public struct structComponent
        {
            public string htmHead;
            public string htmHeadAndTitle;
            public string htmFoot;
        }


        public structStackPanel rmlStackPanel = new structStackPanel();
        public RmlStackPanel(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
        {
            this.layoutFolder = layoutFolder;
            this.rmlBase = rmlBase;
            LoadRmlDesign(designName, type);
        }

        public override void LoadRmlDesign(string designName, string type = "")
        {
            if (this.designName == designName & !string.IsNullOrEmpty(designName))
                return;
            string designRml = rmlBase.GetDesignRml(5); //5 = stackpanel
            if (string.IsNullOrEmpty(designRml))
                designRml = rmlBase.GetDefaultRmlDesign(5);
            int[] start = new int[7];

            string newName = designName;
            string varName = "";
            start[0] = designRml.IndexOf("<rml:panel");
            start[1] = designRml.IndexOf(">", start[0]);

            if (!string.IsNullOrEmpty(newName))
            {
                structRmlNameParams r = rmlBase.FindRmlName(designName, 5);
                start = r.start;
                newName = r.designName;
                varName = r.varName;

            }
            else if (newName == "0")
            {
                //use absolutely no design, just an empty RML object
                rmlStackPanel.htmEvolverHead = "";
                rmlStackPanel.htmEvolverFoot = "";
                rmlStackPanel.htmSplitHoriz = "";
                rmlStackPanel.htmSplitVert = "";
                rmlStackPanel.rmlComponent = new structComponent[1];
                rmlStackPanel.rmlComponent[0] = new structComponent();
                rmlStackPanel.rmlComponent[0].htmHead = "";
                rmlStackPanel.rmlComponent[0].htmFoot = "";
                return;
            }

            //set name of design that will be used
            this.designName = designName;

            //get rml:panel attributes
            string[] arrAttr = designRml.Substring(start[0], start[1] - start[0]).Split('\"');
            for (int x = 0; x <= arrAttr.Length - 1; x++)
            {
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
            start[3] = designRml.IndexOf("</rml:panel>", start[1]);
            if (start[3] >= 0)
            {
                designRml = designRml.Substring(start[1] + 1, start[3] - start[1] - 1);
                if (!string.IsNullOrEmpty(varName))
                    designRml = rmlBase.ReplaceRMLVars(varName, newName, designRml, 5);
            }
            start[1] = 1;

            //parse contents of rml design
            start[2] = designRml.IndexOf("<rml:evolver", start[1]);
            if (start[2] >= 0)
            {
                start[4] = designRml.IndexOf(">", start[2] + 10);
                if (start[4] >= 0)
                {
                    arrAttr = designRml.Substring(start[2], start[4] - start[2]).Split('\"');
                    for (int x = 0; x <= arrAttr.Length - 1; x++)
                    {
                        if (arrAttr[x].IndexOf("stack") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                        {
                            rmlStackPanel.stackDirection = arrAttr[x + 1];
                        }
                    }

                    rmlStackPanel.htmEvolverHead = designRml.Substring(start[1] + 1, start[2] - (start[1] + 1));
                    start[2] = start[4] + 1;

                    //find all component designs within the evolver tag
                    start[1] = 1;

                    string myHead = "";
                    string myHeadAndTitle = "";

                    do
                    {
                        start[0] = designRml.IndexOf("<rml:component>", start[1]);
                        if (start[0] >= 0)
                        {
                            start[1] = designRml.IndexOf("</rml:component>", start[0]);
                            //create new rml obj for component
                            int i = 0;
                            if (rmlBase.R.Util.IsEmpty(rmlStackPanel))
                            {
                                if ((rmlStackPanel.rmlComponent == null) == false)
                                {
                                    Array.Resize(ref rmlStackPanel.rmlComponent, rmlStackPanel.rmlComponent.Length + 1);
                                    i = rmlStackPanel.rmlComponent.Length - 1;
                                }
                                else
                                {
                                    rmlStackPanel.rmlComponent = new structComponent[1];
                                    i = 0;
                                }
                            }
                            else
                            {
                                rmlStackPanel.rmlComponent = new structComponent[1];
                                i = 0;
                            }

                            //parse and retrieve html for component
                            start[2] = designRml.IndexOf("<rml:content/>", start[0]);

                            //extract title from head
                            myHead = designRml.Substring(start[0] + 15, start[2] - (start[0] + 15));
                            myHeadAndTitle = myHead.Replace("<rml:header>", "").Replace("</rml:header>", "");
                            start[5] = myHead.IndexOf("<rml:header>");
                            if (start[5] >= 0)
                            {
                                start[6] = myHead.IndexOf("</rml:header>", start[5]);
                                if (start[6] >= 0)
                                {
                                    myHead = myHead.Substring(1, start[5] - 1) + myHead.Substring(start[6] + 13);
                                }
                            }

                            //set head & foot of component
                            rmlStackPanel.rmlComponent[i].htmHeadAndTitle = myHeadAndTitle;
                            rmlStackPanel.rmlComponent[i].htmHead = myHead;
                            rmlStackPanel.rmlComponent[i].htmFoot = designRml.Substring(start[2] + 14, start[1] - (start[2] + 14));
                            start[1] = start[1] + 16;
                        }
                        else
                        {
                            break; 
                        }
                    } while (true);

                    //get horizontal splitter html
                    start[0] = designRml.IndexOf("<rml:splithoriz>");
                    if (start[0] >= 0)
                    {
                        start[1] = designRml.IndexOf("</rml:splithoriz>", start[0]);
                        if (start[1] >= 0)
                        {
                            rmlStackPanel.htmSplitHoriz = designRml.Substring(start[0] + 16, start[1] - (start[0] + 16));
                            designRml = designRml.Substring(1, start[0] - 1) + designRml.Substring(start[1] + 17);
                            start[1] = start[1] + 16;
                        }
                    }

                    //get vertical splitter html
                    start[0] = designRml.IndexOf("<rml:splitvert>");
                    if (start[0] >= 0)
                    {
                        start[1] = designRml.IndexOf("</rml:splitvert>", start[0]);
                        if (start[1] >= 0)
                        {
                            rmlStackPanel.htmSplitVert = designRml.Substring(start[0] + 15, start[1] - (start[0] + 15));
                            designRml = designRml.Substring(1, start[0] - 1) + designRml.Substring(start[1] + 17);
                            start[1] = start[1] + 16;
                        }
                    }

                    //get evolver footer html
                    start[0] = designRml.IndexOf("</rml:evolver>");

                    if (start[0] >= 0)
                    {
                        rmlStackPanel.htmEvolverFoot = designRml.Substring(start[0] + 14, designRml.Length - (start[0] + 14));
                    }
                }
            }

            if (rmlStackPanel.rmlComponent == null)
            {
                Array.Resize(ref rmlStackPanel.rmlComponent, 1);
                rmlStackPanel.rmlComponent[0].htmHead = "";
                rmlStackPanel.rmlComponent[0].htmFoot = "";
            }else
            {
                if (rmlStackPanel.rmlComponent.Length == 0)
                {
                    Array.Resize(ref rmlStackPanel.rmlComponent, 1);
                    rmlStackPanel.rmlComponent[0].htmHead = "";
                    rmlStackPanel.rmlComponent[0].htmFoot = "";
                }
            }

        }
    }
}