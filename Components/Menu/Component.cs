using System;
using System.Xml;

namespace Rennder.Components
{
    public class Menu : Component
    {
        public Menu(Core RennderCore) : base(RennderCore)
        {
            //LoadMenu();
        }

        private void LoadMenu(int selectedIndex = -1, string reloadItem = "", int reloadOldIndex = 0, string reloadOldItem = "")
        {
            if (string.IsNullOrEmpty(DataField))
            {
                //show empty menu
                return;
            }

            string[] arrDesign = DesignField.Split('|');
            RmlMenu rmlMenu;
            XmlDocument xmlContent = new XmlDocument();
            int x = 0;
            int oldx = 0;
            int z = 0;
            string icon = "";
            string newUrl = "";
            string newTitle = "";
            string[] titles = null;
            string htm = "";
            string[] itemHtm = new string[1];
            string myJs = "";
            int itemCount = 0;
            int itemIndex = -1;
            int layoutDirection = 1;
            string tdWidth = "";
            string @float = "float:left; ";
            bool isTree = false;
            string reload = "";
            int reloadLevel = 0;
            bool reloadStarted = false;
            bool showLevel = false;
            bool hasDropdown = false;
            string dropdownSide = "bottom";
            string dropdownType = "none";
            double dropdownSpeed = 0.7;
            int dropdownOffsetX = 0;
            int dropdownOffsetY = 0;
            string dropdownPanelId = "";
            string dropdownJs = "";
            string dropdownJsOut = "";
            string dropdownClass = "";
            string dropdownAttr = "";

            //add responsive design attribute
            if (arrDesign.Length > 2)
            {
                if (arrDesign[2].IndexOf(",") >= 0)
                {
                    DivItem.Attributes.Add("dsgnmenu", arrDesign[2]);
                }
            }

            //load component content as an XML document
            xmlContent.LoadXml(DataField);

            //get dropdown settings if they exist
            XmlNode root = xmlContent.SelectSingleNode("//menu");
            if ((root.Attributes["dropdownside"] == null) == false)
            {
                dropdownSide = root.Attributes["dropdownside"].Value;
            }
            if ((root.Attributes["dropdowntype"] == null) == false)
            {
                dropdownType = root.Attributes["dropdowntype"].Value;
            }
            if ((root.Attributes["dropdownspeed"] == null) == false)
            {
                dropdownSpeed = Convert.ToDouble(root.Attributes["dropdownspeed"].Value);
            }
            if ((root.Attributes["dropdownpanel"] == null) == false)
            {
                dropdownOffsetX = int.Parse(root.Attributes["dropdownoffsetx"].Value);
            }
            if ((root.Attributes["dropdownoffsetx"] == null) == false)
            {
                dropdownOffsetY = int.Parse(root.Attributes["dropdownoffsety"].Value);
            }

            XmlNode item = xmlContent.SelectSingleNode("//menu/item");
            int totalDropdowns = xmlContent.SelectNodes("//menu/item[@dropdown=1]").Count;

            if (item == null) { return; }
            if (string.IsNullOrEmpty(item.Attributes["title"].Value.Trim())) { return; }

            //load RML menu design
            if (arrDesign.Length > 0)
            {
                if (string.IsNullOrEmpty(arrDesign[0]))
                {
                    rmlMenu = R.PageRml.GetRmlMenu("");
                    //-1 = no design
                }
                else if (arrDesign[0] != "-1")
                {
                    //load specific design
                    rmlMenu = R.PageRml.GetRmlMenu(arrDesign[0]);
                }
                else
                {
                    rmlMenu = R.PageRml.GetRmlMenu("");
                }
            }
            else
            {
                rmlMenu = R.PageRml.GetRmlMenu("");
            }

            if (arrDesign.Length > 3)
            {
                //treeview menu
                if (arrDesign[3] == "tree")
                    isTree = true;
            }
            itemCount = rmlMenu.rmlMenu.menuItems.Length;

            //add menu header
            if (itemCount > 0)
            {
                htm += rmlMenu.rmlMenu.htmHead;
            }

            if (arrDesign.Length > 2)
            {
                switch (arrDesign[2])
                {
                    case "1":
                        //left align
                        tdWidth = "white-space:nowrap;";
                        break;
                    case "2":
                        //center align
                        break;
                    case "3":
                        //right align
                        if (layoutDirection != 2)
                        {
                            tdWidth = "white-space:nowrap;";
                            @float = "float:right; ";
                        }
                        break;
                }
            }

            //generate each menu item
            string titleHead = "<span style=\"white-space:nowrap;\">";
            string titleFoot = "</span>";
            bool isSelected = false;
            int treeLevel = 1;
            string target = "_self";
            string extraAttr = "";
            string plusDisplay = "";
            string minusDisplay = "";

            treeLevel = 1;
            if (isTree == true)
            {
                htm += "<ul menuid=\"0\" class=\"rml-menu root-menu\">";
                titleHead = "";
                titleFoot = "";
            }

            //get parent parent of reloaditem
            if (!string.IsNullOrEmpty(reloadItem))
            {
                reload = reloadItem;
                for (int i = 1; i <= 2; i++)
                {
                    if (item.ParentNode != null)
                    {
                        if (!(item.ParentNode.NodeType == XmlNodeType.Document) & item.ParentNode.Name != "menu")
                        {
                            item = item.ParentNode;
                        }

                    }
                }
                reload = item.Attributes["index"].Value;
            }

            Utility.DOM.Element panelMenu = new Utility.DOM.Element();
            panelMenu.Style.Add("margin", "0px auto");

            do
            {
                z += 1;
                isSelected = false;
                showLevel = false;
                hasDropdown = false;
                dropdownJs = "";
                dropdownJsOut = "";
                icon = "";

                //get values from item
                newTitle = item.Attributes["title"].Value;
                titles = newTitle.Split('|');
                newUrl = item.Attributes["url"].Value;
                if (item.Attributes["icon"] != null)
                {
                    icon = item.Attributes["icon"].Value;
                }


                if (item.Attributes["target"] != null)
                {
                    if (target == "1") { target = "_blank"; }
                }
                if (item.Attributes["dropdown"] != null)
                {
                    hasDropdown = Convert.ToBoolean(item.Attributes["dropdown"].Value);
                    if (hasDropdown == true)
                    {
                        if (item.Attributes["panelid"] != null)
                        {
                            dropdownPanelId = item.Attributes["panelid"].Value;
                            Component c = R.Page.GetComponentById(dropdownPanelId);
                            if (c != null)
                            {
                                dropdownJs = "menuShowDropdownPanel('" + c.DivItem.ID + "', '" + itemId + "', 'menuitem" + itemId + "_" + z + "', '" + dropdownSide + "', '" + dropdownType + "', " + dropdownSpeed + ", " + dropdownOffsetX + ", " + dropdownOffsetY + ");";
                                dropdownJsOut = "menuHideDropdownPanel(event);";
                                myJs += "$('#" + c.DivItem.ID + "').addClass('is-dropdown').attr('nostack','1').css({opacity:0, left:-1000, top:-1000});";
                                dropdownClass = " has-dropdown";
                                dropdownAttr = " data-panelid=\"" + dropdownPanelId + "\"";
                                c.DivItem.Attributes["class"] = c.DivItem.Attributes["class"] + " is-dropdown";
                            }
                        }
                    }
                }

                if (string.IsNullOrEmpty(dropdownJs) & totalDropdowns > 0 & hasDropdown == false)
                {
                    dropdownJs = "menuHideDropdownPanelFinish('" + itemId + "');";
                }


                if (newUrl.IndexOf("\"") >= 0)
                {
                    //separate new url
                    extraAttr = newUrl.Split(new char[] { '\"' }, 2)[1];
                    newUrl = newUrl.Split('\"')[0];
                }

                newUrl = R.Server.UrlDecode(newUrl);

                if (newUrl.Substring(0, 1) == "#" & newUrl.Substring(2, 1) != "=")
                {
                    newUrl = newUrl.ToLower().Trim().Replace(" ", "+");
                }
                else if (newUrl.Substring(0, 3) == "#r=")
                {
                    newUrl = newUrl.ToLower().Trim().Replace(" ", "+");
                }
                newUrl = R.Util.Str.GenerateURL(newUrl);

                x = int.Parse(item.Attributes["index"].Value);
                if (selectedIndex == x)
                    isSelected = true;
                itemIndex += 1;
                if (itemIndex >= itemCount)
                    itemIndex = 0;


                if (isTree == true & treeLevel > 1 & string.IsNullOrEmpty(reload))
                {
                    if ((item.PreviousSibling == null) == true)
                    {
                        //first item in the tree level, create div to wrap entire level
                        htm += "<ul menuid=\"" + oldx + "\" id=\"" + itemId + "_item" + (z - 1) + "_sub\" class=\"rml-menu\" ";
                        if (!string.IsNullOrEmpty(reloadOldItem))
                        {
                            //see if this item is under the olditem
                            if (xmlContent.SelectNodes("//item[@index='" + oldx + "']//item[@index='" + reloadOldItem + "']").Count == 0)
                            {
                                htm += "style=\"display:none;\"";
                            }
                            else
                            {
                                showLevel = true;
                            }
                        }
                        else
                        {
                            htm += "style=\"display:none;\"";
                        }

                        htm += "><li menuid=\"" + x + "\" index=\"" + z + "\" class=\"rml-menu-item\">";
                    }
                    else
                    {
                        htm += "</li><li menuid=\"" + x + "\" index=\"" + z + "\" class=\"rml-menu-item\">";
                    }
                }
                else if (isTree == true)
                {
                    if (!string.IsNullOrEmpty(reload))
                    {
                        if (reloadStarted == false & x == int.Parse(reload))
                        {
                            htm = "";
                            reloadStarted = true;
                            R.Page.RegisterJS("reloadstart", "$('li[menuid=\"" + reloadItem + "\"]').addClass('new');");
                        }
                    }
                    else
                    {
                        htm += "</li><li menuid=\"" + x + "\" index=\"" + z + "\" class=\"rml-menu-item\">";
                    }
                }

                oldx = x;

                if (layoutDirection == 2)
                {
                    //vertical menu
                    tdWidth = "width:100%;";
                    itemHtm[0] = "<div style=\"" + tdWidth + ";";
                }
                else
                {
                    //horizontal menu
                    itemHtm[0] = "<div style=\"vertical-align:top;" + tdWidth + ";";
                }

                if (isTree == true & treeLevel > 1)
                {
                    //itemHtm[0] &= "display:none;"
                }

                if (isTree == false)
                {
                    itemHtm[0] += "cursor:pointer;";
                }

                if (isTree == true)
                    @float = "";
                itemHtm[0] += @float + "\"";
                //close style attribute quotes

                //id for menu item
                itemHtm[0] += " id=\"menuitem" + itemId + "_" + z + "\"";

                if (!string.IsNullOrEmpty(rmlMenu.rmlMenu.menuItems[itemIndex].itemMouseOver.htmItem) & isSelected == false)
                {
                    //mouse over for default item
                    itemHtm[0] += " onmouseover=\"mouseOverMenuItem('" + itemId + "','" + z + "');" + dropdownJs + "\" onmouseout=\"mouseOutMenuItem('" + itemId + "','" + z + "');" + dropdownJsOut + "\"";
                }
                else
                {
                    //mouseover for dropdown menu on selected items
                    if (hasDropdown == true)
                        itemHtm[0] += " onmouseover=\"" + dropdownJs + "\" onmouseout=\"" + dropdownJsOut + "\"";
                }
                itemHtm[0] += ">";

                //If isTree = False Then
                if (rmlMenu.rmlMenu.menuItems[itemIndex].itemDefault.htmItem.IndexOf("<rml:url") < 1 & rmlMenu.rmlMenu.menuItems[itemIndex].itemMouseOver.htmItem.IndexOf("<rml:url") < 1)
                {
                    //menu item uses an onClick URL instead of an href URL
                    //If InStr(newUrl, "javascript:") >= 0 Then
                    if ((item.Attributes["clickwidth"] == null) == false)
                    {
                        string clickwidth = item.Attributes["clickwidth"].Value.Replace("%", "");
                        if (!string.IsNullOrEmpty(clickwidth))
                        {
                            clickwidth = int.Parse(clickwidth) - (10 * (treeLevel - 1)) + "%";
                        }

                        htm += itemHtm[0] + "<div class=\"absolute empty-href" + dropdownClass + "\"" + dropdownAttr + " style=\"" + (item.HasChildNodes == true ? "left:" + (27 * treeLevel) + "px;" : "") + ";\"><div class=\"div-href\"><a style=\"display:block; overflow:hidden; width:" + clickwidth + ";\" href=\"" + newUrl + "\" " + extraAttr + "></a></div></div>";
                    }
                    else
                    {
                        if (layoutDirection == 1)
                        {
                            panelMenu.Classes.Add("noprint div-float-width");
                        }
                        htm += itemHtm[0];
                        htm += "<div class=\"absolute empty-href" + dropdownClass + "\"" + dropdownAttr + "><a class=\"div-href\" style=\"display:inline-block; overflow:hidden;\" href=\"" + newUrl + "\" target=\"" + target + "\" " + extraAttr + "></a></div>";
                    }
                }
                //Else
                //generate link for treeview item
                //htm &= itemHtm[0]
                //End If
                panelMenu.Classes.Add("noprint div-float-width");

                //create menu selected
                string newItemSelected = "<div id=\"" + itemId + "_itemSelected" + z + "\" style=\"";
                if (isSelected == false)
                    newItemSelected += "display:none; ";
                newItemSelected += "width:100%;\">";
                newItemSelected += rmlMenu.rmlMenu.menuItems[itemIndex].itemSelected.htmItem + "</div>";
                if (newItemSelected.IndexOf("<rml:icon/>") >= 0)
                {
                    if (!string.IsNullOrEmpty(icon))
                    {
                        newItemSelected = newItemSelected.Replace("<rml:icon/>", rmlMenu.rmlMenu.menuItems[itemIndex].itemSelected.htmIcon.Replace("<rml:image/>", icon));
                    }
                    else
                    {
                        newItemSelected = newItemSelected.Replace("<rml:icon/>", "");
                    }
                }

                if (titles.Length > 2)
                {
                    newItemSelected = newItemSelected.Replace("<rml:title/>", titleHead + titles[2] + titleFoot);
                }
                else if (titles.Length >= 0)
                {
                    newItemSelected = newItemSelected.Replace("<rml:title/>", titleHead + titles[0] + titleFoot);
                }
                else
                {
                    newItemSelected = newItemSelected.Replace("<rml:title/>", titleHead + newTitle + titleFoot);
                }

                if (isTree == true)
                {
                    //add treeview to selected menu
                    newItemSelected = GenerateTreeview(newItemSelected, rmlMenu.rmlMenu.menuItems[itemIndex].itemSelected, itemId + "_item" + z + "Selected", itemId + "_item" + z, item, treeLevel, item.HasChildNodes, (showLevel == true ? false : true));
                }
                else
                {
                    newItemSelected = newItemSelected.Replace("<rml:treeview/>", "");
                }

                htm += newItemSelected;

                //create menu default
                string newItemDefault = "<div id=\"" + itemId + "_item" + z + "\" style=\"";
                if (isSelected == true)
                    newItemSelected += "display:none; ";
                newItemDefault += "\">" + rmlMenu.rmlMenu.menuItems[itemIndex].itemDefault.htmItem + "</div>";

                if (newItemDefault.IndexOf("<rml:icon/>") >= 0)
                {
                    if (!string.IsNullOrEmpty(icon))
                    {
                        newItemDefault = newItemDefault.Replace("<rml:icon/>", rmlMenu.rmlMenu.menuItems[itemIndex].itemDefault.htmIcon.Replace("<rml:image/>", icon));
                    }
                    else
                    {
                        newItemDefault = newItemDefault.Replace("<rml:icon/>", "");
                    }
                }

                if (titles.Length >= 0)
                {
                    newItemDefault = newItemDefault.Replace("<rml:title/>", titleHead + titles[0].Replace("{", "'") + titleFoot);
                }
                else
                {
                    newItemDefault = newItemDefault.Replace("<rml:title/>", titleHead + newTitle.Replace("{", "'") + titleFoot);
                }

                newItemDefault = newItemDefault.Replace("<rml:url/>", newUrl);
                newItemDefault = newItemDefault.Replace("<rml:id/>", itemId + z);

                if (isTree == true)
                {
                    //add treeview to default menu
                    newItemDefault = GenerateTreeview(newItemDefault, rmlMenu.rmlMenu.menuItems[itemIndex].itemDefault, itemId + "_item" + z, itemId + "_item" + z, item, treeLevel, item.HasChildNodes, (showLevel == true ? false : true));
                }
                else
                {
                    newItemDefault = newItemDefault.Replace("<rml:treeview/>", "");
                }

                //create menu mouseover
                string newItemMouseOver = "";
                if (!string.IsNullOrEmpty(rmlMenu.rmlMenu.menuItems[itemIndex].itemMouseOver.htmItem))
                {
                    newItemMouseOver = "<div id=\"" + itemId + "_item" + z + "Over\" style=\"display:none; width:100%;\">";
                    //newItemMouseOver &= " onmouseout=""mouseOutMenuItem('" & itemId & "_item" & z & "');"">"
                    newItemMouseOver += rmlMenu.rmlMenu.menuItems[itemIndex].itemMouseOver.htmItem + "</div>";
                    if (newItemMouseOver.IndexOf("<rml:icon/>") >= 0)
                    {
                        if (!string.IsNullOrEmpty(icon))
                        {
                            newItemMouseOver = newItemMouseOver.Replace("<rml:icon/>", rmlMenu.rmlMenu.menuItems[itemIndex].itemMouseOver.htmIcon.Replace("<rml:image/>", icon));
                        }
                        else
                        {
                            newItemMouseOver = newItemMouseOver.Replace("<rml:icon/>", "");
                        }
                    }
                    if (titles.Length > 1)
                    {
                        newItemMouseOver = newItemMouseOver.Replace("<rml:title/>", titleHead + titles[1] + titleFoot);
                    }
                    else
                    {
                        newItemMouseOver = newItemMouseOver.Replace("<rml:title/>", titleHead + newTitle + titleFoot);
                    }

                    newItemMouseOver = newItemMouseOver.Replace("<rml:url/>", newUrl);
                    newItemMouseOver = newItemMouseOver.Replace("<rml:id/>", itemId + z);

                    if (isTree == true)
                    {
                        //add treeview to mouseover menu
                        newItemMouseOver = GenerateTreeview(newItemMouseOver, rmlMenu.rmlMenu.menuItems[itemIndex].itemMouseOver, itemId + "_item" + z + "Over", itemId + "_item" + z, item, treeLevel, item.HasChildNodes, (showLevel == true ? false : true));
                    }
                    else
                    {
                        newItemMouseOver = newItemMouseOver.Replace("<rml:treeview/>", "");
                    }
                }

                htm += newItemDefault + newItemMouseOver;



                htm += "</div>";
                if (isTree == true & item.HasChildNodes == false)
                {
                    htm += "<ul menuid=\"" + x + "\" class=\"rml-menu\"></ul>";
                }

                if (!string.IsNullOrEmpty(reload))
                {
                    if (int.Parse(reload) == x)
                    {
                        reloadLevel = treeLevel;
                    }
                }

                //get next element from xml
                if (item.HasChildNodes == true)
                {
                    item = item.FirstChild;
                    treeLevel += 1;
                }
                else
                {
                    do
                    {
                        if ((item.NextSibling == null) == false)
                        {
                            item = item.NextSibling;
                            break;

                        }
                        else
                        {
                            if (treeLevel == 1)
                            {
                                item = null;
                                break;
                            }
                            htm += "</li></ul></li>";
                            if ((item.ParentNode == null) == false)
                            {
                                item = item.ParentNode;
                                treeLevel -= 1;
                                if (treeLevel == reloadLevel)
                                {
                                    //send item via javascript and exit
                                    if (isTree == true)
                                    {
                                        R.Page.RegisterJS("menuitem", "$(\"[menuid='" + reload + "']\")[0].innerHTML = '" + htm.Replace("'", "\\'").Replace("\n", "\\n") + "';");
                                    }
                                    return;
                                }
                            }
                            else
                            {
                                item = null;
                                break;
                            }
                        }
                    } while (true);
                }

                if (item == null)
                    break;

                //vertical menu
                if (layoutDirection == 2)
                {
                    if (!string.IsNullOrEmpty(rmlMenu.rmlMenu.menuItems[itemIndex].splitVert))
                        htm += rmlMenu.rmlMenu.menuItems[itemIndex].splitVert;
                }
                else
                {
                    if (!string.IsNullOrEmpty(rmlMenu.rmlMenu.menuItems[itemIndex].splitHorz))
                        htm += rmlMenu.rmlMenu.menuItems[itemIndex].splitHorz;
                }

            } while (true);

            if (isTree == true)
                htm += "</ul>";

            //add menu footer
            htm += "<div style=\"clear:both; height:0px; font-size:0px;\"></div>";
            if (itemCount > 0)
            {
                htm += rmlMenu.rmlMenu.htmFoot;
            }

            InnerHTML = htm;

            if (!string.IsNullOrEmpty(myJs))
                R.Page.RegisterJS("loadmenu" + itemId, myJs);

            RefreshComponent();

        }

