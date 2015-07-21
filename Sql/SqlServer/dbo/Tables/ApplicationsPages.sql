CREATE TABLE [dbo].[ApplicationsPages] (
    [websiteId]     INT           NOT NULL,
    [applicationId] INT           NOT NULL,
    [pages]         NVARCHAR (50) NOT NULL, 
    CONSTRAINT [PK_ApplicationsPages] PRIMARY KEY ([websiteId])
);

