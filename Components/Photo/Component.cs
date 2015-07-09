using System;
using System.Collections.Generic;

namespace Rennder.Components
{
    public class Photo: Component
    {
        public Photo(Core RennderCore):base(RennderCore)
        {
            
            
        }

        public override string ComponentName
        {
            get
            {
                return "Photo";
            }
        }

        public override string Render()
        {
            autoHeight = true;
            if (UseWidth == false)
            {
                Height = "";
            }
            if (DataField == "")
            {
                InnerHTML = "<img src=\"/components/photo/icon.png\" border=\"0\" style=\"width:100%;\">";
            }else
            {
                InnerHTML = GetPhoto();
            }

            return base.Render();
        }

        private string GetPhoto()
        {

            //the contents should look similar to this:
            //filename|original|mouseover-file|original|default-width|default-height|url|new window (0 - 7)
            //overflow|size|parallax||top-offset|tile|tooltip|background-position|position-value (8 - 16)

            {
                if (!string.IsNullOrEmpty(DataField))
                {
                    string[] contentArr = DataField.Split('|');
                    //If dynamicPhoto.Controls.Count >= 0 Then
                    //    Dim lit As Literal = dynamicPhoto.Controls[0]
                    //    If InStr(lit.Text, contentArr[0]) >= 0 Then Exit Sub
                    //End If
                    bool useBg = false;
                    string alt = "";
                    string htmLit = "";
                    string myJs = "";

                    if (contentArr.Length > 8)
                    {
                        if (contentArr[8] == "1")
                        {
                            useBg = true;
                        }
                    }
                    if (contentArr.Length > 14)
                    {
                        alt = contentArr[14];
                    }


                    if (useBg == false)
                    {
                        //add url link if it exists
                        if (!string.IsNullOrEmpty(contentArr[6]))
                        {
                            string myContent = R.Util.Str.GenerateURL(contentArr[6]);
                            if (myContent.IndexOf("javascript:") >= 0)
                            {
                                myContent = "javascript:\" onclick=\"" + myContent.Replace("javascript:", "");
                            }
                            htmLit += "<a href=\"" + myContent + "\"";

                            if (!string.IsNullOrEmpty(contentArr[2]))
                            {
                                //add mouse hover class
                                htmLit += " class=\"hover\"";
                            }
                            if (contentArr.Length > 7)
                            {
                                if (!string.IsNullOrEmpty(contentArr[7]) & R.Util.Str.IsNumeric(contentArr[7]) == false)
                                {
                                    htmLit += " target=\"" + contentArr[7] + "\"";
                                }
                            }

                            htmLit += ">";
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(contentArr[2]))
                            {
                                htmLit += "<a href=\"javascript:\" class=\"hover\">";
                            }
                        }

                        //add photo
                        htmLit += "<img src=\"/content/websites/" + R.Page.websiteId + "/photos/" + contentArr[1] + "\" alt=\"" + alt + "\"";

                        //add mouseover photo if it exists
                        if (!string.IsNullOrEmpty(contentArr[2]))
                        {
                            double speed = 0.5;
                            htmLit += "class=\"absolute\" style=\"transition: opacity " + speed + "s ease-in-out;\"><img src=\"/content/websites/" + R.Page.websiteId + "/photos/" + contentArr[3] + "\" alt=\"" + alt + "\" class=\"over\" style=\"transition: opacity " + speed + "s ease-in-out;\" />";
                        }
                        else
                        {
                            htmLit += " />";
                        }

                        //add url closing tag if it exists
                        if (!string.IsNullOrEmpty(contentArr[6]))
                        {
                            htmLit += "</a>";
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(contentArr[2]))
                            {
                                htmLit += "</a>";
                            }
                        }
                        Width = contentArr[4] + "px";
                        Height = contentArr[5] + "px";
                    }
                    else
                    {
                        //use background-image on a div element instead of using an img element
                        string img = contentArr[9] + contentArr[1];
                        int topOffset = 0;
                        string backgroundPos = "";
                        if (contentArr.Length > 12)
                        {
                            if (R.Util.Str.IsNumeric(contentArr[12]) == true)
                            {
                                topOffset = -1 * int.Parse(contentArr[12]);
                            }
                        }
                        string repeat = "no-repeat";
                        if (arrData.Length > 13)
                            repeat = arrData[13];
                        if (arrData.Length > 15)
                        {
                            backgroundPos = "background-position:";
                            switch (arrData[15])
                            {
                                case "xy":
                                case "percent":
                                    backgroundPos += arrData[16] + ";";
                                    break;
                                default:
                                    backgroundPos += contentArr[15] + ";";
                                    break;
                            }
                        }

                        htmLit = "<div id=\"divPhoto" + itemId + "\" style=\"background-image:url(/content/websites/" + R.Page.websiteId + "/photos/" + img + ");background-repeat:" + repeat + ";" + backgroundPos + "width:100%;height:100%;overflow:hidden;\"></div>";
                        autoHeight = false;
                        //myJs &= "if($R('" & ClientID & "_item').style.height == ''){$('#" & ClientID & "_item').css({height:" & contentArr[5] & "});}"
                        if (arrData[10] == "1")
                        {
                            if (isEditable == true)
                            {
                                //myJs &= "setTimeout(function(){$('#divPhoto" & itemId & "').parallax('50%', " & arrData[11] & ",null,54," & topOffset & ");},100);"
                            }
                            else
                            {
                                //myJs &= " $('#divPhoto" & itemId & "').parallax('50%', " & arrData[11] & ",null,0," & topOffset & ");"
                            }

                        }
                    }

                    if (!string.IsNullOrEmpty(myJs))
                        R.Page.RegisterJS("updatephoto" + itemId, myJs);
                    //If IsPostBack = True Then R.Page.RegisterJS("resizePhoto" & itemId, "$R('" & DivItem.ClientID & "').style.width = '" & contentArr[4] & "px';$R('" & DivItem.ClientID & "').style.height = '" & contentArr[5] & "px';")

                    //finally, insert html into the literal control
                    return htmLit;
                }
                else
                {
                    if (UseWidth == true)
                    {
                        Width = "150px";
                        Height = "100px";
                    }
                }
            }
            return "";
        }
    }
}
