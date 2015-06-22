USE [Rennder]
GO
/****** Object:  User [RennderDev]    Script Date: 6/17/2015 10:54:13 PM ******/
CREATE USER [RennderDev] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [RennderDev]
GO
/****** Object:  StoredProcedure [dbo].[AddAlbumStory]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/14/2009
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddAlbumStory] 
	-- Add the parameters for the stored procedure here
	@ownerId int = 0, 
	@albumTitle nvarchar(100) = '',
	@photoCount int = 0
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	DECLARE @albumId int = 0,
	@i int = 0, 
	@photoIds nvarchar(MAX) = '',
	@tmpId int
	
	INSERT INTO albums (ownerId, title, cover, photocount, datecreated, security, enabled, deleted)
	VALUES (@ownerId, @albumTitle, 0, @photoCount, GETDATE(), 0, 1, 0)
	
	SELECT TOP 1 @albumId = albumId FROM Albums WHERE ownerId=@ownerId ORDER BY albumid DESC
	
	WHILE @i < @photoCount
	BEGIN
		INSERT INTO AlbumPhotos (albumId, ownerId, title, datecreated, security, enabled, deleted)
		VALUES (@albumId, @ownerId, '', GETDATE(), 0,1,0)
		SELECT TOP 1 @tmpId = photoid FROM AlbumPhotos WHERE ownerId=@ownerId AND albumId=@albumId ORDER BY photoId DESC
		IF @photoIds = ''
		BEGIN
			SET @photoIds = CONVERT(nvarchar(100),@tmpId)
		END
		ELSE
		BEGIN
			SET @photoIds = @photoIds + ',' + CONVERT(nvarchar(100),@tmpId)
		END
		
		SET @i = @i + 1
	END
    -- Insert statements for procedure here
	SELECT @albumId AS albumid, @photoIds AS photoIds
END

GO
/****** Object:  StoredProcedure [dbo].[AddBlogEntry]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/28/2013 5:43 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddBlogEntry] 
	-- Add the parameters for the stored procedure here
	@websiteid int,
	@title nvarchar(50),
	@summary nvarchar(200),
	@keywords nvarchar(50),
	@folder int,
	@datecreated datetime,
	@datemodified datetime,
	@security bit
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO applicationbloggerentries (websiteid, title, summary, keywords, folder, datecreated, datemodified, security, deleted) 
	VALUES(@websiteid, @title, @summary, @keywords, @folder, @datecreated, @datemodified, @security, 0)

	SELECT TOP 1 entryid FROM applicationbloggerentries WHERE websiteid=@websiteid AND datecreated=@datecreated ORDER BY datecreated DESC
END

GO
/****** Object:  StoredProcedure [dbo].[AddColorScheme]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 10:45 AM 11/19/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddColorScheme] 
	-- Add the parameters for the stored procedure here
	@name nvarchar(50) = '',
	@colorsortbody nvarchar(6) = 'FFFFFF',
	@colorsort nvarchar(6) = 'FFFFFF',
	@colors nvarchar(MAX) = '',
	@ownerId int = 1,
	@published bit = 0,
	@colorR int = 0,
	@colorG int = 0,
	@colorB int = 0,
	@colorBodyR int = 0,
	@colorBodyG int = 0,
	@colorBodyB int = 0,
	@intsort int = 0,
	@intsortbody int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF (SELECT COUNT(*) FROM ColorSchemes WHERE name=@name) > 0 BEGIN
		UPDATE ColorSchemes SET colorsortbody=@colorsortbody, colorsort=@colorsort, ownerid=@ownerid, colors=@colors, 
		colorR=@colorR, colorG=@colorG, colorB=@colorB, colorBodyR=@colorBodyR, colorBodyG=@colorBodyG, colorBodyB=@colorBodyB, 
		 intsort=@intsort,intsortbody=@intsortbody
		WHERE name=@name 
	END ELSE BEGIN
		INSERT INTO ColorSchemes (schemeid, name, colorsortbody, colorsort, intsort, intsortbody, colors, colorR, colorG, colorB, colorBodyR, colorBodyG, colorBodyB, 
		ownerid, datecreated, datesaved, datepublished, published)
		VALUES ((SELECT MAX(schemeid) FROM ColorSchemes)+1, @name, @colorsortbody, @colorsort, @intsort, @intsortbody, @colors, @colorR, @colorG, @colorB, @colorBodyR, @colorBodyG, @colorBodyB, 
		@ownerId, GETDATE(), GETDATE(), GETDATE(), @published)
	END

	SELECT TOP 1 schemeid FROM colorschemes WHERE name=@name ORDER BY schemeid DESC
END

GO
/****** Object:  StoredProcedure [dbo].[AddComment]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/3/2009 5:23 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddComment] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@fullname nvarchar(50),
	@email nvarchar(50),
	@website nvarchar(100),
	@pageId int = 0,
	@componentId nchar(10) = '',
	@comment nvarchar(MAX) = '',
	@approved bit = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO Comments (writerId, pageId, componentId, fullname, email, website, comment, dateCreated, approved)
	VALUES(@memberId, @pageId, @componentId, @fullname, @email, @website, @comment, GETDATE(), @approved)
END

GO
/****** Object:  StoredProcedure [dbo].[AddLayout]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 3/21/2012
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddLayout] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@designId int = 0,
	@schemeId int = 0,
	@title nvarchar(50) = '',
	@tagwords nvarchar(200) = '',
	@galaxyId int = 0,
	@price int = 0,
	@rating int = 0,
	@ratingcount int = 0,
	@ratingtotal int = 0,
	@datecreated datetime,
	@approved bit = 0,
	@private bit = 0,
	@enabled bit = 0,
	@deleted bit = 0,
	@license bit = 0,
	@licensetype smallint = 0,
	@description nvarchar(200) = '',
	@saleapproved bit=0,
	@parentlayoutId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO EvolverLayouts (layoutid,memberId, designId, schemeId, title, tagwords, galaxyId, price, rating, ratingcount,
	ratingtotal, datecreated, approved, private, enabled, deleted, license, licensetype, description, saleapproved, parentlayoutId)
	VALUES(NEXT VALUE FOR SequenceLayouts, @memberId, @designId, @schemeId, @title, @tagwords, @galaxyId, @price, @rating, @ratingcount, @ratingtotal, @datecreated,
	@approved, @private, @enabled, @deleted, @license, @licensetype, @description, @saleapproved, @parentlayoutId)
	
	SELECT TOP 1 layoutid FROM EvolverLayouts WHERE memberId=@memberId AND title=@title ORDER BY datecreated DESC
END

GO
/****** Object:  StoredProcedure [dbo].[AddMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/13/2011 11:33 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddMember] 
	-- Add the parameters for the stored procedure here
	@firstname nvarchar(25) = '', 
	@lastname nvarchar(25) = '',
	@email nvarchar(75) = '',
	@password nvarchar(100) = '',
	@displayname nvarchar(25) = '',
	@photo nvarchar(30) = '',
	@profilepage int = 0,
	@quote nvarchar(50) = '',
	@gender smallint = 0,
	@bday datetime = '1/1/1983',
	@zipcode nvarchar(10) = '',
	@city nvarchar(25) = '',
	@state nvarchar(2) = '',
	@country nvarchar(3) = '',
	@twitter nvarchar(25) = '',
	@friends int = 0,
	@status int = 0,
	@signupip nvarchar(15) = '',
	@referrer nvarchar(250) = '',
	@activation nchar(20) = '',
	@deleted bit = 0,
	@started bit = 0,
	@defaultcp int = 0,
	@domain nvarchar(50),
	@stripe nvarchar(25) = ''
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    INSERT INTO Members (memberId, firstname, lastname, email, password, displayname, photo, profilepage, keepalive,
    quote, gender, bday, zipcode, city, state, country, stripeCustomerId, twitter, friends, lastlogin, datecreated, status,
    signupip, referrer, activation, deleted, started, defaultcp)
    VALUES
    (NEXT VALUE FOR SequenceMembers, @firstname, @lastname, @email, @password, @displayname, @photo, @profilepage, GETDATE(),
    @quote, @gender, @bday, @zipcode, @city, @state, @country, @stripe, @twitter, @friends, GETDATE(), GETDATE(), @status,
    @signupip, @referrer, @activation, @deleted, @started, @defaultcp)
    
    DECLARE @memberId int = 0
    SELECT @memberId = memberId FROM Members WHERE email=@email
    SELECT @memberId as memberId
END

GO
/****** Object:  StoredProcedure [dbo].[AddNewsLetter]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[AddNewsLetter]
	-- Add the parameters for the stored procedure here
	@websiteId int, 
	@title varchar(25),
	@addblankfield int = 0
AS
BEGIN
	--Add newsletter
	Insert into ApplicationNewsLetter(websiteId, title) values(@websiteId, @title)
	
	--Get new newsletterId
	Declare @newnewsletterId int
	Set @newnewsletterId = (select SCOPE_IDENTITY())
	
	--Add default custom fields
	--Insert into ApplicationNewsLetterCustomFields(newsletterId, type, name, isrequired, sortby) values(@newnewsletterId, 1, 'Name', 1, 1)
	Insert into ApplicationNewsLetterCustomFields(newsletterId, type, name, isrequired, sortby) values(@newnewsletterId, 1, 'Email', 1, 1)
	
	--Optionaly Add new blank custom field
	If @addblankfield > 0
	Begin
		Insert Into ApplicationNewsLetterCustomFields (newsletterId, type, name, value, isrequired) values (@newnewsletterId, 1, 'New Field Name', '', 0) 
	End
	
	--Return new newsletterId
	Select @newnewsletterId
END

GO
/****** Object:  StoredProcedure [dbo].[AddNewsLetterCampaign]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[AddNewsLetterCampaign]
	-- Add the parameters for the stored procedure here
	@newsletterId int, 
	@subject varchar(25),
	@body varchar(max)
AS
BEGIN
	--Update Totals
	Declare @totalcampaigns int = 0
	Set @totalcampaigns = (Select COUNT(campaignID) From ApplicationNewsLetterCampaigns Where newsletterId = @newsletterId) + 1
	Update ApplicationNewsLetter Set totalcampaigns = @totalcampaigns Where newsletterId = @newsletterId
	
	--Insert Campaign
	Insert Into ApplicationNewsLetterCampaigns (newsletterId, subject, body) values (@newsletterId, @subject, @body) 
END

GO
/****** Object:  StoredProcedure [dbo].[AddNewsLetterCustomField]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[AddNewsLetterCustomField]
	-- Add the parameters for the stored procedure here
	@newsletterId int, 
	@type int,
	@name nvarchar(125),
	@value nvarchar(125),
	@isrequired bit
AS
BEGIN
	Declare @intSortby int = 0
	--Get count
	Set @intSortby = (Select COUNT(fieldId) From ApplicationNewsLetterCustomFields Where newsletterId = @newsletterId) + 1
	
	--Insert
	Insert Into ApplicationNewsLetterCustomFields (newsletterId, type, name, value, isrequired, sortby) values (@newsletterId, @type, @name, @value, @isrequired, @intSortby) 
END

GO
/****** Object:  StoredProcedure [dbo].[AddPageABTest]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/2/2013 2:12 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddPageABTest] 
	-- Add the parameters for the stored procedure here
	@websiteid int, 
	@pageid int, 
	@active bit, 
	@title nvarchar(25)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO PagesABTests (websiteid, pageid, testid, active, title, datecreated)
	VALUES(@websiteid, @pageid, 
	CASE WHEN (SELECT MAX(testid) FROM pagesabtests WHERE websiteid=@websiteid AND pageid=@pageid) IS NULL THEN 0
	ELSE (SELECT MAX(testid) FROM pagesabtests WHERE websiteid=@websiteid AND pageid=@pageid)+1 END,
	@active, @title, GETDATE())

END

GO
/****** Object:  StoredProcedure [dbo].[AddWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2009 5:39 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddWebsite] 
	-- Add the parameters for the stored procedure here
	@ownerId int = 0, 
	@layoutId int = 0,
	@galaxyId int = 0,
	@title nvarchar(100) = '',
	@url nvarchar(25) = '',
	@tagwords nvarchar(100) = '',
	@description nvarchar(100) = '',
	@security bit = 0,
	@enabled bit = 0,
	@domainname nvarchar(25) = '',
    @subdomain nvarchar(25) = '',
	@googletoken varchar(max)='',
	@googleprofileId varchar(20) = '',
	@googlewebpropertyId varchar(20) = '',
	@trial bit = 1,
	@customerId nvarchar(50) = '',
	@background nvarchar(250) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    DECLARE @websiteId int, 
    @templateId int,
    @homeId int,
    @dashId int,
    @loginId int,
    @deniedId int,
    @404Id int,
    @layoutownerid int,
    @myDate datetime = GETDATE()
    
    SET @templateId = CAST(RAND() * 1000 AS INT)
    
    -- first create the web site
    INSERT INTO WebSites (websiteid, ownerId, title, url, pagetemplate, pagehome, 
	layoutId, dateCreated, enabled, deleted, trial, customerId, background, 
	websitetype, license, licensetype, saleapproved, price) 
	VALUES(NEXT VALUE FOR SequenceWebsites, @ownerId, @title, @url, @templateId,
    0, @layoutId, @myDate, @enabled, 0, @trial, @customerId, @background, 0,0,0,0,0)
    
    SELECT TOP 1 @websiteId = websiteId FROM WebSites WHERE ownerId=@ownerId ORDER BY websiteId DESC
    
    -- then create the interface page for the web site
    INSERT INTO PageInterfaces (interfaceId, parentId, title, websiteId, datecreated, 
    datemodified, description) VALUES(@templateId, 0, 'Default', @websiteId, GETDATE(),
    GETDATE(), '')
	
	SELECT @layoutownerid = memberId FROM EvolverLayouts WHERE layoutId=@layoutid
	
	-- update the web site with the new home page ID
	
	
	-- include a domain name
	IF @domainname <> ''
	BEGIN
		INSERT INTO WebsiteDomains (websiteid, domain, homepage, datecreated, googletoken, googleprofileId, googlewebpropertyId)
		VALUES (@websiteId, @domainname, @homeId, GETDATE(),@googletoken, @googleprofileId, @googlewebpropertyId)
	END
	
	-- include a sub domain
	IF @subdomain <> ''
	BEGIN
		INSERT INTO WebsiteSubDomains (websiteid, subdomain, domain, datecreated)
		VALUES (@websiteId, @subdomain, 'rennder.com', GETDATE())
	END
	
	
	-- return the website ID
	SELECT @websiteId
END

GO
/****** Object:  StoredProcedure [dbo].[AddWebsiteInterface]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2009 5:39 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddWebsiteInterface] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@title nvarchar(100) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    DECLARE @templateId int,
    @homeId int,
    @layoutownerid int,
    @myDate datetime = GETDATE()
    
    SET @templateId = CAST(RAND() * 1000 AS INT)
    
    -- first create the web site
    INSERT INTO pageinterfaces (interfaceId, parentId, websiteId, title, description, datecreated, datemodified)
    VALUES(@templateId, 0, @websiteId, @title, '',@myDate, @myDate)
END

GO
/****** Object:  StoredProcedure [dbo].[AddWebsitePage]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/10/2009
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddWebsitePage] 
	-- Add the parameters for the stored procedure here
	@ownerId int = 0, 
	@websiteId int = 0,
	@parentid int = 0,
	@galaxyId int = 0,
	@layoutId int = 0,
	@schemeId int = null,
	@title nvarchar(250) = '',
	@tagwords nvarchar(1) = '',
	@background nvarchar(250) = '',
	@css nvarchar(MAX) = '',
	@description nvarchar(MAX) = '',
	@security bit = 0,
	@membersonly int = 0,
	@enabled bit = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @pageId int, @websiteTitle nvarchar(250), @websiteOwnerId int = 0, @path nvarchar(MAX), @pathIds nvarchar(MAX),
	@datenow datetime, @interfaceid int,@newLayoutId int, @bg nvarchar(250), @mycss nvarchar(MAX)
	SET @datenow = GETDATE()
	(SELECT @websiteTitle = title, @newLayoutId = layoutId, @websiteOwnerId = ownerId
	FROM WebSites WHERE websiteId=@websiteId)
	IF @layoutId > 0
	BEGIN
		SET @newLayoutId = @layoutId
	END
	IF @websiteTitle <> ''
	BEGIN
		SET @pageId = NEXT VALUE FOR SequencePages
		SET @bg = @background
		IF @bg = 'null' BEGIN SET @bg = NULL END
		SET @mycss = @css
		IF @mycss = 'null' BEGIN SET @mycss = NULL END

		INSERT INTO Pages (pageId, ownerId, parentid, galaxyId, layoutId, websiteId, interfaceId, schemeId, title, path, 
		datecreated, datemodified, datepublished, security, membersonly, published, lasthit, lasthitip, hitstoday,
		hitstotal, ratingtotal, ratedcount, background, css, description, enabled, deleted) 
		VALUES(@pageId,
		@websiteOwnerId, @parentid, @galaxyId, @newLayoutId, @websiteId, @interfaceid, @schemeId, @websiteTitle + ' - ' + @title,
		@tagwords, @datenow, @datenow, @datenow, @security, @membersonly, 0, @datenow, '', 0, 0, 0, 0, @bg, @mycss, @description, @enabled, 0)

		/*
		SELECT TOP 1 @pageId = pageId FROM Pages p, EvolverLayouts l WHERE p.ownerId=@websiteOwnerId AND p.websiteId=@websiteId AND l.layoutId=p.layoutid ORDER BY p.datecreated DESC
		*/
		/* update page heirarchy paths for title & ids */
		IF @parentId > 0 BEGIN
			UPDATE pages SET path=dbo.GetPagePath(@pageId), pathIds=dbo.GetPagePathIds(@pageId) WHERE pageid=@pageid
		END
		
		
		SELECT TOP 1 p.pageid, p.datecreated, p.datemodified, p.layoutId, p.lasthit, l.memberId AS layoutowner FROM Pages p, EvolverLayouts l WHERE p.ownerId=@websiteOwnerId AND p.websiteId=@websiteId AND l.layoutId=p.layoutid ORDER BY p.datecreated DESC
	END
END

