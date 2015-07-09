using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Rennder
{
    public struct structViewStateInfo
    {
        public string id;
        public DateTime dateCreated;
        public DateTime dateModified;
    }

    public class ViewState
    {
        [IgnoreDataMember]
        private Core R;
        public Page Page;

        public void Load(Core RennderCore)
        {
            R = RennderCore;
            Page = R.Page;
        }
    }

    public class ViewStates
    {
        public List<structViewStateInfo> Views = new List<structViewStateInfo>();
    }
}