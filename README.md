# Rennder
A powerful website CMS platform for Windows, Linux, &amp; MacOSX, built with Microsoft ASP.net 5 vNext.

[![Rennder](http://www.rennder.com/content/websites/1/media/oahjoffjrx.png)](http://www.youtube.com/watch?v=2cqB4oXiDMk)

watch demo video @ http://www.youtube.com/watch?v=2cqB4oXiDMk

### ASP.net 5 & DNX
Microsoft has released ASP.net 5 vNext as an open source project on GitHub. This new framework can run across multiple platforms, natively on Windows, including Linux & Mac OSX with the help of Mono, in Docker containers, on Azure, and pretty much everywhere.

With ASP.net 5 vNext, you will be able to deploy a new instance of the Rennder platform from the operating system or cloud of your choice, all within minutes.

Learn more about ASP.net 5 vNext at www.github.com/aspnet/home

## Installation for Windows
### Prerequisites
1. Visual Studio 2015
2. SQL Server 2012 or higher

### Setup Project
1. Download, clone, or fork project from the github repository.
2. Load project from `/Sql/SqlServer/` using Visual Studio 2015.
3. Publish project (right-click project in Solution Explorer). In publish window, click `Load Profile` button, select `SqlServer.publish.xml` from project folder. Then, click `Edit...` button for Target database connection. Change Server name to the named-pipe of your installation of SQL Server 2012, then save. Finally, click `Publish` button.
4. Open Rennder project & press play button for `kestrel`, and open your web browser to `http://localhost:5000/`.
5. Log into your dashboard from `http://localhost:5000/#dashboard`, using email `admin@localhost` and password `development`.



###Puphpet + Vagrant + Mono
Rennder running on Linux VM within Windows 7. This is currently my testing environment for Rennder on Linux. At the moment, `dnu restore` doesn't work. I'll keep you updated when I get Rennder working on Linux. So far, the project runs purely on DNX Core 5 without ASP.net 4.6, which means Rennder should theoretically work on Linux right away.

###Current State of the Rennder Platform

The screenshot above is the current Rennder `Page Editor` (built in VS 2013 with jQuery & ASMX web services), displaying the `Inline Text Editor` wrapped around a group of text on a web page.

The live version @ www.rennder.com was built using .net AJAX & Update Panels, which was a failed experiment. 70% of version 1 (ASP.net 4.0 VS 2010) functionality has been ported into version 2 (ASP.net 4.5 VS 2013 web services), and so I am porting version 2 to ASP.net 5 vNext for Visual Studio 2015 RC. 

This repo contains the cross-platform version of Rennder using ASP.net 5 vNext, and contains its own web server pipeline, replacing the traditional IIS pipeline. Startup.cs is called by Microsoft's Kestrel web server, starts listening for requests, and sends requests down a simple pipeline.

The current version of Rennder has separated client-side functionality from server-side completely, so you could theoretically port the C# code to Node.js, Perl, or Erlang. 

Learn how the server pipeline works with this workflow graphic.

![Workflow graphic](http://www.rennder.com/content/websites/1/media/wshbbbdebf.jpg)

# Capabilities
 * Use `components` such as Text, Photos, Videos, Menus, Panels, Comments, Music, Lists, Buttons, Maps, & Rating (e.g. 5 star rating) to build your web pages with.
 * Drag & drop `components` directly onto your web pages from a simple `page editor` toolbar that loads above the web page.
 * Manage all websites from a `dashboard`, which can be displayed in fullscreen-mode, or as a small drop-down menu within the `page editor` for quick access while creating content on your web pages.
 * Develop & install `applications` to extend the funcationality of your website.
 * Share `layers` of content (group of components) across multiple web pages, such as the header & footer of your website.
 * Manage a heirarchy of web pages just like you would a file system.
 * A powerful `Panel` component, capable of handling content in many structured ways. Simply drag & drop a `Panel` component onto the page, then drag & drop components into the Panel `cell` to start. Add a background color or image to the cell. Add more `cells` to your Panel, then drag & drop more components into those cells. Now you can organize the Panel cells into a `grid` of columns & rows. You can also make the grid act like a pinterest board, where each column is independantly stacked. The Panel component can act like a `slideshow` instead of a grid, displaying each `cell` as a slide within the slideshow. 
 * A powerful `List` component. Create an HTML template for a `list item`, then import data into your List component like a spreadsheet. For example, the data could be a list of products (name, description, price). For each row or product in the speadsheet, the List component will generate a `list item` from the HTML template, replacing variables in the template with your data. Now you have a pretty list of products on your web page. You can organize your `list items` just like Panel component `cells`, as a grid with rows & columns, a stacked grid, or slideshow.
 * Page templates. For example, whenever you want to create a new entry for your blog, Rennder will duplicate the `page template` for the blog page to create a new `sub-page` for the blog entry. When you open the new sub-page, you'll see that it looks exactly like the page template, so you can quickly start writing content for the new blog entry instead of spending time setting up a new web page.
 * Data templates. Just like page templates, except instead of duplicating a page template for your new `sub-page`, the page template loads inside of the sub-page. Instead of adding new content to the sub-page, you can only edit what is already there. All the content is managed by the page template. The sub-page simply handles any changes to the content, such as text, photos, or videos.
