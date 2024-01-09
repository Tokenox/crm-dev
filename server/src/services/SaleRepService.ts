import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { SaleRepModel } from "../models/SaleRepModel";
import { AvailabilityService } from "./AvailabilityService";
import { AvailabilityModel } from "src/models/AvailabilityModel";

@Injectable()
export class SaleRepService {
  @Inject(SaleRepModel) private saleRep: MongooseModel<SaleRepModel>;
  @Inject() private availability: MongooseModel<AvailabilityModel>;
  @Inject() private availabilityService: AvailabilityService;

  //! Find

  //!---------
  public async findAvailableSaleRep() {
    const saleRep = await this.saleRep
      .find()
      .populate({
        path: "availability",
        match: {
          startTime: { $lte: new Date().getTime() },
          endTime: { $gte: new Date().getTime() },
          saleRepId: { $ne: null }
        }
      })
      .sort({ score: -1 })
      .limit(1);
    console.log("saleRep-------------------------", saleRep);
  }
  //!---------

  public async findSaleRepBySourceAvailability() {
    const saleRep = await this.saleRep.find().sort({ score: -1 }).limit(5);
    if (!saleRep.length) return false;
    for (let i = 0; i < saleRep.length; i++) {
      const rep = saleRep[i];
      const availability = await this.availabilityService.findAvailabilityByDateAndRep(rep.adminId);
      if (availability) {
        return rep;
      }
    }
  }

  public async findSaleRepBySourceAvailabilityByLeadId(leadId: string) {
    const saleRep = await this.saleRep
      .find({ leads: { $ne: leadId } })
      .sort({ score: -1 })
      .limit(1);
    if (!saleRep.length) return false;
    const availability = this.availabilityService.findAvailabilityByDateAndRep(saleRep[0].id);
    if (!availability) return false;
    return saleRep;
  }

  public async findSaleRepByLeadId(leadId: string) {
    const saleRep = await this.saleRep
      .find({
        leads: {
          $nin: [leadId]
        }
      })
      .sort({ score: -1 })
      .limit(1);
    if (!saleRep.length) return false;
    for (let i = 0; i < saleRep.length; i++) {
      const rep = saleRep[i];
      const availability = await this.availabilityService.findAvailabilityByDateAndRep(rep.adminId);
      if (availability) {
        return rep;
      }
    }
  }

  //! Create
  public async createSaleRep({ adminId }: { adminId: string }) {
    return this.saleRep.create({
      adminId,
      score: 10,
      leadIds: []
    });
  }

  //! Update
  public async updateSaleRepLeadIds({ id, leadIds }: { id: string; leadIds: string[] }) {
    const saleRep = await this.saleRep.findById({ _id: id });
    if (!saleRep) return false;
    saleRep.leadIds = leadIds;
    return await saleRep.save();
  }

  //! Delete
  public async deleteLeadId(leadId: string) {
    const saleRep = await this.saleRep.find({
      leads: {
        $in: [leadId]
      }
    });
    if (!saleRep.length) return false;
    for (let i = 0; i < saleRep.length; i++) {
      const rep = saleRep[i];
      rep.leadIds = rep.leadIds.filter((id) => id !== leadId);
      await rep.save();
    }
    return true;
  }
}
