import { Inject, Injectable } from "@tsed/di";
import { LeadModel } from "../models/LeadModel";
import { LeadStatusEnum } from "../../types";
import { MongooseModel } from "@tsed/mongoose";
import { CategoryModel } from "../models/CategoryModel";
import { SaleRepService } from "./SaleRepService";

@Injectable()
export class LeadService {
  constructor(
    @Inject(LeadModel) private lead: MongooseModel<LeadModel>,
    @Inject(CategoryModel) private category: MongooseModel<CategoryModel>
  ) {}
  @Inject() private saleRepService: SaleRepService;

  //! Find
  public async findLeads({ skip, take }: { skip: number; take: number }) {
    return this.lead.find().skip(skip).limit(take);
  }

  public async findLead(id: string) {
    return this.lead.findById({ _id: id });
  }

  public async findLeadByEmail(email: string) {
    return this.lead.findOne({ email });
  }

  public async findLeadsByStatus(status: LeadStatusEnum) {
    return this.lead.find({ status });
  }

  public async getLeadByStatusAndRep({ status, saleRepId }: LeadModel) {
    return this.lead.find({
      status,
      saleRepId
    });
  }

  public async getLeadsCount() {
    return this.lead.countDocuments();
  }

  //! Create
  public async createLead({ ...params }: LeadModel) {
    return this.lead.create({
      ...params
    });
  }

  //! Update
  public async updateLead({ _id, firstName, lastName, email, phone, isNotify, status, saleRepId }: LeadModel) {
    return this.lead.findByIdAndUpdate(
      { _id },
      {
        firstName,
        lastName,
        email,
        phone,
        isNotify,
        status,
        saleRepId
      }
    );
  }

  public async updateLeadStatus({ _id, status }: LeadModel) {
    return this.lead.findByIdAndUpdate(
      { _id },
      {
        status
      }
    );
  }

  public async updateLeadSaleRep({ _id, saleRepId }: LeadModel) {
    return this.lead.findByIdAndUpdate(
      { _id },
      {
        saleRepId
      }
    );
  }

  public async updateLeadStatusAndRep({ _id, status, saleRepId }: LeadModel) {
    return this.lead.findByIdAndUpdate(
      { _id },
      {
        status,
        saleRepId
      }
    );
  }

  //! Delete
  public async deleteLead(id: string) {
    await this.lead.findByIdAndDelete({ _id: id });
    await this.saleRepService.deleteLeadId(id);
    return true;
  }

  public async deleteLeadsByCategoryId(categoryId: string) {
    return this.lead.deleteMany({ categoryId });
  }
}
