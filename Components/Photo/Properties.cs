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
            Elements = R.Server.SetupScaffold(new string[] { "helpicon-hover", "helpicon-link", "helpicon-alt", "helpicon-window" });
            Elements["helpicon-hover"] = "";
            Elements["helpicon-link"] = "";
            Elements["helpicon-alt"] = "";
            Elements["helpicon-window"] = "";
        }

        public override void Save()
        {
            base.Save();
        }

    }
}
