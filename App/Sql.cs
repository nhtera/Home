using System;
using System.Data.SqlClient;
using Microsoft.Framework.ConfigurationModel;

namespace Rennder
{
    public class Sql
    {
        private Core R;
        private SqlConnection conn = new SqlConnection();
        private SqlCommand cmd = new SqlCommand();
        public SqlDataReader reader;

        private bool _started = false;

        public Sql(Core RennderCore)
        {
            R = RennderCore;
        }

        private void Start()
        {
            if (_started == true) { return; }
            var config = new Configuration().AddJsonFile("config.json").AddEnvironmentVariables();
            conn.ConnectionString = config.Get("Data:" + config.Get("Data:Active"));
            conn.Open();
            cmd.Connection = conn;
            cmd.CommandType = System.Data.CommandType.Text;
            _started = true;
        }

        public void Close()
        {
            if (_started == true) { conn.Close(); }
        }

        public SqlDataReader ExecuteReader(String sql)
        {
            if (_started == false) { Start(); }
            cmd.CommandText = sql;
            reader = cmd.ExecuteReader();
            return reader;
        }

        public void ExecuteNonQuery(String sql)
        {
            if (_started == false) { Start(); }
            cmd.CommandText = sql;
            cmd.ExecuteNonQuery();
        }

        public object ExecuteScalar(String sql)
        {
            if (_started == false) { Start(); }
            cmd.CommandText = sql;
            return cmd.ExecuteScalar();
        }

        public string Get(string key)
        {
            var v = reader[key];
            if (v is DBNull) { return ""; }
            string s = v.ToString();
            if (string.IsNullOrEmpty(s)) { return ""; }
            return (reader[key]).ToString();
        }

        public int GetInt(string key)
        {
            string s = Get(key);
            if (R.Util.Str.IsNumeric(s)) { 
            return int.Parse(reader[key].ToString());
            }
            return 0;
        }

        public Int64 GetInt64(string key)
        {
            string s = Get(key);
            if (R.Util.Str.IsNumeric(s))
            {
                return Int64.Parse(s);
            }
            return 0;
        }

        public bool GetBool(string key)
        {
            string s = Get(key);
            return bool.Parse(s);
        }

        public double GetDouble(string key)
        {
            string s = Get(key);
            return double.Parse(s);
        }

        public DateTime  GetDateTime(string key)
        {
            string s = Get(key);
            return DateTime.Parse(s);
        }


        /// <summary>
        /// Encodes the the string so that it can be used for SQL 
        /// (removing any SQL injection attempts)
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string Encode(string str)
        {
            return str;
        }

        public string Decode(string str)
        {
            return str;
        }
    }
}
