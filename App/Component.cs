﻿using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Rennder
{

    public enum enumRmlNames
    {
        button = 0,
        comment = 1,
        grid = 2,
        menu = 3,
        photolist = 4,
        stackpanel = 5,
        textbox = 6,
        product = 7,
        list = 8,
        blogentry = 9
    }

    public class Component
    {

        [JsonIgnore]
        protected Core R;
        public int pageId; //the id of the instance of this component
        public string itemId = ""; //tells whether or not the user just dropped a new component onto the page
        public bool isDropped = false; //tells whether or not this component was loaded on the page using myEvolver.LoadPage()
        public bool justLoaded = false; //if the component is a slave for another component, or generated by another component
        public bool isSlave = false; //the id of the master component, if this component is a slave (isSlave = true)
        public string masterId = ""; //index of component within the panel
        public int index = 0; //allows developers to show editable elements when in edit mode
        public bool isEditable = true; //name of the panel this component belongs to
        public string panelName = ""; //reference the folder where content is loaded from
        public string workfolder = "";
        public int Draggable;
        public string ComponentId;
        public int LayerId;
        public string ComponentType;
        public string PanelId;
        public string ComponentIndex;
        public string ResizeIndexes;
        public string OnResizeGo;
        public string OnResizeStop;
        public string[] arrData;
        public string[] arrDesign;
        public string DataField = "";
        public string DesignField = "";
        public List<string> specialHash;

        private string _stacks = "";
        private string _responsive = "";
        private int _left = 0;
        private int _top = 0;
        private string _width = "";
        private string _height = "";
        private bool _autoHeight = true;
        private bool _autoResize = false;
        private bool _Resizable = false;
        private string _header = "";
        private string _footer = "";
        public bool rendered = false;

        [JsonIgnore]
        public Utility.DOM.Element DivBase;
        [JsonIgnore]
        public Utility.DOM.Element DivItem;
        [JsonIgnore]
        protected Scaffold Scaffold;

        public Component(Core RennderCore)
        {
            R = RennderCore;
            LoadComponentDataArrays();
            DivBase = new Utility.DOM.Element("div");
            DivItem = new Utility.DOM.Element("div");
        }

        /// <summary>
        /// Setup & load your component from this function
        /// </summary>
        public virtual void Load()
        {
        }

        public virtual string Render()
        {
            if(rendered == true) { return _header + DivItem.Render() + _footer; }
            string classes = "component id-" + itemId + " type-" + ComponentId.ToLower().Replace(" ", "").Replace("/", "-");
            if (DivItem.Attributes.ContainsKey("class") == true)
            {
                DivItem.Attributes["class"] += " " + classes;
            }
            else
            {
                DivItem.Attributes["class"] = classes;
            }

            DivBase.Attributes["class"] = classes;
            DivItem.ID = "c" + itemId;
            DivItem.Style["z-index"] = (index + 100).ToString();
            //DivBase.innerHTML = DivItem.Render();
            rendered = true;
            return _header + DivItem.Render() + _footer;

        }

        public virtual void RefreshComponent()
        {
            //executed when the Theme Update Panel is refreshed
            //used to refresh any client-side modifications, such 
            //as loading a flash player via javascript
        }

        public virtual void LoadedNewPage()
        {
            //executed whenever a new page is loaded via AJAX
        }

        public virtual void PostbackLoadComponent()
        {
            //executed whenever evolver makes an AJAX post back
        }

        public virtual void DroppedComponent()
        {
            //executed whenever a component instance is dragged & dropped onto the page
        }

        /// <summary>
        /// Executed after the page is completely loaded, called at the end of myEvolver.LoadPage with pageType = 1
        /// </summary>
        /// <remarks></remarks>
        public virtual void PageLoadComplete()
        {
        }

        public virtual void LoadProperties()
        {
            //executed when the user loads the properties window for this component
        }

        public virtual void SaveProperties()
        {
            //executed when the user saves the properties for this component
        }

        public virtual void SavePage()
        {
            //executed when a user who is editing the page saves the page
        }

        public virtual void DeleteComponent()
        {
            //deletes the component from the page while in edit mode
        }

        public virtual void RemoveComponent()
        {
            //removes the component from the page
        }

        public virtual string ComponentName
        {
            get { return ""; }
        }

        public virtual string ComponentApp
        {
            get { return ""; }
        }

        public string InnerHTML
        {
            get { return DivItem.innerHTML; }
            set { DivItem.innerHTML = value; }
        }

        public int Left
        {
            get { return _left; }
            set { _left = value; }
        }

        public int Top
        {
            get { return _top; }
            set { _top = value; }
        }

        public string Width
        {
            get { return _width; }
            set { _width = value; }
        }

        public string Height
        {
            get { return _height; }
            set { _height = value; }
        }

        public virtual bool UseWidth
        {
            get { return true; }
        }

        public virtual bool UseHeight
        {
            get { return true; }
        }

        public virtual int defaultWidth
        {
            get { return 200; }
        }

        public virtual int defaultHeight
        {
            get { return 200; }
        }

        public virtual bool autoResize
        {
            get { return _autoResize; }
            set
            {
                _autoResize = value;
                if (R.isFirstLoad == true)
                {
                    DivItem.Attributes["autoresize"] = R.Util.Str.FromBoolToIntString(value);
                }
                else
                {
                    R.Page.RegisterJS("autoresize" + itemId, "$R('c" + itemId + "').setAttribute('autoresize','" + R.Util.Str.FromBoolToIntString(value) + "');");
                }
            }
        }

        public virtual bool autoHeight
        {
            get { return _autoHeight; }
            set
            {
                _autoHeight = value;
                if (R.isFirstLoad == true)
                {
                    if (value == true)
                        DivItem.Attributes["autoheight"] = "1";

                }
                else
                {
                    R.Page.RegisterJS("autoh" + itemId, "$R('c" + itemId + "').setAttribute('autoheight','" + R.Util.Str.FromBoolToIntString(value) + "');");
                }
            }
        }

        public virtual bool Resizable
        {
            get { return _Resizable; }
            set
            {
                _Resizable = value;
                if (R.Page.isEditable == true)
                {
                    if (R.isFirstLoad == true)
                    {
                        if (value == false)
                            DivItem.Attributes["resizing"] = R.Util.Str.FromBoolToIntString(value);
                    }
                    else
                    {
                        if (value == false)
                        {
                            R.Page.RegisterJS("resizable" + itemId, "$R('c" + itemId + "').setAttribute('autoresize','0');");
                        }
                        else
                        {
                            R.Page.RegisterJS("resizable" + itemId, "$R('c" + itemId + "').removeAttribute('autoresize');");
                        }
                    }
                }

            }
        }

        public virtual int SelectedIndex
        {
            //when editing a page and selecting this component, 
            //SelectedIndex will be added to the z-index property
            //of this component for purposes such as loading a toolbar
            //within the component that floats above all the other
            //components when selected.
            get { return 0; }
        }

        public virtual int Weight
        {
            //determines how heavy this component is, meaning how much 
            //load the component will take on the server CPU, memory, 
            //and most importantly, SQL queries & the server hard drive.
            get { return 0; }
        }

        public virtual bool ShowProperties
        {
            //if true, shows properties after the user drags & drops the component onto the page
            get { return false; }
        }

        public virtual void RegisterHash()
        {
            //registers all special hash commands with evolver, only when the hash is being executed
        }

        public virtual void ExecuteHash(string hash)
        {
        }

        public virtual void ReceiveCommand(string cmd, string value)
        {
            //execute a command sent from another component
        }

        public virtual object ReturnCommand(string cmd)
        {
            return null;
            //execute a command sent from another component, then return a value back to the other component
        }

        public string MyAttribute(string key)
        {
            return DivItem.Attributes[key];
        }

        public virtual string GetRennderScript(int index)
        {
            //returns the rennder script code used in this component instance, based on the index number
            return "";
        }

        public virtual void LoadRmlClasses()
        {
            //loads all needed rml classes for this component's design, 
            //based on the component instance's design settings
        }

        private void LoadComponentDataArrays()
        {
            if (!string.IsNullOrEmpty(DataField))
            {
                arrData = DataField.Split('|');
            }
            if (!string.IsNullOrEmpty(DesignField))
            {
                arrDesign = DesignField.Split('|');
            }
        }

        public virtual string metaPhoto
        {
            get { return ""; }
        }

        public virtual bool metaPhotoPreferred
        {
            get { return false; }
        }

        /// <summary>
        /// Tells Rennder not to include this component when calculating the max height for a panel
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public virtual bool NoSize
        {
            get { return false; }
            set { }
        }

        public void AddHeader(string htm)
        {
            _header = htm;
        }

        public void AddFooter(string htm)
        {
            _footer = htm;
        }

        public List<string> responsiveDesignLevels
        {
            //properties for each level in the responsive design
            get
            {
                if (string.IsNullOrEmpty(_responsive))
                {
                    List<string> newlist = new List<string>();
                    newlist.AddRange(new string[]{"","","","",""});
                    return newlist;
                }
                return _responsive.Split('|').OfType<string>().ToList();
            }
        }

        public string responsiveDesignLevel(int index)
        {
            if (!string.IsNullOrEmpty(_responsive))
            {
                return responsiveDesignLevels[index];
            }
            return "";
        }

        public void responsiveDesignSetLevels(string value)
        {
            _responsive = value;
        }

        public void responsiveDesignSetLevel(int index, string value)
        {
            string[] arr = value.Replace("undefined", "").Split('|');
            if (arr.Length - 1 < index)
            {
                Array.Resize(ref arr, 5);
            }
            arr[index] = value;
            _responsive = string.Join("|", arr);
        }

        public string Stacks
        {
            //the itemID of the component that this component belongs underneath within the intelligent layering system, for each responsive level
            get { return _stacks; }
            set { _stacks = value; }
        }

        public ComponentView GetComponentView()
        {
            ComponentView cv = new ComponentView();
            cv.pageId = pageId;
            cv.itemId = itemId;
            cv.isSlave = isSlave;
            cv.masterId = masterId;
            cv.index = index;
            cv.isEditable = isEditable;
            cv.panelName = panelName;
            cv.workfolder = workfolder;
            cv.Draggable = Draggable;
            cv.ComponentId = ComponentId;
            cv.ComponentName = ComponentName;
            cv.LayerId = LayerId;
            cv.ComponentType = ComponentType;
            cv.PanelId = PanelId;
            cv.ComponentIndex = ComponentIndex;
            cv.DataField = DataField;
            cv.DesignField = DesignField;
            cv.responsiveLevels = _responsive;
            cv.responsiveStacks = _stacks;
            cv.specialHash = specialHash;

            cv.Left = Left;
            cv.Top = Top;
            cv.Width = Width;
            cv.Height = Height;

            return cv;
        }

        public void LoadFromComponentView(ComponentView cView)
        {
            pageId = cView.pageId;
            itemId = cView.itemId;
            isSlave = cView.isSlave;
            masterId = cView.masterId;
            index = cView.index;
            isEditable = cView.isEditable;
            panelName = cView.panelName;
            workfolder = cView.workfolder;
            Draggable = cView.Draggable;
            ComponentId = cView.ComponentId;
            LayerId = cView.LayerId;
            ComponentType = cView.ComponentType;
            PanelId = cView.PanelId;
            ComponentIndex = cView.ComponentIndex;
            DataField = cView.DataField;
            DesignField = cView.DesignField;
            _responsive = cView.responsiveLevels;
            _stacks = cView.responsiveStacks;
            specialHash = cView.specialHash;
            _left = cView.Left;
            _top = cView.Top;
            _width = cView.Width;
            _height = cView.Height;
        }

    }

    public class ComponentView
    {
        public int pageId; //the id of the instance of this component
        public string itemId = ""; //if the component is a slave for another component, or generated by another component
        public bool isSlave = false; //the id of the master component, if this component is a slave (isSlave = true)
        public string masterId = ""; //index of component within the panel
        public int index = 0; //allows developers to show editable elements when in edit mode
        public bool isEditable = true; //name of the panel this component belongs to
        public string panelName = ""; //reference the folder where content is loaded from
        public string workfolder = "";
        public int Draggable;
        public string ComponentId;
        public string ComponentName;
        public int LayerId;
        public string ComponentType;
        public string PanelId;
        public string ComponentIndex;
        public string DataField = "";
        public string DesignField = "";
        public string responsiveLevels = "";
        public string responsiveStacks = "";

        public List<string> specialHash;
        public int Left = 0;
        public int Top = 0;
        public string Width = "";
        public string Height = "";
    }

    public class ComponentProperties
    {

        [JsonIgnore]
        protected Core R;
        [JsonIgnore]
        protected string InnerHtml = "";
        [JsonIgnore]
        protected Scaffold scaffold;
        [JsonIgnore]
        protected ComponentView _component;

        public string itemId = "";

        public ComponentView Component
        {
            get
            {
                if (_component != null)
                    return _component;
                _component = R.Page.GetComponentViewById(itemId);
                return _component;
            }
        }

        public virtual int Width
        {
            get { return 300; }
        }

        public ComponentProperties(Core RennderCore, ComponentView c)
        {
            R = RennderCore;
            _component = c;
            itemId = Component.itemId;
            scaffold = new Scaffold(R, "/app/components/" + Component.ComponentName.Replace(" ", "/") + "/properties.html", "");
        }

        /// <summary>
        /// Use to execute code when the properties window first loads
        /// </summary>
        /// <remarks></remarks>
        public string Render()
        {

            return scaffold.Render();
        }

        /// <summary>
        /// Use when the properties are saved to the server
        /// </summary>
        /// <remarks></remarks>
        public virtual void Save()
        {
        }

    }

    public class ComponentQuickMenu
    {


        protected Core R;
        public virtual int Width
        {
            get { return 100; }
        }

        public void InitMenu(Core RennderCore)
        {
            R = RennderCore;
        }

        /// <summary>
        /// Use to execute code when the menu first loads
        /// </summary>
        /// <remarks></remarks>

        public virtual void LoadMenu(List<string> data = null, string dataType = "")
        {
        }
    }

}