GO
/****** Object:  StoredProcedure [dbo].[AddWebsiteQueue]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/22/2012 1:23 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddWebsiteQueue] 
	-- Add the parameters for the stored procedure here
	@memberid int = 0, 
	@title nvarchar(100) = '',
	@domain nvarchar(50) = '',
	@subdomain nvarchar(50) = '',
	@layoutid int = 0,
	@customerId nvarchar(50) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO WebsiteQueue (memberId, title, domain, subdomain, layoutid, customerId)
	VALUES(@memberid, @title, @domain, @subdomain, @layoutid, @customerId)
END

GO
/****** Object:  StoredProcedure [dbo].[ApproveEvolverLayout]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2013 2:09 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[ApproveEvolverLayout] 
	-- Add the parameters for the stored procedure here
	@layoutid int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE EvolverLayouts SET approved=1 WHERE layoutid=@layoutid
END


GO
/****** Object:  StoredProcedure [dbo].[AuthenticateScreenshot]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/28/2012 1:33 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AuthenticateScreenshot] 
	-- Add the parameters for the stored procedure here
	@auth nvarchar(20) = '',
	@websiteid int = 0,
	@kill int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF (SELECT COUNT(*) FROM screenshots WHERE websiteid=@websiteid AND auth=@auth) = 1
	BEGIN
		IF @kill=1 BEGIN
			DELETE FROM screenshots WHERE websiteid=@websiteid AND auth=@auth
		END
		SELECT 'pass'
	END
END

GO
/****** Object:  StoredProcedure [dbo].[CancelWebsiteSubscription]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/11/2014 6:30 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[CancelWebsiteSubscription]
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@ownerId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE websites SET trial=1 WHERE websiteid=@websiteId AND ownerid=@ownerId
END

GO
/****** Object:  StoredProcedure [dbo].[ChangeEvolverLayout]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/19/2013 1:20 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[ChangeEvolverLayout] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@newLayoutId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    UPDATE Pages SET layoutid=@newLayoutId WHERE websiteId=@websiteId 
	UPDATE Websites SET layoutid=@newLayoutId WHERE websiteId=@websiteId 
END

GO
/****** Object:  StoredProcedure [dbo].[ChangeMemberId]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/16/2013 8:45 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[ChangeMemberId] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@newId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    UPDATE ApplicationForumMembers SET memberid=@newId WHERE memberId=@memberId
	UPDATE ApplicationForumModerators SET memberid=@newId WHERE memberId=@memberId
	UPDATE ApplicationForumThreadReplies SET memberid=@newId WHERE memberId=@memberId
	UPDATE ApplicationForumThreads SET memberid=@newId WHERE memberId=@memberId
	UPDATE ApplicationNewsLetterMembers SET renndermemberid=@newId WHERE renndermemberId=@memberId
	UPDATE ApplicationStorefront SET ownerid=@newId WHERE ownerid=@memberId
	UPDATE ApplicationStorefrontAddresses SET renndermemberid=@newId WHERE renndermemberId=@memberId
	UPDATE ApplicationStorefrontOrders SET customerid=@newId WHERE customerid=@memberId
	UPDATE Comments SET writerId=@newId WHERE writerId=@memberId
	UPDATE ErrorLog SET memberid=@newId WHERE memberId=@memberId
	UPDATE EvolverApplicationsOwned SET ownerid=@newId WHERE ownerid=@memberId
	UPDATE EvolverApplicationsPayments SET ownerid=@newId WHERE ownerid=@memberId
	UPDATE EvolverLayoutsOwned SET memberid=@newId WHERE memberId=@memberId
	UPDATE EvolverMemberSettings SET memberid=@newId WHERE memberId=@memberId
	UPDATE Log SET memberid=@newId WHERE memberId=@memberId
	UPDATE Members SET memberid=@newId WHERE memberId=@memberId
	UPDATE Pages SET ownerid=@newId WHERE ownerid=@memberId
	UPDATE Websites SET ownerid=@newId WHERE ownerid=@memberId
	UPDATE WebsiteSecurity  SET memberid=@newId WHERE memberId=@memberId
END

GO
/****** Object:  StoredProcedure [dbo].[ChangeWebsiteId]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/16/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[ChangeWebsiteId] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@newId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE ApplicationBlogger SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationBloggerEntries SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationClubs   SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationEvents  SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationEventsCalendars  SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationEventsMembers  SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationEventsSelectedCalendars  SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationEvolver SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationForumMembers SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationForums SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationNewsLetter SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefront SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontCustomFields SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontOrders SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontPayPal SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontProductCategories SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontProductCustomFields SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontProducts SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontProductTemplates SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE ApplicationStorefrontSalesTax SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE BreadCrumbs SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE EvolverApplicationsOwned SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE EvolverApplicationsPages SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE EvolverDashboardSettings SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE EvolverMemberSettings SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE Log SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE PageInterfaces SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE Pages SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE PagesABTests SET websiteid=@newId  WHERE websiteid=@websiteId
    UPDATE PagesABTestsIncriment SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE Screenshots SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE WebsiteDomains SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE WebsiteMembers SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE WebSites SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE WebsiteSecurity SET websiteid=@newId  WHERE websiteid=@websiteId
	UPDATE WebsiteSubDomains SET websiteid=@newId  WHERE websiteid=@websiteId
END

GO
/****** Object:  StoredProcedure [dbo].[ChangeWebsiteOwnership]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/18/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[ChangeWebsiteOwnership] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@newOwnerId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE ApplicationBlogger  SET ownerid=@newOwnerId WHERE websiteid=@websiteId 
	UPDATE ApplicationClubs  SET ownerid=@newOwnerId WHERE websiteid=@websiteId 
	UPDATE ApplicationEvents  SET memberid=@newOwnerId WHERE websiteid=@websiteId 
	UPDATE ApplicationEvolver  SET ownerid=@newOwnerId WHERE websiteid=@websiteId 
	UPDATE ApplicationStorefront  SET ownerid=@newOwnerId WHERE websiteid=@websiteId 
	UPDATE EvolverApplicationsOwned SET ownerid=@newOwnerId WHERE websiteid=@websiteId 
	UPDATE Pages SET ownerid=@newOwnerId WHERE websiteid=@websiteId 
	UPDATE WebSites SET ownerid=@newOwnerId WHERE websiteid=@websiteId 
	DELETE FROM WebsiteSecurity WHERE memberId=@newOwnerId AND websiteid=@websiteId 
END

GO
/****** Object:  StoredProcedure [dbo].[CheckLogin]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/19/2012 6:38 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[CheckLogin] 
	-- Add the parameters for the stored procedure here
	@loginId nvarchar(10),
	@ip nvarchar(36)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @logindate datetime,
	@hash nvarchar(100),
	@loginip nvarchar(36),
	@email nvarchar(100)
	
	SELECT @logindate=datecreated, @hash=hash, @loginip=ip, @email=email FROM Login WHERE loginid=@loginId
	DELETE FROM Login WHERE loginid=@loginId 
	
	IF DATEDIFF(SECOND,@logindate, GETDATE()) < 15 AND @loginip = @ip
	BEGIN
		SELECT memberid, displayname, firstname + ' ' + lastname AS fullname, photo, email, datecreated, defaultcp, started FROM members WHERE email=@email AND password COLLATE Latin1_General_CS_AS = @hash AND status = 1
	END
END

GO
/****** Object:  StoredProcedure [dbo].[DeleteNewsLetter]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeleteNewsLetter]
	-- Add the parameters for the stored procedure here
	@newsletterId int = 0
AS
BEGIN
	--Move users subscribed to this newsletter to temp table
	Declare @memberId int, @renndermemberId int, @firstname nvarchar(25), @lastname nvarchar(25), @email nvarchar(75), @datecreated datetime
	DECLARE cursor1 CURSOR FOR 
	SELECT memberId, renndermemberId, firstname, lastname, email, datecreated
	FROM ApplicationNewsLetterMembers
	Where newsletterId = @newsletterId

	OPEN cursor1;

	FETCH NEXT FROM cursor1 
	INTO @memberId, @renndermemberId, @firstname, @lastname, @email, @datecreated;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		Insert Into ApplicationNewsLetterMembersDeleted (memberId, renndermemberId, firstname, lastname, email, datecreated) values (@memberId, @renndermemberId, @firstname, @lastname, @email, @datecreated)

		-- Get the next vendor.
		FETCH NEXT FROM cursor1 
		INTO @memberId, @renndermemberId, @firstname, @lastname, @email, @datecreated;
	END
	CLOSE cursor1;
	DEALLOCATE cursor1;
	
	--Delete newsletter
	Delete from ApplicationNewsLetter Where newsletterId = @newsletterId
	
	--Delete custom fields
	Delete from ApplicationNewsLetterCustomFields Where newsletterId = @newsletterId
	
	--Delete custom member fields
	Delete from ApplicationNewsLetterMemberCustomFields Where memberid IN (SELECT memberid from ApplicationNewsLetterMembers Where newsletterId = @newsletterId)
	
	--Delete members
	Delete from ApplicationNewsLetterMembers Where newsletterId = @newsletterId
	
END

GO
/****** Object:  StoredProcedure [dbo].[DeleteNewsLetterCampaign]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeleteNewsLetterCampaign]
	-- Add the parameters for the stored procedure here
	@newsletterId int,
	@campaignId int
AS
BEGIN
	--Delete campaign history
	Delete from ApplicationNewsLetterCampaigns Where campaignId = @campaignId
	
	--Update total campaigns
	Declare @totalcampaigns int = 0
	Set @totalcampaigns =  (Select totalcampaigns from ApplicationNewsLetter Where newsletterId = @newsletterId) - 1
	Update ApplicationNewsLetter Set totalcampaigns = @totalcampaigns Where newsletterId = @newsletterId
	
END

GO
/****** Object:  StoredProcedure [dbo].[DeleteNewsLetterCustomField]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeleteNewsLetterCustomField] 
	-- Add the parameters for the stored procedure here
	@fieldId int
AS
BEGIN
	--Delete field
	Delete From ApplicationNewsLetterCustomFields Where fieldId = @fieldId
	
END

GO
/****** Object:  StoredProcedure [dbo].[DeleteNewsLetterMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeleteNewsLetterMember]
	-- Add the parameters for the stored procedure here
	@memberId int,
	@newsletterId int
AS
BEGIN
	--Move member fields
	INSERT ApplicationNewsLetterMemberCustomFieldsDeleted
	SELECT * FROM ApplicationNewsLetterMemberCustomFields
	WHERE memberId = @memberId
    
	--Move member
	INSERT ApplicationNewsLetterMembersDeleted
	SELECT * FROM ApplicationNewsLetterMembers
	WHERE memberId = @memberId
	
	--Delete member fields
	Delete From ApplicationNewsLetterMemberCustomFields Where memberId = @memberId
	
	--Delete member
	Delete From ApplicationNewsLetterMembers Where memberId = @memberId
	
	--Update total members
	Declare @totalmembers int = 0
	Set @totalmembers =  (Select totalmembers from ApplicationNewsLetter Where newsletterId = @newsletterId) - 1
	Update ApplicationNewsLetter Set totalmembers = @totalmembers Where newsletterId = @newsletterId
END

GO
/****** Object:  StoredProcedure [dbo].[DeleteUnusedLayouts]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/26/2012
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[DeleteUnusedLayouts] 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    declare @layoutid int, @websiteid int, @cursor1 CURSOR, @shared int = 0

	SET @cursor1 = CURSOR FOR
	SELECT layoutid FROM evolverlayouts WHERE (layoutid in (SELECT layoutid FROM websites WHERE deleted=1) OR layoutid NOT IN (SELECT layoutid FROM websites WHERE deleted=0 OR enabled=1)) AND deleted=0
	OPEN @cursor1
	FETCH FROM @cursor1 INTO @layoutid

	WHILE @@FETCH_STATUS = 0
	BEGIN
		SELECT @shared=COUNT(*) FROM WebSites WHERE layoutId=@layoutid AND websiteId <> @websiteid AND deleted=0 AND enabled=1
		
		IF @shared = 0
		BEGIN
			PRINT @layoutid
			UPDATE EvolverLayouts SET deleted=1, enabled=0 WHERE layoutId=@layoutid
		END
		FETCH FROM @cursor1 INTO @layoutid
	END

	CLOSE @cursor1
	DEALLOCATE @cursor1
END

GO
/****** Object:  StoredProcedure [dbo].[DeleteWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/5/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[DeleteWebsite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@ownerId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	UPDATE Pages SET deleted=1, enabled=0 WHERE websiteId=@websiteId AND ownerId=@ownerid
	UPDATE WebSites SET deleted=1, enabled=0 WHERE websiteId=@websiteId AND ownerId=@ownerid
END

GO
/****** Object:  StoredProcedure [dbo].[DeleteWebsitePermanently]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/20/2013 8:25 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[DeleteWebsitePermanently] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@ownerId int = 0
AS
BEGIN
	SET NOCOUNT ON;

	IF (SELECT COUNT(*) FROM websites WHERE websiteid=@websiteId AND ownerid=@ownerId) > 0
	BEGIN

		SELECT pageid INTO #pages FROM pages WHERE websiteid=@websiteId

		-- core tables to delete from
	
		DELETE FROM websites WHERE websiteid=@websiteid
		DELETE FROM pages WHERE websiteid=@websiteid
		DELETE FROM websitesubdomains WHERE websiteid=@websiteid
		DELETE FROM websitedomains WHERE websiteid=@websiteid
		DELETE FROM evolvermembersettings WHERE websiteid=@websiteid
		DELETE FROM evolverdashboardsettings WHERE websiteid=@websiteid
		DELETE FROM evolverapplicationspages WHERE websiteid=@websiteid
		DELETE FROM evolverapplicationsowned WHERE websiteid=@websiteid
		DELETE FROM comments WHERE pageid IN (SELECT * FROM #pages)

		--application specific tables
		DELETE FROM applicationblogger WHERE websiteid=@websiteid
		DELETE FROM applicationbloggerentries WHERE websiteid=@websiteid

		DELETE FROM applicationevents WHERE websiteid=@websiteid
		DELETE FROM applicationeventscalendars WHERE websiteid=@websiteid
		DELETE FROM applicationeventsmembers WHERE websiteid=@websiteid
		DELETE FROM applicationeventsselectedcalendars WHERE websiteid=@websiteid

		DELETE FROM applicationevolver WHERE websiteid=@websiteid

		SELECT forumid INTO #forums FROM applicationforums WHERE websiteid=@websiteid 
		DELETE FROM applicationforummembers WHERE websiteid=@websiteid
		DELETE FROM applicationforummoderators WHERE forumid IN (SELECT * FROM #forums)
		DELETE FROM applicationforums WHERE websiteid=@websiteid
		DELETE FROM applicationforumthreadreplies WHERE forumid IN (SELECT * FROM #forums)
		DELETE FROM applicationforumthreads WHERE forumid IN (SELECT * FROM #forums)
	
		SELECT productid INTO #products FROM applicationstorefrontproducts WHERE websiteid=@websiteId 
		DECLARE @storefrontid int
		SELECT @storefrontid = storefrontid FROM applicationstorefront WHERE websiteid=@websiteid
		DELETE FROM applicationstorefront WHERE websiteid=@websiteid
		DELETE FROM applicationstorefrontcustomfields WHERE websiteid=@websiteid
		DELETE FROM applicationstorefrontorderitemcustomfields WHERE productid IN (SELECT * FROM #products)
		DELETE FROM applicationstorefrontorderitems WHERE productid IN (SELECT * FROM #products)
		DELETE FROM applicationstorefrontpayments WHERE storefrontid=@storefrontid 
		DELETE FROM applicationstorefrontpaypal WHERE websiteid=@websiteid
		DELETE FROM applicationstorefrontpaypalipn WHERE orderid IN (SELECT orderid FROM applicationstorefrontorders WHERE websiteid=@websiteid)
		DELETE FROM applicationstorefrontproductcategories WHERE websiteid=@websiteid
		DELETE FROM applicationstorefrontproductcustomfields WHERE websiteid=@websiteid
		DELETE FROM applicationstorefrontproducts WHERE websiteid=@websiteid
		DELETE FROM applicationstorefrontproducttemplateitems WHERE templateid IN (SELECT templateid FROM applicationstorefrontproducttemplates WHERE websiteid=@websiteid)
		DELETE FROM applicationstorefrontproducttemplates WHERE websiteid=@websiteid
		DELETE FROM applicationstorefrontsalestax WHERE websiteid=@websiteid

	END
END

GO
/****** Object:  StoredProcedure [dbo].[DisableEvolverLayout]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2013 2:09 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[DisableEvolverLayout] 
	-- Add the parameters for the stored procedure here
	@layoutid int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE EvolverLayouts SET enabled=0 WHERE layoutid=@layoutid
END


GO
/****** Object:  StoredProcedure [dbo].[DisableMemberAccount]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/31/2012 8:37 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[DisableMemberAccount] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE Members SET deleted=1, status=0 WHERE memberId=@memberId
	UPDATE WebSites SET deleted=1 WHERE ownerId=@memberId
	SELECT websiteid INTO #websites FROM WebSites WHERE ownerid=@memberId
	UPDATE Pages SET deleted=1 WHERE websiteId IN (SELECT * FROM #websites)
	
END

GO
/****** Object:  StoredProcedure [dbo].[EnableEvolverLayout]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2013 2:09 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[EnableEvolverLayout] 
	-- Add the parameters for the stored procedure here
	@layoutid int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE EvolverLayouts SET enabled=1, deleted=0 WHERE layoutid=@layoutid
END


GO
/****** Object:  StoredProcedure [dbo].[EnableMemberAccount]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/31/2012 8:37 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[EnableMemberAccount] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE Members SET deleted=0, status=1 WHERE memberId=@memberId
	UPDATE WebSites SET deleted=0 WHERE ownerId=@memberId
	SELECT websiteid INTO #websites FROM WebSites WHERE ownerid=@memberId
	UPDATE Pages SET deleted=0 WHERE websiteId IN (SELECT * FROM #websites)
	
END

GO
/****** Object:  StoredProcedure [dbo].[Events_CheckIfMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Events_CheckIfMember]
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@memberId int = 0,
	@CalendarList varchar(max) = ''
AS
BEGIN
	IF @CalendarList <> ''
	BEGIN
		DECLARE @TempList table
		(
			tempcalendarId int
		)

		DECLARE @tempcalendarId varchar(10), @Pos int

		SET @CalendarList = LTRIM(RTRIM(@CalendarList))+ ','
		SET @Pos = CHARINDEX(',', @CalendarList, 1)

		WHILE @Pos > 0
		BEGIN
			SET @tempcalendarId = LTRIM(RTRIM(LEFT(@CalendarList, @Pos - 1)))
			IF @tempcalendarId <> ''
			BEGIN
				--Check if calendar is private
				IF (SELECT COUNT(calendarId) FROM ApplicationEventsCalendars WHERE calendarId = CAST(@tempcalendarId as int) AND private = 1) > 0
				BEGIN
					--Check if memberid is a part of ApplicationEventsMembers
					IF (SELECT COUNT(memberId) FROM ApplicationEventsMembers WHERE memberId = @memberId AND calendarId = CAST(@tempcalendarId as int)) > 0
					BEGIN
						INSERT INTO @TempList (tempcalendarId) VALUES (CAST(@tempcalendarId AS int))
					END
				END
				ELSE
				BEGIN
					INSERT INTO @TempList (tempcalendarId) VALUES (CAST(@tempcalendarId AS int)) 
				END
			END
			SET @CalendarList = RIGHT(@CalendarList, LEN(@CalendarList) - @Pos)
			SET @Pos = CHARINDEX(',', @CalendarList, 1)
		END	
		
		SELECT COUNT(memberId)
		FROM ApplicationEventsMembers
		WHERE 
		websiteId = @websiteId
		AND memberId = @memberId
		AND calendarId IN (SELECT * FROM @TempList)
	END
END

GO
/****** Object:  StoredProcedure [dbo].[Events_DeleteCalendar]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Events_DeleteCalendar]
	-- Add the parameters for the stored procedure here
	@calendarId int,
	@websiteId int
AS
BEGIN
	--Remove the calendarId from selected calendar lists
	SET NOCOUNT ON;
	DECLARE @calendarlist varchar(max), @memberId int
	DECLARE cal_cursor CURSOR FOR 
	SELECT calendarlist,memberId
	FROM ApplicationEventsSelectedCalendars
	WHERE websiteId=@websiteId

	OPEN cal_cursor

	FETCH NEXT FROM cal_cursor 
	INTO @calendarlist,@memberId

	WHILE @@FETCH_STATUS = 0
	BEGIN
		DECLARE @tempcalendarId varchar(10), @Pos int, @Pos2 int, @origCalendarlist nvarchar(MAX)
		SET @Pos = CHARINDEX(CAST(@calendarId AS nvarchar(10)), @calendarlist, 1)
		
		IF @Pos > 0
		BEGIN
			SET @origCalendarlist = @calendarlist
			SET @Pos = 1
			
			WHILE @Pos > 0
			BEGIN
				SET @Pos2 = CHARINDEX(',', @calendarlist, @Pos + 1)
				
				IF @Pos2 < @Pos
				BEGIN
					Set @Pos2 = LEN(@calendarlist)
				END
				
				SET @tempcalendarId = SUBSTRING(@calendarlist,@Pos,(@Pos2 - @Pos)) 
				IF @tempcalendarId <> ''
				BEGIN
					IF (CAST(@tempcalendarId AS int)) = @calendarId
					BEGIN
						IF @Pos=1
						BEGIN
							Set @calendarlist = SUBSTRING(@calendarlist,@Pos2+1,LEN(@calendarlist)-(@Pos2))
						END
						ELSE
						BEGIN
							Set @calendarlist = SUBSTRING(@calendarlist,1,@Pos-2) + SUBSTRING(@calendarlist,@Pos2,LEN(@calendarlist)-(@Pos2-1))
						END
						
					END
				END
				SET @Pos = CHARINDEX(',', @CalendarList, @Pos+1)+1
				
				IF @origCalendarlist <> @calendarlist
				BEGIN
					UPDATE ApplicationEventsSelectedCalendars SET calendarlist = @calendarlist WHERE memberId = @memberId AND websiteId = @websiteId
					BREAK
				END
			END	
		END
		
		FETCH NEXT FROM cal_cursor 
		INTO @calendarlist,@memberId
	END 
	CLOSE cal_cursor;
	DEALLOCATE cal_cursor;

    --Delete tables
	Delete From ApplicationEvents Where calendarId = @calendarId
	Delete From ApplicationEventsMembers Where calendarId = @calendarId
	Delete From ApplicationEventsCalendars Where calendarId = @calendarId
END

GO
/****** Object:  StoredProcedure [dbo].[Events_GetCalendars]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Events_GetCalendars]
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@calendarId int = 0,
	@memberId int = 0
AS
BEGIN
	SELECT calendarlist AS calendarlist FROM ApplicationEventsSelectedCalendars WHERE websiteId = @websiteId AND memberId = @memberId

	SELECT calendarId,title,websiteId,color,private,datecreated
	FROM ApplicationEventsCalendars
	WHERE 
	websiteId = @websiteId
	AND calendarId = CASE WHEN @calendarId > 0 THEN @calendarId ELSE calendarId END	
END

GO
/****** Object:  StoredProcedure [dbo].[Events_GetEvents]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Events_GetEvents]
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@calendarId int = 0,
	@memberId int = 0,
	@calendarmonthFrom date,
	@calendarmonthTo date,
	@CalendarList varchar(max) = ''
AS
BEGIN

	IF @CalendarList <> ''
	BEGIN
		
		DECLARE @TempList table
		(
			tempcalendarId int
		)

		DECLARE @tempcalendarId varchar(10), @Pos int

		SET @CalendarList = LTRIM(RTRIM(@CalendarList))+ ','
		SET @Pos = CHARINDEX(',', @CalendarList, 1)

		WHILE @Pos > 0
		BEGIN
			SET @tempcalendarId = LTRIM(RTRIM(LEFT(@CalendarList, @Pos - 1)))
			IF @tempcalendarId <> ''
			BEGIN
				--Check if calendar is private
				IF (SELECT COUNT(calendarId) FROM ApplicationEventsCalendars WHERE calendarId = CAST(@tempcalendarId as int) AND private = 1) > 0
				BEGIN
					--Check if memberid is a part of ApplicationEventsMembers
					IF (SELECT COUNT(memberId) FROM ApplicationEventsMembers WHERE memberId = @memberId AND calendarId = CAST(@tempcalendarId as int)) > 0
					BEGIN
						INSERT INTO @TempList (tempcalendarId) VALUES (CAST(@tempcalendarId AS int))
					END
				END
				ELSE
				BEGIN
					INSERT INTO @TempList (tempcalendarId) VALUES (CAST(@tempcalendarId AS int)) 
				END
			END
			SET @CalendarList = RIGHT(@CalendarList, LEN(@CalendarList) - @Pos)
			SET @Pos = CHARINDEX(',', @CalendarList, 1)
		END	
		
		SELECT eventId,memberId,calendarId,websiteId,title,description,importance,location,datefrom,dateto,allday,repeat,repeatdays,color,datecreated,usercreated
		FROM ApplicationEvents
		WHERE 
		websiteId = @websiteId
		AND calendarId = CASE WHEN @calendarId > 0 THEN @calendarId ELSE calendarId END	
		--AND memberId = CASE WHEN @memberId > 0 THEN @memberId ELSE memberId END	
		AND datefrom Between @calendarmonthFrom And @calendarmonthTo
		AND calendarId IN (SELECT * FROM @TempList)
		ORDER BY datefrom ASC
	
	END
	ELSE
	BEGIN
		SELECT eventId,memberId,calendarId,websiteId,title,description,importance,location,datefrom,dateto,allday,repeat,repeatdays,color,datecreated,usercreated
		FROM ApplicationEvents
		WHERE 
		websiteId = @websiteId
		AND calendarId = CASE WHEN @calendarId > 0 THEN @calendarId ELSE calendarId END	
		AND memberId = CASE WHEN @memberId > 0 THEN @memberId ELSE memberId END	
		AND datefrom Between @calendarmonthFrom And @calendarmonthTo
		ORDER BY datefrom ASC
	END
END

GO
/****** Object:  StoredProcedure [dbo].[EvolverLayoutLicense]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[EvolverLayoutLicense] 
	-- Add the parameters for the stored procedure here
	@layoutid int = 0, 
	@licensetype int = 0,
	@price int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF @licensetype = 0 BEGIN -- Private License
		UPDATE evolverlayouts SET private=1, saleapproved=0, license=0, licensetype=0, price=0 WHERE layoutid=@layoutid
	END
	ELSE IF @licensetype = 1 BEGIN -- Public Free License
		UPDATE evolverlayouts SET private=0, saleapproved=1, license=1, licensetype=1, price=0 WHERE layoutid=@layoutid
	END
	ELSE IF @licensetype = 2 BEGIN -- Professional License
		UPDATE evolverlayouts SET private=0, saleapproved=1, license=1, licensetype=2, price=@price WHERE layoutid=@layoutid
	END

END

GO
/****** Object:  StoredProcedure [dbo].[Forum_AddMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_AddMember]
	-- Add the parameters for the stored procedure here
	@websiteId int,
	@rennderId int = 0,
	@firstname nvarchar(25) = '', 
	@lastname nvarchar(25) = '',
	@email nvarchar(75) = '',
	@password nvarchar(100) = ''
AS
BEGIN
	--If they have a rennder account just insert into forum member table
	IF @rennderId > 0
	Begin
		INSERT INTO ApplicationForumMembers (memberId, websiteId) Values(@rennderId, @websiteId)
	End
	
	--If they do not have a rennder account we have to add them to rennder
	If @rennderId = 0
	Begin
		Declare @newrennderId int = 0
		
		INSERT INTO Members (firstname, lastname, email, password) Values(@firstname, @lastname, @email, @password)
		Set @newrennderId = (SELECT SCOPE_IDENTITY())
	
		INSERT INTO ApplicationForumMembers (memberId, websiteId) Values(@newrennderId, @websiteId)
	End
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_AddReply]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_AddReply] 
	-- Add the parameters for the stored procedure here
	@forumId int,
	@threadId int,
	@memberId int,
	@reply nvarchar(max) = ''
AS
BEGIN

	--Insert Reply
	INSERT INTO ApplicationForumThreadReplies (forumId,threadId,memberId,reply) values(@forumId,@threadId,@memberId,@reply)

    --Update forum totalreplies
	Declare @totalrepliesfromforum int
	Set @totalrepliesfromforum = (SELECT COUNT(replyId) FROM ApplicationForumThreadReplies WHERE forumId = @forumId)
    Update ApplicationForums Set totalreplies = @totalrepliesfromforum where forumId=@forumId

	--Update totalreplies
	Declare @totalreplies int
	Set @totalreplies = (SELECT COUNT(replyId) FROM ApplicationForumThreadReplies WHERE threadId = @threadId)
    Update ApplicationForumThreads Set totalreplies = @totalreplies Where threadId=@threadId

	--Update member total replies
	Declare @totalrepliesfrommember int
	Set @totalrepliesfrommember = (SELECT COUNT(replyId) FROM ApplicationForumThreadReplies WHERE memberId=@memberId)
	UPDATE ApplicationForumMembers Set totalposts = @totalrepliesfrommember WHERE memberId=@memberId AND forumId is NULL

	--Update the thread's lastpostby
	Declare @firstname nvarchar(50), @lastname nvarchar(50)
    Set @firstname = (SELECT firstname FROM Members WHERE memberId = @memberId)
    Set @lastname = (SELECT lastname FROM Members WHERE memberId = @memberId)
    UPDATE ApplicationForumThreads SET lastpost = GETDATE(), lastpostby = @firstname + ' ' + @lastname WHERE threadId = @threadId
ENd

GO
/****** Object:  StoredProcedure [dbo].[Forum_AddThread]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_AddThread]
	-- Add the parameters for the stored procedure here
	@forumId int,
	@memberId int,
	@title nvarchar(150),
	@reply nvarchar(max) = ''
AS
BEGIN
	--Insert thread
	INSERT INTO ApplicationForumThreads (forumId,memberId,title) values(@forumId,@memberId,@title)
	Declare @newthreadId int
	Set @newthreadId = (Select SCOPE_IDENTITY())

	--Update totalthreads
	Declare @totalthreads int
	Set @totalthreads = (SELECT COUNT(threadId) FROM ApplicationForumThreads WHERE forumId = @forumId)
    Update ApplicationForums Set totalthreads = @totalthreads WHERE forumId = @forumId

	--Insert reply
	If NOT @reply = ''
	Begin
		INSERT INTO ApplicationForumThreadReplies (forumId,threadId,memberId,reply) VALUES(@forumId,@newthreadId,@memberId,@reply)
	
		--Update member total replies
		Declare @totalrepliesfrommember int
		Set @totalrepliesfrommember = (SELECT COUNT(replyId) FROM ApplicationForumThreadReplies WHERE memberId=@memberId)
		UPDATE ApplicationForumMembers Set totalposts = @totalrepliesfrommember WHERE memberId=@memberId AND forumId is NULL
	
	    --Update forum total replies
	    Declare @totalreplies int
		Set @totalreplies = (SELECT COUNT(replyId) FROM ApplicationForumThreadReplies WHERE forumId=@forumId)
		UPDATE ApplicationForums Set totalreplies = @totalreplies WHERE forumId=@forumId
	
		--Get first name and last name
		Declare @firstname nvarchar(25), @lastname nvarchar(25)
		SET @firstname = (SELECT firstname FROM Members WHERE memberId=@memberId)
		SET @lastname = (SELECT lastname FROM Members WHERE memberId=@memberId)
	
	    --Update new thread details
	    UPDATE ApplicationForumThreads SET lastpost=GetDate(), lastpostby=@firstname + ' ' + @lastname, totalreplies=1 WHERE threadId=@newthreadId
	End
	
	SELECT @newthreadId
ENd

GO
/****** Object:  StoredProcedure [dbo].[Forum_DeleteForum]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_DeleteForum]
	-- Add the parameters for the stored procedure here
	@forumId int
AS
BEGIN
	Delete From ApplicationForumThreads Where forumId = @forumId
	Delete From ApplicationForumThreadReplies Where forumId = @forumId
	Delete From ApplicationForums Where forumId = @forumId
	Delete From ApplicationForumModerators Where forumId = @forumId
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_DeleteMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_DeleteMember]
	-- Add the parameters for the stored procedure here
	@memberId int
AS
BEGIN
    Delete From ApplicationForumThreadReplies Where memberId = @memberId
	Delete From ApplicationForumThreads Where memberId = @memberId
	Delete From ApplicationForumModerators Where memberId = @memberId
	Delete From ApplicationForumMembers Where memberId = @memberId
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_DeleteReply]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_DeleteReply]
	-- Add the parameters for the stored procedure here
	@replyId int
AS
BEGIN
    Delete From ApplicationForumThreadReplies Where replyId = @replyId
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_DeleteThread]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_DeleteThread]
	-- Add the parameters for the stored procedure here
	@threadId int
AS
BEGIN
    Delete From ApplicationForumThreadReplies Where threadId = @threadId
	Delete From ApplicationForumThreads Where threadId = @threadId
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_GetForums]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_GetForums]
-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@start int = 1,
	@length int = 10,
	@orderby int = 1,
	@memberId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT forumId, websiteId,title,description,image,totalthreads,totalreplies,totalmembers,datecreated,private
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.websiteId END DESC,
	CASE WHEN @orderby = 1 THEN p.forumId END ASC
	) as rownum, p.*
	FROM ApplicationForums AS p
	WHERE 
	p.websiteId = @websiteId 
	AND (
		p.forumid = CASE WHEN @memberId>0 THEN 
				CASE WHEN  p.forumId IN (SELECT forumId FROM applicationforummembers WHERE websiteId=@websiteId AND memberId=@memberId AND forumId IS NOT NULL) THEN
					p.forumid
				ELSE
					CASE WHEN p.private=0 THEN
						p.forumId
					ELSE
						0
					END
				END
			ELSE
				CASE WHEN p.private=0 THEN
					p.forumId
				ELSE
					0
				END
			END
	)
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_GetMembers]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_GetMembers]
-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@start int = 1,
	@length int = 10,
	@orderby int = 1,
	@search nvarchar(MAX) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT *
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.websiteId END DESC,
	CASE WHEN @orderby = 1 THEN p.memberId END ASC
	) as rownum, p.memberId, m.firstname, m.lastname, p.websiteId, m.email, m.photo,
       m.datecreated, p.enabled, p.totalposts, p.forumId,
       (SELECT COUNT(*) FROM ApplicationForumModerators mod WHERE mod.memberId=p.memberId) AS moderator
FROM ApplicationForumMembers p LEFT JOIN Members m ON m.memberId=p.memberId
	WHERE 
	p.websiteId = CASE WHEN @websiteId > 0 THEN @websiteId ELSE p.websiteId END	
	AND (
		m.firstname LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE m.firstname END
		OR m.lastname LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE m.lastname END
		OR m.email LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE m.email END
		)
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_GetReplies]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_GetReplies]
	-- Add the parameters for the stored procedure here
	@start int = 1,
	@length int = 10,
	@threadId int,
	@orderby int = 1,
	@memberId int = 0,
	@forumId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	If (SELECT COUNT(*) FROM ApplicationForums WHERE forumId=@forumId AND private=1) > 0
	Begin
		If @memberId > 0 
		BEGIN
			IF (SELECT COUNT(*) FROM ApplicationForumMembers WHERE memberId=@memberId AND forumid=@forumId) = 0
			RETURN ''
		END
		ELSE
		BEGIN
		return''
		END
	End

    -- Insert statements for procedure here
	SELECT *
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 1 THEN r.replyId END ASC
	) as rownum, fm.websiteId, fm.enabled, 
               fm.totalposts, r.replyId, r.forumId, 
               r.threadId, r.memberId, r.reply, r.datecreated, 
               m.photo, m.datecreated AS signupdate, m.firstname, m.lastname, m.email
	FROM  dbo.ApplicationForumThreadReplies r INNER JOIN
               dbo.ApplicationForumMembers fm ON r.memberId = fm.memberId INNER JOIN
               dbo.Members m ON fm.memberId = m.memberId
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
	AND threadId = @threadId
END

GO
/****** Object:  StoredProcedure [dbo].[Forum_GetThreads]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Forum_GetThreads]
-- Add the parameters for the stored procedure here
	@forumId int = 0,
	@start int = 1,
	@length int = 10,
	@orderby int = 1,
	@memberId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	
	If (SELECT COUNT(*) FROM ApplicationForums WHERE forumId=@forumId AND private=1) > 0
	Begin
		If @memberId > 0 
		BEGIN
			IF (SELECT COUNT(*) FROM ApplicationForumMembers WHERE memberId=@memberId AND forumid=@forumId) = 0
			RETURN ''
		END
		ELSE
		BEGIN
		RETURN ''
		END
	End

    -- Insert statements for procedure here
	SELECT threadId,forumId,memberId,title,totalreplies,datecreated,lastpost,lastpostby
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.forumId END DESC,
	CASE WHEN @orderby = 1 THEN p.threadId END ASC
	) as rownum, p.*
	FROM ApplicationForumThreads AS p
	WHERE 
	p.forumId = CASE WHEN @forumId > 0 THEN @forumId ELSE p.forumId END	
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetAvailableLayouts]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/21/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetAvailableLayouts] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@start int = 0,
	@length int = 9
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM (
		SELECT ROW_NUMBER() OVER (ORDER BY o.datecreated DESC, e.datecreated DESC) AS rownum, e.*, m.displayname, m.photo 
		FROM EvolverLayouts e 
		LEFT JOIN Members m ON m.memberid = e.memberId
		LEFT JOIN EvolverLayoutsOwned o ON o.memberId=@memberId
		WHERE e.price = 0 
		OR e.memberId=@memberId
		OR (NOT o.memberid IS NULL AND e.price > 0)
	) as myTbl WHERE rownum >= @start AND rownum <= @start + @length
	
END

GO
/****** Object:  StoredProcedure [dbo].[GetBackgrounds]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11:00 am 11/19/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetBackgrounds] 
	-- Add the parameters for the stored procedure here
	@start int = 0, 
	@length int = 10,
	@orderby int = 1,
	@search nvarchar(50) = '',
	@primaryR int = -1,
	@primaryG int = -1,
	@primaryB int = -1,
	@backgroundR int = -1,
	@backgroundG int = -1,
	@backgroundB int = -1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @primaryR = -1 AND  @backgroundR = -1 BEGIN
	-- no color search ////////////////////////////////////////////////////////////////
		SELECT name, backgroundid, background, colors, colorsortbody FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY 
			CASE WHEN @orderby = 0 THEN asort END ASC,
			CASE WHEN @orderby = 1 THEN name END ASC,
			CASE WHEN @orderby = 2 THEN name END DESC,
			CASE WHEN @orderby = 3 THEN colorsortbody END DESC,
			CASE WHEN @orderby = 4 THEN colorsortbody END ASC,
			CASE WHEN @orderby = 5 THEN colorsort END DESC,
			CASE WHEN @orderby = 6 THEN colorsort END ASC
			) AS rownum, name, backgroundid, background, colors, colorsortbody FROM backgrounds) 
		 AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
	IF @primaryR >= 0 AND @backgroundR = -1 BEGIN
		-- primary color only search ////////////////////////////////////////////////////////////////
		SELECT name, backgroundid, background, colors, colorsortbody, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, backgroundid, background, colors, colorsortbody,
				FLOOR(SQRT(POWER((colorR - @primaryR)*0.8,2)+POWER((colorG - @primaryG)*0.5,2)+POWER((colorB - @primaryB)*1,2))) AS distance
				FROM backgrounds) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
	IF @primaryR = -1 AND @backgroundR >= 0 BEGIN
		-- background color only search ////////////////////////////////////////////////////////////////
		SELECT name, backgroundid, background, colors, colorsortbody, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, backgroundid, background, colors, colorsortbody,
				FLOOR(SQRT(POWER((colorbodyR - @backgroundR)*0.8,2)+POWER((colorbodyG - @backgroundG)*0.5,2)+POWER((colorbodyB - @backgroundB)*1,2))) AS distance
				FROM backgrounds) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END

	IF @primaryR >= 0 AND @backgroundR >= 0 BEGIN
		-- primary & background color search ////////////////////////////////////////////////////////////////
		SELECT name, backgroundid, background, colors, colorsortbody, distance, colorbodyR, colorbodyG, colorbodyB INTO #tbl FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, backgroundid, background, colors, colorsortbody, colorbodyR, colorbodyG, colorbodyB,
				FLOOR(SQRT(POWER((colorR - @primaryR)*0.8,2)+POWER((colorG - @primaryG)*0.5,2)+POWER((colorB - @primaryB)*1,2))) AS distance
				FROM backgrounds) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length

		SELECT name, backgroundid, background, colors, colorsortbody, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, backgroundid, background, colors, colorsortbody,
				FLOOR(SQRT(POWER((colorbodyR - @backgroundR)*0.8,2)+POWER((colorbodyG - @backgroundG)*0.5,2)+POWER((colorbodyB - @backgroundB)*1,2))) AS distance
				FROM #tbl) 
			AS tbl WHERE distance < 80)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
END

GO
/****** Object:  StoredProcedure [dbo].[GetBlogEntries]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/19/2009
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetBlogEntries] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@showprivate bit = 0,
	@start int = 1,
	@length int = 25,
	@keywords nvarchar(25) = '',
	@folder int = -1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY datecreated DESC) AS rownum, 
	* FROM ApplicationBloggerEntries WHERE websiteId=@websiteId
	AND security = CASE WHEN @showprivate=1 THEN security ELSE 0 END
	AND (title LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE title END
	OR keywords LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE keywords END)
	AND folder = CASE WHEN @folder = -1 THEN folder ELSE @folder END
	) AS tbl1
	WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetBlogEntriesForCalendar]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/22/2009 2:57 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetBlogEntriesForCalendar] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@startDate date = '1/1/2009',
	@length int = 30,
	@keywords nvarchar(50) = '',
	@folder int = -1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	SELECT e.title, e.datecreated, e.entryid, p.pageid, p.datecreated AS pagecreated 
	FROM applicationbloggerentries e 
	LEFT JOIN applicationblogger o ON o.websiteid=e.websiteid 
	LEFT JOIN pages p ON p.pageid=o.pageid 
	WHERE e.websiteid=@websiteId AND e.security=0
	AND (e.title LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE e.title END
	OR e.keywords LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE e.keywords END)
	AND e.datecreated >= @startDate AND e.datecreated < DATEADD(month,1,@startDate)
	AND e.folder = CASE WHEN @folder = -1 THEN e.folder ELSE @folder END
	ORDER BY e.datecreated ASC
END

GO
/****** Object:  StoredProcedure [dbo].[GetBlogEntriesForComponent]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/20/2009 7:10 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetBlogEntriesForComponent] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@start int = 1,
	@length int = 10,
	@keywords nvarchar(50) = '',
	@startDate date = '1/1/2000',
	@endDate date = '12/21/2012',
	@folder int = -1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM(
	SELECT Row_Number() OVER (ORDER BY e.datecreated DESC) AS rownum,
	e.title, e.datecreated, e.entryid, p.pageid, p.datecreated AS pagecreated 
	FROM applicationbloggerentries e 
	LEFT JOIN applicationblogger o ON o.websiteid=e.websiteid 
	LEFT JOIN pages p ON p.pageid=o.pageid 
	WHERE e.websiteid=@websiteId AND e.security=0
	AND (e.title LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE e.title END
	OR e.keywords LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE e.keywords END)
	AND (e.datecreated >= @startDate AND e.datecreated <= @endDate)
	AND e.folder = CASE WHEN @folder = -1 THEN e.folder ELSE @folder END
	) AS tbl
	WHERE rownum >= @start AND rownum <= @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetBlogForWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/24/2009 6:11 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetBlogForWebsite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT b.pageId, p.datecreated, b.ownerid FROM ApplicationBlogger b LEFT JOIN Pages p ON p.pageId=b.pageId WHERE b.websiteId=@websiteId
END

GO
/****** Object:  StoredProcedure [dbo].[GetColorSchemes]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11:00 am 11/19/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetColorSchemes] 
	-- Add the parameters for the stored procedure here
	@start int = 0, 
	@length int = 10,
	@orderby int = 1,
	@published bit = 0,
	@search nvarchar(50) = '',
	@primaryR int = -1,
	@primaryG int = -1,
	@primaryB int = -1,
	@backgroundR int = -1,
	@backgroundG int = -1,
	@backgroundB int = -1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @primaryR = -1 AND  @backgroundR = -1 BEGIN
	-- no color search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY 
			CASE WHEN @orderby = 1 THEN name END ASC,
			CASE WHEN @orderby = 2 THEN name END DESC,
			CASE WHEN @orderby = 3 THEN colorsortbody END DESC,
			CASE WHEN @orderby = 4 THEN colorsortbody END ASC,
			CASE WHEN @orderby = 5 THEN colorsort END DESC,
			CASE WHEN @orderby = 6 THEN colorsort END ASC
			) AS rownum, name, schemeid, colors FROM colorschemes WHERE published >= @published ) 
		 AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
	IF @primaryR >= 0 AND @backgroundR = -1 BEGIN
		-- primary color only search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors,
				FLOOR(SQRT(POWER((colorR - @primaryR)*0.8,2)+POWER((colorG - @primaryG)*0.5,2)+POWER((colorB - @primaryB)*1,2))) AS distance
				FROM colorschemes WHERE published >= @published) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
	IF @primaryR = -1 AND @backgroundR >= 0 BEGIN
		-- background color only search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors,
				FLOOR(SQRT(POWER((colorbodyR - @backgroundR)*0.8,2)+POWER((colorbodyG - @backgroundG)*0.5,2)+POWER((colorbodyB - @backgroundB)*1,2))) AS distance
				FROM colorschemes WHERE published >= @published) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END

	IF @primaryR >= 0 AND @backgroundR >= 0 BEGIN
		-- primary & background color search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors, distance, colorbodyR, colorbodyG, colorbodyB INTO #tbl FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors, colorbodyR, colorbodyG, colorbodyB,
				FLOOR(SQRT(POWER((colorR - @primaryR)*0.8,2)+POWER((colorG - @primaryG)*0.5,2)+POWER((colorB - @primaryB)*1,2))) AS distance
				FROM colorschemes WHERE published >= @published) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length

		SELECT name, schemeid, colors, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors,
				FLOOR(SQRT(POWER((colorbodyR - @backgroundR)*0.8,2)+POWER((colorbodyG - @backgroundG)*0.5,2)+POWER((colorbodyB - @backgroundB)*1,2))) AS distance
				FROM #tbl) 
			AS tbl WHERE distance < 80)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
END

GO
/****** Object:  StoredProcedure [dbo].[GetCommentsByItemId]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/5/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetCommentsByItemId] 
	-- Add the parameters for the stored procedure here
	@memberId int=0, 
	@itemId char(10) = '',
	@pageId int=0,
	@start int = 1,
	@length int = 10
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT commentId, writerId, memberId, pageId, componentId, comment, dateCreated,
	firstname, lastname, displayname, photo, profilepage, keepalive,
	status, approved
	FROM (SELECT ROW_NUMBER() OVER (ORDER BY datecreated ASC) as rownum, *
	FROM vcomments WHERE componentId=@itemId
	AND pageId=@pageId) as myTbl WHERE rownum BETWEEN @start AND @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetCommentsToApprove]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/5/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetCommentsToApprove] 
	-- Add the parameters for the stored procedure here
	@memberId char(10) = '', 
	@start int = 1,
	@length int = 10
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT commentId, writerId, ownerId, pageId, componentId, comment, dateCreated,
	firstname, lastname, displayname, photo, profilepage, keepalive,
	status, approved, title, datemodified
	FROM (SELECT ROW_NUMBER() OVER (ORDER BY datemodified DESC, datecreated ASC) as rownum, *
	FROM vcommentspages WHERE ownerId=@memberId) 
	AS myTbl WHERE rownum BETWEEN @start AND @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetDashboards]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/6/2014 11:53 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetDashboards] 

AS
BEGIN
	SELECT w.title, w.websiteid, p.pageid, p.datemodified FROM dashboards d LEFT JOIN websites w ON w.websiteid=d.websiteId LEFT JOIN pages p ON p.pageid=w.pagedash ORDER BY d.orderby ASC
END

GO
/****** Object:  StoredProcedure [dbo].[GetEvolverApplicationPageByIndex]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Name
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetEvolverApplicationPageByIndex] 
	-- Add the parameters for the stored procedure here
	@websiteid int = 0, 
	@applicationId int = 0,
	@index int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @pages nvarchar(100), @Pos int, @Pos2 int, @x int = 0
	SELECT @pages=pages FROM EvolverApplicationsPages WHERE websiteId=@websiteid AND applicationId=@applicationId
	PRINT @pages
	IF @pages <> ''
	BEGIN
		IF @index = 0
		BEGIN
			-- get first page ID
			SET @Pos = CHARINDEX(',', @pages, 1)
			IF @Pos < 1
			BEGIN
				RETURN @pages
			END
			PRINT 'return first index'
			PRINT SUBSTRING(@pages, 1,@Pos-1)
			SELECT SUBSTRING(@pages, 1,@Pos-1)
		END
		
		SET @Pos = 1
		SET @Pos2=1
		WHILE @Pos > 0
		BEGIN
			--Check if calendar is private
			SET @Pos = CHARINDEX(',', @pages, @Pos)
			IF @Pos > 0
			BEGIN
				SET @x = @x + 1
				IF @x = @index
				BEGIN
					-- found index, returning page ID
					SET @Pos2 = CHARINDEX(',', @pages, @Pos+1)
					IF @Pos2 < @Pos
					BEGIN
						SET @Pos2 = LEN(@pages)+1
					END
					PRINT 'return index'
					PRINT SUBSTRING(@pages, @Pos+1,@Pos2-(@Pos+1))
					SELECT SUBSTRING(@pages, @Pos+1,@Pos2-(@Pos+1))
					BREAK
				END
			END
			SET @Pos = @Pos + 1
			PRINT 'pos = ' + CAST(@Pos AS varchar(10))
		END
	END	
END

GO
/****** Object:  StoredProcedure [dbo].[GetEvolverApplicationPageInfoByIndex]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Name
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetEvolverApplicationPageInfoByIndex] 
	-- Add the parameters for the stored procedure here
	@websiteid int = 0, 
	@applicationId int = 0,
	@index int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @pages nvarchar(100), @Pos int, @Pos2 int, @x int = 0, @pageId nvarchar(10)
	SELECT @pages=pages FROM EvolverApplicationsPages WHERE websiteId=@websiteid AND applicationId=@applicationId
	PRINT @pages
	IF @pages <> ''
	BEGIN
		IF @index = 0
		BEGIN
			-- get first page ID
			SET @Pos = CHARINDEX(',', @pages, 1)
			IF @Pos < 1
			BEGIN
				SET @pageId = @pages
			END
			ELSE
			BEGIN
				SET @pageId = SUBSTRING(@pages, 1,@Pos-1)
			END
		END
		
		SET @Pos = 1
		SET @Pos2=1
		WHILE @Pos > 0
		BEGIN
			--Check if calendar is private
			SET @Pos = CHARINDEX(',', @pages, @Pos)
			IF @Pos > 0
			BEGIN
				SET @x = @x + 1
				IF @x = @index
				BEGIN
					-- found index, returning page ID
					SET @Pos2 = CHARINDEX(',', @pages, @Pos+1)
					IF @Pos2 < @Pos
					BEGIN
						SET @Pos2 = LEN(@pages)+1
					END
					SET @pageId = SUBSTRING(@pages, @Pos+1,@Pos2-(@Pos+1))
					BREAK
				END
			END
			SET @Pos = @Pos + 1
		END
	END	
	SELECT * FROM Pages WHERE pageId=@pageId
END

GO
/****** Object:  StoredProcedure [dbo].[GetLayoutsAvailableForMyself]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 09/06/2009 1:47 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLayoutsAvailableForMyself] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@galaxyId int = 0,
	@keywords nvarchar(25) = '',
	@start int = 1,
	@length int = 4
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	--/////////////////////////////////
	--GET MY UPLOADED LAYOUTS
    
	SELECT layoutid INTO #mylayouts FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY datecreated DESC) AS rownum, 
	layoutid FROM 
	(SELECT l.layoutid, l.datecreated FROM EvolverLayouts l
	WHERE l.memberId=@memberId
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	) AS mytbl 
	) as mytbl2 WHERE rownum >= @start AND rownum <= @start + @length
	
	--/////////////////////////////////
	--GET PURCHASED LAYOUTS
    
	SELECT layoutid INTO #mylayouts2 FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY datecreated DESC) AS rownum, 
	layoutid FROM 
	(SELECT l.layoutid, l.datecreated FROM EvolverLayouts l, EvolverLayoutsOwned eo
	WHERE eo.memberId = @memberId
	AND l.layoutId = eo.layoutId
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	) AS mytbl 
	) as mytbl2 WHERE rownum >= @start AND rownum <= @start + @length
		
	--/////////////////////////////////
	--GET FREE LAYOUTS
    
	SELECT layoutid INTO #mylayouts3 FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY datecreated DESC) AS rownum, 
	layoutid FROM 
	(SELECT l.layoutid, l.datecreated FROM EvolverLayouts l
	WHERE l.price=0 AND l.private = 0
	AND l.approved = 1 AND l.saleapproved = 1 AND l.enabled = 1 AND l.deleted = 0
	AND NOT l.memberId = @memberId
	) AS mytbl 
	) as mytbl2 WHERE rownum >= @start AND rownum <= @start + @length
	
	--////////////////////////////////////////////
	--SELECT AND ORGANIZE ALL LAYOUT TYPES
	    
	SELECT * FROM (SELECT ROW_NUMBER() OVER(ORDER BY layouttype, datecreated DESC) AS rownum, * FROM (
	SELECT (
		
		CASE WHEN l.layoutId IN (SELECT * FROM #mylayouts) THEN '1' ELSE
		CASE WHEN l.layoutId IN (SELECT * FROM #mylayouts2) THEN '2' ELSE
		CASE WHEN l.layoutId IN (SELECT * FROM #mylayouts3) THEN '3' ELSE
		'0' END END END)
		AS layouttype,
	l.layoutid, l.memberid, l.title, l.tagwords, l.galaxyId, l.price, 
	l.rating, l.datecreated, l.approved, l.private, l.license, l.licensetype,
	(CASE WHEN l.memberid = @memberId THEN 1 ELSE 0 END) AS isowner
	FROM EvolverLayouts l LEFT JOIN Members m ON m.memberId=l.memberid
	WHERE (
		(l.layoutId IN (SELECT * FROM #mylayouts))
		OR
		(l.layoutId IN (SELECT * FROM #mylayouts2))
		OR
		(l.layoutId IN (SELECT * FROM #mylayouts3))
	)
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	) as tbl 
	) as tbl2

END

GO
/****** Object:  StoredProcedure [dbo].[GetLayoutsForAdmin]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 01/14/2010 7:00 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLayoutsForAdmin]
	-- Add the parameters for the stored procedure here
	@start int = 0,
	@length int = 10,
	@orderby int = 1,
	@keywords nvarchar(25) = '',
	@designtype int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY
	deleted ASC,
	enabled DESC,
	CASE WHEN @orderby = 1 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 2 THEN l.datecreated END ASC,
	CASE WHEN @orderby = 3 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 4 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 5 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 6 THEN l.datecreated END DESC 
	) AS rownum, 
	 l.*
	FROM EvolverLayouts l
	WHERE title LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE title END
	AND licensetype = CASE WHEN @orderby = 3 THEN 0 
							WHEN @orderby = 4 THEN 1
							WHEN @orderby = 5 THEN 2
							ELSE licensetype END
	AND	enabled = CASE WHEN @orderby = 6 THEN 0 ELSE enabled END
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END


GO
/****** Object:  StoredProcedure [dbo].[GetLayoutsForFree]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 01/14/2010 7:00 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLayoutsForFree]
	-- Add the parameters for the stored procedure here
	@memberId int,
	@start int = 0,
	@length int = 0,
	@category int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY l.datecreated DESC) AS rownum, 
	 l.*, (SELECT pagehome FROM WebSites WHERE websiteId=l.tempWebsiteId) AS pagehome
	FROM EvolverLayouts l
	WHERE l.price=0 AND l.private = 0 AND l.saleapproved = 1
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	AND (galaxyid = @category OR galaxyId IS NULL)
	AND NOT l.memberId = @memberId
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetLayoutsForMyself]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/6/2009
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLayoutsForMyself] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@galaxyId int = 0,
	@keywords nvarchar(25) = '',
	@start int = 1,
	@length int = 9,
	@layouttype int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    SELECT layoutid INTO #mylayoutsowned FROM EvolverLayoutsOwned WHERE memberId=@memberId
    
	SELECT * FROM (
	SELECT ROW_NUMBER() OVER(ORDER BY isowner DESC, rating DESC, datecreated DESC) AS rownum, * FROM (
	SELECT DISTINCT l.layoutid, l.memberid, l.title, l.tagwords, l.galaxyId, l.price, 
	l.rating, l.datecreated, l.approved, l.private, l.license,
	(CASE WHEN l.memberid = @memberId THEN 1 ELSE 0 END) AS isowner
	
	FROM EvolverLayouts l, Members m  
	WHERE ((l.private = 0 AND l.price = 0) OR l.memberId = @memberId OR l.layoutId IN (SELECT * FROM #mylayoutsowned))
	AND approved = 1 AND l.enabled = 1 AND l.deleted = 0
	AND l.galaxyId = CASE WHEN @galaxyId > 0 THEN @galaxyId ELSE l.galaxyId END
	AND l.title LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE l.title END
	AND l.price = CASE WHEN @layouttype = 2 THEN 0 ELSE l.price END
	AND l.memberId = CASE WHEN @layouttype = 4 THEN @memberId ELSE l.memberId END
	AND l.layoutId = CASE WHEN @layouttype = 3 THEN (SELECT * FROM #mylayoutsowned WHERE layoutId = l.layoutid) ELSE l.layoutid END
	AND l.private = CASE WHEN @layouttype = 2 THEN 0 ELSE l.private END
	
	) AS mytbl 
	) as mytbl2 WHERE rownum >= @start AND rownum <= @start + @length
	
END

GO
/****** Object:  StoredProcedure [dbo].[GetLayoutsPurchasedForMyself]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 01/14/2010 7:00 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLayoutsPurchasedForMyself] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@start int = 0,
	@length int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY l.datecreated DESC) AS rownum, 
	 l.* FROM EvolverLayouts l, EvolverLayoutsOwned eo
	WHERE eo.memberId = @memberId
	AND l.layoutId = eo.layoutId
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetLayoutsUploadedForMyself]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 01/14/2010 7:00 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLayoutsUploadedForMyself] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@start int = 0,
	@length int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY l.datecreated DESC) AS rownum, 
	 l.* FROM EvolverLayouts l
	WHERE l.memberId=@memberId
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetLogAnalytics]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 2:10 pm 3/1/2015
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLogAnalytics] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@pageId int = 0,
	@countryCode nvarchar(3) = '',
	@agent nvarchar(200) = '',
	@referrer nvarchar(200) = '',
	@logYear int = 2015,
	@logMonth int = 1,
	@logDay int = 0,
	@reexecute bit = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @dateStart datetime
	IF @logDay > 0 BEGIN SET @dateStart = DATEFROMPARTS(@logYear, @logMonth, @logDay) END
	ELSE IF @logMonth > 0 BEGIN SET @dateStart = DATEFROMPARTS(@logYear, @logMonth, 1) END
	ELSE BEGIN SET @dateStart = DATEFROMPARTS(@logYear, 1, 1) END

    -- Insert statements for procedure here
	SELECT * INTO #tbl FROM LogAnalytics 
	WHERE websiteid=@websiteId AND pageid=@pageId  AND countryCode = @countryCode AND agent=@agent AND referrer=@referrer
	AND logYear = @logYear 
	AND logMonth=CASE WHEN @logMonth = 0 THEN logMonth ELSE @logMonth END
	AND logDay=CASE WHEN @logDay = 0 THEN logDay ELSE @logDay END
	

	IF (SELECT COUNT(*) FROM #tbl) > 0 BEGIN
		IF @reexecute < 2 BEGIN SELECT * FROM #tbl ORDER BY logYear ASC, logMonth ASC, logDay ASC END
	END ELSE BEGIN
		-- get all records from the log (very dangerous query for memory)
		SELECT * INTO #log FROM Rennder.dbo.Log WHERE datecreated >= @dateStart 
		AND datecreated < CASE WHEN @logDay > 0 THEN DATEADD(DAY,1,@dateStart) 
					ELSE CASE WHEN @logMonth > 0 THEN DATEADD(MONTH,1,@dateStart)
					ELSE DATEADD(YEAR,1,@dateStart) END END
		
		DECLARE
			@totalViews int = 0, @totalBots int = 0,
			@totalLoadTime float = 0, @avgLoadTime float = 0, @totalAjax float = 0, 
			@totalVisitors int = 0, @maxVisitorViews int = 0, @avgVisitorViews float = 0,
			@totalMembers int = 0, @maxMemberViews int = 0, @avgMemberViews float = 0,
			@bounceRate float = 0,
			@totalComponents int = 0, @avgComponents float = 0,
			@totalApps int = 0, @avgApps float = 0,
			@totalInterfaces int = 0, @avgInterfaces float = 0,
			@totalSqlQueries int = 0, @avgSqlQueries float = 0,
			@totalText int = 0, @avgText float = 0,
			@totalPhotos int = 0, @avgPhotos float = 0,
			@totalGalleries int = 0, @avgGalleries float = 0,
			@totalPanels int = 0, @avgPanels float = 0,
			@totalMenus int = 0, @avgMenus float = 0,
			@totalEditor int = 0, @totalDash int = 0
		
		-- get various equation results
		SELECT @totalViews = COUNT(*) FROM #log
		SELECT @totalBots = COUNT(*) FROM #log WHERE agent LIKE '%bot%' OR agent LIKE '%crawl%' OR agent LIKE '%spider%'
		SELECT @totalLoadTime = SUM(loadtime) FROM #log
		IF @totalLoadTime > 0 AND @totalViews > 0 BEGIN SET @avgLoadTime = @totalLoadTime / @totalViews END
		SELECT @totalAjax = COUNT(*) FROM #log WHERE ajax=1
		SELECT @totalVisitors = COUNT(*) FROM (SELECT DISTINCT visitorId FROM #log) AS tbl
		SELECT COUNT(visitorid) AS views INTO #logviews FROM #log GROUP BY visitorid
		SELECT @maxVisitorViews = MAX(views) FROM #logviews
		SELECT @avgVisitorViews = AVG(views) FROM #logviews
		SELECT @totalMembers = COUNT(*) FROM #log WHERE memberid IS NOT NULL
		SELECT COUNT(memberid) AS views INTO #logmembers FROM #log WHERE memberid IS NOT NULL GROUP BY memberid
		SELECT @maxMemberViews = MAX(views) FROM #logmembers
		SELECT @avgMemberViews = AVG(views) FROM #logmembers
		IF @totalVisitors > 0 BEGIN SELECT @bounceRate = (100 / @totalVisitors * COUNT(views)) FROM #logviews WHERE views=1 END
		SELECT @totalComponents = SUM(components),  @avgComponents = AVG(components) FROM #log
		SELECT @totalApps = SUM(apps),  @avgApps = AVG(apps) FROM #log
		SELECT @totalInterfaces = SUM(interfaces),  @avgInterfaces = AVG(interfaces) FROM #log
		SELECT @totalSqlQueries = SUM(sqlqueries),  @avgSqlQueries = AVG(sqlqueries) FROM #log
		SELECT @totalText = SUM(ctext),  @avgText = AVG(ctext) FROM #log
		SELECT @totalPhotos = SUM(cphotos),  @avgPhotos = AVG(cphotos) FROM #log
		SELECT @totalGalleries = SUM(cgalleries),  @avgGalleries = AVG(cgalleries) FROM #log
		SELECT @totalPanels = SUM(cpanels),  @avgPanels = AVG(cpanels) FROM #log
		SELECT @totalMenus = SUM(cmenus),  @avgMenus = AVG(cmenus) FROM #log
		SELECT @totalEditor = COUNT(editor) FROM #log WHERE editor=1
		SELECT @totalDash = COUNT(dash) FROM #log WHERE dash=1

		-- set NULL to 0
		IF (@totalViews       IS NULL) BEGIN SET @totalViews       = 0 END
		IF (@totalBots        IS NULL) BEGIN SET @totalBots        = 0 END
		IF (@totalLoadTime    IS NULL) BEGIN SET @totalLoadTime    = 0 END
		IF (@avgLoadTime      IS NULL) BEGIN SET @avgLoadTime      = 0 END
		IF (@totalAjax        IS NULL) BEGIN SET @totalAjax        = 0 END
		IF (@totalVisitors    IS NULL) BEGIN SET @totalVisitors    = 0 END
		IF (@maxVisitorViews  IS NULL) BEGIN SET @maxVisitorViews  = 0 END
		IF (@avgVisitorViews  IS NULL) BEGIN SET @avgVisitorViews  = 0 END
		IF (@totalMembers     IS NULL) BEGIN SET @totalMembers     = 0 END
		IF (@maxMemberViews   IS NULL) BEGIN SET @maxMemberViews   = 0 END
		IF (@avgMemberViews   IS NULL) BEGIN SET @avgMemberViews   = 0 END
		IF (@bounceRate       IS NULL) BEGIN SET @bounceRate       = 0 END
		IF (@totalComponents  IS NULL) BEGIN SET @totalComponents  = 0 END
		IF (@avgComponents    IS NULL) BEGIN SET @avgComponents    = 0 END
		IF (@totalApps        IS NULL) BEGIN SET @totalApps        = 0 END
		IF (@avgApps          IS NULL) BEGIN SET @avgApps          = 0 END
		IF (@totalInterfaces  IS NULL) BEGIN SET @totalInterfaces  = 0 END
		IF (@avgInterfaces    IS NULL) BEGIN SET @avgInterfaces    = 0 END
		IF (@totalSqlQueries  IS NULL) BEGIN SET @totalSqlQueries  = 0 END
		IF (@avgSqlQueries    IS NULL) BEGIN SET @avgSqlQueries    = 0 END
		IF (@totalText        IS NULL) BEGIN SET @totalText        = 0 END
		IF (@avgText          IS NULL) BEGIN SET @avgText          = 0 END
		IF (@totalPhotos      IS NULL) BEGIN SET @totalPhotos      = 0 END
		IF (@avgPhotos        IS NULL) BEGIN SET @avgPhotos        = 0 END
		IF (@totalGalleries   IS NULL) BEGIN SET @totalGalleries   = 0 END
		IF (@avgGalleries     IS NULL) BEGIN SET @avgGalleries     = 0 END
		IF (@totalPanels      IS NULL) BEGIN SET @totalPanels      = 0 END
		IF (@avgPanels        IS NULL) BEGIN SET @avgPanels        = 0 END
		IF (@totalMenus       IS NULL) BEGIN SET @totalMenus       = 0 END
		IF (@avgMenus         IS NULL) BEGIN SET @avgMenus         = 0 END
		IF (@totalEditor      IS NULL) BEGIN SET @totalEditor      = 0 END
		IF (@totalDash        IS NULL) BEGIN SET @totalDash        = 0 END

		-- save all equation results into table record
		INSERT INTO LogAnalytics 
					(websiteid, pageId, countryCode, agent, referrer, logYear, logMonth, logDay, dateModified, totalViews, totalBots, totalLoadTime, avgLoadTime,
					totalAjax, totalVisitors, maxVisitorViews, avgVisitorViews, totalMembers, maxMemberViews, avgMemberViews, bounceRate, 
					totalComponents, avgComponents, totalApps, avgApps, totalInterfaces, avgInterfaces, totalSqlQueries, avgSqlQueries, 
					totalCtext, avgCtext, totalCphotos, avgCphotos, totalCgalleries, avgCgalleries, totalCpanels, avgCpanels, totalCmenus, avgCmenus,
					totalEditor, totalDash) 
			VALUES (@websiteId, @pageId, @countryCode, @agent, @referrer, @logYear, @logMonth, @logDay, GETDATE(), @totalViews, @totalBots, @totalLoadTime, @avgLoadTime,
					@totalAjax, @totalVisitors, @maxVisitorViews, @avgVisitorViews, @totalMembers, @maxMemberViews, @avgMemberViews, @bounceRate,
					@totalComponents, @avgComponents, @totalApps, @avgApps, @totalInterfaces, @avgInterfaces, @totalSqlQueries, @avgSqlQueries,
					@totalText, @avgText, @totalPhotos, @avgPhotos, @totalGalleries, @avgGalleries, @totalPanels, @avgPanels, @totalMenus, @avgMenus,
					@totalEditor, @totalDash)

		-- generate results for each day in the month & each month in the year if neccessary
		DECLARE @x int = 0, @days int, @dateTemp datetime
		IF @logMonth = 0 BEGIN 
			-- month isn't provided, get results for every day of the year
			DECLARE @m int = 0, @m2 int = 0, @y2 int = 0
			SET @dateTemp = @dateStart
			WHILE @m <= 12 BEGIN
				SET @dateTemp = DATEADD(month,@m,@dateStart)
				SET @x = 0
				SET @m2 = MONTH(@dateTemp)
				SET @y2 = YEAR(@dateTemp)
				SET @days = DATEDIFF(DAY, @dateTemp, DATEADD(MONTH,1,@dateTemp))
				WHILE @x < @days BEGIN
					SET @x += 1
					EXEC GetLogAnalytics @websiteId=@websiteId, @pageId=@pageId, @countryCode=@countryCode, @agent=@agent, @referrer=@referrer, @logYear=@y2, @logMonth=@m2 ,@logDay=@x, @reexecute=2
				END
				SET @m += 1
			END
		END ELSE IF @logDay = 0 BEGIN
			-- day isn't provided, get results for every day of the month
			SET @x = 0
			SET @days = DATEDIFF(DAY, @dateStart, DATEADD(MONTH,1,@dateStart))
			WHILE @x < @days BEGIN
				SET @x += 1
				EXEC GetLogAnalytics @websiteId=@websiteId, @pageId=@pageId, @countryCode=@countryCode, @agent=@agent, @referrer=@referrer, @logYear=@logYear, @logMonth=@logMonth,@logDay=@x, @reexecute=2
			END
		END

		-- reexecute SP to get new results
		IF (@reexecute = 0) BEGIN
			EXEC GetLogAnalytics @websiteId=@websiteId, @pageId=@pageId, @countryCode=@countryCode, @agent=@agent, @referrer=@referrer, @logYear=@logYear, @logMonth=@logMonth,@logDay=@logDay, @reexecute=1
		END
	END
END

GO
/****** Object:  StoredProcedure [dbo].[GetLogin]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/19/2012 6:38 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLogin] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT memberid, displayname, firstname + ' ' + lastname AS fullname, photo, email, datecreated, started FROM members WHERE memberid=@memberid AND status = 1
END

GO
/****** Object:  StoredProcedure [dbo].[GetLogResultsForSqlQueries]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/9/2013 3:20 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetLogResultsForSqlQueries] 
	@month int = 12,
	@year int = 2013
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT
	l.sqlqueries, count(*) as num, 
		(SELECT AVG(loadtime) FROM [Rennder].[dbo].[Log] WHERE month(datecreated) = @month AND sqlqueries=l.sqlqueries) as avgtime 
	FROM [Rennder].[dbo].[Log] l
	where MONTH(l.datecreated)=@month 
	group by sqlqueries
	order by num desc
END

GO
/****** Object:  StoredProcedure [dbo].[GetMembers]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetMembers]
-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@start int = 1,
	@length int = 10,
	@firstname nvarchar(100) = '',
	@lastname nvarchar(100) = '',
	@email nvarchar(75) = '',
	@displayname nvarchar(25) = '',
	@city nvarchar(25) = '',
	@state nvarchar(2) = '',
	@Country nvarchar(3) = '',
	@zipcode nvarchar(10) = '',
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT memberId, firstname, lastname, email, displayname, photo, city, state, country, zipcode, status, datecreated
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.started END DESC,
	CASE WHEN @orderby = 1 THEN p.firstname END DESC,
	CASE WHEN @orderby = 2 THEN p.lastname END ASC,
	CASE WHEN @orderby = 3 THEN p.email END DESC,
	CASE WHEN @orderby = 4 THEN p.displayname END ASC 
	) as rownum, p.*
	FROM Members AS p
	WHERE 
	p.memberId = CASE WHEN @memberId > 0 THEN @memberId ELSE p.memberId END
	AND (
		p.firstname LIKE CASE WHEN @firstname <> '' THEN '%' + @firstname + '%' ELSE p.firstname END
		AND p.lastname LIKE CASE WHEN @lastname <> '' THEN '%' + @lastname + '%' ELSE p.lastname END
		AND p.displayname LIKE CASE WHEN @displayname <> '' THEN '%' + @displayname + '%' ELSE p.displayname END
		)
		
	AND p.email LIKE CASE WHEN @email <> '' THEN '%' + @email + '%' ELSE p.email END
	AND p.city LIKE CASE WHEN @city <> '' THEN '%' + @city + '%' ELSE p.city END
	AND p.state = CASE WHEN @state <> '' THEN @state ELSE p.state END
	AND p.country = CASE WHEN @country <> '' THEN @country ELSE p.country END
	AND p.zipcode = CASE WHEN @zipcode <> '' THEN @zipcode ELSE p.zipcode END
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetMembersForAdmin]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/21/2012 1:50 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetMembersForAdmin] 
	-- Add the parameters for the stored procedure here
	@start int = 0, 
	@length int = 0,
	@orderby int = 1,
	@keywords nvarchar(50) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    
    DECLARE @rownum int, 
		@memberId int,
		@firstname nvarchar(25),
		@lastname nvarchar(25),
		@email nvarchar(50),
		@photo nvarchar(25),
		@gender bit,
		@zipcode nvarchar(11),
		@city nvarchar(25),
		@state nvarchar(4),
		@country nvarchar(4),
		@datecreated datetime,
		@status int,
		@deleted bit,
		@websiteid int,
		@title nvarchar(100),
		@pagehome int
		
    DECLARE  @tMembers TABLE (
		memberId int,
		firstname nvarchar(25),
		lastname nvarchar(25),
		email nvarchar(50),
		photo nvarchar(25),
		gender bit,
		zipcode nvarchar(11),
		city nvarchar(25),
		state nvarchar(4),
		country nvarchar(4),
		datecreated datetime,
		status int,
		deleted bit,
		websiteid int,
		domain nvarchar(25),
		subdomain nvarchar(50),
		title nvarchar(100),
		pagehome int
    )
    
    DECLARE @cursor1 CURSOR
    
    SET @cursor1 = CURSOR FOR
	SELECT a.*
	FROM (
		SELECT TOP (@start+@length) ROW_NUMBER() OVER (
			ORDER BY 
			m.deleted ASC,
			CASE WHEN @orderby = 1 THEN m.datecreated END DESC,
			CASE WHEN @orderby = 2 THEN m.datecreated END ASC,
			CASE WHEN @orderby = 3 THEN m.datecreated END ASC,
			CASE WHEN @orderby = 4 THEN m.firstname END ASC,
			CASE WHEN @orderby = 5 THEN m.lastname END ASC,
			CASE WHEN @orderby = 6 THEN m.lastlogin END DESC,
			CASE WHEN @orderby = 7 THEN m.lastlogin END DESC,
			CASE WHEN @orderby = 8 THEN m.lastlogin END DESC
		) AS rownum, m.memberId, m.firstname, m.lastname, m.email,
		m.photo, m.gender, m.zipcode, m.city, m.state, m.country,
		m.datecreated, m.status, m.deleted FROM Members m 
		WHERE 
		(m.firstname = CASE WHEN @keywords <> '' THEN @keywords ELSE m.firstname END
		OR m.lastname = CASE WHEN @keywords <> '' THEN @keywords ELSE m.lastname END
		OR m.zipcode = CASE WHEN @keywords <> '' THEN @keywords ELSE m.zipcode END
		OR m.email = CASE WHEN @keywords <> '' THEN @keywords ELSE m.email END
		)
		AND m.status = CASE WHEN @orderby = 3 THEN 0 ELSE m.status END
		AND m.firstname <> CASE WHEN (@orderby = 4 OR @orderby = 5) THEN '' ELSE '!' END
		AND m.lastlogin <= CASE WHEN @orderby = 6 THEN DATEADD(DAY, -30, GETDATE()) ELSE 
		CASE WHEN @orderby = 7 THEN DATEADD(DAY, -90, GETDATE()) ELSE m.lastlogin END END
		
		AND m.deleted = CASE WHEN @orderby = 8 THEN 1 ELSE m.deleted END
	) AS a 
	WHERE a.rownum >= @start AND a.rownum <= @start + @length 
	
	OPEN @cursor1
	
	FETCH FROM @cursor1 INTO
	@rownum, @memberid, @firstname, @lastname, @email, @photo, @gender, @zipcode, @city,
	@state, @country, @datecreated, @status, @deleted
	
	WHILE @@FETCH_STATUS = 0
	BEGIN
	
	SET @websiteid=0
	SET @title=''
	SET @pagehome=0
	SELECT TOP 1 @websiteid=w.websiteid, @title=w.title, @pagehome=pagehome FROM websites w WHERE w.ownerid=@memberid
	
	INSERT INTO @tMembers (memberId, firstname, lastname, email, photo, gender, zipcode, city, state,
							country, datecreated, status, deleted, websiteid, title, pagehome, domain, subdomain)
	VALUES(@memberId, @firstname, @lastname, @email, @photo, @gender, @zipcode, @city, @state, 
			@country, @datecreated, @status, @deleted, @websiteid, @title, @pagehome,
			(SELECT TOP 1 domain FROM WebsiteDomains WHERE websiteId=@websiteid),
			(SELECT TOP 1 subdomain+'.'+domain FROM WebsiteSubDomains WHERE websiteId=@websiteid)
	)
	
	FETCH FROM @cursor1 INTO
	@rownum, @memberid, @firstname, @lastname, @email, @photo, @gender, @zipcode, @city,
	@state, @country, @datecreated, @status, @deleted
	END
	
	CLOSE @cursor1
	DEALLOCATE @cursor1
	
	SELECT * FROM @tMembers
	
	END

GO
/****** Object:  StoredProcedure [dbo].[GetMessageCommentDetails]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 4/23/2010 7:02 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetMessageCommentDetails] 
	-- Add the parameters for the stored procedure here
	@commentId int = 0, 
	@ownerId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT c.commentid, c.writerid, m.photo, m.datecreated AS signupdate, 
	c.pageid, p.title AS pagetitle, c.fullname, c.email, c.datecreated ,c.comment
	FROM Comments c LEFT JOIN Members m ON m.memberId=c.writerId LEFT JOIN Pages p ON p.pageId=c.pageId 
	WHERE c.commentId=@commentId AND p.ownerId=@ownerId
END

GO
/****** Object:  StoredProcedure [dbo].[GetNewsLetterCampaignHistory]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetNewsLetterCampaignHistory]
-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@totalcampaignssent int = 0, 
	@campaignId int = 0,
	@start int = 1,
	@length int = 10,
	@orderby int = 2
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT *
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN n.websiteId END DESC,
	CASE WHEN @orderby = 1 THEN n.newsletterId END DESC,
	CASE WHEN @orderby = 2 THEN n.datecreated END DESC
	) as rownum, n.newsletterId, n.websiteId, n.title, n.datecreated, c.campaignId, c.subject, c.totallastsent, c.datecreated AS campaigncreated, c.datelastsent 
	FROM ApplicationNewsLetterCampaigns AS c
	INNER JOIN ApplicationNewsLetter AS n ON n.newsletterId=c.newsletterid
	WHERE 
	n.websiteId = @websiteId
	AND n.totalcampaigns > 0
	AND c.totallastsent > 0
	AND (n.totalcampaignssent >= CASE WHEN @totalcampaignssent > 0 THEN @totalcampaignssent ELSE n.totalcampaignssent END)
	AND (c.campaignId = CASE WHEN @campaignId > 0 THEN @campaignId ELSE c.campaignId END)
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetNewsLetterCampaigns]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetNewsLetterCampaigns]
-- Add the parameters for the stored procedure here
	@campaignId int = 0,
	@newsletterId int = 0,
	@start int = 1,
	@length int = 10,
	@orderby int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT campaignId, newsletterId, subject, body, datecreated, datelastsent, totallastsent
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.campaignid END DESC,
	CASE WHEN @orderby = 1 THEN p.newsletterId END DESC,
	CASE WHEN @orderby = 2 THEN p.subject END ASC
	) as rownum, p.*
	FROM ApplicationNewsLetterCampaigns AS p
	WHERE 
	p.campaignId = CASE WHEN @campaignId > 0 THEN @CampaignId ELSE p.campaignId END	
	And p.newsletterId = CASE WHEN @newsletterId > 0 THEN @newsletterId ELSE p.newsletterId END
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetNewsLetterCustomFields]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetNewsLetterCustomFields]
-- Add the parameters for the stored procedure here
	@fieldId int = 0,
	@newsletterId int = 0,
	@orderby int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT fieldId, newsletterId, type, name, value, datecreated, isrequired, sortby
	FROM ApplicationNewsLetterCustomFields AS p
	WHERE 
	p.newsletterId = CASE WHEN @newsletterId > 0 THEN @newsletterId ELSE p.newsletterId END	
	And p.fieldId = CASE WHEN @fieldId > 0 THEN @fieldId ELSE p.fieldId END
	Order By p.sortby Asc
END

GO
/****** Object:  StoredProcedure [dbo].[GetNewsLetterMemberCustomFields]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetNewsLetterMemberCustomFields]
	-- Add the parameters for the stored procedure here
	@memberId int = 0
AS
BEGIN
	SELECT dbo.ApplicationNewsLetterMemberCustomFields.Id, dbo.ApplicationNewsLetterMemberCustomFields.fieldid, dbo.ApplicationNewsLetterCustomFields.newsletterId, dbo.ApplicationNewsLetterCustomFields.type, dbo.ApplicationNewsLetterCustomFields.name, 
                dbo.ApplicationNewsLetterCustomFields.isrequired, dbo.ApplicationNewsLetterCustomFields.value as defaultvalue,
                dbo.ApplicationNewsLetterMemberCustomFields.memberId, dbo.ApplicationNewsLetterMemberCustomFields.value, 
               dbo.ApplicationNewsLetterMemberCustomFields.datecreated
	FROM  dbo.ApplicationNewsLetterMemberCustomFields INNER JOIN
               dbo.ApplicationNewsLetterCustomFields ON dbo.ApplicationNewsLetterMemberCustomFields.fieldid = dbo.ApplicationNewsLetterCustomFields.fieldId 
    Where dbo.ApplicationNewsLetterMemberCustomFields.memberId = @memberId
END

GO
/****** Object:  StoredProcedure [dbo].[GetNewsLetterMembers]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetNewsLetterMembers]
	-- Add the parameters for the stored procedure here 
	@start int = 1,
	@length int = 10,
	@newsletterId int = 0,
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT memberId, renndermemberId, newsletterId, firstname, lastname, email, datecreated
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 1 THEN p.datecreated END ASC,
	CASE WHEN @orderby = 2 THEN p.datecreated END DESC,
	CASE WHEN @orderby = 3 THEN p.lastname END ASC,
	CASE WHEN @orderby = 4 THEN p.lastname END DESC,
	CASE WHEN @orderby = 5 THEN p.firstname END ASC, 
	CASE WHEN @orderby = 5 THEN p.firstname END DESC 
	) as rownum, p.*
	FROM ApplicationNewsLetterMembers AS p
	WHERE 
	p.newsletterId = CASE WHEN @newsletterId > 0 THEN @newsletterId ELSE p.newsletterId END	
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetNewsletters]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetNewsletters]
-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@totalcampaignssent int = 0, 
	@start int = 1,
	@length int = 10,
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT newsletterId, websiteId, title, datecreated, totalcampaigns, totalcampaignssent, totalmembers
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.websiteId END DESC,
	CASE WHEN @orderby = 1 THEN p.newsletterId END DESC,
	CASE WHEN @orderby = 2 THEN p.title END ASC
	) as rownum, p.*
	FROM ApplicationNewsLetter AS p
	WHERE 
	p.websiteId = CASE WHEN @websiteId > 0 THEN @websiteId ELSE p.websiteId END	
	AND (
		p.totalcampaignssent >= CASE WHEN @totalcampaignssent > 0 THEN @totalcampaignssent ELSE p.totalcampaignssent END
		)
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageIdFromDomainAndTitle]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/17/2011 4:11 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageIdFromDomainAndTitle] 
	-- Add the parameters for the stored procedure here
	@domainname nvarchar(50) = '', 
	@pagetitle nvarchar(100) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   SELECT p.pageid FROM pages p LEFT JOIN websites ws 
	ON ws.websiteid=p.websiteid 
	WHERE p.websiteid=(
		SELECT w.websiteid FROM websitedomains w WHERE w.domain = @domainname
	) 
	AND p.title=ws.title + ' - ' + @pagetitle AND p.deleted =0
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageIdFromSubDomainAndTitle]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/17/2011 4:11 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageIdFromSubDomainAndTitle] 
	-- Add the parameters for the stored procedure here
	@domainname nvarchar(50) = '', 
	@subdomain nvarchar(50) = '', 
	@pagetitle nvarchar(100) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
   SELECT p.pageid FROM pages p LEFT JOIN websites ws 
	ON ws.websiteid=p.websiteid 
	WHERE p.websiteid=(
		SELECT w.websiteid FROM websitesubdomains w WHERE w.domain = @domainname AND w.subdomain=@subdomain
	) 
	AND p.title=ws.title + ' - ' + @pagetitle AND p.deleted =0
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageInfoFromDomain]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/17/2015 3:06 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromDomain]
	-- Add the parameters for the stored procedure here
	@domain nvarchar(200)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @pId int
	SELECT @pId = p.pageid FROM websitedomains w LEFT JOIN pages p ON p.pageid=(SELECT w2.pagehome FROM websites w2 WHERE w2.websiteid=w.websiteid) WHERE w.domain = @domain AND p.deleted=0
    EXEC GetPageInfoFromPageId @pageId=@pId
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageInfoFromDomainAndTitle]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/17/2015 3:09 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromDomainAndTitle]
	-- Add the parameters for the stored procedure here
	@domain nvarchar(200),
	@title nvarchar(250)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @pId int
	EXEC @pId = GetPageIdFromDomainAndTitle @domainname=@domain, @pagetitle=@title
	EXEC GetPageInfoFromPageId @pageId=@pId
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageInfoFromPageId]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/22/2012 11:11 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromPageId] 
	-- Add the parameters for the stored procedure here
	@pageId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT p.pageid, p.websiteid, w.title AS websitetitle, p.parentid, w.pagedenied, w.page404, w.websitetype, w.trial, w.icon, p.ownerId, p.security,
    p.membersonly, p.title, (CASE WHEN p.parentid IS NOT NULL THEN (SELECT title FROM pages WHERE pageid=p.parentid) ELSE NULL END) AS parenttitle,
	p.tagwords, p.photo, p.description, p.datecreated, p.layoutid, 
    (SELECT memberid FROM evolverlayouts WHERE layoutid=p.layoutid) AS layoutowner, 
    (SELECT TOP 1 d.googlewebpropertyid FROM websitedomains d WHERE d.websiteid=p.websiteId ORDER BY d.datecreated ASC) AS googlewebpropertyid,
	w.background, p.background AS pagebackground, p.css, w.css AS websitecss
    FROM pages p LEFT JOIN websites w ON w.websiteid=p.websiteId WHERE p.pageid=@pageId
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageInfoFromSubDomain]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/17/2015 3:09 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromSubDomain]
	-- Add the parameters for the stored procedure here
	@domain nvarchar(200),
	@subdomain nvarchar(200)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @pId int
	SELECT @pId = p.pageid FROM websitesubdomains w LEFT JOIN pages p ON p.pageid=(SELECT w2.pagehome FROM websites w2 WHERE w2.websiteid=w.websiteid) WHERE w.domain = @domain AND w.subdomain=@subdomain AND p.deleted <> 1
	EXEC GetPageInfoFromPageId @pageId=@pId
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageInfoFromSubDomainAndTitle]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/17/2015 3:09 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromSubDomainAndTitle]
	-- Add the parameters for the stored procedure here
	@domain nvarchar(200),
	@subdomain nvarchar(200),
	@title nvarchar(250)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @pId int
	EXEC @pId = GetPageIdFromSubDomainAndTitle @domainname=@domain, @subdomain=@subdomain, @pagetitle=@title
	EXEC GetPageInfoFromPageId @pageId=@pId
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageInfoFromWebsiteId]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/22/2012 11:11 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromWebsiteId] 
	-- Add the parameters for the stored procedure here
	@pageId int = 0, 
	@websiteId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT w.title AS websitetitle, p.parentid, w.pagedenied, w.page404, w.websitetype, w.trial, w.icon, p.ownerId, p.security, 
    p.membersonly, p.title, (CASE WHEN p.parentid IS NOT NULL THEN (SELECT title FROM pages WHERE pageid=p.parentid) ELSE NULL END) AS parenttitle,
	 p.tagwords, p.photo, p.description, p.datecreated, p.layoutid, 
    (SELECT memberid FROM evolverlayouts WHERE layoutid=p.layoutid) AS layoutowner, 
    (SELECT TOP 1 googlewebpropertyid FROM websitedomains WHERE websiteid=@websiteId ORDER BY datecreated ASC) AS googlewebpropertyid,
	w.background, p.background AS pagebackground, p.css, w.css AS websitecss
    FROM pages p LEFT JOIN websites w ON w.websiteid=@websiteId WHERE p.pageid=@pageId
END




GO
/****** Object:  StoredProcedure [dbo].[GetPageList]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/13/2014 12:18 am
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageList] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@orderby int = 1,
	@subonly bit = 0,
	@filter nvarchar(10) = '',
	@start int = 1,
	@length int = 10,
	@datestart datetime,
	@parentid int = 0,
	@pageid int = 0

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @parentTitle nvarchar(100) = ''

	IF @subonly = 1 AND @parentid > 0 BEGIN
		-- get parent page title
		SELECT @parentTitle = title FROM pages WHERE pageid=@parentid
		SELECT @parentTitle = value FROM dbo.SplitArray(@parentTitle,' - ') WHERE Position=2
		SET @parentTitle = @parentTitle
	END ELSE IF @subonly = 1 BEGIN
		-- get parent page title
		SELECT @parentTitle = title FROM pages WHERE pageid=@pageid
		SELECT @parentTitle = value FROM dbo.SplitArray(@parentTitle,' - ') WHERE Position=2
		SET @parentTitle = @parentTitle
	END

    -- Insert statements for procedure here
	SELECT * INTO #tbl FROM (SELECT ROW_NUMBER() 
		OVER (ORDER BY
		CASE WHEN @orderby = 1 THEN datecreated END ASC,
		CASE WHEN @orderby = 2 THEN datecreated END DESC,
		CASE WHEN @orderby = 3 THEN datecreated END DESC,
		CASE WHEN @orderby = 4 THEN datecreated END ASC,
		CASE WHEN @orderby = 5 THEN title END ASC,
		CASE WHEN @orderby = 6 THEN title END DESC,
		CASE WHEN @orderby = 7 THEN rating END DESC 
		)	
		AS rownum, pageid, title, @parentTitle AS parenttitle, datecreated, datemodified, datepublished, favorite, rating, description 
		FROM pages
		WHERE websiteid=@websiteid AND (istemplate=0 OR istemplate IS NULL) AND enabled=1 AND deleted=0
		AND pageid <> @pageid AND pageid <> @parentid
		AND title LIKE CASE WHEN @subonly=1 AND @parentid > 0 THEN '%' + @parentTitle + '%'
				ELSE CASE WHEN @subonly=1 THEN '%' + @parentTitle + '%'
				ELSE title END END
		AND (parentId = CASE WHEN @subonly=1 AND @parentid > 0 THEN @parentid
				ELSE CASE WHEN @subonly = 1 THEN @pageid 
				ELSE parentId END END
			OR (@subonly=0 AND @parentid = 0 AND parentId is null)
			)
		AND datecreated >= CASE WHEN @orderby=1 THEN @datestart ELSE DATEADD(year,-100,GETDATE()) END
		AND datecreated <= CASE WHEN @orderby=3 THEN @datestart ELSE GETDATE() END
		
		AND datecreated < datepublished

) AS tbl WHERE rownum >= @start AND rownum < @start + @length

IF (SELECT COUNT(*) FROM #tbl) = 0 AND @orderby = 1 BEGIN
	EXEC GetPageList @websiteId, 2, @subonly, @filter, @start, @length, @datestart, @parentid, @pageid
END 
	ELSE
	SELECT * FROM #tbl
END
GO
/****** Object:  StoredProcedure [dbo].[GetPageParents]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Batch submitted through debugger: SQLQuery1.sql|7|0|C:\Users\MARKEN~1\AppData\Local\Temp\~vsD45.sql
-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/9/2014 2:02 am
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageParents] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@orderby int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT pageid, title, datecreated 
	FROM pages WHERE websiteid=@websiteId 
	AND (pageid IN (SELECT DISTINCT parentid FROM pages WHERE websiteid=@websiteId AND enabled=1 AND deleted=0 AND parentid IS NOT null)
	OR (templateid IS NOT NULL))
	AND enabled=1 AND deleted=0
	ORDER BY 
		CASE WHEN @orderby = 0 THEN datecreated END ASC,
		CASE WHEN @orderby = 1 THEN datecreated END DESC,
		CASE WHEN @orderby = 2 THEN title END ASC,
		CASE WHEN @orderby = 3 THEN title END DESC

END

GO
/****** Object:  StoredProcedure [dbo].[GetPagesForMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/3/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPagesForMember] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@start int = 0,
	@length int = 12,
	@search nvarchar(50) = '',
	@websiteId int = 0,
	@parentid int = 0,
	@orderby int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT datecreated, datemodified, description, hitstoday, hitstotal, 
	lasthit, lasthitip, layoutid, ownerid, pageid, published, 
	security, tagwords, title, galaxyid
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.datecreated END DESC,
	CASE WHEN @orderby = 1 THEN p.datemodified END DESC,
	CASE WHEN @orderby = 2 THEN p.title END ASC,
	CASE WHEN @orderby = 3 THEN p.hitstotal END DESC,
	CASE WHEN @orderby = 4 THEN p.hitstotal END ASC 
) as rownum, p.*
	FROM Pages AS p
	WHERE 
	p.ownerid = CASE WHEN @memberId <> '' THEN @memberId ELSE p.ownerid END
	AND NOT p.deleted = 1
	AND p.enabled = 1
	AND (p.websiteid = CASE WHEN @websiteId > 0 THEN @websiteId ELSE 0 END)
	AND (
		p.title LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.title END
		OR p.description LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.description END
		OR p.tagwords LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.tagwords END
		)
	AND (p.parentid = CASE WHEN @parentid > 0 THEN @parentid ELSE p.parentid END)
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetPagesForWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/31/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPagesForWebsite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@ownerId int = 0,
	@searchTitle nvarchar(25) = '',
	@searchTagWords nvarchar(25) = '',
	@start int = 1,
	@length int = 9
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT pageid, ownerid, galaxyid, title, TagWords,
	datecreated, datemodified, security, published, lasthit, lasthitip,
	hitstoday, hitstotal, description, websiteid, websiteId, layoutId
	 FROM (SELECT ROW_NUMBER() OVER(ORDER BY datecreated DESC) as rownum, 
	* FROM pages WHERE
	websiteId=@websiteId AND ownerId=@ownerId AND
	enabled=1 AND deleted=0 AND
	title LIKE CASE WHEN @searchTitle <> '' THEN '%' + @searchTitle + '%' ELSE title END
	AND tagwords LIKE CASE WHEN @searchTagWords <> '' THEN '%' + @searchTagWords + '%' ELSE tagwords END
	) AS mytbl
	WHERE rownum BETWEEN @start AND @start + @length
	
END

GO
/****** Object:  StoredProcedure [dbo].[GetPageTestIncriment]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/4/2013 9:15 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageTestIncriment] 
	-- Add the parameters for the stored procedure here
	@pageid int = 0, 
	@websiteid int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @id int = 0
	SELECT @id = COUNT(*) FROM pagesABTestsIncriment WHERE websiteid=@websiteid AND pageid=@pageid
	IF @id = 0 BEGIN
		INSERT INTO PagesABTestsIncriment (websiteid, pageid, incriment) VALUES(@websiteid, @pageid, 0)
	END 
	SELECT @id = MIN(testid) FROM pagesABTests WHERE websiteid=@websiteid AND pageid=@pageid 
	AND testid > (SELECT incriment FROM pagesABTestsIncriment WHERE websiteid=@websiteid AND pageid=@pageid)
	AND active=1
	IF @id IS NULL OR @id=0 BEGIN SELECT @id = MIN(testid) FROM pagesABTests WHERE websiteid=@websiteid AND pageid=@pageid END
	UPDATE pagesABTestsIncriment SET incriment=@id WHERE websiteid=@websiteid AND pageid=@pageid
	SELECT @id
END

GO
/****** Object:  StoredProcedure [dbo].[GetSecurityAccounts]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/6/2013 11:30 am
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetSecurityAccounts] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@start int = 1,
	@length int = 10,
	@search nvarchar(25)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT memberid INTO #members2 FROM websitemembers WHERE websiteid=@websiteid

	SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY m.lastname, m.firstname, m.memberid) AS rownum, 
	m.memberid, m.firstname, m.lastname, m.displayname, m.photo, m.email, wm.securitylevel, wm.joindate
	FROM members m LEFT JOIN websitemembers wm ON wm.websiteid=@websiteid AND wm.memberid=m.memberid
	WHERE m.memberid IN (SELECT * FROM #members2)
	) AS tbl WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetSecurityForFeature]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetSecurityForFeature] 
	-- Add the parameters for the stored procedure here
	@websiteid int = 0, 
	@pageid int = 0,
	@memberid int = 0,
	@feature nvarchar(50) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT security FROM WebsiteSecurity WHERE websiteid=@websiteid
	AND pageid = CASE WHEN @pageid > 0 THEN @pageid ELSE pageid END
	AND memberid=@memberid AND feature=@feature

END

GO
/****** Object:  StoredProcedure [dbo].[GetSecurityForWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetSecurityForWebsite] 
	-- Add the parameters for the stored procedure here
	@websiteid int = 0, 
	@memberid int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT pageid, feature, security FROM WebsiteSecurity WHERE websiteid=@websiteid AND memberid=@memberid
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/2/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT w.websiteId, w.title, p.pageid, p.datecreated,
	(SELECT COUNT(*) FROM pages WHERE websiteid=@websiteId) AS totalPages
	, p.hitstotal, w.url 
	FROM websites w 
	LEFT JOIN pages p ON p.pageid=w.pagehome 
	WHERE w.websiteId=@websiteId
	AND w.deleted=0
	AND w.enabled=1
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsiteCommentApprovals]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 4/23/2010 4:25 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteCommentApprovals] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@ownerId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT pageid INTO #tmpPages FROM Pages WHERE websiteid=@websiteId AND ownerId=@ownerId
	SELECT c.commentid, c.writerid, m.photo, m.datecreated AS signupdate, 
	c.pageid, p.title AS pagetitle, c.fullname, c.email, c.datecreated 
	FROM Comments c LEFT JOIN Members m ON m.memberId=c.writerId LEFT JOIN Pages p ON p.pageId=c.pageId 
	WHERE c.pageId IN (SELECT * FROM #tmpPages) AND approved=0 
	ORDER BY c.dateCreated ASC
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsiteInfoFromMemberId]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/31/2012
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteInfoFromMemberId] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @websiteId int,
	@pages nvarchar(50),
	@dashboard nvarchar(10),
	@title nvarchar(100)
	
	SELECT TOP 1 @websiteId=websiteid FROM WebSites WHERE ownerid=@memberId 
	SELECT @pages=Pages FROM evolverapplicationspages WHERE websiteId=@websiteId AND applicationId=5
	
	SELECT @dashboard=a.value FROM SplitArray(@pages,',') AS a WHERE a.position=2 /*2 = dashboard */
	
	SELECT @websiteId as websiteId,p.ownerid,p.pageid,
			(SELECT TOP 1 domain FROM WebsiteDomains WHERE websiteId=@websiteId) as domain,
			(SELECT TOP 1 subdomain+'.'+domain FROM WebsiteSubDomains WHERE websiteId=@websiteId) as subdomain,
			p.title, p.datecreated
	FROM pages p WHERE p.pageid=@dashboard
				 
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsites]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/22/2009 10:55 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsites] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@start int = 1,
	@length int = 10,
	@search nvarchar(100),
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    DECLARE @cursor1 CURSOR,
    @rownum int,
    @websiteid int,
    @title nvarchar(100),
    @url nvarchar(100),
    @pagehome int,
    @datecreated datetime,
    @galaxyid int,
    @tagwords nvarchar(100),
    @lastmodified datetime,
    @security int,
    @published bit,
    @lasthit datetime,
    @hitstoday int,
    @hitstotal int,
    @ratingtotal int,
    @ratedcount int,
    @datemodified datetime,
    @description nvarchar(250),
    @pageDate datetime,
    @pageMonth nvarchar(2),
    @pageDay nvarchar(2),
    @pageHour nvarchar(2),
    @pageMod datetime,
    @pageId int,
    @domain nvarchar(25),
    @googletoken varchar(max),
    @googleprofileId varchar(20),
    @googlewebpropertyId varchar(20)
    
    DECLARE  @tblWebsites TABLE(
		rownum int,
		websiteid int,
		title nvarchar(100),
		url nvarchar(100),
		pagehome int,
		datecreated datetime,
		galaxyid int,
		tagwords nvarchar(100),
		lastmodified datetime,
		security int,
		published bit,
		lasthit datetime,
		hitstoday int,
		hitstotal int,
		ratingtotal int,
		ratedcount int,
		datemodified datetime,
		description nvarchar(250),
		domain nvarchar(25),
		screenshot2 nvarchar(50),
		googletoken varchar(max),
		googleprofileId varchar(20),
		googlewebpropertyId varchar(20)
    ) 
    
    
    
    SET @cursor1 = CURSOR FOR
	SELECT * FROM (
		SELECT ROW_NUMBER() OVER(ORDER BY
			CASE WHEN @orderby = 1 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 2 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 3 THEN w.title END ASC,
			CASE WHEN @orderby = 4 THEN w.title END DESC
		) AS rownum, 
		w.websiteid, w.title, w.url, w.pagehome, p.datecreated, p.galaxyid, p.tagwords, 
		(SELECT TOP 1 datemodified FROM pages WHERE websiteid=w.websiteid ORDER BY datemodified DESC) AS lastmodified,  
		p.security, p.published, p.lasthit, p.hitstoday, p.hitstotal, p.ratingtotal, p.ratedcount, p.datemodified, p.description, 
		d.domain, d.googletoken, d.googleprofileId, d.googlewebpropertyId
		FROM websites w LEFT JOIN pages p ON p.pageid=w.pagehome 
		LEFT JOIN websitedomains d ON d.websiteid=w.websiteid
		WHERE (w.ownerid=@memberId OR w.websiteid IN (SELECT websiteid FROM websitesecurity WHERE memberid=@memberId))
		AND w.deleted=0 AND w.enabled=1
		AND (w.websitetype <> 2  -- 2 = web site template for a design
		OR w.websitetype IS null)
		AND (
			w.title LIKE '%' + @search + '%'
			OR p.tagwords LIKE '%' + @search + '%'
			OR p.description LIKE '%' + @search + '%' 
		)
	)AS mytbl WHERE rownum >= @start AND rownum <= @start + @length
	
	OPEN @cursor1
	
	FETCH FROM @cursor1 INTO
	@rownum, @websiteid, @title, @url, @pagehome, @datecreated, @galaxyid, @tagwords,
    @lastmodified, @security, @published, @lasthit, @hitstoday, @hitstotal,
    @ratingtotal, @ratedcount, @datemodified, @description, @domain, @googletoken, @googleprofileId, @googlewebpropertyId
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
    
		SELECT TOP 1 @pageDate=datecreated, @pageMod=datemodified, @pageId=pageId FROM Pages WHERE websiteId=@websiteid ORDER BY datecreated DESC
		SET @pageMonth = MONTH(@pageDate)
		SET @pageDay = DAY(@pageDate)
		SET @pageHour = DATEPART(hour, @pageMod)
		IF @pageHour > 12
		BEGIN
		SET @pageHour = @pageHour - 12
		END
		IF @pageHour = 0
		BEGIN
		SET @pageHour = 12
		END
		
		IF LEN(@pageMonth) = 1
		BEGIN
		SET @pageMonth = '0' + CONVERT(nvarchar(1), @pageMonth)
		END
		IF LEN(@pageDay) = 1
		BEGIN
		PRINT LEN(@pageDay)
		SET @pageDay = '0' + CONVERT(nvarchar(1), @pageDay)
		END
		
		INSERT INTO @tblWebsites (rownum, websiteid, title, url, pagehome, datecreated, galaxyid, tagwords,
		lastmodified, security, published, lasthit, hitstoday, hitstotal,
		ratingtotal, ratedcount, datemodified, description, domain, screenshot2, googletoken, googleprofileId, googlewebpropertyId) VALUES
		(@rownum, @websiteid, @title, @url, @pagehome, @datecreated, @galaxyid, @tagwords,
		@lastmodified, @security, @published, @lasthit, @hitstoday, @hitstotal,
		@ratingtotal, @ratedcount, @datemodified, @description, @domain,
		CONVERT(nvarchar(4), YEAR(@pageDate)) + CONVERT(nvarchar(2), @pageMonth) + '/'  + CONVERT(nvarchar(2), @pageDay) + '/' + CONVERT(nvarchar(10), @pageId) + '/' + CONVERT(nvarchar(10), @pageId) + '_' + CONVERT(nvarchar(2), @pageHour) + CONVERT(nvarchar(2), DATEPART(minute, @pageMod)) +  '.jpg', 
		@googletoken, @googleprofileId, @googlewebpropertyId
		)
		FETCH FROM @cursor1 INTO
		@rownum, @websiteid, @title, @url, @pagehome, @datecreated, @galaxyid, @tagwords,
		@lastmodified, @security, @published, @lasthit, @hitstoday, @hitstotal,
		@ratingtotal, @ratedcount, @datemodified, @description, @domain, @googletoken, @googleprofileId, @googlewebpropertyId
    END
    
    CLOSE @cursor1
	DEALLOCATE @cursor1
	
	SELECT * FROM @tblWebsites
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsitesForAdmin]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/22/2009 10:55 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsitesForAdmin] 
	-- Add the parameters for the stored procedure here
	@start int = 1,
	@length int = 10,
	@search nvarchar(100)='',
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    DECLARE @cursor1 CURSOR,
    @rownum int,
    @websiteid int,
    @title nvarchar(100),
    @url nvarchar(100),
    @pagehome int,
	@websitetype int,
	@license bit, 
	@licensetype int, 
	@saleapproved bit, 
	@trial bit,
	@deleted bit,
    @datecreated datetime,
    @galaxyid int,
    @tagwords nvarchar(100),
    @lastmodified datetime,
    @security int,
    @published bit,
    @lasthit datetime,
    @hitstoday int,
    @hitstotal int,
    @ratingtotal int,
    @ratedcount int,
    @datemodified datetime,
    @description nvarchar(250),
    @pageDate datetime,
    @pageMonth nvarchar(2),
    @pageDay nvarchar(2),
    @pageHour nvarchar(2),
    @pageMod datetime,
    @pageId int,
    @domain nvarchar(25),
    @subdomain nvarchar(50)
    
    DECLARE  @tblWebsites TABLE(
		rownum int,
		websiteid int,
		title nvarchar(100),
		url nvarchar(100),
		pagehome int,
		websitetype int,
		license bit, 
		licensetype int, 
		saleapproved bit, 
		trial bit,
		deleted bit,
		datecreated datetime,
		galaxyid int,
		tagwords nvarchar(100),
		lastmodified datetime,
		security int,
		published bit,
		lasthit datetime,
		hitstoday int,
		hitstotal int,
		ratingtotal int,
		ratedcount int,
		datemodified datetime,
		description nvarchar(250),
		domain nvarchar(25),
		subdomain nvarchar(50),
		screenshot nvarchar(50)
    ) 
    
    
    
    SET @cursor1 = CURSOR FOR
	SELECT a.*,(SELECT TOP 1 datemodified FROM pages WHERE websiteid=a.websiteid AND pageid=a.pagehome) AS lastmodified,
	(SELECT TOP 1 domain FROM websitedomains WHERE websiteid=a.websiteid) AS domain,
	(SELECT TOP 1 subdomain+'.'+domain FROM websitesubdomains WHERE websiteid=a.websiteid) AS subdomain
		 FROM (
		SELECT TOP (@start+@length) ROW_NUMBER() OVER(ORDER BY
			CASE WHEN @orderby = 1 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 2 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 3 THEN w.title END ASC,
			CASE WHEN @orderby = 4 THEN w.title END DESC,
			CASE WHEN @orderby = 5 THEN w.title END ASC,
			CASE WHEN @orderby = 6 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 7 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 8 THEN w.title END ASC,
			CASE WHEN @orderby = 9 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 10 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 11 THEN w.title END ASC,
			CASE WHEN @orderby = 12 THEN w.datecreated END DESC
		) AS rownum, 
		w.websiteid, w.title, w.url, w.pagehome, w.websitetype, w.license, w.licensetype, w.saleapproved, w.trial, 
		w.deleted, p.datecreated, p.galaxyid, p.tagwords, p.security, p.published, p.lasthit, p.hitstoday, 
		p.hitstotal, p.ratingtotal, p.ratedcount, p.datemodified, p.description
		
		FROM websites w, pages p 
		WHERE p.pageid=w.pagehome
		AND (
			w.title LIKE '%' + @search + '%'
			OR p.tagwords LIKE '%' + @search + '%'
			OR p.description LIKE '%' + @search + '%' 
		)

		AND w.websitetype = CASE WHEN @orderby = 5 THEN 2 ELSE 
							CASE WHEN @orderby = 6 THEN 2 ELSE
							CASE WHEN @orderby = 7 THEN 2 ELSE
							CASE WHEN @orderby = 8 THEN w.websitetype ELSE 
							CASE WHEN @orderby = 9 THEN w.websitetype ELSE
							CASE WHEN @orderby = 10 THEN w.websitetype ELSE 0
							END END END END END END
		AND w.deleted = CASE WHEN @orderby = 8 THEN 1 ELSE 
						CASE WHEN @orderby = 9 THEN 1 ELSE
						CASE WHEN @orderby = 10 THEN 1 ELSE w.deleted 
						END END END

		AND w.trial = CASE WHEN @orderby = 11 THEN 0 ELSE
						CASE WHEN @orderby = 12 THEN 0 ELSE w.trial
						END END


	)AS a WHERE rownum >= @start AND rownum <= @start + @length
	
	OPEN @cursor1
	
	FETCH FROM @cursor1 INTO
	@rownum, @websiteid, @title, @url, @pagehome, @websitetype, @license, @licensetype, 
	@saleapproved, @trial, @deleted, @datecreated, @galaxyid, @tagwords,
    @security, @published, @lasthit, @hitstoday, @hitstotal,
    @ratingtotal, @ratedcount, @datemodified, @description, @lastmodified, @domain, @subdomain
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
    
		SELECT TOP 1 @pageDate=datecreated, @pageMod=datemodified, @pageId=pageId FROM Pages WHERE websiteId=@websiteid AND pageid=@pagehome
		SET @pageMonth = MONTH(@pageDate)
		SET @pageDay = DAY(@pageDate)
		SET @pageHour = DATEPART(hour, @pageMod)
		IF @pageHour > 12
		BEGIN
		SET @pageHour = @pageHour - 12
		END
		IF @pageHour = 0
		BEGIN
		SET @pageHour = 12
		END
		
		IF LEN(@pageMonth) = 1
		BEGIN
		SET @pageMonth = '0' + CONVERT(nvarchar(1), @pageMonth)
		END
		IF LEN(@pageDay) = 1
		BEGIN
		PRINT LEN(@pageDay)
		SET @pageDay = '0' + CONVERT(nvarchar(1), @pageDay)
		END
		
		INSERT INTO @tblWebsites (rownum, websiteid, title, url, pagehome, websitetype, license, licensetype, 
		saleapproved, trial, deleted, datecreated, galaxyid, tagwords,
		lastmodified, security, published, lasthit, hitstoday, hitstotal,
		ratingtotal, ratedcount, datemodified, description, domain, subdomain, screenshot) VALUES
		(@rownum, @websiteid, @title, @url, @pagehome, @websitetype, @license, @licensetype, 
		@saleapproved, @trial, @deleted, @datecreated, @galaxyid, @tagwords,
		@lastmodified, @security, @published, @lasthit, @hitstoday, @hitstotal,
		@ratingtotal, @ratedcount, @datemodified, @description, @domain, @subdomain,
		CONVERT(nvarchar(10), @pageId) + '/' + CONVERT(nvarchar(10), @pageId) + '_' + CONVERT(nvarchar(2), @pageHour) + CONVERT(nvarchar(2), DATEPART(minute, @pageMod)) +  '.jpg'
		)
		FETCH FROM @cursor1 INTO
		@rownum, @websiteid, @title, @url, @pagehome, @websitetype, @license, @licensetype, 
		@saleapproved, @trial, @deleted, @datecreated, @galaxyid, @tagwords,
		@security, @published, @lasthit, @hitstoday, @hitstotal,
		@ratingtotal, @ratedcount, @datemodified, @description, @lastmodified, @domain, @subdomain
    END
    
    CLOSE @cursor1
	DEALLOCATE @cursor1
	
	SELECT * FROM @tblWebsites
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsitesForMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/5/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsitesForMember] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@start int = 0,
	@length int = 12,
	@search nvarchar(50),
	@orderby int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT websiteId, ownerId, title, url, pagetemplate, pagehome,
	layoutId, dateCreated, galaxyid, datemodified, 
	security, hitstotal, hitstoday, lasthitip, lasthit, description, published  
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN w.datecreated END DESC,
	CASE WHEN @orderby = 1 THEN p.datemodified END DESC,
	CASE WHEN @orderby = 2 THEN w.title END ASC,
	CASE WHEN @orderby = 3 THEN p.hitstotal END DESC,
	CASE WHEN @orderby = 4 THEN p.hitstotal END ASC 
) as rownum, 
	w.websiteId, w.ownerId, w.title, w.url, w.pagetemplate, w.pagehome,
	w.layoutId, w.dateCreated, p.datemodified, p.description, p.hitstoday, 
	p.hitstotal, p.lasthit, p.lasthitip, p.published, p.galaxyid,
	p.security
	FROM WebSites AS w LEFT JOIN Pages AS p ON p.pageid=w.pagehome
	WHERE w.ownerId = @memberId
	AND w.websitetype <> 2 -- 2 = template web site for a design
	AND w.deleted=0
	AND w.enabled=1
	AND (
		w.title LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.title END
		OR p.description LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.description END
		OR p.tagwords LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.tagwords END
	)) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsiteTemplatesForDesign]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/6/2009
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteTemplatesForDesign]
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@layoutId int = 0,
	@galaxyId int = 0,
	@keywords nvarchar(25) = '',
	@start int = 1,
	@length int = 10,
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    
	SELECT * FROM (
	SELECT ROW_NUMBER() OVER(ORDER BY 
	CASE WHEN @orderby = 1 THEN datecreated END ASC,
	CASE WHEN @orderby = 2 THEN datecreated END DESC) AS rownum, 
	w.websiteid, w.title, w.pagehome, w.pagedash, w.datecreated, w.license, w.licensetype,
	(SELECT datemodified FROM pages WHERE pageid=w.pagehome) as datemodified,
	w.price, w.saleapproved, (SELECT CASE WHEN COUNT(*) > 0 THEN (SELECT CASE WHEN description IS NOT NULL THEN description ELSE 'no description' END FROM pages where pageid=w.pagehome) ELSE '' END FROM pages where pageid=w.pagehome) AS description
	FROM websites w 
	WHERE layoutid=@layoutid AND ownerid=@memberid AND websitetype=2 AND enabled=1 AND deleted=0
	AND (galaxyid = CASE WHEN @galaxyid > 0 THEN @galaxyid ELSE galaxyid END OR galaxyid is NULL)
	) as mytbl1 WHERE rownum >= @start AND rownum <= @start + @length
	
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsiteTemplatesForFree]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 07/19/2013 4:50 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteTemplatesForFree]
	-- Add the parameters for the stored procedure here
	@memberId int,
	@start int = 0,
	@length int = 0,
	@category int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY w.datecreated DESC) AS rownum, 
	 w.websiteid, w.ownerid as memberid, w.title, w.pagehome, 
	(SELECT description FROM pages WHERE pageid=w.pagehome) AS description
	FROM websites w
	WHERE w.price=0 AND w.saleapproved = 1 AND license=1 AND licensetype=1
	AND w.enabled = 1 AND w.deleted = 0
	AND (w.templatetype = @category)
	AND NOT w.ownerId = @memberId
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[GetWebsiteTemplatesForMember]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 2:00 AM 12/7/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteTemplatesForMember] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@galaxyId int = 0,
	@keywords nvarchar(25) = '',
	@start int = 1,
	@length int = 10,
	@orderby int = 2
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    
	SELECT * FROM (
	SELECT ROW_NUMBER() OVER(ORDER BY 
		CASE WHEN @orderby = 1 THEN w.datecreated END ASC,
		CASE WHEN @orderby = 2 THEN w.datecreated END DESC,
		CASE WHEN @orderby = 3 THEN w.title END ASC,
		CASE WHEN @orderby = 4 THEN w.title END DESC,
		CASE WHEN @orderby = 5 THEN d.title END ASC,
		CASE WHEN @orderby = 5 THEN w.datecreated END DESC) AS rownum, 
	w.websiteid, w.title, w.pagehome, w.pagedash, w.datecreated, w.license, w.licensetype,
	(SELECT datemodified FROM pages WHERE pageid=w.pagehome) as datemodified,
	w.price, w.saleapproved, w.templatetype,
	(SELECT CASE WHEN COUNT(*) > 0 THEN 
		(SELECT CASE WHEN description IS NOT NULL THEN description ELSE 'no description' END FROM pages where pageid=w.pagehome) 
	ELSE '' END FROM pages where pageid=w.pagehome) AS description,
	d.title as layouttitle
	FROM websites w LEFT JOIN evolverlayouts d ON d.layoutid=w.layoutid
	WHERE ownerid=@memberid AND w.websitetype=2 AND w.enabled=1 AND w.deleted=0
	AND (w.galaxyid = CASE WHEN @galaxyid > 0 THEN @galaxyid ELSE w.galaxyid END OR w.galaxyid is NULL)
	) as mytbl1 WHERE rownum >= @start AND rownum <= @start + @length
	
