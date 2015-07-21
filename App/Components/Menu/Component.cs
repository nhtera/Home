using System;
using System.Xml;

namespace Rennder.Components
{
    public class Menu : Component
    {
        public Menu(Core RennderCore) : base(RennderCore)
        {
            
        }

        public override string Render()
        {
            LoadMenu();
            return base.Render();
        }

        private void LoadMenu(int selectedIndex = -1, string reloadItem = "", int reloadOldIndex = 0, string reloadOldItem = "")
        {
            

        }

    }
}
