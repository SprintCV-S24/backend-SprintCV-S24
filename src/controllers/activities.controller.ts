import {
  ActivitiesModel,
  type ActivitiesType,
} from "../models/activities.model";
import { ResumeModel } from "../models/resume.model";
import mongoose from "mongoose";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

/**
 * Creates a new activity document in the database.a
 *
 * @param {ActivitiesType} activitiesFields - The activity fields to be saved.
 * @returns {Promise<ActivitiesModel>} A promise that resolves with the newly created activity.
 * @throws {HttpError} If the item name is a duplicate or if an error occurs during the database operation.
 */
export const createActivity = async (activitiesFields: ActivitiesType) => {
  try {
    if (await checkDuplicateItemName(activitiesFields.itemName)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const newActivity = new ActivitiesModel(activitiesFields);
    await newActivity.save();
    return newActivity;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Activity creation failed",
      { cause: err },
    );
  }
};

/**
 * Retrieves all activities associated with a specific user.
 *
 * @param {string} user - The ID of the user whose activities are to be retrieved.
 * @returns {Promise<ActivitiesModel[]>} A promise that resolves with an array of activities.
 * @throws {HttpError} If an error occurs during the database operation.
 */
export const getAllActivities = async (user: string) => {
  try {
    const activities = await ActivitiesModel.find({ user: user });
    return activities;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Activities retrieval failed",
      { cause: err },
    );
  }
};

/**
 * Retrieves a specific activity by its ID and user ID.
 *
 * @param {string} user - The ID of the user.
 * @param {string} activityId - The ID of the activity to retrieve.
 * @returns {Promise<ActivitiesModel|null>} A promise that resolves with the activity or null if not found.
 * @throws {HttpError} If an error occurs during the database operation.
 */
export const getActivityById = async (user: string, activityId: string) => {
  try {
    const activity = await ActivitiesModel.findOne({
      user: user,
      _id: activityId,
    });
    return activity;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Activity retrieval failed",
      { cause: err },
    );
  }
};

/**
 * Updates an existing activity document.
 *
 * @param {string} user - The ID of the user who owns the activity.
 * @param {string} activityId - The ID of the activity to update.
 * @param {ActivitiesType} activitiesFields - The fields to update in the activity document.
 * @returns {Promise<ActivitiesModel|null>} A promise that resolves with the updated activity or null if not found.
 * @throws {HttpError} If the activity ID is missing, the item name is a duplicate, or an error occurs during the database operation.
 */
export const updateActivity = async (
  user: string,
	activityId: string,
  activitiesFields: ActivitiesType,
) => {
  try {
    if (!activityId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing activity ID for update",
      );
    }

		if (await checkDuplicateItemName(activitiesFields.itemName, activityId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedActivity = await ActivitiesModel.findOneAndUpdate(
      { _id: activityId, user: user }, // Query to match the document by _id and user
      { $set: activitiesFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );
    return updatedActivity;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Activity update failed",
      { cause: err },
    );
  }
};

/**
 * Deletes a specific activity document.
 *
 * @param {string} user - The ID of the user who owns the activity.
 * @param {string} activityId - The ID of the activity to be deleted.
 * @returns {Promise<Object>} A promise that resolves with a success message object.
 * @throws {HttpError} If the activity is not found, already deleted, or an error occurs during the database operation.
 */
export const deleteActivity = async (user: string, activityId: string) => {
  try {
		await ResumeModel.updateMany(
			{ itemIds: new mongoose.Types.ObjectId(activityId) },
			{ $pull: { itemIds: new mongoose.Types.ObjectId(activityId) } }
		);

    const deletedActivity = await ActivitiesModel.findOneAndDelete({
      _id: activityId,
      user: user,
    });
    if (!deletedActivity) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Activity not found or already deleted",
      );
    }
    return { message: "Activity deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Activity deletion failed",
      { cause: err },
    );
  }
};
