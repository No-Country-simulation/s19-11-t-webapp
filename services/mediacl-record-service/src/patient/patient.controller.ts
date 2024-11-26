import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PatientService } from "./patient.service";

@ApiTags("Patient Clinical History")
@Controller("patient")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post("/visit")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Add medical visit (creates patient if not exists)",
  })
  @ApiResponse({ status: 201, description: "Medical visit added successfully" })
  async createOrUpdatePatientVisit(
    @Body()
    data: {
      patientId: string;
      visit: {
        visitDate: string;
        doctorId: string;
        diagnosis: string;
        treatment: string;
        notes: string;
      };
    }
  ) {
    return this.patientService.createOrUpdatePatientVisit(data);
  }
}
