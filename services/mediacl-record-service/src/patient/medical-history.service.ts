import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMedicalHistoryDto } from "./dto/create-medical-history.dto";

@Injectable()
export class MedicalHistoryService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateMedicalHistory(data: CreateMedicalHistoryDto) {
    return this.prisma.$transaction(async (prisma) => {
      // Try to find existing medical history
      const existingHistory = await prisma.medicalHistory.findFirst({
        where: { pacienteId: data.pacienteId },
        include: {
          consultas: true,
          eventosClinicos: true,
        },
      });

      // Prepare the data for creation/update
      const medicalHistoryData = {
        pacienteId: data.pacienteId,
        historiaGeneral: data.historiaGeneral
          ? {
              fechaCreacion: new Date(data.historiaGeneral.fechaCreacion),
              notasGenerales: data.historiaGeneral.notasGenerales,
            }
          : undefined,
      };

      // If existing history, update with new consultas and eventos clinicos
      if (existingHistory) {
        // Combine existing and new consultas
        const updatedConsultas = existingHistory.consultas
          ? [
              ...existingHistory.consultas.map((consulta) => ({
                idConsulta: consulta.idConsulta,
                fechaConsulta: consulta.fechaConsulta,
                motivoConsulta: consulta.motivoConsulta,
                diagnostico: consulta.diagnostico,
                tratamiento: consulta.tratamiento,
                observaciones: consulta.observaciones,
                medicoId: consulta.medicoId,
                examenes: consulta.examenes,
              })),
              ...(data.consultas || []).map((consulta) => ({
                idConsulta: consulta.idConsulta,
                fechaConsulta: new Date(consulta.fechaConsulta),
                motivoConsulta: consulta.motivoConsulta,
                diagnostico: consulta.diagnostico,
                tratamiento: consulta.tratamiento,
                observaciones: consulta.observaciones,
                medicoId: consulta.medicoId,
                examenes: consulta.examenes,
              })),
            ]
          : (data.consultas || []).map((consulta) => ({
              idConsulta: consulta.idConsulta,
              fechaConsulta: new Date(consulta.fechaConsulta),
              motivoConsulta: consulta.motivoConsulta,
              diagnostico: consulta.diagnostico,
              tratamiento: consulta.tratamiento,
              observaciones: consulta.observaciones,
              medicoId: consulta.medicoId,
              examenes: consulta.examenes,
            }));

        // Combine existing and new eventos clinicos
        const updatedEventosClinicos = existingHistory.eventosClinicos
          ? [
              ...existingHistory.eventosClinicos.map((evento) => ({
                tipoEvento: evento.tipoEvento,
                descripcion: evento.descripcion,
                fecha: evento.fecha,
              })),
              ...(data.eventosClinicos || []).map((evento) => ({
                tipoEvento: evento.tipoEvento,
                descripcion: evento.descripcion,
                fecha: new Date(evento.fecha),
              })),
            ]
          : (data.eventosClinicos || []).map((evento) => ({
              tipoEvento: evento.tipoEvento,
              descripcion: evento.descripcion,
              fecha: new Date(evento.fecha),
            }));

        return prisma.medicalHistory.update({
          where: {
            id: existingHistory.id,
          },
          data: {
            ...medicalHistoryData,
            consultas: updatedConsultas,
            eventosClinicos: updatedEventosClinicos,
          },
          include: {
            consultas: true,
            eventosClinicos: true,
          },
        });
      } else {
        // If no existing history, create a new one with the provided data
        return prisma.medicalHistory.create({
          data: {
            ...medicalHistoryData,
            consultas: data.consultas
              ? data.consultas.map((consulta) => ({
                  idConsulta: consulta.idConsulta,
                  fechaConsulta: new Date(consulta.fechaConsulta),
                  motivoConsulta: consulta.motivoConsulta,
                  diagnostico: consulta.diagnostico,
                  tratamiento: consulta.tratamiento,
                  observaciones: consulta.observaciones,
                  medicoId: consulta.medicoId,
                  examenes: consulta.examenes,
                }))
              : undefined,
            eventosClinicos: data.eventosClinicos
              ? data.eventosClinicos.map((evento) => ({
                  tipoEvento: evento.tipoEvento,
                  descripcion: evento.descripcion,
                  fecha: new Date(evento.fecha),
                }))
              : undefined,
          },
          include: {
            consultas: true,
            eventosClinicos: true,
          },
        });
      }
    });
  }
  async getMedicalHistoryByPatientId(pacienteId: string) {
    return this.prisma.medicalHistory.findFirst({
      where: { pacienteId },
      include: {
        consultas: true,
        eventosClinicos: true,
      },
    });
  }
}
