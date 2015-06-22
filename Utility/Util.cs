namespace Rennder.Utility
{
    public class Util
    {
        private Core R;

        public Str Str;

        public Util(Core RennderCore)
        {
            R = RennderCore;
            Str = new Str(R);
        }

        public bool IsEmpty(object obj)
        {
            if (string.IsNullOrEmpty((string)obj)==true)
            {
                return true;
            }
            return false;
        }
    }
}
