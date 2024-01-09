import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { CollectionOf, Default, Property, Required } from "@tsed/schema";
import { AdminModel } from "./AdminModel";
import { SaleRepModel } from "./SaleRepModel";

@Model({ name: "availability" })
export class AvailabilityModel {
  @ObjectID("id")
  _id: string;

  @Property()
  saleRepScore: number;

  @Required()
  startTime: number;

  @Required()
  endTime: number;

  @Property()
  saleRepId: string;

  @Property()
  @Default(new Date())
  createdAt: Date;

  @Property()
  @Default(new Date())
  updatedAt: Date;

  @Ref(() => SaleRepModel)
  saleRep: Ref<SaleRepModel>;
}
