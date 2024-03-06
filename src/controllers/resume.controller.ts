import { ResumeModel, type resumeType } from "../models/resume.model";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createResume = async (resumesFields: resumeType) => {
  try {
		if(await checkDuplicateItemName(resumesFields.itemName)){
			throw new HttpError(
				HttpStatus.BAD_REQUEST,
				"Duplicate item name",
			)
		}

    const newResumes = new ResumeModel(resumesFields);
    await newResumes.save();
    return newResumes;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Resume creation failed",
      { cause: err },
    );
  }
};

export const getAllResumes = async (user: string) => {
	try {
    const resumes = await ResumeModel.find({ user: user });
    return resumes;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Resumes retrieval failed",
      { cause: err },
    );
  }
}

export const getResumeById = async (user: string, resumeId: string) => {
  try {
    const resume = await ResumeModel.findOne({
      user: user,
      _id: resumeId,
    });
    return resume;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Resume retrieval failed",
      { cause: err },
    );
  }
};

export const updateResume = async (
  user: string,
	resumeId: string,
  resumesFields: resumeType,
) => {
  try {
    if (!resumeId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing resume ID for update",
      );
    }

		if (await checkDuplicateItemName(resumesFields.itemName, resumeId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedResume = await ResumeModel.findOneAndUpdate(
      { _id: resumeId, user: user }, // Query to match the document by _id and user
      { $set: resumesFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );
    return updatedResume;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Resume update failed",
      { cause: err },
    );
  }
};

export const deleteResume = async (user: string, resumeId: string) => {
  try {
    const deletedResume = await ResumeModel.findOneAndDelete({
      _id: resumeId,
      user: user,
    });
    if (!deletedResume) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Resume not found or already deleted",
      );
    }
    return { message: "Resume deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Resume deletion failed",
      { cause: err },
    );
  }
};
