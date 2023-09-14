import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MongooseModule } from "@nestjs/mongoose";
import { MailerModule } from "@nestjs-modules/mailer";

//Using Apollo Studio
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

//Modules
import { UserModule } from "./user/user.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { MoviesModule } from "./movies/movies.module";
import { BookModule } from "./books/books.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      path: "flimybook",
      context: ({ req }) => ({
        headers: req.headers
      }),
      plugins: [ApolloServerPluginLandingPageLocalDefault()]
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_SMTP,
        port: Number(process.env.MAILER_PORT),
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD
        }
      }
    }),
    UserModule,
    WishlistModule,
    MoviesModule,
    BookModule,
    DashboardModule
  ]
})
export class AppModule { }
