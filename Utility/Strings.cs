using System;
using System.Text;

namespace Rennder.Utility
{
    public class Str
    {
        private Core R;

        public Str(Core RennderCore){
            R = RennderCore;
        }

        #region "Convertion"
        public int Asc(string character)
        {
            string c = character.ToString();
            if(character.Length > 1) { c = c.Substring(0, 1); }
            
            return Encoding.ASCII.GetBytes(character)[0];
        }

        public bool IsNumeric(object str)
        {
            double retNum;
            return Double.TryParse((string)str, out retNum);
        }

        #endregion

        public string Right(string str, int len)
        {
            return str.Substring(0, str.Length - 1 - len);
        }

        public string Left(string str, int len)
        {
            return str.Substring(0+len);
        }

        public string FromBoolToIntString(bool value)
        {
            return (value == true ? "1" : "0");
        }

        public string CreateID(int length = 3)
        {
            Random rnd = new Random();
            string result = "";
            for (var x = 1; x <= length; x++) {
                int type = rnd.Next(1, 3);
                int num = 0;
                switch (type)
                {
                    case 1: //a-z
                        num = rnd.Next(0, 26);
                        result += (char)('a' + num);
                        break;

                    case 2: //A-Z
                        num = rnd.Next(0, 26);
                        result += (char)('A' + num);
                        break;

                    case 3: //0-9
                        num = rnd.Next(0, 9);
                        result += (char)('1' + num);
                        break;

                }

            }
            return result;
        }

        public string getFileExtension(string filename)
        {
            for (int x = filename.Length-1; x >= 0; x += -1)
            {
                if (filename.Substring(x, 1) == ".")
                {
                    return filename.Substring(x+1);
                }
            }

            return "";
        }

        public string GetDomainName(string url)
        {
            string[] tmpDomain = GetSubDomainAndDomain(url).Split(new char[] { '.' },3);
            string strDomain = "";
            if(tmpDomain.Length == 2)
            {
                return url;
            }else if(tmpDomain.Length == 3)
            {
                if(tmpDomain[1] == "co")
                {
                    return url;
                }
                return tmpDomain[1] + "." + tmpDomain[2];
            }
            return url;
        }

        public string GetSubDomainAndDomain(string url)
        {
            string strDomain = url.Replace("http://", "").Replace("https://", "").Replace("www.", "").Split('/')[0];
            if (strDomain.IndexOf("localhost") >= 0 | strDomain.IndexOf("192.168") >= 0)
            {
                strDomain = "rennder.com";
            }
            return strDomain.Replace("/", "");
        }

        public string[] GetDomainParts(string url)
        {
            string subdomain = GetSubDomainAndDomain(url);
            string domain = GetDomainName(subdomain);
            string sub = subdomain.Replace(domain, "").Replace(".", "");
            if(sub != "")
            {
                return new string[] { sub, subdomain.Replace(sub, "") };
            }
            return new string[] { "", subdomain };
        }

        public string GetPageTitle(string title)
        {
            return title.Split(new char[] { ' ', '-', ' ' })[1];
        }

        public string GetWebsiteTitle(string title)
        {
            return title.Split(new char[] { ' ', '-', ' ' })[0];
        }

        #region "Validation"
        public bool OnlyAlphabet(string myStr, params string[] exceptionList)
        {
            bool result = false;
            for (int x = 1; x <= myStr.Length; x++)
            {
                result = false;
                if (Asc(myStr.Substring(x, 1)) >= Asc("a") & Asc(myStr.Substring(x, 1)) <= Asc("z"))
                {
                    result = true;
                }
                if (Asc(myStr.Substring(x, 1)) >= Asc("A") & Asc(myStr.Substring(x, 1)) <= Asc("Z"))
                {
                    result = true;
                }
                if (exceptionList.Length >= 0)
                {
                    for (int y = exceptionList.GetLowerBound(0); y <= exceptionList.GetUpperBound(0); y++)
                    {
                        if (myStr.Substring(x, 1) == exceptionList[y])
                        {
                            result = true;
                        }
                    }
                }
                if (result == false)
                {
                    return false;
                }
            }
            return true;
        }
        #endregion

