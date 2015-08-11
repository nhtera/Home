﻿using System;
using Newtonsoft.Json;

namespace Rennder.Utility
{
    public class Serializer
    {
        private Core R;

        public Serializer(Core RennderCore)
        {
            R = RennderCore;
        }

        public object ReadObject(string str, Type objType)
        {
            return JsonConvert.DeserializeObject(str, objType, new JsonSerializerSettings() { TypeNameHandling = TypeNameHandling.Objects });
        }

        public byte[] WriteObject(object obj)
        {
            return R.Util.Str.GetBytes(JsonConvert.SerializeObject(obj));
        }

        public string WriteObjectAsString(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
    }
}
