import { ActivitiesModel, type ActivitiesType } from "../models/activities.model";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createActivities = async (activitiesFields: ActivitiesType) => {
  try {
		if(await checkDuplicateItemName(activitiesFields.itemName)){
			throw new HttpError(
				HttpStatus.BAD_REQUEST,
				"Duplicate item name",
			)
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
