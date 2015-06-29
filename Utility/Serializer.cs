using System;
using System.IO;
using System.Text;
using System.Xml;
using System.Runtime.Serialization;

namespace Rennder.Utility
{
    public class Serializer
    {
        private Core R;

        public Serializer(Core RennderCore)
        {
            R = RennderCore;
        }

        public object ReadObject(byte[] bytes)
        {
            XmlDictionaryReaderQuotas rq = new XmlDictionaryReaderQuotas();
            XmlDictionaryReader xdw = XmlDictionaryReader.CreateTextReader(bytes, rq);
            return xdw.ReadContentAsObject();
        }

        public object ReadObject(string str)
        {
            MemoryStream sr = new MemoryStream(R.Util.Str.GetBytes(str));
            XmlDictionaryReaderQuotas rq = new XmlDictionaryReaderQuotas();
            XmlDictionaryReader xdw = XmlDictionaryReader.CreateTextReader(sr, rq);
            return xdw.ReadContentAsObject();
        }

        public byte[] WriteObject(Type objType, object obj)
        {
            DataContractSerializer dcs = new DataContractSerializer(objType);
            MemoryStream sw = new MemoryStream();
            XmlDictionaryWriter writer = XmlDictionaryWriter.CreateTextWriter(sw, Encoding.UTF8);
            dcs.WriteObject(writer, obj);
            sw.Flush();
            sw.Seek(0, 0);
            return sw.ToArray();
        }

        public string WriteObjectAsString(Type objType, object obj)
        {
            return Encoding.UTF8.GetString(WriteObject(objType,obj));
        }
    }
}
