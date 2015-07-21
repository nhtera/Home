CREATE TABLE [dbo].[WebsiteSubDomains] (
    [websiteId]   INT           NOT NULL,
    [subdomain]   NVARCHAR (25) NOT NULL,
    [domain]      NVARCHAR (25) NOT NULL,
    [datecreated] DATETIME      NOT NULL, 
    CONSTRAINT [PK_WebsiteSubDomains] PRIMARY KEY ([domain])
);