END

GO
/****** Object:  StoredProcedure [dbo].[IncrementPageView]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/20/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[IncrementPageView] 
	-- Add the parameters for the stored procedure here
	@pageId int= 0, 
	@ipAddress nvarchar(15) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @isAccept int = 0,
	@lastHit datetime
	
	-- check to see if this user's IP was the last to view the page
	SELECT @isAccept = COUNT(*) FROM Pages WHERE pageid=@pageId and NOT lasthitip = @ipAddress

-- if the last IP to view the page is not the same as this user's IP, update the page views
	if @isAccept = 1
	BEGIN
		SELECT @lastHit = lasthit FROM Pages WHERE pageid=@pageId
		UPDATE Pages SET 
		hitstoday = CASE WHEN DAY(@lastHit) = DAY(GetDate()) AND MONTH(@lastHit) = MONTH(GetDate()) THEN hitstoday + 1 ELSE 1 END,
		hitstotal += 1, lasthit=GETDATE(), lasthitip=@ipAddress
		WHERE pageid = @pageId
		
	END
END

GO
/****** Object:  StoredProcedure [dbo].[IsAMemberOfWebSite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/29/2011 1:21 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[IsAMemberOfWebSite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@memberId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @security int = 0

    -- Insert statements for procedure here
	
	IF (SELECT ownerId from WebSites WHERE websiteId=@websiteId) = @memberId 
	BEGIN
		SELECT 1
	END
		ELSE
	BEGIN
		SELECT @security = securitylevel FROM WebsiteMembers WHERE websiteId=@websiteId AND memberId=@memberId 
		SELECT @security
	END
	
END

GO
/****** Object:  StoredProcedure [dbo].[LogError]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/11/2013 6:45 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[LogError] 
	-- Add the parameters for the stored procedure here
	@datecreated datetime = '', 
	@memberId int = 0,
	@errorNumber int = 0,
	@param1 nvarchar(50) = '',
	@param2 nvarchar(50) = '',
	@param3 nvarchar(50) = '',
	@param4 nvarchar(50) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO ErrorLog (datecreated, memberId, errornumber, param1, param2, param3, param4) 
					VALUES(@datecreated, @memberId, @errorNumber, @param1, @param2, @param3, @param4)
END

GO
/****** Object:  StoredProcedure [dbo].[LogRequest]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/23/2012 1:02 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[LogRequest] 
	-- Add the parameters for the stored procedure here
	@websiteid int = 0,
	@pageid int = 0, 
	@loadtime int = 0,
	@ajax bit = 0,
	@visitorid nvarchar(5) = '',
	@memberid nvarchar(10) = '',
	@ipaddress nvarchar(25) = '',
	@domain nvarchar(50) = '',
	@url nvarchar(200) = '',
	@agent nvarchar(200) = '',
	@referrer nvarchar(200) = '',
	@components int = 0,
	@apps int = 0,
	@interfaces int = 0,
	@sqlqueries int = 0,
	@ctext int = 0,
	@cphotos int = 0,
	@cgalleries int = 0,
	@cpanels int = 0,
	@cmenus int = 0,
	@firstvisit bit = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO dbo.log (websiteid, pageid, loadtime, ajax, visitorid, memberid, ipaddress, domain, url, agent, referrer, firstvisit, components, apps, interfaces, sqlqueries, 
						ctext, cphotos, cgalleries, cpanels, cmenus, datecreated)
				VALUES (@websiteid, @pageid, @loadtime, @ajax, @visitorid, @memberid, @ipaddress, @domain, @url, @agent, @referrer, @firstvisit, @components, @apps, @interfaces, @sqlqueries,
						@ctext, @cphotos, @cgalleries, @cpanels, @cmenus, GETDATE()) 
END





GO
/****** Object:  StoredProcedure [dbo].[PasswordForgot]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/12/2014 2:40 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[PasswordForgot] 
	-- Add the parameters for the stored procedure here
	@email nvarchar(50) = '', 
	@resetId nvarchar(10) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF (SELECT COUNT(*) FROM PasswordReset WHERE email=@email) > 0 BEGIN
		UPDATE PasswordReset SET resetId=@resetId, datecreated=GETDATE() WHERE email=@email
	END ELSE BEGIN
		INSERT INTO PasswordReset (resetId, email, datecreated) VALUES (@resetId, @email, GETDATE())
	END
END

GO
/****** Object:  StoredProcedure [dbo].[PasswordSecureReset]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/12/2014 2:42 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[PasswordSecureReset]
	-- Add the parameters for the stored procedure here
	@resetId nvarchar(10) = '',
	@newpass nvarchar(100) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	IF (SELECT DATEDIFF(hour,datecreated,GETDATE()) FROM PasswordReset WHERE resetId=@resetId) < 1 BEGIN
		UPDATE members SET password=@newpass WHERE email=(SELECT email FROM PasswordReset WHERE resetid=@resetId)
		DELETE FROM PasswordReset WHERE resetId=@resetId 
		SELECT 1
	END ELSE BEGIN
		SELECT 0
	END
END

GO
/****** Object:  StoredProcedure [dbo].[PublishPage]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/24/2014 7:48 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[PublishPage] 
	-- Add the parameters for the stored procedure here
	@pageId int = 0, 
	@websiteId int = 0,
	@photo nvarchar(100) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @pagecreated datetime, @pagepublished datetime
	SELECT @pagecreated = datecreated, @pagepublished = datepublished FROM pages WHERE pageid=@pageId AND websiteid=@websiteId
	IF dateadd(minute, 1, @pagecreated) < @pagepublished BEGIN
		UPDATE pages SET datefirstpublished = GETDATE(), datepublished = GETDATE() WHERE pageid=@pageId AND websiteid=@websiteId
	END
	UPDATE pages SET datepublished = GETDATE(), photo=@photo WHERE pageid=@pageId AND websiteid=@websiteId
END

GO
/****** Object:  StoredProcedure [dbo].[RemoveABTests]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/17/2013 1:41 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[RemoveABTests] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@pageId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DELETE FROM PagesABTestsIncriment WHERE websiteid=@websiteId AND pageid=@pageId 
	DELETE FROM PagesABTests WHERE websiteid=@websiteId AND pageid=@pageId 
END

GO
/****** Object:  StoredProcedure [dbo].[RenameWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 4/13/2014 1:40 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[RenameWebsite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@ownerId int = 0,
	@newName nvarchar(50) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    DECLARE @X xml,
	@page nvarchar(100),
	@pageId int,
	@myxml nvarchar(200)

	DECLARE @cursor CURSOR

	SET @cursor = CURSOR FOR
	SELECT pageid, title FROM pages WHERE websiteid=@websiteId AND ownerId=@ownerId 
	OPEN @cursor
	FETCH NEXT FROM @cursor INTO @pageId, @page
	WHILE @@FETCH_STATUS = 0
	BEGIN
		SET @myxml = '<root><w><![CDATA[' + REPLACE(@page,' - ',']]></w><p><![CDATA[') + ']]></p></root>'
		SELECT @X = CONVERT(xml,@myxml)
		UPDATE pages SET title=@newName + ' - ' + (SELECT [Value] = T.c.value('.','varchar(100)')
		FROM @X.nodes('/root/p') T(c))
		WHERE pageid=@pageId

	FETCH NEXT FROM @cursor INTO @pageId, @page
	END
	CLOSE @cursor
	DEALLOCATE @cursor

	update websites SET title=@newName WHERE websiteid=@websiteId AND ownerId=@ownerId


	
END

GO
/****** Object:  StoredProcedure [dbo].[SaveDashboardSettings]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 3/28/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[SaveDashboardSettings] 
	-- Add the parameters for the stored procedure here
	@websiteId int,
	@pagesview int = -1, 
	@pagesorder int = -1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @isupdate bit = 0
	SELECT @isupdate = COUNT(*) FROM evolverdashboardsettings WHERE websiteid=@websiteId

    -- Insert statements for procedure here
	if @pagesview > -1 AND @pagesorder > -1
	BEGIN
		IF @isupdate = 1
		BEGIN
			UPDATE evolverdashboardsettings SET pagesview=@pagesview, pagesorder=@pagesorder WHERE websiteid=@websiteId 
		END
		ELSE
		BEGIN
			INSERT INTO evolverdashboardsettings (websiteid, pagesview, pagesorder) VALUES(@websiteId, @pagesview, @pagesorder)
		END
	END
END

GO
/****** Object:  StoredProcedure [dbo].[SaveFontsForWebsite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/18/2014 12:27 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[SaveFontsForWebsite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@css nvarchar(MAX) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	UPDATE pages SET CSS=NULL WHERE websiteid=@websiteId 
    UPDATE websites SET CSS=@css WHERE websiteid=@websiteId 
END

GO
/****** Object:  StoredProcedure [dbo].[SaveLogin]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/19/2012 6:21 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[SaveLogin] 
	-- Add the parameters for the stored procedure here
	@loginId nvarchar(10) = '', 
	@hash nvarchar(100) = '',
	@email nvarchar(100) = '',
	@ip nvarchar(36) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO Login (loginid, hash, email, ip, datecreated) VALUES(@loginId, @hash, @email, @ip, GETDATE())
	
END

GO
/****** Object:  StoredProcedure [dbo].[SearchEvolverApplications]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/18/2009
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[SearchEvolverApplications] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@websiteId int = 0,
	@keyword nvarchar(25) = '',
	@start int = 1,
	@length int = 10
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    SELECT applicationid INTO #tblowned FROM evolverapplicationsowned WHERE ownerid=@memberId AND websiteId=@websiteId
	SELECT * FROM(SELECT ROW_NUMBER() OVER (ORDER BY orderindex ASC) AS rownum, 
	* FROM evolverapplications WHERE approved=1 AND applicationid NOT IN (SELECT * FROM #tblowned)
	) AS tbl WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[SearchEvolverApplicationsOwned]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/14/2011 1:21 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[SearchEvolverApplicationsOwned] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@websiteId int = 0,
	@keyword nvarchar(25) = '',
	@start int = 1,
	@length int = 10
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT applicationid INTO #tblowned FROM evolverapplicationsowned WHERE ownerid=@memberId AND websiteId=@websiteId
	SELECT * FROM(SELECT ROW_NUMBER() OVER (ORDER BY orderindex ASC) AS rownum, 
	* FROM evolverapplications WHERE applicationid IN (SELECT * FROM #tblowned)
	) AS tbl WHERE rownum >= @start AND rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[SendNewsLetterCampaign]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[SendNewsLetterCampaign]
	-- Add the parameters for the stored procedure here
	@newsletterId int,
	@campaignId int 
AS
BEGIN
	--Get campaign vars
	Declare @subject varchar(100), @body varchar(100), @totalemailssent int = 0
	Set @subject = (Select subject from ApplicationNewsLetterCampaigns Where campaignId = @campaignId)
	Set @body = (Select subject from ApplicationNewsLetterCampaigns Where campaignId = @campaignId)

	--Send e-mails
	DECLARE @memberId int, @renndermemberId int, @firstname nvarchar(25), @lastname nvarchar(25), @email nvarchar(75), @datecreated datetime;

	DECLARE mycursor CURSOR FOR 
	SELECT memberId, renndermemberId, firstname, lastname, email, datecreated from ApplicationNewsLetterMembers Where newsletterId = @newsletterId

	OPEN mycursor;

	FETCH NEXT FROM mycursor 
	INTO @memberId, @renndermemberId, @firstname, @lastname, @email, @datecreated;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		set @totalemailssent = @totalemailssent + 1
		
		--EXEC msdb.dbo.sp_send_dbmail
		--@profile_name = 'AdventureWorks2008R2 Administrator',
		--@recipients = @email,
		--@subject = @subject,
		--@body = @body,
		--@body_format = 'HTML';
		
		
		FETCH NEXT FROM mycursor 
		INTO @memberId, @renndermemberId, @firstname, @lastname, @email, @datecreated;
	END
	CLOSE mycursor;
	DEALLOCATE mycursor;
	
	--Update totals
	Declare @totalcampaignssent int = 0
	Set @totalcampaignssent = (Select totalcampaignssent From ApplicationNewsLetter Where newsletterId = @newsletterId) + 1
	Update ApplicationNewsLetterCampaigns Set datelastsent = GETDATE(), totallastsent = @totalemailssent Where campaignId = @campaignId
	Update ApplicationNewsLetter Set totalcampaignssent = @totalcampaignssent Where newsletterId = @newsletterId
	
END

GO
/****** Object:  StoredProcedure [dbo].[SetMemberBackInQueue]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 1/5/2013 12:32 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[SetMemberBackInQueue] 
	-- Add the parameters for the stored procedure here
	@memberId int
AS
BEGIN
declare @wid int = (SELECT websiteid FROM WebSites WHERE ownerId=@memberId)
declare @lid int, @title nvarchar(50), @domain nvarchar(25), @subdomain nvarchar(25)

/*get required web site information*/
SELECT @lid=w.layoutid, @title=w.title, @domain=wd.domain, @subdomain=wsd.subdomain FROM websites w 
LEFT JOIN WebsiteDomains wd ON wd.websiteid=@wid 
LEFT JOIN websitesubdomains wsd ON wsd.websiteid=@wid
WHERE w.websiteId=@wid 

