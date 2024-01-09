import { CollectionOf, Default, Property } from "@tsed/schema";
import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { AdminModel } from "./AdminModel";

import { LeadModel } from "./LeadModel";

export type CategoryFieldType = {
  name: string;
  type: string;
};

@Model({ name: "category" })
export class CategoryModel {
  @ObjectID("id")
  _id: string;

  @Property()
  name: string;

  @Property()
  description: string;

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

  @Ref(() => LeadModel)
  @CollectionOf(() => LeadModel)
  planners: Ref<LeadModel>[];
}
