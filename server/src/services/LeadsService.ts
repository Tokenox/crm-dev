import { Inject, Injectable } from "@tsed/di";
import { LeadModel } from "../models/LeadsModel";
import { FieldTypes, LeadTypes, LeadsParamTypes } from "../../types";
import { MongooseModel } from "@tsed/mongoose";
import { CategoryModel } from "../models/CategoryModel";

@Injectable()
export class LeadService {
  constructor(
    @Inject(LeadModel) private lead: MongooseModel<LeadModel>,
    @Inject(CategoryModel) private category: MongooseModel<CategoryModel>
  ) {}

  public async findLeadsByOrgId(orgId: string) {
    return this.lead.find({ orgId });
  }

  public async findLeadById(id: string) {
    return this.lead.findById({ _id: id });
  }
  public async findByLeadId(leadId: string) {
    return this.lead.findOne({ leadId });
  }
  public async findLeadsByName(email: string) {
    return this.lead.findOne({ email });
  }

  public async createLead({ source, status, leadId, categoryId, adminId }: LeadsParamTypes) {
    return this.lead.create({
      source,
      status,
      leadId,
      categoryId,
      adminId
    });
  }

  public async createBulkLeads({ body, orgId }: { body: LeadTypes[]; orgId: string }) {
    let findCategory = await this.category.findOne({ orgId, name: "All" });
    if (!findCategory) {
      findCategory = await this.category.create({ name: "All", orgId });
    }
    const leads = body.map((lead) => {
      return {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        categoryId: findCategory?.id,
        orgId
      };
    });
    // create many leads with mongoose
    const response = await this.lead.create(leads);
    return response;
  }

  public async updateLead({ leadId, adminId }: LeadsParamTypes) {
    const lead = await this.findLeadById(leadId!);
    if (!lead) return false;
    return this.lead.findByIdAndUpdate({ _id: lead._id }, { adminId });
  }

  public async updateLeadStatus({ leadId, adminId, status }: LeadsParamTypes) {
    const lead = await this.findLeadById(leadId!);
    if (!lead) return false;
    return this.lead.findByIdAndUpdate({ _id: lead._id }, { adminId, status });
  }

  public async deleteLead(id: string) {
    return this.lead.findByIdAndDelete({ _id: id });
  }

  public async deleteLeadsByCategoryId(categoryId: string) {
    return this.lead.deleteMany({ categoryId });
  }

  public async deleteByLeadId(leadId: string) {
    return this.lead.deleteMany({ leadId });
  }

  public async getOpenLeads({ status }: LeadsParamTypes) {
    return this.lead.find({ status });
  }

  public async getOpenLeadsByAdminId({ adminId, status }: LeadsParamTypes) {
    return this.lead.find({ adminId, status });
  }
}
