import { Model, ObjectID } from "@tsed/mongoose";
import { Default, Property, Required } from "@tsed/schema";

@Model({ name: "planner" })
export class PlannerModel {
  @ObjectID("id")
  _id: string;

  @Required()
  title: string;

  @Property()
  description: string;

  @Required()
  source: string;

  @Required()
  timeOfExecution: number;

  @Required()
  startDate: Date;

  @Property()
  @Default(new Date())
  createdAt: Date;

  @Property()
  @Default(new Date())
  updatedAt: Date;
}
