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

            if (DataField == "")
            {
                DataField = "<div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam cursus eros eget lacus. Suspendisse ante est, lobortis vitae, congue et, bibendum ut, tortor. Sed ut urna. Integer quis lorem non ligula semper ultricies.</div>";
            }

            if(R.Page.isEditable == false)
            {
                InnerHTML = DataField;
            }
            else
            {
                InnerHTML = "<div class=\"textedit\">" + DataField + "</div>";
            }
            
        }
    }
}