        private string GenerateTreeview(string designHtm, RmlMenu.structMenuItem menuItem, string menuItemId, string treeId, XmlNode treeItem, int treeLevel, bool hasChildren, bool showPlus = true)
        {
            string htm = designHtm;
            string tree = "";
            XmlNode parentItem = default(XmlNode);
            int[] start = new int[3];
            start[0] = htm.IndexOf("<rml:treeview/>");
            if (start[0] >= 0)
            {
                //add sub lines
                for (int x = 2; x <= treeLevel; x++)
                {
                    parentItem = treeItem;
                    if (treeLevel > 1)
                    {
                        //check to see if parent has next sibling
                        for (int y = treeLevel - 1; y >= x; y += -1)
                        {
                            parentItem = treeItem.ParentNode;
                        }
                    }

                    if (x == treeLevel & x > 1)
                    {
                        //last level in the tree item
                        if ((treeItem.NextSibling == null) == true)
                        {
                            //last sibling
                            tree += "<div style=\"float:left;\">" + menuItem.htmTreeSubEnd[0] + "</div>";
                        }
                        else
                        {
                            //not last sibling
                            tree += "<div style=\"float:left;\">" + menuItem.htmTreeSub[0] + "</div>";
                        }
                    }
                    else if (treeLevel > 1 & x < treeLevel)
                    {
                        //every other level in the tree item
                        if ((parentItem.NextSibling == null) == false)
                        {
                            tree += "<div style=\"float:left;\">" + menuItem.htmTreeSubLine[0] + "</div>";
                        }
                        else
                        {
                            tree += "<div style=\"float:left;\">" + menuItem.htmTreeTab[0] + "</div>";
                        }
                    }

                }


                if (treeItem.HasChildNodes == true)
                {
                    //add expand & minimize buttons
                    string plusDiplay = "";
                    string minusDisplay = "display:none;";
                    if (showPlus == false)
                    {
                        plusDiplay = "display:none;";
                        minusDisplay = "";
                    }
                    tree += "<div style=\"float:left;cursor:pointer;\" id=\"" + menuItemId + "_expand\" onmouseover=\"$('#" + menuItemId + "_expand_default').hide();$('#" + menuItemId + "_expand_mouseover').show();\" onmouseout=\"$('#" + menuItemId + "_expand_mouseover').hide();$('#" + menuItemId + "_expand_default').show();\" onclick=\"treeExpand('" + treeId + "')\">";
                    tree += "<div id=\"" + menuItemId + "_expand_default\" style=\"" + plusDiplay + "\">" + menuItem.htmTreeExpand.itemDefault + "</div>";
                    tree += "<div id=\"" + menuItemId + "_expand_mouseover\" style=\"" + minusDisplay + "\">" + menuItem.htmTreeExpand.itemMouseOver + "</div></div>";
                    tree += "<div style=\"float:left;cursor:pointer;display:none;\" id=\"" + menuItemId + "_minimize\" onmouseover=\"$('#" + menuItemId + "_minimize_default').hide();$('#" + menuItemId + "_minimize_mouseover').show();\" onmouseout=\"$('#" + menuItemId + "_minimize_mouseover').hide();$('#" + menuItemId + "_minimize_default').show();\" onclick=\"treeMinimize('" + treeId + "')\">";
                    tree += "<div id=\"" + menuItemId + "_minimize_default\">" + menuItem.htmTreeMinimize.itemDefault + "</div>";
                    tree += "<div id=\"" + menuItemId + "_minimize_mouseover\" style=\"display:none;\">" + menuItem.htmTreeMinimize.itemMouseOver + "</div></div>";
                }
                else
                {
                    //empty
                    if (treeLevel == 1)
                    {
                        tree += "<div style=\"float:left;\">" + menuItem.htmTreeEmpty + "</div>";
                    }
                    else
                    {
                        tree += "<div style=\"float:left;\">" + menuItem.htmTreeSubEmpty + "</div>";
                    }

                }
                htm = htm.Replace("<rml:treeview/>", tree);
            }
            return htm;
        }

