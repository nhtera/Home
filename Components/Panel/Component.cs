using System;
using System.Collections.Generic;

namespace Rennder.Components
{
    public class Panel : Component
    {
        protected int panelId = -1;
        protected List<Rennder.Panel> myPanels = new List<Rennder.Panel>();
        protected string[] slideOptions = new string[] { "h", "easeInOutQuad", "flipInY", "flipOutY", "0.7", "", "", "", "", "", "" };
        protected RmlStackPanel rmlSlideshowPanel;
        protected bool usesParentPanel = false;
        protected string[] arrItems;

        public string headHtml = "";
        public string footHtml = "";

        public Panel(Core RennderCore) : base(RennderCore)
        {
            
        }

        public override void Load()
        {
            base.Load();

            if (string.IsNullOrEmpty(DataField))
            {
                //get default design
                //panel-type|width-type|fixed-width|fixed-height|height-type|padding|responsive-width|min-width|(empty)| (0 - 8)
                //paging-itemid|transition-mode|transition-easing|transition-in|transition-out|transition-time|  (9 - 14)
                //paging-autoplay|paging-autoplay-delay|slideshow-panel-design|btn-prev-itemid|btn-next-itemid| (15 - 19)
                //{  title-01|alignment-01|design-01|uniqueId-01|pad-top|pad-right|pad-bottom|pad-left|overflow (each panel 0 - 8)
                //   background-image|bg-align|bg-size|bg-tile|bg-fixed|bg-width|bg-width-type|bg-height|bg-height-type (9 - 17)

                DataField = "2|0|300|100|0|10||||||||||||||||0px 0px 0px 0px{Cell 1|float||" + R.Util.Str.CreateID() + "|0|0|0|0|0||left top||1|0|100|%||%";
                //get 2nd panel design (first design is usually empty)
                DataField += "|" + R.Util.Str.CreateID();
            }

            Resizable = true;
            autoResize = false;

            arrItems = DataField.Split('{');
            string[] arrItem = null;
            string myJs = "";

            arrData = arrItems[0].Split('|');
            rmlStackPanels = new RmlStackPanel[arrItems.Length - 1];

            for (int x = 0; x <= rmlStackPanels.Length - 1; x++)
            {
                if (arrItems[x + 1].IndexOf("|") >= 0)
                {
                    rmlStackPanels[x] = R.PageRml.GetRmlStackPanel(arrItems[x + 1].Split('|')[2]);
                }
                    
            }


            if (arrData.Length > 8)
            {
                //auto-resize height
                if (arrData[0] != "4")
                {
                    if ((arrData[0] == "2" & arrData[4] == "0") == false)
                    {
                        autoHeight = true;
                    }
                    else
                    {
                        autoHeight = false;
                    }

                }
                else
                {
                    autoHeight = false;
                }
            }

            string[] slideMargins = { "0", "0", "0", "0" };

            if (arrData.Length <= 20) { Array.Resize(ref arrData, 21); }
                
            slideOptions[0] = arrData[10];
            slideOptions[1] = arrData[11];
            slideOptions[2] = arrData[12];
            slideOptions[3] = arrData[13];
            slideOptions[4] = arrData[14];
            slideOptions[5] = arrData[15];
            slideOptions[6] = arrData[16];
            slideOptions[7] = arrData[17];
            slideOptions[8] = arrData[20];

            if (string.IsNullOrEmpty(slideOptions[8])) { slideOptions[8] = "0px 0px 0px 0px"; }
            slideMargins = slideOptions[8].Replace(" ", "").Split(new string[] {"px"}, StringSplitOptions.None);
            slideOptions[9] = "<div style=\"height:" + slideMargins[0] + "px; font-size:0px;\"></div>";
            slideOptions[8] = "margin:0px " + slideMargins[1] + "px " + slideMargins[2] + "px " + slideMargins[3] + "px; height:100%;";
            rmlSlideshowPanel = R.PageRml.GetRmlStackPanel(slideOptions[7]);
            string widthHeightMargins = "width:calc(100% - " + slideMargins[1] + "px); height:calc(100% - " + slideMargins[2] + "px);";
            string HeightMargins = "height:calc(100% - " + (int.Parse(slideMargins[0]) + int.Parse(slideMargins[2])) + "px);";
            if (rmlSlideshowPanel == null){rmlSlideshowPanel = R.PageRml.GetRmlStackPanel("");}

            //fixed width
            if (arrData[1] == "2")
            {
                autoResize = false;
                Resizable = true;

                //auto-resize all panels
            }
            else if (arrData[1] == "1")
            {
                autoResize = true;
                Resizable = false;

                //manually resize the panel
            }
            else if (arrData[0] != "3" & arrData[1] == "0")
            {
                autoResize = false;
                Resizable = true;

                //responsive width
            }
            else if (arrData[0] == "3" & arrData[1] == "0")
            {
                autoResize = false;
                Resizable = true;
                if (DivItem.Attributes.ContainsKey("class"))
                {
                    DivItem.Attributes["class"] += " responsive-grid columns" + arrData[6];
                }
                else
                {
                    DivItem.Attributes["class"] = "responsive-grid columns" + arrData[6];
                }
                
                if (string.IsNullOrEmpty(arrData[7]))
                    arrData[7] = "300";
                DivItem.Attributes["colwidth"] = arrData[7];
            }



            //show outer panel
            if (arrData[0] == "4")
            {
                headHtml = rmlSlideshowPanel.rmlStackPanel.htmEvolverHead + rmlSlideshowPanel.rmlStackPanel.rmlComponent[0].htmHead + slideOptions[9] + "<div class=\"slides-container\" style=\"" + widthHeightMargins + "\"><div class=\"slides\" style=\"" + slideOptions[8] + "height:100%;\">";
                footHtml = "</div></div>" + rmlSlideshowPanel.rmlStackPanel.rmlComponent[0].htmFoot + rmlSlideshowPanel.rmlStackPanel.htmEvolverFoot;
            }
            else if (arrData[0] == "3")
            {
                headHtml = rmlSlideshowPanel.rmlStackPanel.htmEvolverHead + rmlSlideshowPanel.rmlStackPanel.rmlComponent[0].htmHead + slideOptions[9] + "<div style=\"" + widthHeightMargins + "\"><div class=\"grid-container\" style=\"" + slideOptions[8] + "\">";
                footHtml = "</div></div>" + rmlSlideshowPanel.rmlStackPanel.rmlComponent[0].htmFoot + rmlSlideshowPanel.rmlStackPanel.htmEvolverFoot;
            }
            else
            {
                headHtml = rmlSlideshowPanel.rmlStackPanel.htmEvolverHead + rmlSlideshowPanel.rmlStackPanel.rmlComponent[0].htmHead + slideOptions[9] + "<div style=\"" + HeightMargins + "\"><div style=\"height:100%;" + slideOptions[8] + "\">";
                footHtml = "</div></div>" + rmlSlideshowPanel.rmlStackPanel.rmlComponent[0].htmFoot + rmlSlideshowPanel.rmlStackPanel.htmEvolverFoot;
            }

            for (int x = 1; x <= arrItems.Length - 1; x++)
            {
                arrItem = arrItems[x].Split('|');
                LoadPanel(arrItem[0], arrItem[1], rmlStackPanels[x - 1], x, arrItems.Length - 1);
            }



            //add masonry (mosaic) to the grid
            if (arrData[0] == "3" & arrItems.Length > 3 & arrData[4] != "2")
            {
                myJs += "setTimeout(function(){$('#c" + itemId + " .grid-container').masonry({itemSelector:'.panel-grid', isResizeBound:false});";

                if (R.Page.isEditable == true)
                {
                    myJs += "function " + DivItem.ID + "_ResizeStopComponent(){";
                    myJs += "$('c" + itemId + "').masonry();}";
                }
            }

            if (!string.IsNullOrEmpty(myJs))
                R.Page.RegisterJS("panel" + itemId, myJs + "}catch[ex]{}");
        }

