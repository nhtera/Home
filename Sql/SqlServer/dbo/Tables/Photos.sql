CREATE TABLE [dbo].[Photos]
(
	[filename] NVARCHAR(25) NOT NULL PRIMARY KEY, 
    [uploadname] NVARCHAR(25) NULL,
    [width] INT NULL, 
    [height] INT NULL, 
    [datecreated] DATETIME NULL
)
