using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;

namespace Rennder
{
    public class RmlMenu : RmlClass
    {

        public struct structMenu
        {
            public string htmHead;
            public string htmFoot;
            public structMenuItems[] menuItems;
        }

        public struct structMenuItems
        {
            public structMenuItem itemDefault;
            public structMenuItem itemMouseOver;
            public structMenuItem itemSelected;
            public string splitHorz;
            public string splitVert;
        }

        public struct structButton
        {
            public string itemDefault;
            public string itemMouseOver;
        }

        public struct structMenuItem
        {
            public string htmItem;
            public string htmIcon;
            public string htmTreeview;
            public string[] htmTreeTab;
            public string[] htmTreeSub;
            public string[] htmTreeSubLine;
            public string[] htmTreeSubEnd;
            public structButton htmTreeExpand;
            public structButton htmTreeMinimize;
            public string htmTreeEmpty;
            public string htmTreeSubEmpty;
        }


        public structMenu rmlMenu = new structMenu();
        public RmlMenu(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
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
            string designRml = rmlBase.GetDesignRml(3); //3 = menu
            if (string.IsNullOrEmpty(designRml))
                designRml = rmlBase.GetDefaultRmlDesign(3);
            int[] start = new int[7];

            string newName = designName;
            string varName = "";
            start[0] = designRml.IndexOf("<rml:menu");
            start[1] = designRml.IndexOf(">", start[0]);

            if (!string.IsNullOrEmpty(newName))
            {
                structRmlNameParams r = rmlBase.FindRmlName(designName, 3);
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
            }


            //get outer HTML from RML design
            start[2] = designRml.IndexOf("</rml:menu>", start[1]);
            designRml = designRml.Substring(start[1] + 1, start[2] - start[1]);
            if (!string.IsNullOrEmpty(varName))
                designRml = rmlBase.ReplaceRMLVars(varName, newName, designRml, 3);

            start[1] = 1;
            start[3] = designRml.IndexOf("<rml:item>", start[1]);
            if (start[3] > 1 & start[2] > 1)
            {
                rmlMenu.htmHead = designRml.Substring(start[1] + 1, start[3] - (start[1] + 2));
            }
            else
            {
                return;
            }

            do
            {
                start[3] = designRml.IndexOf("<rml:item>", start[1]);
                int i = 0;
                if (start[3] < 1)
                {
                    break;
                }
                else if (start[3] < start[2])
                {
                    if ((rmlMenu.menuItems != null))
                    {
                        Array.Resize(ref rmlMenu.menuItems, rmlMenu.menuItems.Length + 1);
                    }
                    else
                    {
                        rmlMenu.menuItems = new structMenuItems[1];
                    }
                    i = rmlMenu.menuItems.Length - 1;

                    //find end of item tag
                    start[1] = designRml.IndexOf("</rml:item>", start[3]);

                    if (start[1] >= 0)
                    {
                        //find <rml:default>
                        start[4] = designRml.IndexOf("<rml:default>", start[3]);
                        if (start[4] >= 0 & start[4] < start[1])
                        {
                            start[5] = designRml.IndexOf("</rml:default>", start[4]);
                            if (start[5] >= 0 & start[5] < start[1])
                            {
                                //save menu item html
                                rmlMenu.menuItems[i].itemDefault = ParseMenuItem(designRml.Substring(start[4] + 13, start[5] - (start[4] + 13)).Replace("<rml:title />", "<rml:title/>").Replace("<rml:image />", "<rml:image/>"));
                            }
                        }

                        //find <rml:mouseover>
                        start[4] = designRml.IndexOf("<rml:mouseover>", start[3]);
                        if (start[4] >= 0 & start[4] < start[1])
                        {
                            start[5] = designRml.IndexOf("</rml:mouseover>", start[4]);
                            if (start[5] >= 0 & start[5] < start[1])
                            {
                                //save menu item html
                                rmlMenu.menuItems[i].itemMouseOver = ParseMenuItem(designRml.Substring(start[4] + 15, start[5] - (start[4] + 15)).Replace("<rml:title />", "<rml:title/>").Replace("<rml:image />", "<rml:image/>"));
                            }
                        }

                        //find <rml:selected>
                        start[4] = designRml.IndexOf("<rml:selected>", start[3]);
                        if (start[4] >= 0 & start[4] < start[1])
                        {
                            start[5] = designRml.IndexOf("</rml:selected>", start[4]);
                            if (start[5] >= 0 & start[5] < start[1])
                            {
                                //save menu item html
                                rmlMenu.menuItems[i].itemSelected = ParseMenuItem(designRml.Substring(start[4] + 14, start[5] - (start[4] + 14)).Replace("<rml:title />", "<rml:title/>").Replace("<rml:image />", "<rml:image/>"));
                            }
                        }
                    }
                    else
                    {
                        break; // TODO: might not be correct. Was : Exit Do
                    }
                }
                else
                {
                    break; // TODO: might not be correct. Was : Exit Do
                }

                //get horizontal splitter html
                start[4] = designRml.IndexOf("<rml:splitterhoriz>", start[3]);
                if (start[4] >= 0 & start[4] < start[2])
                {
                    start[5] = designRml.IndexOf("</rml:splitterhoriz>", start[4]);
                    rmlMenu.menuItems[i].splitHorz = designRml.Substring(start[4] + 19, start[5] - (start[4] + 19));
                }

                //get vertical splitter html
                start[4] = designRml.IndexOf("<rml:splittervert>", start[3]);
                if (start[4] >= 0 & start[4] < start[2])
                {
                    start[5] = designRml.IndexOf("</rml:splittervert>", start[4]);
                    rmlMenu.menuItems[i].splitVert = designRml.Substring(start[4] + 18, start[5] - (start[4] + 18));

                }
            } while (true);



            start[2] = designRml.IndexOf("</rml:menu>", start[1]);
            if (start[2] >= 0)
            {
                //get outer HTML from RML design
                start[7] = designRml.IndexOf("</rml:item>", start[1]);
                if (start[7] > 1)
                {
                    rmlMenu.htmFoot = designRml.Substring(start[7], start[2] - start[7]).Replace("</rml:menu>", "").Replace("</rml:item>", "");
                }
            }
        }

