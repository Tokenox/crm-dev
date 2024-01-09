import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { AvailabilityModel } from "../models/AvailabilityModel";

@Injectable()
export class AvailabilityService {
  @Inject(AvailabilityModel) private availability: MongooseModel<AvailabilityModel>;

  //! Find
  public async findAvailabilityBySaleRep(saleRepId: string) {
    return await this.availability.find({ saleRepId });
  }

  public async findAvailabilityByDateAndRep(saleRepId: string) {
    const currentDate = new Date().getTime();
    const availability = await this.availability.findOne({
      startTime: { $lte: currentDate },
      endTime: { $gte: currentDate },
      saleRepId
    });
    if (availability) return false;
    return true;
  }

  //! Create
  public async createAvailability({ saleRepId, saleRepScore, startTime, endTime }: AvailabilityModel) {
    return await this.availability.create({
      saleRepScore,
      saleRepId,
      startTime,
      endTime
    });
  }

  //! Delete
  public async deleteAvailability(id: string) {
    return await this.availability.deleteOne({ _id: id });
  }
}
