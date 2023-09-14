import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Context } from "@nestjs/graphql";

//Service
import { DashboardService } from "./dashboard.service";

//Entities
import { Dashboard } from "./entities/dashboard.entity";

//Guards
import { Roles } from "../auth/decorator/auth.decorator";
import { Role } from "../auth/enum/auth.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";

//Types
import { ReqUser } from "../auth/types/user.types";

@Resolver()
export class DashboardResolver {
    //Constructor
    constructor(
        private readonly dashboardService: DashboardService
    ) { };

    //Get dashboard
    @Query(() => Dashboard, { name: "getDashboard" })
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    gets(
        @Context("user") reqUser: ReqUser
    ) {
        return this.dashboardService.gets(reqUser)
    };
}