        #region "Anchor Links"
        public string GenerateLinkAsString(string hash, string page = "", bool replacehash = false)
        {
            //creates a string of the URL link within the Rennder web page that may include a hash
            //first, replace partial hash with new hash if there are duplicate hash objects
            string[] arrHash = R.Page.Url.pathAndHash.Split('\"');
            string[] arrNew = null;
            if (!string.IsNullOrEmpty(hash))
                arrNew = hash.Split('\"');
            string[] arrHashCmd = null;
            string[] arrNewCmd = null;
            string finalHash = "";
            string newHash = "";
            string newPage = page;

            //remove duplicates in the hash
            if (!string.IsNullOrEmpty(hash))
            {
                for (int x = 0; x <= arrHash.Length - 1; x++)
                {
                    for (int y = 0; y <= arrNew.Length - 1; y++)
                    {
                        arrHashCmd = arrHash[x].Split('\"');
                        arrNewCmd = arrNew[y].Split('\"');
                        if (arrHashCmd[0] == arrNewCmd[0])
                        {
                            arrHash[x] = "";
                        }
                    }
                }
            }

            //create compiled hash
            if (!string.IsNullOrEmpty(R.Page.Url.pathAndHash))
            {
                for (int x = 0; x <= arrHash.Length - 1; x++)
                {
                    if (!string.IsNullOrEmpty(arrHash[x]))
                    {
                        if (!string.IsNullOrEmpty(finalHash))
                            finalHash += "/";
                        finalHash += arrHash[x];
                    }
                }
            }

            if (R.Page.useAJAX == false & R.Page.isEditable == false)
            {
                //create url
                if (Right(newPage, 1) != "/" & !string.IsNullOrEmpty(newPage))
                    newPage += "/";
                if (Right(newHash, 1) != "/" & !string.IsNullOrEmpty(newHash))
                    newHash += "/";

                if (replacehash == true)
                {
                    newHash = newHash.Replace("//", "/");
                    if (newHash.Trim() == "/")
                        newHash = "";
                    return R.Page.Url.host + newPage + newHash;
                }
                else
                {
                    return R.Page.Url.host + R.Page.Url.path + newPage + finalHash + newHash;
                }
            }
            else
            {
                //create hash url
                if (!string.IsNullOrEmpty(page))
                {
                    newPage = page.ToLower() + "/";
                }
                if (replacehash == true)
                {
                    return "#" + newPage + hash;
                }
                else
                {
                    if (!string.IsNullOrEmpty(R.Page.Url.pathAndHash))
                    {
                        return "#" + R.Page.Url.pathAndHash + "/" + hash;
                    }
                    else
                    {
                        return "#" + hash;
                    }
                }
            }

        }

        public string GenerateLinkAsHtmlAnchorString(string hash, string page = "", string cssClass = "", string cssStyle = "", bool replacehash = false)
        {
            //creates a string of the URL link within the Rennder web page that may include a hash
            string href = "";
            if (R.Page.useAJAX == false & R.Page.isEditable == false)
            {
                href += "<a href=\"" + GenerateLinkAsString(hash, page, replacehash) + "\"";
                if (!string.IsNullOrEmpty(cssClass))
                    href += " class=\"" + cssClass + "\"";
                if (!string.IsNullOrEmpty(cssStyle))
                    href += " style=\"" + cssStyle + "\"";
                href += ">";
            }
            else
            {
                href += "<a href=\"#\" hash=\"" + GenerateLinkAsString(hash, page, replacehash).Replace("#", "") + "\"";
                if (!string.IsNullOrEmpty(cssClass))
                    href += " class=\"" + cssClass + "\"";
                if (!string.IsNullOrEmpty(cssStyle))
                    href += " style=\"" + cssStyle + "\"";
                if (!string.IsNullOrEmpty(page))
                    href += " page=\"" + page + "\"";
                if (replacehash == true)
                    href += " replace=\"true\"";
                href += ">";
            }
            return href;
        }

        public string GenerateURL(string url)
        {
            int i = 0;
            int e = 0;
            string newurl = "";
            string myUrl = url;
            i = myUrl.IndexOf("#r=");
            e = url.Length + 1;
            if (i >= 0)
            {
                newurl = myUrl.Substring(i + 3, e - (i + 3));
                newurl = newurl.Replace(" ", "-");
                newurl = GenerateLinkAsString("", newurl, true);
                if (Right(newurl, 1) == "+")
                    newurl = newurl.Substring(1, newurl.Length - 1);
                myUrl = newurl;
            }
            //inject Rennder Script
            if (myUrl.IndexOf("#s=") >= 0 | myUrl.IndexOf("#v=") >= 0)
            {
                //R.LoadRennderScript();
                //make sure the rennder script class is loaded
                //myUrl = R.Script.ParseHtmlString(myUrl, myContainer.ItemId)
            }
            return myUrl;
        }
        #endregion

    }
}
