import { Module } from "@nestjs/common";

//Service and Resolver
import { DashboardService } from "./dashboard.service";
import { DashboardResolver } from "./dashboard.resolver";

//Modules
import { UserModule } from "src/user/user.module";
import { BookModule } from "src/books/books.module";
import { MoviesModule } from "src/movies/movies.module";

@Module({
    imports: [
        UserModule,
        BookModule,
        MoviesModule
    ],
    providers: [DashboardService, DashboardResolver]
})

export class DashboardModule { };