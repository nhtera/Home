using System;
using System.Collections.Generic;

namespace Rennder.Components
{
    public class Textbox : Component
    {
        public Textbox(Core RennderCore) : base(RennderCore)
        {

        }

        public override string ComponentName
        {
            get
            {
                return "Textbox";
            }
        }

        public override void Load()
        {
            base.Load();
            InnerHTML = DataField;
        }
    }
}
