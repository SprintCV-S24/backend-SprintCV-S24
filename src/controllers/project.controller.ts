import { ProjectModel, type ProjectType } from "../models/project.model";
import { ResumeModel } from "../models/resume.model";
import mongoose from "mongoose";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createProject = async (projectFields: ProjectType) => {
  try {
    if (await checkDuplicateItemName(projectFields.itemName)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const newProject = new ProjectModel(projectFields);
    await newProject.save();
    return newProject;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Project creation failed",
      { cause: err },
    );
  }
};

export const getAllProjects = async (user: string) => {
  try {
    const project = await ProjectModel.find({ user: user });
    return project;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Project retrieval failed",
      { cause: err },
    );
  }
};

export const getProjectById = async (user: string, projectId: string) => {
  try {
    const project = await ProjectModel.findOne({
      user: user,
      _id: projectId,
    });
    return project;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Project retrieval failed",
      { cause: err },
    );
  }
};

export const updateProject = async (
  user: string,
  projectId: string,
  projectFields: ProjectType,
) => {
  try {
    if (!projectId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing project ID for update",
      );
    }

    if (projectFields.itemName != null && await checkDuplicateItemName(projectFields.itemName, projectId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: projectId, user: user }, // Query to match the document by _id and user
      { $set: projectFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );
    return updatedProject;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Project update failed",
      { cause: err },
    );
  }
};

export const deleteProject = async (user: string, projectId: string) => {
  try {
    await ResumeModel.updateMany(
      { itemIds: new mongoose.Types.ObjectId(projectId) },
      { $pull: { itemIds: new mongoose.Types.ObjectId(projectId) } },
    );

    const deletedProject = await ProjectModel.findOneAndDelete({
      _id: projectId,
      user: user,
    });
    if (!deletedProject) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Project not found or already deleted",
      );
    }
    return { message: "Project deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Project deletion failed",
      { cause: err },
    );
  }
};
