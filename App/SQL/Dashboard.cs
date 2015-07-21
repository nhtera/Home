
namespace Rennder.SqlClasses
{
    public class Dashboard: SqlMethods
    {
        public Dashboard(Core RennderCore) : base(RennderCore)
        {
        }

        #region "Pages"
        public SqlReader GetPageList(int websiteId, int ownerId, int parentId, int start, int length, int orderBy, string search)
        {
            SqlReader reader = new SqlReader();
            if (R.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                string sql = "";
                sql = "SELECT * FROM (SELECT ROW_NUMBER() OVER(";
                switch (orderBy)
                {
                    case 1:
                    case -1:
                        sql += "ORDER BY datecreated ASC";
                        break;
                    case 2:
                        sql += "ORDER BY datecreated DESC";
                        break;
                    case 3:
                        sql += "ORDER BY datemodified ASC";
                        break;
                    case 4:
                        sql += "ORDER BY datemodified DESC";
                        break;
                    case 5:
                        sql += "ORDER BY title ASC";
                        break;
                    case 6:
                        sql += "ORDER BY title DESC";
                        break;
                    case 7:
                        sql += "ORDER BY usersonly DESC, datecreated ASC";
                        break;
                }
                sql += ") AS rownum, p.pageid, p.title, p.datecreated, p.datemodified, p.favorite, p.security, p.published, p.ratingtotal, p.ratedcount, p.description";
                sql += ", (SELECT COUNT(*) FROM pages WHERE websiteid=" + websiteId + " AND parentid=p.pageid) AS haschildren ";
                sql += "FROM pages p WHERE p.websiteid=" + websiteId + " AND p.ownerid=" + ownerId + " AND p.deleted=0 AND p.enabled=1";
                if (!string.IsNullOrEmpty(search))
                {
                    sql += " AND (p.title LIKE '%" + search + "%' OR p.description LIKE '%" + search + "%')";
                }
                if (orderBy == 7)
                {
                    sql += " AND p.usersonly=1";
                }
                if (parentId > -1)
                {
                    if (parentId == 0)
                    {
                        sql += " AND (p.parentid=0 OR p.parentid is null)";
                    }
                    else
                    {
                        sql += " AND p.parentid=" + parentId;
                    }
                }
                else if (parentId == -1)
                {
                    //favorites only
                    sql += " AND p.favorite=1";
                }
                sql += ") AS mytbl WHERE rownum >= " + start + " AND rownum < " + (start + (length + 1));
                sql += " ORDER BY haschildren DESC";

                reader.ReadFromSqlClient(R.Sql.ExecuteReader(sql));
            }
            return reader;
        }
        #endregion

    }
}
