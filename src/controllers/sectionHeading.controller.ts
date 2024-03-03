import { SectionHeadingModel, type SectionHeadingType } from "../models/sectionHeading.model";
import { ResumeModel } from "../models/resume.model";
import mongoose from "mongoose";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createSectionHeading = async (sectionHeadingsFields: SectionHeadingType) => {
  try {
		if(await checkDuplicateItemName(sectionHeadingsFields.itemName)){
			throw new HttpError(
				HttpStatus.BAD_REQUEST,
				"Duplicate item name",
			)
		}

    const newSectionHeadings = new SectionHeadingModel(sectionHeadingsFields);
    await newSectionHeadings.save();
    return newSectionHeadings;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "SectionHeading creation failed",
      { cause: err },
    );
  }
};

export const getAllSectionHeadings = async (user: string) => {
	try {
    const sectionHeadings = await SectionHeadingModel.find({ user: user });
    return sectionHeadings;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "SectionHeadings retrieval failed",
      { cause: err },
    );
  }
}

export const getSectionHeadingById = async (user: string, sectionHeadingId: string) => {
  try {
    const sectionHeading = await SectionHeadingModel.findOne({
      user: user,
      _id: sectionHeadingId,
    });
    return sectionHeading;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "SectionHeading retrieval failed",
      { cause: err },
    );
  }
};

export const updateSectionHeading = async (
  user: string,
	sectionHeadingId: string,
  sectionHeadingsFields: SectionHeadingType,
) => {
  try {
    if (!sectionHeadingId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing sectionHeading ID for update",
      );
    }

		if (await checkDuplicateItemName(sectionHeadingsFields.itemName, sectionHeadingId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedSectionHeading = await SectionHeadingModel.findOneAndUpdate(
      { _id: sectionHeadingId, user: user }, // Query to match the document by _id and user
      { $set: sectionHeadingsFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );
    return updatedSectionHeading;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "SectionHeading update failed",
      { cause: err },
    );
  }
};

export const deleteSectionHeading = async (user: string, sectionHeadingId: string) => {
  try {
		await ResumeModel.updateMany(
			{ itemIds: new mongoose.Types.ObjectId(sectionHeadingId) },
			{ $pull: { itemIds: new mongoose.Types.ObjectId(sectionHeadingId) } }
		);

    const deletedSectionHeading = await SectionHeadingModel.findOneAndDelete({
      _id: sectionHeadingId,
      user: user,
    });
    if (!deletedSectionHeading) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "SectionHeading not found or already deleted",
      );
    }
    return { message: "SectionHeading deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "SectionHeading deletion failed",
      { cause: err },
    );
  }
};
