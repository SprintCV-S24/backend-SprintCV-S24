import {
    ExperienceModel,
    type ExperienceType,
  } from "../models/experience.model";
  import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
  import { checkDuplicateItemName } from "../utils/checkDuplicates";
  
  export const createExperience = async (experienceFields: ExperienceType) => {
    try {
      if (await checkDuplicateItemName(experienceFields.itemName)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
      }
  
      const newExperience = new ExperienceModel(experienceFields);
      await newExperience.save();
      return newExperience;
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        throw err;
      }
  
      checkMongooseErrors(err);
  
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Experience creation failed",
        { cause: err },
      );
    }
  };
  
  export const getAllExperiences = async (user: string) => {
    try {
      const experience = await ExperienceModel.find({ user: user });
      return experience;
    } catch (err: unknown) {
      //rethrow any errors as HttpErrors
      if (err instanceof HttpError) {
        throw err;
      }
      //checks if mongoose threw and will rethrow with appropriate status code and message
      checkMongooseErrors(err);
  
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Experience retrieval failed",
        { cause: err },
      );
    }
  };
  
  export const getExperienceById = async (user: string, experienceId: string) => {
    try {
      const experience = await ExperienceModel.findOne({
        user: user,
        _id: experienceId,
      });
      return experience;
    } catch (err: unknown) {
      //rethrow any errors as HttpErrors
      if (err instanceof HttpError) {
        throw err;
      }
      //checks if mongoose threw and will rethrow with appropriate status code and message
      checkMongooseErrors(err);
  
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Experience retrieval failed",
        { cause: err },
      );
    }
  };
  
  export const updateExperience = async (
    user: string,
      experienceId: string,
    experienceFields: ExperienceType,
  ) => {
    try {
      if (!experienceId) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          "Missing experience ID for update",
        );
      }
  
          if (await checkDuplicateItemName(experienceFields.itemName, experienceId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
      }
  
      const updatedExperience = await ExperienceModel.findOneAndUpdate(
        { _id: experienceId, user: user }, // Query to match the document by _id and user
        { $set: experienceFields }, // Update operation
        { new: true, runValidators: true }, // Options: return the updated document and run schema validators
      );
      return updatedExperience;
    } catch (err: unknown) {
      //rethrow any errors as HttpErrors
      if (err instanceof HttpError) {
        throw err;
      }
      //checks if mongoose threw and will rethrow with appropriate status code and message
      checkMongooseErrors(err);
  
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Experience update failed",
        { cause: err },
      );
    }
  };
  
  export const deleteExperience = async (user: string, experienceId: string) => {
    try {
      const deletedExperience = await ExperienceModel.findOneAndDelete({
        _id: experienceId,
        user: user,
      });
      if (!deletedExperience) {
        throw new HttpError(
          HttpStatus.NOT_FOUND,
          "Experience not found or already deleted",
        );
      }
      return { message: "Experience deleted successfully" };
    } catch (err: unknown) {
      //rethrow any errors as HttpErrors
      if (err instanceof HttpError) {
        throw err;
      }
      //checks if mongoose threw and will rethrow with appropriate status code and message
      checkMongooseErrors(err);
  
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Experience deletion failed",
        { cause: err },
      );
    }
  };
  