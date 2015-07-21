using System;
using System.Collections.Generic;

namespace Rennder.Components
{
    public class Panel : Component
    {
        protected List<Rennder.Panel> myPanels = new List<Rennder.Panel>();

        public string headHtml = "";
        public string footHtml = "";

        public Panel(Core RennderCore) : base(RennderCore)
        {
            
        }

        public override string ComponentName
        {
            get
            {
                return "Panel";
            }
        }

        public override void Load()
        {
            
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