        private structMenuItem ParseMenuItem(string designRml)
        {
            structMenuItem item = new structMenuItem();
            //used for default, mouse over, & selected menu items
            int[] start = new int[5];
            item.htmItem = designRml;

            //get custom icon if it exists
            start[0] = item.htmItem.IndexOf("<rml:icon>");
            if (start[0] >= 0)
            {
                start[1] = item.htmItem.IndexOf("</rml:icon>");
                if (start[1] >= 0)
                {
                    item.htmIcon = item.htmItem.Substring(start[0] + 10, start[1] - (start[0] + 10));
                    //cut icon element & child elements out of html, then replace with <rml:icon/>
                    item.htmItem = item.htmItem.Substring(1, start[0] - 1) + "<rml:icon/>" + item.htmItem.Substring(start[1] + 11);
                }
            }

            //get treeview if it exists
            start[0] = item.htmItem.IndexOf("<rml:treeview>");
            if (start[0] >= 0)
            {
                start[1] = item.htmItem.IndexOf("</rml:treeview>");
                if (start[1] >= 0)
                {
                    item.htmTreeview = item.htmItem.Substring(start[0] + 14, start[1] - (start[0] + 14));
                    //cut icon element & child elements out of html, then replace with <rml:icon/>
                    item.htmItem = item.htmItem.Substring(1, start[0] - 1) + "<rml:treeview/>" + item.htmItem.Substring(start[1] + 15);

                    //now get all elements inside the treeview
                    bool isfound = false;
                    int findId = 0;
                    int[] inc = new int[5];
                    do
                    {
                        //find all elements inside the treeview that can be an array
                        isfound = false;

                        switch (findId)
                        {
                            case 0:
                                //tree-tab
                                start[0] = item.htmTreeview.IndexOf("<rml:tree-tab>");
                                if (start[0] >= 0)
                                {
                                    start[1] = item.htmTreeview.IndexOf("</rml:tree-tab>", start[0]);
                                    if (start[1] > start[0])
                                    {
                                        Array.Resize(ref item.htmTreeTab, inc[findId] + 1);
                                        item.htmTreeTab[inc[findId]] = item.htmTreeview.Substring(start[0] + 14, start[1] - (start[0] + 14));
                                        item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-tab/>" + item.htmTreeview.Substring(start[1] + 15);
                                        inc[findId] += 1;
                                        isfound = true;
                                    }
                                }
                                if (isfound == false)
                                    findId = 1;

                                break;
                            case 1:
                                //tree-sub
                                start[0] = item.htmTreeview.IndexOf("<rml:tree-sub>");
                                if (start[0] >= 0)
                                {
                                    start[1] = item.htmTreeview.IndexOf("</rml:tree-sub>", start[0]);
                                    if (start[1] > start[0])
                                    {
                                        Array.Resize(ref item.htmTreeSub, inc[findId] + 1);
                                        item.htmTreeSub[inc[findId]] = item.htmTreeview.Substring(start[0] + 14, start[1] - (start[0] + 14));
                                        item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-sub/>" + item.htmTreeview.Substring(start[1] + 15);
                                        inc[findId] += 1;
                                        isfound = true;
                                    }
                                }
                                if (isfound == false)
                                    findId = 2;

                                break;
                            case 2:
                                //tree-sub-line
                                start[0] = item.htmTreeview.IndexOf("<rml:tree-sub-line>");
                                if (start[0] >= 0)
                                {
                                    start[1] = item.htmTreeview.IndexOf("</rml:tree-sub-line>", start[0]);
                                    if (start[1] > start[0])
                                    {
                                        Array.Resize(ref item.htmTreeSubLine, inc[findId] + 1);
                                        item.htmTreeSubLine[inc[findId]] = item.htmTreeview.Substring(start[0] + 19, start[1] - (start[0] + 19));
                                        item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-sub-line/>" + item.htmTreeview.Substring(start[1] + 20);
                                        inc[findId] += 1;
                                        isfound = true;
                                    }
                                }
                                if (isfound == false)
                                    findId = 3;

                                break;
                            case 3:
                                //tree-sub-end
                                start[0] = item.htmTreeview.IndexOf("<rml:tree-sub-end>");
                                if (start[0] >= 0)
                                {
                                    start[1] = item.htmTreeview.IndexOf("</rml:tree-sub-end>", start[0]);
                                    if (start[1] > start[0])
                                    {
                                        Array.Resize(ref item.htmTreeSubEnd, inc[findId] + 1);
                                        item.htmTreeSubEnd[inc[findId]] = item.htmTreeview.Substring(start[0] + 18, start[1] - (start[0] + 18));
                                        item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-sub-end/>" + item.htmTreeview.Substring(start[1] + 19);
                                        inc[findId] += 1;
                                        isfound = true;
                                    }
                                }
                                if (isfound == false)
                                    break; // TODO: might not be correct. Was : Exit Do

                                break;
                        }

                    } while (true);

                    //get all other elements inside treeview
                    item.htmTreeExpand = new RmlMenu.structButton();
                    item.htmTreeMinimize = new RmlMenu.structButton();

                    //expand button
                    start[0] = item.htmTreeview.IndexOf("<rml:tree-expand>");
                    if (start[0] >= 0)
                    {
                        start[1] = item.htmTreeview.IndexOf("</rml:tree-expand>", start[0]);
                        if (start[1] > start[0])
                        {
                            start[2] = item.htmTreeview.IndexOf("<rml:tree-expand-default>", start[0]);
                            if (start[2] > start[0])
                            {
                                start[3] = item.htmTreeview.IndexOf("</rml:tree-expand-default>", start[2]);
                                if (start[3] > start[2])
                                {
                                    //found default expand button
                                    item.htmTreeExpand.itemDefault = item.htmTreeview.Substring(start[2] + 25, start[3] - (start[2] + 25));
                                }
                            }

                            start[2] = item.htmTreeview.IndexOf("<rml:tree-expand-mouseover>", start[0]);
                            if (start[2] > start[0])
                            {
                                start[3] = item.htmTreeview.IndexOf("</rml:tree-expand-mouseover>", start[2]);
                                if (start[3] > start[2])
                                {
                                    //found mouse-over expand button
                                    item.htmTreeExpand.itemMouseOver = item.htmTreeview.Substring(start[2] + 27, start[3] - (start[2] + 27));
                                }
                            }

                            item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-expand/>" + item.htmTreeview.Substring(start[1] + 18);
                        }
                    }

                    //minimize button
                    start[0] = item.htmTreeview.IndexOf("<rml:tree-minimize>");
                    if (start[0] >= 0)
                    {
                        start[1] = item.htmTreeview.IndexOf("</rml:tree-minimize>", start[0]);
                        if (start[1] > start[0])
                        {
                            start[2] = item.htmTreeview.IndexOf("<rml:tree-minimize-default>", start[0]);
                            if (start[2] > start[0])
                            {
                                start[3] = item.htmTreeview.IndexOf("</rml:tree-minimize-default>", start[2]);
                                if (start[3] > start[2])
                                {
                                    //found default expand button
                                    item.htmTreeMinimize.itemDefault = item.htmTreeview.Substring(start[2] + 27, start[3] - (start[2] + 27));
                                }
                            }

                            start[2] = item.htmTreeview.IndexOf("<rml:tree-minimize-mouseover>", start[0]);
                            if (start[2] > start[0])
                            {
                                start[3] = item.htmTreeview.IndexOf("</rml:tree-minimize-mouseover>", start[2]);
                                if (start[3] > start[2])
                                {
                                    //found mouse-over expand button
                                    item.htmTreeMinimize.itemMouseOver = item.htmTreeview.Substring(start[2] + 29, start[3] - (start[2] + 29));
                                }
                            }
                            item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-minimize/>" + item.htmTreeview.Substring(start[1] + 21);
                        }
                    }

                    //empty (button)
                    start[0] = item.htmTreeview.IndexOf("<rml:tree-empty>");
                    if (start[0] >= 0)
                    {
                        start[1] = item.htmTreeview.IndexOf("</rml:tree-empty>", start[0]);
                        if (start[1] > start[0])
                        {
                            item.htmTreeEmpty = item.htmTreeview.Substring(start[0] + 16, start[1] - (start[0] + 16));
                            item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-empty/>" + item.htmTreeview.Substring(start[1] + 18);
                        }
                    }

                    //sub-empty (button)
                    start[0] = item.htmTreeview.IndexOf("<rml:tree-sub-empty>");
                    if (start[0] >= 0)
                    {
                        start[1] = item.htmTreeview.IndexOf("</rml:tree-sub-empty>", start[0]);
                        if (start[1] > start[0])
                        {
                            item.htmTreeSubEmpty = item.htmTreeview.Substring(start[0] + 20, start[1] - (start[0] + 20));
                            item.htmTreeview = item.htmTreeview.Substring(1, start[0] - 1) + "<rml:tree-sub-empty/>" + item.htmTreeview.Substring(start[1] + 22);
                        }
                    }
                }
            }
            return item;
        }

    }
}