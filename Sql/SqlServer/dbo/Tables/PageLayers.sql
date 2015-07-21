CREATE TABLE [dbo].[PageLayers] (
    [layerId]  INT           NOT NULL,
    [websiteId]    INT           NOT NULL,
    [title]        NVARCHAR (25) NOT NULL,
    [datecreated]  DATETIME      NOT NULL, 
    CONSTRAINT [PK_PageInterfaces] PRIMARY KEY ([websiteId])
);

