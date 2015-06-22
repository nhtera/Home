using System;

namespace Rennder
{
    public class RmlList : RmlClass
    {

        public struct structObject
        {
            public string[] htmItem;
            public string htmHead;
            public string htmFoot;
        }

        public struct structItem
        {
            public string name;
            //0=label,1=photo,2=gallery,3=button,4=link
            public int type;
            public string defaultValue;
            public bool isMultiLine;
        }


        public structObject rmlObject = new structObject();
        public RmlList(RML rmlBase, string layoutFolder, string designName, string type = "") : base(rmlBase, layoutFolder, designName, type)
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
            string designRml = rmlBase.GetDesignRml(8);
            //8 = list

            int[] start = new int[8];
            start[0] = designRml.IndexOf("<rml:list");
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
                            start[0] = designRml.IndexOf("<rml:list", start[1]);
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

                if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                {
                    designName = arrAttr[x + 1];
                }
            }

            //get a list of object items
            start[3] = start[1];
            start[4] = designRml.IndexOf("</rml:list>", start[1]);

            //get header HTML
            start[2] = designRml.IndexOf("<rml:item>", start[3]);
            if (start[2] >= 0 & start[3] >= 0)
            {
                rmlObject.htmHead = designRml.Substring(start[3] + 1, (start[2] - 1) - (start[3] + 1));
            }

            //get each item HTML
            do
            {
                start[2] = designRml.IndexOf("<rml:item>", start[3]);
                if (start[2] >= 0 & start[2] < start[4])
                {
                    start[3] = designRml.IndexOf("</rml:item>", start[2]);
                    if (start[3] >= 0)
                    {
                        int i = 0;
                        if ((rmlObject.htmItem != null))
                        {
                            Array.Resize(ref rmlObject.htmItem, rmlObject.htmItem.Length + 1);
                            i = rmlObject.htmItem.Length - 1;
                        }
                        else
                        {
                            rmlObject.htmItem = new string[1];
                        }
                        rmlObject.htmItem[i] = designRml.Substring(start[2] + 10, start[3] - (start[2] + 10));
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
            } while (true);

            //get footer HTML
            if (start[3] >= 0 & start[4] >= 0)
            {
                rmlObject.htmFoot = designRml.Substring(start[3] + 11, (start[4] - 1) - (start[3] + 11));
            }
        }

        public void RestartIndex()
        {
            itemIndex = 0;
        }

        public string GetCompiledRmlItem(Core R, string[] names, string[] values, string websiteId, string componentId, int objIndex, string designNames = "", RML myRml = null)
        {
            //designNames = comma separated list of design names to use for buttons & photo galleries within a list item
            RML classRml = rmlBase;
            if ((myRml == null) == false)
                classRml = myRml;
            string myObject = rmlObject.htmItem[itemIndex].ToString();
            structItem[] myObjects = (structItem[])GetObjectList();
            int[] index = new int[5];
            int i = 0;

            //replace each index tag with the item index number
            myObject = myObject.Replace("<rml:index/>", objIndex.ToString()).Replace("<rml:index />", "<rml:index/>");

            //find each label tag
            string[] arrAttr = null;
            string itemName = "";
            bool isFound = false;
            string[] designs = { "" };
            if (!string.IsNullOrEmpty(designNames))
                designs = designNames.Split('\"');
            index[1] = 1;
            do
            {
                isFound = false;
                index[0] = myObject.IndexOf("<rml:label", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf("/>", index[0] + 5);
                    if (index[1] >= 0)
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = (arrAttr[x + 1]).ToLower();
                            }
                        }
                        //generate label
                        for (int x = 0; x <= names.Length - 1; x++)
                        {
                            if (names[x] == itemName)
                            {
                                isFound = true;
                                myObject = myObject.Substring(1, index[0] - 1) + values[x] + myObject.Substring(index[1] + 2);
                                break; // TODO: might not be correct. Was : Exit For
                            }
                        }
                        if (isFound == false)
                            myObject = myObject.Substring(1, index[0] - 1) + myObject.Substring(index[1] + 2);
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
            } while (true);

            //find each button tag
            string itemDesign = "";
            string itemText = "";
            string[] arrVal;
            itemName = "";
            index[1] = 1;
            do
            {
                isFound = false;
                index[0] = myObject.IndexOf("<rml:button", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf("/>", index[0] + 5);
                    if (index[1] >= 0)
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = (arrAttr[x + 1]).ToLower();
                            }
                            if (arrAttr[x].IndexOf("text") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemText =(arrAttr[x + 1]).ToLower();
                            }
                            if (arrAttr[x].IndexOf("design") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemDesign = (arrAttr[x + 1]).ToLower();
                            }
                        }
                        //generate button
                        for (int x = 0; x <= names.Length - 1; x++)
                        {
                            if (names[x] == itemName)
                            {
                                isFound = true;
                                arrVal = values[x].Split('\"');
                                if (!string.IsNullOrEmpty(arrVal[0]))
                                    itemText = arrVal[0];
                                //get item design
                                i = 0;
                                for (int z = 0; z <= myObjects.Length - 1; z++)
                                {
                                    switch (myObjects[z].type)
                                    {
                                        case 2:
                                        case 3:
                                            if (myObjects[z].name == itemName)
                                            {
                                                if (designs.Length > i)
                                                {
                                                    itemDesign = designs[i];
                                                    break; // TODO: might not be correct. Was : Exit For
                                                }
                                            }
                                            i += 1;
                                            break;
                                    }
                                }
                                RmlButton rmlButton = classRml.GetRmlButton(itemDesign);
                                //myObject = Mid(myObject, 1, index[0] - 1) & rmlButton.GetCompiledRml(itemText, R.GenerateURL(arrVal[1], myContainer), componentId & "gBtn" & x) & Mid(myObject, index[1] + 2)
                                break; // TODO: might not be correct. Was : Exit For
                            }
                        }
                        if (isFound == false)
                            myObject = myObject.Substring(1, index[0] - 1) + myObject.Substring(index[1] + 2);
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
            } while (true);

