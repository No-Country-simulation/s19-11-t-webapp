import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MedicalHistoryService } from "./medical-history.service";
import { CreateMedicalHistoryDto } from "./dto/create-medical-history.dto";

@ApiTags("Medical History")
@Controller("medical-history")
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create or update medical history",
  })
  @ApiResponse({
    status: 201,
    description: "Medical history created/updated successfully",
  })
  async createOrUpdateMedicalHistory(@Body() data: CreateMedicalHistoryDto) {
    return this.medicalHistoryService.createOrUpdateMedicalHistory(data);
  }

  @Get(":pacienteId")
  @ApiOperation({
    summary: "Get medical history by patient ID",
  })
  @ApiResponse({
    status: 200,
    description: "Medical history retrieved successfully",
  })
  async getMedicalHistoryByPatientId(@Param("pacienteId") pacienteId: string) {
    return this.medicalHistoryService.getMedicalHistoryByPatientId(pacienteId);
  }
}
