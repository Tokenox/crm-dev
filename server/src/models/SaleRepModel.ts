import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { CollectionOf, Default, Property } from "@tsed/schema";
import { AdminModel } from "./AdminModel";
import { AvailabilityModel } from "./AvailabilityModel";
import { LeadModel } from "./LeadsModel";

@Model({ name: "saleRep" })
export class SaleRepModel {
  @ObjectID("id")
  _id: string;

  @Property()
  score: number;

  @Property()
  availabilityId: string;

  @Property()
  adminId: string;

  @Property()
  leads: string[];

  @Property()
  @Default(new Date())
  createdAt: Date;

  @Property()
  @Default(new Date())
  updatedAt: Date;

  @Ref(() => AdminModel)
  admin: Ref<AdminModel>;

  @Ref(() => AvailabilityModel)
  @CollectionOf(() => AvailabilityModel)
  availability: Ref<AvailabilityModel>[];

  @Ref(() => LeadModel)
  @CollectionOf(() => LeadModel)
  lead: Ref<LeadModel>[];
}
