import { EducationModel, type EducationType } from "../models/education.model";
import { ResumeModel } from "../models/resume.model";
import mongoose from "mongoose";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createEducation = async (educationFields: EducationType) => {
  try {
    if (
      await checkDuplicateItemName(
        educationFields.user,
        educationFields.itemName,
      )
    ) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const newEducation = new EducationModel(educationFields);
    await newEducation.save();
    return newEducation;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Education creation failed",
      { cause: err },
    );
  }
};

export const getAllEducation = async (user: string) => {
  try {
    const education = await EducationModel.find({ user: user });
    return education;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Education retrieval failed",
      { cause: err },
    );
  }
};

export const getEducationById = async (user: string, educationId: string) => {
  try {
    const education = await EducationModel.findOne({
      user: user,
      _id: educationId,
    });
    return education;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Education retrieval failed",
      { cause: err },
    );
  }
};

export const updateEducation = async (
  user: string,
  educationId: string,
  educationFields: EducationType,
) => {
  try {
    if (!educationId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing education ID for update",
      );
    }

    if (
      educationFields.itemName != null &&
      (await checkDuplicateItemName(
        educationFields.user,
        educationFields.itemName,
        educationId,
      ))
    ) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedEducation = await EducationModel.findOneAndUpdate(
      { _id: educationId, user: user }, // Query to match the document by _id and user
      { $set: educationFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );

    if (updatedEducation == null) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Education does not exist");
    }

    return updatedEducation;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Education update failed",
      { cause: err },
    );
  }
};

export const deleteEducation = async (user: string, educationId: string) => {
  try {
    await ResumeModel.updateMany(
      { itemIds: new mongoose.Types.ObjectId(educationId) },
      { $pull: { itemIds: new mongoose.Types.ObjectId(educationId) } },
    );

    const deletedEducation = await EducationModel.findOneAndDelete({
      _id: educationId,
      user: user,
    });
    if (!deletedEducation) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Education not found or already deleted",
      );
    }
    return { message: "Education deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Education deletion failed",
      { cause: err },
    );
  }
};
