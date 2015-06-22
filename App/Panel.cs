using System;

namespace Rennder
{
    public class Panel
    {
        private Core R;
        public string Name = "";
        public bool isPartOfLayout = false;
        public int Width = 0;
        public int Height = 0;
        public int Components = 0;
        public int ResizeType = 0;
        public int HeightType = 0;
        public int PageId = 0;
        public string InnerHtml = "";

        private string _DesignHead = "";
        private string _DesignFoot = "";
        private string _StackHead = "";
        private string _StackFoot = "";
        private string _InnerHead = "";
        private string _InnerFoot = "";
        private bool _isEmpty = false;
        private Array _ComponentDesigns;

        private bool _overflow = false;
        private Utility.DOM.Element inner = new Utility.DOM.Element("div");

        public Panel(Core RennderCore, string name = "")
        {
            R = RennderCore;
            Name = name;
        }

        public string Render()
        {
            string htm = "";
            string name = "panel" + Name.Replace(" ", "");
            inner.ID = "inner";
            inner.Classes.Add("inner-panel inner" + name);
            if (Width > 0) { inner.Style.Add("width", Width.ToString() + "px");}
            if (Height > 0) { inner.Style.Add("height", Height.ToString() + "px");}
            inner.Attributes.Add("resizeh",HeightType.ToString());
            inner.Attributes.Add("resize",ResizeType.ToString());
            if (Overflow == true) { inner.Style.Add("overflow", "hidden");}
            
            inner.innerHTML = InnerHead + (isEmpty == true ? "" : InnerHtml) + InnerFoot;

            htm = StackHead + "<div id=\"" + name + "\" class=\"panel" + Name + " ispanel" + (isPartOfLayout == true ? " islayout" : "") + "\">" +
                  DesignHead + inner.Render() + DesignFoot + "</div>" + StackFoot;

            PanelView pv = GetPanelView();
            bool addpv = true;
            if (R.Page.PanelViews.Count > 0)
            {
                foreach (PanelView p in R.Page.PanelViews)
                {
                    if (p.ClassName == pv.ClassName)
                    {
                        addpv = false;
                        break;
                    }
                }
            }
            if (addpv == true)
            {
                R.Page.PanelViews.Add(pv);
            }

            return htm;
        }

        public virtual string DesignHead
        {
            //the html code of the design header for the evolver panel
            get { return _DesignHead; }
            set { _DesignHead = value; }
        }

        public virtual string DesignFoot
        {
            //the html code of the design header for the evolver panel
            get { return _DesignFoot; }
            set { _DesignFoot = value; }
        }

        public virtual string StackHead
        {
            //the html code of the stack panel header for the evolver panel
            get { return _StackHead; }
            set { _StackHead = value; }
        }

        public virtual string StackFoot
        {
            //the html code of the stack panel footer for the evolver panel
            get { return _StackFoot; }
            set { _StackFoot = value; }
        }

        public virtual string InnerHead
        {
            //the html code of the stack panel header for the evolver panel
            get { return _InnerHead; }
            set { _InnerHead = value; }
        }

        public virtual string InnerFoot
        {
            //the html code of the stack panel footer for the evolver panel
            get { return _InnerFoot; }
            set { _InnerFoot = value; }
        }

        public virtual bool isEmpty
        {
            //shows a box inside the panel that says "drag & drop a component here"
            get { return _isEmpty; }
            set { _isEmpty = value; }
        }

        public virtual Array ComponentDesigns
        {
            //the html code of the design header for the evolver panel
            get { return _ComponentDesigns; }
            set { _ComponentDesigns = value; }
        }

        public int ComponentIncrement(int inc = 1)
        {
            Components += inc;
            return Components;
        }

        public virtual void setPadding(string padding)
        {
            inner.Style.Add("padding", padding);
        }

        public virtual bool Overflow
        {
            get { return _overflow; }
            set { _overflow = value; }
        }

        public PanelView GetPanelView()
        {
            PanelView pv = new PanelView();
            pv.Name = Name;
            pv.ClassName = inner.ID;
            pv.isPartOfLayout = isPartOfLayout;
            pv.Components = Components;
            pv.PageId = PageId;
            pv.Height = Height;
            return pv;
        }

        public void LoadFromPanelView(PanelView pv)
        {
            Name = pv.Name;
            isPartOfLayout = pv.isPartOfLayout;
            Components = pv.Components;
            PageId = pv.PageId;
        }

    }

    public class PanelView
    {
        public string Name = "";
        public string ClassName = "";
        public bool isPartOfLayout = false;
        public int Components = 0;
        public int PageId = 0;
        public int Height = 0;
    }
}
