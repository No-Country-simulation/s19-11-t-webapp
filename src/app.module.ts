import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { PatientModule } from "./patient/patient.module";

@Module({
  imports: [PrismaModule, PatientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
