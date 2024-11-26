import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class CreatePatientDto {
  @ApiProperty({ description: "Unique patient identifier" })
  @IsString()
  @IsNotEmpty()
  patientId: string;
}
