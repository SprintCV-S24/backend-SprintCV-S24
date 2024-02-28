import {
  ActivitiesModel,
  type ActivitiesType,
} from "../models/activities.model";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createActivity = async (activitiesFields: ActivitiesType) => {
  try {
    if (await checkDuplicateItemName(activitiesFields.itemName)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const newActivities = new ActivitiesModel(activitiesFields);
    await newActivities.save();
    return newActivities;
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

export const getActivityById = async (user: string, activityId: string) => {
  try {
    const activities = await ActivitiesModel.findOne({
      user: user,
      _id: activityId,
    });
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
      "Activity retrieval failed",
      { cause: err },
    );
  }
};

export const updateActivity = async (
  user: string,
  activitiesFields: ActivitiesType,
) => {
  try {
    const _id = activitiesFields._id; // Extract the _id from activitiesFields
    if (!_id) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing activity ID for update",
      );
    }

    const updatedActivity = await ActivitiesModel.findOneAndUpdate(
      { _id: _id, user: user }, // Query to match the document by _id and user
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

export const deleteActivity = async (user: string, activityId: string) => {
  try {
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
