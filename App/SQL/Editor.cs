
namespace Rennder.SqlClasses
{
    public class Editor: SqlMethods
    {
        public Editor(Core RennderCore) : base(RennderCore)
        {
        }

        #region "Components Window"
        public SqlReader GetComponentsList(int category, int start, int length)
        {
            SqlReader reader = new SqlReader();
            if (R.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(R.Sql.ExecuteReader("SELECT * FROM (SELECT TOP " + (start + length) + " ROW_NUMBER() OVER(ORDER BY cindex ASC) AS rownum, componentId, title, description FROM evolvercomponents WHERE category=" + category + ") AS tbl WHERE rownum >= " + start + " AND rownum <= " + (start + length)));
            }
            return reader;
        }

        public SqlReader GetComponentCategories()
        {
            SqlReader reader = new SqlReader();
            if (R.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(R.Sql.ExecuteReader("SELECT * FROM (SELECT DISTINCT a.title, a.description, a.icon, a.componentcategory, a.orderby, a.applicationid FROM evolverapplicationsowned o LEFT JOIN evolverapplicationcomponentcategories a ON a.applicationid=o.applicationid WHERE o.ownerid=" + R.Page.ownerId + " AND o.websiteid=" + R.Page.websiteId + ") AS tbl ORDER BY applicationid ASC, orderby ASC"));
            }
            return reader;
            //
        }
        #endregion

    }
}