        private void CheckHashForSelectedMenu()
        {
            string url = "";
            string myJs = "";
            bool usesR = false;
            int count = 0;
            int maxc = 0;

            XmlDocument xmlContent = new XmlDocument();
            //load component content as an XML document
            xmlContent.LoadXml(DataField);

            XmlNodeList xmlMenu = xmlContent.SelectNodes("//item");
            if (xmlMenu.Count == 0) { return; }
            if (xmlMenu.Count == 1)
            {
                if (string.IsNullOrEmpty(xmlMenu[0].Attributes["title"].Value.Trim())) { return; }
            }

            string seltext = "";
            string servurl = "";
            int x = 0;

            //set up internal URL string
            servurl = R.Page.Url.pathAndHash;


            if (string.IsNullOrEmpty(servurl))
            {
                servurl = "home";
            }

            string tmpJs = "";
            string tmpSel = "";
            int tmpLength = 0;
            foreach (XmlNode item in xmlMenu)
            {
                count += 1;
                url = R.Server.UrlDecode(item.Attributes["url"].Value.Replace("+", "[pl]")).Replace("[pl]", "+");
                x = int.Parse(item.Attributes["index"].Value);

                //set up menu item URL string
                if (url.IndexOf("\"") >= 0)
                {
                    url = url.Split(new char[] { '\"' }, 2)[0].TrimEnd();
                }

                seltext = url.ToLower().Replace(" ", "-");
                if (seltext == null) { seltext = ""; }

                if (url.IndexOf("#r=") >= 0)
                {
                    //menu item URL is a local Rennder url
                    usesR = true;
                    seltext = seltext.Replace("#r=", "");
                }
                else if (url.Substring(0, 1) == "#")
                {
                    //menu item URL is a hash url
                    seltext = seltext.Replace("#", "");
                }

                if (!string.IsNullOrEmpty(seltext))
                {
                    if (servurl.IndexOf(seltext) == 1)
                    {
                        //select menu
                        if (tmpLength <= seltext.Length)
                        {
                            tmpJs = "selectMenuItem('" + itemId + "','" + count + "'," + xmlMenu.Count + ");";
                            tmpSel = seltext;
                            tmpLength = seltext.Length;
                        }
                        if (servurl == seltext)
                            break;
                    }
                }

            }

            if (!string.IsNullOrEmpty(tmpSel))
            {
                myJs += tmpJs;
                //ViewState(itemId + "_selected") = tmpSel;
            }

            if (!string.IsNullOrEmpty(myJs))
                R.Page.RegisterJS("updatemenu" + itemId, myJs);
        }

    }
}