/*delete all records for web site related data for the member*/
delete from WebSites where websiteId = @wid
delete from WebsiteSubDomains where websiteid=@wid
delete from WebsiteDomains where websiteId=@wid
delete from EvolverApplicationsOwned where websiteId=@wid
delete from EvolverLayouts WHERE layoutId=@lid
delete from WebsiteQueue WHERE memberId=@memberId 
update Members set status=0, deleted=0 WHERE memberId=@memberId

/*add member back to signup queue*/
insert into WebsiteQueue (layoutid, memberId, title, domain, subdomain) VALUES(@lid, @memberId, @title, @domain, @subdomain)
END

GO
/****** Object:  StoredProcedure [dbo].[SetWebsiteSecurity]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9/7/2013 12:20 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[SetWebsiteSecurity] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@pageId int = 0,
	@memberId int = 0,
	@feature nvarchar(25),
	@security nvarchar(200)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF (SELECT COUNT(*) FROM WebsiteSecurity 
		WHERE websiteid=@websiteId 
		AND pageid = CASE WHEN @pageid > 0 THEN @pageid ELSE pageid END
		AND memberid=@memberid AND feature=@feature) = 0
	BEGIN
		INSERT INTO WebsiteSecurity (websiteid, pageid, memberid, feature, security)
		VALUES(@websiteId, @pageId, @memberId, @feature, @security)

	END
	ELSE
	BEGIN
		UPDATE WebsiteSecurity SET security=@security WHERE websiteid=@websiteId 
		AND pageid = CASE WHEN @pageid > 0 THEN @pageid ELSE pageid END
		AND memberid=@memberid AND feature=@feature
	END


END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_AddCategory]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/03/2010 5:40 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_AddCategory] 
	-- Add the parameters for the stored procedure here
	@parentId int = 1, 
	@websiteId int = 0,
	@title nvarchar(25) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @parent hierarchyId,
	@child hierarchyId, @catId int
	IF @parentId = 1
	BEGIN
	-- create a hiearchyId for the web site if it doesn't already exist
		SELECT @parent = hId FROM ApplicationStorefrontProductCategories WHERE catId=@parentId 
		SELECT @child = MAX(hId) FROM ApplicationStorefrontProductCategories WHERE hId.GetAncestor(1)=@parent
		IF @child = @parent BEGIN SET @child = null END
		INSERT INTO ApplicationStorefrontProductCategories (websiteId, hId, title) VALUES(@websiteId, @parent.GetDescendant(@child, null), (SELECT title FROM WebSites WHERE websiteId=@websiteId))
		UPDATE ApplicationStorefrontProductCategories SET hPath=CAST(hId AS nvarchar(200)) WHERE catId=(SELECT MAX(catId) FROM ApplicationStorefrontProductCategories WHERE websiteId=@websiteId)
		SELECT @parentId = MAX(catId) FROM ApplicationStorefrontProductCategories WHERE websiteId=@websiteId
	END
	IF @parentId = 0
	BEGIN
		SELECT TOP 1 @parentId=catId FROM ApplicationStorefrontProductCategories WHERE websiteId=@websiteId ORDER BY catid ASC
	END
	
	SELECT @parent = hId FROM ApplicationStorefrontProductCategories WHERE catId=@parentId 
	SELECT @child = MAX(hId) FROM ApplicationStorefrontProductCategories WHERE hId.GetAncestor(1)=@parent
	IF @child = @parent BEGIN SET @child = null END
	INSERT INTO ApplicationStorefrontProductCategories (websiteId, hId, title, parentid) VALUES(@websiteId, @parent.GetDescendant(@child, null), @title, @parentid)
	SELECT @catId=catid FROM ApplicationStorefrontProductCategories WHERE catId=(SELECT MAX(catId) FROM ApplicationStorefrontProductCategories WHERE websiteId=@websiteId)
	UPDATE ApplicationStorefrontProductCategories SET hPath=CAST(hId AS nvarchar(200)) WHERE catId=@catid
	SELECT catid, hpath, parentid FROM ApplicationStorefrontProductCategories WHERE catId=@catId
	
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_AddUpdateCustomField]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/5/2010 5:27 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_AddUpdateCustomField] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@productId int = 0,
	@fieldId int = 0,
	@type int = 0,
	@name nvarchar(25) = '',
	@value nvarchar(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    IF (SELECT COUNT(*) FROM ApplicationStorefrontProductCustomFields WHERE websiteId=@websiteId AND productId=@productId AND fieldId=@fieldId) > 0
    BEGIN
		UPDATE ApplicationStorefrontProductCustomFields SET value=@value WHERE websiteId=@websiteId AND productId=@productId AND fieldId=@fieldId 
    END
    ELSE
    BEGIN
		INSERT INTO ApplicationStorefrontProductCustomFields (productid, websiteid, fieldid, type, name, value)
		VALUES (@productId, @websiteId, @fieldId, @type, @name, @value)
    END
	
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_FixCategories]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/25/2012 4:51 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_FixCategories] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @hid HIERARCHYID,
	@catid int, @parentid int, @cursor1 CURSOR

	SET @cursor1 = CURSOR FOR
	SELECT catid, hid FROM applicationstorefrontproductcategories
	WHERE websiteid=CASE WHEN @websiteId > 0 THEN @websiteId ELSE websiteid END
	OPEN @cursor1
	FETCH FROM @cursor1 INTO @catid, @hid
	WHILE @@FETCH_STATUS = 0
	BEGIN
	SELECT @parentid=catid FROM applicationstorefrontproductcategories WHERE hid = @hid.GetAncestor(1)
	UPDATE applicationstorefrontproductcategories SET parentId=@parentid WHERE catId=@catid
	FETCH FROM @cursor1 INTO @catid, @hid
	END
	CLOSE @cursor1
	DEALLOCATE @cursor1


END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetCategories]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/30/2010
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetCategories] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@parentId int = 0,
	@hasChildren int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @chid hierarchyid
	IF @parentId = 0
	BEGIN
		SELECT TOP 1 @chid = hid FROM ApplicationStorefrontProductCategories  WHERE websiteId = @websiteId ORDER BY catId ASC
	END
	
	IF @parentId > 0
	BEGIN
		SELECT @chid = hid FROM ApplicationStorefrontProductCategories  WHERE websiteId = @websiteId AND catId=@parentId
	END
	
	
	IF @hasChildren = 0
	BEGIN
		SELECT c.catid, c.title, 0 AS haschildren FROM ApplicationStorefrontProductCategories AS c
		WHERE c.websiteId=@websiteId AND c.hid.GetAncestor(1) = @chid ORDER BY title asc
	END
	
	IF @hasChildren = 1
	BEGIN
		SELECT c.catid, c.title, (
			SELECT TOP 1 COUNT(*) FROM ApplicationStorefrontProductCategories AS c2 WHERE c2.websiteId=@websiteId AND c2.hId.GetAncestor(1) = c.hid
		) AS haschildren FROM ApplicationStorefrontProductCategories AS c
		WHERE c.websiteId=@websiteId AND c.hid.GetAncestor(1) = @chid ORDER BY c.hPath ASC, c.title ASC
	END
	
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetCategoryBreadCrumb]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/7/2012 9:05 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetCategoryBreadCrumb] 
	-- Add the parameters for the stored procedure here
	@websiteId int,
	@catId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @hId hierarchyId
	SELECT @hId=hid FROM ApplicationStorefrontProductCategories WHERE websiteid=@websiteid AND catId=@catid
	SELECT catId, title FROM ApplicationStorefrontProductCategories 
	WHERE @hId.IsDescendantOf(hId) = 1 OR catId=@catId ORDER BY catId ASC
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetCategoryPath]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/3/2010 7:42 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetCategoryPath] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@catId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	DECLARE @index int = 0,
	@pos int,
	@NextPos int = -1,
	@path nvarchar(250),
	@newPath nvarchar(250),
	@cid int,
	@title nvarchar(50),
	@hpath nvarchar(250)
	
	DECLARE @tbl TABLE(
	catid int,
	title nvarchar(50),
	hpath nvarchar(250)
	)

	SELECT @path = hPath FROM ApplicationStorefrontProductCategories WHERE websiteId=@websiteId AND catId=@catId
	SET @pos = charindex('/',@path)

	WHILE (@pos <> @NextPos AND @pos <> 0 AND @NextPos <> 0)
	BEGIN
		SET @index = @index + 1
		SET @NextPos = @pos
		SET @newPath = substring(@path,1,@pos+1)
		SET @pos = charindex('/',@path,@NextPos+1)
		IF @index > 2 AND @newPath <> @path
		BEGIN
			SELECT @cid=catId, @title=title, @hpath=hpath FROM ApplicationStorefrontProductCategories WHERE websiteId=@websiteId AND hpath=@newPath + '/'
			INSERT INTO @tbl (catid, title, hpath) VALUES(@cid, @title, @newPath)
		END
	END 
	SELECT * FROM @tbl ORDER BY catid ASC
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetCustomers]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/10/2012 10:50 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetCustomers] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@start int = 0,
	@length int = 10,
	@keywords nvarchar(25) = '',
	@orderby int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @tmpTable AS TABLE(
		customerId int,
		billTotalPrice float,
		billName nvarchar(50),
		billEmail nvarchar(100),
		orders int
		)
		
	DECLARE @customerId int,
		@billtotalprice float,
		@billname nvarchar(50),
		@billemail nvarchar(100)
	
	DECLARE @cursor CURSOR,
		@lastCustomer nvarchar(MAX)
		
	SET @cursor = CURSOR FOR 
	SELECT customerId, billtotalprice, billname, billemail 
	FROM ApplicationStorefrontOrders 
	WHERE websiteId=@websiteId 
	AND (
		billname LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE billname END
		OR billEmail LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE billEmail END
		OR billCity LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE billCity END
	)
	ORDER BY customerId ASC, billEmail ASC, billName ASC, billCity ASC, billState ASC
	OPEN @cursor
	FETCH FROM @cursor INTO @customerId, @billtotalprice, @billname, @billemail
	WHILE @@FETCH_STATUS = 0
	BEGIN
		IF @lastCustomer = @billname + @billemail
		BEGIN
			UPDATE @tmpTable SET orders += 1, billTotalPrice+=@billtotalprice WHERE billEmail=@billemail 
		END
		ELSE
		BEGIN
			INSERT INTO @tmpTable (customerId, billTotalPrice, billName, billEmail, orders)
				VALUES (@customerId, @billtotalprice, @billname, @billemail, 1)
			SET @lastCustomer = @billname + @billemail
		END
		FETCH FROM @cursor INTO @customerId, @billtotalprice, @billname, @billemail
	END
	CLOSE @cursor
	DEALLOCATE @cursor
	
	SELECT * FROM @tmpTable ORDER BY
		CASE WHEN @orderby = 0 THEN billname END ASC,
		CASE WHEN @orderby = 1 THEN billname END DESC,
		CASE WHEN @orderby = 2 THEN billTotalPrice END ASC,
		CASE WHEN @orderby = 3 THEN billTotalPrice END DESC,
		CASE WHEN @orderby = 4 THEN orders END ASC,
		CASE WHEN @orderby = 5 THEN orders END DESC
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetCustomFieldsForProductTemplate]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/2/2010 8:30 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetCustomFieldsForProductTemplate] 
	-- Add the parameters for the stored procedure here
	@templateId int = 0,
	@websiteId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT fieldid INTO #fieldIds FROM ApplicationStorefrontProductTemplateItems WHERE templateid=@templateId
	SELECT * FROM ApplicationStorefrontCustomFields WHERE websiteid=@websiteId AND fieldId IN (SELECT * FROM #fieldIds)
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetOrders]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetOrders]
-- Add the parameters for the stored procedure here
	@start int = 1,
	@length int = 10,
	@websiteId int = 0,
	@daterange1 date, 
	@daterange2 date, 
	@customerId int = 0,
	@billEmail nvarchar(100) = '',
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT *
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.websiteId END DESC,
	CASE WHEN @orderby = 1 THEN p.datecreated END ASC,
	CASE WHEN @orderby = 2 THEN p.datecreated END DESC,
	CASE WHEN @orderby = 3 THEN p.billTotalPrice END ASC,
	CASE WHEN @orderby = 4 THEN p.billTotalPrice END DESC
	) as rownum, p.*
	FROM ApplicationStorefrontOrders AS p
	WHERE 
	p.websiteId = CASE WHEN @websiteId > 0 THEN @websiteId ELSE p.websiteId END	
	AND (p.datecreated >= @daterange1 And p.datecreated <= @daterange2)
	AND (p.customerId = CASE WHEN @customerId > 0 THEN @customerId ELSE p.customerId END)
	AND (p.billEmail = CASE WHEN @billEmail <> '' THEN @billEmail ELSE p.billEmail END)
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetOrdersForChart]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetOrdersForChart]
-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@daterange1 datetime, 
	@daterange2 datetime
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT websiteId, orderId, billPrice, datecreated FROM ApplicationStorefrontOrders AS p
	WHERE 
	p.websiteId = CASE WHEN @websiteId > 0 THEN @websiteId ELSE p.websiteId END	
	AND (p.datecreated Between @daterange1 And @daterange2)
	
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_GetProductList]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/24/2010 5:53 PM
-- Description:	Get Product List from Storefront
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_GetProductList] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0,
	@start int = 1, 
	@length int = 10,
	@search nvarchar(MAX) = '',
	@categoryId int = 0,
	@productId int = 0,
	@orderby int = 1
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	SELECT catId, hPath INTO #tblCats FROM ApplicationStorefrontProductCategories WHERE websiteId = @websiteId

    -- Insert statements for procedure here
	SELECT * FROM (SELECT ROW_NUMBER() OVER(ORDER BY
	CASE WHEN @orderby = 1 THEN p.title END ASC,
	CASE WHEN @orderby = 2 THEN p.title END DESC,
	CASE WHEN @orderby = 3 THEN p.price END ASC,
	CASE WHEN @orderby = 4 THEN p.price END DESC,
	CASE WHEN @orderby = 5 THEN p.saleprice END ASC,
	CASE WHEN @orderby = 6 THEN p.saleprice END DESC,
	CASE WHEN @orderby = 7 THEN p.quantity END ASC,
	CASE WHEN @orderby = 8 THEN p.quantity END DESC,
	CASE WHEN @orderby = 9 THEN p.sold END ASC,
	CASE WHEN @orderby = 10 THEN p.sold END DESC,
	CASE WHEN @orderby = 11 THEN p.datecreated END ASC,
	CASE WHEN @orderby = 12 THEN p.datecreated END DESC,
	CASE WHEN @orderby = 13 THEN p.enabled END ASC,
	CASE WHEN @orderby = 14 THEN p.enabled END DESC
	) AS rownum, 
	p.productId, p.catId, p.title, p.price, p.saleprice, 
	p.sale, p.quantity, p.sold, p.datecreated, p.photos, p.summary, 
	p.description, p.approved, p.enabled, p.deleted, p.shippable  
	FROM ApplicationStorefrontProducts AS p
	
	WHERE p.websiteId=@websiteId 
	
	AND
	
	p.catId = CASE WHEN @categoryId > 0 THEN
		CASE WHEN p.catId IN
			(SELECT pc.catId FROM #tblCats AS pc WHERE pc.hPath LIKE 
			(SELECT pc2.hPath FROM ApplicationStorefrontProductCategories pc2
			WHERE pc2.catId=@categoryId) + '%')
		THEN 
			p.catId
		ELSE 
			-1
		END
	ELSE 
		p.catId
	END
	
	AND
	
	p.productId = CASE WHEN @productId > 0 THEN
		@productId
	ELSE 
		p.productId
	END
	
	AND 
	
	(p.title =
	CASE WHEN @search <> '' THEN
		 CASE WHEN p.title LIKE '%' + @search + '%'	THEN
		 p.title
		 ELSE
		 ''
		 END
	ELSE
		p.title
	END
	
	)
	
	) AS myTbl
	WHERE rownum >= @start AND rownum < (@start + @length)
END

GO
/****** Object:  StoredProcedure [dbo].[Storefront_RemoveCategory]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/3/2010 1:20 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Storefront_RemoveCategory] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@catId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- get the path of the selected category
	DECLARE @path nvarchar(200) = ''
	SELECT @path = c.hPath FROM ApplicationStorefrontProductCategories c WHERE websiteId=@websiteId AND catId=@catId
	
	-- remove catId from all products within the category & sub categories
	UPDATE ApplicationStorefrontProducts SET catId=0 
	WHERE websiteid=@websiteId AND catId IN (SELECT c.catId FROM ApplicationStorefrontProductCategories c WHERE c.websiteId=@websiteId AND c.hPath LIKE @path + '%')
	
	-- delete category & all sub categories
	DELETE FROM ApplicationStorefrontProductCategories WHERE websiteId=@websiteId AND hPath LIKE @path + '%'
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateAccountInfo]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 4/28/2012 1:43 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[UpdateAccountInfo] 
	-- Add the parameters for the stored procedure here
	@memberid int = 0,
	@firstname nvarchar(25) = '', 
	@lastname nvarchar(25) = '',
	@email nvarchar(75) = '',
	@gender smallint = 1,
	@bday datetime,
	@zipcode nvarchar(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE Members SET firstname=@firstname, lastname=@lastname, gender=@gender, bday=@bday, zipcode=@zipcode WHERE memberId=@memberid
	IF @email <> ''
	BEGIN
		UPDATE Members SET email=@email WHERE memberId=@memberid
	END
	
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateColorScheme]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 9:07 AM 11/22/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[UpdateColorScheme] 
	-- Add the parameters for the stored procedure here
	@schemeId int = 0, 
	@colorsortbody nvarchar(6) = '',
	@colorsort nvarchar(6) = '',
	@colors nvarchar(MAX) = '',
	@colorR int = 0,
	@colorG int = 0,
	@colorB int = 0,
	@colorBodyR int = 0,
	@colorBodyG int = 0,
	@colorBodyB int = 0,
	@intsort int = 0,
	@intsortbody int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE ColorSchemes SET colorsortbody=@colorsortbody, colorsort=@colorsort, colors=@colors,
	colorR=@colorR, colorG=@colorG, colorB=@colorB, colorBodyR=@colorBodyR, colorBodyG=@colorBodyG, colorBodyB=@colorBodyB,
	intsort=@intsort,intsortbody=@intsortbody
	WHERE schemeid=@schemeId
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateLayoutForWebSite]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/27/2012
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[UpdateLayoutForWebSite] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@layoutId int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE WebSites SET layoutId=@layoutId WHERE websiteId=@websiteId
	UPDATE Pages SET layoutId=@layoutId WHERE websiteId=@websiteId 
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateMemberInfo]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/9/2012 3:45 PM
-- Description:	
-- =============================================
create PROCEDURE [dbo].[UpdateMemberInfo] 
	-- Add the parameters for the stored procedure here
	@memberId int = 0, 
	@firstname nvarchar(25) = '',
	@lastname nvarchar(25) = '',
	@gender bit = 0,
	@bday date,
	@zipcode nvarchar(11)=''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE Members SET firstname=@firstname, lastname=@lastname, gender=@gender, bday=@bday, zipcode=@zipcode WHERE memberId=@memberId 
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateNewsLetter]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UpdateNewsLetter]
	-- Add the parameters for the stored procedure here
	@newsletterId int = 0,
	@title varchar(100)
AS
BEGIN
	Update ApplicationNewsLetter Set title = @title Where newsletterId = @newsletterId
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateNewsLetterCampaign]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UpdateNewsLetterCampaign]
	-- Add the parameters for the stored procedure here
	@campaignId int = 0,
	@newsletterId int = 0,
	@subject varchar(100),
	@body varchar(max)
AS
BEGIN
	Update ApplicationNewsLetterCampaigns Set subject = @subject, body = @body Where campaignId = @campaignId
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateNewsLetterCustomField]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UpdateNewsLetterCustomField]
	-- Add the parameters for the stored procedure here
	@fieldId int,
	@type int,
	@name nvarchar(125),
	@value nvarchar(MAX),
	@isrequired bit
AS
BEGIN
	Update ApplicationNewsLetterCustomFields Set type = @type, name = @name, value = @value, isrequired = @isrequired Where fieldId = @fieldId
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateNewsLetterCustomFieldSortBy]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UpdateNewsLetterCustomFieldSortBy]
	-- Add the parameters for the stored procedure here
	@fieldId int,
	@newsletterId int,
	@sortorder int
AS
BEGIN
	Declare @currentsortby int, @abovefieldId int, @belowfieldid int
	
	--Move field up
	If @sortorder = 0 
	Begin
		Set @currentsortby = (Select sortby from ApplicationNewsLetterCustomFields Where fieldid = @fieldId)
	    Set @abovefieldId = (Select fieldid from ApplicationNewsLetterCustomFields Where sortby = (@currentsortby - 1) And newsletterId = @newsletterId)

		--Subtract 1 from current sort by field
		IF (@currentsortby - 1) >= 0
		Begin
			Update ApplicationNewsLetterCustomFields Set sortby = (@currentsortby - 1) Where fieldId = @fieldId
		End
		
		--Add 1 to above sort by field
		Update ApplicationNewsLetterCustomFields Set sortby = (@currentsortby) Where fieldid = @abovefieldId
	End
	
	--Move field down
	If @sortorder = 1
	Begin
		Set @currentsortby = (Select sortby from ApplicationNewsLetterCustomFields Where fieldid = @fieldId)
	    Set @belowfieldid = (Select fieldid from ApplicationNewsLetterCustomFields Where sortby = (@currentsortby + 1) And newsletterId = @newsletterId)

		--Add 1 to current sort by field
		Update ApplicationNewsLetterCustomFields Set sortby = (@currentsortby + 1) Where fieldId = @fieldId

		--Subtract 1 from above sort by field
		Update ApplicationNewsLetterCustomFields Set sortby = (@currentsortby) Where fieldid = @belowfieldid
	End
END

GO
/****** Object:  StoredProcedure [dbo].[UpdatePageHit]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 3/15/2009 11:06 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[UpdatePageHit] 
	-- Add the parameters for the stored procedure here
	@ip1 tinyint = 0,
	@ip2 tinyint = 0,
	@ip3 tinyint = 0,
	@ip4 tinyint = 0,
	@location tinyint = 0,
	@browser tinyint = 0,
	@bversion tinyint = 0,
	@os tinyint = 0,
	@osversion tinyint = 0, 
	@pageid int = 0,
	@memberid int = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    DECLARE  @pagecount int, @lasthit date
    SELECT @pagecount=COUNT(*) FROM pages_log WHERE datecreated=(CONVERT(nvarchar(2),MONTH(GETDATE())) + '\' + CONVERT(nvarchar(2),DAY(GETDATE())) + '\' + CONVERT(nvarchar(2),YEAR(GETDATE()) + '\')) AND pageid=@pageid AND ip1=@ip1 AND ip2=@ip2 AND ip3=@ip3
    IF @pagecount = 0
    BEGIN
		INSERT INTO pages_log (pageid, memberid, location, ip1, ip2, ip3, ip4, 
		browser, bversion, os, osversion, datecreated)
		VALUES(@pageid, @memberid, @location, @ip1, @ip2, @ip3, @ip4, @browser, 
		@bversion, @os, @osversion, GETDATE())
    
		SELECT @lasthit=lasthit FROM Pages WHERE pageId=@pageid
		IF YEAR(@lasthit) <> YEAR(GetDate()) OR MONTH(@lasthit) <> MONTH(GetDate()) OR DAY(@lasthit) <> DAY(GetDate())
		BEGIN
			UPDATE pages SET lasthitip=@ip1 + '.' + @ip2 + '.' + @ip3 + '.' + @ip4, lasthit=GETDATE(), hitstoday=1, hitstotal=hitstotal + 1 WHERE pageid=@pageId
		END
		ELSE
		BEGIN
			UPDATE pages SET lasthitip=@ip1 + '.' + @ip2 + '.' + @ip3 + '.' + @ip4, lasthit=GETDATE(), hitstoday=hitstoday + 1, hitstotal=hitstotal + 1 WHERE pageid=@pageId
		END
    END
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateWebsiteTitle]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/7/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[UpdateWebsiteTitle] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@title nvarchar(100) = ''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	DECLARE @myPageId char(10),
	@myTitle nvarchar(250),
	@cursor1 CURSOR,
	@wTitle nvarchar(100)
	
	SELECT @wTitle = title FROM WebSites WHERE websiteId=@websiteId 
	
	SET @cursor1 = CURSOR FOR
	SELECT pageid, title FROM pages WHERE websiteid=@websiteId
	OPEN @cursor1
	FETCH FROM @cursor1 INTO
	@myPageId, @myTitle
	
	
	WHILE @@FETCH_STATUS = 0
	BEGIN
		UPDATE Pages SET title=@title + ' - ' + REPLACE(@myTitle, @wTitle + ' - ', '') WHERE pageid=@myPageId
		
		FETCH FROM @cursor1 INTO
		@myPageId, @myTitle
	END

	UPDATE websites SET title=@title WHERE websiteId = @websiteId
END

GO
/****** Object:  StoredProcedure [dbo].[UpdateWebsiteTrial]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/11/2014 6:30 pm
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[UpdateWebsiteTrial] 
	-- Add the parameters for the stored procedure here
	@websiteId int = 0, 
	@ownerId int = 0,
	@customerId nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE websites SET trial=0, customerId=@customerId WHERE websiteid=@websiteId AND ownerid=@ownerId
END

GO
/****** Object:  UserDefinedFunction [dbo].[GetPagePath]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/9/2015 3:44 AM
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[GetPagePath] 
(
	@pageId int
)
RETURNS nvarchar(MAX)
AS
BEGIN
	DECLARE 
		@Result nvarchar(MAX),
		@title nvarchar(250),
		@pageTitle nvarchar(250),
		@parentId int = 0

	SELECT @title=title, @parentId=parentId FROM pages WHERE pageid=@pageId 
	SELECT @pageTitle = value FROM dbo.SplitArray(@title,' - ') WHERE Position=2
	
	IF @parentId is not null AND @parentId > 0 BEGIN
		DECLARE @parentTitle nvarchar(250)
		SELECT @parentTitle=title FROM pages WHERE pageid=@parentId 
		SET @Result = dbo.GetPagePath(@parentId) + '/' + REPLACE(@title, @parentTitle, '')
	END 
	ELSE BEGIN
		SET @Result = @pageTitle
	END

	-- Return the result of the function
	RETURN @Result

END

GO
/****** Object:  UserDefinedFunction [dbo].[GetPagePathIds]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/9/2015 11:42 PM
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[GetPagePathIds] 
(
	@pageId int
)
RETURNS nvarchar(MAX)
AS
BEGIN
	DECLARE 
		@Result nvarchar(MAX),
		@parentId int = 0

	SELECT @parentId=parentId FROM pages WHERE pageid=@pageId 
	
	IF @parentId is not null AND @parentId > 0 BEGIN
		SET @Result = dbo.GetPagePathIds(@parentId) + '/' + CONVERT(nvarchar(MAX), @pageId)
	END 
	ELSE BEGIN
		SET @Result = CONVERT(nvarchar(MAX), @pageId)
	END

	-- Return the result of the function
	RETURN @Result

END

GO
/****** Object:  UserDefinedFunction [dbo].[SplitArray]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE   function [dbo].[SplitArray] 
 (
 @text  varchar(8000)
 ,@delimiter varchar(100) = ',' --default to comma delimited.
 )
RETURNS @retTable TABLE 
 (
  Position  int identity(1,1)
 ,valueInt int 
 ,valueNum Numeric(18,3)
 ,value varchar(2000)
 )
AS
/*
********************************************************************************
Purpose: Parse values from a delimited string
  & return the result as an indexed table
Copyright 1996, 1997, 2000, 2003 Clayton Groom (<A href="mailto:Clayton_Groom@hotmail.com">Clayton_Groom@hotmail.com</A>)
Posted to the public domain Aug, 2004
06-17-03 Rewritten as SQL 2000 function.
 Reworked to allow for delimiters > 1 character in length 
 and to convert Text values to numbers
********************************************************************************
*/
BEGIN
 DECLARE @w_Continue  int
  ,@w_StartPos  int
  ,@w_Length  int
  ,@w_Delimeter_pos int
  ,@w_tmp_int  int
  ,@w_tmp_num  numeric(18,3)
  ,@w_tmp_txt   varchar(2000)
  ,@w_Delimeter_Len tinyint
 if len(@text) = 0
 begin
  SET  @w_Continue = 0 -- force early exit
 end 
 else
 begin
 -- parse the original @text array into a temp table
  SET  @w_Continue = 1
  SET @w_StartPos = 1
  SET @text = RTRIM( LTRIM( @text))
  SET @w_Length   = DATALENGTH( RTRIM( LTRIM( @text)))
  SET @w_Delimeter_Len = len(@delimiter)
 end
 WHILE @w_Continue = 1
 BEGIN
  SET @w_Delimeter_pos = CHARINDEX( @delimiter
      ,(SUBSTRING( @text, @w_StartPos
      ,((@w_Length - @w_StartPos) + @w_Delimeter_Len)))
      )
 
  IF @w_Delimeter_pos > 0  -- delimeter(s) found, get the value
  BEGIN
   SET @w_tmp_txt = LTRIM(RTRIM( SUBSTRING( @text, @w_StartPos 
        ,(@w_Delimeter_pos - 1)) ))
   if isnumeric(@w_tmp_txt) = 1
   begin
    set @w_tmp_int = cast( cast(@w_tmp_txt as numeric) as int)
    set @w_tmp_num = cast( @w_tmp_txt as numeric(18,3))
   end
   else
   begin
    set @w_tmp_int =  null
    set @w_tmp_num =  null
   end
   SET @w_StartPos = @w_Delimeter_pos + @w_StartPos + (@w_Delimeter_Len- 1)
  END
  ELSE -- No more delimeters, get last value
  BEGIN
   SET @w_tmp_txt = LTRIM(RTRIM( SUBSTRING( @text, @w_StartPos 
      ,((@w_Length - @w_StartPos) + @w_Delimeter_Len)) ))
   if isnumeric(@w_tmp_txt) = 1
   begin
    set @w_tmp_int = cast( cast(@w_tmp_txt as numeric) as int)
    set @w_tmp_num = cast( @w_tmp_txt as numeric(18,3))
   end
   else
   begin
    set @w_tmp_int =  null
    set @w_tmp_num =  null
   end
   SELECT @w_Continue = 0
  END
  INSERT INTO @retTable VALUES( @w_tmp_int, @w_tmp_num, @w_tmp_txt )
 END
