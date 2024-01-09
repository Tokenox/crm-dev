import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { PlannerModel } from "../models/PlannerModel";

type CreatePlannerParam = {
  title: string;
  source: string;
  description: string;
  timeOfExecution: number;
  startDate: Date;
};

@Injectable()
export class PlannerService {
  @Inject(PlannerModel) private planner: MongooseModel<PlannerModel>;

  //! Find
  public async findPlanner() {
    return await this.planner.find();
  }

  public async findPlannerById(id: string) {
    return await this.planner.findById({ _id: id });
  }

  //! Create
  public async createPlanner({ title, source, description, timeOfExecution, startDate }: CreatePlannerParam) {
    return await this.planner.create({
      title,
      source,
      description,
      timeOfExecution,
      startDate
    });
  }

  //! Update
  public async updatePlanner({ _id, title, source, description, timeOfExecution, startDate }: PlannerModel) {
    return await this.planner.findByIdAndUpdate(
      { _id },
      {
        title,
        source,
        description,
        timeOfExecution,
        startDate,
        updatedAt: new Date()
      }
    );
  }

  //! Delete
  public async deletePlanner(id: string) {
    return await this.planner.deleteOne({ _id: id });
  }
}
