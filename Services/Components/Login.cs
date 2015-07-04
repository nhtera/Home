namespace Rennder.Services
{
	public class Login: Service
	{
		public Login(Core RennderCore, string[] paths):base(RennderCore, paths)
		{
		}

        public WebRequest Form()
        {
            WebRequest wr = new WebRequest();
            wr.html = "Login Form";
            return wr;
        }
	}
}