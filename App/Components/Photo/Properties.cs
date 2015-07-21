using System;
using System.Collections.Generic;

namespace Rennder.Components.Properties
{
    public class Photo: ComponentProperties
    {
        public override int Width
        {
            get
            {
                return 450;
            }
        }

        public Photo(Core RennderCore, ComponentView c) : base(RennderCore, c)
        {
            scaffold.Setup(new string[] { "helpicon-hover", "helpicon-link", "helpicon-alt", "helpicon-window" });
            scaffold.Data["helpicon-hover"] = "";
            scaffold.Data["helpicon-link"] = "";
            scaffold.Data["helpicon-alt"] = "";
            scaffold.Data["helpicon-window"] = "";
        }

        public override void Save()
        {
            base.Save();
        }

    }
}
