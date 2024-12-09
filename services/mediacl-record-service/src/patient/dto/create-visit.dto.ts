import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class CreateVisitDto {
  @ApiProperty({ description: "Date of the medical visit" })
  @IsString()
  visitDate: string;

  @ApiProperty({ description: "ID of the doctor" })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ description: "Medical diagnosis" })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiProperty({ description: "Treatment prescribed" })
  @IsString()
  treatment: string;

  @ApiProperty({ description: "Additional notes" })
  @IsString()
  notes: string;
}