        private void LoadPanel(string title, string direction, RmlStackPanel rmlPanel, int panelIndex, int totalIndexes, string padding = "")
        {
            if ((arrData == null) == true)
            {
                arrData = DataField.Split('{')[0].Split('|');
            }

            //load Panel
            Rennder.Panel myPanel = new Rennder.Panel(R);
            myPanel.ID = "EvStack" + itemId + R.Util.Str.replaceOnlyAlphaNumeric(title.Replace(" ", ""));
            myPanel.Name = itemId + R.Util.Str.replaceOnlyAlphaNumeric(title.Replace(" ", ""));
            myPanel.isEmpty = false;
            myPanel.PageId = pageId;
            myPanels.Add(myPanel);
            R.Page.AddPanel(myPanel);
            SetUpPanel(myPanel, rmlPanel, panelIndex, totalIndexes);
            myPanel.ComponentDesigns = rmlPanel.rmlStackPanel.rmlComponent;
        }

        public void SetUpPanel(Rennder.Panel myPanel, RmlStackPanel rmlPanel, int panelIndex, int totalIndexes)
        {
            int panelPadding = 0;
            dynamic i = 0;
            string[] arrAttributes = arrItems[panelIndex].Split('|');
            if (arrData.Length > 5)
            {
                if (R.Util.Str.IsNumeric(arrData[5]) == true)
                    panelPadding = int.Parse(arrData[5]);
            }

            switch (arrData[0])
            {

                case "2":
                    //vertically stacked
                    if (panelIndex > 1)
                    {
                        myPanel.StackHead = "<div style=\"height:" + panelPadding + "px; font-size:0px;\"></div>";
                    }
                    else
                    {
                        myPanel.StackHead = "";
                    }
                    myPanel.StackFoot = "";

                    break;
                case "3":
                    //grid
                    myPanel.StackHead = "<div class=\"panel-grid\" style=\"float:left; padding:0px " + panelPadding + "px " + panelPadding + "px 0px;\">";
                    if (panelIndex == totalIndexes)
                    {
                        myPanel.StackFoot = "</div><div style=\"clear:both;\"></div>";
                    }
                    else
                    {
                        myPanel.StackFoot = "</div>";
                    }

                    break;
                case "4":
                    //only one panel
                    if (totalIndexes > 1)
                    {
                        string shead = "<div class=\"slide" + (panelIndex == 1 ? " first" : (panelIndex == totalIndexes ? " last" : ""));
                        if (arrData[0] == "4" & arrItems.Length > 2)
                        {
                            if (slideOptions[0] == "f")
                            {
                                shead += " absolute";
                                if (panelIndex > 1)
                                {
                                    shead += "\" style=\"visibility:hidden";
                                }

                            }
                        }
                        shead += "\">";
                        myPanel.StackHead = shead;
                        myPanel.StackFoot = "</div>";
                    }

                    break;

            }
            i = -1;

            myPanel.DesignHead += rmlPanel.rmlStackPanel.rmlComponent[0].htmHead;
            myPanel.DesignFoot = rmlPanel.rmlStackPanel.rmlComponent[0].htmFoot + myPanel.DesignFoot;

            //update this panel's resize type
            bool useResizeHeight = false;
            //fixed width
            if (arrData[1] == "2")
            {
                myPanel.ResizeType = 3;
                //fixed height
                if (arrData[4] == "2")
                {
                    myPanel.setWidthAndHeight(int.Parse(arrData[2]), arrData[3]);
                    useResizeHeight = true;
                }
                else
                {
                    myPanel.setWidthAndHeight(int.Parse(arrData[2]), "0");
                }

                //auto-resize width
            }
            else if (arrData[1] == "1")
            {
                myPanel.ResizeType = 2;
                //fixed height
                if (arrData[4] == "2")
                {
                    myPanel.setWidthAndHeight(0, arrData[3]);
                    useResizeHeight = true;
                }
                else
                {
                    myPanel.setWidthAndHeight(0, "0");
                }


                //manually resize the panel width
            }
            else if (arrData[0] != "3" & arrData[1] == "0")
            {
                myPanel.ResizeType = 1;
                //fixed height
                if (arrData[4] == "2")
                {
                    myPanel.setWidthAndHeight(0, arrData[3]);
                    useResizeHeight = true;
                }
                else
                {
                    myPanel.setWidthAndHeight(0, "0");
                }

                //responsive width
            }
            else if (arrData[0] == "3" & arrData[1] == "0")
            {
                myPanel.ResizeType = 4;
                //fixed height
                if (arrData[4] == "2")
                {
                    myPanel.setWidthAndHeight(0, arrData[3]);
                    useResizeHeight = true;
                }
                else
                {
                    myPanel.setWidthAndHeight(0, "0");
                }
            }

            if (useResizeHeight == true)
            {
                myPanel.HeightType = 1;
            }
            else
            {
                myPanel.HeightType = 0;
            }

            //set up padding
            if (arrAttributes.Length > 7)
            {
                myPanel.setPadding(arrAttributes[4] + "px " + arrAttributes[5] + "px " + arrAttributes[6] + "px " + arrAttributes[7] + "px");
            }

            //set up overflow
            if (arrAttributes.Length > 8)
            {
                myPanel.Overflow = (arrAttributes[8] == "1" ? true : false);
            }

            //set up background image
            if (arrAttributes.Length > 17)
            {
                if (arrAttributes[11] == "100%")
                    arrAttributes[11] = "";
                string filename = arrAttributes[11] + arrAttributes[9];
                if (!string.IsNullOrEmpty(arrAttributes[9]))
                {
                    myPanel.inner.Style.Add("background-image", "url(/content/websites/" + R.Page.websiteId + "/media/" + filename + ")");
                    if (arrAttributes[10] == "custom")
                    {
                        //use custom width & height (px or %) instead of alignment (ex: left top)
                        string aW = "";
                        string aH = "";
                        if (!string.IsNullOrEmpty(arrAttributes[14]))
                        {
                            aW = arrAttributes[14] + arrAttributes[15];
                        }
                        if (!string.IsNullOrEmpty(arrAttributes[16]))
                        {
                            aH = arrAttributes[16] + arrAttributes[17];
                        }
                        if (string.IsNullOrEmpty(aW) & string.IsNullOrEmpty(aH))
                        {
                            myPanel.inner.Style.Remove("background-position");
                        }
                        else
                        {
                            myPanel.inner.Style.Add("background-position", aW + " " + aH);
                        }
                        //use alignment (ex: center bottom)
                    }
                    else
                    {
                        myPanel.inner.Style.Add("background-position", arrAttributes[10]);
                    }

                    //tile
                    if (arrAttributes[12] == "1")
                    {
                        myPanel.inner.Style.Add("background-repeat", "repeat");
                    }
                    else
                    {
                        myPanel.inner.Style.Add("background-repeat", "no-repeat");
                    }
                    //fixed
                    if (arrAttributes[13] == "1")
                    {
                        myPanel.inner.Style.Add("background-attachment", "fixed");
                    }
                    else
                    {
                        myPanel.inner.Style.Remove("background-attachment");
                    }
                    myPanel.inner.Style.Add("min-height", "100%");
                }
                else
                {
                    if (myPanel.inner.Style.ContainsKey("background-image") == true)
                    {
                        myPanel.inner.Style.Remove("background-image");
                        myPanel.inner.Style.Remove("background-position");
                        myPanel.inner.Style.Remove("background-attachment");
                        myPanel.inner.Style.Remove("background-repeat");
                    }
                }
            }
        }

        public override string Render()
        {
            List<string> panels = new List<string>();
            for(int x = 0; x < myPanels.Count; x++)
            {
                if(myPanels[x].Components.Count > 0)
                {
                    panels.Add(myPanels[x].Render());
                }
            }
            DivItem.innerHTML = headHtml + string.Join("\n", panels.ToArray()) + footHtml;
            return base.Render();
        }
    }
}
