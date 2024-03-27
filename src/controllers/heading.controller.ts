import { HeadingModel, type HeadingType } from "../models/heading.model";
import { ResumeModel } from "../models/resume.model";
import mongoose from "mongoose";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createHeading = async (headingFields: HeadingType) => {
  try {
    if (await checkDuplicateItemName(headingFields.user, headingFields.itemName)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const newHeading = new HeadingModel(headingFields);
    await newHeading.save();
    return newHeading;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Heading creation failed",
      { cause: err },
    );
  }
};

export const getAllHeadings = async (user: string) => {
  try {
    const heading = await HeadingModel.find({ user: user });
    return heading;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Heading retrieval failed",
      { cause: err },
    );
  }
};

export const getHeadingById = async (user: string, headingId: string) => {
  try {
    const heading = await HeadingModel.findOne({
      user: user,
      _id: headingId,
    });
    return heading;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Heading retrieval failed",
      { cause: err },
    );
  }
};

export const updateHeading = async (
  user: string,
  headingId: string,
  headingFields: HeadingType,
) => {
  try {
    if (!headingId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing heading ID for update",
      );
    }

    if (
      headingFields.itemName != null &&
      (await checkDuplicateItemName(headingFields.user, headingFields.itemName, headingId))
    ) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedHeading = await HeadingModel.findOneAndUpdate(
      { _id: headingId, user: user }, // Query to match the document by _id and user
      { $set: headingFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );
    return updatedHeading;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Heading update failed",
      { cause: err },
    );
  }
};

export const deleteHeading = async (user: string, headingId: string) => {
  try {
    await ResumeModel.updateMany(
      { itemIds: new mongoose.Types.ObjectId(headingId) },
      { $pull: { itemIds: new mongoose.Types.ObjectId(headingId) } },
    );

    const deletedHeading = await HeadingModel.findOneAndDelete({
      _id: headingId,
      user: user,
    });
    if (!deletedHeading) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Heading not found or already deleted",
      );
    }
    return { message: "Heading deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Heading deletion failed",
      { cause: err },
    );
  }
};
