﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rennder.Utility.DOM
{
    public class Element
    {
        public Dictionary<string, string> Attributes = new Dictionary<string, string>();
        public Dictionary<string, string> Style = new Dictionary<string, string>();
        public List<string> Classes = new List<string>();

        public string tagName = "";
        public string innerHTML = "";
        public bool ClosingTag = true;
        public string ID = "";

        public Element(string tagname = "div", string id = "")
        {
            tagName = tagname;
            ID = id;
        }

        public string Render()
        {
            string htm = "<" + tagName;

            //add ID
            if(ID != "") { htm += " id=\"" + ID + "\""; }

            //add class names
            if(Classes.Count > 0)
            {
                htm += " class=\"";
                for (int x = 0; x < Classes.Count; x++)
                {
                   if(x > 0) { htm += " " + Classes[x]; }
                   else { htm += Classes[x]; } 
                }
                htm += "\"";
            }

            //add style
            if (Style.Count > 0)
            {
                htm += " style=\"";
                foreach(KeyValuePair<string, string> style in Style)
                {
                    htm += style.Key + ":" + style.Value + "; ";
                }
                htm += "\"";
            }

            //add attributes
            if (Attributes.Count > 0)
            {
                foreach (KeyValuePair<string, string> attr in Attributes)
                {
                    htm += " " + attr.Key + "=\"" + attr.Value + "\"";
                }
            }
            if(ClosingTag == false)
            {
                htm += "/>";
            }else
            {
                htm += ">" + innerHTML + "</" + tagName + ">";
            }
            return htm;
        }


    }
}
