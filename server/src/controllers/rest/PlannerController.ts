import { Controller, Inject } from "@tsed/di";
import { Delete, Enum, Get, Post, Property, Required, Returns } from "@tsed/schema";
import { AdminService } from "../../services/AdminService";
import { IdModel, PlannerResultModel, SuccessMessageModel } from "../../models/RestModels";
import { Pagination, SuccessArrayResult, SuccessResult } from "../../util/entities";
import { ADMIN, SALESREP } from "../../util/constants";
import { BodyParams, Context, PathParams } from "@tsed/platform-params";
import { Unauthorized } from "@tsed/exceptions";
import { ADMIN_NOT_FOUND } from "../../util/errors";
import { PlannerService } from "../../services/PlannerService";
import { SocialAction } from "../../../types";
import { normalizeData, normalizeObject } from "../../helper";
import { LeadService } from "../../services/LeadsService";
import { response } from "express";

class PlannerBodyTypes {
  @Required() public readonly title: string;
  @Required() @Enum(SocialAction) public readonly action: SocialAction;
  @Property() public readonly description: string;
  @Property() public readonly startDate: Date;
  @Required() public readonly timeOfExecution: number;
  @Required() public readonly source: string;
}

@Controller("/planner")
export class PlannerController {
  @Inject() private adminService: AdminService;
  @Inject() private plannerService: PlannerService;
  @Inject() private leadService: LeadService;

  @Get()
  @Returns(200, SuccessArrayResult).Of(Pagination).Nested(PlannerResultModel)
  public async getPlanners(@Context() context: Context) {
    await this.adminService.checkPermissions({ hasRole: [ADMIN] }, context.get("user"));
    const planner = await this.plannerService.findPlanner();
    const plannerData = normalizeData(planner);
    return new SuccessResult(new Pagination(plannerData, planner.length, PlannerResultModel), Pagination);
  }

  @Post()
  @Returns(200, SuccessResult).Of(PlannerResultModel)
  public async createPlanner(@BodyParams() body: PlannerBodyTypes, @Context() context: Context) {
    const { adminId } = await this.adminService.checkPermissions({ hasRole: [ADMIN] }, context.get("user"));
    if (!adminId) throw new Unauthorized(ADMIN_NOT_FOUND);
    const { title, action, description, startDate, timeOfExecution, source } = body;
    const response = await this.plannerService.createPlanner({
      title,
      source,
      action,
      description,
      timeOfExecution,
      startDate
    });

    await this.leadService.updateLeadPlannerIds({ source: response.source, plannerId: response._id });
    return new SuccessResult(normalizeObject(response), PlannerResultModel);
  }

  @Delete("/:id")
  @Returns(200, SuccessResult).Of(SuccessMessageModel)
  public async deleteAvailability(@PathParams() { id }: IdModel, @Context() context: Context) {
    const { adminId } = await this.adminService.checkPermissions({ hasRole: [ADMIN, SALESREP] }, context.get("user"));
    if (!adminId) throw new Unauthorized(ADMIN_NOT_FOUND);
    await this.plannerService.deletePlanner(id);
    return new SuccessResult({ success: true, message: "Timeslot deleted successfully" }, SuccessMessageModel);
  }
}
//, socialAction: response.action
