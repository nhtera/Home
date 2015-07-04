using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace Rennder
{
    public class User
    {
        [JsonIgnore]
        public Core R;

        public struct structSecurity
        {
            public double websiteId;
            public string feature; //"full" = full control
            public enumSecurity security;
        }

        public enum enumSecurity
        {
            readwrite = 1,
            read = 2
        }

        public int memberId = 0;
        public int viewerId = 0;
        public string visitorId = "";
        public string email = "";
        public string fullName = "";
        public string photo = "";
        public DateTime signupDate;
        public string displayName = "";
        public int defaultPageId = 0;
        public string editorColor = "charcoal";

        public List<structSecurity> security;
        public List<WebsiteSecurity> websiteSecurity = new List<WebsiteSecurity>();

        public User()
        {
        }

        public void Load(Core RennderCore)
        {
            R = RennderCore;
        }

        public void AddSecurity(double websiteId, string feature, enumSecurity securityLevel)
        {
            structSecurity s = new structSecurity();
            s.websiteId = websiteId;
            s.feature = feature;
            s.security = securityLevel;
            if ((security == null) == true)
                security = new List<structSecurity>();
            if (security.Exists((structSecurity x) => x.feature == feature & x.websiteId == websiteId) == false)
            {
                security.Add(s);
            }

        }

        public bool CheckSecurity(double websiteId, string feature = "full", bool nofull = false)
        {
            if ((security == null) == true)
                security = new List<structSecurity>();
            if (security.Count > 0)
            {
                foreach (structSecurity s in security)
                {
                    if (s.websiteId == websiteId)
                    {
                        if ((s.feature == "full" & nofull == false) == true | s.feature == feature)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        public WebsiteSecurity Website(int websiteId)
        {
            if (websiteSecurity.Count > 0)
            {
                for (int x = 0; x <= websiteSecurity.Count - 1; x++)
                {
                    if (websiteSecurity[x].websiteId == websiteId)
                    {
                        websiteSecurity[x].Init(this);
                        return websiteSecurity[x];
                    }

                }
            }

            //last resort, create a new website security object
            WebsiteSecurity ws = new WebsiteSecurity(this);
            ws.websiteId = websiteId;
            websiteSecurity.Add(ws);
            return websiteSecurity[websiteSecurity.Count - 1];
        }

        public void GetSecurityForWebsite(int websiteId, int memberId)
        {
            SqlDataReader myReader = R.Sql.ExecuteReader("EXEC GetSecurityForWebsite @websiteid=" + websiteId + ", @memberid=" + memberId);
            if (myReader.HasRows == true)
            {
                while (!(myReader.Read() == false))
                {
                    string[] sec = R.Sql.Get("security").Split(',');
                    List<bool> secList = new List<bool>();
                    foreach (string s in sec)
                    {
                        secList.Add(bool.Parse(s));
                    }
                    Website(websiteId).addWebsiteSecurityItem(R.Sql.Get("feature"), secList);
                }
            }
            myReader.Dispose();
        }

    }

    public class WebsiteSecurity
    {
        public struct structSecurityFeature
        {
            public string feature;
            public List<bool> security;
        }

        [JsonIgnore]
        private User myUser;
        public int websiteId = 0;
        public int ownerId = 0;
        public List<structSecurityFeature> securityItems;

        public WebsiteSecurity(User u)
        {
            myUser = u;
            securityItems = new List<structSecurityFeature>();
        }

        public void Init(User u)
        {
            myUser = u;
        }

        public void addWebsiteSecurityItem(string feature, List<bool> security)
        {
            structSecurityFeature s = new structSecurityFeature();
            for (int x = 0; x <= securityItems.Count - 1; x++)
            {
                if (securityItems[x].feature == feature)
                {
                    s = securityItems[x];
                    s.security = security;
                    securityItems[x] = s;
                    return;
                }
            }
            s.feature = feature;
            s.security = security;
            securityItems.Add(s);
        }

        public bool getWebsiteSecurityItem(string feature, int index, bool tryAgain = true, bool nofull = false)
        {
            try
            {
                if (websiteId == 0)
                    return false;
                if (ownerId == 0)
                {
                    //get ownerId
                    ownerId = (int)(myUser.R.Sql.ExecuteScalar("SELECT ownerid FROM websites WHERE websiteid=" + websiteId));
                }
                if (ownerId == myUser.memberId & nofull == false)
                    return true;
                if (myUser.CheckSecurity(websiteId) == true & nofull == false)
                    return true;
                int offset = 0;
                string f = feature;
                if (f.IndexOf("/") >= 0)
                {
                    string[] arrf = feature.Split('/');
                    if (arrf[0] == "dashboard")
                        f = arrf[0];
                    switch (arrf[0])
                    {
                        case "dashboard":
                            switch (arrf[1])
                            {
                                case "pages":
                                    offset = 2;
                                    break;
                                case "media":
                                    offset = 8;
                                    break;
                                case "analytics":
                                    offset = 12;
                                    break;
                                case "security":
                                    offset = 13;
                                    break;
                                case "settings":
                                    offset = 17;
                                    break;
                                case "installapps":
                                    offset = 22;
                                    break;
                                case "designs":
                                    offset = 24;
                                    break;
                            }
                            break;
                    }
                }

                //check for member access
                for (int x = 0; x <= securityItems.Count - 1; x++)
                {
                    if (securityItems[x].feature == f)
                    {
                        return securityItems[x].security[index + offset];
                    }
                }

                if (tryAgain == true & myUser.memberId > 0)
                {
                    //get member access from database and try to authenticate again if it fails the first time
                    myUser.GetSecurityForWebsite(websiteId, myUser.memberId);
                    if (ownerId == myUser.memberId)
                    {
                        //user is owner of web site and has full access
                        myUser.AddSecurity(websiteId, "full", Rennder.User.enumSecurity.readwrite);
                    }
                    return getWebsiteSecurityItem(feature, index, false);
                }
            }
            catch (Exception ex)
            {
            }
            return (nofull == false ? myUser.CheckSecurity(websiteId) : false);
            //last resort, check for admin access
        }
    }
}
