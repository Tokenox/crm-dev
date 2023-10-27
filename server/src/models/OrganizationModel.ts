import { CollectionOf, Default, Property, Required } from "@tsed/schema";
import { Model, ObjectID, Ref, Unique } from "@tsed/mongoose";
import { AdminModel } from "./AdminModel";
import { CategoryModel } from "./CategoryModel";
import { LeadModel } from "./LeadModel";

@Model({ name: "org" })
export class OrganizationModel {
  @ObjectID("id")
  _id: string;

  @Unique()
  @Required()
  name: string;

  @Property()
  @Default(new Date())
  createdAt: Date;

  @Property()
  @Default(new Date())
  updatedAt: Date;

  @Ref(() => AdminModel)
  @CollectionOf(() => AdminModel)
  admins: Ref<AdminModel>[];

  @Ref(() => CategoryModel)
  @CollectionOf(() => CategoryModel)
  categories: Ref<CategoryModel>[];

  @Ref(() => LeadModel)
  @CollectionOf(() => LeadModel)
  leads: Ref<LeadModel>[];
}