            //find each photo and photo gallery
            string[] arrPhotos = null;
            string photoType = "main";
            string photoSize = "small";
            string photoStyle = "";
            itemName = "";
            index[1] = 1;
            do
            {
                isFound = false;
                index[0] = myObject.IndexOf("<rml:photo", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf(">", index[0] + 5);
                    if (index[1] > index[0])
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        photoType = "main";
                        photoSize = "small";
                        photoStyle = "";
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = (arrAttr[x + 1]).ToLower();
                            }

                            if (arrAttr[x].IndexOf("type") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                photoType = (arrAttr[x + 1]).ToLower();
                            }

                            if (arrAttr[x].IndexOf("size") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                photoSize = arrAttr[x + 1];
                            }

                            if (arrAttr[x].IndexOf("style") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                photoStyle = arrAttr[x + 1];
                            }
                        }

                        if (photoType == "main")
                        {
                            //create main photo that will load from the thumbnail list
                            bool hasThumbs = false;
                            string nameThumbs = "";
                            string mainThumbs = "";
                            //find out if this main photo is used by thumbnails
                            index[3] = myObject.IndexOf("main=\"" + itemName + "\"");
                            if (index[3] >= 0)
                            {
                                index[3] = myObject.IndexOf("<rml:photo", index[3] - 100);
                                if (index[3] >= 0)
                                {
                                    index[4] = myObject.IndexOf(">",index[3] + 5);
                                    if (index[4] >= 0)
                                    {
                                        arrAttr = myObject.Substring(index[3], index[4] - index[3]).Split('\"');
                                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                                        {
                                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                            {
                                                nameThumbs = (arrAttr[x + 1]).ToLower();
                                            }
                                            if (arrAttr[x].IndexOf("main") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                            {
                                                mainThumbs = (arrAttr[x + 1]).ToLower();
                                            }
                                        }
                                    }
                                }
                                if (mainThumbs == itemName & !string.IsNullOrEmpty(nameThumbs))
                                {
                                    arrPhotos = null;
                                    for (int x = 0; x <= names.Length - 1; x++)
                                    {
                                        if (names[x] == nameThumbs)
                                        {
                                            arrPhotos = values[x].Split('\"');
                                            break; // TODO: might not be correct. Was : Exit For
                                        }
                                    }
                                    if ((arrPhotos == null) == false)
                                        hasThumbs = true;
                                }
                            }

                            //generate HTML for main photo
                            string pSize = photoSize;
                            string pStyle = "";

                            switch (photoSize)
                            {
                                case "xsmall":
                                    pSize = "tiny";
                                    break;
                                case "small":
                                    pSize = "sm";
                                    break;
                                case "medium":
                                    pSize = "med";
                                    break;
                                case "large":
                                    pSize = "lg";
                                    break;
                                case "xlarge":
                                case "xl":
                                    pSize = "xl";
                                    break;
                                case "original":
                                case "":
                                case "none":
                                    pSize = "";
                                    break;
                            }

                            if (!string.IsNullOrEmpty(photoStyle))
                                pStyle = "style=\"" + photoStyle + "\"";
                            if (hasThumbs == false)
                            {
                                //no thumbnail photos, just load the photo
                                arrPhotos = null;
                                for (int x = 0; x <= names.Length - 1; x++)
                                {
                                    if (names[x] == itemName)
                                    {
                                        arrPhotos = values[x].Split('\"');
                                        break; // TODO: might not be correct. Was : Exit For
                                    }
                                }
                                if (arrPhotos.Length >= 0)
                                {
                                    string myPhoto = "<img id=\"" + componentId + "_photo\" src=\"/content/websites/" + websiteId + "/media/" + pSize + arrPhotos[0] + "\" border=\"0\" " + pStyle + "/>";
                                    myObject = myObject.Substring(1, index[0] - 1) + myPhoto + myObject.Substring(index[1] + 1);
                                }
                                else
                                {
                                    myObject = myObject.Substring(1, index[0] - 1) + myObject.Substring(index[1] + 2);
                                }

                            }
                            else
                            {
                                //thumbnail photos exist
                                string myPhoto = "<img id=\"" + componentId + "_photo\" psize=\"" + pSize + "\" src=\"/content/websites/" + websiteId + "/media/" + pSize + arrPhotos[0] + "\" border=\"0\" " + pStyle + "/>";
                                myObject = myObject.Substring(1, index[0] - 1) + myPhoto + myObject.Substring(index[1] + 1);
                            }
                        }
                        else if (photoType == "thumbs" & arrPhotos.Length > 1)
                        {
                            //create photo gallery
                            arrPhotos = null;
                            for (int x = 0; x <= names.Length - 1; x++)
                            {
                                if (names[x] == itemName)
                                {
                                    arrPhotos = values[x].Split('\"');
                                    break; // TODO: might not be correct. Was : Exit For
                                }
                            }
                            if ((arrPhotos == null) == false)
                            {
                                string pThumbs = "";
                                index[2] = myObject.IndexOf("</rml:photo>", index[1]);
                                if (index[2] >= 0)
                                {
                                    int galleryPages = 0;
                                    int gIndex = 1;

                                    pThumbs = myObject.Substring(index[1] + 1, (index[2] - 1) - (index[1] + 1));
                                    index[2] = pThumbs.IndexOf("<rml:thumbs");
                                    if (index[2] >= 0)
                                    {
                                        index[3] = pThumbs.IndexOf("/>", index[2] + 11);
                                        if (index[3] >= 0)
                                        {
                                            //get attributes for thumbs
                                            string photoDesign = "";
                                            string photoDesignSelect = "";
                                            int photoRows = 1;
                                            int photoColumns = 3;

                                            arrAttr = pThumbs.Substring(index[2], index[3] - index[2]).Split('\"');
                                            for (int x = 0; x <= arrAttr.Length - 1; x++)
                                            {
                                                if (arrAttr[x].IndexOf("design") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    photoDesign = (arrAttr[x + 1]);
                                                }

                                                if (arrAttr[x].IndexOf("select") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    photoDesignSelect = (arrAttr[x + 1]);
                                                }

                                                if (arrAttr[x].IndexOf("size") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    photoSize = arrAttr[x + 1];
                                                }

                                                if (arrAttr[x].IndexOf("style") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    photoStyle = arrAttr[x + 1];
                                                }

                                                if (arrAttr[x].IndexOf("rows") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    if (rmlBase.R.Util.Str.IsNumeric(arrAttr[x + 1]) == true)
                                                        photoRows = int.Parse(arrAttr[x + 1]);
                                                }

                                                if (arrAttr[x].IndexOf("columns") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    if (rmlBase.R.Util.Str.IsNumeric(arrAttr[x + 1]) == true)
                                                        photoColumns = int.Parse(arrAttr[x + 1]);
                                                }
                                            }

                                            RmlStackPanel rmlPanel;
                                            RmlStackPanel rmlPanelSelect;
                                            if (!string.IsNullOrEmpty(photoDesign))
                                            {
                                                rmlPanel = classRml.GetRmlStackPanel(photoDesign);
                                            }else
                                            {
                                                rmlPanel = classRml.GetRmlStackPanel("");
                                            }
                                            if (!string.IsNullOrEmpty(photoDesignSelect))
                                            {
                                                rmlPanelSelect = classRml.GetRmlStackPanel(photoDesignSelect);
                                            }else
                                            {
                                                rmlPanelSelect = classRml.GetRmlStackPanel("");
                                            }

                                            string pSize = photoSize;
                                            string pStyle = "";

                                            switch (photoSize)
                                            {
                                                case "xsmall":
                                                    pSize = "tiny";
                                                    break;
                                                case "small":
                                                    pSize = "sm";
                                                    break;
                                                case "medium":
                                                    pSize = "med";
                                                    break;
                                                case "large":
                                                    pSize = "lg";
                                                    break;
                                                case "xlarge":
                                                case "xl":
                                                    pSize = "";
                                                    break;
                                            }

                                            if (!string.IsNullOrEmpty(photoStyle))
                                                pStyle = "style=\"" + photoStyle + "\"";

                                            //generate photo gallery

                                            string gallery = "<div id=\"" + componentId + "_gallery" + gIndex + "\">";
                                            gallery += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>";
                                            int ic = 0;
                                            int ir = 1;
                                            int spci = 0;
                                            int spcis = 0;
                                            for (int x = 0; x <= arrPhotos.Length - 1; x++)
                                            {
                                                ic += 1;
                                                if (ic > photoColumns)
                                                {
                                                    ic = 1;
                                                    ir += 1;
                                                    gallery += "</tr>";
                                                    if (ir > photoRows)
                                                    {
                                                        gIndex += 1;
                                                        ir = 1;
                                                        gallery += "</table></div>";
                                                        gallery += "<div id=\"" + componentId + "_gallery" + gIndex + "\" style=\"display:none;\">";
                                                        gallery += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>";
                                                    }
                                                    else
                                                    {
                                                        gallery += "<tr>";
                                                    }

                                                }
                                                //create photo
                                                gallery += "<td><div id=\"" + componentId + "_thumb" + x + "\"";
                                                if (x == 0)
                                                    gallery += " style=\"display:none;\"";
                                                gallery += ">";
                                                if (!string.IsNullOrEmpty(photoDesign))
                                                {
                                                    gallery += rmlPanel.rmlStackPanel.htmEvolverHead + rmlPanel.rmlStackPanel.rmlComponent[spci].htmHead;
                                                }
                                                gallery += "<a href=\"javascript:ObjectGallerySelect('" + componentId + "'," + x + "," + arrPhotos.Length + ",'" + arrPhotos[x] + "')\">";
                                                gallery += "<img src=\"/content/websites/" + websiteId + "/media/" + pSize + arrPhotos[x] + "\" border=\"0\" " + pStyle + "/></a>";
                                                if (!string.IsNullOrEmpty(photoDesign))
                                                {
                                                    gallery += rmlPanel.rmlStackPanel.rmlComponent[spci].htmFoot + rmlPanel.rmlStackPanel.htmEvolverFoot;
                                                    spci += 1;
                                                    if (spci >= rmlPanel.rmlStackPanel.rmlComponent.Length)
                                                        spci = 0;
                                                }
                                                //create selected photo
                                                gallery += "</div><div id=\"" + componentId + "_thumb" + x + "_sel\"";
                                                if (x >= 0)
                                                    gallery += " style=\"display:none;\"";
                                                gallery += ">";
                                                if (!string.IsNullOrEmpty(photoDesign))
                                                {
                                                    gallery += rmlPanelSelect.rmlStackPanel.htmEvolverHead + rmlPanelSelect.rmlStackPanel.rmlComponent[spcis].htmHead;
                                                }
                                                gallery += "<img src=\"/content/websites/" + websiteId + "/media/" + pSize + arrPhotos[x] + "\" border=\"0\" " + pStyle + "/>";
                                                if (!string.IsNullOrEmpty(photoDesign))
                                                {
                                                    gallery += rmlPanelSelect.rmlStackPanel.rmlComponent[spcis].htmFoot + rmlPanelSelect.rmlStackPanel.htmEvolverFoot;
                                                    spcis += 1;
                                                    if (spcis >= rmlPanelSelect.rmlStackPanel.rmlComponent.Length)
                                                        spcis = 0;
                                                }
                                                gallery += "</div></td>";
                                            }
                                            gallery += "</tr></table></div>";
                                            galleryPages = gIndex;
                                            pThumbs = pThumbs.Substring(1, index[2] - 1) + gallery + pThumbs.Substring(index[3] + 2);
                                        }
                                    }

                                    //create paging buttons for photo gallery
                                    index[2] = pThumbs.IndexOf("<rml:back");
                                    if (index[2] >= 0)
                                    {
                                        index[3] = pThumbs.IndexOf("/>", index[2]);
                                        if (index[3] >= 0)
                                        {
                                            string buttonDesign = "";
                                            string buttonText = "Back";
                                            arrAttr = pThumbs.Substring(index[2], index[3] - index[2]).Split('\"');
                                            for (int x = 0; x <= arrAttr.Length - 1; x++)
                                            {
                                                if (arrAttr[x].IndexOf("design") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    buttonDesign = (arrAttr[x + 1]);
                                                }
                                                if (arrAttr[x].IndexOf("text") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    buttonText = (arrAttr[x + 1]).ToLower();
                                                }
                                            }
                                            RmlButton rmlButton = classRml.GetRmlButton(buttonDesign);
                                            string pButton = "<div id=\"" + componentId + "_divBtnBack\" style=\"display:none;\">";
                                            pButton += rmlButton.GetCompiledRml(buttonText, "javascript:ObjectGalleryPaging('" + componentId + "',-1," + galleryPages + ")", componentId + "_btnBack", false);
                                            pButton += "</div><div id=\"" + componentId + "_divBtnBackDisabled\">";
                                            pButton += rmlButton.GetCompiledRml(buttonText, "", componentId + "_btnBackDiabled", true);
                                            pButton += "</div>";
                                            pThumbs = pThumbs.Substring(1, index[2] - 1) + pButton + pThumbs.Substring(index[3] + 2);
                                        }
                                    }

                                    index[2] = pThumbs.IndexOf("<rml:next");
                                    if (index[2] >= 0)
                                    {
                                        index[3] = pThumbs.IndexOf("/>", index[2]);
                                        if (index[3] >= 0)
                                        {
                                            string buttonDesign = "";
                                            string buttonText = "Next";
                                            arrAttr = pThumbs.Substring(index[2], index[3] - index[2]).Split('\"');
                                            for (int x = 0; x <= arrAttr.Length - 1; x++)
                                            {
                                                if (arrAttr[x].IndexOf("design") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    buttonDesign = (arrAttr[x + 1]);
                                                }
                                                if (arrAttr[x].IndexOf("text") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                                                {
                                                    buttonText = (arrAttr[x + 1]).ToLower();
                                                }
                                            }
                                            RmlButton rmlButton = classRml.GetRmlButton(buttonDesign);
                                            string pButton = "<div id=\"" + componentId + "_divBtnNext\"";
                                            if (gIndex == 1)
                                            {
                                                pButton += " style=\"display:none;\"";
                                            }
                                            pButton += ">";

                                            pButton += rmlButton.GetCompiledRml(buttonText, "javascript:ObjectGalleryPaging('" + componentId + "',1," + galleryPages + ")", componentId + "_btnNext", false);
                                            pButton += "</div><div id=\"" + componentId + "_divBtnNextDisabled\"";
                                            if (gIndex > 1)
                                            {
                                                pButton += " style=\"display:none;\"";
                                            }
                                            pButton += ">";
                                            pButton += rmlButton.GetCompiledRml(buttonText, "", componentId + "_btnNextDiabled", true);
                                            pButton += "</div>";
                                            pThumbs = pThumbs.Substring(1, index[2] - 1) + pButton + pThumbs.Substring(index[3] + 2);
                                        }
                                    }

                                    myObject = myObject.Substring(1, index[0] - 1) + pThumbs + myObject.Substring(index[1] + 1);
                                }
                            }
                            else
                            {
                                myObject = myObject.Substring(1, index[0] - 1) + myObject.Substring(index[1] + 1);
                            }
                        }
                        else
                        {
                            myObject = myObject.Substring(1, index[0] - 1) + myObject.Substring(index[1] + 1);
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
            } while (true);

            //find each link tag
            arrAttr = new string[]{ "" };
            itemName = "";
            isFound = false;
            designs = new string[] { "" };
            if (!string.IsNullOrEmpty(designNames))
                designs = designNames.Split('\"');
            index[1] = 1;
            do
            {
                isFound = false;
                index[0] = myObject.IndexOf("<rml:link", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf(">", index[0] + 5);
                    if (index[1] >= 0)
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = (arrAttr[x + 1]).ToLower();
                            }
                        }
                        //generate anchor link
                        for (int x = 0; x <= names.Length - 1; x++)
                        {
                            if (names[x] == itemName)
                            {
                                string newurl = values[x];
                                int e = 0;
                                int u = 0;
                                isFound = true;
                                //convert #r= links to anchor links, as either hash or a folder structure
                                u = newurl.IndexOf("#r=");
                                if (u >= 0)
                                {
                                    e = newurl.Length + 1;
                                    newurl = newurl.ToLower().Substring(u + 3, e - (u + 3)).Replace(newurl.ToLower(), " ");
                                    if (R.Page.useAJAX == true)
                                    {
                                        newurl = "#\" hash=\"\" page=\"" + newurl;
                                    }
                                    else
                                    {
                                        newurl = R.Util.Str.GenerateLinkAsString("", newurl, true);
                                    }
                                }
                                myObject = myObject.Substring(1, index[0] - 1) + "<a href=\"" + newurl + "\" class=\"list-elem-" + itemName + "\">" + myObject.Substring(index[1] + 1);

                                //find closing tag
                                index[2] = myObject.IndexOf("</rml:link>");
                                if (index[2] >= 0)
                                {
                                    myObject = myObject.Substring(1, index[2] - 1) + "</a>" + myObject.Substring(index[2] + 11);
                                }
                                break; // TODO: might not be correct. Was : Exit For
                            }
                        }
                        if (isFound == false)
                        {
                            //remove rml tags from code even if values couldn't be found
                            myObject = myObject.Substring(1, index[0] - 1) + myObject.Substring(index[1] + 2);
                            index[2] = myObject.IndexOf("</rml:link>");
                            if (index[2] >= 0)
                            {
                                myObject = myObject.Substring(1, index[2] - 1) + myObject.Substring(index[2] + 11);
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
            } while (true);

            //incriment item index
            itemIndex += 1;
            if (itemIndex >= rmlObject.htmItem.Length)
                itemIndex = 0;

            return myObject;
        }

        public Array GetObjectList()
        {
            string myObject = rmlObject.htmItem[itemIndex].ToString();
            structItem[] objNames = null;

            int[] index = new int[2];
            string[] arrAttr = null;
            string itemName = "";
            string itemType = "";
            //0=label,1=photo,2=gallery,3=button,4=link
            string itemValue = "";
            bool multiLine = false;
            int i = 0;

            //find each label tag
            index[1] = 1;
            do
            {
                itemName = "";
                itemValue = "";
                multiLine = false;
                index[0] = myObject.IndexOf("<rml:label", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf("/>", index[0] + 5);
                    if (index[1] >= 0)
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = arrAttr[x + 1].ToLower();
                            }
                            if (arrAttr[x].IndexOf("type") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                if (arrAttr[x + 1].ToLower() == "multiline")
                                {
                                    multiLine = true;
                                }
                            }
                        }
                        if (!string.IsNullOrEmpty(itemName))
                        {
                            //add label to array
                            Array.Resize(ref objNames, i + 1);
                            objNames[i].name = itemName;
                            objNames[i].type = 0;
                            objNames[i].defaultValue = itemValue;
                            objNames[i].isMultiLine = multiLine;
                            i += 1;
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
            } while (true);

            //find each photo tag
            index[1] = 1;
            do
            {
                itemName = "";
                itemType = "";
                index[0] = myObject.IndexOf("<rml:photo", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf(">", index[0] + 5);
                    if (index[1] >= 0)
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = arrAttr[x + 1].ToLower();
                            }
                            if (arrAttr[x].IndexOf("type") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemType = arrAttr[x + 1].ToLower();
                            }
                        }
                        if (!string.IsNullOrEmpty(itemName))
                        {
                            //add photo to array
                            Array.Resize(ref objNames, i + 1);
                            objNames[i].name = itemName;
                            if (itemType == "thumbs")
                            {
                                objNames[i].type = 2;
                            }
                            else
                            {
                                objNames[i].type = 1;
                            }
                            i += 1;
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
            } while (true);

            //find each button tag
            index[1] = 1;
            do
            {
                itemName = "";
                itemValue = "";
                index[0] = myObject.IndexOf("<rml:button", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf("/>", index[0] + 5);
                    if (index[1] >= 0)
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = arrAttr[x + 1].ToLower();
                            }
                            if (arrAttr[x].IndexOf("text") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemValue = arrAttr[x + 1].ToLower();
                            }
                        }
                        if (!string.IsNullOrEmpty(itemName))
                        {
                            //add button to array
                            Array.Resize(ref objNames, i + 1);
                            objNames[i].name = itemName;
                            objNames[i].type = 3;
                            objNames[i].defaultValue = itemValue;
                            i += 1;
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
            } while (true);

            //find each link tag
            index[1] = 1;
            do
            {
                itemName = "";
                itemValue = "";
                index[0] = myObject.IndexOf("<rml:link", index[1]);
                if (index[0] >= 0)
                {
                    index[1] = myObject.IndexOf(">", index[0] + 5);
                    if (index[1] >= 0)
                    {
                        //get attributes
                        arrAttr = myObject.Substring(index[0], index[1] - index[0]).Split('\"');
                        for (int x = 0; x <= arrAttr.Length - 1; x++)
                        {
                            if (arrAttr[x].IndexOf("name") >= 0 & arrAttr[x].IndexOf("=") >= 0)
                            {
                                itemName = arrAttr[x + 1].ToLower();
                            }
                        }
                        if (!string.IsNullOrEmpty(itemName))
                        {
                            //add link to array
                            Array.Resize(ref objNames, i + 1);
                            objNames[i].name = itemName;
                            objNames[i].type = 4;
                            objNames[i].defaultValue = itemValue;
                            i += 1;
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
            } while (true);
            return objNames;
        }

        public string GenerateJavascript(string websiteId)
        {
            string myJs =
            "function ObjectGalleryPaging(cid, index, pagecount){" + "\n" +
            "var i=1;" + "\n" +
            "for(var x = 1; x <= pagecount;x++){" + "\n" +
            "if($R[cid + '_gallery' + x].style.display != 'none'){" + "\n" +
            "$R[cid + '_gallery' + x].style.display = 'none';" + "\n" +
            "if(index == -1){" + "\n" +
            "i=x-1;$R(cid + '_gallery' + (x - 1)).style.display = 'block';" + "\n" +
            "}else{" + "\n" +
            "i=x+1;$R(cid + '_gallery' + [x + 1]).style.display = 'block';" + "\n" +
            "}" + "\n" +
            "if(i == 1){" + "\n" +
            "$R[cid + '_divBtnBack'].style.display = 'none';" + "\n" +
            "$R[cid + '_divBtnBackDisabled'].style.display = 'block';" + "\n" +
            "}else{" + "\n" +
            "$R[cid + '_divBtnBack'].style.display = 'block';" + "\n" +
            "$R[cid + '_divBtnBackDisabled'].style.display = 'none';" + "\n" +
            "}" + "\n" +
            "if(i >= pagecount){" + "\n" +
            "$R[cid + '_divBtnNext'].style.display = 'none';" + "\n" +
            "$R[cid + '_divBtnNextDisabled'].style.display = 'block';" + "\n" +
            "}else{" + "\n" +
            "$R[cid + '_divBtnNext'].style.display = 'block';" + "\n" +
            "$R[cid + '_divBtnNextDisabled'].style.display = 'none';" + "\n" +
            "}" + "\n" +
            "break;}" + "\n" +
            "}" + "\n" +
            "}" + "\n" +
            "function ObjectGallerySelect(cid, index, count, photo){" + "\n" +
            "for(var x=0;x <count;x++){" + "\n" +
            "$R[cid + '_thumb' + x].style.display = 'block';" + "\n" +
            "$R[cid + '_thumb' + x + '_sel'].style.display = 'none';" + "\n" +
            "}" + "\n" +
            "$R[cid + '_thumb' + index].style.display = 'none';" + "\n" +
            "$R[cid + '_thumb' + index + '_sel'].style.display = 'block';" + "\n" +
            "$R[cid + '_photo'].src = '/content/websites/" + websiteId + "/media/' + $R[cid + '_photo'].getAttribute('psize') + photo;" + "\n" +
            "}" + "\n";
            return myJs;
        }
    }
}