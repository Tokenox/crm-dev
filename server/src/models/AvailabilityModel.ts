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
  startDate: number;

  @Required()
  endDate: number;

  @Property()
  adminId: string;

  @Property()
  @Default(new Date())
  createdAt: Date;

  @Property()
  @Default(new Date())
  updatedAt: Date;

  @Ref(() => AdminModel)
  admin: Ref<AdminModel>;

  @Ref(() => SaleRepModel)
  @CollectionOf(() => SaleRepModel)
  saleRep: Ref<SaleRepModel>[];
}
