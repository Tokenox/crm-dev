import { Controller, Inject } from "@tsed/di";
import { LeadService } from "../../services/LeadsService";
import { Post, Property, Required, Returns, object } from "@tsed/schema";
import { SuccessResult } from "../../util/entities";
import { LeadResultModel, SuccessMessageModel } from "../../models/RestModels";
import { BodyParams } from "@tsed/platform-params";
import { SaleRepService } from "../../services/SaleRepService";
import { CategoryService } from "../../services/CategoryService";
import { LeadStatusEnum } from "../../../types";
import { normalizeObject } from "../../helper";
import { TwilioClient } from "../../clients/twilio";

class CreateLeadParams {
  @Required() public source: string;
  @Required() public firstName: string;
  @Property() public lastName: string;
  @Required() public email: string;
  @Required() public phone: string;
  @Property() public message: string;
}

@Controller("/webhook")
export class Webhook {
  @Inject()
  private leadService: LeadService;
  @Inject()
  private saleRepService: SaleRepService;
  @Inject()
  private categoryService: CategoryService;

  @Post("/lead")
  @Returns(200, SuccessResult).Of(LeadResultModel)
  public async createLeadWebhook(@BodyParams() body: CreateLeadParams) {
    const { source, firstName, lastName, email, phone, message } = body;
    const saleRep = await this.saleRepService.findSaleRep();
    if (!saleRep) return;
    let category = await this.categoryService.findCategoryByName(source.toLocaleLowerCase());
    if (!category) category = await this.categoryService.createCategory({ name: source, description: "" });
    const response = await this.leadService.createLead({
      firstName,
      lastName,
      email,
      phone,
      message,
      source: source.toLocaleLowerCase(),
      saleRepId: saleRep?._id,
      categoryId: category?._id,
      status: LeadStatusEnum.open
    });
    await this.saleRepService.updateSaleRepLeadIds({ id: saleRep._id, leadId: response._id });
    return new SuccessResult(normalizeObject(response), LeadResultModel);
  }

  @Post("/assign/lead")
  @Returns(200, SuccessResult).Of(LeadResultModel)
  public async assignLeadWebhook() {
    const leads = await this.leadService.findLeadByTime({ status: LeadStatusEnum.open });
    if (!leads.length) return;
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      const saleRep = await this.saleRepService.findSaleRepByLeadId(lead._id);
      if (saleRep) {
        await this.leadService.updateLeadSaleRep({ id: lead._id, saleRepId: saleRep._id });
        await this.saleRepService.updateSaleRepLeadIds({ id: saleRep._id, leadId: lead._id });
      }
    }
    return new SuccessResult({ success: true, message: `${leads.length} open` }, SuccessMessageModel);
  }

  @Post("/sms")
  @Returns(200, SuccessResult).Of(Object)
  public async smsWebhook(@BodyParams() body: any) {
    await TwilioClient.sendVerificationSMS({ to: body.phone, body: "Hello from Twilio!" });
    return new SuccessResult({ success: true, message: "sms webhook" }, SuccessMessageModel);
  }
}
