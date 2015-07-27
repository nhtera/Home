﻿using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNet.Http;
using Microsoft.Net.Http.Headers;

namespace Rennder.Services.Dashboard
{
    public class Photos : Service
    {
        public Photos(Core RennderCore, string[] paths) : base(RennderCore, paths)
        {
        }

        public Inject LoadPhotos()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos > .content";

            //finally, scaffold Rennder platform HTML
            response.html = GetPhotos();
            response.js = CompileJs();

            return response;
        }

        public Inject LoadPhotoList(int start, string folder, string search, int orderby)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .photo-list";

            //finally, scaffold Rennder platform HTML
            response.html = GetPhotos(start, 100, folder, search, orderby);
            response.js = CompileJs();

            return response;
        }

        private string GetPhotos(int start = 1, int length = 100, string folder = "", string search = "", int orderby = 1, List<string> fileTypes = null)
        {
            string htm = "";
            List<string> lstTypes = new List<string>();
            int len = 0; int x = 0;
            bool allowed = true;
            string folderurl = "";
            if (fileTypes != null)
                lstTypes = fileTypes;

            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(R);
            SqlReader reader = sqlDash.GetPhotoList(R.Page.websiteId, start, length, folder, orderby);
            if (reader.Rows.Count > 0)
            {
                while (reader.Read() == true)
                {
                    allowed = true;
                    if (folder != "!")
                    {
                        if (reader.Get("foldername") != folder && folder != "")
                            allowed = false;
                    }
                    

                    if (allowed == true)
                    {
                        if (x >= start - 1)
                        {
                            if (x >= start + length - 1) { break; }
                            len += 1;
                            folderurl = reader.Get("foldername");
                            if (folderurl != "") { folderurl += "/"; }
                            htm += "<div class=\"photo\"><div class=\"check hover-only\"><input type=\"checkbox\" id=\"chkPhoto" + x + "\" filename=\"" + reader.Get("filename") + "\" /></div><div class=\"tbl-cell\"><div class=\"img\"><img src=\"/content/websites/" + R.Page.websiteId + "/photos/" + folderurl + "tiny" + reader.Get("filename") + "\"/></div></div></div>" + "\n";
                        }
                        x += 1;
                    }
                }

            }
            else {
                htm = "<div class=\"no-photos font-faded\">No photos have been uploaded to this folder yet. Drag & Drop photos from your hard drive to this web page to upload them.</div>";
            }

            string js = "R.editor.photos.bind(); R.editor.photos.info = {start:" + (reader.Rows.Count == 0 ? 0 : start) + ", total:" + reader.Rows.Count + ", len:" + len + "};" + "R.editor.photos.listInfo(" + reader.Rows.Count + ");R.editor.photos.folders.hide();R.editor.photos.folders.change('" + folder + "');";
            R.Page.RegisterJS("photos", js);

            return htm;
        }

        public Inject LoadFolders(string type)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .folder-list";

            //finally, scaffold Rennder platform HTML
            response.html = GetFolders();
            response.js = CompileJs();

            return response;
        }

        public Inject AddFolder(string name)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .folder-list";

            //execute SQL
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(R);
            sqlDash.AddPhotoFolder(R.Page.websiteId, name);
            R.Page.RegisterJS("addfolder", "R.editor.photos.folders.hideAdd();");

            //finally, scaffold Rennder platform HTML
            response.html = GetFolders();
            response.js = CompileJs();

            return response;
        }

        public Inject MoveTo(string files, string folder)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = "";

            //execute SQL
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(R);
            sqlDash.MovePhotos(R.Page.websiteId, files.Split(','), folder);

            //move files on disk into target folder

            //finally, scaffold Rennder platform HTML
            response.html = GetPhotos(1, 100, folder);
            response.js = CompileJs();

            return response;
        }

        public Inject Remove(string files)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = "";

            //execute SQL
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(R);
            sqlDash.DeletePhotos(R.Page.websiteId, files.Split(','));

            //finally, scaffold Rennder platform HTML
            response.html = "";
            response.js = CompileJs();

            return response;
        }

        public Inject RemoveFolder(string folder)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .folder-list";

            //execute SQL
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(R);
            sqlDash.DeletePhotoFolder(R.Page.websiteId, folder);

            //finally, scaffold Rennder platform HTML
            response.html = GetFolders();
            response.js = CompileJs();

            return response;
        }

        private string GetFolders(string loadType = "")
        {
            string htm = "";
            int i = 2;
            int e = 0;
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(R);
            SqlReader reader = sqlDash.GetPhotoFolders(R.Page.websiteId);
            htm += "<div class=\"folder-column\">";
            htm += "<div class=\"row color1\"><div class=\"column-row item\">[All Photos]</div></div>";
            htm += "<div class=\"row color2\"><div class=\"column-row item\">[Unorganized Photos]</div></div>";
            while (reader.Read() == true)
            {
                i = (i == 2 ? 1 : 2);
                e += 1;
                if (e > 8)
                {
                    e = 0;
                    i = 1;
                    htm += "</div><div class=\"folder-column\">";
                }

                htm += "<div class=\"row color" + i + "\"><div class=\"column-row item\">" + reader.Get("name") + 
                    "<div class=\"right hover-only icon-close\" style=\"padding-top:3px;\"><a href=\"javascript:\">" +
                    "<svg viewBox=\"0 0 15 15\" style=\"width:12px;\"><use xlink:href=\"#icon-close\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg>" + 
                    "</a></div></div></div>";
            }
            htm += "</div>";
            if (loadType == "move")
            {
                R.Page.RegisterJS("photos", "R.editor.photos.folders.bindForMove();");
            }
            else
            {
                R.Page.RegisterJS("photos", "R.editor.photos.folders.bind();");
            }

            return htm;
        }

        public WebRequest Upload()
        {
            WebRequest wr = new WebRequest();
            if(Files.Count > 0)
            {
                string folder = R.Request.Query["folder"];
                if (folder == null) { folder = ""; }
                if(folder != "") { folder += "/"; }
                string path = "/wwwroot/content/websites/" + R.Page.websiteId + "/photos/" + folder;
                folder = folder.Replace("/", "");
                string ext = ""; string name = ""; string filename = ""; string filenew = ""; bool generated = false;
                Utility.Images image = new Utility.Images(R);
                SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(R);

                foreach (IFormFile file in Files)
                {
                    filename = R.Util.Str.replaceAll(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"'), "", 
                        new string[] { "-", "_", "!", "@", "#", "$", "%", "&", "*", "+", "=", ",", "?" });

                    name = R.Util.Str.CreateID(7).ToLower();
                    ext = R.Util.Str.getFileExtension(filename).ToLower();
                    generated = false;

                    switch (ext)
                    {
                        case "jpg": case "jpeg": case "png": case "gif":
                            if (!Directory.Exists(R.Server.MapPath(path))) {
                                //create directory
                                Directory.CreateDirectory(R.Server.MapPath(path));
                            }

                            //save original photo to disk
                            filenew = name + "." + ext;
                            file.SaveAs(R.Server.MapPath(path + filenew));

                            if(ext != "gif") {
                                // create 7 image sizes: [original (max 4096)], xl (1920), lg (800), med (400), sm (200), tiny (100), icon (50)
                                try
                                {
                                    image.GeneratePhotos(path, filenew);
                                    generated = true;
                                }
                                catch (Exception ex)
                                {
                                    R.Page.RegisterJS("err", "alert('Error: " + ex.Message.Replace("'", "\\'") + ");");
                                }

                            }else { generated = true; }

                            if(generated == true)
                            {
                                //get photo dimensions
                                Utility.structImage photo = image.Load(path, filenew);

                                //save photo to database
                                sqlDash.AddPhoto(R.Page.websiteId, folder, filenew, filename, photo.width, photo.height);
                            }
                            break;
                    }
                    
                }
            }
            return wr;
        }

        public Inject Save(string folder)
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            return LoadPhotoList(1, folder, "", 1);
        }
    }
}
