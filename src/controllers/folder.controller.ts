import { FolderModel, type folderType } from "../models/folder.model";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createFolder = async (foldersFields: folderType) => {
  try {
		if(await checkDuplicateItemName(foldersFields.itemName)){
			throw new HttpError(
				HttpStatus.BAD_REQUEST,
				"Duplicate folder name",
			)
		}

    const newFolders = new FolderModel(foldersFields);
    await newFolders.save();
    return newFolders;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Folder creation failed",
      { cause: err },
    );
  }
};

export const getAllFolders = async (user: string) => {
	try {
    const folders = await FolderModel.find({ user: user });
    return folders;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Folders retrieval failed",
      { cause: err },
    );
  }
}

export const getFolderById = async (user: string, folderId: string) => {
  try {
    const folder = await FolderModel.findOne({
      user: user,
      _id: folderId,
    });
    return folder;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Folder retrieval failed",
      { cause: err },
    );
  }
};

export const updateFolder = async (
  user: string,
	folderId: string,
  foldersFields: folderType,
) => {
  try {
    if (!folderId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing folder ID for update",
      );
    }

		if (await checkDuplicateItemName(foldersFields.itemName, folderId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedFolder = await FolderModel.findOneAndUpdate(
      { _id: folderId, user: user }, // Query to match the document by _id and user
      { $set: foldersFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );
    return updatedFolder;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Folder update failed",
      { cause: err },
    );
  }
};

export const deleteFolder = async (user: string, folderId: string) => {
  try {
    const deletedFolder = await FolderModel.findOneAndDelete({
      _id: folderId,
      user: user,
    });
    if (!deletedFolder) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Folder not found or already deleted",
      );
    }
    return { message: "Folder deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Folder deletion failed",
      { cause: err },
    );
  }
};