RETURN
END

GO
/****** Object:  Table [dbo].[Backgrounds]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Backgrounds](
	[backgroundId] [int] NOT NULL,
	[ownerId] [int] NULL,
	[name] [nvarchar](50) NULL,
	[asort] [int] NULL,
	[colorsortbody] [nvarchar](6) NULL,
	[colorsort] [nvarchar](6) NULL,
	[intsortbody] [int] NULL,
	[intsort] [int] NULL,
	[background] [nvarchar](25) NULL,
	[colors] [nvarchar](250) NULL,
	[datecreated] [datetime] NULL,
	[datesaved] [datetime] NULL,
	[datepublished] [datetime] NULL,
	[colorR] [int] NULL,
	[colorG] [int] NULL,
	[colorB] [int] NULL,
	[colorbodyR] [int] NULL,
	[colorbodyG] [int] NULL,
	[colorbodyB] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ColorSchemes]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ColorSchemes](
	[schemeId] [int] NOT NULL,
	[ownerId] [int] NULL,
	[name] [nvarchar](50) NULL,
	[colorsortbody] [nvarchar](6) NULL,
	[colorsort] [nvarchar](6) NULL,
	[intsortbody] [int] NULL,
	[intsort] [int] NULL,
	[colors] [nvarchar](max) NULL,
	[datecreated] [datetime] NULL,
	[datesaved] [datetime] NULL,
	[datepublished] [datetime] NULL,
	[published] [bit] NULL,
	[colorR] [int] NULL,
	[colorG] [int] NULL,
	[colorB] [int] NULL,
	[colorbodyR] [int] NULL,
	[colorbodyG] [int] NULL,
	[colorbodyB] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Dashboards]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dashboards](
	[websiteId] [int] NULL,
	[orderby] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ErrorLog]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ErrorLog](
	[dateCreated] [datetime] NULL,
	[errorNumber] [int] NULL,
	[memberId] [int] NULL,
	[param1] [nvarchar](max) NULL,
	[param2] [nvarchar](max) NULL,
	[param3] [nvarchar](max) NULL,
	[param4] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverApplicationComponentCategories]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverApplicationComponentCategories](
	[applicationId] [int] NULL,
	[componentcategory] [int] NULL,
	[title] [nvarchar](25) NULL,
	[description] [nvarchar](100) NULL,
	[icon] [nvarchar](50) NULL,
	[orderby] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverApplications]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverApplications](
	[applicationId] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](25) NULL,
	[name] [nvarchar](15) NULL,
	[price] [float] NULL,
	[pricetype] [int] NULL,
	[description] [nvarchar](200) NULL,
	[datecreated] [datetime] NULL,
	[orderindex] [int] NULL,
	[url] [nvarchar](100) NULL,
	[componentcategory] [int] NULL,
	[mobileapp] [bit] NULL,
	[approved] [bit] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverApplicationsOwned]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverApplicationsOwned](
	[ownerId] [int] NULL,
	[applicationId] [int] NULL,
	[websiteId] [int] NULL,
	[price] [float] NULL,
	[pricetype] [int] NULL,
	[datecreated] [datetime] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverApplicationsPages]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverApplicationsPages](
	[websiteId] [int] NULL,
	[applicationId] [int] NULL,
	[pages] [nvarchar](50) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverApplicationsPayments]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverApplicationsPayments](
	[ownerId] [int] NULL,
	[applicationId] [int] NULL,
	[price] [float] NULL,
	[pricetype] [int] NULL,
	[datecreated] [datetime] NULL,
	[payment] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverComponents]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverComponents](
	[componentId] [nvarchar](25) NOT NULL,
	[memberId] [int] NULL,
	[title] [nvarchar](25) NULL,
	[tags] [nvarchar](100) NULL,
	[category] [int] NULL,
	[description] [nvarchar](250) NULL,
	[datecreated] [datetime] NULL,
	[cindex] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverLayouts]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverLayouts](
	[layoutId] [int] NOT NULL,
	[memberId] [int] NULL,
	[designId] [int] NULL,
	[schemeId] [int] NULL,
	[title] [nvarchar](50) NULL,
	[tagwords] [nvarchar](200) NULL,
	[galaxyId] [int] NULL,
	[price] [float] NULL,
	[rating] [int] NULL,
	[ratingcount] [int] NULL,
	[ratingtotal] [int] NULL,
	[datecreated] [datetime] NULL,
	[approved] [bit] NULL,
	[private] [bit] NULL,
	[enabled] [bit] NULL,
	[deleted] [bit] NULL,
	[license] [bit] NULL,
	[licensetype] [smallint] NULL,
	[description] [nvarchar](200) NULL,
	[saleapproved] [bit] NULL,
	[parentlayoutId] [int] NULL,
	[tempWebsiteId] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[EvolverLayoutsOwned]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EvolverLayoutsOwned](
	[memberId] [int] NULL,
	[layoutId] [int] NULL,
	[price] [float] NULL,
	[datecreated] [datetime] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Feedback]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feedback](
	[feedbackId] [int] IDENTITY(1,1) NOT NULL,
	[ftype] [int] NULL,
	[email] [nvarchar](100) NULL,
	[datecreated] [datetime] NULL,
	[feedback] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Log]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Log](
	[websiteid] [int] NULL,
	[pageid] [int] NULL,
	[loadtime] [float] NULL,
	[ajax] [bit] NULL,
	[visitorId] [nvarchar](5) NULL,
	[memberid] [int] NULL,
	[ipaddress] [nvarchar](25) NULL,
	[domain] [nvarchar](50) NULL,
	[url] [nvarchar](200) NULL,
	[agent] [nvarchar](200) NULL,
	[referrer] [nvarchar](200) NULL,
	[firstvisit] [bit] NULL,
	[components] [int] NULL,
	[apps] [int] NULL,
	[interfaces] [int] NULL,
	[sqlqueries] [int] NULL,
	[ctext] [int] NULL,
	[cphotos] [int] NULL,
	[cgalleries] [int] NULL,
	[cpanels] [int] NULL,
	[cmenus] [int] NULL,
	[datecreated] [datetime] NULL,
	[editor] [bit] NULL,
	[store] [bit] NULL,
	[blog] [bit] NULL,
	[dash] [bit] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[LogAnalytics]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogAnalytics](
	[websiteId] [int] NULL,
	[pageId] [int] NULL,
	[countryCode] [nvarchar](3) NULL,
	[agent] [nvarchar](200) NULL,
	[referrer] [nvarchar](200) NULL,
	[logYear] [smallint] NULL,
	[logMonth] [smallint] NULL,
	[logDay] [smallint] NULL,
	[dateModified] [datetime] NULL,
	[totalViews] [int] NULL,
	[totalBots] [int] NULL,
	[totalLoadTime] [float] NULL,
	[avgLoadTime] [float] NULL,
	[totalAjax] [int] NULL,
	[totalVisitors] [int] NULL,
	[maxVisitorViews] [int] NULL,
	[avgVisitorViews] [float] NULL,
	[totalMembers] [int] NULL,
	[maxMemberViews] [int] NULL,
	[avgMemberViews] [float] NULL,
	[bounceRate] [float] NULL,
	[totalComponents] [float] NULL,
	[avgComponents] [float] NULL,
	[totalApps] [float] NULL,
	[avgApps] [float] NULL,
	[totalInterfaces] [float] NULL,
	[avgInterfaces] [float] NULL,
	[totalSqlQueries] [float] NULL,
	[avgSqlQueries] [float] NULL,
	[totalCtext] [float] NULL,
	[avgCtext] [float] NULL,
	[totalCphotos] [float] NULL,
	[avgCphotos] [float] NULL,
	[totalCgalleries] [float] NULL,
	[avgCgalleries] [float] NULL,
	[totalCpanels] [float] NULL,
	[avgCpanels] [float] NULL,
	[totalCmenus] [float] NULL,
	[avgCmenus] [float] NULL,
	[totalEditor] [int] NULL,
	[totalDash] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Login]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Login](
	[datecreated] [datetime] NULL,
	[loginid] [nvarchar](10) NULL,
	[email] [nvarchar](100) NULL,
	[hash] [nvarchar](100) NULL,
	[ip] [nvarchar](36) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Members]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Members](
	[memberId] [int] NOT NULL,
	[firstname] [nvarchar](25) NULL,
	[lastname] [nvarchar](25) NULL,
	[email] [nvarchar](75) NOT NULL,
	[password] [nvarchar](100) NOT NULL,
	[displayname] [nvarchar](25) NOT NULL,
	[photo] [nvarchar](30) NULL,
	[profilepage] [int] NULL,
	[keepalive] [datetime] NULL,
	[quote] [nvarchar](50) NULL,
	[gender] [smallint] NOT NULL,
	[bday] [datetime] NOT NULL,
	[zipcode] [nvarchar](10) NULL,
	[city] [nvarchar](25) NULL,
	[state] [nvarchar](2) NULL,
	[country] [nvarchar](3) NULL,
	[stripeCustomerId] [nvarchar](25) NULL,
	[twitter] [nvarchar](25) NULL,
	[friends] [int] NULL,
	[lastlogin] [datetime] NULL,
	[datecreated] [datetime] NOT NULL,
	[status] [int] NOT NULL,
	[signupip] [nvarchar](15) NULL,
	[referrer] [nvarchar](250) NULL,
	[activation] [nchar](20) NULL,
	[deleted] [bit] NULL,
	[started] [bit] NULL,
	[defaultcp] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[PageInterfaces]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PageInterfaces](
	[interfaceId] [int] NOT NULL,
	[parentId] [int] NULL,
	[websiteId] [int] NULL,
	[title] [nvarchar](25) NULL,
	[description] [nvarchar](50) NULL,
	[datecreated] [datetime] NULL,
	[datemodified] [datetime] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Pages]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pages](
	[pageId] [int] NOT NULL,
	[ownerId] [int] NULL,
	[galaxyId] [int] NULL,
	[layoutId] [int] NULL,
	[websiteId] [int] NULL,
	[interfaceId] [int] NULL,
	[parentId] [int] NULL,
	[templateId] [int] NULL,
	[schemeId] [int] NULL,
	[title] [nvarchar](250) NULL,
	[path] [nvarchar](max) NULL,
	[pathIds] [nvarchar](max) NULL,
	[tagwords] [nvarchar](1) NULL,
	[photo] [nvarchar](100) NULL,
	[datecreated] [datetime] NOT NULL,
	[datemodified] [datetime] NULL,
	[datefirstpublished] [datetime] NULL,
	[datepublished] [datetime] NULL,
	[favorite] [bit] NULL,
	[security] [bit] NULL,
	[membersonly] [int] NULL,
	[published] [bit] NULL,
	[istemplate] [bit] NULL,
	[enabled] [bit] NULL,
	[deleted] [bit] NULL,
	[dev] [bit] NULL,
	[lasthit] [datetime] NULL,
	[lasthitip] [nvarchar](15) NULL,
	[hitstoday] [int] NULL,
	[hitstotal] [int] NULL,
	[rating] [int] NULL,
	[ratingtotal] [int] NULL,
	[ratedcount] [int] NULL,
	[breadcrumb] [nvarchar](250) NULL,
	[background] [nvarchar](250) NULL,
	[CSS] [nvarchar](max) NULL,
	[description] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[PasswordReset]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PasswordReset](
	[resetId] [nvarchar](10) NULL,
	[email] [nvarchar](50) NULL,
	[datecreated] [datetime] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Screenshots]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Screenshots](
	[auth] [nvarchar](20) NULL,
	[websiteid] [int] NULL,
	[expire] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Timeline]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Timeline](
	[timelineId] [nvarchar](10) NOT NULL,
	[memberId] [int] NULL,
	[websiteId] [int] NULL,
	[datecreated] [datetime] NULL,
	[title] [nvarchar](255) NULL,
	[url] [nvarchar](255) NULL,
	[photo] [nvarchar](255) NULL,
	[summary] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[WebsiteDomains]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[WebsiteDomains](
	[websiteId] [int] NULL,
	[domain] [nvarchar](50) NULL,
	[homepage] [int] NULL,
	[datecreated] [datetime] NULL,
	[googletoken] [varchar](max) NULL,
	[googleprofileId] [varchar](20) NULL,
	[googlewebpropertyId] [varchar](20) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[WebsiteQueue]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebsiteQueue](
	[memberId] [int] NULL,
	[domain] [nvarchar](50) NULL,
	[title] [nvarchar](50) NULL,
	[subdomain] [nvarchar](50) NULL,
	[layoutid] [int] NULL,
	[customerId] [nvarchar](50) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[WebSites]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebSites](
	[websiteId] [int] NOT NULL,
	[ownerId] [int] NULL,
	[galaxyId] [int] NULL,
	[title] [nvarchar](100) NULL,
	[url] [nvarchar](25) NULL,
	[icon] [bit] NULL,
	[pagetemplate] [int] NULL,
	[pagehome] [int] NULL,
	[pagelogin] [int] NULL,
	[pagedash] [int] NULL,
	[pageabout] [int] NULL,
	[pagecontact] [int] NULL,
	[pagesupport] [int] NULL,
	[page404] [int] NULL,
	[pagedenied] [int] NULL,
	[layoutId] [int] NULL,
	[designId] [int] NULL,
	[schemeId] [int] NULL,
	[dateCreated] [datetime] NULL,
	[websitetype] [smallint] NULL,
	[templatetype] [smallint] NULL,
	[license] [bit] NULL,
	[licensetype] [smallint] NULL,
	[price] [float] NULL,
	[saleapproved] [bit] NULL,
	[enabled] [bit] NULL,
	[deleted] [bit] NULL,
	[devlayoutId] [int] NULL,
	[trial] [bit] NULL,
	[share] [nvarchar](3) NULL,
	[customerId] [nvarchar](50) NULL,
	[background] [nvarchar](250) NULL,
	[CSS] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[WebsiteSecurity]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebsiteSecurity](
	[websiteId] [int] NULL,
	[pageId] [int] NULL,
	[memberId] [int] NULL,
	[feature] [nvarchar](50) NULL,
	[security] [nvarchar](200) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[WebsiteSubDomains]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebsiteSubDomains](
	[websiteId] [int] NULL,
	[subdomain] [nvarchar](25) NULL,
	[domain] [nvarchar](25) NULL,
	[datecreated] [datetime] NULL
) ON [PRIMARY]

GO
/****** Object:  UserDefinedFunction [dbo].[FindInStoredProc]    Script Date: 6/17/2015 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/9/2015 4:10 am
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[FindInStoredProc] 
(	
	-- Add the parameters for the function here
	@search nvarchar(250)
)
RETURNS TABLE 
AS
RETURN 
(
	-- Add the SELECT statement with parameter references here
	SELECT DISTINCT 
       o.name AS Object_Name,
       o.type_desc
  FROM sys.sql_modules m 
       INNER JOIN 
       sys.objects o 
         ON m.object_id = o.object_id
 WHERE m.definition Like '%'+@search+'%'
)

GO
