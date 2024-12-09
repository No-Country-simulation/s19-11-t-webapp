import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class HistoriaGeneralDto {
  @ApiProperty({ description: "Creation date of the medical history" })
  @IsNotEmpty()
  fechaCreacion: string;

  @ApiProperty({ description: "General notes" })
  @IsOptional()
  @IsString()
  notasGenerales?: string;
}

class ExamenDto {
  @ApiProperty({ description: "Exam ID" })
  @IsString()
  @IsOptional()
  examenId: string;
}

class ConsultaDto {
  @ApiProperty({ description: "Consultation ID" })
  @IsString()
  @IsNotEmpty()
  idConsulta: string;

  @ApiProperty({ description: "Date of consultation" })
  @IsNotEmpty()
  fechaConsulta: string;

  @ApiProperty({ description: "Reason for consultation" })
  @IsString()
  @IsNotEmpty()
  motivoConsulta: string;

  @ApiProperty({ description: "Diagnosis" })
  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @ApiProperty({ description: "Treatment" })
  @IsString()
  @IsOptional()
  tratamiento?: string;

  @ApiProperty({ description: "Observations" })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({ description: "Doctor ID" })
  @IsString()
  @IsNotEmpty()
  medicoId: string;

  @ApiProperty({ description: "Exams" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamenDto)
  examenes?: ExamenDto[];
}

class EventoClinicoDto {
  @ApiProperty({ description: "Type of clinical event" })
  @IsString()
  @IsOptional()
  tipoEvento: string;

  @ApiProperty({ description: "Description of the event" })
  @IsString()
  @IsOptional()
  descripcion: string;

  @ApiProperty({ description: "Date of the event" })
  @IsOptional()
  fecha: string;
}

export class CreateMedicalHistoryDto {
  @ApiProperty({ description: "Patient ID" })
  @IsString()
  @IsNotEmpty()
  pacienteId: string;

  @ApiProperty({ description: "General medical history" })
  @IsOptional()
  @ValidateNested()
  @Type(() => HistoriaGeneralDto)
  historiaGeneral?: HistoriaGeneralDto;

  @ApiProperty({ description: "Medical consultations" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsultaDto)
  consultas?: ConsultaDto[];

  @ApiProperty({ description: "Clinical events" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventoClinicoDto)
  eventosClinicos?: EventoClinicoDto[];
}
