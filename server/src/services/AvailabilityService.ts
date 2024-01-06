import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { AvailabilityDataTypes } from "../../types";
import { AvailabilityModel } from "../models/AvailabilityModel";
import { SaleRepModel } from "../models/SaleRepModel";

@Injectable()
export class AvailabilityService {
  // constructor(@Inject(PlannerModel) private planner: MongooseModel<PlannerModel>) {}
  @Inject(AvailabilityModel) private availability: MongooseModel<AvailabilityModel>;
  @Inject(SaleRepModel) private saleRep: MongooseModel<SaleRepModel>;

  public async findAvailability() {
    return await this.availability.find();
  }

  public async findAvailabilityById(id: string) {
    return await this.availability.findById({ _id: id });
  }

  public async createAvailability({ startDate, endDate, adminId }: AvailabilityDataTypes) {
    return await this.availability.create({
      startDate,
      endDate,
      adminId
    });
  }
  public async deleteAvailability(id: string) {
    return await this.availability.deleteOne({ _id: id });
  }

  public async findAvailabilityByAdminId(adminId: string) {
    return await this.availability.find({ adminId });
  }

  // find availability that does not greater than the current date
  public async findAvailabilityByDateAndRep(adminId: string) {
    const currentDate = new Date().getTime();
    const availability = await this.availability.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      adminId: adminId
    });
    console.log("findAvailabilityByDateAndRep---------------------", availability);
    if (availability.length) return false;
    return true;
  }

  public async updateAvailabilityScore({ adminId, score }: { adminId: string; score: number }) {
    return await this.availability.updateMany({ adminId }, { $set: { saleRepScore: score } });
  }

  // find availability that does not exist in startTime and endTime and saleRepScore is greater
  public async findAvailabilityByScore() {
    const currentDate = new Date().getTime();
    const availability = await this.availability.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    }).sort({ saleRepScore: -1 }).limit(1);
    console.log("findAvailabilityByScore---------------------", availability);
    if (!availability.length) return false;
    return availability;
  }
}
