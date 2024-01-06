import { Default, Property, Enum } from "@tsed/schema";
import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { OrganizationModel } from "./OrganizationModel";
import { CategoryModel } from "./CategoryModel";
import { AdminModel } from "./AdminModel";
import { LeadStatusEnum } from "../../types";
import { SaleRepModel } from "./SaleRepModel";

@Model({ name: "alllead" })
export class LeadModel {
  @ObjectID("id")
  _id: string;

  @Property()
  source: string;

  @Property()
  @Enum(LeadStatusEnum)
  status: LeadStatusEnum;

  @Property()
  leadId: string;

  @Property()
  categoryId: string;

  @Property()
  adminId: string;

  @Property()
  @Default(new Date())
  createdAt: Date;

  @Property()
  @Default(new Date())
  updatedAt: Date;

  @Ref(() => CategoryModel)
  category: Ref<CategoryModel>;

  @Ref(() => OrganizationModel)
  org: Ref<OrganizationModel>;

  @Ref(() => AdminModel)
  admin: Ref<AdminModel>;

  @Ref(() => SaleRepModel)
  lead: Ref<SaleRepModel>;
}
