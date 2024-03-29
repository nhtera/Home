﻿
namespace Rennder.Element
{
    public class Textbox : Element
    {

        public enum enumTextType
        {
            text = 1,
            password = 2,
            textarea = 3
        }

        public Textbox(Core RennderCore, string path, string name = "") : base(RennderCore, path, name)
        {
        }

        public string Render(string id, string value, string label, string style, enumTextType textType = enumTextType.text)
        {
            string htm = "";
            string styling = style;
            string classes = "";
            string divclass = "";
            string labelinput = "";
            string type = "text";
            string val = "";
            string onblur = "";

            switch (textType)
            {
                case enumTextType.password:
                    type = "password"; break;
                case enumTextType.textarea:
                    type = "textarea"; break;
            }

            //setup classes & styling
            if (scaffold.Arguments.ContainsKey("bg"))
            {
                if(scaffold.Arguments["bg"] == "hidden")
                {
                    classes += "nobg";
                }
            }
            if(styling.Length > 0) { styling = " style=\"" + styling + "\""; }
            if(value.Length > 0) { val=" value=\"" + value + "\""; }
            
            if(textType == enumTextType.textarea)
            {
                //render textarea
                htm = "<div class=\"textbox\">" +
                      "<textarea id=\"txt" + id + "\" name=\"" + id + "\"" + styling + " class=\"" + classes + "\">" + value + "</textarea>" +
                      "</div>";
            }
            else
            {
                //render textbox
                if (label.Length > 0)
                {
                    //add label input
                    divclass = " haslabel";
                    labelinput = "<input type=\"" + type + "\"" + styling + " class=\"islabel " + classes + "\" value=\"" + label + "\" onfocus=\"R.elements.textbox.focus(this)\">";
                    onblur = " onblur=\"R.elements.textbox.blur(this)\"";
                }
                htm = "<div class=\"textbox" + divclass + "\">" +
                    "<input type=\"" + type + "\" id=\"txt" + id + "\" name=\"" + id + "\"" + styling + " class=\"" + classes + "\"" + val + onblur + "/>" +
                    labelinput + "</div>";
            }
            

            Data["input"] = htm;
            return scaffold.Render();
        }
    }
}
