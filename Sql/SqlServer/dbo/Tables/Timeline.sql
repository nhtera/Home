CREATE TABLE [dbo].[Timeline] (
    [timelineId]  NVARCHAR (10)  NOT NULL,
    [userId]    INT            NULL,
    [websiteId]   INT            NULL,
    [datecreated] DATETIME       NOT NULL,
    [title]       NVARCHAR (255) NOT NULL,
    [url]         NVARCHAR (255) NULL,
    [photo]       NVARCHAR (255) NULL,
    [summary]     NVARCHAR (MAX) NULL, 
    CONSTRAINT [PK_Timeline] PRIMARY KEY ([datecreated])
);

